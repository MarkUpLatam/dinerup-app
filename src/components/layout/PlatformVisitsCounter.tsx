import { useEffect, useRef, useState } from "react";
import { httpClient } from "../../api/httpClient";

const SESSION_KEY = "dinerop_visit_registered";

export default function PlatformVisitsCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [displayCount, setDisplayCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 1. Al montar: registra la visita (solo 1 vez por sesión) y obtiene el total
  useEffect(() => {
    const alreadyRegistered = sessionStorage.getItem(SESSION_KEY);

    const fetchTotal = async () => {
      try {
        if (alreadyRegistered) {
          const data = await httpClient<{ total: number }>("/api/visits", { auth: false });
          setCount(data.total);
        } else {
          const data = await httpClient<{ total: number }>("/api/visits", { method: "POST", auth: false });
          sessionStorage.setItem(SESSION_KEY, "true");
          setCount(data.total);
        }
      } catch {
        setCount(2000);
      }
    };

    fetchTotal();
  }, []);

  // 2. Arrancar animación cuando el elemento es visible y ya tenemos el total
  useEffect(() => {
    if (count === null || hasAnimated) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [count, hasAnimated]);

  // 3. Animación del conteo: de 0 hasta `count`
  useEffect(() => {
    if (!hasAnimated || count === null) return;

    const duration = 1500;
    const fps = 16;
    const steps = duration / fps;
    const increment = count / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= count) {
        setDisplayCount(count);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(current));
      }
    }, fps);

    return () => clearInterval(timer);
  }, [hasAnimated, count]);

  const isLoading = count === null;

  return (
    <div ref={ref} className="text-center mt-6">
      <h3 className="text-white font-semibold text-sm tracking-wide uppercase mb-3">
        Visitantes
      </h3>

      <div className="text-4xl font-bold text-white min-h-[44px]">
        {isLoading ? (
          <span className="inline-block w-24 h-9 rounded-lg bg-white/20 animate-pulse" />
        ) : (
          `${displayCount.toLocaleString()}+`
        )}
      </div>

      <div className="text-white/70 text-sm font-medium mt-1">
        Personas ya han visitado nuestra plataforma
      </div>
    </div>
  );
}
