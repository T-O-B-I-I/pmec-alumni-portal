import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Briefcase, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AlumniSlider = () => {
  const [alumniData, setAlumniData] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/alumni')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setAlumniData(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch alumni', err);
        setLoading(false);
      });
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === alumniData.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? alumniData.length - 1 : prevIndex - 1));
  };

  useEffect(() => {
    if (alumniData.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [alumniData.length]);

  if (loading) {
    return <div className="py-16 text-center text-gray-500">Loading Alumni...</div>;
  }

  if (alumniData.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Prominent Alumni</h2>
        <p>No alumni profiles are currently available to display.</p>
      </div>
    );
  }

  const currentAlumni = alumniData[currentIndex];

  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Prominent Alumni</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover the incredible journeys of PMEC graduates making their mark across the globe.</p>
      </div>

      <div className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden rounded-2xl bg-gray-50 shadow-sm border border-gray-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col md:flex-row items-center p-8 md:p-12 gap-8"
          >
            <div className="w-48 h-48 md:w-72 md:h-72 flex-shrink-0">
              <img
                src={currentAlumni.photoUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&q=80'}
                alt={currentAlumni.user?.name || 'Alumni'}
                className="w-full h-full object-cover rounded-full md:rounded-2xl shadow-lg border-4 border-white"
              />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">{currentAlumni.user?.name}</h3>
              
              <div className="flex flex-col gap-3 mt-6">
                <div className="flex items-center justify-center md:justify-start text-gray-600">
                  <GraduationCap className="w-5 h-5 mr-3 text-blue-600" />
                  <span className="text-lg">Class of {currentAlumni.batch} • {currentAlumni.branch}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start text-gray-600">
                  <Briefcase className="w-5 h-5 mr-3 text-blue-600" />
                  <span className="text-lg font-medium text-gray-800">
                    {currentAlumni.professionalDetails?.jobProfile || 'Professional'} @ {currentAlumni.professionalDetails?.company || 'Company'}
                  </span>
                </div>
              </div>
              
              <div className="mt-8">
                <button 
                  onClick={() => navigate(`/alumni/${currentAlumni.user?._id || currentAlumni.user?.id}`)}
                  className="bg-gray-900 text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
                >
                  View Profile
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {alumniData.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </>
        )}
      </div>
      
      {alumniData.length > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {alumniData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AlumniSlider;
