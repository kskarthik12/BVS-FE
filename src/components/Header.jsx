import React, { useState, useEffect } from 'react';
import { BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify } from 'react-icons/bs';
import Button from 'react-bootstrap/Button';
import useLogout from '../hooks/useLogout';
import { Link } from 'react-router-dom';

function Header() {


    const logout = useLogout();

    return (
        <header >



            <div className='header'>
                   
            <div className="nav">
                <div className="nav-box">
                    <Link to="/admindashboard">Admindashboard</Link>
                </div>
                <div className="nav-box">
                    <Link to="/home">Home</Link>
                </div>
                <div className="nav-box">
                    <Link to="/Live-Vote-Status">Live vote Status</Link>
                </div>
            </div>
                <Button variant='danger' onClick={logout}>Logout</Button>
            </div>

        </header>
    );
}

export default Header;
