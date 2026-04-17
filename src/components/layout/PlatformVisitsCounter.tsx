import { useEffect, useRef, useState } from "react";

export default function PlatformVisitsCounter() {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const target = 2000;

  // Arranca la animación solo cuando el elemento es visible en pantalla
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const duration = 1500;
    const increment = target / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(counter);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [hasStarted]);

  return (
    <div ref={ref} className="text-center mt-6">
      <h3 className="text-white font-semibold text-sm tracking-wide uppercase mb-3">
        Visitantes
      </h3>
      <div className="text-4xl font-bold text-white">
        {count.toLocaleString()}+
      </div>
      <div className="text-white/70 text-sm font-medium">
        Personas ya han visitado nuestra plataforma
      </div>
    </div>
  );
}
