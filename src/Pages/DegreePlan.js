import React, { useEffect, useState, useCallback } from 'react';
import DOMPurify from 'dompurify'

import './Styles/DegreePlan.css';

const DegreePlan = () => {
    const azure_id = sessionStorage.getItem("azure_id");
    const msp = localStorage.getItem("msp");
    const [modelSemesterPlan, setModelSemesterPlan] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchModelSemesterPlan = useCallback(async (a_id) => {
        try {
            const endpoint = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? `http://localhost:7071/api/getModelSemesterPlan?azure_id=${encodeURIComponent(a_id)}` : `/api/getModelSemesterPlan?azure_id=${encodeURIComponent(a_id)}`;
            const response = await fetch(endpoint);
            if (!response.ok) {
                console.error('Failed to fetch model semester plan:', response.statusText);
                return;
            }
            const data = await response.json();
            setModelSemesterPlan(data);
            localStorage.setItem("msp", JSON.stringify(data));
        } catch (error) {
            console.error('Error fetching model semester plan:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (azure_id) {
            if(msp) {
                console.log('Using cached model semester plan from localStorage.');
                setIsLoading(false);
                setModelSemesterPlan(JSON.parse(msp));
            } else {
                fetchModelSemesterPlan(azure_id);
            }
        }
    }, [azure_id, msp, fetchModelSemesterPlan]);

    DOMPurify.addHook('beforeSanitizeElements', (node) => {
        if (node.tagName === 'SUP') {
            node.remove();
        }
    });

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
