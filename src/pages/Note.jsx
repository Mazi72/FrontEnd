import { useState } from 'react';

function Note() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleAddNote = () => {
    if (!title.trim() || !content.trim()) return; // evita note vuote

    const newNote = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      title: title.trim(),
      content: content.trim(),
    };

    setNotes([newNote, ...notes]);
    setTitle('');
    setContent('');
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h2 style={{ color: '#00bfa6' }}>Le tue Note</h2>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Titolo della nota"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            fontSize: '1rem',
            marginBottom: '0.5rem',
            borderRadius: 6,
            border: '1px solid #ccc',
          }}
        />
        <textarea
          placeholder="Scrivi qui la tua nota..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          style={{
            width: '100%',
            padding: '0.5rem',
            fontSize: '1rem',
            borderRadius: 6,
            border: '1px solid #ccc',
          }}
        />
        <button
          onClick={handleAddNote}
          style={{
            marginTop: '0.5rem',
            backgroundColor: '#00bfa6',
            color: '#121212',
            border: 'none',
            padding: '0.6rem 1.2rem',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Aggiungi Nota
        </button>
      </div>

      <div>
        {notes.length === 0 ? (
          <p style={{ color: '#999' }}>Nessuna nota ancora.</p>
        ) : (
          notes.map(({ id, date, title, content }) => (
            <div
              key={id}
              style={{
                backgroundColor: '#1e1e1e',
                padding: '1rem',
                borderRadius: 8,
                marginBottom: '1rem',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: '#00bfa6', marginBottom: '0.3rem' }}>
                {date}
              </div>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>{title}</h3>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Note;
