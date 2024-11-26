import React from 'react';
import './Styles/Settings.css'; // Optional for custom styles

const azure_id = sessionStorage.getItem("azure_id");
console.log("Azure ID of user: ", azure_id);

const Settings = () => {
    return (
        <div>
            <h2>Settings</h2>
            <p>Here you can view and manage your settings.</p>
        </div>
    );
};

export default Settings;