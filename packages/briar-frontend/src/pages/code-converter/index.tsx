import { Route, Routes, Navigate } from "react-router-dom"
import CompositionStyleConvert from "./pages/vue-composition-api"

function CodeConverter() {
  return (
    <Routes>
      <Route path="" element={<Navigate to="vue-composition-api" />} />
      <Route path="vue-composition-api" element={<CompositionStyleConvert />} />
    </Routes>
  )
}

export default CodeConverter
