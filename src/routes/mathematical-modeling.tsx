import { createFileRoute, notFound } from "@tanstack/react-router";
import { findTavsiya, type Tavsiya } from "@/data/tavsiyalar";
import { TavsiyaView } from "@/components/TavsiyaView";

export const Route = createFileRoute("/mathematical-modeling")({
  head: () => ({
    meta: [
      { title: "Matematik modellashtirish — Metodik tavsiya" },
      { name: "description", content: "Matematik modellashtirish bosqichlari va real vaziyatlarni matematiklashtirish bo'yicha metodik tavsiya." },
    ],
  }),
  loader: () => {
    const tavsiya = findTavsiya("modellashtirish");
    if (!tavsiya) throw notFound();
    return { tavsiya };
  },
  component: () => {
    const { tavsiya } = Route.useLoaderData() as { tavsiya: Tavsiya };
    return <TavsiyaView tavsiya={tavsiya} />;
  },
  errorComponent: ({ error }: { error: Error }) => <div className="p-8">Xatolik: {error.message}</div>,
  notFoundComponent: () => <div className="p-8">Tavsiya topilmadi.</div>,
});
