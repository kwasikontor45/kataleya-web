import { Routes, Route, Navigate } from 'react-router-dom'
import { useCircadian } from './hooks/useCircadian'
import Landing from './routes/Landing'
import Journal from './routes/Journal'
import History from './routes/History'
import Clinician from './routes/Clinician'
import ClinicianSetup from './routes/ClinicianSetup'

export default function App() {
  useCircadian()
  return (
    <Routes>
      <Route path="/"                   element={<Landing />} />
      <Route path="/journal"            element={<Journal />} />
      <Route path="/journal/history"    element={<History />} />
      <Route path="/clinician"          element={<Clinician />} />
      <Route path="/clinician/setup"    element={<ClinicianSetup />} />
      <Route path="*"                   element={<Navigate to="/" replace />} />
    </Routes>
  )
}
