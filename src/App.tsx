import { PortfolioSimulator } from "./components/PortfolioSimulator";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useEffect } from "react";
import { checkAndImportFromUrl } from "./utils/configShare";
import "./App.css";

export default function App() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('config')) {
      const imported = checkAndImportFromUrl();

      if (imported && window.history && window.history.replaceState) {
        window.history.replaceState(
          {},
          document.title,
          window.location.protocol + "//" + window.location.host + window.location.pathname
        );

        window.location.reload();
      }
    }
  }, []);

  return (
    <ThemeProvider>
      <PortfolioSimulator />
    </ThemeProvider>
  );
}