import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const ConfirmModal = ({ open, onClose, onConfirm }) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
          onClick={handleBackdropClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded-md shadow-md max-w-sm w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
            <p className="mb-6 text-gray-600">
              This task will be permanently deleted.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={onConfirm}
              >
                Delete 🗑️
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
