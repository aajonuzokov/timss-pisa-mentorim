import fs from "node:fs";
import path from "node:path";

// Seeded RNG for reproducibility
let seed = 42;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};
const ri = (a, b) => Math.floor(rand() * (b - a + 1)) + a;
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const makeOptions = (correct, distractors) => {
  const opts = shuffle([correct, ...distractors]);
  return { options: opts, correctIndex: opts.indexOf(correct) };
};

// ---------------- TIMSS: KNOWING ----------------
const knowingGenerators = [
  // place value
  () => {
    const n = ri(1000, 9999);
    const digits = String(n);
    const pos = ri(0, 3);
    const names = ["minglar", "yuzlar", "o'nlar", "birlar"];
    const v = +digits[pos] * Math.pow(10, 3 - pos);
    const { options, correctIndex } = makeOptions(String(v), [
      String(+digits[pos]),
      String(v * 10),
      String(Math.max(1, v / 10)),
    ]);
    return {
      q: `${n} sonida ${names[pos]} xonasidagi raqamning qiymati nechaga teng?`,
      options, correctIndex,
      explain: `${n} sonida ${names[pos]} xonasidagi raqam ${digits[pos]}, uning qiymati ${v}.`,
    };
  },
  // comparison
  () => {
    const nums = Array.from({ length: 4 }, () => ri(1000, 9999));
    const max = Math.max(...nums);
    const { options, correctIndex } = makeOptions(String(max), nums.filter(x => x !== max).map(String).slice(0, 3));
    return {
      q: `Quyidagi sonlardan qaysi biri eng katta?`,
      options, correctIndex,
      explain: `Sonlarni xonalari bo'yicha taqqoslaymiz: eng kattasi ${max}.`,
    };
  },
  // multiplication facts
  () => {
    const a = ri(2, 12), b = ri(2, 12);
    const c = a * b;
    const { options, correctIndex } = makeOptions(String(c), [String(c + a), String(c - b), String(a + b)]);
    return {
      q: `${a} × ${b} = ?`,
      options, correctIndex,
      explain: `${a} ni ${b} marta qo'shamiz yoki ko'paytirish jadvalidan ${a} × ${b} = ${c}.`,
    };
  },
  // division facts
  () => {
    const b = ri(2, 12), q = ri(2, 12);
    const a = b * q;
    const { options, correctIndex } = makeOptions(String(q), [String(q + 1), String(q - 1), String(b)]);
    return {
      q: `${a} : ${b} = ?`,
      options, correctIndex,
      explain: `${b} × ${q} = ${a}, demak ${a} : ${b} = ${q}.`,
    };
  },
  // fraction recognition
  () => {
    const d = pick([2, 3, 4, 5, 6, 8, 10]);
    const n = ri(1, d - 1);
    const decimal = (n / d).toFixed(2);
    const { options, correctIndex } = makeOptions(`${n}/${d}`, [`${d}/${n}`, `${n - 1 || 1}/${d}`, `${n}/${d + 1}`]);
    return {
      q: `${decimal} o'nlik kasrga eng yaqin oddiy kasr qaysi?`,
      options, correctIndex,
      explain: `${n}/${d} = ${decimal}.`,
    };
  },
  // shape recognition
  () => {
    const shapes = [
      ["3 ta tomoni va 3 ta burchagi bor", "Uchburchak", ["Kvadrat", "Beshburchak", "Aylana"]],
      ["4 ta teng tomoni va 4 ta to'g'ri burchagi bor", "Kvadrat", ["To'g'ri to'rtburchak", "Romb", "Trapetsiya"]],
      ["Qarama-qarshi tomonlari teng va parallel, burchaklari to'g'ri", "To'g'ri to'rtburchak", ["Kvadrat", "Parallelogramm", "Trapetsiya"]],
      ["5 ta tomoni bor ko'pburchak", "Beshburchak", ["Olti burchak", "To'rtburchak", "Uchburchak"]],
      ["6 ta tomoni bor ko'pburchak", "Olti burchak", ["Beshburchak", "Sakkiz burchak", "Uchburchak"]],
    ];
    const [desc, ans, dist] = pick(shapes);
    const { options, correctIndex } = makeOptions(ans, dist);
    return {
      q: `${desc} bo'lgan geometrik shakl qaysi?`,
      options, correctIndex,
      explain: `${desc} – bu ${ans}.`,
    };
  },
  // unit conversion knowledge
  () => {
    const conv = [
      ["1 metr necha santimetr?", "100 sm", ["10 sm", "1000 sm", "60 sm"]],
      ["1 kilometr necha metr?", "1000 m", ["100 m", "10 000 m", "60 m"]],
      ["1 kilogramm necha gramm?", "1000 g", ["100 g", "10 g", "10 000 g"]],
      ["1 soat necha daqiqa?", "60 daqiqa", ["100 daqiqa", "24 daqiqa", "360 daqiqa"]],
      ["1 daqiqa necha soniya?", "60 soniya", ["100 soniya", "24 soniya", "1000 soniya"]],
      ["1 sutka necha soat?", "24 soat", ["12 soat", "60 soat", "100 soat"]],
      ["1 litr necha millilitr?", "1000 ml", ["100 ml", "10 ml", "60 ml"]],
    ];
    const [q, ans, dist] = pick(conv);
    const { options, correctIndex } = makeOptions(ans, dist);
    return { q, options, correctIndex, explain: `O'lchov birliklari jadvali: ${q.replace('?','')} ${ans}.` };
  },
  // even/odd, divisibility
  () => {
    const n = ri(10, 999);
    const isEven = n % 2 === 0;
    const { options, correctIndex } = makeOptions(isEven ? "Juft" : "Toq", ["Tub son", "Murakkab son", isEven ? "Toq" : "Juft"].slice(0, 3));
    return {
      q: `${n} soni qanday son?`,
      options, correctIndex,
      explain: `${n} ning oxirgi raqami ${n % 10}, demak son ${isEven ? "juft" : "toq"}.`,
    };
  },
  // rounding
  () => {
    const n = ri(100, 9999);
    const rounded = Math.round(n / 100) * 100;
    const { options, correctIndex } = makeOptions(String(rounded), [String(rounded + 100), String(rounded - 100), String(Math.round(n / 10) * 10)]);
    return {
      q: `${n} sonini eng yaqin yuzlikkacha yaxlitlang.`,
      options, correctIndex,
      explain: `O'nlar xonasiga qarab: ${n % 100 >= 50 ? "yuqoriga" : "pastga"} yaxlitlanadi → ${rounded}.`,
    };
  },
  // time reading
  () => {
    const h = ri(1, 12), m = pick([0, 15, 30, 45]);
    const next = m === 45 ? `${(h % 12) + 1}:00` : `${h}:${String(m + 15).padStart(2, "0")}`;
    const now = `${h}:${String(m).padStart(2, "0")}`;
    const { options, correctIndex } = makeOptions(next, [
      `${h}:${String((m + 30) % 60).padStart(2, "0")}`,
      `${h - 1 || 12}:${String(m).padStart(2, "0")}`,
      `${h}:${String(Math.max(0, m - 15)).padStart(2, "0")}`,
    ]);
    return {
      q: `Soat ${now} ni ko'rsatmoqda. 15 daqiqadan keyin soat qancha bo'ladi?`,
      options, correctIndex,
      explain: `${now} + 0:15 = ${next}.`,
    };
  },
];

