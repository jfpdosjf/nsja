# Changelog

## v6.1.3
- Panel add-ons follow the panel language: Persian, English, Russian and Chinese (menu filter, owner key card, change password card, owner access dialog, error messages), and rebuild themselves when you switch language
- Light and dark theme: all add-on cards use the panel's own theme colors (works with old HSL and new oklch color themes), close button and text sides follow the language direction
- Nothing spills out on small phones: fields and key box shrink to the screen width; the menu filter never touches links inside the page content
- GitHub page: preview image of the subscription page, 5-step quick start diagram, Fork and Deploy buttons, honest ping table by test type, project structure, English section and a new footer
- New subscription page "JINX PASS": holographic pass card, Persian + English with one tap (auto RTL/LTR), all numbers as 123, Persian calendar, live ping from the user's phone, usage ring, built-in QR with the JinX logo, QR for every config, one-tap import to 6 apps, floating quick-connect button, status colours (active, ending soon, expired, data used up, on hold, disabled)
- Smooth on weak phones: no blur filters on cards, 30 fps particles that pause in the background, animations only on the GPU, page shows even if a script fails
- Sub-guard: a support bot that opens a real subscription link every 3 seconds. 1st error: page file and subscription settings repaired on the spot. 3rd error: panel restarted and back in a few seconds. A deleted or changed page file is restored in under 3 seconds
- Keep-alive: panel, nginx and Xray are started again within 1 second if they ever stop (no full service restart)
- While the panel restarts, subscription links answer 503 + Retry-After 3 (apps keep their configs) and browsers see a page that reloads by itself
- Faster and lighter: nginx no longer starts one worker per host CPU (Railway containers see dozens of CPUs), 2 workers + more open files = less RAM, less CPU fight with Xray, steadier ping
- Docs: why V2Box shows a red number on working configs, and the test URL that shows the real delay

