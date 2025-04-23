import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const CategoryCard = ({ category }) => {
  const imageUrl = category.image;

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="relative overflow-hidden rounded-lg shadow-lg h-64"
    >
      <Link to={`/categories/${category.id}`}>
        <div className="absolute inset-0">
          <img
            src={`http://localhost:3000/${imageUrl}`}
            alt={category.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
          {category.description && (
            <p className="text-white/80 text-sm line-clamp-2">{category.description}</p>
          )}
          <motion.div 
            whileHover={{ x: 5 }}
            className="mt-3 flex items-center text-white"
          >
            <span>View Products</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}; 