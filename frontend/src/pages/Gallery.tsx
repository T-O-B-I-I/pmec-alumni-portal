import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Edit2, Save, X, Plus, Trash2 } from 'lucide-react';

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1523580494112-071d16940d14?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
];

const Gallery = () => {
  const { user, token } = useAuth();
  const isCoordinator = user?.role === 'coordinator' || user?.role === 'superadmin';

  const [images, setImages] = useState<string[]>(DEFAULT_IMAGES);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    fetch('/api/content/gallery')
      .then(res => {
        if (!res.ok) throw new Error('Content not found');
        return res.json();
      })
      .then(data => {
        if (data.data && Array.isArray(data.data.images)) {
          setImages(data.data.images);
        }
        setLoading(false);
      })
      .catch(() => {
        // Use default content if not found
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/content/gallery', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ data: { images } })
      });
      if (res.ok) {
        setIsEditing(false);
      } else {
        alert('Failed to save gallery content');
      }
    } catch (err) {
      alert('Network error while saving');
    } finally {
      setSaving(false);
    }
  };

  const handleAddImage = () => {
    if (newImageUrl.trim() !== '') {
      setImages([newImageUrl.trim(), ...images]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="bg-white py-16 sm:py-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 relative">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">College Memories</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Relive the best moments of your college life. A collection of events, fests, and campus life at PMEC.</p>
          
          {isCoordinator && !isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="mt-6 inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full transition-colors font-medium border border-gray-300"
            >
              <Edit2 className="w-4 h-4 mr-2" /> Edit Gallery
            </button>
          )}
          {isCoordinator && isEditing && (
            <div className="mt-6 flex justify-center gap-4">
              <button 
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition-colors font-medium shadow-sm"
              >
                <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Gallery'}
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                disabled={saving}
                className="inline-flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors font-medium shadow-sm"
              >
                <X className="w-4 h-4 mr-1" /> Cancel
              </button>
            </div>
          )}
        </div>

        {isEditing && (
          <div className="mb-12 bg-gray-50 p-6 rounded-2xl border border-gray-200 max-w-2xl mx-auto flex gap-4 items-end shadow-sm">
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-700 mb-2">Add New Image (URL)</label>
              <input 
                type="text"
                placeholder="https://example.com/image.jpg"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <button 
              onClick={handleAddImage}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center h-fit"
            >
              <Plus className="w-5 h-5 mr-1" /> Add
            </button>
          </div>
        )}

        {images.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-2xl border border-gray-100">
            No images in the gallery yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {images.map((img, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (idx % 6) * 0.1 }}
                className="relative group rounded-2xl overflow-hidden aspect-square cursor-pointer border border-gray-100 shadow-sm"
              >
                <img 
                  src={img} 
                  alt={`Gallery image ${idx + 1}`} 
                  className={`w-full h-full object-cover transition-transform duration-500 ${!isEditing && 'group-hover:scale-110'}`}
                />
                {!isEditing && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <span className="text-white font-medium text-lg tracking-wider bg-white/20 px-6 py-2 rounded-full backdrop-blur-sm border border-white/30">View Image</span>
                  </div>
                )}
                {isEditing && (
                  <div className="absolute top-2 right-2">
                    <button 
                      onClick={() => handleRemoveImage(idx)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
                      title="Remove image"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
