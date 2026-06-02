'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, LogOut } from 'lucide-react';
import { useAssignmentStore, selectUpcomingCount } from '@/store/assignmentStore';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { href: '/', label: 'Home', iconPath: '/icons/4squares.svg' },
  { href: '/groups', label: 'My Groups', iconPath: '/icons/MyGroups.svg' },
  { href: '/assignments', label: 'Assignments', iconPath: '/icons/Assignments.svg' },
  { href: '/toolkit', label: "AI Teacher's Toolkit", iconPath: '/icons/Aiteacherstoolkit.svg' },
  { href: '/library', label: 'My Library', iconPath: '/icons/Mylibrary.svg' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const upcomingCount = useAssignmentStore(selectUpcomingCount);
  const { user, logout } = useAuthStore();

  return (
    <aside className="fixed left-2 top-2 bottom-2 w-[250px] bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-gray-100/50 flex flex-col z-40">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-b from-amber-500 via-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-sm">
            <img
              src="https://framerusercontent.com/images/lbpUIfvyh4wK5fzYeLgNIYSWSo.png?width=461&height=461"
              alt="VedaAI Icon"
              className="w-5 h-5 object-contain mix-blend-lighten"
            />
          </div>
          <span className="font-semibold text-2xl text-gray-700 tracking-tight">VedaAI</span>
        </div>
      </div>

      <div className="p-4">
        <Link href="/assignments/create">
          <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full border-2 border-[#E8521A] text-white text-sm font-medium bg-gradient-to-r from-[#2a2a2a] via-[#1a1a1a] to-[#2a2a2a] shadow-[0_0_12px_rgba(232,82,26,0.25)] transition-all duration-200 hover:brightness-110">
            <span><img src="/icons/generate.svg" className="w-4 h-4 invert" /></span>
            Create Assignment
          </button>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-2">
        {navItems.map(({ href, label, iconPath }) => {
          const isActive = pathname === href ||
            (href === '/assignments' && pathname.startsWith('/assignments'));
          return (
            <Link key={href} href={href}>
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm transition-colors ${
                isActive ? 'bg-gray-100 font-medium text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}>
                <img
                  src={iconPath}
                  alt=""
                  className={`w-4 h-4 object-contain transition-all duration-200 ${
                    isActive ? 'brightness-0 opacity-100' : 'brightness-0 opacity-40'
                  }`}
                />
                <span>{label}</span>
                {label === 'Assignments' && upcomingCount > 0 && (
                  <span className="ml-auto text-xs text-white px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#E8521A', fontSize: '11px' }}>
                    {upcomingCount}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <Link href="/settings">
          <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-500 hover:text-gray-900">
            <Settings size={16} />
            <span>Settings</span>
          </div>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
        <div className="flex items-center gap-3 mt-3 px-3 py-2 bg-gray-50 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-medium text-gray-600">
              {user?.firstName?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-medium text-gray-800 truncate">
              {user ? `${user.firstName} ${user.lastName}` : 'User'}
            </p>
            <p className="text-[10px] text-gray-400 truncate">{user?.email || ''}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}