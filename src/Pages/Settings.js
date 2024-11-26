import React from 'react';
import './Styles/Settings.css'; // Optional for custom styles

const Settings = () => {
    async function fetchUsers() {
        const response = await fetch('/api/getUsers.js');
        if (!response.ok) {
            console.error('Failed to fetch users:', response.statusText);
            return;
        }
        const users = await response.json();
        console.table(users);
    }
    fetchUsers();
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