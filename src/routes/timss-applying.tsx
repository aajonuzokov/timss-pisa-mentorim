import { createFileRoute, notFound } from "@tanstack/react-router";
import { findTavsiya, type Tavsiya } from "@/data/tavsiyalar";
import { TavsiyaView } from "@/components/TavsiyaView";

export const Route = createFileRoute("/timss-applying")({
  head: () => ({
    meta: [
      { title: "Applying kompetensiyasi — TIMSS metodikasi" },
      { name: "description", content: "TIMSS Applying kompetensiyasi bo'yicha metodik tavsiya." },
    ],
  }),
  loader: () => {
    const tavsiya = findTavsiya("applying");
    if (!tavsiya) throw notFound();
    return { tavsiya };
  },
  component: () => {
    const { tavsiya } = Route.useLoaderData() as { tavsiya: Tavsiya };
    return <TavsiyaView tavsiya={tavsiya} />;
  },
});
