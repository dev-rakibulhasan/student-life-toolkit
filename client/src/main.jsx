import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { ClassProvider } from "./contexts/ClassContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ClassProvider>
        <App />
      </ClassProvider>
    </AuthProvider>
  </StrictMode>
);
