
import { QRTemplate } from './types';

export const CATEGORIES = [
  'Electronics',
  'Keys',
  'Wallets/Bags',
  'IDs/Documents',
  'Pets',
  'Other'
];

export const QR_TEMPLATES: QRTemplate[] = [
  { id: 'classic', name: 'Classic Yellow', bgColor: 'bg-yellow-400', textColor: 'text-black', accentColor: '#000000' },
  { id: 'dark', name: 'Midnight Blue', bgColor: 'bg-brand-blue', textColor: 'text-white', accentColor: '#ffde59' },
  { id: 'minimal', name: 'Minimal White', bgColor: 'bg-white', textColor: 'text-gray-800', accentColor: '#004E89' },
  { id: 'danger', name: 'Safety Orange', bgColor: 'bg-orange-500', textColor: 'text-white', accentColor: '#ffffff' },
  { id: 'eco', name: 'Eco Green', bgColor: 'bg-green-600', textColor: 'text-white', accentColor: '#ffde59' },
  { id: 'royal', name: 'Royal Purple', bgColor: 'bg-purple-700', textColor: 'text-white', accentColor: '#ffde59' }
];

export const BRAND_COLORS = {
  yellow: '#ffde59',
  blue: '#004E89'
};
