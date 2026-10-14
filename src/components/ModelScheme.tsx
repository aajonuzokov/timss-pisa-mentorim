import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowDown, ArrowRight, RefreshCw } from "lucide-react";
import {
  BLOCKS,
  DIGITAL_ENV,
  EXPECTED_RESULTS,
  EXTERNAL_FACTORS,
  INNER_RESULT,
  MECHANISM,
  MODEL_GOAL,
  type BlockSlug,
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

const APPROACHES = [
  ["Tizimli", "Tayyorgarlikni yaxlit tizim sifatida qarash va boshqarish"],
  ["Kompetensiyaviy", "Natijani kompetensiyalar orqali aniqlash va baholash"],
  ["Integrativ", "TIMSS, PISA va MKT uyg'un integratsiyasi"],
  ["Adaptiv", "Individuallashtirish va moslashtirish"],
  ["Refleksiv", "O'z-o'zini tahlil qilish, baholash va takomillashtirish"],
];

const TECH = [
  "TIMSS/PISA tipidagi topshiriqlar",
  "Muammoli o'qitish",
  "Matematik modellashtirish",
  "Case-study",
  "Loyiha metodi",
  "Lesson Study",
  "Microteaching",
  "Raqamli vositalar (Mentorim)",
];

const RESULTS = [
  "Matematik bilim rivojlangan",
  "Matematik tafakkur rivojlangan",
  "Matematik savodxonlik oshgan",
  "Matematik-metodik kompetentlik shakllangan",
  "Refleksiv faoliyat rivojlangan",
];

const Chip = ({ children, tone = "" }: { children: ReactNode; tone?: string }) => (
  <div className={`rounded-lg border bg-background px-3 py-2 text-xs leading-snug ${tone}`}>
    {children}
  </div>
);

const Side = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="rounded-xl border border-dashed bg-background/60 p-3 text-xs">
    <div className="font-semibold text-primary mb-1.5 uppercase tracking-wide text-[11px]">
      {title}
    </div>
    {children}
  </div>
);

function Venn() {
  return (
    <svg
      viewBox="0 0 200 150"
      className="w-full max-w-[200px] mx-auto"
      role="img"
      aria-label="TIMSS, PISA va MKT integratsiyasi"
    >
      <circle
        cx="100"
        cy="55"
        r="42"
        fill="var(--primary)"
        fillOpacity="0.15"
        stroke="var(--primary)"
      />
      <circle cx="72" cy="98" r="42" fill="#10b981" fillOpacity="0.15" stroke="#10b981" />
      <circle cx="128" cy="98" r="42" fill="#f59e0b" fillOpacity="0.15" stroke="#f59e0b" />
      <text x="100" y="42" textAnchor="middle" fontSize="12" fontWeight="600" fill="currentColor">
        TIMSS
      </text>
      <text x="58" y="112" textAnchor="middle" fontSize="12" fontWeight="600" fill="currentColor">
        PISA
      </text>
      <text x="142" y="112" textAnchor="middle" fontSize="12" fontWeight="600" fill="currentColor">
        MKT
      </text>
    </svg>
  );
}

