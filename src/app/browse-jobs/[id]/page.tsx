import React from 'react';

const JobDetailsPage = ({params} : {params:{id:string}}) => {
    const {id} = params
    console.log(id);
    return (
        <div>
            <h1>Job details page</h1>
        </div>
    );
};

export default JobDetailsPage;