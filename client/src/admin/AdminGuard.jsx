import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/Spinner'
export default function AdminGuard(){const {admin,loading}=useAuth();const loc=useLocation();if(loading)return <div className="grid min-h-screen place-items-center"><Spinner/></div>;if(!admin)return <Navigate to={`/admin/login?next=${encodeURIComponent(loc.pathname)}`} replace/>;return <Outlet/>}
