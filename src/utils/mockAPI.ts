import type { User, CreditRequest, Cooperative } from '../types';
import cooperativesData from '../data/cooperatives.json';

// Mock storage usando localStorage
const USERS_KEY = 'tepresto_users';
const CREDIT_REQUESTS_KEY = 'tepresto_credit_requests';
const CURRENT_USER_KEY = 'tepresto_current_user';

// Inicializar datos de demostración
const initializeMockData = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    const demoUsers: User[] = [
      {
        id: 'user-1',
        email: 'cliente@demo.com',
        name: 'Juan Pérez',
        type: 'client',
      },
      {
        id: 'user-2',
        email: 'cooperativa@demo.com',
        name: 'CoopFinanzas Plus',
        type: 'cooperative',
      },
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers));
  }

  if (!localStorage.getItem(CREDIT_REQUESTS_KEY)) {
    localStorage.setItem(CREDIT_REQUESTS_KEY, JSON.stringify([]));
  }
};

initializeMockData();

// Simular delay de red
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Obtener usuarios
const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Guardar usuarios
const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Autenticación
export const login = async (email: string, password: string): Promise<User | null> => {
  await delay();
  const users = getUsers();
  const user = users.find(u => u.email === email);

  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  }

  return null;
};

export const register = async (name: string, email: string, password: string, type: 'client' | 'cooperative'): Promise<User> => {
  await delay();
  const users = getUsers();

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    throw new Error('El email ya está registrado');
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    email,
    name,
    type,
  };

  users.push(newUser);
  saveUsers(users);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

  return newUser;
};

export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Cooperativas
export const getCooperatives = async (): Promise<Cooperative[]> => {
  await delay(300);
  return cooperativesData as Cooperative[];
};

export const getCooperativeById = async (id: string): Promise<Cooperative | null> => {
  await delay(200);
  const cooperative = cooperativesData.find(c => c.id === id);
  return cooperative as Cooperative || null;
};

// Solicitudes de crédito
const getCreditRequests = (): CreditRequest[] => {
  const requests = localStorage.getItem(CREDIT_REQUESTS_KEY);
  return requests ? JSON.parse(requests) : [];
};

const saveCreditRequests = (requests: CreditRequest[]) => {
  localStorage.setItem(CREDIT_REQUESTS_KEY, JSON.stringify(requests));
};

export const createCreditRequest = async (
  clientId: string,
  clientName: string,
  amount: number,
  term: number,
  city: string
): Promise<CreditRequest> => {
  await delay();

  const requests = getCreditRequests();
  const newRequest: CreditRequest = {
    id: `req-${Date.now()}`,
    clientId,
    clientName,
    amount,
    term,
    city,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  requests.push(newRequest);
  saveCreditRequests(requests);

  return newRequest;
};

export const getCreditRequestsByClient = async (clientId: string): Promise<CreditRequest[]> => {
  await delay(300);
  const requests = getCreditRequests();
  return requests.filter(r => r.clientId === clientId);
};

export const getCreditRequestsByCooperative = async (cooperativeId: string): Promise<CreditRequest[]> => {
  await delay(300);
  const requests = getCreditRequests();
  return requests.filter(r => r.cooperativeId === cooperativeId || r.status === 'pending');
};

export const getAllCreditRequests = async (): Promise<CreditRequest[]> => {
  await delay(300);
  return getCreditRequests();
};

export const updateCreditRequestStatus = async (
  requestId: string,
  status: CreditRequest['status'],
  cooperativeId?: string,
  cooperativeName?: string
): Promise<CreditRequest> => {
  await delay();

  const requests = getCreditRequests();
  const requestIndex = requests.findIndex(r => r.id === requestId);

  if (requestIndex === -1) {
    throw new Error('Solicitud no encontrada');
  }

  requests[requestIndex] = {
    ...requests[requestIndex],
    status,
    cooperativeId,
    cooperativeName,
    updatedAt: new Date(),
  };

  saveCreditRequests(requests);

  return requests[requestIndex];
};

// Lógica para filtrar cooperativas que aprueban un crédito
export const getEligibleCooperatives = async (
  amount: number,
  term: number,
  city: string
): Promise<Cooperative[]> => {
  await delay(400);

  const cooperatives = cooperativesData as Cooperative[];

  return cooperatives.filter(coop => {
    const matchesAmount = amount >= coop.minAmount && amount <= coop.maxAmount;
    const matchesTerm = term <= coop.maxTerm;
    const matchesCity = coop.city.toLowerCase() === city.toLowerCase() || city.toLowerCase() === 'todas';

    return matchesAmount && matchesTerm && matchesCity;
  });
};
