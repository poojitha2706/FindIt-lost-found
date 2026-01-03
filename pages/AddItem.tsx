
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/mockDatabase';
import { CATEGORIES } from '../constants';
import { generateSmartDescription } from '../services/geminiService';

const AddItem: React.FC = () => {
  const navigate = useNavigate();
  const user = db.auth.getCurrentUser();
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSmartDescribe = async () => {
    if (!name) return alert('Please enter a name first');
    setIsGenerating(true);
    const aiDesc = await generateSmartDescription(name, category);
    setDescription(aiDesc);
    setIsGenerating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    
    try {
      const newItemId = Math.random().toString(36).substr(2, 9);
      await db.items.add({
        id: newItemId,
        ownerId: user.id,
        name,
        category,
        description,
        qrCode: '',
        createdAt: Date.now()
      }, photo || undefined);
      
      navigate('/dashboard');
    } catch (err) {
      console.error("Upload error", err);
      alert("Failed to save item. Check connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 md:pb-0">
      <header>
        <button onClick={() => navigate(-1)} className="text-brand-blue mb-4">
          <i className="fas fa-arrow-left mr-2"></i> Back
        </button>
        <h1 className="text-3xl font-extrabold text-brand-dark">Register Item</h1>
        <p className="text-gray-500">Fill in the details to protect your belonging</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm p-6 md:p-8 space-y-6">
        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Item Photo</label>
          <div className="relative group cursor-pointer h-48 w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center overflow-hidden transition hover:bg-gray-100">
            {photo ? (
              <img src={photo} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <i className="fas fa-camera text-3xl text-gray-400 mb-2"></i>
                <span className="text-xs text-gray-500 font-medium">Click to upload photo</span>
              </>
            )}
            <input 
              type="file" 
              accept="image/*" 
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handlePhotoUpload}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Item Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Blue Macbook Air"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue outline-none"
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-bold text-gray-700">Description</label>
            <button
              type="button"
              onClick={handleSmartDescribe}
              disabled={isGenerating}
              className="text-xs font-bold text-brand-blue flex items-center hover:underline disabled:opacity-50"
            >
              <i className={`fas fa-magic mr-1 ${isGenerating ? 'animate-spin' : ''}`}></i>
              {isGenerating ? 'Generating...' : 'Smart Auto-Fill'}
            </button>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add identifying details..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue outline-none resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-yellow text-brand-blue font-black text-lg py-4 rounded-2xl shadow-lg hover:shadow-xl transition transform active:scale-[0.98] disabled:opacity-50"
        >
          {isSubmitting ? 'Saving to Cloud...' : 'Protect Item'}
        </button>
      </form>
    </div>
  );
};

export default AddItem;
