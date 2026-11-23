#!/usr/bin/env python3
"""Check every state link in states.js and write a short report.

Run from the project folder:   python3 tools/check_links.py
It only reads states.js. It never changes it.
"""
import datetime
import json
import pathlib
import re
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor

ROOT = pathlib.Path(__file__).resolve().parent.parent
FIELDS = ["status", "register", "absentee", "polling", "id"]
AGENT = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 "
         "(KHTML, like Gecko) Version/17.0 Safari/605.1.15")
# Sites that answer a script with these codes are usually blocking robots, not broken.
BLOCKED = {401, 403, 405, 406, 429, 503}


def load_states():
    text = (ROOT / "states.js").read_text(encoding="utf-8")
    start = text.index("[", text.index("const STATES"))
    end = text.rindex("]") + 1
    return json.loads(text[start:end])


def fetch(url):
    """Return (http code, final url, curl error text)."""
    cmd = ["curl", "-sS", "-L", "-o", "/dev/null", "--max-time", "30", "--max-redirs", "8",
           "-A", AGENT, "-H", "Accept: text/html,*/*", "-w", "%{http_code} %{url_effective}", url]
    try:
        out = subprocess.run(cmd, capture_output=True, text=True, timeout=45)
    except subprocess.TimeoutExpired:
        return 0, url, "timed out"
    code, _, final = out.stdout.strip().partition(" ")
    return int(code or 0), final or url, out.stderr.strip().splitlines()[-1] if out.stderr.strip() else ""


def judge(code, err):
    if 200 <= code < 300:
        return "ok"
    if code in BLOCKED:
        return "blocked"
    if code in (404, 410):
        return "broken"
    if code == 0:
        return "no answer"
    return "odd"


def check(job):
    state, field, url = job
    code, final, err = fetch(url)
    if code == 0:  # one more try, some state sites are slow
        code, final, err = fetch(url)
    return {"state": state, "field": field, "url": url, "code": code,
            "final": final, "err": err, "verdict": judge(code, err)}


def main():
    states = load_states()
    jobs = [(s["name"], f, s[f]) for s in states for f in FIELDS if s.get(f)]
    with ThreadPoolExecutor(max_workers=10) as pool:
        rows = list(pool.map(check, jobs))

    counts = {}
    for r in rows:
        counts[r["verdict"]] = counts.get(r["verdict"], 0) + 1
    today = datetime.date.today().isoformat()
    lines = [f"# State link check, {today}", "",
             f"{len(rows)} links checked from states.js ({len(states)} states and DC).", ""]
    for name, meaning in [("ok", "loaded fine"),
                          ("blocked", "the site refused a script; these usually load fine in a real browser"),
                          ("broken", "page not found; needs a new link"),
                          ("no answer", "no reply or a security-certificate error; look at it in a browser"),
                          ("odd", "an unusual reply; look at it in a browser")]:
        lines.append(f"- {name}: {counts.get(name, 0)} ({meaning})")
    lines.append("")
    moved = [r for r in rows if r["verdict"] == "ok"
             and re.sub(r"^https?://(www\.)?", "", r["final"]).split("/")[0].lower()
             != re.sub(r"^https?://(www\.)?", "", r["url"]).split("/")[0].lower()]
    for title, pick in [("Broken", [r for r in rows if r["verdict"] == "broken"]),
                        ("No answer", [r for r in rows if r["verdict"] == "no answer"]),
                        ("Odd", [r for r in rows if r["verdict"] == "odd"]),
                        ("Blocked a script", [r for r in rows if r["verdict"] == "blocked"]),
                        ("Loaded, but now on a different site", moved)]:
        lines += [f"## {title} ({len(pick)})", ""]
        if not pick:
            lines += ["None.", ""]
            continue
        lines += ["| State | Link | Reply | Address |", "|---|---|---|---|"]
        for r in pick:
            note = str(r["code"]) if r["code"] else (r["err"] or "no reply")
            where = r["url"] if r["final"] == r["url"] else f'{r["url"]} now goes to {r["final"]}'
            lines.append(f'| {r["state"]} | {r["field"]} | {note} | {where} |')
        lines.append("")
    out = ROOT / f"LINK-CHECK-{today}.md"
    out.write_text("\n".join(lines), encoding="utf-8")
    print(f"{len(rows)} links:", ", ".join(f"{k} {v}" for k, v in sorted(counts.items())))
    print("report:", out)
    return 0


if __name__ == "__main__":
    sys.exit(main())
