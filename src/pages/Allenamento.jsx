/**
 * File: allenamento.jsx
 * 
 * Descrizione:
 * Questo componente React implementa la visualizzazione e la modifica di una *scheda di allenamento settimanale*,
 * con funzionalità personalizzate in base al ruolo dell'utente ("coach" o "atleta").
 * 
 * Funzionalità principali:
 * - Visualizza la lista di esercizi suddivisi per giorno della settimana.
 * - Permette al coach (ruolo "admin") di:
 *   - Aggiungere esercizi cercandoli tramite API esterna (ExerciseDB).
 *   - Inserire esercizi manualmente con nome, serie, ripetizioni, peso, ecc.
 *   - Modificare o rimuovere esercizi già presenti.
 * - L'atleta (ruolo "atleta") può solo compilare i campi relativi a peso e ripetizioni.
 * 
 * Struttura:
 * - `EsercizioSearch`: sottocomponente modale per cercare esercizi tramite API e selezionarli.
 * - `Allenamento`: componente principale che gestisce la scheda settimanale e interazioni utente.
 * - I dati vengono salvati su `localStorage` per mantenere la persistenza locale.
 * 
 * Dipendenze:
 * - React (hook: useState, useEffect)
 * - API esterna ExerciseDB per la ricerca di esercizi (richiede chiave RapidAPI)
 * 
 * Note:
 * - La logica di salvataggio automatico evita la necessità di un pulsante "Salva".
 * - Ogni giorno della settimana può contenere una lista di esercizi personalizzabili.
 * - L’interfaccia si adatta dinamicamente al ruolo dell’utente per semplificare l’esperienza.
 */


import React, { useState, useEffect } from 'react';

const giorniSettimana = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

