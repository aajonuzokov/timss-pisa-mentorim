import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import {
  APPROACHES,
  BLOCKS,
  CONDITIONS,
  CRITERIA,
  DIAG_TOOLS,
  DIGITAL_TOOLS,
  FORMS,
  INTEGRATION,
  MECHANISM,
  METHODS,
  MODEL_GOAL,
  MODEL_RESULT,
  MODEL_TASKS,
  PRINCIPLES,
  SOCIAL_ORDER,
  STAGES,
  TRAJECTORY,
  type BlockSlug,
  type PlatformLink,
} from "@/data/model";
import { COMPONENTS } from "@/lib/components";

/** Typed router uchun satrdagi manzil. */
export const AppLink = ({
  to,
  className,
  children,
}: {
  to: string;
  className?: string;
  children: ReactNode;
}) => (
  <Link to={to as "/"} className={className}>
    {children}
  </Link>
);

const Box = ({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) => (
  <div className={`rounded-lg border bg-background px-3 py-2 text-xs leading-snug ${className}`}>
    {title && (
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
        {title}
      </div>
    )}
    {children}
  </div>
);

const Links = ({ items }: { items: PlatformLink[] }) => (
  <span>
    {items.map((l, i) => (
      <span key={l.label}>
        {i > 0 && " · "}
        <AppLink to={l.to} className="hover:text-primary hover:underline">
          {l.label}
        </AppLink>
      </span>
    ))}
  </span>
);

const shortLabel = (s: string) =>
  s.replace(" va qo'llash", "").replace(" va modellashtirish", "").replace(" (MKT)", "");

const centre: Record<BlockSlug, ReactNode> = {
  maqsadli: (
    <div className="grid gap-2">
      <Box className="bg-primary/5 text-center">
        <span className="font-semibold uppercase">Maqsad: </span>
        {MODEL_GOAL}
      </Box>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {MODEL_TASKS.map((t) => (
          <Box key={t.name}>
            <span className="font-semibold">{t.name}. </span>
            {t.text}
          </Box>
        ))}
      </div>
    </div>
  ),
  metodologik: (
    <div className="grid gap-2 md:grid-cols-[1fr_1fr_1.4fr]">
      <Box title="Yondashuvlar">{APPROACHES.map(([n]) => n.toLowerCase()).join(" · ")}</Box>
      <Box title="Tamoyillar">{PRINCIPLES.join(" · ")}</Box>
      <Box title="Integratsiya asosi">
        <ul className="space-y-0.5">
          {INTEGRATION.map((r) => (
            <li key={r.name}>
              <b>{r.name}</b> ({r.process}) → <i>{r.target}</i>
            </li>
          ))}
        </ul>
      </Box>
    </div>
  ),
  mazmuniy: (
    <div className="grid gap-2">
      <div className="text-center text-[11px] font-semibold uppercase tracking-wide text-primary">
        Matematik tayyorgarlik komponentlari
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {COMPONENTS.map((c, i) => (
          <AppLink
            key={c.key}
            to={`/modullar/${c.key}`}
            className="rounded-lg border bg-background px-3 py-2 text-center text-xs font-medium hover:border-primary"
          >
            {i + 1}. {shortLabel(c.label)}
          </AppLink>
        ))}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <AppLink
          to="/modullar"
          className="rounded-lg border bg-primary/5 px-3 py-2 text-center text-xs font-medium hover:border-primary"
        >
          "Boshlang'ich sinfda xalqaro baholash metodikasi" variativ moduli
        </AppLink>
        <AppLink
          to="/timss"
          className="rounded-lg border bg-primary/5 px-3 py-2 text-center text-xs font-medium hover:border-primary"
        >
          TIMSS va PISA yondashuvlariga asoslangan kompetensiyaviy topshiriqlar banki (darajalar
          bo'yicha tabaqalashtirilgan)
        </AppLink>
      </div>
    </div>
  ),
  texnologik: (
    <div className="grid gap-2">
      <div className="grid gap-2 md:grid-cols-3">
        <Box title="Shakllar">{FORMS.join(" · ")}</Box>
        <Box title="Metod va texnologiyalar">
          <Links items={METHODS} />
        </Box>
        <Box title="Vositalar">
          <Links items={DIGITAL_TOOLS} />
        </Box>
      </div>
      <div className="grid items-stretch gap-2 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        {STAGES.map((st, i) => (
          <div key={st.name} className="contents">
            <Box>
              <span className="font-semibold">
                {i + 1}-bosqich. {st.name}:{" "}
              </span>
              {st.text}
            </Box>
            {i < STAGES.length - 1 && (
              <ArrowRight className="hidden w-4 h-4 self-center text-muted-foreground md:block" />
            )}
          </div>
        ))}
      </div>
    </div>
  ),
  diagnostik: (
    <div className="grid gap-2">
      <div className="overflow-x-auto rounded-lg border bg-background">
        <table className="w-full text-xs">
          <thead className="bg-muted">
            <tr className="text-left">
              <th className="px-2 py-1.5">Komponent</th>
              <th className="px-2 py-1.5">Mezon</th>
              <th className="px-2 py-1.5">Ko'rsatkichlar</th>
            </tr>
          </thead>
          <tbody>
            {CRITERIA.map((c) => (
              <tr key={c.component} className="border-t align-top">
                <td className="px-2 py-1.5 font-medium whitespace-nowrap">{c.component}</td>
                <td className="px-2 py-1.5">{c.criterion}</td>
                <td className="px-2 py-1.5">{c.indicators}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-2 md:grid-cols-[1.6fr_1fr]">
        <Box title="Darajalar va adaptiv trayektoriya">
          {TRAJECTORY.map((t, i) => (
            <span key={t.level}>
              {i > 0 && "; "}
              <b>{t.level}</b> → {t.tasks}
            </span>
          ))}
        </Box>
        <Box title="Vositalar">
          <Links items={DIAG_TOOLS} />
        </Box>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="font-semibold">Ishlash mexanizmi:</span>
        {MECHANISM.map((m, i) => (
          <span key={m.name} className="inline-flex items-center gap-1.5">
            <AppLink
              to={m.to}
              className="rounded-md border bg-background px-2 py-1 font-medium hover:border-primary"
            >
              {m.name}
            </AppLink>
            {i < MECHANISM.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
          </span>
        ))}
      </div>
    </div>
  ),
  natijaviy: (
    <Box className="border-emerald-500/40 bg-emerald-500/5 text-center text-sm">
      <span className="font-semibold uppercase">Natija: </span>
      {MODEL_RESULT}
    </Box>
  ),
};

const Label = ({ to, title, sub }: { to: string; title: string; sub?: string }) => (
  <AppLink
    to={to}
    className="flex flex-col items-center justify-center rounded-xl bg-primary px-2 py-3 text-center text-primary-foreground hover:opacity-90"
  >
    <span className="text-xs font-bold uppercase leading-tight">{title}</span>
    {sub && <span className="mt-1 text-[10px] opacity-80">{sub}</span>}
  </AppLink>
);

const Down = () => (
  <div className="flex justify-center py-1 text-muted-foreground lg:pl-[140px]">
    <ArrowDown className="w-4 h-4" />
  </div>
);

function Conditions() {
  return (
    <div className="relative h-full rounded-xl border bg-primary/5 p-3 pr-8 text-xs">
      <div className="mb-2 text-center text-[11px] font-semibold uppercase tracking-wide text-primary">
        Pedagogik shart-sharoitlar
      </div>
      <ol className="list-decimal space-y-2 pl-4">
        {CONDITIONS.map((c) => (
          <li key={c.text}>
            {c.text}{" "}
            {c.slug ? (
              <AppLink
                to={`/model/${c.slug}`}
                className="font-semibold text-primary hover:underline"
              >
                [{c.block}]
              </AppLink>
            ) : (
              <span className="font-semibold text-primary">[{c.block}]</span>
            )}
          </li>
        ))}
      </ol>
      <div
        className="absolute inset-y-3 right-2 flex w-4 items-center justify-center border-r-2 border-dashed border-primary/60"
        aria-hidden
      >
        <span className="-rotate-90 whitespace-nowrap text-[10px] font-semibold uppercase tracking-wider text-primary">
          Adaptiv korreksiya
        </span>
      </div>
    </div>
  );
}

/**
 * Avtoreferatning 1-rasmi: modelning interaktiv sxemasi. Ijtimoiy buyurtma → 6 blok; o'ngda
 * pedagogik shart-sharoitlar va diagnostik-monitoring blokidan qaytuvchi adaptiv korreksiya.
 */
export function ModelScheme() {
  return (
    <div className="grid gap-x-3 lg:grid-cols-[minmax(0,1fr)_250px]">
      <div className="lg:col-start-1">
        <div className="grid gap-3 lg:grid-cols-[130px_minmax(0,1fr)]">
          <div className="flex items-center justify-center rounded-xl border-2 border-primary px-2 py-3 text-center text-xs font-bold uppercase text-primary">
            Ijtimoiy buyurtma
          </div>
          <div className="grid gap-2 rounded-xl border bg-card p-3 shadow-card sm:grid-cols-3">
            {SOCIAL_ORDER.map((s) => (
              <Box key={s.name}>
                <span className="font-semibold">{s.name}: </span>
                {s.text}
              </Box>
            ))}
          </div>
        </div>
        <Down />
      </div>
      {BLOCKS.map((b, i) => (
        <div key={b.slug} className="lg:col-start-1">
          <div className="grid gap-3 lg:grid-cols-[130px_minmax(0,1fr)]">
            <Label to={`/model/${b.slug}`} title={b.label} sub={b.func} />
            <div className="rounded-xl border bg-card p-3 shadow-card">{centre[b.slug]}</div>
          </div>
          {i < BLOCKS.length - 1 && <Down />}
        </div>
      ))}
      <div className="mt-4 lg:col-start-2 lg:row-start-4 lg:row-end-7 lg:mt-0 lg:pb-7">
        <Conditions />
      </div>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground lg:col-span-2">
        <span>↓ — asosiy jarayon yo'nalishi (to'g'ri aloqa)</span>
        <span>
          ┆ — teskari aloqa: diagnostika natijasiga ko'ra mazmun va texnologiyani moslashtirish
        </span>
        <span>[ ] — shart-sharoit ta'sir ko'rsatadigan blok</span>
        <span>Blok nomini bosing — uning sahifasi ochiladi.</span>
      </div>
    </div>
  );
}
