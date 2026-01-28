import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";
import { registerSW } from "virtual:pwa-register";

registerSW({
  onOfflineReady() {
    console.log("RuralLearn is ready to work offline");
  },
  onNeedRefresh() {
    console.log("New version available");
  },
});
navigator.serviceWorker.ready.then((reg) => {
  reg.sync.register("quiz-sync");
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
