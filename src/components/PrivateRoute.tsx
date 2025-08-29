import React, { useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

interface Props {
  children: ReactNode;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function check() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;

      const isVerified = !!session?.user?.email_confirmed_at;
      setAllowed(!!session && isVerified);
      setLoading(false);
    }

    check();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      const isVerified = !!session?.user?.email_confirmed_at;
      setAllowed(!!session && isVerified);
    });

    return () => {
      mounted = false;
      subscription.subscription?.unsubscribe();
    };
  }, []);

  if (loading) return <div />; // ou um spinner
  return allowed ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