// ---------------- TIMSS: APPLYING ----------------
const applyingGenerators = [
  // perimeter rectangle
  () => {
    const a = ri(3, 20), b = ri(3, 20);
    const p = 2 * (a + b);
    const { options, correctIndex } = makeOptions(`${p} sm`, [`${a + b} sm`, `${a * b} sm`, `${p + 2} sm`]);
    return {
      q: `To'g'ri to'rtburchakning tomonlari ${a} sm va ${b} sm. Perimetrini toping.`,
      options, correctIndex,
      explain: `P = 2·(a + b) = 2·(${a} + ${b}) = ${p} sm.`,
    };
  },
  // area rectangle
  () => {
    const a = ri(3, 20), b = ri(3, 20);
    const s = a * b;
    const { options, correctIndex } = makeOptions(`${s} sm²`, [`${2 * (a + b)} sm²`, `${a + b} sm²`, `${s + a} sm²`]);
    return {
      q: `To'g'ri to'rtburchakning tomonlari ${a} sm va ${b} sm. Yuzini toping.`,
      options, correctIndex,
      explain: `S = a·b = ${a}·${b} = ${s} sm².`,
    };
  },
  // word: total
  () => {
    const rows = ri(4, 12), per = ri(4, 15);
    const total = rows * per;
    const { options, correctIndex } = makeOptions(String(total), [String(total + per), String(rows + per), String(total - rows)]);
    return {
      q: `Bog'da ${rows} qatorda har birida ${per} tadan olma daraxti ekilgan. Jami nechta daraxt bor?`,
      options, correctIndex,
      explain: `${rows} × ${per} = ${total} ta daraxt.`,
    };
  },
  // word: division
  () => {
    const groups = ri(3, 9), per = ri(4, 12);
    const total = groups * per;
    const { options, correctIndex } = makeOptions(String(per), [String(groups), String(per + 1), String(total / 2)]);
    return {
      q: `${total} ta daftar ${groups} ta o'quvchiga teng bo'lib taqsimlandi. Har biriga nechtadan tegdi?`,
      options, correctIndex,
      explain: `${total} : ${groups} = ${per}.`,
    };
  },
  // percentage simple
  () => {
    const p = pick([10, 20, 25, 50, 75]);
    const base = pick([200, 400, 500, 800, 1000, 1200]);
    const v = base * p / 100;
    const { options, correctIndex } = makeOptions(String(v), [String(v * 2), String(v / 2), String(base - v)]);
    return {
      q: `${base} ning ${p}% i nechaga teng?`,
      options, correctIndex,
      explain: `${base} · ${p}/100 = ${v}.`,
    };
  },
  // fraction of quantity
  () => {
    const d = pick([2, 3, 4, 5]), n = ri(1, d - 1);
    const base = d * ri(3, 15);
    const v = (base / d) * n;
    const { options, correctIndex } = makeOptions(String(v), [String(base - v), String(base / d), String(v + d)]);
    return {
      q: `${base} ning ${n}/${d} qismini toping.`,
      options, correctIndex,
      explain: `${base} : ${d} = ${base / d}; ${base / d} · ${n} = ${v}.`,
    };
  },
  // money
  () => {
    const price = ri(1, 9) * 1000;
    const count = ri(2, 9);
    const paid = price * count;
    const { options, correctIndex } = makeOptions(`${paid} so'm`, [`${price + count} so'm`, `${price * (count - 1)} so'm`, `${paid + price} so'm`]);
    return {
      q: `Bir daftar ${price} so'm. ${count} ta daftar uchun necha so'm to'lanadi?`,
      options, correctIndex,
      explain: `${price} · ${count} = ${paid} so'm.`,
    };
  },
  // distance/time
  () => {
    const v = pick([40, 50, 60, 80]);
    const t = ri(2, 6);
    const s = v * t;
    const { options, correctIndex } = makeOptions(`${s} km`, [`${v + t} km`, `${v - t} km`, `${s + v} km`]);
    return {
      q: `Avtomobil tezligi ${v} km/soat. ${t} soatda u necha km yo'l bosadi?`,
      options, correctIndex,
      explain: `S = v · t = ${v} · ${t} = ${s} km.`,
    };
  },
  // average
  () => {
    const a = ri(5, 20), b = ri(5, 20), c = ri(5, 20);
    const avg = ((a + b + c) / 3).toFixed(2).replace(/\.00$/, "");
    const { options, correctIndex } = makeOptions(String(avg), [String(a + b + c), String(Math.max(a, b, c)), String(((a + b) / 2).toFixed(1))]);
    return {
      q: `Uchta sonning o'rtachasini toping: ${a}, ${b}, ${c}.`,
      options, correctIndex,
      explain: `(${a} + ${b} + ${c}) : 3 = ${avg}.`,
    };
  },
  // change due
  () => {
    const cost = ri(3, 19) * 1000;
    const paid = Math.ceil(cost / 5000) * 5000 + 5000;
    const change = paid - cost;
    const { options, correctIndex } = makeOptions(`${change} so'm`, [`${paid + cost} so'm`, `${cost - 1000} so'm`, `${change + 1000} so'm`]);
    return {
      q: `Xarid ${cost} so'm. Mijoz ${paid} so'm berdi. Necha so'm qaytim olishi kerak?`,
      options, correctIndex,
      explain: `${paid} − ${cost} = ${change} so'm.`,
    };
  },
];

