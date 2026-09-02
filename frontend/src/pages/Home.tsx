import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users, BookOpen, Trophy, Megaphone, Calendar } from 'lucide-react';
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

      {/* Slider Section (Prominent Alumni) */}
      <section className="bg-white pb-10">
        <AlumniSlider />
      </section>

      {/* Notice Board Section */}
      <section className="bg-gray-50 py-16 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 inline-flex items-center">
              <Megaphone className="w-8 h-8 mr-3 text-blue-600" /> Notice Board & Events
            </h2>
            <p className="mt-4 text-lg text-gray-600">Stay updated with the latest news, meetups, and announcements.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notices.length > 0 ? (
              notices.slice(0, 6).map((notice) => (
                <div key={notice._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
                  <div className="bg-blue-600 h-2"></div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      {new Date(notice.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{notice.title}</h3>
                    <p className="text-gray-600 flex-grow whitespace-pre-wrap line-clamp-4">{notice.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-100">
                <p className="text-gray-500 text-lg">No notices or upcoming events at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Slider Section */}
      <section className="bg-white pb-20 border-t border-gray-100">
        <GallerySlider />
      </section>
    </div>
  );
};

export default Home;
