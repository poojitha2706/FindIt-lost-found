
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../services/mockDatabase';
import { Item, User } from '../types';

const FinderPage: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [isLogging, setIsLogging] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (itemId) {
        try {
          const foundItem = await db.items.getById(itemId);
          if (foundItem) {
            setItem(foundItem);
            const ownerInfo = await db.users.findById(foundItem.ownerId);
            if (ownerInfo) setOwner(ownerInfo);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, [itemId]);

  const handleLogLocation = async () => {
    if (!itemId) return;
    setIsLogging(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLogging(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await db.scans.add({
            itemId,
            timestamp: Date.now(),
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          });
          setSuccess(true);
        } catch (err) {
          setError("Failed to share location with cloud.");
        } finally {
          setIsLogging(false);
        }
      },
      (err) => {
        setError("Location permission denied. Please allow location to help the owner find their item.");
        setIsLogging(false);
      },
      { enableHighAccuracy: true }
    );
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><i className="fas fa-spinner fa-spin text-3xl"></i></div>;

  if (!item || !owner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-sm w-full">
          <div className="text-red-500 text-5xl mb-4">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h1 className="text-xl font-black text-gray-800">Oops! Item Not Found</h1>
          <p className="text-gray-500 mt-2">This link appears to be invalid or the item has been removed.</p>
        </div>
      </div>
    );
  }

  const firstName = owner.name.split(' ')[0];
  const maskedPhone = owner.phone.replace(/(\d{2})(\d+)(\d{2})/, (_, p1, p2, p3) => {
      return `${p1}${'X'.repeat(p2.length)}${p3}`;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
        {/* Hero Section */}
        <div className="bg-brand-yellow p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-3 rounded-full shadow-md animate-bounce">
               <i className="fas fa-bullseye text-brand-blue text-2xl"></i>
            </div>
          </div>
          <h1 className="text-2xl font-black text-brand-blue leading-tight uppercase italic">You Found Someone's Item!</h1>
          <p className="text-brand-blue font-bold opacity-80 text-sm">Thank you for being an amazing human.</p>
        </div>

        {/* Item Image */}
        <div className="relative h-64 w-full bg-gray-200">
          <img src={item.photoUrl} alt={item.name} className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
            <div className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">Item Details</div>
            <div className="text-xl font-bold">{item.name}</div>
          </div>
        </div>

        {/* Owner Info */}
        <div className="p-8 space-y-6">
          <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Owner</div>
                <div className="font-bold text-gray-800">{firstName} K.</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Contact</div>
                <div className="font-bold text-gray-800">{maskedPhone}</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <a 
              href={`tel:${owner.phone}`}
              className="w-full bg-brand-blue text-white h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg shadow-blue-200 active:scale-95 transition"
            >
              <i className="fas fa-phone-alt mr-3"></i>
              Call Owner
            </a>
            
            <a 
              href={`https://wa.me/${owner.phone}?text=Hi ${firstName}, I found your ${item.name}! Let's arrange a pickup.`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-[#25D366] text-white h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg shadow-green-200 active:scale-95 transition"
            >
              <i className="fab fa-whatsapp mr-3 text-2xl"></i>
              WhatsApp
            </a>

            {!success ? (
              <button 
                onClick={handleLogLocation}
                disabled={isLogging}
                className="w-full bg-white border-2 border-brand-yellow text-brand-blue h-14 rounded-2xl flex items-center justify-center font-black text-lg hover:bg-brand-yellow/5 active:scale-95 transition disabled:opacity-50"
              >
                <i className={`fas ${isLogging ? 'fa-spinner fa-spin' : 'fa-map-marker-alt'} mr-3`}></i>
                {isLogging ? 'Sharing GPS...' : 'Log My Location'}
              </button>
            ) : (
              <div className="bg-green-100 text-green-700 p-4 rounded-2xl border border-green-200 flex items-center justify-center text-sm font-bold text-center">
                <i className="fas fa-check-circle mr-2 text-xl"></i>
                Location Shared with Owner!
              </div>
            )}
          </div>

          {error && <p className="text-red-500 text-xs font-medium text-center">{error}</p>}

          <div className="pt-4 border-t text-center">
            <div className="inline-flex items-center space-x-1 text-green-600 font-black">
              <span className="text-lg">💚</span>
              <span>+10 Karma Points</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">Proudly returned via FindIt</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinderPage;
