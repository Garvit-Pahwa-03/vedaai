'use client';
import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

const publicRoutes = ['/signin', '/signup', '/verify-otp'];

export default function AuthInitializer() {
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage);
  const router = useRouter();
  const pathname = usePathname();
  const checkedRef = useRef(false);

  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;

    loadFromStorage();

    const token = localStorage.getItem('vedaai_token');
    const isPublic = publicRoutes.some((r) => pathname.startsWith(r));

    if (!token && !isPublic) {
      router.replace('/signin');
    } else if (token && isPublic) {
      router.replace('/assignments');
    }
  }, []);

  return null;
}