## v6.1.2
- Fixed: Settings > Change password did not save. It now checks the current username + password directly in the panel database (bcrypt), saves ANY new password you like (short, Persian, anything up to 72 bytes), can also change the username, and re-checks after saving. Falls back to the panel login check if the database check is not possible
- Lockout is per visitor now (real IP behind Railway), and separate for login, password change and owner access, so one person's mistakes never lock everyone
- Owner access accepts any password too; the account tool self-tests on every boot ("account tool ... ready" in the logs)
- Login page: the panel's own "Owner access" button now opens a native-looking dialog (owner key, new username, new password, show/hide, success screen that fills the login form). The extra "Forgot password?" link is gone
- Fixed: owner key -> new password did not work (PasarGuard's own owner form rejects simple passwords). The owner key is now Super Sepnet's own (SP-XXXX-XXXX-XXXX) and is used on the login page with "Owner access" to set a new owner username and password
- All added buttons now match the PasarGuard buttons (hover, focus ring, disabled state)
- API Keys > owner key rebuilt in the PasarGuard card style: real buttons (get key, new key, copy key), key field, 5-minute progress bar with countdown, clean login form with labels, clear messages
- Doctor (automatic support bot): every minute it checks the core and the groups, every 5 minutes the hosts, subscription settings, templates, reseller role and a real subscription link; anything broken or deleted is fixed on the spot, and if subscription links keep failing the panel restarts itself cleanly (at most once an hour)
- Protected: groups, hosts, cores, nodes and roles can no longer be deleted or changed from the dashboard or the API (read-only from outside; only the built-in setup can change them)
- Faster first byte on every config: routing without an extra DNS lookup (AsIs), system DNS first with cache, unbuffered WebSocket upload in nginx, more nginx connections
- The panel never creates users: the 50 GB test user (sep_user1) left by very old versions is deleted on every boot, whatever its note
- New: Settings > Change password card in the PasarGuard style (current username + current password + new password twice), works for the owner and resellers
- Strong checks: the panel verifies the current password, the new one is tested right after saving, 5 wrong tries lock it for 10 minutes, then the panel logs out so you sign in with the new password

## v6.1.1
- GitHub page rebuilt: premium gradient icon set, animated title, at-a-glance stats, comparison table, step-by-step install, full user guides (first login, password, selling, V2Box, v2rayNG, Hiddify and others, resellers, updates)
- Safety: the auto-group never touches a user unless the panel clearly reports it has no group (Pro users can never be moved)
- Owner key service: rejects broken or oversized requests cleanly, no crash on unexpected login replies

## v6.1.0
- New README: official icon set, banner, architecture diagram, full guide, X4G × 𝗝𝗶𝗻𝗫 collaboration
- Config names in the app: `𝗣𝗿𝗼 | جینکس | 𝙎𝙪𝙥𝙚𝙧 𝗝𝗶𝗻𝗫` for Pro, and 𝗙𝗹𝗮𝘀𝗵, 𝗙𝗶𝗿𝗲, 𝗗𝗶𝗮𝗺𝗼𝗻𝗱, 𝗡𝗶𝗴𝗵𝘁 (with icons) for the 𝗝𝗶𝗻𝗫 group
- Settings, reseller role, groups and hosts are only written when they actually differ
- Dashboard asks "who am I" once per login and handles expired sessions correctly
- Public release: fork the repo and deploy on Railway, no file edits needed
- Every install gets its own random config paths on first boot (saved on the volume), so no two panels share configs
- Panels already running keep their old paths: existing users' configs keep working after the update
- Update with GitHub "Sync fork", users and settings stay untouched
- No more micro-disconnects: core, groups and hosts are only rewritten when something actually changed
- "Admins" menu visible to the owner only (to create resellers); resellers see the clean menu and no owner-key box
- Demo reseller is created once: if you delete it or change its password, it stays that way (`DEMO_RESELLER=off` to skip)
- Self-heal fallback: if a core restart fails, the node reconnects cleanly
- Lower memory per connection (Xray buffer 512 KB): more stable on Railway's small plans

## v6.0.0
- New subscription page (approved design): usage gauge, live server ping, one-tap app import, built-in QR, smooth animations, no emojis
- Dashboard menu trimmed to: Dashboard, Users, API Keys, Templates, Bulk Actions, Settings, Support
- Faster panel: keep-alive connections to the panel and gzip for dashboard files
- Config names without emojis: Pro, Flash, Fire, Diamond, Night
- Owner password is yours: admin/admin only on first boot, change it any time with the OWNER KEY from the logs (API Keys page)
- 5-minute owner key now lives inside the "API Keys" page (no extra menu items), with brute-force protection
- 𝗝𝗶𝗻𝗫 configs are now really different: VLESS-WS, Trojan-WS, VMess-WS, VLESS-HTTPUpgrade (all clients supported)
- Two groups: "جینکس پرو" (1 Pro config) and "𝗝𝗶𝗻𝗫" (4 different configs), each with its own templates; old group upgraded in place
- Users list starts empty (no auto test user); old test user from earlier versions is removed
- Self-healing: core auto-restart when disconnected, hosts/group re-checked every 10 min, setup script restarts itself, watchdog restarts the service if the panel stops answering

## v5.0.0
- New subscription page, rebuilt from scratch: live usage ring, days left, Persian expiry date, warnings, one-tap import for V2Box / v2rayNG / Hiddify / Streisand / Happ / NekoBox
- QR codes are generated inside the page (no external service), sharp and downloadable as PNG
- WebSocket early data (`ed=2560`) on all 5 configs: one round trip less per connection, lower ping
- Each config has its own path, TLS fingerprint and name
- Users created in the panel without a group get the 5 configs automatically
- Docker health check for nginx and panel

## v4.0.0
- Fixed owner login `admin / admin`, re-applied on every boot
- Reseller role and a ready reseller account with 50 GB quota
- Port fixed to 8080

## v3.0.0
- 5 × VLESS + WS + TLS configs with `alpn=http/1.1` and `fp=chrome`
- Ready-made sales templates

## v2.0.0
- Owner account created in the database (env admins are blocked in production)

## v1.0.0
- First release: PasarGuard + Xray + nginx in one Railway service
