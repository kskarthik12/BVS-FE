import Login from '../components/Login'
import SignUp from '../components/SignUp'
import Home from '../components/Home'
import ForgotPassword from '../components/ForgotPassword'
import UpdatePassword from '../components/UpdatePassword'
import AdminDashboard from '../components/AdminDashboard'
import LiveStatus from '../components/LiveStatus'
import AdminGuard from './AdminGuard'
import { Navigate } from 'react-router-dom'



const AppRoutes=[
    {
        path:'/login',
        element:<Login/>
    },
    {
        path:'/signup',
        element:<SignUp/>
    },
    {
        path:'/admindashboard',
        element:<AdminGuard>
                    <AdminDashboard/>
                </AdminGuard>
    },
    {
        path:"/home",
        element:  <Home></Home>
    },
    {
        path:"/reset-password/:token",
        element: <UpdatePassword></UpdatePassword>
    },
    {
        path:"/forgotpassword",
        element: <ForgotPassword></ForgotPassword> 
    },
    {  path:"/Live-Vote-Status",
    element: <LiveStatus></LiveStatus>

    },
    
    {
        path:'*',
        element:<Navigate to='/login'/>
    } 
]


export default AppRoutes