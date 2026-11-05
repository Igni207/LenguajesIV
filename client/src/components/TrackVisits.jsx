import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../data/api';
import { useAuth } from '../context/AuthContext';

export default function TrackVisits() {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    api('/visits', { 
      method: 'POST', 
      body: { ruta: location.pathname }, 
      token: user?.token 
    }).catch(() => {});
  }, [location.pathname, user?.token]);

  return null;
}