import React from 'react';
import { useAuth, useIsAdmin } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import './Admin.scss';



const AdminPage: React.FC = () => {
const { isAdmin, isLoading } = useIsAdmin();
const navigate = useNavigate();
const handleNavigate = (path: string) => {
  navigate(path);
};

return (

    <div className='admin-page'>WIP</div>

);

}

export default AdminPage;