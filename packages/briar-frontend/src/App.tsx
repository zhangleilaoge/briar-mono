import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom"
import CodeConverter from "./pages/code-converter"
import "./main.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<Navigate to="code-converter" />} />
        <Route path="code-converter/*" Component={CodeConverter} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  )
}

export default App
