import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import { BrowserRouter as Router } from "react-router-dom"

window.addEventListener("load", function () {
  const loadingScreen = document.getElementById("loading-screen")

  loadingScreen && (loadingScreen.style.display = "none")
})

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
)
