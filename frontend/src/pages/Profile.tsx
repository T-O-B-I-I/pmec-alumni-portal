import React, { useState, useEffect, useRef } from 'react';
import { Camera, Save, MapPin, Briefcase, GraduationCap, Share2, Users, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [mentors, setMentors] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    registrationNumber: '',
    batch: '',
    branch: '',
    graduationYear: '',
    yearOfJoining: '',
    mobileNumber: '',
    specialization: '',
    professionalDetails: {
      jobProfile: '',
      company: '',
      jobLocation: '',
      experience: '',
      sector: '',
    },
    locationDetails: {
      city: '',
      subDistrict: '',
      district: '',
      state: '',
      pincode: '',
      fullAddress: '',
    },
    socialLinks: {
      github: '',
      linkedin: '',
      email: user?.email || '',
      instagram: '',
      phone: '',
      whatsapp: '',
    },
    mentorId: '',
    photo: null as File | null,
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  });

  useEffect(() => {
    // Fetch mentors
    fetch('/api/mentors', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setMentors(data))
      .catch(err => console.error('Failed to fetch mentors', err));

    // Fetch existing profile
    if (user) {
      if (user.role === 'mentor') {
        fetch('/api/mentors/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => {
            setFormData(prev => ({
              ...prev,
              yearOfJoining: data.yearOfJoining || '',
              mobileNumber: data.mobileNumber || '',
              branch: data.branch || '',
              specialization: data.specialization || '',
              photoUrl: data.photoUrl || prev.photoUrl,
            }));
          })
          .catch(err => console.error(err));
      } else {
        fetch('/api/alumni', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => {
            // Find the current user's profile
            const myProfile = data.find((p: any) => p.user._id === user.id || p.user.id === user.id);
            if (myProfile) {
              setFormData(prev => ({
                ...prev,
                registrationNumber: myProfile.registrationNumber || '',
                batch: myProfile.batch || '',
                branch: myProfile.branch || '',
                graduationYear: myProfile.graduationYear || '',
                professionalDetails: myProfile.professionalDetails || prev.professionalDetails,
                locationDetails: myProfile.locationDetails || prev.locationDetails,
                socialLinks: myProfile.socialLinks || prev.socialLinks,
                mentorId: myProfile.mentorId || '',
                photoUrl: myProfile.photoUrl || prev.photoUrl,
              }));
            }
          })
          .catch(err => console.error(err));
      }
    }
  }, [user, token]);

  const handleInputChange = (section: string | null, field: string, value: string) => {
    setFormData(prev => {
      if (section) {
        return {
          ...prev,
          [section]: {
            ...(prev as any)[section],
            [field]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, photo: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (user?.role === 'mentor') {
        // Submit Mentor Profile
        const submitData = new FormData();
        submitData.append('yearOfJoining', formData.yearOfJoining);
        submitData.append('mobileNumber', formData.mobileNumber);
        submitData.append('branch', formData.branch);
        submitData.append('specialization', formData.specialization);
        
        if (formData.photo) {
          submitData.append('photo', formData.photo);
        }

        const res = await fetch('/api/mentors/profile', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: submitData
        });
        
        if (res.ok) {
          const data = await res.json();
          setFormData(prev => ({
            ...prev,
            photoUrl: data.photoUrl || prev.photoUrl,
            photo: null
          }));
          alert('Mentor Profile saved successfully!');
        } else {
          const errData = await res.json().catch(() => ({}));
          alert(`Failed to save mentor profile: ${errData.error || errData.message || 'Unknown error'}`);
        }
      } else {
        // Submit Alumni Profile
        const submitData = new FormData();
        submitData.append('registrationNumber', formData.registrationNumber);
        submitData.append('batch', formData.batch);
        submitData.append('branch', formData.branch);
        submitData.append('graduationYear', formData.graduationYear);
        submitData.append('mentorId', formData.mentorId);
        
        submitData.append('professionalDetails', JSON.stringify(formData.professionalDetails));
        submitData.append('locationDetails', JSON.stringify(formData.locationDetails));
        submitData.append('socialLinks', JSON.stringify(formData.socialLinks));
        
        if (formData.photo) {
          submitData.append('photo', formData.photo);
        }

        const res = await fetch('/api/alumni/profile', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: submitData
        });

        if (res.ok) {
          const updatedProfile = await res.json();
          setFormData(prev => ({
            ...prev,
            photoUrl: updatedProfile.photoUrl || prev.photoUrl,
            photo: null // clear pending file
          }));
          alert('Profile saved successfully!');
        } else {
          const errData = await res.json().catch(() => ({}));
          alert(`Failed to save profile: ${errData.error || errData.message || 'Unknown error'}`);
        }
      }
    } catch (err: any) {
      console.error(err);
      alert(`An error occurred while saving: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.")) {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          alert("Your account has been successfully deleted.");
          logout();
          navigate('/');
        } else {
          const data = await res.json();
          alert(data.message || "Failed to delete account");
        }
      } catch (err) {
        console.error(err);
        alert("An error occurred while deleting your account.");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        {/* Header Cover */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
          <div className="absolute -bottom-16 left-8">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden">
                <img 
                  src={photoPreview || formData.photoUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                />
              </div>
              <button className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700 shadow-md">
                <Camera className="w-5 h-5" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
          </div>
        </div>

        <div className="pt-20 px-8 pb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-500 font-medium">
                {user?.role === 'mentor' 
                  ? (formData.branch ? `Faculty - ${formData.branch}` : 'Department not set')
                  : (formData.branch ? `B.Tech - ${formData.branch}` : 'Branch not set')
                }
                {user?.role !== 'mentor' && ` • ${formData.batch ? `Batch ${formData.batch} - ${formData.graduationYear || 'Present'}` : 'Batch not set'}`}
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => window.open(`/alumni/${user?.id}`, '_blank')}
                className="flex items-center bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm"
              >
                View Public Profile
              </button>
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" /> {loading ? 'Saving...' : 'Save Profile'}
              </button>
              <button 
                onClick={handleDeleteAccount}
                className="flex items-center bg-red-50 text-red-600 border border-red-200 px-5 py-2.5 rounded-lg font-medium hover:bg-red-100 transition-colors shadow-sm"
                title="Delete Account"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          {user?.role !== 'mentor' && (
            <div className="flex border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar">
              {[
                { id: 'personal', icon: GraduationCap, label: 'Personal & Academic' },
                { id: 'professional', icon: Briefcase, label: 'Professional' },
                { id: 'location', icon: MapPin, label: 'Location' },
                { id: 'social', icon: Share2, label: 'Social & Contact' },
                { id: 'mentor', icon: Users, label: 'Mentorship' },
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center whitespace-nowrap pb-4 px-4 font-medium text-sm transition-colors ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {user?.role === 'mentor' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year of Joining</label>
                  <input type="text" value={formData.yearOfJoining} onChange={(e) => handleInputChange(null, 'yearOfJoining', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 bg-white border" placeholder="e.g. 2010" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                  <input type="tel" value={formData.mobileNumber} onChange={(e) => handleInputChange(null, 'mobileNumber', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 bg-white border" placeholder="+91 9876543210" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                  <input type="text" value={formData.branch} onChange={(e) => handleInputChange(null, 'branch', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 bg-white border" placeholder="e.g. CSE" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                  <input type="text" value={formData.specialization} onChange={(e) => handleInputChange(null, 'specialization', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 bg-white border" placeholder="e.g. Artificial Intelligence" />
                </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Personal Slab */}
              {activeTab === 'personal' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                  <input type="text" value={formData.registrationNumber} onChange={(e) => handleInputChange(null, 'registrationNumber', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 bg-white border" placeholder="e.g. 200101123" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch (Year of Admission)</label>
                  <input type="text" value={formData.batch} onChange={(e) => handleInputChange(null, 'batch', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 bg-white border" placeholder="e.g. 2020" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                  <input type="text" value={formData.branch} onChange={(e) => handleInputChange(null, 'branch', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 bg-white border" placeholder="e.g. CSE" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                  <input type="text" value={formData.graduationYear} onChange={(e) => handleInputChange(null, 'graduationYear', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 bg-white border" placeholder="e.g. 2024" />
                </div>
              </div>
            )}

            {/* Professional Slab */}
            {activeTab === 'professional' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Profile / Designation</label>
                  <input type="text" value={formData.professionalDetails.jobProfile} onChange={(e) => handleInputChange('professionalDetails', 'jobProfile', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 bg-white border" placeholder="Software Engineer" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input type="text" value={formData.professionalDetails.company} onChange={(e) => handleInputChange('professionalDetails', 'company', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 bg-white border" placeholder="Microsoft" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Location</label>
                  <input type="text" value={formData.professionalDetails.jobLocation} onChange={(e) => handleInputChange('professionalDetails', 'jobLocation', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 bg-white border" placeholder="Bangalore, India" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                  <input type="text" value={formData.professionalDetails.experience} onChange={(e) => handleInputChange('professionalDetails', 'experience', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 bg-white border" placeholder="2" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sector / Industry</label>
                  <input type="text" value={formData.professionalDetails.sector} onChange={(e) => handleInputChange('professionalDetails', 'sector', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 bg-white border" placeholder="IT / Software" />
                </div>
              </div>
            )}

            {/* Location Slab */}
            {activeTab === 'location' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                  <textarea value={formData.locationDetails.fullAddress} onChange={(e) => handleInputChange('locationDetails', 'fullAddress', e.target.value)} rows={3} className="w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 bg-white" placeholder="123 Main St, Apt 4B..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" value={formData.locationDetails.city} onChange={(e) => handleInputChange('locationDetails', 'city', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 bg-white border" placeholder="Bhubaneswar" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub District</label>
                  <input type="text" value={formData.locationDetails.subDistrict} onChange={(e) => handleInputChange('locationDetails', 'subDistrict', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 bg-white border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                  <input type="text" value={formData.locationDetails.district} onChange={(e) => handleInputChange('locationDetails', 'district', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 bg-white border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input type="text" value={formData.locationDetails.state} onChange={(e) => handleInputChange('locationDetails', 'state', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 bg-white border" placeholder="Odisha" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input type="text" value={formData.locationDetails.pincode} onChange={(e) => handleInputChange('locationDetails', 'pincode', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 bg-white border" placeholder="751001" />
                </div>
              </div>
            )}

            {/* Social Slab */}
            {activeTab === 'social' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" value={formData.socialLinks.email} onChange={(e) => handleInputChange('socialLinks', 'email', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 bg-white border" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" value={formData.socialLinks.phone} onChange={(e) => handleInputChange('socialLinks', 'phone', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 bg-white border" placeholder="+91 9876543210" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                  <input type="tel" value={formData.socialLinks.whatsapp} onChange={(e) => handleInputChange('socialLinks', 'whatsapp', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 bg-white border" placeholder="+91 9876543210" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
                  <input type="url" value={formData.socialLinks.linkedin} onChange={(e) => handleInputChange('socialLinks', 'linkedin', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 bg-white border" placeholder="https://linkedin.com/in/..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Profile</label>
                  <input type="url" value={formData.socialLinks.github} onChange={(e) => handleInputChange('socialLinks', 'github', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 bg-white border" placeholder="https://github.com/..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram Profile</label>
                  <input type="url" value={formData.socialLinks.instagram} onChange={(e) => handleInputChange('socialLinks', 'instagram', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 bg-white border" placeholder="https://instagram.com/..." />
                </div>
              </div>
            )}

            {/* Mentor Slab */}
            {activeTab === 'mentor' && (
              <div className="animate-fade-in bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Select a Faculty Mentor</h3>
                <p className="text-sm text-gray-500 mb-6">Connect with a PMEC faculty member for ongoing guidance and mentorship.</p>
                
                <div className="max-w-md">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available Mentors</label>
                  <select 
                    value={formData.mentorId} 
                    onChange={(e) => handleInputChange(null, 'mentorId', e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 bg-white"
                  >
                    <option value="">-- No Mentor Selected --</option>
                    {mentors.map(m => (
                      <option key={m._id} value={m._id}>{m.name} ({m.email})</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
