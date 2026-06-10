import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/SiteLayout";
import { FileText, Download, Upload } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/qollanma")({
  head: () => ({
    meta: [
      { title: "O'quv qo'llanma — TIMSS/PISA Platformasi" },
      { name: "description", content: "Metodik qo'llanmalar va o'quv materiallarini yuklash va yuklab olish." },
    ],
  }),
  component: Page,
});

const guides = [
  { name: "TIMSS metodik qo'llanma.pdf", size: "2.4 MB" },
  { name: "PISA topshiriqlari to'plami.pdf", size: "3.1 MB" },
  { name: "Boshlang'ich matematika metodikasi.pdf", size: "4.7 MB" },
];

function Page() {
  const [files, setFiles] = useState<{ name: string; size: string }[]>([]);

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFiles((prev) => [...prev, { name: f.name, size: `${(f.size / 1024 / 1024).toFixed(1)} MB` }]);
  };

  return (
    <SiteLayout>
      <PageHeader eyebrow="Resurslar" title="O'quv qo'llanma" description="Metodik qo'llanmalarni yuklab oling yoki o'z materialingizni yuklang." />
      <section className="max-w-4xl mx-auto px-6 py-16 space-y-10">
        <div>
          <h2 className="text-2xl font-semibold mb-5">Yuklab olish</h2>
          <div className="space-y-3">
            {guides.map((g, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border bg-card shadow-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center text-primary-foreground">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium">{g.name}</div>
                    <div className="text-xs text-muted-foreground">{g.size}</div>
                  </div>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
                  <Download className="w-4 h-4" /> Yuklab olish
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-5">PDF yuklash</h2>
          <label className="block p-10 rounded-2xl border-2 border-dashed bg-card text-center cursor-pointer hover:border-primary transition">
            <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <div className="font-medium">PDF faylni shu yerga tashlang yoki tanlang</div>
            <div className="text-sm text-muted-foreground mt-1">Maksimal hajmi: 20 MB</div>
            <input type="file" accept="application/pdf" className="hidden" onChange={onUpload} />
          </label>
          {files.length > 0 && (
            <ul className="mt-4 space-y-2">
              {files.map((f, i) => (
                <li key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted text-sm">
                  <span>{f.name}</span>
                  <span className="text-muted-foreground">{f.size}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
