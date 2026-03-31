import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X } from 'lucide-react';

export const CookieConsent = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-96 z-[9999] bg-luxury-black border border-white/10 p-6 rounded-3xl shadow-2xl"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-luxury-gold/10 rounded-2xl text-luxury-gold">
              <Cookie size={24} />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-bold mb-2">Cookie Consent</h4>
              <p className="text-white/60 text-sm mb-4">
                We use cookies to improve your experience and analyze our traffic.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleAccept}
                  className="px-4 py-2 bg-luxury-gold text-luxury-black font-bold rounded-xl text-xs uppercase hover:scale-105 transition-transform"
                >
                  Accept
                </button>
                <button
                  onClick={handleDecline}
                  className="px-4 py-2 bg-white/5 text-white font-bold rounded-xl text-xs uppercase hover:bg-white/10 transition-colors"
                >
                  Decline
                </button>
              </div>
            </div>
            <button onClick={handleDecline} className="text-white/40 hover:text-white">
              <X size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
