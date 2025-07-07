import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Home({ utente, onLogout }) {
  const [greeting, setGreeting] = useState('Ciao');
  const location = useLocation();

  // Per evidenziare la card attiva
  const [activeLink, setActiveLink] = useState(location.pathname);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Buongiorno');
    else if (hour < 18) setGreeting('Buon pomeriggio');
    else setGreeting('Buonasera');
  }, []);

  // Effetto fade-in
  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => {
    setFadeIn(true);
  }, []);

  if (!utente) return null;

  const links = [
    { to: '/allenamento', label: 'Allenamento' },
    { to: '/progressioni', label: 'Progressioni' },
    { to: '/metriche', label: 'Metriche' },
    { to: '/profilo', label: 'Profilo' },
    { to: '/note', label: 'Note' },
  ];

  return (
    <div
      style={{
        padding: '2rem',
        opacity: fadeIn ? 1 : 0,
        transition: 'opacity 0.7s ease-in',
        userSelect: 'none',
      }}
    >
      <h1 style={{ color: '#00bfa6', marginBottom: '1.5rem' }}>
        {greeting} {utente.username} 👋
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {links.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            onClick={() => setActiveLink(to)}
            style={{
              ...blockStyle,
              borderColor: activeLink === to ? '#00ffc8' : '#00bfa6',
              backgroundColor: activeLink === to ? '#007f71' : '#1e1e1e',
              boxShadow:
                activeLink === to
                  ? '0 0 12px #00ffc8'
                  : '0 0 5px rgba(0, 191, 166, 0.3)',
              transform: activeLink === to ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.3s ease',
            }}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
            onMouseUp={e => (e.currentTarget.style.transform = activeLink === to ? 'scale(1.05)' : 'scale(1)')}
            onMouseLeave={e => (e.currentTarget.style.transform = activeLink === to ? 'scale(1.05)' : 'scale(1)')}
          >
            {label}
          </Link>
        ))}

      <button
        onClick={onLogout}
        style={{
          backgroundColor: '#00bfa6',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          color: '#121212',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 0 10px #00bfa6',
          transition: 'box-shadow 0.3s ease-in-out',
        }}
        onMouseEnter={e =>
          (e.currentTarget.style.boxShadow = '0 0 20px #00ffd0')
        }
        onMouseLeave={e =>
          (e.currentTarget.style.boxShadow = '0 0 10px #00bfa6')
        }
      >
        Logout
      </button>

      </div>
    </div>
  );
}

const blockStyle = {
  backgroundColor: '#1e1e1e',
  padding: '2rem',
  textAlign: 'center',
  borderRadius: '12px',
  textDecoration: 'none',
  color: '#00bfa6',
  fontWeight: 'bold',
  border: '2px solid #00bfa6',
  cursor: 'pointer',
  userSelect: 'none',
};

export default Home;
