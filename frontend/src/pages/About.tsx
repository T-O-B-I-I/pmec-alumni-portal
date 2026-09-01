import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Building, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DEFAULT_CONTENT = {
  vision: "To be a recognized technical institution providing quality education and fostering research, innovation, and entrepreneurial attitude to produce globally competent and socially responsible engineers.",
  mission: [
    "Provide a conducive learning environment with state-of-the-art infrastructure.",
    "Impart quality technical education to meet industry needs.",
    "Encourage research, innovation, and entrepreneurship.",
    "Inculcate ethical values and social responsibility."
  ],
  address: "Sitalapalli, Berhampur\nGanjam, Odisha, 761003\nIndia",
  phone: "+91 680 2292020",
  email: "info@pmec.ac.in"
};

const About = () => {
  const { user, token } = useAuth();
  const isCoordinator = user?.role === 'coordinator' || user?.role === 'superadmin';
  
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/content/about')
      .then(res => {
        if (!res.ok) throw new Error('Content not found');
        return res.json();
      })
      .then(data => {
        if (data.data) {
          setContent(data.data);
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
      const res = await fetch('/api/content/about', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ data: content })
      });
      if (res.ok) {
        setIsEditing(false);
      } else {
        alert('Failed to save content');
      }
    } catch (err) {
      alert('Network error while saving');
    } finally {
      setSaving(false);
    }
  };

  const updateMissionItem = (index: number, value: string) => {
    const newMission = [...content.mission];
    newMission[index] = value;
    setContent({ ...content, mission: newMission });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-blue-900 text-white py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] mix-blend-overlay opacity-10 bg-cover bg-center" />
        <div className="relative max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">About Parala Maharaja Engineering College</h1>
          <p className="text-xl text-blue-100">A premier institute of engineering and technology in Odisha, established in 2009.</p>
          
          {isCoordinator && !isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="mt-6 inline-flex items-center bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full backdrop-blur-sm transition-colors text-white font-medium"
            >
              <Edit2 className="w-4 h-4 mr-2" /> Edit Page Content
            </button>
          )}
          {isCoordinator && isEditing && (
            <div className="mt-6 flex justify-center gap-4">
              <button 
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center bg-green-500 hover:bg-green-600 px-6 py-2 rounded-full transition-colors text-white font-medium"
              >
                <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                disabled={saving}
                className="inline-flex items-center bg-red-500/80 hover:bg-red-600 px-4 py-2 rounded-full transition-colors text-white font-medium"
              >
                <X className="w-4 h-4 mr-1" /> Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Building className="w-8 h-8 mr-3 text-blue-600" />
                Our Vision
              </h2>
              {isEditing ? (
                <textarea 
                  value={content.vision}
                  onChange={(e) => setContent({ ...content, vision: e.target.value })}
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
                />
              ) : (
                <p className="text-gray-600 leading-relaxed text-lg mb-6 whitespace-pre-wrap">
                  {content.vision}
                </p>
              )}
              
              <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12 flex items-center">
                <Building className="w-8 h-8 mr-3 text-blue-600" />
                Our Mission
              </h2>
              {isEditing ? (
                <div className="space-y-3">
                  {content.mission.map((item, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        value={item}
                        onChange={(e) => updateMissionItem(idx, e.target.value)}
                        className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
                      />
                      <button 
                        onClick={() => setContent({ ...content, mission: content.mission.filter((_, i) => i !== idx) })}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => setContent({ ...content, mission: [...content.mission, 'New mission item...'] })}
                    className="text-blue-600 font-medium text-sm hover:underline"
                  >
                    + Add Mission Item
                  </button>
                </div>
              ) : (
                <ul className="space-y-4 text-gray-600 leading-relaxed text-lg list-disc pl-5">
                  {content.mission.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 h-fit">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4 flex-shrink-0 text-blue-600">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-semibold text-gray-900 text-lg">Address</h4>
                    {isEditing ? (
                      <textarea 
                        value={content.address}
                        onChange={(e) => setContent({ ...content, address: e.target.value })}
                        className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 h-24"
                      />
                    ) : (
                      <p className="text-gray-600 mt-1 whitespace-pre-wrap">{content.address}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4 flex-shrink-0 text-blue-600">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-semibold text-gray-900 text-lg">Phone</h4>
                    {isEditing ? (
                      <input 
                        value={content.phone}
                        onChange={(e) => setContent({ ...content, phone: e.target.value })}
                        className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-600 mt-1">{content.phone}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4 flex-shrink-0 text-blue-600">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-semibold text-gray-900 text-lg">Email</h4>
                    {isEditing ? (
                      <input 
                        value={content.email}
                        onChange={(e) => setContent({ ...content, email: e.target.value })}
                        className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-600 mt-1">{content.email}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
