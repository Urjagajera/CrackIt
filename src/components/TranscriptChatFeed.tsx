import React from 'react';
import { TranscriptItem } from '../types';

interface TranscriptChatFeedProps {
  transcript: TranscriptItem[];
}

export const TranscriptChatFeed: React.FC<TranscriptChatFeedProps> = ({ transcript }) => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-5 pr-2">
      {transcript.map((item, index) => {
        const isUser = item.role === 'user';
        const itemKey = item.id ? String(item.id) : `${item.role}-${item.time}-${index}`;
        return (
          <div key={itemKey} className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && (
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 shadow-sm border border-primary/20 mt-1">
                <span className="material-symbols-outlined text-sm">smart_toy</span>
              </div>
            )}

            <div className={`max-w-[80%] md:max-w-[70%] p-4 rounded-2xl ${
              isUser 
                ? 'bg-primary text-on-primary rounded-tr-none shadow-md' 
                : 'bg-surface-container-low text-on-surface rounded-tl-none border border-surface-variant/40 shadow-sm'
            }`}>
              <div className="flex justify-between items-center gap-4 mb-1">
                <p className={`font-bold text-xs ${isUser ? 'text-on-primary/90' : 'text-primary'}`}>
                  {isUser ? 'You' : 'Interviewer (AI)'}
                </p>
                <span className={`text-[10px] font-mono ${isUser ? 'text-on-primary/70' : 'text-on-surface-variant'}`}>
                  {item.time}
                </span>
              </div>

              <p className="text-sm leading-relaxed">{item.text}</p>

              {item.feedback && (
                <div className={`mt-3 p-3 rounded-xl text-xs border ${
                  item.feedback.type === 'good' 
                    ? isUser ? 'bg-white/10 border-white/20 text-white' : 'bg-tertiary/10 border-tertiary/20 text-tertiary font-medium'
                    : isUser ? 'bg-error-container/30 border-white/20 text-white' : 'bg-error-container/20 border-error-container text-on-error-container'
                }`}>
                  <p className="font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">
                      {item.feedback.type === 'good' ? 'check_circle' : 'warning'}
                    </span>
                    <span>AI Feedback:</span>
                  </p>
                  <p className="mt-1">{item.feedback.text}</p>
                </div>
              )}
            </div>

            {isUser && (
              <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center flex-shrink-0 shadow-sm border border-secondary/20 mt-1">
                <span className="material-symbols-outlined text-sm">person</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TranscriptChatFeed;