// ---------------- TIMSS: REASONING ----------------
const reasoningGenerators = [
  // pattern next term
  () => {
    const start = ri(2, 9), step = ri(2, 7);
    const seq = [start, start + step, start + 2 * step, start + 3 * step];
    const next = start + 4 * step;
    const { options, correctIndex } = makeOptions(String(next), [String(next + 1), String(next - step + 1), String(seq[3] + 1)]);
    return {
      q: `Ketma-ketlik berilgan: ${seq.join(", ")}, ... Keyingi son qaysi?`,
      options, correctIndex,
      explain: `Har gal +${step} qo'shilmoqda, demak keyingisi ${seq[3]} + ${step} = ${next}.`,
    };
  },
  // logic / age
  () => {
    const age = ri(7, 15), diff = ri(3, 10);
    const total = 2 * age + diff;
    const { options, correctIndex } = makeOptions(String(age), [String(age + diff), String(total - age), String(age - 1)]);
    return {
      q: `Aka va ukaning yoshlari yig'indisi ${total}. Aka ukasidan ${diff} yosh katta. Ukaning yoshi nechada?`,
      options, correctIndex,
      explain: `Uka = (${total} − ${diff}) : 2 = ${age}.`,
    };
  },
  // square perimeter -> area
  () => {
    const a = ri(2, 12);
    const p = 4 * a;
    const s = a * a;
    const { options, correctIndex } = makeOptions(`${s} sm²`, [`${p} sm²`, `${a + p} sm²`, `${s * 2} sm²`]);
    return {
      q: `Kvadratning perimetri ${p} sm. Uning yuzini toping va asoslang.`,
      options, correctIndex,
      explain: `Tomoni a = ${p} : 4 = ${a} sm. Yuzi S = a² = ${s} sm².`,
    };
  },
  // multi-step word
  () => {
    const total = ri(8, 20), eat1 = ri(2, 4), eat2 = ri(1, 3);
    const totalSlices = total;
    const remaining = totalSlices - eat1 - eat2;
    const pct = Math.round((remaining / totalSlices) * 100);
    const { options, correctIndex } = makeOptions(`${pct}%`, [`${100 - pct}%`, `${remaining * 10}%`, `${pct + 5}%`]);
    return {
      q: `Tort ${totalSlices} ta teng bo'lakka bo'lingan. Anvar ${eat1} bo'lak, Zarina ${eat2} bo'lak yedi. Tortning necha foizi qoldi?`,
      options, correctIndex,
      explain: `Qolgan: ${remaining}/${totalSlices} ≈ ${pct}%.`,
    };
  },
  // odd one out
  () => {
    const base = ri(2, 9);
    const set = [base * 2, base * 3, base * 4, base * 5];
    const odd = base * 5 + 1;
    set[3] = odd;
    const shown = shuffle(set);
    const { options, correctIndex } = makeOptions(String(odd), shown.filter(x => x !== odd).map(String).slice(0, 3));
    return {
      q: `Quyidagi sonlardan qaysi biri ${base} ga bo'linmaydi: ${shown.join(", ")}?`,
      options, correctIndex,
      explain: `${set[0]}, ${set[1]}, ${set[2]} barchasi ${base} ga karrali, ${odd} esa emas.`,
    };
  },
  // sum-based logic
  () => {
    const a = ri(5, 20), b = ri(5, 20);
    const sum = a + b;
    const diff = Math.abs(a - b);
    const bigger = Math.max(a, b);
    const { options, correctIndex } = makeOptions(String(bigger), [String(diff), String(sum), String(bigger - 1)]);
    return {
      q: `Ikki sonning yig'indisi ${sum}, ayirmasi ${diff}. Kattasini toping.`,
      options, correctIndex,
      explain: `Kattasi = (${sum} + ${diff}) : 2 = ${bigger}.`,
    };
  },
  // proportion
  () => {
    const k = ri(2, 6);
    const a = ri(2, 8), c = a * k;
    const b = ri(2, 8), d = b * k;
    const { options, correctIndex } = makeOptions(String(d), [String(d + 1), String(b + k), String(d - 1)]);
    return {
      q: `${a} ta qalam ${c} so'm bo'lsa, ${b} ta xuddi shunday qalam necha so'mga sotiladi? (so'mlarsiz son)`,
      options, correctIndex,
      explain: `1 ta qalam ${c}/${a} = ${k} ga teng. ${b} · ${k} = ${d}.`,
    };
  },
  // analyze chart
  () => {
    const vals = [ri(10, 30), ri(10, 30), ri(10, 30), ri(10, 30)];
    const days = ["Du", "Se", "Ch", "Pa"];
    const max = Math.max(...vals);
    const idx = vals.indexOf(max);
    const { options, correctIndex } = makeOptions(days[idx], days.filter((_, i) => i !== idx).slice(0, 3));
    return {
      q: `Haftalik kitobxonlik: ${days.map((d, i) => `${d}-${vals[i]}`).join(", ")}. Eng ko'p o'qilgan kun qaysi?`,
      options, correctIndex,
      explain: `Eng katta qiymat ${max} – ${days[idx]} kuni.`,
    };
  },
  // probability simple
  () => {
    const red = ri(2, 8), blue = ri(2, 8);
    const total = red + blue;
    const correct = `${red}/${total}`;
    const { options, correctIndex } = makeOptions(correct, [`${blue}/${total}`, `${red}/${blue}`, `${total}/${red}`]);
    return {
      q: `Qutida ${red} ta qizil va ${blue} ta ko'k shar bor. Tasodifan tortilgan shar qizil bo'lish ehtimoli qancha?`,
      options, correctIndex,
      explain: `P(qizil) = qizillar soni / jami = ${red}/${total}.`,
    };
  },
  // equation
  () => {
    const x = ri(3, 15), b = ri(2, 10), c = x + b;
    const { options, correctIndex } = makeOptions(String(x), [String(c), String(b), String(x + 1)]);
    return {
      q: `Tenglamani yeching: x + ${b} = ${c}. x ning qiymatini toping.`,
      options, correctIndex,
      explain: `x = ${c} − ${b} = ${x}.`,
    };
  },
];

