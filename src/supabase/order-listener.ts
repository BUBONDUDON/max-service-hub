import type { SupabaseClient } from "@supabase/supabase-js";
import { Bot } from "@maxhub/max-bot-api";
import { BaseRealtimeListener } from "./base-realtime-listener";
import { time } from "console";

interface OrderInsertPayload {
  id: number;
  customer_id: number;
  performer_id: string;
  service_id: number;
  slot_id: number;
  status: string;
}

interface OrderUpdatePayload extends OrderInsertPayload {}

export class OrderRealtimeListener extends BaseRealtimeListener<
  OrderInsertPayload,
  OrderUpdatePayload
> {
  constructor(client: SupabaseClient, maxBot: Bot) {
    super(client, maxBot, "bookings");
  }

  protected async onInsert(newOrder: OrderInsertPayload): Promise<void> {
    if (newOrder.status !== "confirmed" || !newOrder.customer_id) return;
    const { data: userData, error: errorData } = await this.client
      .from("profiles")
      .select("id")
      .eq("id", newOrder.customer_id)
      .single();
    const user_id = userData?.id;
    if (errorData) {
      console.error(
        `[OrderListener] Ошибка при получении профиля пользователя ${newOrder.customer_id}:`,
        errorData
      );
    }
    const { data: serviceData, error: errorService } = await this.client
      .from("services")
      .select("price, id, name")
      .eq("id", newOrder.service_id)
      .single();
    const service = serviceData;
    if (errorService) {
      console.error(
        `[OrderListener] Ошибка при получении услуги ${newOrder.service_id}:`,
        errorService
      );
    }
    const { data: timeData, error: timeError } = await this.client
      .from("time_slots")
      .select("start_time, end_time")
      .eq("id", newOrder.slot_id)
      .single();
    const timeSlot = timeData;
    const start = new Date(timeSlot!.start_time);
    const end = new Date(timeSlot!.end_time);
    const date = start.toISOString().split("T")[0];
    const start_time = start.toTimeString().slice(0, 5);
    const end_time = end.toTimeString().slice(0, 5);
    const msg = await this.maxBot.api.sendMessageToUser(
      user_id,
      `✅ <b>Предварительные данные заказа записи вокала</b>\n\n` +
        `🆔 <b>Код заказа:</b> <code>${newOrder.id}</code>\n` +
        `👀 <b>Название:</b> ${service?.name}\n` +
        `💰 <b>Стоимость:</b> ${service?.price}₽\n` +
        `📅 <b>Дата:</b> ${date}\n` +
        `👉 <b>Начало:</b> ${start_time} <b>Конец:</b> ${end_time}\n` +
        `📖 <b>Статус:</b> ${
          newOrder.status === "confirmed" ? "Подтвержден" : "Не подтвержден"
        }\n`,
      {
        format: "html",
        attachments: [
          {
            type: "inline_keyboard",
            payload: {
              buttons: [
                [
                  {
                    type: "callback",
                    payload: `delete_order_${newOrder.id}`,
                    text: "❌Отказаться от записи",
                  },
                ],
              ],
            },
          },
        ],
      }
    );
    await this.client
      .from("max_msg_context")
      .insert({ msg_id: msg.body.mid, book_id: newOrder.id });
  }
  protected async onUpdate(newOrder: OrderUpdatePayload): Promise<void> {
    if (newOrder.status !== "confirmed" || !newOrder.customer_id) return;
  }
}
