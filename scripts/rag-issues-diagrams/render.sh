#!/bin/zsh
# Renders .excalidraw scenes to PNG (1520 px wide) with the offline gstack diagram-render bundle.
# usage: render.sh [scene.excalidraw ...]   (no args: every scene in public/blog/rag-issues/diagrams)
cd "$(dirname "$0")/../.."
[ $# -eq 0 ] && set -- public/blog/rag-issues/diagrams/*.excalidraw
B=~/.claude/skills/gstack/browse/dist/browse
STAGED=$(ls /tmp/gstack-diagram-render-*.html 2>/dev/null | head -1)
[ -z "$STAGED" ] && { echo "stage the gstack diagram-render bundle first (see the /diagram skill)"; exit 1; }
TAB=$($B newtab --json | sed -n 's/.*"tabId":[[:space:]]*\([0-9]*\).*/\1/p')
$B load-html "$STAGED" --tab-id "$TAB" >/dev/null
$B wait '#done' --tab-id "$TAB" >/dev/null
for f in "$@"; do
  base=${f%.excalidraw}
  $B js --tab-id "$TAB" "window.__excalidrawToSvg(decodeURIComponent(escape(atob('$(base64 < $f | tr -d '\n')')))).then(s => { window.__svg = s; return 'OK ' + s.length })"
  $B js --tab-id "$TAB" "window.__svg" --out /tmp/rag-issues-diagram.svg >/dev/null
  $B js --tab-id "$TAB" "window.__rasterize(window.__svg, ${W:-1520})" --out $base.png >/dev/null
done
$B closetab $TAB >/dev/null
