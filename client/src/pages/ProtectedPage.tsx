import React, { useContext } from 'react'
import { AuthContext } from './AuthPage';
import { Navigate, useLocation } from 'react-router';

function ProtectedPage({ children }: { children: React.ReactNode }) {
    const auth = useContext(AuthContext);
    const location = useLocation();

    if(auth.user?.phoneNumber) return (<>{ children }</>);
    else return <Navigate to="/login" replace state={{ from: location }}/>
}

export default ProtectedPage;