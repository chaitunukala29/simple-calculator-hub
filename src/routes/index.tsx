import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

type Mode = "basic" | "bmi" | "tip" | "percentage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Calcly — Everyday Calculator" },
      { name: "description", content: "A fast, beautiful calculator for basic math, BMI, tips, and percentages." },
      { property: "og:title", content: "Calcly — Everyday Calculator" },
      { property: "og:description", content: "A fast, beautiful calculator for basic math, BMI, tips, and percentages." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const MODES: { id: Mode; label: string }[] = [
  { id: "basic", label: "Basic" },
  { id: "bmi", label: "BMI" },
  { id: "tip", label: "Tip" },
  { id: "percentage", label: "Percent" },
];

function Index() {
  const [mode, setMode] = useState<Mode>("basic");

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:py-16">
      <div className="mx-auto max-w-md">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Calcly</h1>
          <p className="mt-1 text-sm text-muted-foreground">Everyday calculations, simplified.</p>
        </header>

        <nav
          className="mb-6 flex rounded-2xl bg-muted p-1"
          role="tablist"
          aria-label="Calculator mode"
        >
          {MODES.map((m) => (
            <button
              key={m.id}
              role="tab"
              aria-selected={mode === m.id}
              onClick={() => setMode(m.id)}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                mode === m.id
                  ? "bg-background text-foreground shadow-sm ring-1 ring-black/5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m.label}
            </button>
          ))}
        </nav>

        <main className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          {mode === "basic" && <BasicCalculator />}
          {mode === "bmi" && <BmiCalculator />}
          {mode === "tip" && <TipCalculator />}
          {mode === "percentage" && <PercentageCalculator />}
        </main>

        <footer className="mt-10 text-center text-xs text-muted-foreground">
          Results update automatically as you type.
        </footer>
      </div>
    </div>
  );
}

// ---------- Basic Calculator ----------

