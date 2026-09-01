import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, GraduationCap, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Directory = () => {
  const [alumni, setAlumni] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const navigate = useNavigate();

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    setLoading(true);
    let url = '/api/alumni';
    if (debouncedSearch) {
      url += `?search=${encodeURIComponent(debouncedSearch)}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setAlumni(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch alumni directory', err);
        setLoading(false);
      });
  }, [debouncedSearch]);

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header and Search */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Alumni Directory</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Connect, network, and discover the amazing journeys of our graduates across the globe.
          </p>
          
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 border-gray-300 rounded-full leading-5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-md border transition-all"
              placeholder="Search by name, company, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Directory Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {alumni.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No alumni found</h3>
                <p className="text-gray-500">Try adjusting your search criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {alumni.map((profile) => (
                  <div key={profile._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
                    <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600 relative"></div>
                    <div className="px-6 pb-6 relative flex-grow flex flex-col">
                      <div className="-mt-12 mb-4 flex justify-center">
                        <img 
                          src={profile.photoUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&q=80'} 
                          alt={profile.user?.name}
                          className="w-24 h-24 rounded-full border-4 border-white object-cover bg-white shadow-sm"
                        />
                      </div>
                      
                      <div className="text-center flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 truncate" title={profile.user?.name}>{profile.user?.name}</h3>
                        <p className="text-blue-600 font-medium text-sm mb-4">Class of {profile.batch} • {profile.branch}</p>
                        
                        <div className="space-y-2 text-sm text-gray-600 text-left mb-6">
                          <div className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="truncate" title={profile.professionalDetails?.company || 'Not specified'}>
                              {profile.professionalDetails?.company ? `${profile.professionalDetails.jobProfile} @ ${profile.professionalDetails.company}` : 'Not specified'}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="truncate" title={profile.locationDetails?.city || 'Location unknown'}>
                              {profile.locationDetails?.city ? `${profile.locationDetails.city}, ${profile.locationDetails.state}` : 'Location unknown'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => navigate(`/alumni/${profile.user?._id || profile.user?.id}`)}
                        className="w-full mt-auto bg-gray-50 text-blue-600 border border-blue-100 font-medium py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Directory;
