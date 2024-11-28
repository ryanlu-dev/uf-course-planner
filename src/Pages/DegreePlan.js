import React, { useEffect, useState, useCallback } from 'react';
import DOMPurify from 'dompurify'

import './Styles/DegreePlan.css';

const DegreePlan = () => {
    const azure_id = sessionStorage.getItem("azure_id");
    const [modelSemesterPlan, setModelSemesterPlan] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchModelSemesterPlan = useCallback(async (a_id) => {
        try {
            const response = await fetch(`/api/getModelSemesterPlan?azure_id=${encodeURIComponent(a_id)}`);
            if (!response.ok) {
                console.error('Failed to fetch model semester plan:', response.statusText);
                return;
            }
            const data = await response.json();
            setModelSemesterPlan(data);
        } catch (error) {
            console.error('Error fetching model semester plan:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (azure_id) {
            fetchModelSemesterPlan(azure_id);
        }
    }, [azure_id, fetchModelSemesterPlan]);

    return (
        <div className='degree-plan-page'>
            {isLoading ? (
                <p>Loading model semester plan...</p>
            ) : modelSemesterPlan ? (
                <div>
                    <h2>Major: {modelSemesterPlan.major_name}, current semester: {modelSemesterPlan.current_semester}</h2>
                    <div dangerouslySetInnerHTML = {{__html: DOMPurify.sanitize(modelSemesterPlan.html, {FORBID_ATTR: ['href']})}}/>
                </div>
            ) : (
                <p>Failed to load model semester plan.</p>
            )}
        </div>
    );
};

export default DegreePlan;
