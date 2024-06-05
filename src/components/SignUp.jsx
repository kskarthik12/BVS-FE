import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Link} from 'react-router-dom'
import toast from 'react-hot-toast';
import assets2 from '../assets/assets2.jpg'
import AxiosService from '../utils/AxiosService';
import ApiRoutes from '../utils/ApiRoutes'
import { useNavigate } from 'react-router-dom';
import { ProgressBar } from 'react-loader-spinner';



function SignUp() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);
 

  const handleSignUp = async(e)=>{
    e.preventDefault()
    setIsLoading(true);
    try {
      let formData = new FormData(e.target)
      let data = Object.fromEntries(formData)
      
      if(data.Voter_id && data.password && data.District && data.gender)
      {
        let res = await AxiosService.post(ApiRoutes.SIGNUP.path,data,{
          authenticate:ApiRoutes.SIGNUP.authenticate
        })

        if(res.status===201)
        {
          toast.success(res.data.message)
          navigate('/login')
        }
      }
      else
      {
        toast.error("Input Name, Email and Password")
      }

    } catch (error) {
        toast.error(error.response.data.message || error.message)
    }
    finally {
      setIsLoading(false); 
    }
  }
  return <>

  <img src={assets2} alt="Asset"></img>

  <div className='loginWrapper'>
    <div className='loginHeader'>
      <h2>SignUp</h2>
      <p>Already Have an account? <Link to='/login'>Login</Link></p>
    </div>
  <Form onSubmit={handleSignUp}>
      <Form.Group className="mb-3" >
        <Form.Label>Voter Id</Form.Label>
        <Form.Control type="text" placeholder="Enter Voter Id" name='Voter_id'/>
      </Form.Group>

      <Form.Group className="mb-3" >
        <Form.Label>Email Id</Form.Label>
        <Form.Control type="email" placeholder="Enter Email Id" name='email'/>
      </Form.Group>

    

      <Form.Group className="mb-3" >
      <Form.Label>District</Form.Label> 
      <Form.Select  name='District' required>  
      <option>Open this select menu</option>
      <option value="Thoothukkudi">Thoothukkudi</option>
      <option value="Tirunelveli">Tirunelveli</option>
      </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3" >
      <Form.Label>Gender</Form.Label> 
      <Form.Select  name='gender' required>  
      <option>Open this select menu</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" name='password'/>
      </Form.Group>
      
      <Button className='button' variant="primary" type="submit" disabled={isLoading}>
        {isLoading ? 'Registering' :'SignUp'}
      </Button>
    </Form>

    {isLoading && (
          <div className="loading-container">
            <ProgressBar
              visible={true}
              height="80"
              width="80"
              color="#4fa94d"
              ariaLabel="progress-bar-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        )}
  </div>
  </>
}

export default SignUp