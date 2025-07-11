// Dashboard solo per admin ovvero i coach

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Metriche from './Metriche';
import './Dashboard.css'; // Importa il CSS per la Dashboard


function Dashboard({ utente }) {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState({});
  const [note, setNote] = useState('');

  // Carica appuntamenti da localStorage
  useEffect(() => {
    const datiSalvati = localStorage.getItem('appuntamentiCoach');
    if (datiSalvati) {
      setAppointments(JSON.parse(datiSalvati));
    }
  }, []);

  // Quando cambio data o appuntamenti, aggiorno la nota mostrata
  useEffect(() => {
    const dataKey = selectedDate.toISOString().slice(0, 10);
    setNote(appointments[dataKey] || '');
  }, [selectedDate, appointments]);

  // Protezione accesso
  if (!utente || utente.ruolo !== 'admin') {
    return (
      <div style={{ padding: 30, textAlign: 'center', color: 'red' }}>
        <h2>Accesso negato</h2>
        <p>Questa pagina è riservata ai coach.</p>
        <button onClick={() => navigate('/')}>Torna alla Home</button>
      </div>
    );
  }

  // Salva nota appuntamento
  const salvaAppuntamento = () => {
    const dataKey = selectedDate.toISOString().slice(0, 10);
    const nuovoAppuntamento = {
      ...appointments,
      [dataKey]: note,
    };
    setAppointments(nuovoAppuntamento);
    localStorage.setItem('appuntamentiCoach', JSON.stringify(nuovoAppuntamento));
  };

  const dataKey = selectedDate.toISOString().slice(0, 10);
  const notaDelGiorno = appointments[dataKey] || '';

  return (
    <div style={{ padding: '2rem', color: '#f0f0f0' }}>
      <h1 style={{ textAlign: 'center', color: '#00bfa6' }}>Dashboard Coach</h1>

      {/* METRICHE */}
      <section>
        <Metriche />
      </section>

      {/* CALENDARIO */}
      <section
        style={{
          maxWidth: 600,
          margin: '4rem auto',
          backgroundColor: '#1e1e1e',
          padding: '2rem',
          borderRadius: 10,
        }}
      >
        <h2 style={{ color: '#00bfa6', textAlign: 'center' }}>Appuntamenti</h2>

        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          locale="it-IT"
          tileContent={({ date }) => {
            const key = date.toISOString().slice(0, 10);
            if (appointments[key]) {
              return <div style={{ fontSize: '0.7rem', color: '#00bfa6' }}>✔</div>;
            }
          }}
        />

        <div style={{ marginTop: 20 }}>
          <h3 style={{ color: '#00bfa6' }}>Appuntamento per il {dataKey}</h3>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Scrivi una nota o appuntamento..."
            style={{
              width: '100%',
              height: 80,
              padding: '0.5rem',
              backgroundColor: '#121212',
              color: '#f0f0f0',
              border: '1px solid #00bfa6',
              borderRadius: 4,
              marginBottom: 10,
            }}
          />
          <button
            onClick={salvaAppuntamento}
            style={{
              backgroundColor: '#00675b',
              border: 'none',
              color: '#f0f0f0',
              padding: '0.5rem 1rem',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Salva Appuntamento
          </button>

          {notaDelGiorno && (
            <div style={{ marginTop: 10, fontStyle: 'italic', color: '#a0ffa0' }}>
              <strong>Nota salvata:</strong> {notaDelGiorno}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
