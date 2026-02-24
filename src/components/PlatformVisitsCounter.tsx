import { useEffect, useState } from "react";

export default function PlatformVisitsCounter() {
  const [count, setCount] = useState(0);
  const target = 2000;

  useEffect(() => {
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
  }, []);

  return (
    <div className="text-center mt-6">
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
