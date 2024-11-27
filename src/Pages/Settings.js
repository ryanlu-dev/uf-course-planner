import React, { useEffect, useState, useCallback } from 'react';
import './Styles/Settings.css';

const Settings = () => {
    const azure_id = sessionStorage.getItem("azure_id");
    const email = sessionStorage.getItem("email");

    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserInfo = useCallback(async (a_id) => {
        try {
            const response = await fetch(`/api/getUserInfo?azure_id=${encodeURIComponent(a_id)}`);
            if (!response.ok) {
                console.error('Failed to fetch user info:', response.statusText);
                return;
            }
            const data = await response.json();
            setUserInfo(data);
        } catch (error) {
            console.error('Error fetching user info:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (azure_id) {
            fetchUserInfo(azure_id);
        }
    }, [azure_id, fetchUserInfo]);



    return (
        <div>
            <h2>Settings</h2>
            <p>Here you can view and manage your settings.</p>

            {isLoading ? (
                <p>Loading user information...</p>
            ) : userInfo ? (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Major</th>
                            <th>College</th>
                            <th>Current Semester</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{userInfo.user_name}</td>
                            <td>{email}</td>
                            <td>{userInfo.major_name}</td>
                            <td>{userInfo.college_name}</td>
                            <td>{userInfo.current_semester}</td>
                        </tr>
                    </tbody>
                </table>
            ) : (
                <p>Failed to load user information.</p>
            )}
        </div>
    );
};

export default Settings;