import React, { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

const PWAInstallPrompt: React.FC = () => {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);

  useEffect(() => {
    // Register service worker
    const updateSW = registerSW({
      onNeedRefresh() {
        setNeedRefresh(true);
      },
      onOfflineReady() {
        setOfflineReady(true);
      }
    });

    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setInstallPrompt(e);
    });

    return () => {
      // Clean up
      window.removeEventListener('beforeinstallprompt', () => {});
    };
  }, []);

  const handleInstall = () => {
    if (!installPrompt) return;
    
    // Show the install prompt
    (installPrompt as any).prompt();
    
    // Wait for the user to respond to the prompt
    (installPrompt as any).userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setInstallPrompt(null);
    });
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (!needRefresh && !offlineReady && !installPrompt) return null;

  return (
    <div className="pwa-prompt">
      {offlineReady && (
        <div className="pwa-message">
          App ready to work offline!
          <button className="pwa-button" onClick={() => setOfflineReady(false)}>
            Close
          </button>
        </div>
      )}
      
      {needRefresh && (
        <div className="pwa-message">
          New content available, click to refresh.
          <button className="pwa-button" onClick={handleRefresh}>
            Refresh
          </button>
        </div>
      )}
      
      {installPrompt && (
        <div className="pwa-message">
          Install this app on your device for offline use.
          <button className="pwa-button" onClick={handleInstall}>
            Install
          </button>
          <button className="pwa-button secondary" onClick={() => setInstallPrompt(null)}>
            Not now
          </button>
        </div>
      )}
    </div>
  );
};

export default PWAInstallPrompt;
