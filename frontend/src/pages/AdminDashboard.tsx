import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, UserCheck, Filter, Search } from 'lucide-react';

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState<any>(null);
  const [alumni, setAlumni] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'coordinator') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [statsRes, alumniRes] = await Promise.all([
          fetch('/api/admin/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/alumni', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        
        if (statsRes.ok) setStats(await statsRes.json());
        if (alumniRes.ok) setAlumni(await alumniRes.json());
      } catch (err) {
        console.error('Failed to fetch admin data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate, token]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/alumni?search=${search}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setAlumni(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Admin Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Coordinator Dashboard</h1>
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg mr-4">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg mr-4">
              <UserCheck className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Verified Alumni</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalAlumni || 0}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg mr-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Mentors</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalMentors || 0}</p>
            </div>
          </div>
        </div>

        {/* Directory Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">Alumni Directory</h2>
            
            <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-grow sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search name, role, company..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button type="button" className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50">
                <Filter className="w-5 h-5" />
              </button>
            </form>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Batch</th>
                  <th className="p-4 font-medium">Branch</th>
                  <th className="p-4 font-medium">Current Role</th>
                  <th className="p-4 font-medium">Company</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {alumni.map((profile, i) => (
                  <tr key={profile._id || i} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                          {profile.user?.name?.charAt(0) || 'A'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{profile.user?.name || 'Unknown User'}</p>
                          <p className="text-sm text-gray-500">{profile.user?.email || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{profile.batch}</td>
                    <td className="p-4 text-gray-600">{profile.branch}</td>
                    <td className="p-4 text-gray-600">{profile.professionalDetails?.jobProfile || '-'}</td>
                    <td className="p-4 text-gray-600">
                      {profile.professionalDetails?.company ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {profile.professionalDetails.company}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to completely delete this user and all their registration/profile data? This cannot be undone.')) {
                            try {
                              const userId = profile.user?._id || profile.user?.id;
                              const res = await fetch(`/api/admin/users/${userId}`, {
                                method: 'DELETE',
                                headers: { 'Authorization': `Bearer ${token}` }
                              });
                              if (res.ok) {
                                setAlumni(alumni.filter(a => a._id !== profile._id));
                                // Also update stats slightly
                                setStats((prev: any) => ({
                                  ...prev,
                                  totalUsers: prev.totalUsers - 1,
                                  totalAlumni: prev.totalAlumni - 1
                                }));
                              } else {
                                alert('Failed to delete user');
                              }
                            } catch (err) {
                              console.error(err);
                              alert('Network error while deleting');
                            }
                          }
                        }}
                        className="text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded bg-red-50 hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {alumni.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No alumni found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