function BasicCalculator() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [fresh, setFresh] = useState(true);

  const result = useMemo(() => {
    if (!expression || fresh) return "";
    try {
      const sanitized = expression.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
      // eslint-disable-next-line no-eval
      const value = eval(sanitized);
      if (!Number.isFinite(value)) return "Error";
      return formatNumber(value);
    } catch {
      return "";
    }
  }, [expression, fresh]);

  function append(value: string) {
    if (fresh) {
      setExpression(value === "." ? "0." : value);
      setFresh(false);
    } else {
      const lastChar = expression.slice(-1);
      if ("+-×÷−".includes(value) && "+-×÷−".includes(lastChar)) {
        setExpression(expression.slice(0, -1) + value);
      } else {
        setExpression(expression + value);
      }
    }
    setDisplay(expression || "0");
  }

  function clear() {
    setExpression("");
    setDisplay("0");
    setFresh(true);
  }

  function toggleSign() {
    if (!expression) return;
    try {
      const sanitized = expression.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
      // eslint-disable-next-line no-eval
      const value = eval(sanitized);
      setExpression(String(-value));
      setFresh(true);
    } catch {
      // ignore
    }
  }

  function percentage() {
    if (!expression) return;
    try {
      const sanitized = expression.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
      // eslint-disable-next-line no-eval
      const value = eval(sanitized);
      setExpression(String(value / 100));
      setFresh(true);
    } catch {
      // ignore
    }
  }

  function equals() {
    if (!expression) return;
    try {
      const sanitized = expression.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
      // eslint-disable-next-line no-eval
      const value = eval(sanitized);
      if (!Number.isFinite(value)) {
        setExpression("");
        setDisplay("Error");
      } else {
        setExpression(String(value));
        setDisplay(formatNumber(value));
      }
      setFresh(true);
    } catch {
      setDisplay("Error");
      setExpression("");
      setFresh(true);
    }
  }

  const buttons = [
    { label: "AC", action: clear, variant: "muted" },
    { label: "±", action: toggleSign, variant: "muted" },
    { label: "%", action: percentage, variant: "muted" },
    { label: "÷", action: () => append("÷"), variant: "accent" },
    { label: "7", action: () => append("7"), variant: "default" },
    { label: "8", action: () => append("8"), variant: "default" },
    { label: "9", action: () => append("9"), variant: "default" },
    { label: "×", action: () => append("×"), variant: "accent" },
    { label: "4", action: () => append("4"), variant: "default" },
    { label: "5", action: () => append("5"), variant: "default" },
    { label: "6", action: () => append("6"), variant: "default" },
    { label: "−", action: () => append("−"), variant: "accent" },
    { label: "1", action: () => append("1"), variant: "default" },
    { label: "2", action: () => append("2"), variant: "default" },
    { label: "3", action: () => append("3"), variant: "default" },
    { label: "+", action: () => append("+"), variant: "accent" },
    { label: "0", action: () => append("0"), variant: "default", wide: true },
    { label: ".", action: () => append("."), variant: "default" },
    { label: "=", action: equals, variant: "primary" },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-muted/50 p-4 text-right">
        <div className="h-5 text-xs text-muted-foreground tabular-nums">{expression || " "}</div>
        <div className="mt-1 text-4xl font-semibold tracking-tight text-foreground tabular-nums">
          {fresh ? display : expression || "0"}
        </div>
        {result && !fresh && (
          <div className="mt-1 text-lg text-primary tabular-nums">= {result}</div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {buttons.map((btn) => (
          <button
            key={btn.label}
            onClick={btn.action}
            className={`flex h-14 items-center justify-center rounded-xl text-lg font-medium transition-transform active:scale-95 ${
              btn.variant === "primary"
                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                : btn.variant === "accent"
                  ? "bg-accent text-accent-foreground hover:bg-accent/80"
                  : btn.variant === "muted"
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    : "bg-background text-foreground ring-1 ring-inset ring-border hover:bg-muted"
            } ${btn.wide ? "col-span-2" : ""}`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- BMI Calculator ----------

function BmiCalculator() {
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");

  const bmi = useMemo(() => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w || h <= 0 || w <= 0) return null;
    return w / ((h / 100) * (h / 100));
  }, [height, weight]);

  const category = useMemo(() => {
    if (bmi == null) return null;
    if (bmi < 18.5) return { label: "Underweight", tone: "text-blue-500" };
    if (bmi < 25) return { label: "Healthy weight", tone: "text-green-500" };
    if (bmi < 30) return { label: "Overweight", tone: "text-amber-500" };
    return { label: "Obese", tone: "text-red-500" };
  }, [bmi]);

  return (
    <div className="space-y-6">
      <NumberField label="Height" unit="cm" value={height} onChange={setHeight} />
      <NumberField label="Weight" unit="kg" value={weight} onChange={setWeight} />

      <div className="rounded-2xl bg-muted/50 p-5 text-center">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Body Mass Index</div>
        <div className="mt-2 text-5xl font-semibold tracking-tight text-foreground tabular-nums">
          {bmi ? formatNumber(bmi, 1) : "—"}
        </div>
        {category && (
          <div className={`mt-2 text-sm font-medium ${category.tone}`}>{category.label}</div>
        )}
      </div>
    </div>
  );
}

// ---------- Tip Calculator ----------

function TipCalculator() {
  const [bill, setBill] = useState<string>("");
  const [tipPercent, setTipPercent] = useState<number>(18);
  const [people, setPeople] = useState<string>("1");

  const billValue = parseFloat(bill) || 0;
  const peopleValue = Math.max(1, parseInt(people, 10) || 1);
  const tipAmount = billValue * (tipPercent / 100);
  const total = billValue + tipAmount;
  const perPerson = total / peopleValue;

  const presets = [15, 18, 20, 25];

  return (
    <div className="space-y-6">
      <NumberField label="Bill total" unit="$" value={bill} onChange={setBill} prefix />

      <div className="space-y-2">
        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Tip
        </label>
        <div className="grid grid-cols-4 gap-2">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => setTipPercent(p)}
              className={`rounded-xl py-2 text-sm font-medium transition-colors ${
                tipPercent === p
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {p}%
            </button>
          ))}
        </div>
      </div>

      <NumberField label="People" unit="" value={people} onChange={setPeople} />

      <div className="grid grid-cols-2 gap-4">
        <ResultBox label="Total tip" value={`$${formatNumber(tipAmount)}`} />
        <ResultBox label="Per person" value={`$${formatNumber(perPerson)}`} highlight />
      </div>
    </div>
  );
}

// ---------- Percentage Calculator ----------

function PercentageCalculator() {
  const [percent, setPercent] = useState<string>("");
  const [of, setOf] = useState<string>("");

  const value = useMemo(() => {
    const p = parseFloat(percent);
    const base = parseFloat(of);
    if (!p || !base) return null;
    return (p / 100) * base;
  }, [percent, of]);

  return (
    <div className="space-y-6">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <NumberField label="Percent" unit="%" value={percent} onChange={setPercent} suffix />
        </div>
        <span className="mb-3 text-sm text-muted-foreground">of</span>
        <div className="flex-1">
          <NumberField label="Number" unit="" value={of} onChange={setOf} />
        </div>
      </div>

      <div className="rounded-2xl bg-muted/50 p-5 text-center">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Result</div>
        <div className="mt-2 text-5xl font-semibold tracking-tight text-foreground tabular-nums">
          {value != null ? formatNumber(value) : "—"}
        </div>
      </div>
    </div>
  );
}

// ---------- Shared UI ----------

function NumberField({
  label,
  unit,
  value,
  onChange,
  prefix,
  suffix,
}: {
  label: string;
  unit: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: boolean;
  suffix?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        {prefix && unit && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            {unit}
          </span>
        )}
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className={`w-full rounded-xl border border-input bg-background py-3 text-right text-2xl font-semibold text-foreground outline-none ring-ring transition-shadow focus:ring-2 ${
            prefix && unit ? "pl-8 pr-4" : "px-4"
          }`}
        />
        {suffix && unit && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

function ResultBox({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-2xl p-4 text-center ${highlight ? "bg-primary text-primary-foreground" : "bg-muted/50"}`}>
      <div className={`text-xs uppercase tracking-wider ${highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
        {label}
      </div>
      <div className={`mt-1 text-2xl font-semibold tabular-nums ${highlight ? "text-primary-foreground" : "text-foreground"}`}>
        {value}
      </div>
    </div>
  );
}

function formatNumber(n: number, digits = 2) {
  if (!Number.isFinite(n)) return "Error";
  const rounded = Math.round(n * 10 ** digits) / 10 ** digits;
  return rounded.toLocaleString("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: rounded % 1 === 0 ? 0 : digits,
  });
}