// ---------------- PISA: real-life tasks ----------------
const pisaContexts = ["Shaxsiy", "Jamiyat", "Kasbiy", "Ilmiy"];
const pisaGenerators = [
  // discount
  () => {
    const price = pick([50000, 80000, 120000, 150000, 200000, 250000]);
    const d = pick([10, 15, 20, 25, 30]);
    const ans = price - price * d / 100;
    const { options, correctIndex } = makeOptions(`${ans} so'm`, [`${price + price * d / 100} so'm`, `${price - d} so'm`, `${ans + 5000} so'm`]);
    return {
      title: "Do'kondagi chegirma",
      context: "Shaxsiy",
      q: `Krossovka ${price} so'm turadi. Bayramda ${d}% chegirma e'lon qilindi. Chegirmadan keyin narxi qancha bo'ladi?`,
      options, correctIndex,
      explain: `Chegirma summasi: ${price} · ${d/100} = ${price * d / 100}. Yangi narx: ${price} − ${price * d / 100} = ${ans} so'm.`,
    };
  },
  // fuel
  () => {
    const dist = pick([300, 450, 600, 750, 900]);
    const consum = pick([6, 8, 10]);
    const liters = dist * consum / 100;
    const price = pick([8000, 9000, 10000, 12000]);
    const total = liters * price;
    const { options, correctIndex } = makeOptions(`${total} so'm`, [`${liters} so'm`, `${total + 10000} so'm`, `${dist * price} so'm`]);
    return {
      title: "Yo'l xarajati",
      context: "Kasbiy",
      q: `Avtomobil ${dist} km masofani bosib o'tadi va har 100 km ga ${consum} litr yoqilg'i sarflaydi. 1 litr yoqilg'i ${price} so'm. Jami yoqilg'i xarajati qancha?`,
      options, correctIndex,
      explain: `${dist}·${consum}/100 = ${liters} litr; ${liters} · ${price} = ${total} so'm.`,
    };
  },
  // schedule
  () => {
    const interval = pick([10, 12, 15, 20]);
    const startH = ri(6, 8), startM = 0;
    const endH = ri(9, 11), endM = 0;
    const minutes = (endH - startH) * 60 + (endM - startM);
    const count = Math.floor(minutes / interval) + 1;
    const { options, correctIndex } = makeOptions(String(count), [String(count - 1), String(count + 1), String(Math.floor(minutes / interval))]);
    return {
      title: "Avtobus jadvali",
      context: "Jamiyat",
      q: `Avtobus har ${interval} daqiqada qatnaydi. Birinchi avtobus 0${startH}:00 da jo'naydi. ${endH}:00 gacha (shu vaqt ham hisobga olinadi) nechta avtobus jo'naydi?`,
      options, correctIndex,
      explain: `${minutes} daqiqa / ${interval} = ${Math.floor(minutes / interval)} oraliq + 1 boshlang'ich = ${count} ta.`,
    };
  },
  // water saving
  () => {
    const daily = pick([180, 240, 300, 360]);
    const p = pick([10, 15, 20, 25]);
    const monthly = daily * p / 100 * 30;
    const { options, correctIndex } = makeOptions(`${monthly} litr`, [`${daily * p / 100} litr`, `${daily * 30} litr`, `${monthly + 100} litr`]);
    return {
      title: "Suvni tejash",
      context: "Ilmiy",
      q: `Oilada kuniga ${daily} litr suv ishlatiladi. Agar ${p}% suv tejalsa, 30 kunda qancha litr suv tejaladi?`,
      options, correctIndex,
      explain: `Kuniga tejaladi: ${daily} · ${p/100} = ${daily * p / 100} litr. 30 kunda: ${monthly} litr.`,
    };
  },
  // recipe scaling
  () => {
    const flour = pick([200, 250, 300, 400]);
    const people = pick([4, 5, 6, 8]);
    const newPeople = people * 2;
    const ans = flour * newPeople / people;
    const { options, correctIndex } = makeOptions(`${ans} g`, [`${flour + newPeople} g`, `${flour / 2} g`, `${ans + 50} g`]);
    return {
      title: "Tort retsepti",
      context: "Shaxsiy",
      q: `${people} kishi uchun tort tayyorlashda ${flour} g un kerak. ${newPeople} kishi uchun tort tayyorlashda qancha un kerak?`,
      options, correctIndex,
      explain: `Proporsiya: ${flour}·${newPeople}/${people} = ${ans} g.`,
    };
  },
  // salary tax
  () => {
    const sal = pick([3000000, 4500000, 6000000, 7500000]);
    const t = 12;
    const tax = sal * t / 100;
    const net = sal - tax;
    const { options, correctIndex } = makeOptions(`${net} so'm`, [`${tax} so'm`, `${sal + tax} so'm`, `${net - 100000} so'm`]);
    return {
      title: "Sof maosh",
      context: "Kasbiy",
      q: `Xodimning oylik maoshi ${sal} so'm. Undan ${t}% daromad solig'i ushlab qolinadi. Qo'lga olinadigan sof summa qancha?`,
      options, correctIndex,
      explain: `Soliq: ${sal} · 0.${t} = ${tax}. Sof: ${sal} − ${tax} = ${net} so'm.`,
    };
  },
  // distance and time
  () => {
    const v = pick([60, 80, 100, 120]);
    const s = v * pick([3, 4, 5]);
    const t = s / v;
    const { options, correctIndex } = makeOptions(`${t} soat`, [`${s} soat`, `${v / t} soat`, `${t + 1} soat`]);
    return {
      title: "Sayohat",
      context: "Shaxsiy",
      q: `${s} km masofani ${v} km/soat tezlik bilan bosib o'tish uchun necha soat kerak bo'ladi?`,
      options, correctIndex,
      explain: `t = S / v = ${s} / ${v} = ${t} soat.`,
    };
  },
  // population growth (simple)
  () => {
    const pop = pick([10000, 20000, 50000, 80000]);
    const r = pick([2, 5, 8, 10]);
    const next = pop + pop * r / 100;
    const { options, correctIndex } = makeOptions(String(next), [String(pop + r), String(pop - pop * r / 100), String(next + 1000)]);
    return {
      title: "Aholi o'sishi",
      context: "Ilmiy",
      q: `Shaharcha aholisi ${pop} kishi. Bir yilda ${r}% ga o'sdi. Bir yildan keyingi aholi soni qancha?`,
      options, correctIndex,
      explain: `O'sish: ${pop} · ${r/100} = ${pop * r / 100}. Jami: ${next} kishi.`,
    };
  },
  // savings
  () => {
    const m = pick([50000, 100000, 150000, 200000]);
    const months = pick([6, 12, 18, 24]);
    const total = m * months;
    const { options, correctIndex } = makeOptions(`${total} so'm`, [`${m + months} so'm`, `${m * (months - 1)} so'm`, `${total + m} so'm`]);
    return {
      title: "Jamg'arma",
      context: "Shaxsiy",
      q: `Oilada har oyda ${m} so'm jamg'ariladi. ${months} oyda qancha pul to'planadi?`,
      options, correctIndex,
      explain: `${m} · ${months} = ${total} so'm.`,
    };
  },
  // garden area
  () => {
    const a = pick([10, 12, 15, 20]);
    const b = pick([8, 10, 14, 18]);
    const s = a * b;
    const seed = pick([5, 10, 20]);
    const total = s * seed;
    const { options, correctIndex } = makeOptions(`${total} ta`, [`${s} ta`, `${a + b} ta`, `${total + 100} ta`]);
    return {
      title: "Bog' uchastkasi",
      context: "Jamiyat",
      q: `Bog' uchastkasi ${a}×${b} metr o'lchamda. Har bir kvadrat metrga ${seed} ta ko'chat ekiladi. Jami nechta ko'chat kerak?`,
      options, correctIndex,
      explain: `Yuzi: ${a}·${b} = ${s} m². Ko'chatlar: ${s}·${seed} = ${total} ta.`,
    };
  },
];

