import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Required for chart.js v3+
import AxiosService from '../utils/AxiosService';
import ApiRoutes from '../utils/ApiRoutes';
import Header from './Header';
import { BiMale, BiFemale, BiSolidDownvote } from 'react-icons/bi';


function AdminDashboard() {
    const [candidates, setCandidates] = useState([]);
    const [user, setUser] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                let res = await AxiosService.get(ApiRoutes.VOTESTATUS.path, {
                    authenticate: ApiRoutes.VOTESTATUS.authenticate
                });
                let res1 = await AxiosService.get(ApiRoutes.GETALLUSERS.path, {
                    authenticate: ApiRoutes.GETALLUSERS.authenticate
                });
                
                let users = res1.data.users;
                const candidates = res.data.convertedCandidates;
                setCandidates(candidates);
                setUser(users); // Assuming you want the first user
                toast.success('Live Status Updated');

            } catch (error) {
                toast.error(`Error fetching candidates: ${error.message}`);
            }
        };

        fetchData(); 
    }, []);

    // Prepare data for the bar chart
    const data = {
        labels: candidates.map(candidate => `Candidate ${candidate.candidateName}`),
        datasets: [
            {
                label: 'Vote Count',
                data: candidates.map(candidate => candidate.voteCount),
                backgroundColor: 'rgba(255, 99, 132, 0.6)', // Change the background color
                borderColor: 'rgba(255, 99, 132, 1)', // Change the border color
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    const totalVoteCount = () => {
        let voteCount = candidates.map(candidate => parseInt(candidate.voteCount));
        let totalVoteCount = voteCount.reduce((total, votes) => total + votes, 0);
        return totalVoteCount;
    };

    const menVoteCount = () => {
        if (user.length > 0) {
            const menWhoVoted = user.filter(user => user.gender.toLowerCase() === 'male' && user.voting_state === true);
            return menWhoVoted.length;
        } else {
            return 0;
        }
    };

    const womenVoteCount = () => {
        if (user.length > 0) {
            const womenWhoVoted = user.filter(user => user.gender.toLowerCase() === 'female' && user.voting_state === true);
            return womenWhoVoted.length;
        } else {
            return 0;
        }
    };

    return (
        <>
            <Header />
            
            <div className='full_container'>
                <div className='main-cards'>
                    <div className='card'>
                        <div className='card-inner'>
                            <h3>Total Votes Cast</h3>
                            <BiSolidDownvote className='card_icon' />
                        </div>
                        <h1>{totalVoteCount()}</h1>
                    </div>
                    <div className='card'>
                        <div className='card-inner'>
                            <h3>MEN Votes Cast</h3>
                            <BiMale className='card_icon' />
                        </div>
                        <h1>{menVoteCount()}</h1>
                    </div>
                    <div className='card'>
                        <div className='card-inner'>
                            <h3>WOMEN Votes Cast</h3>
                            <BiFemale className='card_icon' />
                        </div>
                        <h1>{womenVoteCount()}</h1> {/* Hardcoded, you might want to change this */}
                    </div>
                </div>
                <div className="live-status-container">
                    <h1>Live Vote Status</h1>
                    <div className="chart-container">
                        <Bar className="chart" data={data} options={options} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminDashboard;
