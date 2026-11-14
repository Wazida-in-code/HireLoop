import { requireRole } from '@/lib/core/server';
import React from 'react';

const SeekerLayoutPage = async ({children} : {children: React.ReactNode}) => {
    await requireRole('seeker')
    return children;
};

export default SeekerLayoutPage;