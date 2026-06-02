'use client';
import { Bell, ChevronDown, Menu, LogOut } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

const pageTitles: Record<string, string> = {
  '/assignments': 'Assignment',
  '/assignments/create': 'Create Assignment',
  '/': 'Home',
  '/groups': 'My Groups',
  '/toolkit': 'AI Toolkit',
  '/library': 'My Library',
};

export default function TopBar({ title }: { title?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);

  const resolvedTitle =
    title ||
    pageTitles[pathname] ||
    (pathname.startsWith('/assignments/') ? 'Assignment' : 'Assignment');

  const isInnerPage = pathname !== '/assignments' && pathname !== '/';
  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : 'U';
  const fullName = user ? `${user.firstName} ${user.lastName}` : 'User';

  return (
    <header className="h-14 mt-2 mx-2 md:mx-4 bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] flex items-center justify-between px-3 md:px-6 sticky top-2 z-30 border border-gray-100/50">

      {/* Mobile left */}
      <div className="flex md:hidden items-center gap-2">
        {isInnerPage ? (
          <>
            <button type="button" onClick={() => router.back()} className="w-7 h-7 flex items-center justify-center hover:opacity-70 transition-opacity">
              <img src="/icons/backarrow.svg" className="w-4 h-4" alt="back" />
            </button>
            <span className="font-semibold text-sm text-gray-800">{resolvedTitle}</span>
          </>
        ) : (
          <>
            <div className="w-7 h-7 bg-[#111111] rounded-lg flex items-center justify-center">
              <img src="https://framerusercontent.com/images/lbpUIfvyh4wK5fzYeLgNIYSWSo.png?width=461&height=461" alt="VedaAI" className="w-4 h-4 object-contain mix-blend-lighten" />
            </div>
            <span className="font-semibold text-base text-gray-800">VedaAI</span>
          </>
        )}
      </div>

      {/* Desktop left */}
      <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 min-w-0">
        <button type="button" onClick={() => router.back()} className="hover:opacity-70 transition-opacity flex-shrink-0 p-1">
          <img src="/icons/backarrow.svg" className="w-5 h-5" alt="back" />
        </button>
        <span className="flex-shrink-0">
          <img src="/icons/4squares.svg" className="w-5 h-5" alt="" />
        </span>
        <span className="font-medium text-gray-700 truncate">{resolvedTitle}</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
        <button className="relative p-1">
          <Bell size={16} className="text-gray-500" />
          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-orange-500 rounded-full" />
        </button>

        {/* Desktop user pill */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 text-sm bg-gray-50/50 pl-1 pr-2 py-1 rounded-full border border-gray-100/50 hover:bg-gray-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
              <span className="text-xs font-semibold text-white">{initials}</span>
            </div>
            <span className="font-medium text-gray-700 text-sm">{fullName}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-10 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden w-40">
              <button
                onClick={() => { logout(); setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Mobile avatar */}
        <div className="flex md:hidden w-8 h-8 rounded-full bg-gray-800 items-center justify-center border border-gray-200">
          <span className="text-xs font-semibold text-white">{initials}</span>
        </div>

        <button type="button" className="flex md:hidden p-1 text-gray-500">
          <Menu size={18} />
        </button>
      </div>
    </header>
  );
}