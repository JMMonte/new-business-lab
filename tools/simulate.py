#!/usr/bin/env python3
"""Unit economics + multi-scenario financial simulation for a new business.

Reads an assumptions.json (see templates/assumptions.example.json) and prints:
  - unit economics per scenario, with health flags
  - a 5-year (configurable) growth/cash projection per scenario
  - a one-at-a-time sensitivity analysis on the base scenario

Pure standard library. The point is not to predict the future — it's to see
which assumptions the outcome is most sensitive to, and whether the idea is even
arithmetically capable of being a good business.

Usage:
    python3 tools/simulate.py businesses/<slug>/assumptions.json
    python3 tools/simulate.py <file> --json     # machine-readable output
"""
from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass

# ---- parameters a scenario must define (base must have all of these) ----------
PARAMS = {
    "arpa_monthly": 0.0,
    "variable_cost_per_account_monthly": 0.0,
    "fixed_monthly": 0.0,
    "new_customers_month_1": 0.0,
    "monthly_growth_rate": 0.0,
    "cac": 0.0,
    "monthly_churn": 0.0,
    "starting_cash": 0.0,
    "monthly_expansion_rate": 0.0,
}


@dataclass
class UnitEconomics:
    arpa: float
    gross_margin: float
    lifetime_months: float
    ltv: float
    cac: float
    ltv_cac: float
    payback_months: float
    churn: float


def unit_economics(p: dict) -> UnitEconomics:
    arpa = p["arpa_monthly"]
    var = p["variable_cost_per_account_monthly"]
    gm = (arpa - var) / arpa if arpa else 0.0
    churn = p["monthly_churn"]
    lifetime = 1.0 / churn if churn > 0 else float("inf")
    ltv = arpa * gm * lifetime
    cac = p["cac"]
    ltv_cac = ltv / cac if cac else float("inf")
    margin_per_month = arpa * gm
    payback = cac / margin_per_month if margin_per_month > 0 else float("inf")
    return UnitEconomics(arpa, gm, lifetime, ltv, cac, ltv_cac, payback, churn)


def simulate(p: dict, horizon: int) -> dict:
    """Month-by-month projection. Returns trajectory + summary metrics."""
    customers = 0.0
    cash = p["starting_cash"]
    arpa = p["arpa_monthly"]
    gm_var = p["variable_cost_per_account_monthly"]
    new_adds = p["new_customers_month_1"]
    cash_trough = cash
    break_even_month = None
    rev_by_month: list[float] = []
    cust_by_month: list[float] = []
    profit_by_month: list[float] = []

    for month in range(1, horizon + 1):
        # churn the existing base, then add new customers acquired this month
        customers = customers * (1.0 - p["monthly_churn"]) + new_adds

        revenue = customers * arpa
        cogs = customers * gm_var
        sales_marketing = new_adds * p["cac"]
        fixed = p["fixed_monthly"]
        profit = revenue - cogs - sales_marketing - fixed

        cash += profit
        cash_trough = min(cash_trough, cash)
        if break_even_month is None and profit > 0:
            break_even_month = month

        rev_by_month.append(revenue)
        cust_by_month.append(customers)
        profit_by_month.append(profit)

        # grow next month's acquisition; let ARPA expand if modeled
        new_adds *= 1.0 + p["monthly_growth_rate"]
        arpa *= 1.0 + p["monthly_expansion_rate"]

    def at_year(y: int) -> int:
        return min(y * 12, horizon) - 1

    return {
        "customers_y1": cust_by_month[at_year(1)],
        "customers_y3": cust_by_month[at_year(3)],
        "customers_y5": cust_by_month[at_year(5)],
        "revenue_y1_annual": rev_by_month[at_year(1)] * 12,
        "revenue_y3_annual": rev_by_month[at_year(3)] * 12,
        "revenue_y5_annual": rev_by_month[at_year(5)] * 12,
        "profit_y5_monthly": profit_by_month[at_year(5)],
        "break_even_month": break_even_month,
        "cash_trough": cash_trough,
        "ending_cash": cash,
    }


# ---- formatting ---------------------------------------------------------------
def money(x: float) -> str:
    if x == float("inf"):
        return "∞"
    sign = "-" if x < 0 else ""
    x = abs(x)
    if x >= 1_000_000:
        return f"{sign}${x/1_000_000:.1f}M"
    if x >= 1_000:
        return f"{sign}${x/1_000:.0f}k"
    return f"{sign}${x:.0f}"


def flag(value: float, good: float, bad: float, higher_is_better: bool = True) -> str:
    if higher_is_better:
        if value >= good:
            return "🟢"
        if value <= bad:
            return "🔴"
        return "🟡"
    else:
        if value <= good:
            return "🟢"
        if value >= bad:
            return "🔴"
        return "🟡"


def merge_scenario(base: dict, override: dict) -> dict:
    p = dict(PARAMS)
    p.update(base)
    p.update(override or {})
    return p


