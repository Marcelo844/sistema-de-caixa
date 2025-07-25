import React, { useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

interface Props {
  children: ReactNode;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Verifica sessão atual
    supabase.auth.getSession().then(({ data }) => {
      setAuthenticated(!!data.session);
      setLoading(false);
    });

    // Escuta mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setAuthenticated(!!session);
    setLoading(false);
    });

    // Cleanup
    return () => {
    subscription.unsubscribe();
    };
  }, []);

  if (loading) return <p>Carregando...</p>;
  return authenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
