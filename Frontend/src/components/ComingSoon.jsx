import { motion } from 'framer-motion';
import { Calendar, Sparkles, ArrowLeft } from 'lucide-react';

export default function ComingSoon({ onGoBack, subjectName, categoryName }) {
  return (
    <motion.div
      className="coming-soon-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="coming-soon-bg-dots" />
      
      <div className="coming-soon-content">
        <motion.div
          className="coming-soon-icon-container"
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: 'spring', 
            stiffness: 260, 
            damping: 20, 
            delay: 0.1 
          }}
        >
          <Calendar size={32} />
          <motion.div
            style={{ position: 'absolute', top: -4, right: -4 }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <Sparkles size={16} className="text-lambo-gold" />
          </motion.div>
        </motion.div>

        <h3 className="coming-soon-title">
          📚 Content Coming Soon
        </h3>

        <p className="coming-soon-desc">
          We are currently preparing MCQs for {subjectName && categoryName ? (
            <strong className="text-lambo-gold">{subjectName} ({categoryName})</strong>
          ) : (
            "this category"
          )}. Check back later for a complete question bank and test experience.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}>
          <div className="coming-soon-badge">
            <span className="hero-badge-dot" style={{ backgroundColor: 'var(--color-gold)' }} />
            Future Update Release
          </div>

          {onGoBack && (
            <button
              onClick={onGoBack}
              className="btn-ghost"
              style={{ gap: '8px', marginTop: '8px', height: '40px', padding: '0 20px', fontSize: '12px' }}
            >
              <ArrowLeft size={14} />
              GO BACK TO HOME
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
