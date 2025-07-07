import { useState } from 'react';

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('atleta'); // ruolo di default

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() !== '') {
      onLogin({ username, role });
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      style={{
        maxWidth: '400px',
        margin: '4rem auto',
        padding: '2rem',
        backgroundColor: '#121212',
        borderRadius: '12px',
        boxShadow: '0 0 10px rgba(0, 191, 166, 0.5)',
        color: '#f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <h2 style={{ textAlign: 'center', color: '#00bfa6' }}>GymPro</h2>

      <input
        type="text"
        placeholder="Inserisci il tuo nome"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{
          padding: '0.7rem 1rem',
          borderRadius: '8px',
          border: '2px solid #00bfa6',
          backgroundColor: '#1e1e1e',
          color: '#f0f0f0',
          fontSize: '1rem',
          outline: 'none',
          transition: 'border-color 0.3s',
        }}
        onFocus={e => e.target.style.borderColor = '#00fff7'}
        onBlur={e => e.target.style.borderColor = '#00bfa6'}
      />

      <label style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', fontWeight: 'bold' }}>
        Ruolo:
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{
            flex: 1,
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: '2px solid #00bfa6',
            backgroundColor: '#1e1e1e',
            color: '#f0f0f0',
            fontSize: '1rem',
            outline: 'none',
            cursor: 'pointer',
            transition: 'border-color 0.3s',
          }}
          onFocus={e => e.target.style.borderColor = '#00fff7'}
          onBlur={e => e.target.style.borderColor = '#00bfa6'}
        >
          <option value="atleta">Atleta</option>
          <option value="admin">Coach (Admin)</option>
        </select>
      </label>

      <button
        type="submit"
        style={{
          backgroundColor: '#00bfa6',
          border: 'none',
          padding: '0.75rem',
          borderRadius: '12px',
          color: '#121212',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={e => e.target.style.backgroundColor = '#00d6ad'}
        onMouseLeave={e => e.target.style.backgroundColor = '#00bfa6'}
      >
        Accedi
      </button>
    </form>
  );
}

export default LoginForm;
