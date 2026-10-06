"""Super JinX: per-install secret paths.
Every fork / every deploy gets its own random config paths on first boot (saved on the volume),
so no two panels share the same paths. Old installs keep their paths so existing configs never break."""
import json, os, secrets, uuid

DATA = os.getenv("JINX_DATA", "/var/lib/pasarguard")
OUT_JSON = f"{DATA}/paths.json"
OUT_INC = f"{DATA}/inbounds.inc"
# tag -> (local port, path prefix)
SLOTS = {"JX-VLESS-WS-1": (10001, "/ws/"), "JX-VLESS-WS-2": (10002, "/stream/"),
         "JX-TROJAN-WS": (10003, "/live/"), "JX-VMESS-WS": (10004, "/gw/"), "JX-VLESS-HU": (10005, "/cdn/")}
# paths used by v6.0 and older: kept for panels that were already running before this version
LEGACY = {"JX-VLESS-WS-1": "/ws/7a5a21d9-60f9-4542-943e-7838b90169e1",
          "JX-VLESS-WS-2": "/stream/4868e537-9fd8-46e9-b63a-f36459d18a81",
          "JX-TROJAN-WS": "/live/b1dfa4cc-0ed6-4956-b330-8ccb51dc0828",
          "JX-VMESS-WS": "/gw/3d801b12-a333-452c-b9d5-90ece1a8d68c",
          "JX-VLESS-HU": "/cdn/cc046fa3-78ec-4619-ac8f-9d6c7a5d0755"}

def load():
    try:
        with open(OUT_JSON) as f: p = json.load(f)
        if all(isinstance(p.get(t), str) and p[t].startswith("/") for t in SLOTS): return p
    except Exception: pass
    return None

def main():
    os.makedirs(DATA, exist_ok=True)
    p = load()
    if p is None:
        if os.path.exists(f"{DATA}/.owner_initialized") or os.path.exists(f"{DATA}/db.sqlite3"):
            p = dict(LEGACY); print("[paths] existing panel detected, keeping old config paths")
        else:
            p = {t: pre + str(uuid.UUID(bytes=secrets.token_bytes(16), version=4)) for t, (_, pre) in SLOTS.items()}
            print("[paths] new install: unique config paths generated")
        tmp = OUT_JSON + ".tmp"
        with open(tmp, "w") as f: json.dump(p, f, indent=1)
        os.replace(tmp, OUT_JSON)
    lines = [f"location = {p[t]} {{ proxy_pass http://127.0.0.1:{port}; include /etc/nginx/ws.inc; }}"
             for t, (port, _) in SLOTS.items()]
    with open(OUT_INC, "w") as f: f.write("\n".join(lines) + "\n")

if __name__ == "__main__":
    main()
