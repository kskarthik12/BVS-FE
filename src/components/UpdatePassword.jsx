import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import AxiosService from '../utils/AxiosService';
import ApiRoutes from '../utils/ApiRoutes';
import asset from '../assets/assets4.png';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

function UpdatePassword() {
  const navigate = useNavigate();
  const { token } = useParams(); 

  useEffect(() => {
    sessionStorage.clear(); 
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);

      if (data.newPassword && token) {
        const res = await AxiosService.put(ApiRoutes.UPDATEPASSWORD.path.replace(':token', token), data, {
          authenticate: ApiRoutes.UPDATEPASSWORD.authenticate
        });

        if (res.status === 200) {
          toast.success("Password updated successfully.");
          navigate('/login'); 
        }
      } else {
        toast.error("Invalid or expired token.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <>
      <img src={asset} alt="Asset" />

      <div className='loginWrapper'>
        <div className='loginHeader'>
          <h2>Update Password</h2>
          <p>Please enter your new password</p>
        </div>
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control type="password" placeholder="Enter your New Password" name='newPassword' />
          </Form.Group>

          <Button className='button' variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </>
  );
}

export default UpdatePassword;
