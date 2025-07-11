//Progressioni per il monitoraggio dei progressi fisici degli atleti attraverso foto settimanali

import { useState, useEffect } from 'react';

function Progressioni({ utente }) {
  const [progressioni, setProgressioni] = useState([]);
  const [settimanaCorrente, setSettimanaCorrente] = useState('');
  const [fotoCaricate, setFotoCaricate] = useState({
    frontale: null,
    laterale: null,
    posteriore: null
  });
  const [uploadInCorso, setUploadInCorso] = useState(false);

  useEffect(() => {
    // Carica progressioni esistenti dal localStorage
    const progressioniSalvate = localStorage.getItem(`progressioni_${utente.username}`);
    if (progressioniSalvate) {
      setProgressioni(JSON.parse(progressioniSalvate));
    }
    
    // Imposta settimana corrente
    const oggi = new Date();
    const settimana = `Settimana ${Math.ceil((oggi.getDate()) / 7)} - ${oggi.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}`;
    setSettimanaCorrente(settimana);
  }, [utente.username]);

  const handleFileUpload = (tipo, file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFotoCaricate(prev => ({
          ...prev,
          [tipo]: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const salvaProgressione = () => {
    if (!fotoCaricate.frontale || !fotoCaricate.laterale || !fotoCaricate.posteriore) {
      alert('Per favore carica tutte e tre le foto (frontale, laterale, posteriore)');
      return;
    }

    setUploadInCorso(true);
    
    // Simula upload (in una app reale useresti un API)
    setTimeout(() => {
      const nuovaProgressione = {
        id: Date.now(),
        settimana: settimanaCorrente,
        data: new Date().toISOString(),
        foto: { ...fotoCaricate },
        atleta: utente.username
      };

      const nuoveProgressioni = [...progressioni, nuovaProgressione];
      setProgressioni(nuoveProgressioni);
      
      // Salva nel localStorage
      localStorage.setItem(`progressioni_${utente.username}`, JSON.stringify(nuoveProgressioni));
      
      // Reset form
      setFotoCaricate({
        frontale: null,
        laterale: null,
        posteriore: null
      });
      
      setUploadInCorso(false);
      alert('Progressione salvata con successo!');
    }, 1500);
  };

  const eliminaProgressione = (id) => {
    if (utente.ruolo === 'atleta' && window.confirm('Sei sicuro di voler eliminare questa progressione?')) {
      const progressioniAggiornate = progressioni.filter(p => p.id !== id);
      setProgressioni(progressioniAggiornate);
      localStorage.setItem(`progressioni_${utente.username}`, JSON.stringify(progressioniAggiornate));
    }
  };

  const PhotoUpload = ({ tipo, foto }) => (
    <div style={styles.photoUpload}>
      <h4 style={styles.photoTitle}>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</h4>
      <div style={styles.photoContainer}>
        {foto ? (
          <img src={foto} alt={`Foto ${tipo}`} style={styles.photoPreview} />
        ) : (
          <div style={styles.photoPlaceholder}>
            <span style={styles.photoIcon}>📷</span>
            <p style={styles.photoText}>Clicca per caricare</p>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(tipo, e.target.files[0])}
          style={styles.fileInput}
        />
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.mainTitle}>Progressioni Fisiche</h2>
        <p style={styles.subtitle}>
          {utente.ruolo === 'atleta' 
            ? 'Carica le tue foto settimanali per monitorare i progressi' 
            : `Progressioni di ${utente.username}`}
        </p>
      </div>

      {/* Sezione Upload - Solo per Atleti */}
      {utente.ruolo === 'atleta' && (
        <div style={styles.uploadSection}>
          <div style={styles.uploadHeader}>
            <h3 style={styles.sectionTitle}>Carica Foto della Settimana</h3>
            <span style={styles.settimanaCard}>{settimanaCorrente}</span>
          </div>
          
          <div style={styles.photosGrid}>
            <PhotoUpload tipo="frontale" foto={fotoCaricate.frontale} />
            <PhotoUpload tipo="laterale" foto={fotoCaricate.laterale} />
            <PhotoUpload tipo="posteriore" foto={fotoCaricate.posteriore} />
          </div>

          <button 
            style={{
              ...styles.saveButton,
              ...(uploadInCorso ? styles.saveButtonLoading : {}),
            }}
            onClick={salvaProgressione}
            disabled={uploadInCorso}
          >
            {uploadInCorso ? '⏳ Salvando...' : '💾 Salva Progressione'}
          </button>
        </div>
      )}

      {/* Sezione Storico Progressioni */}
      <div style={styles.storicoSection}>
        <h3 style={styles.sectionTitle}>Storico Progressioni</h3>
        
        {progressioni.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>Nessuna progressione ancora caricata</p>
            {utente.ruolo === 'atleta' && (
              <p style={styles.emptyHint}>Inizia caricando le tue prime foto!</p>
            )}
          </div>
        ) : (
          <div style={styles.progressioniTimeline}>
            {progressioni.slice().reverse().map((progressione) => (
              <div key={progressione.id} style={styles.progressioneCard}>
                <div style={styles.cardHeader}>
                  <h4 style={styles.cardTitle}>{progressione.settimana}</h4>
                  <div style={styles.cardActions}>
                    <span style={styles.dataText}>
                      {new Date(progressione.data).toLocaleDateString('it-IT')}
                    </span>
                    {utente.ruolo === 'atleta' && (
                      <button 
                        style={styles.deleteButton}
                        onClick={() => eliminaProgressione(progressione.id)}
                        title="Elimina progressione"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
                
                <div style={styles.fotoGrid}>
                  <div style={styles.fotoItem}>
                    <img src={progressione.foto.frontale} alt="Frontale" style={styles.fotoImage} />
                    <span style={styles.fotoLabel}>Frontale</span>
                  </div>
                  <div style={styles.fotoItem}>
                    <img src={progressione.foto.laterale} alt="Laterale" style={styles.fotoImage} />
                    <span style={styles.fotoLabel}>Laterale</span>
                  </div>
                  <div style={styles.fotoItem}>
                    <img src={progressione.foto.posteriore} alt="Posteriore" style={styles.fotoImage} />
                    <span style={styles.fotoLabel}>Posteriore</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Suggerimenti per Coach */}
      {utente.ruolo === 'coach' && (
        <div style={styles.coachTips}>
          <h4 style={styles.tipsTitle}>💡 Suggerimenti per il Coach</h4>
          <ul style={styles.tipsList}>
            <li style={styles.tipItem}>✓ Le foto vengono caricate settimanalmente dagli atleti</li>
            <li style={styles.tipItem}>✓ Utilizza le progressioni per valutare i cambiamenti fisici</li>
            <li style={styles.tipItem}>✓ Combina con i dati delle metriche per un'analisi completa</li>
          </ul>
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
    textAlign: 'center',
    marginBottom: '2rem',
  },
  mainTitle: {
    color: '#00bfa6',
    fontSize: '2.5rem',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#bbb',
    fontSize: '1.1rem',
    margin: 0,
  },
  uploadSection: {
    background: '#1e1e1e',
    padding: '2rem',
    borderRadius: '15px',
    marginBottom: '2rem',
    border: '2px solid #00bfa6',
  },
  uploadHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  sectionTitle: {
    color: '#00bfa6',
    margin: 0,
    fontSize: '1.8rem',
    fontWeight: 'bold',
  },
  settimanaCard: {
    background: '#00bfa6',
    color: '#121212',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '0.9rem',
  },
  photosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  photoUpload: {
    textAlign: 'center',
  },
  photoTitle: {
    color: '#f0f0f0',
    marginBottom: '1rem',
    fontSize: '1.2rem',
  },
  photoContainer: {
    position: 'relative',
    border: '3px dashed #555',
    borderRadius: '10px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    aspectRatio: '3/4',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  photoPlaceholder: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#2a2a2a',
    color: '#888',
  },
  photoIcon: {
    fontSize: '3rem',
    marginBottom: '0.5rem',
  },
  photoText: {
    margin: 0,
    fontWeight: '500',
  },
  fileInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
  },
  saveButton: {
    width: '100%',
    padding: '1rem',
    background: 'linear-gradient(135deg, #00bfa6, #00897b)',
    color: '#121212',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  saveButtonLoading: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  storicoSection: {
    background: '#1e1e1e',
    padding: '2rem',
    borderRadius: '15px',
    marginBottom: '2rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem 1rem',
    color: '#888',
  },
  emptyText: {
    fontSize: '1.2rem',
    marginBottom: '0.5rem',
  },
  emptyHint: {
    fontStyle: 'italic',
    color: '#666',
  },
  progressioniTimeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  progressioneCard: {
    background: '#2a2a2a',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid #333',
    transition: 'all 0.3s ease',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #333',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  cardTitle: {
    color: '#00bfa6',
    margin: 0,
    fontSize: '1.4rem',
  },
  cardActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  dataText: {
    color: '#bbb',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  deleteButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: '0.3rem',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
    color: '#f0f0f0',
  },
  fotoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
  },
  fotoItem: {
    textAlign: 'center',
  },
  fotoImage: {
    width: '100%',
    aspectRatio: '3/4',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '2px solid #333',
    transition: 'all 0.3s ease',
  },
  fotoLabel: {
    display: 'block',
    marginTop: '0.5rem',
    color: '#bbb',
    fontWeight: '500',
    fontSize: '0.9rem',
  },
  coachTips: {
    background: 'linear-gradient(135deg, #00bfa6, #00897b)',
    color: '#121212',
    padding: '1.5rem',
    borderRadius: '15px',
    marginTop: '1rem',
  },
  tipsTitle: {
    marginBottom: '1rem',
    fontSize: '1.3rem',
    fontWeight: 'bold',
  },
  tipsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  tipItem: {
    padding: '0.5rem 0',
    borderBottom: '1px solid rgba(18, 18, 18, 0.2)',
    fontWeight: '500',
  },
};

export default Progressioni;