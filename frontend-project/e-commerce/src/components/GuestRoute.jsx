import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'


const GuestRoute = () => {

  const { isAuthenticated } = useSelector((state) => state.auth)
  const location = useLocation()

  if (isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname || '/'} replace />
  }
  return <Outlet />
}

export default GuestRoute






