'use client';
import { useEffect } from 'react';
import { useAssignmentStore } from '@/store/assignmentStore';

export default function StoreInitializer() {
  const fetchAssignments = useAssignmentStore((s) => s.fetchAssignments);

  useEffect(() => {
    fetchAssignments();
  }, []);

  return null;
}