// T037 — MessagesPanel — panneau droit 320px, données réelles

import { Search, MoreVertical, Star } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import type { DashboardMessage } from '@/types/app';

const avatarColors = [
  'bg-pw-400',
  'bg-sky-400',
  'bg-pw-600',
  'bg-pw-300',
  'bg-sky-300',
];

interface MessagesPanelProps {
  messages: DashboardMessage[];
}

export default function MessagesPanel({ messages }: MessagesPanelProps) {
  return (
    <aside className="hidden lg:flex flex-col w-[320px] shrink-0 bg-white rounded-bento overflow-hidden border border-warm-100">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h2 className="text-base font-bold text-gray-900">Messages</h2>
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
        {messages.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-8">Aucun message</p>
        ) : (
          messages.map((msg, i) => (
            <div
              key={msg.id}
              className="flex items-start gap-3 px-5 py-4 cursor-pointer transition-colors hover:bg-warm-50"
            >
              {/* Avatar */}
              <div
                className={cn(
                  'h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0',
                  avatarColors[i % avatarColors.length]
                )}
              >
                {msg.author_name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">
                    {msg.author_name}
                  </span>
                  <Star className="h-3.5 w-3.5 shrink-0 text-gray-300 hover:text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mt-1 line-clamp-2">
                  {msg.content}
                </p>
                <span className="text-[10px] text-gray-400 mt-1 block">
                  {msg.project_name} · {formatDate(msg.created_at)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
