//Market page con elenco prodotti

import React from 'react';
import { Link } from 'react-router-dom';

const products = [
  {
    id: '1',
    name: 'Bilanciere',
    price: 100,
    image: 'https://images.unsplash.com/photo-1583454110559-8a206eaa5829?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '2',
    name: 'Manubri',
    price: 50,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '3',
    name: 'Panca Piana',
    price: 150,
    image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '4',
    name: 'Cinghie Sollevamento',
    price: 20,
    image: 'https://images.unsplash.com/photo-1558611848-73f7eb4001e2?auto=format&fit=crop&w=400&q=80',
  },
];

const cardStyle = {
  backgroundColor: '#1a1a1a',
  borderRadius: '8px',
  padding: '10px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  color: 'rgba(255, 255, 255, 0.87)',
  textDecoration: 'none',
  border: '1px solid transparent',
  transition: 'border-color 0.25s',
  cursor: 'pointer',
};

const cardHoverStyle = {
  borderColor: '#646cff',
};

const imgStyle = {
  width: '100%',
  height: '150px',
  objectFit: 'cover',
  borderRadius: '6px',
  marginBottom: '10px',
};

function Market() {
  const [hoveredId, setHoveredId] = React.useState(null);

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: '0 auto', color: 'rgba(255, 255, 255, 0.87)' }}>
      <h1>Market Palestra</h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20,
          marginTop: 20,
        }}
      >
        {products.map(product => (
          <Link
            to={`/market/product/${product.id}`}
            key={product.id}
            style={{
              ...cardStyle,
              ...(hoveredId === product.id ? cardHoverStyle : {}),
            }}
            onMouseEnter={() => setHoveredId(product.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <img src={product.image} alt={product.name} style={imgStyle} />
            <h2 style={{ margin: '10px 0 5px', fontWeight: 500 }}>{product.name}</h2>
            <p style={{ fontWeight: '700', margin: 0 }}>€{product.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Market;
