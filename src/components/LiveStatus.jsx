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
            let res = await AxiosService.get(ApiRoutes.VOTESTATUS.path, {
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
    }, [district]);

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

    return <>
        <Header />
        <div className='full_container'>
            <div className="live-status-container">
                <h1>Live Vote Status</h1>
                <div className="chart-container">
                    <Bar className="chart" data={data} options={options} />
                </div>
            </div>
        </div>
    </>
}

export default LiveStatus;
