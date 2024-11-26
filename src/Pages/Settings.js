import React from 'react';
import './Styles/Settings.css'; // Optional for custom styles

const Settings = () => {
    const azure_id = sessionStorage.getItem("azure_id");
    const email = sessionStorage.getItem("email");
    console.log("Azure ID of user: ", azure_id);
    console.log("Email of user: ", email);

    return (
        <div>
            <h2>Settings</h2>
            <p>Here you can view and manage your settings.</p>
        </div>
    );
};

export default Settings;