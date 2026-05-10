export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface Cart {
  id: string;
  name: string;
  cuisine: string;
  image: string;
  items: MenuItem[];
  isOpen: boolean;
}

export interface UserStats {
  xp: number;
  level: number;
  totalSpent: number;
  nextRewardAt: number;
}

export interface Notification {
  id: string;
  type: 'music' | 'food' | 'info' | 'reward';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface NotificationPreferences {
  musicAlerts: boolean;
  foodSpecials: boolean;
  rewardMilestones: boolean;
  announcements: boolean;
}
