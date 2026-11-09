#!/bin/sh
# Lighthouse (desktop + mobile, simulated throttling) on the key routes against the :3100 server.
# Writes qa-reports/lh_<route>-<formfactor>.json and prints a summary table.
# sh scripts/lighthouse.sh [routes...]
export CHROME_PATH=$(node -e 'console.log(require("playwright").chromium.executablePath())')
ROUTES=${*:-"/ /about /approach /industries /contact /solutions/erp-enterprise-solutions /solutions/equipment-asset-rental-management /solutions/logistics-fleet-transport-solutions"}
mkdir -p qa-reports
for r in $ROUTES; do
  n=$(echo "$r" | sed 's#/#_#g')
  for ff in desktop mobile; do
    if [ "$ff" = desktop ]; then flag="--preset=desktop"; else flag="--form-factor=mobile"; fi
    npx -y lighthouse@12 "http://localhost:3100$r" $flag --only-categories=performance,accessibility,best-practices,seo \
      --quiet --chrome-flags="--headless=new" --output=json --output-path="qa-reports/lh$n-$ff.json" >/dev/null 2>&1
    node -e 'const r=require("./qa-reports/lh"+process.argv[1]+"-"+process.argv[2]+".json");const c=r.categories,a=r.audits;console.log((process.argv[3]+" "+process.argv[2]).padEnd(56),["performance","accessibility","best-practices","seo"].map(k=>Math.round(c[k].score*100)).join(" / "),"| LCP",a["largest-contentful-paint"].displayValue,"· TBT",a["total-blocking-time"].displayValue,"· CLS",a["cumulative-layout-shift"].displayValue)' "$n" "$ff" "$r"
  done
done
