import { useParams } from 'react-router-dom';

const products = [
  { id: '1', name: 'Bilanciere', price: 100, description: 'Bilanciere professionale' },
  { id: '2', name: 'Manubri', price: 50, description: 'Set di manubri regolabili' },
  { id: '3', name: 'Panca Piana', price: 150, description: 'Panca regolabile per allenamento' },
  { id: '4', name: 'Cinghie Sollevamento', price: 20, description: 'Cinghie per sollevamento pesi' },
];

// ProductDetail component to display product details
function ProductDetail() {
  const { id } = useParams();
  const product = products.find(p => p.id === id);

  if (!product) return <p>Prodotto non trovato</p>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Prezzo: €{product.price}</p>
      <p>{product.description}</p>
    </div>
  );
}

export default ProductDetail;
