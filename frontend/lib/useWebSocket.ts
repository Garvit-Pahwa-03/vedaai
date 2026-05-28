'use client';
import { useEffect, useRef } from 'react';
import { useAssignmentStore } from '@/store/assignmentStore';

export const useWebSocket = (assignmentId?: string) => {
  const ws = useRef<WebSocket | null>(null);
  const { updateAssignmentStatus, setPaperFromWS, fetchAssignments } =
    useAssignmentStore();

  useEffect(() => {
    const WS_URL =
      process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000/ws';
    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      if (assignmentId && ws.current) {
        ws.current.send(
          JSON.stringify({ type: 'subscribe', assignmentId })
        );
      }
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'status' && data.assignmentId) {
          updateAssignmentStatus(data.assignmentId, data.status);
        }

        if (data.type === 'completed' && data.assignmentId) {
          updateAssignmentStatus(data.assignmentId, 'completed');
          setPaperFromWS(data.paperId, data.assignmentId);
          fetchAssignments();
        }
      } catch {}
    };

    return () => {
      ws.current?.close();
    };
  }, [assignmentId]);
};