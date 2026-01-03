
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Item, ScanEvent } from '../types';
import { db } from '../services/mockDatabase';

const Dashboard: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [scans, setScans] = useState<ScanEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = db.auth.getCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const [fetchedItems, fetchedScans] = await Promise.all([
            db.items.getByOwner(user.id),
            db.scans.getByOwner(user.id)
          ]);
          setItems(fetchedItems);
          setScans(fetchedScans);
        } catch (err) {
          console.error("Fetch error", err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[400px]">
      <i className="fas fa-spinner fa-spin text-4xl text-brand-blue"></i>
    </div>;
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-blue">My Items</h1>
          <p className="text-gray-500">Manage your registered valuables and QR stickers</p>
        </div>
        <Link 
          to="/add-item"
          className="bg-brand-blue text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-md hover:bg-brand-dark transition"
        >
          <i className="fas fa-plus"></i>
          <span>Register New Item</span>
        </Link>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-brand-yellow">
          <div className="text-gray-500 text-xs uppercase font-bold">Total Items</div>
          <div className="text-2xl font-black text-brand-blue">{items.length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-green-500">
          <div className="text-gray-500 text-xs uppercase font-bold">Total Scans</div>
          <div className="text-2xl font-black text-brand-blue">{scans.length}</div>
        </div>
        <div className="hidden md:block bg-white p-4 rounded-2xl shadow-sm border-l-4 border-blue-400">
          <div className="text-gray-500 text-xs uppercase font-bold">Status</div>
          <div className="text-2xl font-black text-brand-blue">Active</div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
          <div className="bg-brand-yellow/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-box-open text-brand-blue text-3xl"></i>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No items registered yet</h2>
          <p className="text-gray-500 mb-6">Start by adding your first item to protect it!</p>
          <Link to="/add-item" className="text-brand-blue font-bold hover:underline">
            Add your first item &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => {
            const itemScans = scans.filter(s => s.itemId === item.id);
            return (
              <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition group border border-gray-100">
                <div className="relative h-48 bg-gray-100">
                  <img src={item.photoUrl} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-brand-blue">
                    {item.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-brand-dark mb-1">{item.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <i className="fas fa-history mr-2"></i>
                    {itemScans.length} {itemScans.length === 1 ? 'Scan' : 'Scans'} detected
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Link 
                      to={`/item/${item.id}`}
                      className="flex-1 bg-gray-50 text-brand-blue px-4 py-2 rounded-xl text-center text-sm font-bold hover:bg-gray-100 transition"
                    >
                      Details
                    </Link>
                    <Link 
                      to={`/templates/${item.id}`}
                      className="flex-1 bg-brand-yellow text-brand-blue px-4 py-2 rounded-xl text-center text-sm font-bold hover:bg-brand-yellow/80 transition"
                    >
                      QR Sticker
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
