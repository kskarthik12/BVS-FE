import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import AxiosService from '../utils/AxiosService';
import ApiRoutes from '../utils/ApiRoutes';
import Button from 'react-bootstrap/Button';
import Header from './Header';
import toast from 'react-hot-toast';
import useLogout from '../hooks/useLogout';
import video from '../assets/video.mp4';
import Modal from 'react-bootstrap/Modal';
import { RotatingLines } from 'react-loader-spinner';

const Home = () => {
  const [candidates, setCandidates] = useState([]);
  const [privateKey, setPrivateKey] = useState('');
  const [candidateId, setCandidateId] = useState('');
  const [district, setDistrict] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const logout = useLogout();

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const district = sessionStorage.getItem('District');
      if (!district) {
        toast.error('District information not found in sessionStorage');
        return;
      }
      const res = await AxiosService.get(ApiRoutes.CANDIDATEDETAILS.path, {
        params: { district: district },
        authenticate: ApiRoutes.CANDIDATEDETAILS.authenticate,
      });
      const candidates = res.data.candidates;
      setCandidates(candidates);
    } catch (error) {
      toast.error('Error fetching candidates:', error);
    }
  };

  const handleVote = (candidateId, district) => {
    setCandidateId(candidateId);
    setDistrict(district);
    setShowModal(true);
  };

  const handlePrivateKeyChange = (event) => {
    setPrivateKey(event.target.value);
  };

  const submitVote = async () => {
    if (!privateKey) {
      toast.error('Private key is required to cast your vote.');
      return;
    }
    setIsLoading(true); // Start loading
    try {
      let voterId = sessionStorage.getItem('voterId');

      await AxiosService.put(ApiRoutes.UPDATEVOTE.path, { Voter_id: voterId }, {
        authenticate: ApiRoutes.UPDATEVOTE.authenticate,
      });

      await AxiosService.post(ApiRoutes.ADDVOTE.path, {
        candidateId: candidateId,
        district: district,
        PRIVATE_KEY: privateKey,
        Voter_id: voterId
      }, {
        authenticate: ApiRoutes.ADDVOTE.authenticate,
      });

      setShowModal(false); // Close the modal after vote submission
      toast.success('Vote successfully cast!');
    }
    catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            toast.error('You have already voted.');
            break;
          case 401:
            toast.error('Insufficient funds.');
            break;
          case 402:
            toast.error('Incorrect private key.');
            break;
          default:
            toast.error(error.response.data?.message || 'An unexpected error occurred');
        }
      } else {
        toast.error(error.message || 'An unexpected error occurred');
      }
    }
    finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <>
      <Header />
      <div>
        <div className="homepage2">
          <video autoPlay muted loop className="video">
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <h3 className='list'>Candidates List:</h3>
          <div className="candidate-list">
            {candidates.length > 0 ? (
              candidates.map((candidate) => (
                <div key={candidate._id} className="candidate-item">
                  <div className="candidate-box">
                    <img src={candidate.img_url} alt={candidate.candidate_name} className="candidate-image" />
                    <div className="candidate-details">
                      <p><strong>ID:</strong> {candidate.candidate_id}</p>
                      <p><strong>Name:</strong> {candidate.candidate_name}</p>
                      <p><strong>Party:</strong> {candidate.party}</p>
                      <p><strong>District:</strong> {candidate.district}</p>
                      <Button
                        variant="success"
                        type="submit"
                        className="vote-button"
                        onClick={() => handleVote(candidate.candidate_id, candidate.district)}
                      >
                        Vote
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No candidates found</p>
            )}
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Private Key</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <div className="loading-container">
              <RotatingLines
                visible={true}
                height="96"
                width="96"
                color="grey"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />

            </div>
          ) : (
            <Form.Group controlId="privateKey">
              <Form.Control
                type="password"
                placeholder="Enter your private key"
                value={privateKey}
                onChange={handlePrivateKeyChange}
              />
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submitVote} disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Vote'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Home;
