import { useState, useEffect } from 'react';
import {
  Line
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const metricheLista = [
  { key: 'altezza', label: 'Altezza (cm)' },
  { key: 'peso', label: 'Peso (kg)' },
  { key: 'addome', label: 'Addome (cm)' },
  { key: 'braccioDx', label: 'Braccio Destro (cm)' },
  { key: 'braccioSx', label: 'Braccio Sinistro (cm)' },
  { key: 'cosciaDx', label: 'Coscia Destra (cm)' },
  { key: 'cosciaSx', label: 'Coscia Sinistra (cm)' },
  { key: 'fianchi', label: 'Fianchi (cm)' },
  { key: 'torace', label: 'Torace (cm)' },
  { key: 'vita', label: 'Vita (cm)' },
];

function Metriche() {
  const oggiStr = new Date().toISOString().slice(0, 10);
  const [dataInserimento, setDataInserimento] = useState(oggiStr);
  const [valori, setValori] = useState({});
  const [datiStorici, setDatiStorici] = useState([]);

  useEffect(() => {
    const dati = JSON.parse(localStorage.getItem('metricheStorico'));
    if (dati) setDatiStorici(dati);
  }, []);

  // Quando cambia la data selezionata, carico i valori di quella data
  useEffect(() => {
    const record = datiStorici.find(r => r.data === dataInserimento);
    if (record) {
      setValori(record.misure || {});
    } else {
      setValori({});
    }
  }, [dataInserimento, datiStorici]);

  const handleChange = (key, val) => {
    setValori((old) => ({
      ...old,
      [key]: val,
    }));
  };

  const salvaMetriche = () => {
    let nuoviDati = [...datiStorici];
    const indiceData = nuoviDati.findIndex(r => r.data === dataInserimento);

    if (indiceData !== -1) {
      // Aggiorno il record esistente
      nuoviDati[indiceData] = { data: dataInserimento, misure: { ...valori } };
    } else {
      // Aggiungo nuovo record
      nuoviDati.push({ data: dataInserimento, misure: { ...valori } });
      // Ordino per data
      nuoviDati.sort((a, b) => a.data.localeCompare(b.data));
      // Se supero 5 elementi, elimino il più vecchio
      if (nuoviDati.length > 5) {
        nuoviDati.shift();
      }
    }

    setDatiStorici(nuoviDati);
    localStorage.setItem('metricheStorico', JSON.stringify(nuoviDati));
    alert('Metriche salvate!');
  };

  const generaDatiGrafico = (key) => ({
    labels: datiStorici.map(r => r.data),
    datasets: [
      {
        label: metricheLista.find(m => m.key === key)?.label || '',
        data: datiStorici.map(r => parseFloat(r.misure[key]) || 0),
        fill: false,
        borderColor: '#00bfa6',
        backgroundColor: '#00675b',
        tension: 0.3,
      },
    ],
  });

  const opzioniGrafico = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#00bfa6',
          font: { size: 14, weight: 'bold' }
        }
      },
    },
    scales: {
      x: {
        ticks: { color: '#00bfa6' },
        grid: { color: '#333' }
      },
      y: {
        ticks: { color: '#00bfa6' },
        grid: { color: '#333' },
        beginAtZero: true,
      }
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: 'auto', color: '#f0f0f0' }}>
      <h2 style={{ color: '#00bfa6', textAlign: 'center' }}>Metriche Fisiche</h2>

      {/* Input data */}
      <div style={{ marginBottom: 20, textAlign: 'center' }}>
        <label htmlFor="data-metriche" style={{ marginRight: 10, fontWeight: 'bold' }}>Data:</label>
        <input
          type="date"
          id="data-metriche"
          value={dataInserimento}
          max={oggiStr}
          onChange={(e) => setDataInserimento(e.target.value)}
          style={{
            padding: '0.3rem 0.5rem',
            borderRadius: 4,
            border: '1px solid #00bfa6',
            backgroundColor: '#121212',
            color: '#f0f0f0',
            fontWeight: 'bold'
          }}
        />
      </div>

      {metricheLista.map(({ key, label }) => (
        <div key={key} style={{ marginBottom: '3rem' }}>
          <label style={{ fontWeight: 'bold' }}>{label}</label>
          <input
            type="number"
            step="0.1"
            value={valori[key] || ''}
            onChange={(e) => handleChange(key, e.target.value)}
            style={{
              marginLeft: 10,
              padding: '0.3rem 0.5rem',
              borderRadius: 4,
              border: '1px solid #00bfa6',
              width: 100,
              backgroundColor: '#121212',
              color: '#f0f0f0',
              marginBottom: 10,
              display: 'block'
            }}
          />

          <Line data={generaDatiGrafico(key)} options={opzioniGrafico} />
        </div>
      ))}
      
      <button
        onClick={salvaMetriche}
        style={{
          backgroundColor: '#00675b',
          border: 'none',
          color: '#f0f0f0',
          padding: '0.6rem 1.2rem',
          borderRadius: 6,
          cursor: 'pointer',
          fontWeight: 'bold',
          marginBottom: '2rem',
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        Salva Metriche
      </button>

    </div>
  );
}

export default Metriche;
