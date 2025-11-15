import { Bot } from "@maxhub/max-bot-api";
import type { SupabaseClient, RealtimeChannel } from "@supabase/supabase-js";

export abstract class BaseRealtimeListener<TInsertPayload, TUpdatePayload> {
  private channel: RealtimeChannel | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private isSubscribed = false;

  constructor(
    protected readonly client: SupabaseClient,
    protected readonly maxBot: Bot,
    private readonly tableName: string
  ) {}

  protected abstract onInsert(payload: TInsertPayload): Promise<void>;
  protected abstract onUpdate(payload: TUpdatePayload): Promise<void>;

  public subscribe(): void {
    if (this.isSubscribed) {
      console.log(
        `⚠️ ${this.tableName} уже подписан — пропуск повторного вызова`
      );
      return;
    }

    this.cleanup();

    const channel = this.client.channel(`${this.tableName}-realtime`);

    // INSERT
    channel.on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: this.tableName },
      async (payload) => {
        console.log(`🆕 INSERT in ${this.tableName}`, payload.new);
        try {
          await this.onInsert(payload.new as TInsertPayload);
        } catch (err) {
          console.error(`[${this.tableName}] INSERT handler error:`, err);
        }
      }
    );

    // UPDATE
    channel.on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: this.tableName },
      async (payload) => {
        console.log(`♻️ UPDATE in ${this.tableName}`, payload.new);
        try {
          await this.onUpdate(payload.new as TUpdatePayload);
        } catch (err) {
          console.error(`[${this.tableName}] UPDATE handler error:`, err);
        }
      }
    );

    // Подписка
    channel.subscribe(async (status) => {
      console.log(`📡 ${this.tableName} channel status:`, status);

      if (status === "SUBSCRIBED") {
        this.isSubscribed = true;
        this.reconnectAttempts = 0;
        console.log(`✅ Подписка активна для ${this.tableName}`);
      }

      if (["CHANNEL_ERROR", "CLOSED", "TIMED_OUT"].includes(status)) {
        this.isSubscribed = false;
        await this.handleReconnect();
      }
    });

    this.channel = channel;
    this.startHeartbeat();
  }

  private async handleReconnect(): Promise<void> {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);

    const delay = Math.min(30_000, 2000 * 2 ** this.reconnectAttempts);
    console.warn(
      `🔁 Переподключение к ${this.tableName} через ${
        delay / 1000
      } сек... (попытка ${this.reconnectAttempts + 1})`
    );

    this.reconnectAttempts++;
    this.reconnectTimeout = setTimeout(() => {
      this.subscribe();
    }, delay);
  }

  private startHeartbeat(): void {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);

    this.heartbeatInterval = setInterval(async () => {
      try {
        await this.client.from(this.tableName).select("id").limit(1);
        console.log(`💓 Heartbeat OK for ${this.tableName}`);
      } catch (err) {
        console.warn(
          `[${this.tableName}] Heartbeat failed — перезапуск подписки`
        );
        this.isSubscribed = false;
        this.subscribe();
      }
    }, 20_000);
  }

  public unsubscribe(): void {
    this.cleanup();
    console.log(`❌ Подписка снята с ${this.tableName}`);
  }

  private cleanup(): void {
    if (this.channel) {
      try {
        this.client.removeChannel(this.channel);
      } catch {
        console.warn(`⚠️ removeChannel error for ${this.tableName}`);
      }
      this.channel = null;
    }
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    this.isSubscribed = false;
  }
}
