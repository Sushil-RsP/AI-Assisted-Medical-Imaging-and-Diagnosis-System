import { Navigate } from 'react-router-dom'

/** AI Analysis is now merged into Scan & Analyze (/scan). */
export default function AIAnalysisPage() {
  return <Navigate to="/scan" replace />
}
