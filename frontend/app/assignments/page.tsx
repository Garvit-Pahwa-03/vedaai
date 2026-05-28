'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Plus } from 'lucide-react';
import { useAssignmentStore } from '@/store/assignmentStore';
import { useWebSocket } from '@/lib/useWebSocket';
import NoAssignmentsIcon from '@/app/components/icons/NoAssignmentsIcon';
import AssignmentCard from '@/app/components/assignments/AssignmentCard';

export default function AssignmentsPage() {
  const { assignments, fetchAssignments, isLoading } = useAssignmentStore();
  const [search, setSearch] = useState('');
  const router = useRouter();
  useWebSocket();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const filtered = assignments.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6 max-w-5xl mx-auto">
      {assignments.length === 0 ? (

        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
          <NoAssignmentsIcon
            width={200}
            height={200}
            className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56"
          />
          <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-2 mt-2">
            No assignments yet
          </h2>
          <p className="text-xs md:text-sm text-gray-400 max-w-xs md:max-w-sm mb-6 leading-relaxed">
            Create your first assignment to start collecting and grading student submissions.
            You can set up rubrics, define marking criteria, and let AI assist with grading.
          </p>
          <button
            onClick={() => router.push('/assignments/create')}
            className="flex items-center gap-2 px-5 md:px-7 py-2.5 md:py-3 rounded-full text-white text-sm font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            <Plus size={14} />
            Create Your First Assignment
          </button>
        </div>

      ) : (

        <>
          {/* Desktop header */}
          <div className="hidden md:block mb-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <h1 className="text-lg font-semibold">Assignments</h1>
            </div>
            <p className="text-sm text-gray-400">Manage and create assignments for your classes.</p>
          </div>

          {/* Mobile header with back arrow + title like image 2 */}
          <div className="flex md:hidden items-center gap-3 mb-4 mt-1">
            <button
              onClick={() => router.back()}
              className="p-1 hover:opacity-70 transition-opacity"
            >
              <img src="/icons/backarrow.svg" className="w-4 h-4" alt="back" />
            </button>
            <h1 className="text-base font-semibold text-gray-900">Assignments</h1>
          </div>

          {/* Search + Filter */}
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <button className="flex items-center gap-1.5 text-xs md:text-sm text-gray-500 border border-gray-200 rounded-lg px-2.5 md:px-3 py-2 hover:bg-gray-50 whitespace-nowrap bg-white">
              <Filter size={12} />
              Filter
            </button>
            <div className="flex-1 relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search Name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-4 py-2 text-xs md:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 bg-white"
              />
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 pb-28 md:pb-24">
            {filtered.map((assignment) => (
              <AssignmentCard key={assignment._id} assignment={assignment} />
            ))}
          </div>

          {/* Desktop floating Create Assignment — properly centered accounting for sidebar */}
          <div className="hidden md:block fixed bottom-8 z-30" style={{ left: 'calc(260px + (100vw - 260px) / 2)', transform: 'translateX(-50%)' }}>
            <button
              onClick={() => router.push('/assignments/create')}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-medium shadow-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#1a1a1a' }}
            >
              <Plus size={16} />
              Create Assignment
            </button>
          </div>
        </>
      )}
    </div>
  );
}