const centre: Record<BlockSlug, ReactNode> = {
  maqsadli: (
    <div className="rounded-xl border bg-primary/5 p-4 text-center">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-primary mb-1">
        Maqsad
      </div>
      <p className="text-sm font-medium">{MODEL_GOAL}</p>
    </div>
  ),
  metodologik: (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
      {APPROACHES.map(([n, d]) => (
        <Chip key={n}>
          <div className="font-semibold">{n} yondashuv</div>
          <div className="text-muted-foreground mt-0.5">{d}</div>
        </Chip>
      ))}
    </div>
  ),
  mazmuniy: (
    <div className="grid gap-2">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {COMPONENTS.map((c, i) => (
          <Chip key={c.key}>
            <span className="font-semibold">
              {i + 1}.{" "}
              {c.label
                .replace(" va qo'llash", "")
                .replace(" va modellashtirish", "")
                .replace(" (MKT)", "")}
            </span>
          </Chip>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-2 text-xs">
        <Chip>
          <div className="font-semibold">TIMSS</div>
          Knowing · Applying · Reasoning
        </Chip>
        <Chip>
          <div className="font-semibold">PISA</div>
          Formulate · Employ · Interpret
        </Chip>
      </div>
    </div>
  ),
  texnologik: (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {TECH.map((t) => (
        <Chip key={t}>{t}</Chip>
      ))}
    </div>
  ),
  diagnostik: (
    <div className="flex flex-wrap items-center gap-1.5">
      {MECHANISM.map((m, i) => (
        <span key={m.name} className="inline-flex items-center gap-1.5">
          <AppLink
            to={m.to}
            className="rounded-lg border bg-background px-2.5 py-1.5 text-xs font-medium hover:border-primary"
          >
            {m.name}
          </AppLink>
          {i < MECHANISM.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />}
        </span>
      ))}
    </div>
  ),
  natijaviy: (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
      {RESULTS.map((r) => (
        <Chip key={r} tone="border-emerald-500/30 bg-emerald-500/5">
          {r}
        </Chip>
      ))}
    </div>
  ),
};

const side: Partial<Record<BlockSlug, ReactNode>> = {
  maqsadli: (
    <Side title="Kutilayotgan natija">
      <ul className="list-disc pl-4 space-y-0.5">
        {EXPECTED_RESULTS.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </Side>
  ),
  metodologik: (
    <Side title="Tashqi omillar">
      <ul className="list-disc pl-4 space-y-0.5">
        {EXTERNAL_FACTORS.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </Side>
  ),
  mazmuniy: (
    <Side title="Integratsiya asosi">
      <Venn />
      <div className="text-center font-semibold mt-1">
        Yagona maqsad — matematik tayyorgarlikni rivojlantirish
      </div>
    </Side>
  ),
  texnologik: (
    <Side title="Adaptiv halqa">
      <div className="flex gap-2">
        <RefreshCw className="w-4 h-4 text-primary shrink-0" />
        <span>
          Diagnostik-monitoring natijalari mazmuniy va texnologik bloklarga qaytadi: individual yo'l
          qayta tuziladi (korreksiya).
        </span>
      </div>
    </Side>
  ),
  diagnostik: (
    <Side title="Raqamli ta'lim muhiti">
      <ul className="space-y-0.5">
        {DIGITAL_ENV.map((d) => (
          <li key={d.label}>
            <AppLink to={d.to} className="hover:text-primary hover:underline">
              {d.label}
            </AppLink>
          </li>
        ))}
      </ul>
    </Side>
  ),
  natijaviy: (
    <Side title="Ichki natija">
      <p className="font-medium">{INNER_RESULT}</p>
    </Side>
  ),
};

/** 2.1-rasm: modelning interaktiv sxemasi. Har bir blok nomi o'z sahifasiga olib boradi. */
export function ModelScheme() {
  return (
    <div className="space-y-2">
      {BLOCKS.map((b, i) => (
        <div key={b.slug}>
          <div className="grid gap-3 lg:grid-cols-[150px_minmax(0,1fr)_240px] items-stretch">
            <AppLink
              to={`/model/${b.slug}`}
              className="flex items-center justify-center rounded-xl bg-primary px-3 py-3 text-center text-sm font-bold uppercase leading-tight text-primary-foreground hover:opacity-90"
            >
              {b.label}
            </AppLink>
            <div className="rounded-xl border bg-card p-3 shadow-card">
              {centre[b.slug]}
              <div className="mt-2 text-right">
                <AppLink
                  to={`/model/${b.slug}`}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Batafsil →
                </AppLink>
              </div>
            </div>
            <div>{side[b.slug]}</div>
          </div>
          {i < BLOCKS.length - 1 && (
            <div className="flex lg:pl-[150px] lg:pr-[240px] justify-center py-1 text-muted-foreground">
              <ArrowDown className="w-4 h-4" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
