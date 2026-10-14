import { createFileRoute, redirect } from "@tanstack/react-router";

// Sahifa bosh sahifaga birlashtirildi; eski havolalar yangi bo'limga olib boradi.
export const Route = createFileRoute("/elektron-talim-resursi")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
