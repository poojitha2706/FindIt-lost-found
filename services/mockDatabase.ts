import { Item, User, ScanEvent } from '../types';

// Robust local-first database implementation to bypass Firebase Storage and Auth issues.
const STORAGE_KEYS = {
  USERS: 'findit_v2_users',
  ITEMS: 'findit_v2_items',
  SCANS: 'findit_v2_scans',
  SESSION: 'findit_v2_session'
};

const getDB = <T>(key: string, fallback: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
};

const saveDB = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Storage full or blocked", e);
    // If quota exceeded, we might need to alert the user or prune old scans
  }
};

let currentUser: User | null = getDB(STORAGE_KEYS.SESSION, null);

export const db = {
  auth: {
    login: async (email: string, pass: string) => {
      await new Promise(r => setTimeout(r, 600));
      const users = getDB<any[]>(STORAGE_KEYS.USERS, []);
      const user = users.find(u => u.email === email && u.password === pass);
      if (user) {
        const { password, ...profile } = user;
        currentUser = profile;
        saveDB(STORAGE_KEYS.SESSION, currentUser);
        return currentUser;
      }
      throw new Error("Invalid credentials. Try again!");
    },
    signup: async (email: string, pass: string, name: string, phone: string) => {
      await new Promise(r => setTimeout(r, 800));
      const users = getDB<any[]>(STORAGE_KEYS.USERS, []);
      if (users.some(u => u.email === email)) throw new Error("Email already registered.");
      
      const newUser = { id: Math.random().toString(36).substr(2, 9), email, name, phone, password: pass };
      users.push(newUser);
      saveDB(STORAGE_KEYS.USERS, users);
      
      const { password, ...profile } = newUser;
      currentUser = profile;
      saveDB(STORAGE_KEYS.SESSION, currentUser);
      return currentUser;
    },
    logout: async () => {
      currentUser = null;
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    },
    getCurrentUser: () => currentUser,
  },
  users: {
    findById: async (id: string) => {
      const users = getDB<any[]>(STORAGE_KEYS.USERS, []);
      const user = users.find(u => u.id === id);
      if (!user) return null;
      const { password, ...profile } = user;
      return profile;
    }
  },
  items: {
    add: async (item: Omit<Item, 'photoUrl'>, photoBase64?: string) => {
      const items = getDB<Item[]>(STORAGE_KEYS.ITEMS, []);
      // We store the image as a Base64 string directly to avoid Firebase Storage.
      // If no photo is provided, we use a high-quality placeholder.
      const photoUrl = photoBase64 || `https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?q=80&w=400&h=400&auto=format&fit=crop`;
      const newItem: Item = { ...item, photoUrl, createdAt: Date.now() };
      items.push(newItem);
      saveDB(STORAGE_KEYS.ITEMS, items);
      return newItem;
    },
    getById: async (id: string) => {
      const items = getDB<Item[]>(STORAGE_KEYS.ITEMS, []);
      return items.find(i => i.id === id) || null;
    },
    getByOwner: async (ownerId: string) => {
      const items = getDB<Item[]>(STORAGE_KEYS.ITEMS, []);
      return items.filter(i => i.ownerId === ownerId);
    },
    delete: async (id: string) => {
      const items = getDB<Item[]>(STORAGE_KEYS.ITEMS, []);
      saveDB(STORAGE_KEYS.ITEMS, items.filter(i => i.id !== id));
      const scans = getDB<ScanEvent[]>(STORAGE_KEYS.SCANS, []);
      saveDB(STORAGE_KEYS.SCANS, scans.filter(s => s.itemId !== id));
    }
  },
  scans: {
    add: async (scan: Omit<ScanEvent, 'id'>) => {
      const scans = getDB<ScanEvent[]>(STORAGE_KEYS.SCANS, []);
      const id = Math.random().toString(36).substr(2, 9);
      const newScan = { ...scan, id, timestamp: Date.now() };
      scans.push(newScan);
      saveDB(STORAGE_KEYS.SCANS, scans);
      return id;
    },
    getByOwner: async (ownerId: string) => {
      const items = getDB<Item[]>(STORAGE_KEYS.ITEMS, []);
      const myIds = items.filter(i => i.ownerId === ownerId).map(i => i.id);
      const scans = getDB<ScanEvent[]>(STORAGE_KEYS.SCANS, []);
      return scans.filter(s => myIds.includes(s.itemId)).sort((a, b) => b.timestamp - a.timestamp);
    },
    getByItem: async (itemId: string) => {
      const scans = getDB<ScanEvent[]>(STORAGE_KEYS.SCANS, []);
      return scans.filter(s => s.itemId === itemId).sort((a, b) => b.timestamp - a.timestamp);
    }
  }
};