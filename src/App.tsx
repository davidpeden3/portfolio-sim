import { PortfolioSimulator } from "./components/PortfolioSimulator";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./App.css";

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioSimulator />
    </ThemeProvider>
  );
}