import { motion } from 'framer-motion';
import { FRENCH_COLORS } from '../../constants/theme';

export const TrustBadges = () => {
  const badges = [
    {
      id: 1,
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      ),
      title: 'Free Shipping',
      description: 'On all orders over €50',
    },
    {
      id: 2,
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      title: 'Secure Payment',
      description: '100% secure transactions',
    },
    {
      id: 3,
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
        </svg>
      ),
      title: '24/7 Support',
      description: 'Dedicated customer service',
    },
    {
      id: 4,
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9.75h4.875a2.625 2.625 0 010 5.25H12M8.25 9.75L10.5 7.5M8.25 9.75L10.5 12m9-7.243V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z" />
        </svg>
      ),
      title: 'Premium Quality',
      description: 'Authentic French formulations',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <section className="py-10 relative overflow-hidden bg-white">
      {/* French-inspired subtle background accent */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute right-0 h-full w-1/3 bg-gradient-to-l"
          style={{ 
            backgroundImage: `linear-gradient(to left, ${FRENCH_COLORS.red}30, transparent)` 
          }}
        />
        <div className="absolute left-0 h-full w-1/3 bg-gradient-to-r"
          style={{ 
            backgroundImage: `linear-gradient(to right, ${FRENCH_COLORS.blue}30, transparent)` 
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {badges.map((badge) => (
            <motion.div
              key={badge.id}
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-xl flex flex-col items-center text-center group relative overflow-hidden"
              style={{ 
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                border: '1px solid rgba(0,0,0,0.05)'
              }}
            >
              {/* Subtle accent in top corner */}
              <div className="absolute top-0 right-0 w-20 h-20 -mr-10 -mt-10 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
                style={{ 
                  background: badge.id % 2 === 0 
                    ? `radial-gradient(circle at center, ${FRENCH_COLORS.blue} 0%, transparent 70%)`
                    : `radial-gradient(circle at center, ${FRENCH_COLORS.red} 0%, transparent 70%)`
                }}
              />
              
              {/* Icon wrapper with hover effect */}
              <div className="mb-4 relative">
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-10 transition-opacity"
                  style={{ 
                    backgroundColor: badge.id % 2 === 0 ? FRENCH_COLORS.blue : FRENCH_COLORS.red,
                    transform: 'scale(2)'
                  }}
                />
                <div className="relative w-16 h-16 flex items-center justify-center rounded-full group-hover:scale-110 transition-transform"
                  style={{ 
                    color: badge.id % 2 === 0 ? FRENCH_COLORS.blue : FRENCH_COLORS.red
                  }}
                >
                  {badge.icon}
                </div>
              </div>
              <h3 className="text-lg font-bold mb-1" style={{ color: FRENCH_COLORS.dark }}>
                {badge.title}
              </h3>
              <p className="text-sm text-gray-500">
                {badge.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}; 