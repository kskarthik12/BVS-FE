import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Required for chart.js v3+
import AxiosService from '../utils/AxiosService';
import ApiRoutes from '../utils/ApiRoutes';
import Header from './Header';

function LiveStatus() {
    const [candidates, setCandidates] = useState([]);
    const district = sessionStorage.getItem('District');

    const fetchVoteStatus = async () => {
        try {
            const res = await AxiosService.get(ApiRoutes.VOTESTATUS.path, {
                authenticate: ApiRoutes.VOTESTATUS.authenticate
            });
            const candidates = res.data.convertedCandidates;
            const filteredCandidates = candidates.filter(candidate => candidate.district === district);
            setCandidates(filteredCandidates);
            toast.success('Live Status Updated');
        } catch (error) {
            toast.error(`Error fetching candidates: ${error.message}`);
        }
    };

    useEffect(() => {
        fetchVoteStatus();
        const interval = setInterval(fetchVoteStatus, 6000); 
        return () => clearInterval(interval); 
    }, [district]);

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
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: `Live Vote Count in ${district}`,
                color: '#F3EAE8',
                font: {
                    size: 24,
                    family: 'Times New Roman'
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
                labels: {
                    color: '#F3EAE8' 
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Votes',
                    color: '#F3EAE8' 
                }, ticks: {
                    color: '#F3EAE8' 
                },
               
            },
            x: {
                title: {
                    display: true,
                    text: 'Candidates',
                    color: '#F3EAE8' 
                
                }, ticks: {
                    color: '#F3EAE8' 
                }
            },
        },
    };

    return (
        <>
            <Header />
            <div className='full_container'>
                <div className="live-status-container">
                    
                    <div className="chart-container">
                        <Bar className="chart" data={data} options={options} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default LiveStatus;
