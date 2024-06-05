import React, { useState } from 'react';
import Header from './Header';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AxiosService from '../utils/AxiosService';
import ApiRoutes from '../utils/ApiRoutes';
import asset from '../assets/img.jpg'
import { ProgressBar } from 'react-loader-spinner';


function AddCandidate() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

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
    finally {
      setIsLoading(false); // Stop loading
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

          <Button className='button' variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Candidate'}
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
      <img src={asset} alt="Asset" className='img2'></img>
    </>
  );
}

export default AddCandidate;
