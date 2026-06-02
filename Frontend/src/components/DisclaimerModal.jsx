import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Monitor, ShieldAlert } from 'lucide-react';

export default function DisclaimerModal({ isOpen, onAccept }) {
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [percent, setPercent] = useState(100);

  useEffect(() => {
    if (!isOpen) return;

    // Tick every 100ms for fluid progress bar transition
    const totalDuration = 10000; // 10 seconds
    const intervalTime = 100; // 100ms
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += intervalTime;
      const remainingTime = Math.max(0, 10 - Math.floor(elapsed / 1000));
      const remainingPercent = Math.max(0, 100 - (elapsed / totalDuration) * 100);

      setSecondsLeft(remainingTime);
      setPercent(remainingPercent);

      if (elapsed >= totalDuration) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div>
          {/* Backdrop lock - no click-to-close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-backdrop"
            style={{ backdropFilter: 'blur(8px)' }}
          />

          <div className="modal-center-container">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0 }}
              className="modal-panel"
              style={{ maxWidth: '520px', borderTop: '4px solid var(--color-gold)' }}
            >
              {/* Notice Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div className="modal-alert-icon-box" style={{ color: 'var(--color-gold)', backgroundColor: 'rgba(255, 192, 0, 0.1)' }}>
                  <ShieldAlert size={24} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '0.1em' }}>
                  IMPORTANT NOTICE & DISCLAIMER
                </h3>
              </div>

              {/* Warning Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px', lineHeight: '1.6', color: 'var(--color-smoke)' }}>
                {/* Device warning */}
                <div style={{ display: 'flex', gap: '12px', backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '16px', border: '1px solid var(--color-charcoal)' }}>
                  <Monitor size={28} className="text-lambo-gold" style={{ flexShrink: 0 }} />
                  <p>
                    <strong style={{ color: 'var(--color-white)' }}>RECOMMENDED DEVICE USAGE:</strong><br />
                    This preparation platform is optimized for larger displays. It provides a significantly better experience on a <strong style={{ color: 'var(--color-white)' }}>LAPTOP or DESKTOP</strong> compared to a mobile device.
                  </p>
                </div>

                {/* Content disclaimer */}
                <div style={{ display: 'flex', gap: '12px', backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '16px', border: '1px solid var(--color-charcoal)' }}>
                  <AlertTriangle size={28} className="text-red-500" style={{ flexShrink: 0 }} />
                  <p>
                    <strong style={{ color: 'var(--color-white)' }}>CONTENT ACCURACY DISCLAIMER:</strong><br />
                    The author is <strong style={{ color: 'var(--color-white)' }}>NOT responsible</strong> for any missing questions, incorrect answers, or inaccuracies in the provided MCQs. Use this material as reference prep only.
                  </p>
                </div>
              </div>

              {/* Countdown Progress indicator */}
              <div className="countdown-progress-track">
                <div
                  className="countdown-progress-bar"
                  style={{ width: `${percent}%`, transition: 'width 0.1s linear' }}
                />
              </div>

              {/* Action button */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  disabled={secondsLeft > 0}
                  onClick={onAccept}
                  className="btn-accent"
                  style={{
                    width: '100%',
                    backgroundColor: secondsLeft > 0 ? 'var(--color-graphite)' : 'var(--color-gold)',
                    color: secondsLeft > 0 ? 'var(--color-steel)' : 'var(--color-black)',
                    cursor: secondsLeft > 0 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {secondsLeft > 0 
                    ? `DISMISS NOTICE IN ${secondsLeft}S` 
                    : "I AGREE & CONTINUE"
                  }
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
