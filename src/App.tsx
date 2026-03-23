import { InputForm } from "./components/InputForm";

function App() {
  const handleCalculate = (input: string, value: number, mode: Mode) => {
    console.log(input, value, mode);
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center p-8"
      style={{ background: "#020817" }}
    >
      <InputForm onCalculate={handleCalculate} />
    </main>
  );
}

export default App;
