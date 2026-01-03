
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
}

export interface Item {
  id: string;
  ownerId: string;
  name: string;
  category: string;
  description: string;
  photoUrl: string;
  qrCode: string;
  createdAt: number;
}

export interface ScanEvent {
  id: string;
  itemId: string;
  timestamp: number;
  latitude: number;
  longitude: number;
  locationName?: string;
}

export interface QRTemplate {
  id: string;
  name: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
}
