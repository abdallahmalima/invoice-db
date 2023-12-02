import { ProgressSpinner } from 'primereact/progressspinner';
import React from 'react';

const LoadingSpinner = () => {
    return (
        <>
            
             <div className=' flex gap-2 items-center'>
                 <ProgressSpinner style={{ width: '19px', height: '19px' }} /><span>Loading...</span>
            </div>
             
        </>
    );
};

export default LoadingSpinner;