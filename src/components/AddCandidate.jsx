import React from 'react';
import Header from './Header';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AxiosService from '../utils/AxiosService';
import ApiRoutes from '../utils/ApiRoutes';
import asset from '../assets/img.jpg'



function AddCandidate() {
  const navigate = useNavigate();

  const handleAddCandidate = async (e) => {
    e.preventDefault();


    try {
      let formData = new FormData(e.target);
      let data = Object.fromEntries(formData);

      if (data.district && data.candidateId && data.candidateName) {
        let res = await AxiosService.post(ApiRoutes.ADDCANDIDATE.path, data, {
          authenticate: ApiRoutes.ADDCANDIDATE.authenticate
        });

        if (res.status === 200) {
          toast.success(res.data.message);
          navigate('/admindashboard');
        }
      } else {
        toast.error("Input Candidate Id, Candidate Name, and District");
      }

    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <>
      <Header />
      <div className='loginWrapper'>
        
        <div className='loginHeader'>
          <h2>Add Candidate</h2>
        </div>
        <Form onSubmit={handleAddCandidate}>
          <Form.Group className="mb-3">
            <Form.Label>Candidate Id</Form.Label>
            <Form.Control type="text" placeholder="Enter Candidate Id" name='candidateId' />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Candidate Name</Form.Label>
            <Form.Control type="text" placeholder="Enter Candidate Name" name='candidateName' />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>District</Form.Label>
            <Form.Control type="text" placeholder="Enter District Name" name='district' />
          </Form.Group>

          <Button className='button' variant="primary" type="submit">
            Add Candidate
          </Button>
        </Form>
        
      </div>
      <img src={asset} alt="Asset" className='img2'></img>
    </>
  );
}

export default AddCandidate;
