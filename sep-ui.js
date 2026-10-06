/* Super JinX dashboard add-on
   1) Sidebar shows only: Dashboard, Users, API Keys, Templates, Bulk Actions, Settings, Support
      (+ Admins for the owner only, to create resellers).
   2) The "API Keys" page gets a small built-in section to get the 5-minute owner key
      (no new menu items, no extra buttons in the sidebar).
   3) The "Settings" page gets a "Change password" card (current username + password -> new password).
   4) The login page "Owner access" button opens the owner key dialog.
   Everything follows the panel: Persian, English, Russian and Chinese, light and dark theme. */
(function () {
  "use strict";
  function norm(t) { return String(t || "").replace(/[\u200c\s]+/g, " ").trim().toLowerCase(); }

  /* ---------- language: follows the panel (Persian, English, Russian, Chinese) ---------- */
  var L = {
    fa: { dir: "rtl",
      kTitle: "کلید ۵ دقیقه‌ای مالک", kDesc: "برای بازیابی ورود مالک: کلید بگیر، از پنل خارج شو و توی صفحه‌ی ورود «دسترسی مالک» رو بزن. برای تغییر عادی رمز از «تنظیمات» استفاده کن.",
      kGet: "دریافت کلید", kMaking: "در حال ساخت…", kNew: "کلید تازه", kCopy: "کپی کلید", kCopied: "کپی شد", kOne: "یک‌بار مصرف", kValid: "اعتبار ", kExp: "منقضی شد، کلید تازه بگیر",
      kU: "نام کاربری مالک", kP: "رمز عبور مالک", kOk: "تأیید و دریافت کلید", kMade: "کلید ساخته شد.", kExpCopy: "کلید منقضی شده، کلید تازه بگیر", kHand: "کلید رو انتخاب و دستی کپی کن", kNeed: "نام کاربری و رمز مالک رو وارد کن", kKey: "کلید",
      pTitle: "تغییر رمز عبور", pDesc: "نام کاربری و رمز فعلی رو وارد کن، بعد رمز جدید (و اگه خواستی نام کاربری جدید) رو بذار. هر رمزی که بخوای قبول میشه. بعد از ثبت، با اطلاعات جدید وارد پنل میشی.",
      pU: "نام کاربری فعلی", pC: "رمز عبور فعلی", pNU: "نام کاربری جدید", pOpt: "(اختیاری)", pEmpty: "خالی = بدون تغییر", pN: "رمز عبور جدید", pR: "تکرار رمز عبور جدید", pSave: "ثبت رمز جدید", pSaving: "در حال ثبت…",
      pNeedCur: "نام کاربری فعلی و رمز فعلی رو وارد کن", pNeedNew: "رمز جدید رو وارد کن", pMis: "تکرار رمز جدید با خودش یکی نیست", pBadU: "نام کاربری جدید ۳ تا ۳۲ حرف انگلیسی، عدد یا _ . - باشه", pLong: "رمز جدید خیلی بلنده (حداکثر حدود ۳۶ حرف فارسی یا ۷۲ حرف انگلیسی)", pDone: "ثبت شد. چند لحظه دیگه با «{u}» و رمز جدید وارد شو…",
      dTitle: "دسترسی مالک", dDesc: "با کلید ۵ دقیقه‌ای مالک، نام کاربری و رمز عبور جدید مالک رو تعیین کن. کلید رو از «کلیدهای API» یا از خط OWNER KEY در لاگ Railway بردار.",
      dKey: "کلید مالک", dU: "نام کاربری جدید", dShow: "نمایش رمز", dGo: "ثبت اطلاعات جدید", dCancel: "انصراف", dClose: "بستن", dOkT: "اطلاعات مالک ثبت شد", dOkS: "از این به بعد با «{u}» و رمز جدید وارد شو.", dLogin: "ورود به پنل",
      dNeedKey: "کلید مالک رو وارد کن", dBadU: "نام کاربری ۳ تا ۳۲ حرف انگلیسی، عدد یا _ . - باشه",
      err: "خطا، دوباره امتحان کن", net: "ارتباط با سرور برقرار نشد" },
    en: { dir: "ltr",
      kTitle: "5-minute owner key", kDesc: "To recover owner access: get a key, sign out and press “Owner access” on the login page. For a normal password change use Settings.",
      kGet: "Get key", kMaking: "Creating…", kNew: "New key", kCopy: "Copy key", kCopied: "Copied", kOne: "One-time use", kValid: "Valid for ", kExp: "Expired, get a new key",
      kU: "Owner username", kP: "Owner password", kOk: "Confirm and get key", kMade: "Key created.", kExpCopy: "The key has expired, get a new one", kHand: "Select the key and copy it by hand", kNeed: "Enter the owner username and password", kKey: "Key",
      pTitle: "Change password", pDesc: "Enter your current username and password, then the new password (and a new username if you want). Any password is accepted. You will sign in again with the new details.",
      pU: "Current username", pC: "Current password", pNU: "New username", pOpt: "(optional)", pEmpty: "Empty = keep current", pN: "New password", pR: "Repeat new password", pSave: "Save new password", pSaving: "Saving…",
      pNeedCur: "Enter your current username and password", pNeedNew: "Enter a new password", pMis: "The two new passwords do not match", pBadU: "New username: 3 to 32 letters, numbers or _ . -", pLong: "The new password is too long (max 72 bytes)", pDone: "Saved. Sign in with “{u}” and your new password in a moment…",
      dTitle: "Owner access", dDesc: "Use the 5-minute owner key to set a new owner username and password. Get the key from API Keys or from the OWNER KEY line in the Railway logs.",
      dKey: "Owner key", dU: "New username", dShow: "Show password", dGo: "Save new details", dCancel: "Cancel", dClose: "Close", dOkT: "Owner details saved", dOkS: "From now on sign in with “{u}” and your new password.", dLogin: "Go to sign in",
      dNeedKey: "Enter the owner key", dBadU: "Username: 3 to 32 letters, numbers or _ . -",
      err: "Something went wrong, try again", net: "Could not reach the server" },
    ru: { dir: "ltr",
      kTitle: "5-минутный ключ владельца", kDesc: "Чтобы восстановить доступ владельца: получите ключ, выйдите и нажмите «Доступ владельца» на странице входа. Для обычной смены пароля используйте Настройки.",
      kGet: "Получить ключ", kMaking: "Создание…", kNew: "Новый ключ", kCopy: "Копировать", kCopied: "Скопировано", kOne: "Одноразовый", kValid: "Действует ", kExp: "Истёк, получите новый ключ",
      kU: "Логин владельца", kP: "Пароль владельца", kOk: "Подтвердить и получить", kMade: "Ключ создан.", kExpCopy: "Ключ истёк, получите новый", kHand: "Выделите ключ и скопируйте вручную", kNeed: "Введите логин и пароль владельца", kKey: "Ключ",
      pTitle: "Смена пароля", pDesc: "Введите текущий логин и пароль, затем новый пароль (и новый логин, если нужно). Подходит любой пароль. После сохранения войдите с новыми данными.",
      pU: "Текущий логин", pC: "Текущий пароль", pNU: "Новый логин", pOpt: "(необязательно)", pEmpty: "Пусто = без изменений", pN: "Новый пароль", pR: "Повторите пароль", pSave: "Сохранить пароль", pSaving: "Сохранение…",
      pNeedCur: "Введите текущий логин и пароль", pNeedNew: "Введите новый пароль", pMis: "Пароли не совпадают", pBadU: "Логин: от 3 до 32 латинских букв, цифр или _ . -", pLong: "Пароль слишком длинный (максимум 72 байта)", pDone: "Сохранено. Сейчас войдите как «{u}» с новым паролем…",
      dTitle: "Доступ владельца", dDesc: "С 5-минутным ключом владельца задайте новый логин и пароль владельца. Ключ есть в разделе API-ключи или в строке OWNER KEY в логах Railway.",
      dKey: "Ключ владельца", dU: "Новый логин", dShow: "Показать пароль", dGo: "Сохранить", dCancel: "Отмена", dClose: "Закрыть", dOkT: "Данные владельца сохранены", dOkS: "Теперь входите как «{u}» с новым паролем.", dLogin: "Ко входу",
      dNeedKey: "Введите ключ владельца", dBadU: "Логин: от 3 до 32 латинских букв, цифр или _ . -",
      err: "Ошибка, попробуйте ещё раз", net: "Нет связи с сервером" },
    zh: { dir: "ltr",
      kTitle: "5 分钟所有者密钥", kDesc: "恢复所有者登录：获取密钥，退出后在登录页点击“所有者访问”。普通修改密码请使用“设置”。",
      kGet: "获取密钥", kMaking: "正在生成…", kNew: "新密钥", kCopy: "复制密钥", kCopied: "已复制", kOne: "一次性", kValid: "有效期 ", kExp: "已过期，请获取新密钥",
      kU: "所有者用户名", kP: "所有者密码", kOk: "确认并获取", kMade: "密钥已生成。", kExpCopy: "密钥已过期，请获取新密钥", kHand: "请选中密钥手动复制", kNeed: "请输入所有者用户名和密码", kKey: "密钥",
      pTitle: "修改密码", pDesc: "输入当前用户名和密码，然后输入新密码（如需要也可填写新用户名）。任何密码都可以。保存后请用新信息重新登录。",
      pU: "当前用户名", pC: "当前密码", pNU: "新用户名", pOpt: "（可选）", pEmpty: "留空 = 不修改", pN: "新密码", pR: "重复新密码", pSave: "保存新密码", pSaving: "正在保存…",
      pNeedCur: "请输入当前用户名和密码", pNeedNew: "请输入新密码", pMis: "两次输入的新密码不一致", pBadU: "新用户名：3 到 32 个英文字母、数字或 _ . -", pLong: "新密码太长（最多 72 字节）", pDone: "已保存。稍后请用“{u}”和新密码登录…",
      dTitle: "所有者访问", dDesc: "使用 5 分钟所有者密钥设置新的所有者用户名和密码。密钥可在“API 密钥”页面或 Railway 日志中的 OWNER KEY 行获取。",
      dKey: "所有者密钥", dU: "新用户名", dShow: "显示密码", dGo: "保存新信息", dCancel: "取消", dClose: "关闭", dOkT: "所有者信息已保存", dOkS: "以后请用“{u}”和新密码登录。", dLogin: "前往登录",
      dNeedKey: "请输入所有者密钥", dBadU: "用户名：3 到 32 个英文字母、数字或 _ . -",
      err: "出错了，请重试", net: "无法连接服务器" }
  };
  /* server answers (Persian text) are turned into the panel language by status code */
  var SRV = {
    fa: null,
    en: { 429: "Too many tries, wait 10 minutes", key401: "Wrong username or password", key403: "Only the panel owner can get a key", pw401: "Current username or password is wrong", pw409: "This username belongs to another account, pick another", rs401: "Wrong or expired key, get a new one", e500: "Not saved, try again in a few seconds" },
    ru: { 429: "Слишком много попыток, подождите 10 минут", key401: "Неверный логин или пароль", key403: "Ключ может получить только владелец", pw401: "Текущий логин или пароль неверен", pw409: "Этот логин занят, выберите другой", rs401: "Ключ неверный или истёк, получите новый", e500: "Не сохранено, попробуйте через несколько секунд" },
    zh: { 429: "尝试次数过多，请等待 10 分钟", key401: "用户名或密码错误", key403: "只有面板所有者可以获取密钥", pw401: "当前用户名或密码错误", pw409: "该用户名已被其他账户使用，请换一个", rs401: "密钥错误或已过期，请获取新密钥", e500: "未保存，请几秒后重试" }
  };
  function lang() {
    var c = "";
    try { c = localStorage.getItem("i18nextLng") || localStorage.getItem("lang") || localStorage.getItem("language") || ""; } catch (e) {}
    c = String(c || document.documentElement.lang || "").toLowerCase();
    if (/^fa|^per/.test(c)) return "fa";
    if (/^ru/.test(c)) return "ru";
    if (/^zh|^cn/.test(c)) return "zh";
    if (/^en/.test(c)) return "en";
    return document.documentElement.dir === "rtl" ? "fa" : "en";
  }
  function T(k) { var l = L[lang()] || L.en; return l[k] != null ? l[k] : L.en[k]; }
  function srvMsg(kind, status, j) {
    var m = SRV[lang()];
    if (!m) return (j && j.detail) || T("err");
    if (status === 429) return m[429];
    if (status >= 500) return m.e500;
    return m[kind + status] || T("err");
  }
  function digits(n) { return lang() === "fa" ? String(n).replace(/[0-9]/g, function (d) { return "۰۱۲۳۴۵۶۷۸۹"[d]; }) : String(n); }
  /* theme colors: works with the panel's light and dark theme, old (HSL numbers) and new (oklch / hex) color variables */
  var CFMT = null;
  function cv(name, fb) {
    if (CFMT === null) {
      var v = ""; try { v = getComputedStyle(document.documentElement).getPropertyValue("--background").trim(); } catch (e) {}
      CFMT = !v ? "none" : /^[\d.]+(deg)?\s+[\d.]+%\s+[\d.]+%/.test(v) ? "hsl" : "raw";
    }
    if (CFMT === "hsl") return "hsl(var(--" + name + "," + fb + "))";
    if (CFMT === "raw") return "var(--" + name + ",hsl(" + fb + "))";
    return "hsl(" + fb + ")";
  }
  function alpha(name, fb, pct) { return "color-mix(in srgb," + cv(name, fb) + " " + pct + "%,transparent)"; }
  function themed(css) {   /* write the CSS with the right color syntax for this panel */
    return css.replace(/\{\{([a-z-]+)\|([^}|]+)(?:\|(\d+))?\}\}/g, function (_, n, fb, p) { return p ? alpha(n, fb, p) : cv(n, fb); });
  }
  function addCss(id, css) { if (!document.getElementById(id)) { var st = document.createElement("style"); st.id = id; st.textContent = themed(css); document.head.appendChild(st); } }

  /* ---------- 1) sidebar filter ---------- */
  var HIDE = [
    "نودها", "نود", "Nodes", "Node",
    "هاست‌ها", "هاست ها", "هاستها", "میزبان‌ها", "Hosts", "Host Settings",
    "هسته‌ها", "هسته", "پیکربندی هسته", "تنظیمات هسته", "Cores", "Core", "Core Settings", "Core Config",
    "گروه‌ها", "گروه ها", "گروهها", "Groups",
    "نقش‌ها", "نقش ها", "Roles", "Admin Roles",
    "آمار", "Statistics", "Stats",
    "Ноды", "Узлы", "Хосты", "Ядра", "Ядро", "Настройки ядра", "Группы", "Роли", "Статистика",
    "节点", "主机", "核心", "核心设置", "群组", "分组", "角色", "统计"
  ].map(norm);
  /* same pages by address, so the menu stays clean in every language */
  var HIDE_PATH = /^(\/dashboard)?\/(nodes?(\/.*)?|hosts?|cores?|core-settings|groups?|admin-roles?|roles?|statistics|stats)\/?$/i;
  var ADMIN_PATH = /^(\/dashboard)?\/admins?\/?$/i;
  /* "Admins" is only for the owner (to create resellers); resellers never see it */
  var ADMINS = ["مدیران", "ادمین‌ها", "ادمین ها", "Admins", "Admin", "Администраторы", "Админы", "管理员"].map(norm);
  var OWNER = null, askedFor = null, busy = false;
  function whoAmI() {                      /* asks once per login token, never spams the API */
    var t = findToken();
    if (!t) { OWNER = null; askedFor = null; return; }
    if (t === askedFor || busy) return;
    busy = true;
    fetch("/api/admin", { headers: { Authorization: "Bearer " + t } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (me) {
        busy = false; askedFor = t;
        OWNER = me ? !!(me.role && me.role.is_owner) : null;   /* expired token: unknown, not "reseller" */
        schedule();
      })
      .catch(function () { busy = false; setTimeout(schedule, 30000); });
  }
  function hidden(el) {
    var txt = norm(el.textContent), href = "";
    try { var h = el.getAttribute("href"); if (h) { var U = new URL(h, location.href); href = /^#\//.test(U.hash) ? U.hash.slice(1) : U.pathname; } } catch (e) {}
    if (HIDE.indexOf(txt) > -1 || (href && HIDE_PATH.test(href))) return true;
    return (ADMINS.indexOf(txt) > -1 || (href && ADMIN_PATH.test(href))) && OWNER !== true;
  }
  function sweep() {
    whoAmI();
    var nodes = document.querySelectorAll('aside a, aside button, nav a, nav button, [data-sidebar="menu-button"], [data-sidebar="menu-sub-button"]');
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].closest("main") && !nodes[i].closest("aside, [data-sidebar]")) continue;   /* page content is never touched */
      var item = nodes[i].closest('[data-sidebar="menu-sub-item"], [data-sidebar="menu-item"], li') || nodes[i];
      var want = hidden(nodes[i]) ? "none" : "";
      if (item.dataset.jx === "1" || want) { if (item.style.display !== want) item.style.display = want; item.dataset.jx = "1"; }
    }
  }

  /* ---------- 2) owner key inside "API Keys" ---------- */
  var TITLES = ["کلیدهای api", "کلید های api", "کلید api", "api keys", "api key", "api-ключи", "api ключи", "ключи api", "api 密钥", "api密钥"].map(norm);
  function apiKeysHeading() {
    if (!/api[-_]?key/i.test(location.pathname + location.hash)) {
      var hs = document.querySelectorAll("main h1, main h2, h1, h2");
      for (var i = 0; i < hs.length; i++) if (TITLES.indexOf(norm(hs[i].textContent)) > -1) return hs[i];
      return null;
    }
    return document.querySelector("main h1, main h2, h1, h2") || document.querySelector("main") || null;
  }
  function findToken() {
    var jwt = /(eyJ[\w-]+\.[\w-]+\.[\w-]+)/, stores = [];
    try { stores.push(localStorage); } catch (e) {}
    try { stores.push(sessionStorage); } catch (e) {}
    for (var s = 0; s < stores.length; s++) {
      for (var i = 0; i < stores[s].length; i++) {
        var m = jwt.exec(String(stores[s].getItem(stores[s].key(i)) || ""));
        if (m) return m[1];
      }
    }
    var c = jwt.exec(document.cookie || ""); return c ? c[1] : null;
  }
  /* same card look as the PasarGuard dashboard (uses its theme colors, light and dark) */
  var KCSS = ".jx-k{margin:0 0 20px;border:1px solid {{border|240 5.9% 90%}};border-radius:calc(var(--radius,.5rem) + 4px);background:{{card|0 0% 100%}};color:{{card-foreground|240 10% 3.9%}};box-shadow:0 1px 2px rgba(0,0,0,.05);font:inherit}" +
    ".jx-k .h{padding:20px 20px 0;display:flex;align-items:flex-start;gap:14px;flex-wrap:wrap}.jx-k .t{flex:1 1 200px;min-width:0}" +
    ".jx-k .t b{display:block;font-size:16px;font-weight:600;line-height:1.4}.jx-k .t small{display:block;margin-top:4px;font-size:13px;line-height:1.7;color:{{muted-foreground|240 3.8% 46.1%}}}" +
    ".jx-k .p{padding:16px 20px 20px}" +
    ".jx-k .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:40px;padding:0 18px;border-radius:var(--radius,.5rem);cursor:pointer;font:inherit;font-size:14px;font-weight:500;white-space:nowrap;transition:opacity .15s,background .15s}" +
    ".jx-k .btn.pri{border:0;background:{{primary|240 5.9% 10%}};color:{{primary-foreground|0 0% 98%}}}" +
    ".jx-k .btn.out{border:1px solid {{input|240 5.9% 90%}};background:transparent;color:inherit}.jx-k .btn.out:hover{background:{{accent|240 4.8% 95.9%}}}" +
    ".jx-k .btn.pri:hover{opacity:.9}.jx-k .btn:focus-visible{outline:none;box-shadow:0 0 0 2px {{background|0 0% 100%}},0 0 0 4px {{ring|240 5% 64.9%}}}.jx-k .btn:disabled{opacity:.55;cursor:default}.jx-k .btn svg{width:16px;height:16px}" +
    ".jx-k .key{display:none;margin-top:4px}.jx-k .key.on{display:block}" +
    ".jx-k .row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}" +
    ".jx-k .val{flex:1 1 220px;min-width:0;max-width:100%;height:40px;display:flex;align-items:center;padding:0 12px;border-radius:var(--radius,.5rem);border:1px solid {{input|240 5.9% 90%}};background:{{muted|240 4.8% 95.9%}};font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:14px;font-weight:600;letter-spacing:.02em;direction:ltr;user-select:all;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}" +
    ".jx-k .bar{height:4px;border-radius:9px;background:{{muted|240 4.8% 95.9%}};overflow:hidden;margin-top:12px}.jx-k .bar i{display:block;height:100%;width:100%;background:{{primary|240 5.9% 10%}};transition:width .5s linear}" +
    ".jx-k .meta{display:flex;justify-content:space-between;gap:10px;margin-top:6px;font-size:12px;color:{{muted-foreground|240 3.8% 46.1%}}}" +
    ".jx-k .f{display:none;gap:12px;grid-template-columns:repeat(auto-fit,minmax(min(180px,100%),1fr));align-items:end;margin-top:4px}.jx-k .f.on{display:grid}" +
    ".jx-k label{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:500;min-width:0}" +
    ".jx-k input{width:100%;box-sizing:border-box;min-width:0;height:40px;padding:0 12px;border-radius:var(--radius,.5rem);border:1px solid {{input|240 5.9% 90%}};background:transparent;color:inherit;font:inherit;font-size:14px;direction:ltr;text-align:left;outline:none}" +
    ".jx-k input:focus{border-color:{{ring|240 5% 64.9%}};box-shadow:0 0 0 3px {{ring|240 5% 64.9%|25}}}" +
    ".jx-k .m{display:none;margin-top:10px;font-size:13px}.jx-k .m.bad{display:block;color:{{destructive|0 84.2% 60.2%}}}.jx-k .m.good{display:block;color:#16a34a}";
  var I_KEY = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3M15 8l2 2"/></svg>';
  var I_COPY = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/></svg>';
  var I_RE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 1 1-2.35-5.65M20 4v5h-5"/></svg>';
  function mount() {
    var old = document.getElementById("jx-owner-key");
    if (OWNER === false) { if (old) old.remove(); return; }   /* resellers don't see the owner key */
    if (old) return;
    var h = apiKeysHeading(); if (!h) return;
    addCss("jx-k-css", KCSS);
    var box = document.createElement("section"); box.id = "jx-owner-key"; box.className = "jx-k"; box.dir = T("dir"); box.dataset.lang = lang();
    box.innerHTML = '<div class="h"><div class="t"><b>' + T("kTitle") + '</b><small>' + T("kDesc") + '</small></div>' +
      '<button type="button" class="btn pri g">' + I_KEY + '<span>' + T("kGet") + '</span></button></div>' +
      '<div class="p"><div class="key"><div class="row"><div class="val" title="' + T("kKey") + '"></div><button type="button" class="btn out c">' + I_COPY + '<span>' + T("kCopy") + '</span></button></div>' +
      '<div class="bar"><i></i></div><div class="meta"><span class="l"></span><span>' + T("kOne") + '</span></div></div>' +
      '<form class="f" onsubmit="return false"><label>' + T("kU") + '<input name="u" autocomplete="username" spellcheck="false" autocapitalize="off"></label>' +
      '<label>' + T("kP") + '<input name="p" type="password" autocomplete="current-password"></label><button type="button" class="btn pri ok">' + T("kOk") + '</button></form>' +
      '<div class="m"></div></div>';
    var anchor = h.closest("header") || h.parentElement || h;
    if (anchor.parentNode) anchor.parentNode.insertBefore(box, anchor.nextSibling); else return;
    var get = box.querySelector(".g"), getT = get.querySelector("span"), form = box.querySelector(".f"), okb = form.querySelector(".ok"),
        keyBox = box.querySelector(".key"), val = box.querySelector(".val"), cp = box.querySelector(".c"), cpT = cp.querySelector("span"),
        bar = box.querySelector(".bar i"), lab = box.querySelector(".l"), m = box.querySelector(".m"), timer, cur = "";
    function say(cls, t) { m.className = "m " + cls; m.textContent = t; }
    function busy(on) { get.disabled = okb.disabled = on; getT.textContent = on ? T("kMaking") : (cur ? T("kNew") : T("kGet")); }
    function request(body, token) {
      say("", ""); busy(true);
      var hd = { "Content-Type": "application/json" }; if (token) hd.Authorization = "Bearer " + token;
      fetch("/jinx/key", { method: "POST", headers: hd, body: JSON.stringify(body || {}), credentials: "same-origin" })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return [r.status, j]; }); })
        .then(function (x) {
          busy(false);
          if (x[0] === 200 && x[1].key) return show(x[1]);
          if (x[0] === 401 && !body) { form.classList.add("on"); form.u.focus(); return say("", ""); }
          say("bad", srvMsg("key", x[0], x[1]));
        })
        .catch(function () { busy(false); say("bad", T("net")); });
    }
    function show(j) {
      form.classList.remove("on"); form.reset(); cur = j.key; val.textContent = j.key; keyBox.classList.add("on");
      get.innerHTML = I_RE + "<span>" + T("kNew") + "</span>"; getT = get.querySelector("span");
      var ttl = (j.ttl || 300) * 1000, end = Date.now() + ttl;
      clearInterval(timer);
      function upd() {
        var left = Math.max(0, end - Date.now()), s = Math.round(left / 1000);
        bar.style.width = (left / ttl * 100) + "%";
        if (s) { lab.textContent = T("kValid") + digits(Math.floor(s / 60) + ":" + ("0" + s % 60).slice(-2)); val.style.opacity = ""; return; }
        lab.textContent = T("kExp"); val.style.opacity = ".45"; cur = ""; clearInterval(timer);
      }
      upd(); timer = setInterval(upd, 500);
      say("good", T("kMade"));
    }
    function copyKey() {
      if (!cur) return say("bad", T("kExpCopy"));
      function done() { cpT.textContent = T("kCopied"); setTimeout(function () { cpT.textContent = T("kCopy"); }, 1500); }
      try {
        if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(cur).then(done, fallback);
      } catch (e) {}
      fallback();
      function fallback() { var r = document.createRange(); r.selectNodeContents(val); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); try { document.execCommand("copy"); done(); } catch (e) { say("bad", T("kHand")); } }
    }
    get.onclick = function () { request(null, findToken()); };
    okb.onclick = function () { var u = form.u.value.trim(), p = form.p.value; if (!u || !p) return say("bad", T("kNeed")); request({ username: u, password: p }); };
    form.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); okb.click(); } });
    cp.onclick = copyKey;
  }

  /* ---------- 3) Settings > change password (looks like the PasarGuard cards) ---------- */
  var PCSS = ".jx-pw{margin:0 0 20px;border:1px solid {{border|240 5.9% 90%}};border-radius:calc(var(--radius,.5rem) + 4px);background:{{card|0 0% 100%}};color:{{card-foreground|240 10% 3.9%}};box-shadow:0 1px 2px rgba(0,0,0,.05);font:inherit}" +
    ".jx-pw .h{padding:20px 20px 4px}.jx-pw .h b{display:block;font-size:16px;font-weight:600;line-height:1.4}.jx-pw .h small{display:block;margin-top:4px;font-size:13px;color:{{muted-foreground|240 3.8% 46.1%}}}" +
    ".jx-pw .b{padding:16px 20px 20px;display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(min(200px,100%),1fr))}" +
    ".jx-pw label{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:500;min-width:0}" +
    ".jx-pw input{width:100%;box-sizing:border-box;min-width:0;height:40px;padding:0 12px;border-radius:var(--radius,.5rem);border:1px solid {{input|240 5.9% 90%}};background:transparent;color:inherit;font:inherit;font-size:14px;direction:ltr;text-align:left;outline:none;transition:box-shadow .15s,border-color .15s}" +
    ".jx-pw input:focus{border-color:{{ring|240 5% 64.9%}};box-shadow:0 0 0 3px {{ring|240 5% 64.9%|25}}}" +
    ".jx-pw .f{padding:0 20px 20px;display:flex;align-items:center;gap:12px;flex-wrap:wrap}" +
    ".jx-pw button{height:40px;padding:0 18px;border:0;border-radius:var(--radius,.5rem);cursor:pointer;font:inherit;font-size:14px;font-weight:500;background:{{primary|240 5.9% 10%}};color:{{primary-foreground|0 0% 98%}};transition:opacity .15s}" +
    ".jx-pw button:hover{opacity:.9}.jx-pw button:focus-visible{outline:none;box-shadow:0 0 0 2px {{background|0 0% 100%}},0 0 0 4px {{ring|240 5% 64.9%}}}.jx-pw button:disabled{opacity:.55;cursor:default}.jx-pw .m{font-size:13px}.jx-pw .m.bad{color:{{destructive|0 84.2% 60.2%}}}.jx-pw .m.good{color:#16a34a}";
  function settingsHeading() {
    var words = ["تنظیمات", "settings", "تنظیمات عمومی", "general settings", "general", "настройки", "общие настройки", "设置", "常规设置"].map(norm);
    var hs = document.querySelectorAll("main h1, main h2, h1, h2");
    for (var i = 0; i < hs.length; i++) if (words.indexOf(norm(hs[i].textContent)) > -1) return hs[i];
    if (/\/settings(\/|$|\?|#)/i.test(location.pathname + location.hash)) return document.querySelector("main h1, main h2, h1, h2");
    return null;
  }
  function logout() {
    var jwt = /eyJ[\w-]+\.[\w-]+\.[\w-]+/, stores = [];
    try { stores.push(localStorage); } catch (e) {}
    try { stores.push(sessionStorage); } catch (e) {}
    stores.forEach(function (st) { for (var i = st.length - 1; i >= 0; i--) { var k = st.key(i); if (jwt.test(String(st.getItem(k) || ""))) st.removeItem(k); } });
    location.href = "/dashboard/";
  }
  function mountPass() {
    if (document.getElementById("jx-pass")) return;
    var h = settingsHeading(); if (!h) return;
    var anchor = h.closest("header") || h.parentElement || h; if (!anchor.parentNode) return;
    addCss("jx-pw-css", PCSS);
    var box = document.createElement("section"); box.id = "jx-pass"; box.className = "jx-pw"; box.dir = T("dir"); box.dataset.lang = lang();
    box.innerHTML = '<div class="h"><b>' + T("pTitle") + '</b><small>' + T("pDesc") + '</small></div>' +
      '<form class="b" autocomplete="off" onsubmit="return false">' +
      '<label>' + T("pU") + '<input name="u" autocomplete="username" spellcheck="false" autocapitalize="off"></label>' +
      '<label>' + T("pC") + '<input name="c" type="password" autocomplete="current-password"></label>' +
      '<label><span>' + T("pNU") + ' <span style="opacity:.6;font-weight:400">' + T("pOpt") + '</span></span><input name="nu" autocomplete="off" spellcheck="false" autocapitalize="off" placeholder="' + T("pEmpty") + '"></label>' +
      '<label>' + T("pN") + '<input name="n" type="password" autocomplete="new-password"></label>' +
      '<label>' + T("pR") + '<input name="r" type="password" autocomplete="new-password"></label></form>' +
      '<div class="f"><button type="button">' + T("pSave") + '</button><span class="m"></span></div>';
    anchor.parentNode.insertBefore(box, anchor.nextSibling);
    var f = box.querySelector("form"), btn = box.querySelector("button"), m = box.querySelector(".m");
    function say(cls, t) { m.className = "m " + cls; m.textContent = t; }
    function submit() {
      var u = f.u.value.trim(), c = f.c.value, nu = f.nu.value.trim(), n = f.n.value, r = f.r.value;
      if (!u || !c) return say("bad", T("pNeedCur"));
      if (!n) return say("bad", T("pNeedNew"));
      if (n !== r) return say("bad", T("pMis"));
      if (nu && !/^[A-Za-z0-9_.-]{3,32}$/.test(nu)) return say("bad", T("pBadU"));
      if (new Blob([n]).size > 72) return say("bad", T("pLong"));
      btn.disabled = true; say("", T("pSaving"));
      fetch("/jinx/password", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin",
        body: JSON.stringify({ username: u, current: c, new: n, new_username: nu }) })
        .then(function (res) { return res.json().catch(function () { return {}; }).then(function (j) { return [res.status, j]; }); })
        .then(function (x) {
          if (x[0] === 200) { f.reset(); say("good", T("pDone").replace("{u}", (x[1] && x[1].username) || nu || u)); setTimeout(logout, 2500); return; }
          btn.disabled = false; say("bad", srvMsg("pw", x[0], x[1]));
        })
        .catch(function () { btn.disabled = false; say("bad", T("net")); });
    }
    btn.onclick = submit;
    f.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); submit(); } });
  }


  /* ---------- 4) Login page > "Owner access" (دسترسی مالک) -> native-looking dialog ----------
     The panel's own "Owner access" button opens this dialog: owner key -> new owner username + password. */
  var DCSS = ".jx-ov{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.8);opacity:0;transition:opacity .15s ease}" +
    ".jx-ov.on{opacity:1}.jx-dlg{position:relative;width:100%;max-width:440px;max-height:calc(100dvh - 32px);overflow:auto;padding:24px;border-radius:calc(var(--radius,.5rem) + 4px);border:1px solid {{border|240 5.9% 90%}};background:{{background|0 0% 100%}};color:{{foreground|240 10% 3.9%}};box-shadow:0 10px 38px rgba(0,0,0,.35),0 10px 20px rgba(0,0,0,.2);transform:scale(.96);transition:transform .15s ease;font:inherit;text-align:start}" +
    ".jx-ov.on .jx-dlg{transform:none}.jx-dlg h2{margin:0;font-size:18px;font-weight:600;line-height:1.4}.jx-dlg p.d{margin:6px 0 0;font-size:14px;line-height:1.7;color:{{muted-foreground|240 3.8% 46.1%}}}" +
    ".jx-dlg .x{position:absolute;top:14px;inset-inline-end:14px;width:28px;height:28px;display:grid;place-items:center;border:0;border-radius:6px;background:transparent;color:inherit;opacity:.7;cursor:pointer}.jx-dlg .x:hover{opacity:1;background:{{accent|240 4.8% 95.9%}}}.jx-dlg .x svg{width:16px;height:16px}" +
    ".jx-dlg form{display:grid;gap:14px;margin-top:20px}.jx-dlg label{display:flex;flex-direction:column;gap:6px;font-size:14px;font-weight:500}" +
    ".jx-dlg .in{position:relative}.jx-dlg input{width:100%;box-sizing:border-box;height:40px;padding:0 12px;border-radius:var(--radius,.5rem);border:1px solid {{input|240 5.9% 90%}};background:transparent;color:inherit;font:inherit;font-size:14px;direction:ltr;text-align:left;outline:none;transition:box-shadow .15s,border-color .15s}" +
    ".jx-dlg input.pw{padding-right:40px}.jx-dlg input:focus{border-color:{{ring|240 5% 64.9%}};box-shadow:0 0 0 3px {{ring|240 5% 64.9%|25}}}" +
    ".jx-dlg .eye{position:absolute;right:6px;top:6px;width:28px;height:28px;display:grid;place-items:center;border:0;border-radius:6px;background:transparent;color:{{muted-foreground|240 3.8% 46.1%}};cursor:pointer}.jx-dlg .eye svg{width:16px;height:16px}" +
    ".jx-dlg .ft{display:flex;gap:8px;justify-content:flex-start;flex-wrap:wrap;margin-top:6px}" +
    ".jx-dlg .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:40px;padding:0 18px;border-radius:var(--radius,.5rem);cursor:pointer;font:inherit;font-size:14px;font-weight:500;white-space:nowrap;transition:opacity .15s,background .15s}" +
    ".jx-dlg .btn.pri{border:0;background:{{primary|240 5.9% 10%}};color:{{primary-foreground|0 0% 98%}}}.jx-dlg .btn.pri:hover{opacity:.9}" +
    ".jx-dlg .btn.out{border:1px solid {{input|240 5.9% 90%}};background:transparent;color:inherit}.jx-dlg .btn.out:hover{background:{{accent|240 4.8% 95.9%}}}" +
    ".jx-dlg .btn:disabled{opacity:.55;cursor:default}.jx-dlg .btn:focus-visible,.jx-dlg .x:focus-visible,.jx-dlg .eye:focus-visible{outline:none;box-shadow:0 0 0 2px {{background|0 0% 100%}},0 0 0 4px {{ring|240 5% 64.9%}}}" +
    ".jx-dlg .m{display:none;font-size:13px;line-height:1.6}.jx-dlg .m.bad{display:block;color:{{destructive|0 84.2% 60.2%}}}" +
    ".jx-dlg .ok{display:none;text-align:center;padding:12px 0 4px}.jx-dlg .ok.on{display:block}.jx-dlg .ok i{display:grid;place-items:center;width:52px;height:52px;margin:0 auto 12px;border-radius:50%;background:rgba(22,163,74,.12);color:#16a34a}.jx-dlg .ok i svg{width:26px;height:26px}" +
    ".jx-dlg .ok b{display:block;font-size:16px;font-weight:600}.jx-dlg .ok small{display:block;margin-top:6px;font-size:14px;color:{{muted-foreground|240 3.8% 46.1%}}}.jx-dlg .spin{width:16px;height:16px;border-radius:50%;border:2px solid currentColor;border-right-color:transparent;animation:jxsp .7s linear infinite}@keyframes jxsp{to{transform:rotate(360deg)}}" +
    ".jx-owner-fb{width:100%;margin-top:10px;height:40px;border-radius:var(--radius,.5rem);border:1px solid {{input|240 5.9% 90%}};background:transparent;color:inherit;font:inherit;font-size:14px;font-weight:500;cursor:pointer}.jx-owner-fb:hover{background:{{accent|240 4.8% 95.9%}}}";
  var I_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
  var I_EYE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
  var I_OK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  var OWNER_TXT = ["دسترسی مالک", "ورود مالک", "owner access", "owner login", "access as owner", "доступ владельца", "вход владельца", "所有者访问", "所有者登录"].map(norm);
  function loginForm() {
    if (document.querySelector('[data-sidebar], aside')) return null;            /* inside the dashboard: not the login page */
    var pw = document.querySelector('form input[type="password"]'); if (!pw) return null;
    var f = pw.closest("form"); if (!f || f.closest(".jx-dlg")) return null;
    return f;
  }
  function ownerButton() {
    var els = document.querySelectorAll('button, a, [role="button"]');
    for (var i = 0; i < els.length; i++) {
      if (els[i].closest(".jx-dlg") || els[i].classList.contains("jx-owner-fb")) continue;
      var t = norm(els[i].textContent);
      if (t && OWNER_TXT.some(function (w) { return t === w || t.indexOf(w) > -1; })) return els[i];
    }
    return null;
  }
  function setNative(input, v) {             /* fill a React-controlled input so the panel sees the value */
    if (!input) return;
    var d = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
    d && d.set ? d.set.call(input, v) : (input.value = v);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }
  function openOwnerDialog() {
    if (document.querySelector(".jx-ov")) return;
    addCss("jx-d-css", DCSS);
    var last = document.activeElement;
    var ov = document.createElement("div"); ov.className = "jx-ov"; ov.dir = T("dir");
    ov.innerHTML = '<div class="jx-dlg" role="dialog" aria-modal="true" aria-labelledby="jx-dt">' +
      '<button type="button" class="x" aria-label="' + T("dClose") + '">' + I_X + '</button>' +
      '<div class="body"><h2 id="jx-dt">' + T("dTitle") + '</h2><p class="d">' + T("dDesc") + '</p>' +
      '<form onsubmit="return false" autocomplete="off">' +
      '<label>' + T("dKey") + '<input name="k" placeholder="JX-XXXX-XXXX-XXXX" autocomplete="one-time-code" spellcheck="false" autocapitalize="characters"></label>' +
      '<label>' + T("dU") + '<input name="u" value="admin" autocomplete="username" spellcheck="false" autocapitalize="off"></label>' +
      '<label>' + T("pN") + '<span class="in"><input name="p" class="pw" type="password" autocomplete="new-password"><button type="button" class="eye" tabindex="-1" aria-label="' + T("dShow") + '">' + I_EYE + '</button></span></label>' +
      '<label>' + T("pR") + '<span class="in"><input name="r" class="pw" type="password" autocomplete="new-password"><button type="button" class="eye" tabindex="-1" aria-label="' + T("dShow") + '">' + I_EYE + '</button></span></label>' +
      '<div class="m"></div>' +
      '<div class="ft"><button type="submit" class="btn pri go">' + T("dGo") + '</button><button type="button" class="btn out cancel">' + T("dCancel") + '</button></div></form></div>' +
      '<div class="ok"><i>' + I_OK + '</i><b>' + T("dOkT") + '</b><small></small><div class="ft" style="justify-content:center;margin-top:18px"><button type="button" class="btn pri done">' + T("dLogin") + '</button></div></div></div>';
    document.body.appendChild(ov);
    requestAnimationFrame(function () { ov.classList.add("on"); });
    var dlg = ov.querySelector(".jx-dlg"), form = ov.querySelector("form"), go = ov.querySelector(".go"), m = ov.querySelector(".m"),
        body = ov.querySelector(".body"), okv = ov.querySelector(".ok");
    function say(t) { m.className = t ? "m bad" : "m"; m.textContent = t || ""; }
    function close() {
      ov.classList.remove("on"); document.removeEventListener("keydown", onKey, true);
      setTimeout(function () { ov.remove(); if (last && last.focus) try { last.focus(); } catch (e) {} }, 160);
    }
    function onKey(e) {
      if (e.key === "Escape") { e.stopPropagation(); close(); }
      if (e.key === "Tab") {                                   /* keep focus inside the dialog */
        var f = [].filter.call(dlg.querySelectorAll("button, input"), function (x) { return x.offsetParent !== null && x.tabIndex !== -1; });
        if (!f.length) return; var a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    }
    document.addEventListener("keydown", onKey, true);
    ov.addEventListener("mousedown", function (e) { if (e.target === ov) close(); });
    ov.querySelector(".x").onclick = close; ov.querySelector(".cancel").onclick = close;
    [].forEach.call(ov.querySelectorAll(".eye"), function (b) { b.onclick = function () { var i = b.previousElementSibling; i.type = i.type === "password" ? "text" : "password"; }; });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var k = form.k.value.trim().toUpperCase(), u = form.u.value.trim(), p = form.p.value, r = form.r.value;
      if (!k) return say(T("dNeedKey"));
      if (!/^[A-Za-z0-9_.-]{3,32}$/.test(u)) return say(T("dBadU"));
      if (!p) return say(T("pNeedNew"));
      if (new Blob([p]).size > 72) return say(T("pLong"));
      if (p !== r) return say(T("pMis"));
      say(""); go.disabled = true; go.innerHTML = '<span class="spin"></span>' + T("pSaving");
      fetch("/jinx/reset", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify({ key: k, username: u, password: p }) })
        .then(function (res) { return res.json().catch(function () { return {}; }).then(function (j) { return [res.status, j]; }); })
        .then(function (x) {
          go.disabled = false; go.textContent = T("dGo");
          if (x[0] !== 200) return say(srvMsg("rs", x[0], x[1]));
          body.style.display = "none"; okv.classList.add("on");
          okv.querySelector("small").textContent = T("dOkS").replace("{u}", u);
          var done = okv.querySelector(".done"); done.focus();
          done.onclick = function () {
            var lf = loginForm(); close();
            if (lf) {
              var uIn = lf.querySelector('input:not([type="password"]):not([type="hidden"])'), pIn = lf.querySelector('input[type="password"]');
              setNative(uIn, u); setNative(pIn, "");
              setTimeout(function () { if (pIn) pIn.focus(); }, 200);
            }
          };
        })
        .catch(function () { go.disabled = false; go.textContent = T("dGo"); say(T("net")); });
    });
    setTimeout(function () { form.k.focus(); }, 60);
  }
  /* hijack the panel's own "Owner access" button (earliest capture phase, before the panel's handler) */
  window.addEventListener("click", function (e) {
    var t = e.target && e.target.closest ? e.target.closest('button, a, [role="button"]') : null;
    if (!t || t.closest(".jx-dlg") || !loginForm()) return;
    var n = norm(t.textContent);
    if (t.classList.contains("jx-owner-fb") || OWNER_TXT.some(function (w) { return n === w || n.indexOf(w) > -1; })) {
      e.preventDefault(); e.stopImmediatePropagation(); openOwnerDialog();
    }
  }, true);
  var seenLogin = 0;
  function mountReset() {
    var f = loginForm(); if (!f) { seenLogin = 0; return; }
    if (!seenLogin) seenLogin = Date.now();
    if (ownerButton() || document.querySelector(".jx-owner-fb")) return;
    if (Date.now() - seenLogin < 1500) { setTimeout(schedule, 1600); return; }   /* give the panel time to draw its own button */
    addCss("jx-d-css", DCSS);
    var b = document.createElement("button"); b.type = "button"; b.className = "jx-owner-fb"; b.textContent = T("dTitle");
    f.appendChild(b);                                               /* only if this panel version has no Owner access button */
  }

  /* ---------- run + keep up with page changes ---------- */
  var queued = false;
  var LANG = null;
  function relang() {        /* panel language switched: rebuild our cards in the new language */
    var l = lang(); if (l === LANG) return; LANG = l;
    ["jx-owner-key", "jx-pass"].forEach(function (id) { var e = document.getElementById(id); if (e && e.dataset.lang !== l) e.remove(); });
    var fb = document.querySelector(".jx-owner-fb"); if (fb) fb.textContent = T("dTitle");
  }
  function tick() { try { relang(); } catch (e) {} try { sweep(); mount(); } catch (e) { /* never break the panel */ } try { mountPass(); } catch (e) {} try { mountReset(); } catch (e) {} }
  function schedule() { if (queued) return; queued = true; requestAnimationFrame(function () { queued = false; tick(); }); }
  function start() {
    tick();
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
    new MutationObserver(schedule).observe(document.documentElement, { attributes: true, attributeFilter: ["lang", "dir", "class"] });
    window.addEventListener("storage", schedule);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
