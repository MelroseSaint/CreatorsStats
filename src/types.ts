export interface MetricEntry {
  id: string;
  date: string;
  subs: number;
  views: number;
  revenue: number;
}

export interface Project {
  id: string;
  name: string;
  releaseDate: string;
  type: 'video' | 'song' | 'merch' | 'other';
  status: 'planning' | 'in-progress' | 'completed';
}

export interface UserSettings {
  currency: string;
  theme: 'dark' | 'light';
}

export interface UserProfile {
  name: string;
  niche: string;
  platform: 'youtube' | 'instagram' | 'tiktok' | 'twitch' | 'other';
  isPro: boolean;
  onboardingComplete: boolean;
}

export interface AppState {
  meta: {
    version: string;
    lastSaved: number;
  };
  user: UserProfile;
  settings: UserSettings;
  metrics: MetricEntry[];
  projects: Project[];
}

export const INITIAL_STATE: AppState = {
  meta: {
    version: '1.0',
    lastSaved: Date.now(),
  },
  user: {
    name: 'Creator',
    niche: 'general',
    platform: 'youtube',
    isPro: false,
    onboardingComplete: false,
  },
  settings: {
    currency: 'USD',
    theme: 'dark',
  },
  metrics: [],
  projects: [],
};
