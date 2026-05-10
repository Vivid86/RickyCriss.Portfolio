import { Cart, Notification } from './types';

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'music',
    title: 'Live Music Starting!',
    message: 'The Cascade Boys are taking the stage in 15 minutes. Grab a seat!',
    timestamp: '2026-05-08T10:15:00Z',
    isRead: false
  },
  {
    id: 'n2',
    type: 'food',
    title: 'Flash Special: Slap King',
    message: 'Get a side of Truffle Fries for 50% off with any burger purchase.',
    timestamp: '2026-05-08T09:30:00Z',
    isRead: true
  },
  {
    id: 'n3',
    type: 'reward',
    title: 'Reward Earned!',
    message: 'You reached Level 4! Use the Rewards tab to claim your free pint.',
    timestamp: '2026-05-08T08:00:00Z',
    isRead: true
  }
];

export const CARTS: Cart[] = [
  {
    id: '1',
    name: 'Slap King Burger',
    cuisine: 'American',
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80',
    items: [
      { id: 'm1', name: 'Original Slapper', description: 'Double wagyu beef, special sauce, pickles, onions.', price: 14.50, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', category: 'Main' },
      { id: 'm2', name: 'Truffle Fries', description: 'Hand-cut fries, truffle oil, parmesan, herbs.', price: 8.00, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80', category: 'Side' }
    ]
  },
  {
    id: '2',
    name: 'Taco Tech',
    cuisine: 'Mexican',
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80',
    items: [
      { id: 'm3', name: 'Al Pastor Tacos', description: 'Marinated pork, pineapple, cilantro, onion.', price: 12.00, image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400&q=80', category: 'Main' },
      { id: 'm4', name: 'Robot Birria', description: 'Slow cooked beef, melted cheese, consomme.', price: 15.00, image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&q=80', category: 'Main' }
    ]
  },
  {
    id: '3',
    name: 'Pho Forward',
    cuisine: 'Vietnamese',
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80',
    items: [
      { id: 'm5', name: 'Classic Beef Pho', description: 'Broth, rice noodles, rare steak, flank, brisket.', price: 16.00, image: 'https://images.unsplash.com/photo-1610450949065-1f280a373305?w=400&q=80', category: 'Main' },
      { id: 'm6', name: 'Spring Rolls', description: 'Shrimp, pork, vermicelli, herbs, peanut sauce.', price: 9.00, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db06?w=400&q=80', category: 'Appetizer' }
    ]
  },
  {
    id: '4',
    name: 'Pizza Peak',
    cuisine: 'Italian/Pizza',
    isOpen: false,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
    items: [
      { id: 'm7', name: 'Margherita', description: 'San Marzano tomatoes, fresh mozzarella, basil.', price: 18.00, image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?w=400&q=80', category: 'Main' }
    ]
  },
  {
    id: '5',
    name: 'Green Grid',
    cuisine: 'Salads/Bowls',
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    items: [
      { id: 'm8', name: 'Zen Bowl', description: 'Quinoa, kale, roasted sweet potato, tahini.', price: 13.50, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80', category: 'Main' }
    ]
  }
];
