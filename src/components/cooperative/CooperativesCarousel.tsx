import { useEffect, useState } from "react";

import AlianzaDelValle from "../../images/cooperatives/AlianzaDelValle.png";
import Tulcan from "../../images/cooperatives/Tulcan.png";
import UnionElEjido from "../../images/cooperatives/UnionElEjido.png";

interface Cooperative {
  logo: string;
}

const cooperatives: Cooperative[] = [
  { logo: AlianzaDelValle },
  { logo: Tulcan },
  { logo: UnionElEjido },
];

export default function CooperativesCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % cooperatives.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const current = cooperatives[index];

  return (
    <div className="text-center py-6">
      {/* Título */}
      <h3 className="text-white font-semibold text-sm tracking-wide uppercase mb-6">
        Nuestros Aliados
      </h3>

      {/* Logo rotativo */}
      <div className="h-20 flex items-center justify-center transition-all duration-500">
        <div className="bg-white/95 rounded-2xl px-8 py-5 shadow-xl border border-white/40 backdrop-blur-md">
          <img
            src={current.logo}
            alt="Cooperativa aliada"
            className="h-14 object-contain drop-shadow-md"
          />
        </div>
      </div>

      {/* Indicadores */}
      <div className="flex justify-center gap-2 mt-6">
        {cooperatives.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === index ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
