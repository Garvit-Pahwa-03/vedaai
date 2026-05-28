'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAssignmentStore, selectUpcomingCount } from '@/store/assignmentStore';
import { Plus } from 'lucide-react';

const bottomItems = [
  { href: '/', label: 'Home', iconPath: '/icons/4squares.svg' },
  { href: '/assignments', label: 'Assignments', iconPath: '/icons/Assignments.svg' },
  { href: '/library', label: 'Library', iconPath: '/icons/Mylibrary.svg' },
  { href: '/toolkit', label: 'AI Toolkit', iconPath: '/icons/Aiteacherstoolkit.svg' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const upcomingCount = useAssignmentStore(selectUpcomingCount);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Floating + button */}
      <div className="absolute -top-6 right-4">
        <button
          onClick={() => router.push('/assignments/create')}
          className="w-12 h-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <Plus size={22} className="text-gray-700" />
        </button>
      </div>

      {/* Bottom bar */}
      <div className="bg-[#1a1a1a] px-2 py-2 flex items-center justify-around">
        {bottomItems.map(({ href, label, iconPath }) => {
          const isActive =
            pathname === href ||
            (href === '/assignments' && pathname.startsWith('/assignments'));

          return (
            <Link key={href} href={href} className="flex-1">
              <div className="flex flex-col items-center gap-1 py-1 relative">
                {/* Assignments badge */}
                {label === 'Assignments' && upcomingCount > 0 && (
                  <span
                    className="absolute -top-1 right-6 text-[9px] text-white w-4 h-4 rounded-full flex items-center justify-center font-bold z-10"
                    style={{ backgroundColor: '#E8521A' }}
                  >
                    {upcomingCount > 9 ? '9+' : upcomingCount}
                  </span>
                )}
                <img
                  src={iconPath}
                  alt={label}
                  className={`w-5 h-5 object-contain transition-all ${
                    isActive
                      ? 'brightness-0 invert opacity-100'
                      : 'brightness-0 invert opacity-40'
                  }`}
                />
                <span
                  className={`text-[10px] transition-all ${
                    isActive
                      ? 'text-white font-medium opacity-100'
                      : 'text-white opacity-40'
                  }`}
                >
                  {label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}