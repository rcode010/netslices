import { useState } from "react";
import { InputForm } from "./components/InputForm";
import { SubnetTable } from "./components/SubnetTable";
import type { CalculationResult, Mode } from "./types/subnet";
import { parseInput } from "./utils/cidrParser";
import { subnetCalculator } from "./utils/subnetCalculator";

function App() {
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleCalculate = (input: string, value: number, mode: Mode) => {
    const parsed = parseInput(input);
    if (typeof parsed === "string") return;
    const calculation = subnetCalculator(
      parsed.Ip.split("."),
      parsed.prefix,
      mode,
      value
    );
    setResult(calculation);
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center py-16 px-8"
      style={{ background: "#020817" }}
    >
      <InputForm onCalculate={handleCalculate} />
      {result && <SubnetTable result={result} />}
    </main>
  );
}

export default App;