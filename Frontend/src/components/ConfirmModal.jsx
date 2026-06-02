import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "CONFIRM", cancelText = "CANCEL" }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="modal-backdrop"
          />

          {/* Modal Content */}
          <div className="modal-center-container">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0 }}
              className="modal-panel"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="modal-close-btn"
                title="Close dialog"
              >
                <X size={18} />
              </button>

              {/* Content body */}
              <div className="modal-body">
                <div className="modal-alert-icon-box">
                  <AlertTriangle size={22} />
                </div>
                <div className="modal-header">
                  <h3>{title}</h3>
                  <p>{message}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="modal-actions-row">
                <button
                  onClick={onClose}
                  className="btn-ghost"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="btn-accent"
                  style={{ backgroundColor: 'var(--color-error)', color: 'var(--color-white)' }}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
