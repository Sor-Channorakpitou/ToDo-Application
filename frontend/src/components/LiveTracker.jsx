import { useState, useEffect } from 'react';
import { Monitor, Clock } from 'lucide-react';

/**
 * LiveTracker Component
 * 
 * Demonstrates clean, leak-free React effects:
 * 1. Window Resize Listener Effect: Tracks live window width with dependency array []
 *    and a cleanup function that removes the 'resize' event listener.
 *    Cleanup prevents: dangling global event listeners on window and state updates on unmounted components.
 * 2. Clock Interval Effect: Tracks live local time with dependency array []
 *    and a cleanup function that clears the interval.
 *    Cleanup prevents: background timer accumulation and memory leaks on route changes.
 */
export default function LiveTracker() {
  const [windowWidth, setWindowWidth] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const [time, setTime] = useState(() => new Date());

  // Effect 1: Window width listener with listener cleanup
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);

    // Cleanup: removes the event listener when component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array: runs only on mount and unmount

  // Effect 2: Clock ticker with interval cleanup
  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Cleanup: clears interval when component unmounts
    return () => {
      clearInterval(timerId);
    };
  }, []); // Empty dependency array: runs only on mount and unmount

  const formattedTime = time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="live-tracker" title="Live window width & clock monitor with active cleanup on unmount">
      <div className="live-pill">
        <span className="live-dot" aria-hidden="true" />
        <Monitor size={13} style={{ opacity: 0.8 }} />
        <span>{windowWidth}px</span>
      </div>
      <span className="live-divider" aria-hidden="true" />
      <div className="live-pill time-display">
        <Clock size={13} style={{ opacity: 0.8 }} />
        <span>{formattedTime}</span>
      </div>
    </div>
  );
}
