
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db } from '../services/mockDatabase';
import { Item, ScanEvent } from '../types';

const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [scans, setScans] = useState<ScanEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const found = await db.items.getById(id);
          if (found) {
            setItem(found);
            const fetchedScans = await db.scans.getByItem(id);
            setScans(fetchedScans);
          } else {
            navigate('/dashboard');
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to remove this item?') && id) {
      await db.items.delete(id);
      navigate('/dashboard');
    }
  };

  if (isLoading) return <div className="p-12 text-center"><i className="fas fa-spinner fa-spin text-3xl"></i></div>;
  if (!item) return <div className="p-12 text-center">Not found.</div>;

  return (
    <div className="space-y-6 pb-20 md:pb-0 max-w-4xl mx-auto">
      <header className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-brand-blue">
          <i className="fas fa-arrow-left mr-2"></i> Back
        </button>
        <div className="flex space-x-2">
           <button onClick={handleDelete} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
             <i className="fas fa-trash"></i>
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            <img src={item.photoUrl} alt={item.name} className="w-full h-64 object-cover" />
            <div className="p-6">
              <div className="inline-block bg-brand-yellow/30 text-brand-dark px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
                {item.category}
              </div>
              <h1 className="text-3xl font-black text-brand-dark mb-4">{item.name}</h1>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          </div>

          <div className="flex gap-4">
             <Link to={`/templates/${item.id}`} className="flex-1 bg-brand-blue text-white p-4 rounded-2xl font-bold flex items-center justify-center shadow-lg">
                <i className="fas fa-qrcode mr-2"></i>
                Get QR Sticker
             </Link>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-brand-dark">Recent Scan History</h2>
          {scans.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl text-center border-2 border-dashed border-gray-200">
               <p className="text-gray-400">No scans reported yet.</p>
               <p className="text-xs text-gray-500 mt-2">When someone scans your sticker, its location will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {scans.map(scan => (
                <div key={scan.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-xl text-green-600">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="flex-grow">
                    <div className="text-sm font-bold text-gray-800">Location Spotted</div>
                    <div className="text-xs text-gray-500">
                      {new Date(scan.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <a 
                    href={`https://www.google.com/maps?q=${scan.latitude},${scan.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-brand-blue/10 text-brand-blue text-xs font-bold px-3 py-2 rounded-lg"
                  >
                    View Map
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
