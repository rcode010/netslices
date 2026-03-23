import { useState } from "react";
import type { Mode } from "../types/subnet";
import { subnetCalculator } from "../utils/subnetCalculator.ts";
import { parseInput } from "../utils/cidrParser.ts";

interface InputFormProps {
  onCalculate: (input: string, value: number, mode: Mode) => void;
}

export const InputForm = ({ onCalculate }: InputFormProps) => {
  const [input, setInput] = useState("");
  const [value, setValue] = useState<number | "">("");
  const [mode, setMode] = useState<Mode>("subnets");
  const [error, setError] = useState("");
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleCalculate = () => {
    setError("");
    if (!input.trim()) return setError("Enter a network address");
    if (!value) return setError("Enter a value");
      const result = parseInput(input);

      if (typeof result === "string") {
        setError(result);
        return;
      }

      const calculation = subnetCalculator(
        result.Ip.split("."),
        result.prefix,
        mode,
        Number(value),
      );
      console.log(calculation)
      setResult(calculation);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1
          className="text-5xl font-bold tracking-tight mb-2"
          style={{
            fontFamily: "'Space Mono', monospace",
            background: "linear-gradient(90deg, #06b6d4, #818cf8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          NetSlices
        </h1>
        <p className="text-slate-400 text-sm tracking-widest uppercase">
          Visual IPv4 Subnet Calculator
        </p>
      </div>

      {/* Card */}
      <div
        className="rounded-2xl p-8 flex flex-col gap-6"
        style={{
          background: "rgba(15, 23, 42, 0.8)",
          border: "1px solid rgba(6, 182, 212, 0.15)",
          boxShadow: "0 0 40px rgba(6, 182, 212, 0.05)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Mode Toggle */}
        <div
          className="flex items-center gap-1 p-1 rounded-xl w-fit"
          style={{ background: "#0f172a" }}
        >
          {(["subnets", "hosts"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                fontFamily: "'Space Mono', monospace",
                background:
                  mode === m ? "rgba(6, 182, 212, 0.15)" : "transparent",
                color: mode === m ? "#06b6d4" : "#64748b",
                border:
                  mode === m
                    ? "1px solid rgba(6, 182, 212, 0.3)"
                    : "1px solid transparent",
              }}
            >
              {m === "subnets" ? "# Subnets" : "# Hosts/subnet"}
            </button>
          ))}
        </div>

        {/* Network Input */}
        <div className="flex flex-col gap-2">
          <label
            className="text-xs uppercase tracking-widest"
            style={{ color: "#06b6d4", fontFamily: "'Space Mono', monospace" }}
          >
            Network Address
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="192.168.1.0/24  or  192.168.1.0 255.255.255.0"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
            style={{
              fontFamily: "'Space Mono', monospace",
              background: "#0f172a",
              border: "1px solid rgba(6, 182, 212, 0.2)",
              color: "#e2e8f0",
              caretColor: "#06b6d4",
            }}
            onFocus={(e) =>
              (e.target.style.border = "1px solid rgba(6, 182, 212, 0.6)")
            }
            onBlur={(e) =>
              (e.target.style.border = "1px solid rgba(6, 182, 212, 0.2)")
            }
          />
        </div>

        {/* Value Input */}
        <div className="flex flex-col gap-2">
          <label
            className="text-xs uppercase tracking-widest"
            style={{ color: "#06b6d4", fontFamily: "'Space Mono', monospace" }}
          >
            {mode === "subnets" ? "Number of Subnets" : "Hosts per Subnet"}
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) =>
              setValue(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder={mode === "subnets" ? "e.g. 6" : "e.g. 30"}
            min={1}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
            style={{
              fontFamily: "'Space Mono', monospace",
              background: "#0f172a",
              border: "1px solid rgba(6, 182, 212, 0.2)",
              color: "#e2e8f0",
              caretColor: "#06b6d4",
            }}
            onFocus={(e) =>
              (e.target.style.border = "1px solid rgba(6, 182, 212, 0.6)")
            }
            onBlur={(e) =>
              (e.target.style.border = "1px solid rgba(6, 182, 212, 0.2)")
            }
          />
        </div>

        {/* Error */}
        {error && (
          <p
            className="text-xs px-3 py-2 rounded-lg"
            style={{
              color: "#f87171",
              background: "rgba(248, 113, 113, 0.08)",
              border: "1px solid rgba(248, 113, 113, 0.2)",
              fontFamily: "'Space Mono', monospace",
            }}
          >
            ⚠ {error}
          </p>
        )}

        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          className="w-full py-3 rounded-xl font-semibold text-sm tracking-widest uppercase transition-all duration-200 active:scale-95"
          style={{
            fontFamily: "'Space Mono', monospace",
            background: "linear-gradient(135deg, #0891b2, #06b6d4)",
            color: "#0f172a",
            boxShadow: "0 0 20px rgba(6, 182, 212, 0.3)",
          }}
          onMouseEnter={(e) =>
            ((e.target as HTMLElement).style.boxShadow =
              "0 0 30px rgba(6, 182, 212, 0.5)")
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLElement).style.boxShadow =
              "0 0 20px rgba(6, 182, 212, 0.3)")
          }
        >
          Calculate →
        </button>
      </div>

      {/* Add Space Mono font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');`}</style>
    </div>
  );
};
