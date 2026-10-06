# Security

- The first login is `admin / admin`. Change it right away in Settings > Change password. Lost access? Take the OWNER KEY from the Railway logs (or API Keys > owner key) and use "Owner access" on the login page. A password you set is never reset automatically.
- The panel, the Xray core and all internal ports (8000, 8100, 10001-10005, 62050) listen on `127.0.0.1` only. The only public entry is nginx on port 8080 behind Railway's TLS.
- Every install generates its own random config paths on first boot (stored on the volume), so forks never share paths.
- The demo reseller `reseller / reseller` is created once. Change its password or delete it; it is never re-created. Set `DEMO_RESELLER=off` to skip it.
- The "Admins" menu is visible to the owner only.
- Settings > Change password needs the current username and password, is checked by the panel itself, verified after saving, and locked for 10 minutes after 5 wrong tries (per visitor, using the real IP behind Railway).
- Groups, hosts, cores, nodes and admin roles are read-only from outside (nginx blocks every change), so nobody can delete them from the dashboard or the API.
- The owner key is made by Super JinX itself: one use, 5 minutes, kept only in memory, 5 wrong tries lock it for 10 minutes. It works even with simple passwords (PasarGuard's own owner form rejects them).
- The internal node API key and TLS certificate are generated on first boot and stored on the volume.
- The subscription page file is checked every 3 seconds and restored from the original copy inside the image if it is missing or changed.

Found a problem? Report it in the [Super JinX channel](https://t.me/+WvKFv0lU_i5lNGE0).
