import React, { useState, useEffect } from 'react';
import { BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify } from 'react-icons/bs';
import Button from 'react-bootstrap/Button';
import useLogout from '../hooks/useLogout';


function Header() {
    

    const logout = useLogout();

    return (
        <header className='header'>
           
            
            <div className='header-right'>
                
                <BsPersonCircle className='icon' />
            </div>
            <div>
                <Button variant='danger' onClick={logout}>Logout</Button>
            </div>
        </header>
    );
}

export default Header;
