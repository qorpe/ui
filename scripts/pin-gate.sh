#!/usr/bin/env bash
# G6 pin gate: no range specifiers in dependencies or devDependencies.
# peerDependencies are ranges by nature and are exempt.
set -euo pipefail
violations=$(python3 - <<'EOF'
import json
pkg = json.load(open("package.json"))
bad = []
for section in ("dependencies", "devDependencies"):
    for name, spec in pkg.get(section, {}).items():
        if spec[:1] in ("^", "~", ">", "<", "*") or " " in spec:
            bad.append(f"{section}: {name}@{spec}")
print("\n".join(bad))
EOF
)
if [ -n "$violations" ]; then
  echo "pin-gate: range specifiers are forbidden (the pin-everything rule):"
  echo "$violations"
  exit 1
fi
echo "pin-gate: all dependencies exact-pinned."
