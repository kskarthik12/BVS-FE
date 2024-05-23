import React, { useState, useEffect } from 'react';
import { BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify } from 'react-icons/bs';
import Button from 'react-bootstrap/Button';
import useLogout from '../hooks/useLogout';
import { Link } from 'react-router-dom';

function Header() {


    const logout = useLogout();
    const [admin, setAdmin] = useState(false); // Default to false

    useEffect(() => {
        const role = sessionStorage.getItem('role');
        if (role === 'admin') {
            setAdmin(true);
        } else {
            setAdmin(false);
        }
    }, []); 

    return (
        <header >



            <div className='header'>
                   
            <div className="nav">
            {admin && <div className="nav-box">
                     <Link to="/admindashboard">Admindashboard</Link>
                </div>}
                <div className="nav-box">
                    <Link to="/home">Home</Link>
                </div>
                <div className="nav-box">
                    <Link to="/Live-Vote-Status">Live vote Status</Link>
                </div>
                {admin && <div className="nav-box">
                    <Link to="/addcandidate">Add Candidate</Link>
                </div>}
            </div>
                <Button variant='danger' onClick={logout}>Logout</Button>
            </div>

        </header>
    );
}

export default Header;
