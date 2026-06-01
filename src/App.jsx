import { Routes, Route, Link } from "react-router-dom"

import AuthPage from "./components/AuthPage"
import LandingPage from "./components/Home"
import Dashboard from "./components/Dashboard"
import UserProfileDashboard from "./components/Profile"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<UserProfileDashboard />} />
      </Routes>
    </>
  )
}

export default App
