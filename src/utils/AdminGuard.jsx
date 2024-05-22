import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function AdminGuard({ children }) {
  const role = sessionStorage.getItem('role');
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    if (!(token && role === 'admin')) {
      toast.error("Only Admin can access this site ");
    }
  }, [token, role]);

  if (token && role === 'admin') {
    return children;
  } else {
    return <Navigate to='/login' />;
  }
}

export default AdminGuard;
