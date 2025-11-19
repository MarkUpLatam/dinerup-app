export type UserType = 'client' | 'cooperative';

export interface User {
  id: string;
  email: string;
  name: string;
  type: UserType;
}

export interface Cooperative {
  id: string;
  name: string;
  logo: string;
  averageRate: number;
  city: string;
  address: string;
  coordinates: [number, number];
  minAmount: number;
  maxAmount: number;
  maxTerm: number;
}

export interface CreditRequest {
  id: string;
  clientId: string;
  clientName: string;
  amount: number;
  term: number;
  city: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  cooperativeId?: string;
  cooperativeName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginFormData {
  email: string;
  password: string;
  userType: UserType;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: UserType;
}

export interface CreditRequestFormData {
  amount: number;
  term: number;
  city: string;
}
