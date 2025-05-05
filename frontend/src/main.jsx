import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Initialize Telegram WebApp
if (window.Telegram && window.Telegram.WebApp) {
  // Set the app background color
  document.body.style.backgroundColor = window.Telegram.WebApp.backgroundColor;
  document.body.style.color = window.Telegram.WebApp.textColor;

  // Expand the app to full height
  window.Telegram.WebApp.expand();

  // Enable the main button
  window.Telegram.WebApp.MainButton.show();

  // Set the app ready
  window.Telegram.WebApp.ready();
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);