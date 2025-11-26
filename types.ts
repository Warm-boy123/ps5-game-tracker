export interface GameTransaction {
  id: string;
  title: string;
  coverUrl?: string; // Optional URL for cover art
  
  // Purchase details
  purchasePrice: number;
  purchaseDate: string; // ISO Date YYYY-MM-DD
  retailer: string;
  
  // Current Market Value (for unsold games)
  currentValue?: number;

  // Sale details
  isSold: boolean;
  salePrice?: number;
  saleDate?: string; // ISO Date YYYY-MM-DD
  salePlatform?: string; // e.g., Xianyu, Friend, GameStore
  
  createdAt: number;
}

export interface Stats {
  totalSpent: number;
  totalRecovered: number;
  netCost: number;
  gameCount: number;
  soldCount: number;
  projectedCost: number; // Replaces avgCostPerGame
}

export enum ModalType {
  ADD = 'ADD',
  EDIT = 'EDIT',
  SELL = 'SELL',
  DELETE = 'DELETE',
  NONE = 'NONE'
}

export interface GameFormData {
  title: string;
  purchasePrice: string;
  purchaseDate: string;
  retailer: string;
  currentValue: string; // New field for estimated second-hand price
  salePrice: string;
  saleDate: string;
  salePlatform: string;
  isSold: boolean;
}