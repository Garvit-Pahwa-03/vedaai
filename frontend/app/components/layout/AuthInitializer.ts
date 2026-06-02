'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

const publicRoutes = ['/signin', '/signup', '/verify-otp'];

export default function AuthInitializer() {
  const { loadFromStorage } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    loadFromStorage();
    setChecked(true);
  }, []);

  useEffect(() => {
    if (!checked) return;

    const token = localStorage.getItem('vedaai_token');
    const isPublic = publicRoutes.some((r) => pathname.startsWith(r));

    if (!token && !isPublic) {
      router.replace('/signin');
    } else if (token && isPublic) {
      router.replace('/assignments');
    }
  }, [checked, pathname]);

  return null;
}