'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

const publicRoutes = ['/signin', '/signup', '/verify-otp'];

export default function AuthInitializer() {
  const { loadFromStorage, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    loadFromStorage();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('vedaai_token');
    const isPublic = publicRoutes.includes(pathname);
    if (!token && !isPublic) {
      router.replace('/signin');
    }
    if (token && isPublic) {
      router.replace('/assignments');
    }
  }, [pathname]);

  return null;
}