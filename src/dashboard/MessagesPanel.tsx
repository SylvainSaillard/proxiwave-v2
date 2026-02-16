import { useTranslation } from 'react-i18next';
import { Search, MoreVertical, Star } from 'lucide-react';
import { messages } from './mockData';
import { cn } from '../lib/utils';

const avatarColors = [
  'bg-pw-400',
  'bg-sky-400',
  'bg-pw-600',
  'bg-pw-300',
  'bg-sky-300',
];

export default function MessagesPanel() {
  const { t } = useTranslation();

  return (
    <aside className="hidden lg:flex flex-col w-[320px] shrink-0 bg-white rounded-bento overflow-hidden border border-warm-100">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h2 className="text-base font-bold text-gray-900">
          {t('dashboard.messages_title')}
        </h2>
        <div className="flex items-center gap-1">
          <button className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-warm-50 transition-colors">
            <Search className="h-4 w-4" />
          </button>
          <button className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-warm-50 transition-colors">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={msg.id}
            className={cn(
              'flex items-start gap-3 px-5 py-4 cursor-pointer transition-colors hover:bg-warm-50',
              msg.starred && 'bg-pw-50/50'
            )}
          >
            {/* Avatar */}
            <div
              className={cn(
                'h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0',
                avatarColors[i % avatarColors.length]
              )}
            >
              {msg.avatar}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className={cn('text-sm font-semibold text-gray-900', msg.starred && 'font-bold')}>
                  {msg.sender}
                </span>
                <Star
                  className={cn(
                    'h-3.5 w-3.5 shrink-0',
                    msg.starred
                      ? 'text-pw-500 fill-pw-500'
                      : 'text-gray-300 hover:text-gray-400'
                  )}
                />
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mt-1 line-clamp-2">
                {msg.preview}
              </p>
              <span className="text-[10px] text-gray-400 mt-1 block">{msg.date}</span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
