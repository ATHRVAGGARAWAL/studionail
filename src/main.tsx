import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/noto-serif/latin-400.css";
import "@fontsource/noto-serif/latin-700.css";
import "@fontsource/noto-serif/latin-900.css";
import "@fontsource/noto-serif/latin-400-italic.css";
import "@fontsource/noto-serif/latin-700-italic.css";
import "@fontsource/plus-jakarta-sans/latin-400.css";
import "@fontsource/plus-jakarta-sans/latin-500.css";
import "@fontsource/plus-jakarta-sans/latin-600.css";
import "@fontsource/plus-jakarta-sans/latin-700.css";
import "@fontsource/plus-jakarta-sans/latin-800.css";
import { App } from "@/App";
import "@/styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
