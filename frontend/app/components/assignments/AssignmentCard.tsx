'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreVertical, Eye, Trash2 } from 'lucide-react';
import { Assignment } from '@/types';
import { useAssignmentStore } from '@/store/assignmentStore';
import { format } from 'date-fns';

export default function AssignmentCard({ assignment }: { assignment: Assignment }) {
  const [showMenu, setShowMenu] = useState(false);
  const { deleteAssignment } = useAssignmentStore();
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteAssignment(assignment._id);
    setShowMenu(false);
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/assignments/${assignment._id}`);
    setShowMenu(false);
  };

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), 'dd-MM-yyyy');
    } catch {
      return date;
    }
  };

  return (
    <div
      className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow cursor-pointer relative"
      onClick={() => router.push(`/assignments/${assignment._id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-sm text-gray-900 pr-6">{assignment.title}</h3>
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <MoreVertical size={16} className="text-gray-400" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-6 bg-white border border-gray-100 rounded-lg shadow-lg z-10 overflow-hidden w-36">
              <button
                onClick={handleView}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <Eye size={14} />
                View Assignment
              </button>
              <button
                onClick={handleDelete}
                className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>
          <span className="text-gray-500 font-medium">Assigned on</span> : {formatDate(assignment.createdAt)}
        </span>
        {assignment.dueDate && (
          <span>
            <span className="text-gray-500 font-medium">Due</span> : {formatDate(assignment.dueDate)}
          </span>
        )}
      </div>
    </div>
  );
}