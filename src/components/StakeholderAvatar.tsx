import React from 'react';
import { Shareholder } from '../types';
import { Coins, Sprout, HeartPulse, Sparkles, Crown, ShieldCheck, User } from 'lucide-react';

interface StakeholderAvatarProps {
  shareholder: Shareholder;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showBadge?: boolean;
  className?: string;
  ringClass?: string;
}

const SIZE_CONFIG = {
  xs: {
    container: 'w-5 h-5 text-[9px] rounded-md',
    badge: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5',
    icon: 'w-1.5 h-1.5',
  },
  sm: {
    container: 'w-7 h-7 text-xs rounded-lg',
    badge: 'w-3.5 h-3.5 -bottom-0.5 -right-0.5',
    icon: 'w-2 h-2',
  },
  md: {
    container: 'w-10 h-10 text-sm rounded-xl',
    badge: 'w-4 h-4 -bottom-1 -right-1',
    icon: 'w-2.5 h-2.5',
  },
  lg: {
    container: 'w-12 h-12 text-base rounded-2xl',
    badge: 'w-4.5 h-4.5 -bottom-1 -right-1',
    icon: 'w-2.5 h-2.5',
  },
  xl: {
    container: 'w-14 h-14 text-lg rounded-2xl',
    badge: 'w-5 h-5 -bottom-1.5 -right-1.5',
    icon: 'w-3 h-3',
  },
  '2xl': {
    container: 'w-20 h-20 text-2xl rounded-2xl',
    badge: 'w-6 h-6 -bottom-1.5 -right-1.5',
    icon: 'w-3.5 h-3.5',
  },
};

export const getEmblemIcon = (iconName?: string) => {
  switch (iconName) {
    case 'coins':
      return Coins;
    case 'sprout':
      return Sprout;
    case 'heart':
      return HeartPulse;
    case 'sparkles':
      return Sparkles;
    case 'crown':
      return Crown;
    case 'shield':
      return ShieldCheck;
    default:
      return User;
  }
};

export const StakeholderAvatar: React.FC<StakeholderAvatarProps> = ({
  shareholder,
  size = 'md',
  showBadge = true,
  className = '',
  ringClass = 'ring-2 ring-emerald-500/40',
}) => {
  const initials = (shareholder.name || 'Member')
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const config = SIZE_CONFIG[size] || SIZE_CONFIG.md;
  const Emblem = getEmblemIcon(shareholder.avatarIcon);

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <div
        className={`${config.container} ${shareholder.avatarColor || 'bg-emerald-600'} flex items-center justify-center font-bold text-white shadow-md select-none transition-transform ${ringClass}`}
      >
        <span>{initials}</span>
      </div>

      {showBadge && (
        <div
          className={`absolute ${config.badge} bg-amber-400 text-slate-950 rounded-full flex items-center justify-center shadow-sm border border-slate-900`}
          title={`${shareholder.name} • ${shareholder.role}`}
        >
          <Emblem className={config.icon} />
        </div>
      )}
    </div>
  );
};
