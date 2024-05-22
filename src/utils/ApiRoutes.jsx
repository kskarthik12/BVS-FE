const ApiRoutes = {
    LOGIN:{
        path:'/user/login',
        authenticate:false
    },
    SIGNUP:{
        path:'/user/signup',
        authenticate:false
    },
    USERS:{
        path:'/user',
        authenticate:true
    },
    FORGOTPASSWORD:{
        path:'/user/forgot-password',
        authenticate:false
    },
    UPDATEPASSWORD:{
        path:'/user/reset-password/:token',
        authenticate:false
    },
    CANDIDATEDETAILS:{
        path:'/user/candidate',
        authenticate:true
    },
    VOTESTATUS:{
        path:'/user/voteStatus',
        authenticate:true
    },
    GETALLCANDIDATES:{
        path:'/user/getallcandidate',
        authenticate:true 
    }
    
}

export default ApiRoutes