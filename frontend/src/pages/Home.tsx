import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users, BookOpen, Trophy, FileText, Calendar } from 'lucide-react';
import AlumniSlider from '../components/AlumniSlider';
import GallerySlider from '../components/GallerySlider';

const Home = () => {
  const [stats, setStats] = useState({ alumniCount: 0, mentorsCount: 0, companiesCount: 0 });

  const [notices, setNotices] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/alumni/stats/public')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Error fetching stats:', err));

    fetch('/api/notices')
      .then(res => res.json())
      .then(data => setNotices(data))
      .catch(err => console.error('Error fetching notices:', err));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/campus.jpg')] bg-cover bg-center bg-no-repeat opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
          >
            Welcome Back to <br/>
            <span className="text-blue-400">Your Alma Mater</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-blue-100 max-w-3xl mb-10"
          >
            The official Alumni Management Portal for Parala Maharaja Engineering College. Reconnect, network, and grow together.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/register" className="bg-blue-500 hover:bg-blue-400 text-white px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center shadow-lg shadow-blue-500/30">
              Join the Network <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link to="/login" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center">
              Login to Portal
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-8 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">
                {stats.alumniCount >= 1000 ? '1000+' : stats.alumniCount}
              </h3>
              <p className="text-lg text-gray-600 font-medium">Registered Alumni</p>
            </div>
            
            <div className="flex flex-col items-center p-8 bg-indigo-50 rounded-2xl border border-indigo-100">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">50+</h3>
              <p className="text-lg text-gray-600 font-medium">Top Tech Companies</p>
            </div>
            
            <div className="flex flex-col items-center p-8 bg-purple-50 rounded-2xl border border-purple-100">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 text-purple-600">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">
                {stats.mentorsCount >= 20 ? '20+' : stats.mentorsCount}
              </h3>
              <p className="text-lg text-gray-600 font-medium">Active Mentors</p>
            </div>
          </div>
        </div>
      </section>

      {/* Notice Board Section */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Notice Board & Events</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest announcements, upcoming alumni meets, and important college events.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {notices.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No active notices</h3>
                <p className="text-gray-500">Check back later for upcoming events and announcements.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {notices.map((notice) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    key={notice._id} 
                    className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                      <h3 className="text-2xl font-bold text-gray-900">{notice.title}</h3>
                      <div className="flex items-center text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full whitespace-nowrap">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(notice.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{notice.content}</p>
                    <div className="mt-6 pt-4 border-t border-gray-50 text-sm text-gray-500 font-medium">
                      Posted by {notice.author?.name || 'Coordinator'}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Slider Section */}
      <section className="bg-white pb-10">
        <AlumniSlider />
      </section>

      {/* Gallery Slider Section */}
      <section className="bg-white pb-20 border-t border-gray-100">
        <GallerySlider />
      </section>
    </div>
  );
};

export default Home;
