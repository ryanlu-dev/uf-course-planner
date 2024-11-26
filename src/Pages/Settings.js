import React from 'react';
import './Styles/Settings.css'; // Optional for custom styles

const Settings = () => {
    /*
    async function getUserInfo(azure_id) {
        const endpoint = `/data-api/rest/users/azure_id`;
        const response = await fetch(`${endpoint}/${azure_id}`);
        const result = await response.json();
        return result.value;
    }

    async function getMajorInfo(major_id) {
        const endpoint = `/data-api/rest/majors/major_id`;
        const response = await fetch(`${endpoint}/${major_id}`);
        const result = await response.json();
        return result.value;
    }

    const azure_id = sessionStorage.getItem("azure_id");
    const email = sessionStorage.getItem("email");
    const userInfo = getUserInfo(azure_id);
    const majorInfo = getMajorInfo(userInfo.major_id);

            <table>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Major</th>
                    <th>Semester</th>
                </tr>
                <tr>
                    <td>{userInfo.name}</td>
                    <td>{email}</td>
                    <td>{majorInfo.name}</td>
                    <td>{userInfo.current_semester}</td>
                </tr>
            </table>


    */

    async function list() {
        const endpoint = "/data-api/rest/users";
        const response = await fetch(endpoint);
        const data = await response.json();
        console.table(data.value);
    }
    
    list();
    return (
        <div>
            <h2>Settings</h2>
            <p>Here you can view and manage your settings.</p>
            
            <div>
                <button id="list" onclick="list()">List</button>
            </div>
            
        </div>
    );
};

export default Settings;