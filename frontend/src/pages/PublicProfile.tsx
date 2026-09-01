import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Share2, MapPin, Briefcase, GraduationCap, Link, Mail, Phone, MessageCircle } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

const PublicProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/alumni/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Profile not found');
        return res.json();
      })
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleDownloadPDF = useReactToPrint({
    contentRef: profileRef,
    documentTitle: profile?.user?.name ? `${profile.user.name.replace(/\s+/g, '_')}_PMEC_Profile` : 'Profile',
    pageStyle: `
      @page { size: auto; margin: 10mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; }
      }
    `
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Profile link copied to clipboard!');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Profile...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!profile) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <div id="action-buttons" className="flex justify-end gap-3 mb-6">
          <button 
            onClick={handleCopyLink}
            className="flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm"
          >
            <Share2 className="w-4 h-4 mr-2" /> Share Link
          </button>
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" /> Download PDF
          </button>
        </div>

        {/* This div is the container that will be exported to PDF */}
        <div ref={profileRef} className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          
          {/* Header Cover */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden">
                <img 
                  src={profile.photoUrl} 
                  alt={profile.user.name}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous" // Essential for html2canvas to read external image
                />
              </div>
            </div>
          </div>

          <div className="pt-20 px-8 pb-8">
            <h1 className="text-3xl font-bold text-gray-900">{profile.user.name}</h1>
            <p className="text-gray-500 font-medium text-lg mt-1">
              B.Tech • {profile.branch} • Class of {profile.batch}
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Professional Details */}
              {profile.professionalDetails && (
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-blue-600" /> Professional Overview
                  </h3>
                  <div className="space-y-3 text-gray-700">
                    <p><span className="font-medium">Company:</span> {profile.professionalDetails.company || 'N/A'}</p>
                    <p><span className="font-medium">Role:</span> {profile.professionalDetails.jobProfile || 'N/A'}</p>
                    <p><span className="font-medium">Experience:</span> {profile.professionalDetails.experience ? `${profile.professionalDetails.experience} Years` : 'N/A'}</p>
                    <p><span className="font-medium">Location:</span> {profile.professionalDetails.jobLocation || 'N/A'}</p>
                  </div>
                </div>
              )}

              {/* Location Details */}
              {profile.locationDetails && (
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" /> Current Location
                  </h3>
                  <div className="space-y-3 text-gray-700">
                    <p><span className="font-medium">City:</span> {profile.locationDetails.city || 'N/A'}</p>
                    <p><span className="font-medium">State:</span> {profile.locationDetails.state || 'N/A'}</p>
                    <p className="whitespace-pre-line"><span className="font-medium">Address:</span> {profile.locationDetails.fullAddress || 'N/A'}</p>
                  </div>
                </div>
              )}

              {/* Academic Details */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-blue-600" /> Academic Background
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-700">
                  <p><span className="font-medium">Registration No:</span> {profile.registrationNumber}</p>
                  <p><span className="font-medium">Graduation Year:</span> {profile.graduationYear}</p>
                  <p><span className="font-medium">Branch:</span> {profile.branch}</p>
                </div>
              </div>

              {/* Social Links */}
              {profile.socialLinks && (
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Share2 className="w-5 h-5 mr-2 text-blue-600" /> Connect
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {profile.socialLinks.email && (
                      <a href={`mailto:${profile.socialLinks.email}`} className="flex items-center text-gray-600 hover:text-blue-600">
                        <Mail className="w-5 h-5 mr-2" /> Email
                      </a>
                    )}
                    {profile.socialLinks.linkedin && (
                      <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="flex items-center text-gray-600 hover:text-blue-600">
                        <Link className="w-5 h-5 mr-2" /> LinkedIn
                      </a>
                    )}
                    {profile.socialLinks.github && (
                      <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="flex items-center text-gray-600 hover:text-blue-600">
                        <Link className="w-5 h-5 mr-2" /> GitHub
                      </a>
                    )}
                    {profile.socialLinks.instagram && (
                      <a href={profile.socialLinks.instagram} target="_blank" rel="noreferrer" className="flex items-center text-gray-600 hover:text-blue-600">
                        <MessageCircle className="w-5 h-5 mr-2" /> Instagram
                      </a>
                    )}
                    {profile.socialLinks.phone && (
                      <a href={`tel:${profile.socialLinks.phone}`} className="flex items-center text-gray-600 hover:text-blue-600">
                        <Phone className="w-5 h-5 mr-2" /> Phone
                      </a>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PublicProfile;
