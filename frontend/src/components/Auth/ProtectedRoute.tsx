import { Navigate, useLocation } from 'react-router-dom'
import { useUserStore } from '../../store/userStore'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useUserStore((s) => s.token)
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <>{children}</>
}
