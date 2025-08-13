import { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import ChatWindow from '../components/ChatWindow';
import { isAuthenticated } from '../utils/auth';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleRegister = () => {
    setIsLoggedIn(true);
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (isLoggedIn) {
    return <ChatWindow onLogout={handleLogout} />;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <h1>Messaging App</h1>
      </div>
      
      {showRegister ? (
        <RegisterForm 
          onRegister={handleRegister}
          onSwitchToLogin={() => setShowRegister(false)}
        />
      ) : (
        <LoginForm 
          onLogin={handleLogin}
          onSwitchToRegister={() => setShowRegister(true)}
        />
      )}
    </div>
  );
}