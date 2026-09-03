import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, UserCheck, Filter, Search, Download, Megaphone, Trash2, Edit2 } from 'lucide-react';

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState<any>(null);
  const [alumni, setAlumni] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Password Reset state
  const [resetRequests, setResetRequests] = useState<any[]>([]);
  const [resetting, setResetting] = useState<string | null>(null);

  // Notice Board state
  const [notices, setNotices] = useState<any[]>([]);
  const [newNotice, setNewNotice] = useState({ title: '', content: '' });
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [submittingNotice, setSubmittingNotice] = useState(false);

  const renderContentWithLinks = (text: string) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{part}</a>;
      }
      return part;
    });
  };

  useEffect(() => {
    if (!user || !['coordinator', 'superadmin'].includes(user.role)) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [statsRes, alumniRes, noticesRes, resetRes] = await Promise.all([
          fetch('/api/admin/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/alumni', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/notices'),
          fetch('/api/auth/reset-requests', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        
        if (statsRes.ok) setStats(await statsRes.json());
        if (alumniRes.ok) setAlumni(await alumniRes.json());
        if (noticesRes.ok) setNotices(await noticesRes.json());
        if (resetRes.ok) setResetRequests(await resetRes.json());
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

  const handleExport = async () => {
    try {
      const res = await fetch('/api/admin/export', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'alumni_data.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        alert('Failed to export data');
      }
    } catch (err) {
      console.error('Error exporting data', err);
      alert('Error exporting data');
    }
  };

  const handleSaveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.content) return;
    setSubmittingNotice(true);
    try {
      const url = editingNoticeId ? `/api/notices/${editingNoticeId}` : '/api/notices';
      const method = editingNoticeId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(newNotice)
      });
      if (res.ok) {
        const saved = await res.json();
        if (editingNoticeId) {
          setNotices(notices.map(n => n._id === editingNoticeId ? saved : n));
        } else {
          setNotices([saved, ...notices]);
        }
        setNewNotice({ title: '', content: '' });
        setEditingNoticeId(null);
      } else {
        alert('Failed to save notice');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving notice');
    } finally {
      setSubmittingNotice(false);
    }
  };

  const handleEditClick = (notice: any) => {
    setNewNotice({ title: notice.title, content: notice.content });
    setEditingNoticeId(notice._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteNotice = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      const res = await fetch(`/api/notices/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setNotices(notices.filter(n => n._id !== id));
      } else {
        alert('Failed to delete notice');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting notice');
    }
  };

  const handleResetPassword = async (userId: string) => {
    if (!window.confirm("Are you sure you want to reset this user's password? It will be changed to <FirstName>123")) return;
    setResetting(userId);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setResetRequests(resetRequests.filter(r => r._id !== userId));
      } else {
        alert(data.message || 'Failed to reset password');
      }
    } catch (err) {
      alert('Network error while resetting password');
    } finally {
      setResetting(null);
    }
  };

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

        {/* Notice Board Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Megaphone className="w-5 h-5 mr-2 text-blue-600" /> Manage Notices
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 border-r border-gray-100 pr-0 lg:pr-8">
              <h3 className="font-semibold text-gray-900 mb-4">{editingNoticeId ? 'Edit Notice' : 'Post New Notice'}</h3>
              <form onSubmit={handleSaveNotice} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={newNotice.title}
                    onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Alumni Meetup 2026"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content / Details</label>
                  <textarea
                    required
                    rows={4}
                    value={newNotice.content}
                    onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Provide details about the event..."
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={submittingNotice}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                  >
                    {submittingNotice ? 'Saving...' : (editingNoticeId ? 'Update Notice' : 'Post Notice')}
                  </button>
                  {editingNoticeId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingNoticeId(null);
                        setNewNotice({ title: '', content: '' });
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
            
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-semibold text-gray-900 mb-4">Active Notices</h3>
              {notices.length === 0 ? (
                <p className="text-gray-500">No notices posted yet.</p>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {notices.map(notice => (
                    <div key={notice._id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-900">{notice.title}</h4>
                        <p className="text-sm text-gray-500 mb-2">
                          {new Date(notice.date).toLocaleDateString()} • By {notice.author?.name || 'Admin'}
                        </p>
                        <p className="text-gray-700 text-sm whitespace-pre-wrap">{renderContentWithLinks(notice.content)}</p>
                      </div>
                      <div className="flex ml-4 flex-shrink-0">
                        <button 
                          onClick={() => handleEditClick(notice)}
                          className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition"
                          title="Edit Notice"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteNotice(notice._id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                          title="Delete Notice"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Password Resets Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
               Password Reset Requests
            </h2>
          </div>
          <div className="p-6">
            {resetRequests.length === 0 ? (
              <p className="text-gray-500">No pending password reset requests.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                      <th className="p-4 font-medium">Name</th>
                      <th className="p-4 font-medium">Email</th>
                      <th className="p-4 font-medium">Role</th>
                      <th className="p-4 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {resetRequests.map((reqUser) => (
                      <tr key={reqUser._id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium text-gray-900">{reqUser.name}</td>
                        <td className="p-4 text-gray-600">{reqUser.email}</td>
                        <td className="p-4 text-gray-600 capitalize">{reqUser.role}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleResetPassword(reqUser._id)}
                            disabled={resetting === reqUser._id}
                            className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded bg-blue-50 hover:bg-blue-100 transition-colors disabled:opacity-50"
                          >
                            {resetting === reqUser._id ? 'Resetting...' : 'Approve Reset'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
              <button 
                type="submit"
                className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors hidden sm:block"
              >
                Search
              </button>
            </form>
            <button 
              onClick={handleExport}
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4 mr-2" /> Export to Excel
            </button>
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
