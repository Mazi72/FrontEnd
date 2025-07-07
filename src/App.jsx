import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Allenamento from './pages/Allenamento';
import Progressioni from './pages/Progressioni';
import Metriche from './pages/Metriche';
import Profilo from './pages/Profilo';
import Note from './pages/Note';
import Layout from './components/Layout';
import LoginForm from './components/LoginForm';

function App() {
  const [utente, setUtente] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem('username');
    const ruolo = localStorage.getItem('ruolo');
    if (username && ruolo) {
      setUtente({ username, ruolo });
    }
  }, []);

  const handleLogin = ({ username, role }) => {
    localStorage.setItem('username', username);
    localStorage.setItem('ruolo', role);
    setUtente({ username, ruolo: role });
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('ruolo');
    setUtente(null);
  };

  // Se non loggato, mostra solo il LoginForm
  if (!utente) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home utente={utente} onLogout={handleLogout} />} />

        {/* Rotte protette dentro il layout */}
        <Route element={<Layout utente={utente} onLogout={handleLogout} />}>
          <Route path="/allenamento" element={<Allenamento utente={utente} />} />
          <Route path="/progressioni" element={<Progressioni utente={utente} />} />
          <Route path="/metriche" element={<Metriche utente={utente} />} />
          <Route path="/profilo" element={<Profilo utente={utente} />} />
          <Route path="/note" element={<Note utente={utente} />} />
        </Route>

        {/* Rotta fallback per percorsi sconosciuti */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