// Generate
const genN = (gens, n, prefix) => {
  const seen = new Set();
  const out = [];
  let safety = 0;
  while (out.length < n && safety < n * 30) {
    safety++;
    const g = gens[out.length % gens.length];
    const item = g();
    const key = item.q;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ id: `${prefix}-${out.length + 1}`, ...item });
  }
  return out;
};

const timssKnowing = genN(knowingGenerators, 84, "K");
const timssApplying = genN(applyingGenerators, 83, "A");
const timssReasoning = genN(reasoningGenerators, 83, "R");

const pisa = [];
{
  const seen = new Set();
  let safety = 0;
  while (pisa.length < 50 && safety < 5000) {
    safety++;
    const g = pisaGenerators[pisa.length % pisaGenerators.length];
    const item = g();
    if (seen.has(item.q)) continue;
    seen.add(item.q);
    pisa.push({ id: `P-${pisa.length + 1}`, ...item });
  }
}

const timssData = {
  knowing: timssKnowing,
  applying: timssApplying,
  reasoning: timssReasoning,
};

fs.writeFileSync(path.resolve("src/data/timss.json"), JSON.stringify(timssData, null, 2));
fs.writeFileSync(path.resolve("src/data/pisa.json"), JSON.stringify(pisa, null, 2));
console.log("TIMSS:", timssKnowing.length, timssApplying.length, timssReasoning.length);
console.log("PISA:", pisa.length);
