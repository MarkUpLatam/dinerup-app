import { Calendar, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { CreditRequest } from '../types';

interface CreditCardProps {
  request: CreditRequest;
  onUpdateStatus?: (status: CreditRequest['status']) => void;
  showActions?: boolean;
}

const statusConfig = {
  pending: {
    label: 'Pendiente',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
  },
  under_review: {
    label: 'En revisión',
    color: 'bg-blue-100 text-blue-800',
    icon: AlertCircle,
  },
  approved: {
    label: 'Aprobado',
    color: 'bg-success-100 text-success-800',
    icon: CheckCircle,
  },
  rejected: {
    label: 'Rechazado',
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
  },
};

export default function CreditCard({ request, onUpdateStatus, showActions }: CreditCardProps) {
  const status = statusConfig[request.status];
  const StatusIcon = status.icon;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">
              {request.clientName}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Solicitud #{request.id.slice(-8)}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${status.color}`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {status.label}
          </span>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
              Monto solicitado:
            </span>
            <span className="font-semibold text-gray-800">
              {formatCurrency(request.amount)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              Plazo:
            </span>
            <span className="font-medium text-gray-800">
              {request.term} meses
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-gray-400" />
              Fecha de solicitud:
            </span>
            <span className="font-medium text-gray-800">
              {formatDate(request.createdAt)}
            </span>
          </div>

          {request.cooperativeName && (
            <div className="pt-2 border-t border-gray-100">
              <span className="text-sm text-gray-600">Cooperativa:</span>
              <p className="font-medium text-primary-600 mt-1">
                {request.cooperativeName}
              </p>
            </div>
          )}
        </div>

        {showActions && request.status === 'pending' && onUpdateStatus && (
          <div className="flex gap-2 pt-4 border-t border-gray-100">
            <button
              onClick={() => onUpdateStatus('approved')}
              className="flex-1 bg-success-600 text-white py-2 rounded-lg font-medium hover:bg-success-700 transition-colors"
            >
              Aprobar
            </button>
            <button
              onClick={() => onUpdateStatus('rejected')}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Rechazar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