// Componente per la ricerca di esercizi
const EsercizioSearch = ({ onSelectEsercizio, isVisible, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [esercizi, setEsercizi] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Funzione per cercare esercizi dall'API
  const searchEsercizi = async (term) => {
    if (!term || term.length < 2) {
      setEsercizi([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(term)}?limit=10`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '49fbbf0055msh9df73f1aa9621e9p1b4392jsn3',// Api Key personale
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error('Errore nella ricerca');
      }

      const data = await response.json();
      setEsercizi(data);
    } catch (err) {
      setError('Errore nel caricamento degli esercizi');
      console.error('Errore API:', err);

      setEsercizi([
        { id: 1, name: 'Push-up', target: 'chest', bodyPart: 'chest', equipment: 'body weight' },
        { id: 2, name: 'Squat', target: 'quadriceps', bodyPart: 'upper legs', equipment: 'body weight' },
        { id: 3, name: 'Pull-up', target: 'lats', bodyPart: 'back', equipment: 'body weight' },
        { id: 4, name: 'Bench Press', target: 'pectorals', bodyPart: 'chest', equipment: 'barbell' },
        { id: 5, name: 'Deadlift', target: 'glutes', bodyPart: 'upper legs', equipment: 'barbell' }
      ].filter(ex => ex.name.toLowerCase().includes(term.toLowerCase())));
    } finally {
      setLoading(false);
    }
  };

  // Debounce per la ricerca
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        searchEsercizi(searchTerm);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelectEsercizio = (esercizio) => {
    onSelectEsercizio(esercizio);
    setSearchTerm('');
    setEsercizi([]);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>Cerca Esercizio</h3>
          <button onClick={onClose} style={styles.closeButton}>×</button>
        </div>
        
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Cerca esercizio... (es: push up, squat)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
            autoFocus
          />
          {loading && <div style={styles.loadingText}>Caricamento...</div>}
          {error && <div style={styles.errorText}>{error}</div>}
        </div>

        <div style={styles.risultatiContainer}>
          {esercizi.length > 0 && (
            <div style={styles.risultatiLista}>
              {esercizi.map((esercizio) => (
                <div
                  key={esercizio.id}
                  style={styles.risultatoItem}
                  onClick={() => handleSelectEsercizio(esercizio)}
                >
                  <div style={styles.esercizioNome}>{esercizio.name}</div>
                  <div style={styles.esercizioDettagli}>
                    <span style={styles.bodyPart}>{esercizio.bodyPart}</span>
                    <span style={styles.target}>{esercizio.target}</span>
                    <span style={styles.equipment}>{esercizio.equipment}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {searchTerm && esercizi.length === 0 && !loading && (
            <div style={styles.noResults}>
              Nessun esercizio trovato per "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function Allenamento() {
  const [scheda, setScheda] = useState({});
  const [ruolo, setRuolo] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [currentGiorno, setCurrentGiorno] = useState('');

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
    setCurrentGiorno(giorno);
    setShowSearchModal(true);
  };

  const aggiungiEsercizioVuoto = (giorno) => {
    const nuovaScheda = { ...scheda };
    nuovaScheda[giorno] = [...(nuovaScheda[giorno] || []), { 
      nome: '', 
      serieRipetizioni: '', 
      peso: '', 
      ripetizioni: '',
      target: '',
      bodyPart: '',
      equipment: ''
    }];
    salvaScheda(nuovaScheda);
  };

  const handleSelectEsercizio = (esercizio) => {
    const nuovaScheda = { ...scheda };
    nuovaScheda[currentGiorno] = [...(nuovaScheda[currentGiorno] || []), { 
      nome: esercizio.name, 
      serieRipetizioni: '', 
      peso: '', 
      ripetizioni: '',
      target: esercizio.target,
      bodyPart: esercizio.bodyPart,
      equipment: esercizio.equipment
    }];
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
                      {esercizio.bodyPart && (
                        <div style={styles.esercizioInfo}>
                          <span style={styles.infoBadge}>{esercizio.bodyPart}</span>
                          {esercizio.equipment && (
                            <span style={styles.infoBadge}>{esercizio.equipment}</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.inputLabel}>Serie x Rip</label>
                      <input
                        type="text"
                        placeholder="3x8"
                        value={esercizio.serieRipetizioni || ''}
                        onChange={e => modificaEsercizio(giorno, idx, 'serieRipetizioni', e.target.value)}
                        disabled={ruolo !== 'admin'}
                        style={{
                          ...styles.input,
                          ...styles.inputSerieRip,
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
              <div style={styles.buttonGroup}>
                <button
                  onClick={() => aggiungiEsercizio(giorno)}
                  style={styles.addButton}
                >
                  🔍 Cerca Esercizio
                </button>
                <button
                  onClick={() => aggiungiEsercizioVuoto(giorno)}
                  style={styles.addButtonSecondary}
                >
                  ➕ Aggiungi Manualmente
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {ruolo === 'admin' && (
        <div style={styles.coachInfo}>
          <h4 style={styles.infoTitle}>Modalità Coach</h4>
          <p style={styles.infoText}>
            Puoi cercare esercizi dal database ExerciseDB o aggiungere esercizi manualmente. 
            Imposta serie x ripetizioni (es: 3x8, 4x10). Gli atleti potranno solo inserire pesi e ripetizioni effettive.
          </p>
        </div>
      )}

      {ruolo === 'atleta' && (
        <div style={styles.atletaInfo}>
          <h4 style={styles.infoTitle}>Modalità Atleta</h4>
          <p style={styles.infoText}>
            Inserisci i pesi e le ripetizioni per ogni esercizio. 
            La scheda e le serie sono state impostate dal tuo coach.
          </p>
        </div>
      )}

      <EsercizioSearch
        isVisible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSelectEsercizio={handleSelectEsercizio}
      />
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
    gridTemplateColumns: 'auto 2fr 1fr 1fr 1fr auto',
    gap: '1rem',
    alignItems: 'start',
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
    marginTop: '1.5rem',
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
  inputSerieRip: {
    textAlign: 'center',
    minWidth: '80px',
    fontWeight: 'bold',
    color: '#00bfa6',
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
  esercizioInfo: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.5rem',
    flexWrap: 'wrap',
  },
  infoBadge: {
    background: '#00bfa6',
    color: '#121212',
    padding: '0.2rem 0.5rem',
    borderRadius: '10px',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
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
    marginTop: '1.5rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  addButton: {
    flex: 1,
    padding: '1rem',
    backgroundColor: '#00bfa6',
    border: 'none',
    borderRadius: '10px',
    color: '#121212',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minWidth: '200px',
  },
  addButtonSecondary: {
    flex: 1,
    padding: '1rem',
    backgroundColor: '#333',
    border: 'none',
    borderRadius: '10px',
    color: '#f0f0f0',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minWidth: '200px',
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
  // Stili per il modal di ricerca
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: '#1e1e1e',
    borderRadius: '15px',
    padding: '2rem',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflow: 'auto',
    border: '1px solid #333',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #00bfa6',
  },
  modalTitle: {
    color: '#00bfa6',
    fontSize: '1.5rem',
    margin: 0,
    fontWeight: 'bold',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#f0f0f0',
    fontSize: '2rem',
    cursor: 'pointer',
    padding: '0',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.3s ease',
  },
  searchContainer: {
    marginBottom: '1.5rem',
  },
  searchInput: {
    width: '100%',
    padding: '1rem',
    border: '2px solid #333',
    borderRadius: '10px',
    background: '#2a2a2a',
    color: '#f0f0f0',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },
  loadingText: {
    textAlign: 'center',
    color: '#00bfa6',
    padding: '1rem',
    fontSize: '1rem',
  },
  errorText: {
    textAlign: 'center',
    color: '#d32f2f',
    padding: '1rem',
    fontSize: '1rem',
  },
  risultatiContainer: {
    maxHeight: '400px',
    overflowY: 'auto',
  },
  risultatiLista: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  risultatoItem: {
    background: '#2a2a2a',
    padding: '1rem',
    borderRadius: '10px',
    border: '1px solid #333',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  esercizioNome: {
    color: '#f0f0f0',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
  esercizioDettagli: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  bodyPart: {
    background: '#00bfa6',
    color: '#121212',
    padding: '0.2rem 0.5rem',
    borderRadius: '8px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  target: {
    background: '#2196f3',
    color: 'white',
    padding: '0.2rem 0.5rem',
    borderRadius: '8px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  equipment: {
    background: '#ff9800',
    color: 'white',
    padding: '0.2rem 0.5rem',
    borderRadius: '8px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  noResults: {
    textAlign: 'center',
    color: '#888',
    padding: '2rem',
    fontSize: '1rem',
    fontStyle: 'italic',
  },
};

export default Allenamento;