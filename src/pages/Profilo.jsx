// Profilo per i dati anagrafici dell'utente

import React, { useState, useEffect } from 'react';

function Profilo() {
  // stato per i dati anagrafici
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [foto, setFoto] = useState(null); // base della foto

  // Carica i dati da localStorage all’avvio
  useEffect(() => {
    const datiSalvati = localStorage.getItem('profiloUtente');
    if (datiSalvati) {
      const profilo = JSON.parse(datiSalvati);
      setNome(profilo.nome || '');
      setCognome(profilo.cognome || '');
      setEmail(profilo.email || '');
      setTelefono(profilo.telefono || '');
      setFoto(profilo.foto || null);
    }
  }, []);

  // Funzione per gestire il caricamento foto e convertirla in base64
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Salva i dati su localStorage
  const salvaProfilo = () => {
    const profilo = { nome, cognome, email, telefono, foto };
    localStorage.setItem('profiloUtente', JSON.stringify(profilo));
    alert('Profilo salvato!');
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', color: '#f0f0f0' }}>
      <h2>Profilo utente</h2>

      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        {foto ? (
          <img 
            src={foto} 
            alt="Foto Profilo" 
            style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #00bfa6' }}
          />
        ) : (
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#444', display: 'inline-block' }}></div>
        )}
        <input type="file" onChange={handleFotoChange} accept="image/*" />
      </div>

      <input 
        type="text" 
        placeholder="Nome" 
        value={nome} 
        onChange={e => setNome(e.target.value)} 
        style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
      />
      <input 
        type="text" 
        placeholder="Cognome" 
        value={cognome} 
        onChange={e => setCognome(e.target.value)} 
        style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
      />
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
        style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
      />
      <input 
        type="tel" 
        placeholder="Telefono" 
        value={telefono} 
        onChange={e => setTelefono(e.target.value)} 
        style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
      />

      <button 
        onClick={salvaProfilo} 
        style={{ backgroundColor: '#00bfa6', color: '#121212', padding: '0.7rem', border: 'none', width: '100%', fontWeight: 'bold' }}
      >
        Salva Profilo
      </button>
    </div>
  );
}

export default Profilo;
