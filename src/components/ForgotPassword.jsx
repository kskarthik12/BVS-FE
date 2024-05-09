import React,{useEffect} from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import AxiosService from '../utils/AxiosService'
import  ApiRoutes from '../utils/ApiRoutes'
import asset from '../assets/assets3.jpg'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function ForgotPassword() {
  const navigate = useNavigate()

  useEffect(()=>{ 
    sessionStorage.clear()
  },[])

  const handleLogin = async(e)=>{
    e.preventDefault()
    try {
      let formData = new FormData(e.target)
      let data = Object.fromEntries(formData)

      if(data.email){
        let res = await AxiosService.post(ApiRoutes.FORGOTPASSWORD.path,data,{
          authenticate:ApiRoutes.FORGOTPASSWORD.authenticate
        })

        if(res.status===200)
            toast.success("Please check your email for the reset password link")
        
      }
      else
      {
        toast.error("Error in sending mail")
      }

    } catch (error) {
        toast.error(error.response.data.message || error.message)
    }
  }

  return <>
    
      <img src={asset} alt="Asset"></img>

      <div className='loginWrapper'>
        <div className='loginHeader'>
          <h2>Forgot Password</h2>
          <p>Please enter the email address you'd like your password reset infromation sent to</p>
        </div>
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email ID</Form.Label>
            <Form.Control type="email" placeholder="Enter your email" name='email' />
          </Form.Group>

         
          <Button className='button' variant="primary" type="submit">
            Request resent link
          </Button>
        </Form>
        
  
      </div>
    
  </>
}

export default ForgotPassword