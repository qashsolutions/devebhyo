export interface Temple {
  id: string;
  name: string;
  deity: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  address: string;
  description: string;
  sevas: Seva[];
  timings: string;
  imageUri?: string;
}

export interface Priest {
  id: string;
  name: string;
  city: string;
  state: string;
  specializations: string[];
  languages: string[];
  experience: number; // years
  rating: number;
  premiumRate: number; // per hour in INR
  available: boolean;
  templeId?: string;
  bio: string;
}

export interface Seva {
  id: string;
  name: string;
  description: string;
  price: number; // INR, 0 = donation-based
  duration: string;
  category: 'archana' | 'abhishekam' | 'homam' | 'puja' | 'darshan' | 'donation';
}

export interface UserProfile {
  phoneNumber: string;
  dateOfBirth: string; // ISO date string
  name?: string;
  gotra?: string;
  nakshatra?: string;
  maritalStatus?: 'single' | 'married';
  numberOfChildren?: number;
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
    state?: string;
  };
}

export interface Booking {
  id: string;
  type: 'seva' | 'priest_consultation';
  templeId?: string;
  priestId?: string;
  sevaId?: string;
  date: string;
  time: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}