def print_unit_economics(name: str, ue: UnitEconomics) -> None:
    print(f"\n  {name.upper()}")
    print(f"    ARPA (monthly)     {money(ue.arpa)}")
    print(f"    Gross margin       {ue.gross_margin*100:5.1f}%   "
          f"{flag(ue.gross_margin, 0.70, 0.40)}")
    life = "∞" if ue.lifetime_months == float("inf") else f"{ue.lifetime_months:.1f} mo"
    print(f"    Avg lifetime       {life}")
    print(f"    LTV                {money(ue.ltv)}")
    print(f"    CAC                {money(ue.cac)}")
    lc = "∞" if ue.ltv_cac == float("inf") else f"{ue.ltv_cac:.1f}x"
    print(f"    LTV : CAC          {lc:>6}   {flag(ue.ltv_cac, 3.0, 1.5)}")
    pb = "∞" if ue.payback_months == float("inf") else f"{ue.payback_months:.1f} mo"
    print(f"    CAC payback        {pb:>6}   {flag(ue.payback_months, 12, 18, higher_is_better=False)}")
    print(f"    Monthly churn      {ue.churn*100:5.1f}%   "
          f"{flag(ue.churn, 0.03, 0.06, higher_is_better=False)}")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("assumptions", help="path to assumptions.json")
    ap.add_argument("--json", action="store_true", help="emit machine-readable JSON")
    args = ap.parse_args()

    try:
        with open(args.assumptions) as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"error: file not found: {args.assumptions}", file=sys.stderr)
        return 1
    except json.JSONDecodeError as e:
        print(f"error: invalid JSON in {args.assumptions}: {e}", file=sys.stderr)
        return 1

    horizon = int(data.get("horizon_months", 60))
    scenarios = data.get("scenarios", {})
    if "base" not in scenarios:
        print("error: assumptions must define a 'base' scenario", file=sys.stderr)
        return 1

    base = scenarios["base"]
    missing = [k for k in PARAMS if k not in base and k not in ("starting_cash",
               "monthly_expansion_rate")]
    if missing:
        print(f"warning: base scenario missing {missing}; defaulting to 0",
              file=sys.stderr)

    resolved = {name: merge_scenario(base, ov) for name, ov in scenarios.items()}
    results = {name: simulate(p, horizon) for name, p in resolved.items()}
    ues = {name: unit_economics(p) for name, p in resolved.items()}

    if args.json:
        print(json.dumps({
            "name": data.get("name"),
            "unit_economics": {n: vars(u) for n, u in ues.items()},
            "scenarios": results,
        }, indent=2, default=str))
        return 0

    name = data.get("name", "Unnamed business")
    order = [s for s in ("pessimistic", "base", "optimistic") if s in resolved]
    order += [s for s in resolved if s not in order]

    print("=" * 64)
    print(f"  {name} — financial simulation ({horizon} months)")
    print("=" * 64)

    print("\n── UNIT ECONOMICS ──────────────────────────────────────────────")
    for s in order:
        print_unit_economics(s, ues[s])

    print("\n── 5-YEAR SCENARIOS ────────────────────────────────────────────")
    cols = [s for s in order]
    rows = [
        ("Customers (Y1)", lambda r: f"{r['customers_y1']:.0f}"),
        ("Customers (Y3)", lambda r: f"{r['customers_y3']:.0f}"),
        ("Customers (Y5)", lambda r: f"{r['customers_y5']:.0f}"),
        ("Revenue Y3 (ann.)", lambda r: money(r["revenue_y3_annual"])),
        ("Revenue Y5 (ann.)", lambda r: money(r["revenue_y5_annual"])),
        ("Break-even", lambda r: f"mo {r['break_even_month']}" if r["break_even_month"] else "never"),
        ("Peak cash needed", lambda r: money(-r["cash_trough"]) if r["cash_trough"] < 0 else "$0"),
        ("Ending cash (Y5)", lambda r: money(r["ending_cash"])),
    ]
    header = f"  {'':<20}" + "".join(f"{c.capitalize():>14}" for c in cols)
    print(header)
    print("  " + "-" * (20 + 14 * len(cols)))
    for label, fn in rows:
        line = f"  {label:<20}"
        for c in cols:
            line += f"{fn(results[c]):>14}"
        print(line)

    # ---- sensitivity on base -------------------------------------------------
    print("\n── SENSITIVITY (base case, Y5 annual revenue) ──────────────────")
    base_p = resolved["base"]
    base_rev = results["base"]["revenue_y5_annual"]
    knobs = ["arpa_monthly", "cac", "monthly_churn", "monthly_growth_rate",
             "new_customers_month_1", "monthly_expansion_rate"]
    impacts = []
    for k in knobs:
        if base_p.get(k, 0) == 0 and k != "monthly_expansion_rate":
            continue
        lo, hi = dict(base_p), dict(base_p)
        lo[k] = base_p[k] * 0.75
        hi[k] = base_p[k] * 1.25
        rev_lo = simulate(lo, horizon)["revenue_y5_annual"]
        rev_hi = simulate(hi, horizon)["revenue_y5_annual"]
        swing = abs(rev_hi - rev_lo)
        impacts.append((k, swing, rev_lo, rev_hi))
    impacts.sort(key=lambda t: t[1], reverse=True)
    print("  Effect of ±25% on each assumption, most impactful first:")
    for k, swing, lo, hi in impacts:
        bar = "█" * int(round(12 * swing / (impacts[0][1] or 1)))
        print(f"    {k:<28} {bar:<12} {money(lo)} → {money(hi)}")
    if impacts:
        print(f"\n  → Outcome is most sensitive to '{impacts[0][0]}'. "
              "Validate that assumption first in the Test stage.")

    print("\n" + "=" * 64)
    print("  Reminder: outputs are only as good as assumptions.json. Tag each")
    print("  input's confidence in 05-financial-model.md. Round honestly.")
    print("=" * 64)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
