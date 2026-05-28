'use client';
import { useEffect, useRef } from 'react';
import { useAssignmentStore } from '@/store/assignmentStore';

export const useWebSocket = (assignmentId?: string) => {
  const ws = useRef<WebSocket | null>(null);
  const { updateAssignmentStatus, setPaperFromWS, fetchAssignments } =
    useAssignmentStore();

  useEffect(() => {
    // 1. Strict execution protection against SSR environments
    if (typeof window === 'undefined') return;

    const WS_URL =
      process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000/ws';
    
    // 2. Instantiate safely inside the browser context
    const socket = new WebSocket(WS_URL);
    ws.current = socket;

    socket.onopen = () => {
      if (assignmentId && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({ type: 'subscribe', assignmentId })
        );
      }
    };

    socket.onmessage = (event) => {
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
      } catch (err) {
        console.error('WebSocket message parsing error:', err);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket execution error:', error);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
    };
  }, [assignmentId, updateAssignmentStatus, setPaperFromWS, fetchAssignments]);
};