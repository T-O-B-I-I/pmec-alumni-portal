import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GallerySlider = () => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/content/gallery')
      .then(res => res.json())
      .then(data => {
        if (data.data && Array.isArray(data.data.images) && data.data.images.length > 0) {
          setImages(data.data.images);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch gallery images', err);
        setLoading(false);
      });
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4000); // slightly faster than the alumni slider
    return () => clearInterval(timer);
  }, [images.length]);

  if (loading || images.length === 0) {
    return null; // Do not render if there's no gallery images or still loading
  }

  const currentImage = images[currentIndex];

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">College Memories</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">A glimpse into the vibrant campus life and events at PMEC.</p>
      </div>

      <div className="relative h-[300px] md:h-[500px] flex items-center justify-center overflow-hidden rounded-2xl shadow-md border border-gray-100 bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={currentImage}
              alt={`Gallery ${currentIndex + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay for better text contrast if we wanted to overlay text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </motion.div>
        </AnimatePresence>

        {images.length > 1 && (
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
      
      {images.length > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {images.map((_, index) => (
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
      
      <div className="text-center mt-8">
        <button 
          onClick={() => navigate('/gallery')}
          className="bg-gray-100 text-gray-800 px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors border border-gray-200"
        >
          View Full Gallery
        </button>
      </div>
    </div>
  );
};

export default GallerySlider;
