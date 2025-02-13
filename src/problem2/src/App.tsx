import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import CurrencySwap from "./CurrencySwap";

import "./styles/_global.scss"; 
import "./styles/app.scss";    

export default function App() {
  const [mode, setMode] = useState<"light" | "gray">("light");

  // Toggle Theme
  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "gray" : "light";
      document.body.className = newMode === "light" ? "light-mode" : "gray-mode";
      return newMode;
    });
  };
  

  const theme = createTheme({
    palette: { mode: "light" },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app-container">
        {/* Toggle Button */}
        <IconButton onClick={toggleTheme} className="theme-toggle">
          {mode === "light" ? <Brightness4 /> : <Brightness7 />}
        </IconButton>

        <CurrencySwap />
      </div>
    </ThemeProvider>
  );
}
