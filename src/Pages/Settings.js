import React from 'react';
import './Styles/Settings.css'; // Optional for custom styles

const Settings = () => {
    const azure_id = sessionStorage.getItem("azure_id");
    const email = sessionStorage.getItem("email");
    console.log('azure_id = ', azure_id);

    async function fetchUserInfo(a_id) {
        const response = await fetch(`/api/getUserInfo?azure_id=${encodeURIComponent(a_id)}`);
        if (!response.ok) {
            console.error('Failed to fetch user ID:', response.statusText);
            return;
        }
        const userInfo = await response.json();
        return userInfo;
    }

    const userInfo = fetchUserInfo(azure_id);

    return (
        <div>
            <h2>Settings</h2>
            <p>Here you can view and manage your settings.</p>
            <table>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Major</th>
                    <th>College</th>
                    <th>Current Semester</th>
                </tr>
                <tr>
                    <td>${userInfo.user_name}</td>
                    <td>${email}</td>
                    <td>${userInfo.major_name}</td>
                    <td>${userInfo.college_name}</td>
                    <td>${userInfo.current_semester}</td>
                </tr>
            </table>
        </div>
    );
};

export default Settings;