import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PostHeroSections } from './components/PostHeroSections';
import { SmartSearchSection } from './components/SmartSearchSection';
import { HealthConcerns } from './components/HealthConcerns';
import { HowItWorks } from './components/HowItWorks';
import { ReportsAndApp } from './components/ReportsAndApp';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { HealthConcierge } from './components/HealthConcierge';
import { NotFound } from './components/NotFound';
import { PackagesPage } from './pages/PackagesPage';
import { PackageDetailsPage } from './pages/PackageDetailsPage';
import { TestsPage } from './pages/TestsPage';
import { TestDetailsPage } from './pages/TestDetailsPage';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutPage } from './pages/CheckoutPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    // 1. Smooth Scroll (Lenis)
    const lenis = new Lenis();
    (window as any).lenis = lenis;
    
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. Content Protection (Disable Right-click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    
    // 3. Prevent Screenshot Shortcuts (Enhanced)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+P, Ctrl+S, Ctrl+U, PrintScreen, Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+Shift+J
      const isScreenshotKey = e.key === 'PrintScreen' || (e.shiftKey && e.metaKey && (e.key === '3' || e.key === '4')); // Mac
      const isWindowScreenshot = (e.shiftKey && e.metaKey && e.key === 's') || (e.shiftKey && e.ctrlKey && e.key === 'S'); // Win
      
      if (
        (e.ctrlKey && (e.key === 'p' || e.key === 's' || e.key === 'u')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) ||
        isScreenshotKey || isWindowScreenshot
      ) {
        e.preventDefault();
        alert("Content Protection Enabled: Screenshots are restricted on this platform.");
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      lenis.destroy();
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  // Expose navigate globally for simple access in this prototype
  (window as any).appNavigate = navigate;

  const packageMatch = currentPath.match(/^\/package\/(\d+)/);
  const isPackageRoute = !!packageMatch;
  const packageId = packageMatch ? packageMatch[1] : '';

  const testMatch = currentPath.match(/^\/test\/(\d+)/);
  const isTestRoute = !!testMatch;
  const testId = testMatch ? testMatch[1] : '';

  return (
    <div className="min-h-screen bg-white relative flex flex-col">
      <Header onNavigate={navigate} onCartClick={() => setIsCartOpen(true)} />
      <main className="flex-1">
        {currentPath === '/404' ? (
          <NotFound onNavigate={navigate} />
        ) : currentPath === '/checkout' ? (
          <CheckoutPage />
        ) : currentPath === '/packages' ? (
          <PackagesPage />
        ) : currentPath === '/tests' ? (
          <TestsPage />
        ) : isPackageRoute ? (
          <PackageDetailsPage packageId={packageId} />
        ) : isTestRoute ? (
          <TestDetailsPage testId={testId} />
        ) : (
          <>
            <Hero />
            <PostHeroSections />
            <SmartSearchSection />
            <HealthConcerns />
            <HowItWorks />
            <ReportsAndApp />
            <Testimonials />
            <FAQ />
            <FinalCTA />
          </>
        )}
      </main>
      <Footer onNavigate={navigate} />
      <HealthConcierge />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
