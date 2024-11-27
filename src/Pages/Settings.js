import React from 'react';
import './Styles/Settings.css'; // Optional for custom styles

const Settings = () => {
    const azure_id = sessionStorage.getItem("azure_id");

    async function fetchUserInfo(a_id) {
        const response = await fetch(`/api/getUserInfo?azure_id=${a_id}`);
        if (!response.ok) {
            console.error('Failed to fetch users:', response.statusText);
            return;
        }
        const userInfo = await response.json();
        console.table(userInfo);
    }
    

    fetchUserInfo(azure_id);
    return (
        <div>
            <h2>Settings</h2>
            <p>Here you can view and manage your settings.</p>
            
            <div>
            </div>
            
        </div>
    );
};

export default Settings;