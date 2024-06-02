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

    // Generate a dynamic background color for each candidate
    const generateColors = (num) => {
        const colors = [];
        for (let i = 0; i < num; i++) {
            colors.push(`hsl(${Math.floor(360 / num * i)}, 70%, 50%)`);
        }
        return colors;
    };

    // Prepare data for the bar chart
    const data = {
        labels: candidates.map(candidate => candidate.candidateName),
        datasets: [
            {
                label: 'Vote Count',
                data: candidates.map(candidate => candidate.voteCount),
                backgroundColor: generateColors(candidates.length), // Dynamic background color
                borderColor: generateColors(candidates.length), // Dynamic border color
                borderWidth: 1,
            },
        ],
    };

    const options = {
        indexAxis: 'y', // This makes the bars horizontal
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Live vote count for all district candidates',
                font: {
                    size: 24,
                },
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: (context) => `Votes: ${context.raw}`,
                },
            },
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Votes',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Candidates',
                },
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

            <div className='full_container2'>
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
                        <h1>{womenVoteCount()}</h1>
                    </div>
                </div>
                <div className="live-status-container2">

                    <div className="chart-container">
                        <Bar className="chart" data={data} options={options} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminDashboard;
