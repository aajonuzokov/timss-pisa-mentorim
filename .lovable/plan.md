# O'qituvchi kabinetiga kirish muammosini tuzatish

## Aniqlangan muammo

- "Kirish" va "Hisobim yo'q" tugmalari ishlaydi: ular email va parol bilan hisobga kiradi yoki yangi hisob ochadi.
- Kirgandan keyin sayt hisobni **o'qituvchilar ro'yxati** (`teachers` jadvali) orqali tekshiradi. Bazada bu jadval hali **yo'q**. Shuning uchun har qanday hisob uchun "ro'yxatda yo'q" xabari chiqadi yoki ma'lumotlar yuklanmaydi.
- Sababi: o'qituvchi kabineti uchun tayyorlangan migratsiya (`20261012090000_diagnostika_portfolio.sql`) loyihada bor, lekin bazaga qo'llanmagan. Bazada hozir faqat `books`, `resources`, `test_results` va `feedback` jadvallari bor.
- Shu sababli quyidagilar ham yo'q: rubrika bo'yicha baholash, o'qituvchi izohlari, E-portfolio refleksiyalari va PIN kodlar. Natijalarni o'qish ruxsati ham yo'q. Monitoring sahifasi `test_results` natijalarini ko'rsata olmaydi, chunki hozir natijalarni hech kim o'qiy olmaydi.
- `full_name`: ro'yxatdan o'tishda faqat email so'raladi, ism saqlanmaydi. `full_name` faqat test natijalarida bor.
- Administrator paneli yo'q. O'qituvchi faqat bazaga qo'lda yozuv qo'shish orqali qo'shiladi.
- Ro'yxatdan o'tgan hisoblarni men ko'ra olmadim: hisoblar ro'yxatiga kirishga ruxsatim yo'q. Bu ro'yxat migratsiyadan keyin tekshiriladi.

## Taklif etilgan bosqichlar

1. **Migratsiyani qo'llash** (`20261012090000_diagnostika_portfolio.sql`, o'zgarishsiz). U:
   - `teachers` ro'yxatini va `is_teacher()` tekshiruvini yaratadi;
   - natijalarni faqat o'qituvchilarga ochadi (talabalar hamon faqat natija yuboradi);
   - rubrika, izoh, refleksiya va PIN jadvallarini yaratadi;
   - test natijalari tekshiruvini diagnostik testni qabul qiladigan qilib yangilaydi.
   
   Mavjud yozuvlar o'chirilmaydi va o'zgartirilmaydi. Oldindan `test_results` ning zaxira nusxasi olinadi.
2. **Birinchi o'qituvchini qo'shish.** Siz kabinetda "Hisobim yo'q" orqali hisob ochasiz. Men shu email'ni `teachers` ro'yxatiga qo'shaman (faqat bitta yozuv).
3. **Tekshiruv.** Kabinetga kirish, Monitoring sahifasida natijalar ko'rinishi, kirmagan foydalanuvchi natijalarni ko'ra olmasligi tekshiriladi.
4. **(Ixtiyoriy, alohida tasdiq bilan)** Administrator uchun "O'qituvchilarni boshqarish" bo'limi: email bo'yicha qo'shish yoki olib tashlash. Buning uchun `admin` roli `user_roles` jadvalida saqlanadi. Ism (`full_name`) uchun ro'yxatdan o'tish formasiga maydon qo'shiladi.

## Texnik tafsilotlar

- `teachers.user_id` mavjud migratsiyada `auth.users(id) ON DELETE CASCADE` ga bog'langan.
- RLS: `teachers` — o'z qatorini ko'radi; `test_results` SELECT — `is_teacher()`; mavjud INSERT siyosati saqlanadi.
- Agar email tasdiqlash yoqilgan bo'lsa, o'qituvchi avval xatdagi havolani bosishi kerak.
