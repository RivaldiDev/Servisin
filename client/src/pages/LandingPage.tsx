import React, { useState, useEffect } from 'react';
import { DesktopLanding } from '../components/landing/DesktopLanding';
import { MobileLanding } from '../components/landing/MobileLanding';
import { LegalModal } from '../components/profile/LegalModal';

export const LandingPage: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });

  const [legalModalOpen, setLegalModalOpen] = useState<boolean>(false);
  const [legalTab, setLegalTab] = useState<'terms' | 'privacy' | 'refund' | 'contact'>('terms');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleOpenLegal = (tab: 'terms' | 'privacy' | 'refund' | 'contact') => {
    setLegalTab(tab);
    setLegalModalOpen(true);
  };

  return (
    <>
      {isMobile ? (
        <MobileLanding onOpenLegal={handleOpenLegal} />
      ) : (
        <DesktopLanding onOpenLegal={handleOpenLegal} />
      )}

      {/* Legal & Policy Modal */}
      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalTab}
      />
    </>
  );
};
