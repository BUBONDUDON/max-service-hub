import { supabase } from "../lib/createClient";

/**
 * Создаёт запись в таблице bookings
 * @param {Object} bookingData
 * @param {string} bookingData.customer_id
 * @param {string} bookingData.performer_id
 * @param {number} bookingData.service_id
 * @param {number} bookingData.slot_id
 */
export async function createBooking(bookingData) {
  console.log(
    "[Booking] customer_id:",
    bookingData.customer_id,
    "| тип:",
    typeof bookingData.customer_id
  );
  console.log(
    "[Booking] performer_id:",
    bookingData.performer_id,
    "| тип:",
    typeof bookingData.performer_id
  );
  console.log(
    "[Booking] service_id:",
    bookingData.service_id,
    "| тип:",
    typeof bookingData.service_id
  );
  console.log(
    "[Booking] slot_id:",
    bookingData.slot_id,
    "| тип:",
    typeof bookingData.slot_id
  );

  const { error } = await supabase.from("bookings").insert(bookingData);

  if (error) {
    console.error("[Booking] Полная ошибка:", JSON.stringify(error, null, 2));
    throw new Error(error.message || "Не удалось создать запись");
  }
}
