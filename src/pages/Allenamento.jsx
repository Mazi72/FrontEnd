import React, { useState, useEffect } from 'react';

const giorniSettimana = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

function Allenamento() {
  const [scheda, setScheda] = useState({});
  const [ruolo, setRuolo] = useState('');

  useEffect(() => {
    const dati = localStorage.getItem('schedaAllenamento');
    const ruoloSalvato = localStorage.getItem('ruolo') || 'atleta';
    if (dati) {
      setScheda(JSON.parse(dati));
    } else {
      const iniziale = {};
      giorniSettimana.forEach(g => { iniziale[g] = []; });
      setScheda(iniziale);
    }
    setRuolo(ruoloSalvato);
  }, []);

  const salvaScheda = (nuovaScheda) => {
    setScheda(nuovaScheda);
    localStorage.setItem('schedaAllenamento', JSON.stringify(nuovaScheda));
  };

  const aggiungiEsercizio = (giorno) => {
    const nuovaScheda = { ...scheda };
    nuovaScheda[giorno] = [...(nuovaScheda[giorno] || []), { nome: '', peso: '', ripetizioni: '' }];
    salvaScheda(nuovaScheda);
  };

  const modificaEsercizio = (giorno, index, campo, valore) => {
    const nuovaScheda = { ...scheda };
    nuovaScheda[giorno][index][campo] = valore;
    salvaScheda(nuovaScheda);
  };

  const rimuoviEsercizio = (giorno, index) => {
    const nuovaScheda = { ...scheda };
    nuovaScheda[giorno].splice(index, 1);
    salvaScheda(nuovaScheda);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.mainTitle}>Scheda Allenamento</h2>
        <span style={styles.ruoloBadge}>
          {ruolo === 'admin' ? 'Coach' : 'Atleta'}
        </span>
      </div>

      <div style={styles.giornoContainer}>
        {giorniSettimana.map(giorno => (
          <div key={giorno} style={styles.giornoCard}>
            <div style={styles.giornoHeader}>
              <h3 style={styles.giornoTitle}>{giorno}</h3>
              <span style={styles.eserciziCount}>
                {(scheda[giorno] || []).length} esercizi
              </span>
            </div>

            <div style={styles.eserciziContainer}>
              {(scheda[giorno] || []).length === 0 ? (
                <div style={styles.emptyState}>
                  <p style={styles.emptyText}>
                    {ruolo === 'admin' ? 'Nessun esercizio programmato' : 'Giorno di riposo'}
                  </p>
                </div>
              ) : (
                (scheda[giorno] || []).map((esercizio, idx) => (
                  <div key={idx} style={styles.esercizioRow}>
                    <div style={styles.esercizioNumero}>
                      {idx + 1}
                    </div>
                    
                    <div style={styles.inputGroup}>
                      <label style={styles.inputLabel}>Esercizio</label>
                      <input
                        type="text"
                        placeholder="Nome esercizio"
                        value={esercizio.nome}
                        onChange={e => modificaEsercizio(giorno, idx, 'nome', e.target.value)}
                        disabled={ruolo !== 'admin'}
                        style={{
                          ...styles.input,
                          ...styles.inputNome,
                          ...(ruolo !== 'admin' ? styles.inputDisabled : {})
                        }}
                      />
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.inputLabel}>Peso (kg)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={esercizio.peso}
                        onChange={e => modificaEsercizio(giorno, idx, 'peso', e.target.value)}
                        style={{...styles.input, ...styles.inputNumber}}
                      />
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.inputLabel}>Ripetizioni</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={esercizio.ripetizioni}
                        onChange={e => modificaEsercizio(giorno, idx, 'ripetizioni', e.target.value)}
                        style={{...styles.input, ...styles.inputNumber}}
                      />
                    </div>

                    {ruolo === 'admin' && (
                      <button
                        onClick={() => rimuoviEsercizio(giorno, idx)}
                        style={styles.deleteButton}
                        title="Rimuovi esercizio"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {ruolo === 'admin' && (
              <button
                onClick={() => aggiungiEsercizio(giorno)}
                style={styles.addButton}
              >
                Aggiungi Esercizio
              </button>
            )}
          </div>
        ))}
      </div>

      {ruolo === 'admin' && (
        <div style={styles.coachInfo}>
          <h4 style={styles.infoTitle}>Modalità Coach</h4>
          <p style={styles.infoText}>
            Puoi modificare tutti gli esercizi e creare la scheda per l'atleta. 
            Gli atleti potranno solo inserire pesi e ripetizioni.
          </p>
        </div>
      )}

      {ruolo === 'atleta' && (
        <div style={styles.atletaInfo}>
          <h4 style={styles.infoTitle}>Modalità Atleta</h4>
          <p style={styles.infoText}>
            Inserisci i pesi e le ripetizioni per ogni esercizio. 
            La scheda è stata creata dal tuo coach.
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    color: '#f0f0f0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  mainTitle: {
    color: '#00bfa6',
    fontSize: '2.5rem',
    margin: 0,
    fontWeight: 'bold',
  },
  ruoloBadge: {
    background: '#00bfa6',
    color: '#121212',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '0.9rem',
  },
  giornoContainer: {
    display: 'grid',
    gap: '1.5rem',
  },
  giornoCard: {
    background: '#1e1e1e',
    borderRadius: '15px',
    padding: '1.5rem',
    border: '1px solid #333',
  },
  giornoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #00bfa6',
  },
  giornoTitle: {
    color: '#00bfa6',
    fontSize: '1.5rem',
    margin: 0,
    fontWeight: 'bold',
  },
  eserciziCount: {
    color: '#bbb',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  eserciziContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '2rem',
    color: '#888',
  },
  emptyText: {
    margin: 0,
    fontSize: '1.1rem',
    fontStyle: 'italic',
  },
  esercizioRow: {
    display: 'grid',
    gridTemplateColumns: 'auto 2fr 1fr 1fr auto',
    gap: '1rem',
    alignItems: 'end',
    background: '#2a2a2a',
    padding: '1rem',
    borderRadius: '10px',
    border: '1px solid #333',
  },
  esercizioNumero: {
    background: '#00bfa6',
    color: '#121212',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '0.9rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  inputLabel: {
    color: '#bbb',
    fontSize: '0.8rem',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  input: {
    padding: '0.8rem',
    border: '2px solid #333',
    borderRadius: '8px',
    background: '#1e1e1e',
    color: '#f0f0f0',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  inputNome: {
    minWidth: '200px',
  },
  inputNumber: {
    textAlign: 'center',
    minWidth: '80px',
  },
  inputDisabled: {
    backgroundColor: '#333',
    color: '#aaa',
    cursor: 'not-allowed',
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '35px',
    height: '35px',
    cursor: 'pointer',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#00bfa6',
    border: 'none',
    borderRadius: '10px',
    color: '#121212',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  coachInfo: {
    background: 'linear-gradient(135deg, #00bfa6, #00897b)',
    color: '#121212',
    padding: '1.5rem',
    borderRadius: '15px',
    marginTop: '2rem',
  },
  atletaInfo: {
    background: 'linear-gradient(135deg, #2196f3, #1976d2)',
    color: 'white',
    padding: '1.5rem',
    borderRadius: '15px',
    marginTop: '2rem',
  },
  infoTitle: {
    margin: '0 0 1rem 0',
    fontSize: '1.3rem',
    fontWeight: 'bold',
  },
  infoText: {
    margin: 0,
    fontSize: '1rem',
    lineHeight: '1.5',
  },
};

export default Allenamento;