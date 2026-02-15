
export interface Receipt {
  id: string;
  date: string;
  merchant: string;
  total: number;
  category: string;
  imageUrl: string;
  timestamp: number;
}

export type View = 'history' | 'camera' | 'edit';

export const CATEGORIES = [
  'Food & Dining',
  'Shopping',
  'Travel',
  'Health',
  'Utilities',
  'Entertainment',
  'Other'
];
