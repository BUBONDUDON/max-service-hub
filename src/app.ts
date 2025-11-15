import { Bot } from "@maxhub/max-bot-api";
import dotenv from "dotenv";
import path from "path";
import { SupabaseService } from "./supabase/supabase.service";
import { ConfigService } from "./config/config.service";
import { IConfigService } from "./config/config.interface";
import { OrderRealtimeListener } from "./supabase/order-listener";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

class MaxBot {
  bot: Bot;
  constructor(private readonly configService: IConfigService, token: string) {
    this.bot = new Bot(token);
    const supabase = new SupabaseService(this.configService);
    const OrderListener = new OrderRealtimeListener(
      supabase.getClient(),
      this.bot
    );
    OrderListener.subscribe();
    this.bot.api.setMyCommands([
      {
        name: "hello",
        description: "Поприветствовать бота",
      },
    ]);

    // Обработчик команды '/hello'
    this.bot.command("hello", (ctx) => {
      return ctx.reply("Привет! ✨");
    });
    this.bot.action(/delete_order_(\d+)/, async (ctx) => {
      const orderId = ctx.match![1];
      const { data: slot_id } = await supabase
        .getClient()
        .from("bookings")
        .select("slot_id")
        .eq("id", orderId)
        .single();
      await supabase
        .getClient()
        .from("time_slots")
        .update({ is_available: true })
        .eq("id", slot_id);
      await ctx.editMessage({
        text: "Заказ отменён пользователем.",
        attachments: [],
      });
      await supabase.getClient().from("bookings").delete().eq("id", orderId);
    });
  }
  init() {
    this.bot.start();
  }
}
const bot = new MaxBot(new ConfigService(), process.env.TOKEN!);
bot.init();
