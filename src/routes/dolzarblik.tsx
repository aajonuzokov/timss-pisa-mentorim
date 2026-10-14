import { createFileRoute, redirect } from "@tanstack/react-router";

// Sahifa bosh sahifaga birlashtirildi; eski havolalar yangi bo'limga olib boradi.
export const Route = createFileRoute("/dolzarblik")({
  beforeLoad: () => {
    throw redirect({ to: "/", hash: "dolzarblik" });
  },
});
