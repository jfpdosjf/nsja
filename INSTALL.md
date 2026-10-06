# نصب Super JinX روی Railway

## پیش‌نیاز
- اکانت [GitHub](https://github.com)
- اکانت [Railway](https://railway.com)

## مراحل
1. **ریپو:** ریپوی Super JinX رو **Fork** کن (یا همه‌ی فایل‌ها رو یکجا داخل یه ریپوی جدید آپلود کن، پوشه نداره).
2. **Deploy:** در Railway بزن **New Project ← Deploy from GitHub repo** و ریپوی خودت رو انتخاب کن.
3. **دامنه:** **Settings ← Networking ← Generate Domain** و پورت رو **8080** بذار.
4. **Volume:** روی سرویس راست‌کلیک کن ← **Attach Volume** و مسیر رو **`/var/lib/pasarguard`** بذار.
5. **Region:** **Settings ← Deploy ← Region ← EU West (Amsterdam)**.
6. **Redeploy:** یک بار از تب Deployments بزن Redeploy.

## بعد از نصب
- پنل: `https://YOUR-DOMAIN/dashboard/` با `admin` / `admin`
- در Deploy Logs باید خط `[bootstrap] DONE` رو ببینی.
- **همون اول رمز رو عوض کن:** تنظیمات ← تغییر رمز عبور.
- رمز یادت رفت؟ Restart کن، `OWNER KEY` رو از لاگ بردار و توی صفحه‌ی ورود دکمه‌ی «دسترسی مالک» رو بزن.

## ساخت کاربر
**کاربران ← ساخت کاربر**، یه قالب حجم انتخاب کن (مثلاً 30GB - 30 روز) و ذخیره کن. قالب Pro یه کانفیگ «جینکس پرو» میده و بقیه‌ی قالب‌ها 4 کانفیگ 𝗝𝗶𝗻𝗫. اگه گروه انتخاب نکنی، خودکار به 𝗝𝗶𝗻𝗫 وصل میشه.

## آپدیت
توی GitHub بزن **Sync fork ← Update branch**. Railway خودکار Deploy می‌کنه و اطلاعات پنل سر جاش می‌مونه.
