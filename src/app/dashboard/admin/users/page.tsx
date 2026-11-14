import { getUsers } from '@/lib/api/user';
import React from 'react';

const AdminUsersPage = async() => {
    const users = await getUsers()
    console.log(users);
    return (
        <div>
            <h1>AdminUsersPage</h1>
        </div>
    );
};

export default AdminUsersPage;