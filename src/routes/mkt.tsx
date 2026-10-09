import { createFileRoute, notFound } from "@tanstack/react-router";
import { findTavsiya, type Tavsiya } from "@/data/tavsiyalar";
import { TavsiyaView } from "@/components/TavsiyaView";

export const Route = createFileRoute("/mkt")({
  head: () => ({
    meta: [
      { title: "Mathematical Knowledge for Teaching (MKT) — Metodik tavsiya" },
      { name: "description", content: "MKT: matematik mazmunni pedagogik transformatsiya qilish bo'yicha metodik tavsiya." },
    ],
  }),
  loader: () => {
    const tavsiya = findTavsiya("mkt");
    if (!tavsiya) throw notFound();
    return { tavsiya };
  },
  component: () => {
    const { tavsiya } = Route.useLoaderData() as { tavsiya: Tavsiya };
    return <TavsiyaView tavsiya={tavsiya} />;
  },
  errorComponent: ((props: { error: unknown }) => <div className="p-8">Xatolik: {String((props.error as Error)?.message ?? props.error)}</div>) as never,
  notFoundComponent: () => <div className="p-8">Tavsiya topilmadi.</div>,
});
