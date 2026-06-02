'use client';
import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const publicRoutes = ['/signin', '/signup', '/verify-otp'];

export default function AuthInitializer() {
  const router = useRouter();
  const pathname = usePathname();
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

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