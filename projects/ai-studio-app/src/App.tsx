import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Music, 
  Trophy, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  MapPin, 
  Beer, 
  Flame, 
  X,
  Star,
  Zap,
  Info,
  Bell,
  Settings,
  CheckCircle2,
  AlertCircle,
  QrCode
} from 'lucide-react';
import { CARTS, MOCK_NOTIFICATIONS } from './constants';
import { Cart, MenuItem, UserStats, Notification, NotificationPreferences } from './types';

// --- Components ---

const NotificationCenter: React.FC<{ 
  notifications: Notification[], 
  onClose: () => void,
  onMarkRead: (id: string) => void
}> = ({ 
  notifications, 
  onClose,
  onMarkRead 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed inset-0 z-[100] bg-surface flex flex-col"
    >
      <div className="p-5 border-b border-white/5 flex justify-between items-center bg-surface-soft/50 backdrop-blur-xl">
        <h2 className="text-xl font-bold italic uppercase transform -skew-x-6">Notifications</h2>
        <button onClick={onClose} className="p-2 bg-white/5 rounded-full">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <motion.div 
              key={n.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => onMarkRead(n.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${n.isRead ? 'bg-surface-soft/30 border-white/5 opacity-60' : 'bg-surface-soft border-white/10 shadow-lg'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${n.isRead ? 'bg-transparent' : 'bg-orange-500'}`} />
                  <h4 className="font-bold text-sm">{n.title}</h4>
                </div>
                <span className="text-[10px] text-gray-500">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{n.message}</p>
            </motion.div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
            <Bell size={48} className="mb-4" />
            <p className="font-medium">All caught up!</p>
          </div>
        )}
      </div>

      <div className="p-5 border-t border-white/5 bg-surface-soft/20 text-center">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Showing last 24 hours</p>
      </div>
    </motion.div>
  );
};

const PreferencesModal: React.FC<{ 
  prefs: NotificationPreferences, 
  onClose: () => void, 
  onUpdate: (prefs: NotificationPreferences) => void 
}> = ({ 
  prefs, 
  onClose, 
  onUpdate 
}) => {
  const toggle = (key: keyof NotificationPreferences) => {
    onUpdate({ ...prefs, [key]: !prefs[key] });
  };

  const options = [
    { key: 'musicAlerts', label: 'Live Music Alert', icon: <Music size={18} />, desc: 'Get notified when bands take the stage' },
    { key: 'foodSpecials', label: 'Daily Specials', icon: <Flame size={18} />, desc: 'Exclusive deals from favorite carts' },
    { key: 'rewardMilestones', label: 'Reward Milestones', icon: <Trophy size={18} />, desc: 'Alerts when you earn new perks' },
    { key: 'announcements', label: 'Announcements', icon: <AlertCircle size={18} />, desc: 'Important park-wide updates' },
  ] as const;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[100] bg-surface flex flex-col"
    >
      <div className="p-5 border-b border-white/5 flex justify-between items-center">
        <h2 className="text-xl font-bold italic uppercase transform -skew-x-6">Notification Settings</h2>
        <button onClick={onClose} className="p-2 bg-white/5 rounded-full">
          <X size={20} />
        </button>
      </div>

      <div className="p-5 space-y-6">
        <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20">
          <p className="text-xs text-orange-200 leading-relaxed">
            Stay in the loop with what's happening at Corner 14. You can customize exactly what alerts you want to receive below.
          </p>
        </div>

        <div className="space-y-4">
          {options.map((opt) => (
            <div key={opt.key} className="flex items-center justify-between p-4 bg-surface-soft rounded-2xl border border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
                  {opt.icon}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{opt.label}</h4>
                  <p className="text-[10px] text-gray-500">{opt.desc}</p>
                </div>
              </div>
              <button 
                onClick={() => toggle(opt.key)}
                className={`w-12 h-6 rounded-full transition-all relative ${prefs[opt.key] ? 'bg-orange-500' : 'bg-gray-700'}`}
              >
                <motion.div 
                  animate={{ x: prefs[opt.key] ? 24 : 4 }}
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto p-5 pb-10">
        <button 
          onClick={onClose}
          className="w-full py-4 bg-white text-surface font-bold rounded-2xl flex items-center justify-center gap-2"
        >
          <CheckCircle2 size={18} /> Save Preferences
        </button>
      </div>
    </motion.div>
  );
};

const XPBar: React.FC<{ stats: UserStats }> = ({ stats }) => {
  const percentage = (stats.xp / stats.nextRewardAt) * 100;
  
  return (
    <div id="xp-section" className="p-4 bg-surface-soft rounded-2xl border border-white/5 shadow-xl">
      <div className="flex justify-between items-end mb-2">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Level {stats.level}</p>
          <h2 className="text-2xl font-bold gradient-text">Pod Pass XP</h2>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-amber-400">{stats.xp} / {stats.nextRewardAt} XP</p>
          <p className="text-[10px] text-gray-500">Next Reward: Free Pint</p>
        </div>
      </div>
      
      <div className="h-4 bg-black/40 rounded-full overflow-hidden border border-white/5 relative">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-orange-600 via-orange-400 to-amber-300"
        >
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[pulse_2s_linear_infinite]" />
        </motion.div>
      </div>
      
      <p className="mt-3 text-xs text-gray-400 flex items-center gap-1">
        <Trophy size={14} className="text-amber-500" />
        Spend $1 to earn 10 XP at any Corner 14 cart.
      </p>
    </div>
  );
};

const MusicTimer = () => {
  const [timeLeft, setTimeLeft] = useState(14400); // 4 hours in seconds for demo

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div id="music-timer" className="relative h-24 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 to-purple-900 border border-white/10 group cursor-pointer">
      <div className="absolute inset-0 bg-[url('./assets/ai_studio.png')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-1000" />
      <div className="absolute inset-0 backdrop-blur-[2px]" />
      
      <div className="relative h-full p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20 animate-pulse">
            <Music size={24} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-indigo-200">AI Studio Interactive</p>
            <h3 className="text-lg font-bold text-white">The Cascade Boys</h3>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase font-bold text-indigo-300">Starts In</p>
          <div className="text-2xl font-mono font-bold text-white tracking-tighter">
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>
    </div>
  );
};

const CartAccordion: React.FC<{ cart: Cart }> = ({ cart }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`mb-4 rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-surface-soft ring-1 ring-white/10' : 'bg-surface-soft/50 ring-1 ring-white/5'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-4 p-4 text-left"
      >
        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10">
          <img src={cart.image} alt={cart.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          {!cart.isOpen && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-[8px] font-bold uppercase text-white px-1.5 py-0.5 bg-red-500 rounded">Closed</span>
            </div>
          )}
        </div>
        
        <div className="grow">
          <h3 className="text-lg font-bold flex items-center gap-2">
            {cart.name}
            {cart.isOpen && <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />}
          </h3>
          <p className="text-sm text-gray-400 capitalize">{cart.cuisine}</p>
        </div>
        
        <div className="shrink-0 text-gray-500">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-4 pb-4 border-t border-white/5">
              <div className="space-y-4 pt-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-2 rounded-xl hover:bg-white/5 transition-colors">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-20 h-20 rounded-lg object-cover shrink-0" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="grow flex flex-col justify-between py-0.5">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-gray-100">{item.name}</h4>
                          <span className="text-sm font-bold text-amber-500 font-mono">${item.price.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                      </div>
                      <div className="flex gap-2">
                         <span className="text-[9px] font-bold uppercase tracking-wide bg-white/10 px-2 py-0.5 rounded text-gray-400">{item.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ShareEarnModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-zinc-900 border border-white/10 w-full max-w-sm rounded-3xl overflow-hidden relative mb-24 overflow-y-auto max-h-[90vh] p-6"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white mb-2 italic uppercase transform -skew-x-6">Share & Earn</h3>
          <p className="text-gray-400 text-sm">Invite friends and earn rewards</p>
        </div>
        <div className="bg-white p-4 rounded-2xl mb-6 flex justify-center">
          <div className="w-48 h-48 flex items-center justify-center rounded-lg">
            <QrCode size={120} className="text-black" />
          </div>
        </div>
        <div className="space-y-3">
          <button className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors">
            Copy Link
          </button>
          <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-colors">
            Share Link
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [showShareModal, setShowShareModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats] = useState<UserStats>({
    xp: 680,
    level: 4,
    totalSpent: 68,
    nextRewardAt: 1000
  });
  const [showPromo, setShowPromo] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [prefs, setPrefs] = useState<NotificationPreferences>({
    musicAlerts: true,
    foodSpecials: true,
    rewardMilestones: true,
    announcements: true
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const filteredCarts = useMemo(() => {
    if (!searchQuery) return CARTS;
    const query = searchQuery.toLowerCase();
    return CARTS.filter(cart => 
      cart.name.toLowerCase().includes(query) || 
      cart.cuisine.toLowerCase().includes(query) ||
      cart.items.some(item => item.name.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-surface selection:bg-orange-500/30">
      {/* --- Modals --- */}
      <AnimatePresence>
        {showNotifications && (
          <NotificationCenter 
            notifications={notifications} 
            onClose={() => setShowNotifications(false)}
            onMarkRead={markAsRead}
          />
        )}
        {showPrefs && (
          <PreferencesModal 
            prefs={prefs} 
            onClose={() => setShowPrefs(false)} 
            onUpdate={setPrefs}
          />
        )}
      </AnimatePresence>

      {/* --- Top Status Bar Spacer --- */}
      <div className="h-6" />

      {/* --- Header --- */}
      <header className="px-5 mb-6">
        <div className="flex justify-between items-center mb-1 gap-4">
          <div className="shrink-0">
            <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase transform -skew-x-12">AI STUDIO</h1>
            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
              <MapPin size={10} className="text-orange-500" />
              Oregon City, OR
            </div>
          </div>

          {/* --- Relocated Promo Banner --- */}
          <div className="flex-1 min-w-0">
            <AnimatePresence>
              {showPromo && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full"
                >
                  <div 
                    id="promo-banner" 
                    className="relative p-3 rounded-3xl bg-orange-500 overflow-hidden shadow-lg shadow-orange-950/40 flex items-center gap-3 transition-all cursor-pointer"
                    onClick={() => setShowPromo(false)}
                  >
                    <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 border border-white/20">
                      <Beer size={20} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[11px] font-black text-white leading-tight uppercase italic transform -skew-x-6 truncate">Happy Hour!</h4>
                      <p className="text-[9px] font-medium text-orange-50 line-clamp-1">$2 off drafts</p>
                    </div>
                    <div className="absolute -bottom-4 -right-2 opacity-10 transform rotate-12 pointer-events-none">
                      <Flame size={60} className="text-white" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-2 shrink-0">
            <button 
              onClick={() => setShowNotifications(true)}
              className="w-10 h-10 rounded-full glass flex items-center justify-center relative border border-white/10"
            >
              <Bell size={18} className="text-white" />
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-surface" />
              )}
            </button>
            <button 
              onClick={() => setShowPrefs(true)}
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-amber-500 border border-white/10"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* --- Promo Banner removed from here --- */}

      <main className="px-5 pb-24 space-y-6">
        {/* --- XP Bar --- */}
        <XPBar stats={stats} />

        {/* --- Music Countdown --- */}
        <MusicTimer />

        {/* --- Search and Filter --- */}
        <div id="search-container" className="flex gap-3">
          <div className="relative grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Cravings? Search burgers, tacos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-soft border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all placeholder:text-gray-600"
            />
          </div>
          <button className="w-12 bg-surface-soft border border-white/5 rounded-xl flex items-center justify-center text-gray-400">
            <Star size={20} />
          </button>
        </div>

        {/* --- Food Carts List --- */}
        <div id="carts-section">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-bold text-white flex items-center gap-2 italic uppercase transform -skew-x-6">
              The Pod Lineup
              <span className="text-xs bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded italic not-italic transform skew-x-6">5 Total</span>
             </h2>
             <button className="text-xs font-bold text-orange-500 uppercase tracking-widest flex items-center gap-1">
               Map <Info size={12} />
             </button>
          </div>

          <div className="space-y-4">
            {filteredCarts.length > 0 ? (
              filteredCarts.map(cart => (
                <CartAccordion key={cart.id} cart={cart} />
              ))
            ) : (
              <div className="py-12 text-center text-gray-500">
                <Search size={40} className="mx-auto mb-3 opacity-20" />
                <p className="font-medium">Nothing matches your search</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-sm text-orange-500 underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-surface/80 backdrop-blur-xl border-t border-white/5 px-8 flex justify-between items-center z-50">
        <button className="flex flex-col items-center gap-1 text-orange-500">
          <Beer size={24} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Pod Pass</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-300 transition-colors">
          <MapPin size={24} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Find</span>
        </button>
        <button onClick={() => setShowShareModal(true)} className="flex flex-col items-center gap-1 -mt-10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20 border-4 border-surface group ring-4 ring-orange-500/10">
            <Zap size={28} className="text-white group-hover:scale-110 transition-transform" fill="white" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter mt-1 text-orange-500">Quick Pay</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-300 transition-colors">
          <Trophy size={24} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Rewards</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-300 transition-colors">
          <Info size={24} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Support</span>
        </button>
        <AnimatePresence>
          {showShareModal && <ShareEarnModal onClose={() => setShowShareModal(false)} />}
        </AnimatePresence>
      </nav>
    </div>
  );
}

