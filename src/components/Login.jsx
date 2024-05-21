import React,{useEffect} from 'react'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import AxiosService from '../utils/AxiosService'
import  ApiRoutes from '../utils/ApiRoutes'
import asset from '../assets/asset.webp'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Login() {
  const navigate = useNavigate()

  useEffect(()=>{ 
    sessionStorage.clear()
  },[])

  const handleLogin = async(e)=>{
    e.preventDefault()
    try {
      let formData = new FormData(e.target)
      let data = Object.fromEntries(formData)

      if(data.Voter_id && data.password){
        let res = await AxiosService.post(ApiRoutes.LOGIN.path,data,{
          authenticate:ApiRoutes.LOGIN.authenticate
        })

        if(res.status===200)
        {
          sessionStorage.setItem('token',res.data.token)
          sessionStorage.setItem('voterId',res.data.user.Voter_id)
          sessionStorage.setItem('role',res.data.user.role)
          sessionStorage.setItem('District',res.data.user.District)
          sessionStorage.setItem('Etherium_Address',res.data.user.Etherium_Address)
          toast.success(res.data.message) 
          if(res.data.user.role==='admin')
            navigate('/admindashboard')
          else
            navigate('/home')
        }
      }
      else
      {
        toast.error("Input Voter ID and Password")
      }

    } catch (error) {
        toast.error(error.response.data.message || error.message)
    }
  }

  return <>
    
      <img src={asset} alt="Asset"></img>

      <div className='loginWrapper'>
        <div className='loginHeader'>
          <h2>Login</h2>
          <p>Don't have an account? <Link to='/signup'>SignUp</Link></p>
        </div>
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Voter ID</Form.Label>
            <Form.Control type="text" placeholder="Enter Voter ID" name='Voter_id' />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" name='password' />
          </Form.Group>
          <p><Link to='/forgotpassword'>Forgot Password?</Link></p>
 
          <Button className='button' variant="primary" type="submit">
            Login
          </Button>
        </Form>
        
  
      </div>
    
  </>
}

export default Login