import { Building2, MapPin, TrendingUp } from 'lucide-react';
import type { Cooperative } from '../types';

interface CooperativeCardProps {
  cooperative: Cooperative;
  onSelect?: () => void;
}

export default function CooperativeCard({ cooperative, onSelect }: CooperativeCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-2xl">
              {cooperative.logo}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">
                {cooperative.name}
              </h3>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {cooperative.city}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Tasa promedio:</span>
            <span className="font-semibold text-primary-600 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              {cooperative.averageRate}% mensual
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Monto:</span>
            <span className="font-medium text-gray-800">
              ${(cooperative.minAmount / 1000000).toFixed(1)}M - ${(cooperative.maxAmount / 1000000).toFixed(1)}M
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Plazo máximo:</span>
            <span className="font-medium text-gray-800">
              {cooperative.maxTerm} meses
            </span>
          </div>
        </div>

        {onSelect && (
          <button
            onClick={onSelect}
            className="w-full bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Ver detalles
          </button>
        )}
      </div>
    </div>
  );
}
