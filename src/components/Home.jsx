import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import AxiosService from '../utils/AxiosService';
import ApiRoutes from '../utils/ApiRoutes'
import Button from 'react-bootstrap/Button';
import Header from './Header';
import toast from 'react-hot-toast';
import useLogout from '../hooks/useLogout';

const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "candidateId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "district",
        "type": "string"
      }
    ],
    "name": "Voted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_candidateId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_district",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_candidateName",
        "type": "string"
      }
    ],
    "name": "addCandidate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "candidates",
    "outputs": [
      {
        "internalType": "string",
        "name": "district",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "candidateName",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "candidateId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "voteCount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllVotesOfCandidates",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "district",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "candidateName",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "candidateId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "voteCount",
            "type": "uint256"
          }
        ],
        "internalType": "struct Voting.Candidate[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_candidateId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_district",
        "type": "string"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "voters",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]
const contractAddress = '0xBF4B613935974321Bb1a3a8c17e42f5647B39B03';


const Home = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [connectedAddress, setConnectedAddress] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const logout=useLogout();


  
  

  const loadEthers = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const ethereumProvider = new ethers.providers.Web3Provider(window.ethereum);
      const ethSigner = ethereumProvider.getSigner();
      const address = await ethSigner.getAddress();
      const storedAddress = sessionStorage.getItem('Etherium_Address');
      if (storedAddress && storedAddress !== address) {
        // If the stored address exists and doesn't match the connected address, log out the user
        toast.error('Stored Ethereum address does not match the connected address');
        logout();
      } else {
        setProvider(ethereumProvider);
      setSigner(ethSigner);
      setConnectedAddress(address);
      }
      
      
      
    } catch (error) {
      toast.error('Error connecting to MetaMask:', error);
     
    }
  };




  useEffect(() => {
    if (window.ethereum) {
      loadEthers();
    } else {
      console.error('MetaMask is not installed');
    }
  }, []);

  const fetchCandidates = async () => {
    try {
      const district = sessionStorage.getItem('District');
      if (!district) {
        toast.error('District information not found in sessionStorage');
        return;
      }
      let res = await AxiosService.get(ApiRoutes.CANDIDATEDETAILS.path, {
        params: {
          district: district
        },
        authenticate: ApiRoutes.CANDIDATEDETAILS.authenticate
      })
      const candidates = res.data.candidates;
      
      setCandidates(candidates);
    } catch (error) {
      toast.error('Error fetching candidates:', error);
      
    }
  };

  useEffect(() => {
    if (signer) {
      fetchCandidates();
    }
  }, [signer]);

  const handleVote = async (candidateId, district) => {


    try {
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await contract.populateTransaction.vote(candidateId, district);
      const response = await signer.sendTransaction(tx);
      console.log('Transaction response:', response);
      toast.success('Vote successfully cast!');
      
      
    } catch (error){
      const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
      if (errorMessage.includes("You have already voted.")) {
        toast.error("You have already voted.");
      } else {
        toast.error(errorMessage);
      }
    } 

  };

  return <>
    <Header />
    <div>
      {!connectedAddress ? (
        <div className='homepage'>


          <div className='container'><h4><i><mark>Please click the below button to Connect to Your MetaMask Wallet</mark></i></h4> <br />
            <Button className='metamask' variant="success" type="submit" onClick={loadEthers}>Connect to MetaMask</Button>
          </div>
        </div>
      ) : (
        <div className='homepage2'>
          <h2><mark>Connected Address: {connectedAddress}</mark></h2>
          <h3>Candidates List:</h3>
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
                      <Button variant="success" type="submit" onClick={()=>handleVote(candidate.candidate_id, candidate.district)}>Vote</Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No candidates found</p>
            )}
          </div>

        </div>
      )}
    </div>
  </>
}

export default Home;
