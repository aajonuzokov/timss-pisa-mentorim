import { db, type ResultRow } from "@/lib/db";

/** Natija ID si brauzerda yaratiladi: refleksiya va portfolio shu ID ga bog'lanadi. */
export const newResultId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
        (Number(c) ^ (Math.floor(Math.random() * 256) & (15 >> (Number(c) / 4)))).toString(16),
      );

/**
 * Natijani saqlash. Qayta yuborishda "takroriy kalit" xatosi (23505) natija avval saqlanganini
 * bildiradi — bu muvaffaqiyat deb olinadi, shuning uchun bir natija ikki marta yozilmaydi.
 */
export const saveResult = async (row: ResultRow) => {
  const { error } = await db.from("test_results").insert(row);
  if (error && error.code === "23505") return { error: null };
  return { error };
};
