import React from 'react';
import { useChatStore } from '../store/useChatStore';
import { useThemeStore } from '../store/useThemeStore';

const darkThemes = [
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'forest',
  'lofi',
  'fantasy',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'acid',
  'night',
  'coffee',
  'dim',
  'nord',
];

function ChatHeader() {
  const { selectedUser } = useChatStore();
  const { theme } = useThemeStore();

  if (!selectedUser) return null;

  // If theme is dark, text is white, else dark
  const textColorClass = darkThemes.includes(theme)
    ? 'text-white'
    : 'text-gray-900';

  return (
    <div className="flex items-center p-4 border-b border-gray-500  dark:border-gray-700">
      <div className="relative">
        <img
          src={selectedUser.profilePic || 'user.png'}
          alt={selectedUser.name}
          className="w-10 h-10 rounded-full"
        />
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
      </div>
      <div className="ml-3">
        <p className={`font-semibold ${textColorClass}`}>
          {selectedUser.name || 'User'}
        </p>
        <p className="text-xs text-green-500">Online</p>
      </div>
    </div>
  );
}

export default ChatHeader;
