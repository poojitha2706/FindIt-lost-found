
import React, { useEffect, useState } from 'react';
import { db } from '../services/mockDatabase';
import { ScanEvent, Item } from '../types';

const Notifications: React.FC = () => {
  const [scans, setScans] = useState<ScanEvent[]>([]);
  const [items, setItems] = useState<Record<string, Item>>({});
  const [isLoading, setIsLoading] = useState(true);
  const user = db.auth.getCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const allScans = await db.scans.getByOwner(user.id);
          setScans(allScans);
          
          const userItems = await db.items.getByOwner(user.id);
          const itemMap: Record<string, Item> = {};
          userItems.forEach(i => itemMap[i.id] = i);
          setItems(itemMap);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <div className="p-12 text-center"><i className="fas fa-spinner fa-spin text-3xl"></i></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 md:pb-0">
      <header>
        <h1 className="text-3xl font-extrabold text-brand-dark">Activity Feed</h1>
        <p className="text-gray-500">Real-time alerts for your items</p>
      </header>

      {scans.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center shadow-sm border border-gray-100">
           <div className="text-gray-200 text-5xl mb-4">
             <i className="fas fa-bell-slash"></i>
           </div>
           <h2 className="text-xl font-bold text-gray-800">No activity yet</h2>
           <p className="text-gray-500 text-sm">When someone scans your stickers, alerts will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {scans.map(scan => {
            const item = items[scan.itemId];
            return (
              <div key={scan.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-start space-x-4">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100">
                    <img src={item?.photoUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-black text-brand-dark uppercase italic">Sticker Scanned!</h3>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Your <span className="font-bold text-brand-blue">{item?.name}</span> was just spotted.
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <a 
                      href={`https://www.google.com/maps?q=${scan.latitude},${scan.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-brand-blue flex items-center bg-brand-blue/5 px-3 py-1.5 rounded-lg hover:bg-brand-blue/10"
                    >
                      <i className="fas fa-map-pin mr-2"></i>
                      See Exact Location
                    </a>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">{new Date(scan.timestamp).toLocaleDateString()}</span>
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

export default Notifications;
