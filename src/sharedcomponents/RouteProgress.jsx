import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function RouteProgress() {
  const { pathname } = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);

  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setVisible(true);
    setProgress(15);
  }

  useEffect(() => {
    if (!visible) return undefined;
    const timers = [
      setTimeout(() => setProgress(65), 120),
      setTimeout(() => setProgress(92), 280),
      setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setVisible(false);
          setProgress(0);
        }, 250);
      }, 420),
    ];
    return () => timers.forEach(clearTimeout);
  }, [visible, pathname]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed top-0 right-0 left-0 z-50 h-1">
      <div
        className="h-full bg-rose-600 shadow-[0_0_8px_rgba(225,29,72,0.45)] transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
