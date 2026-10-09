import { createFileRoute, notFound } from "@tanstack/react-router";
import { findTavsiya, type Tavsiya } from "@/data/tavsiyalar";
import { TavsiyaView } from "@/components/TavsiyaView";

export const Route = createFileRoute("/assessment")({
  head: () => ({
    meta: [
      { title: "Diagnostika va baholash — Metodik tavsiya" },
      { name: "description", content: "Diagnostik testlar, TIMSS/PISA topshiriqlari, baholash mezonlari va e-portfolio metodikasi." },
    ],
  }),
  loader: () => {
    const tavsiya = findTavsiya("diagnostika");
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
