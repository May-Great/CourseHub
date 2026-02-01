'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BuyerPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/buyer/catalog');
  }, [router]);
  
  return null;
}