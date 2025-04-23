import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FRENCH_COLORS } from '../../constants/theme';

export const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handleVideoToggle = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50"></div>
        
        {/* Diagonal accent line - top left */}
        <div className="absolute -left-20 top-0 h-[400px] w-[150px] -rotate-45 opacity-5"
          style={{ backgroundColor: FRENCH_COLORS.blue }}
        ></div>
        
        {/* Diagonal accent line - bottom right */}
        <div className="absolute -right-20 bottom-0 h-[400px] w-[150px] -rotate-45 opacity-5"
          style={{ backgroundColor: FRENCH_COLORS.red }}
        ></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div 
              className="inline-block px-3 py-1 mb-3 rounded-full text-sm font-medium"
              style={{ backgroundColor: `${FRENCH_COLORS.blue}15`, color: FRENCH_COLORS.blue }}
            >
              The French Touch
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: FRENCH_COLORS.dark }}>
              Discover Our Cosmetic Journey
            </h2>
            <p className="text-gray-600 md:text-lg">
              See how we craft our premium French-inspired cosmetics, combining tradition with innovation for exceptional results.
            </p>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl"
          style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)' }}
        >
          {/* French flag accent top strip */}
          <div className="absolute top-0 left-0 right-0 h-1.5 z-10 flex">
            <div className="w-1/3 bg-blue-600"></div>
            <div className="w-1/3 bg-white"></div>
            <div className="w-1/3 bg-red-600"></div>
          </div>
          
          {/* Video Container */}
          <div className="relative aspect-video bg-black">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              poster="/images/video-thumbnail.jpg"
              onError={(e) => {
                console.error("Failed to load video thumbnail");
                e.target.poster = "https://images.unsplash.com/photo-1596704017254-9036c8bfa9e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80";
              }}
            >
              <source src="/videos/brand-story.mp4" type="video/mp4" />
              <source src="/videos/brand-story.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video>
            
            {/* Play/Pause Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleVideoToggle}
              className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm group z-10"
              style={{ opacity: isPlaying ? 0 : 1, transition: 'opacity 0.3s ease' }}
              onMouseOver={() => { if (!isPlaying) document.body.style.cursor = 'pointer'; }}
              onMouseOut={() => { document.body.style.cursor = 'default'; }}
            >
              <div className="w-20 h-20 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ 
                  background: `linear-gradient(135deg, ${FRENCH_COLORS.blue}, ${FRENCH_COLORS.red})`,
                  boxShadow: '0 0 30px rgba(0,0,0,0.2)'
                }}
              >
                <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </motion.button>
          </div>
          
          {/* Video Caption */}
          <div className="p-6 bg-white/90 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-2" style={{ color: FRENCH_COLORS.dark }}>
              The Art of French Beauty
            </h3>
            <p className="text-gray-600">
              Our beauty philosophy combines traditional French ingredients with modern science to create products that pamper your skin and elevate your beauty routine.
            </p>
          </div>
        </motion.div>
        
        {/* Feature highlights below video */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
          {[
            {
              icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              ),
              title: "Sustainable Practices",
              desc: "Eco-friendly packaging and responsibly sourced ingredients"
            },
            {
              icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              ),
              title: "Artisanal Craftsmanship",
              desc: "Each product carefully crafted with attention to detail"
            },
            {
              icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: "Cruelty-Free",
              desc: "Never tested on animals, always kind to our planet"
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + (idx * 0.1) }}
              viewport={{ once: true }}
              className="flex items-start p-5 rounded-xl bg-white/80 backdrop-blur-sm"
              style={{ 
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                border: '1px solid rgba(0,0,0,0.05)'
              }}
            >
              <div className="mr-4 p-3 rounded-full"
                style={{ 
                  backgroundColor: `${idx % 2 === 0 ? FRENCH_COLORS.blue : FRENCH_COLORS.red}15`,
                  color: idx % 2 === 0 ? FRENCH_COLORS.blue : FRENCH_COLORS.red
                }}
              >
                {feature.icon}
              </div>
              <div>
                <h4 className="font-bold mb-1" style={{ color: FRENCH_COLORS.dark }}>
                  {feature.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}; 