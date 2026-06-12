import type { Metadata } from 'next';

import LandingPage from '@/components/landing/LandingPage';

export const metadata: Metadata = {
  title: 'SALO — AI-Powered Salon Management Platform',
  description:
    'Bookings, clients, reminders, payments, and business insights in one place. The AI-native salon management platform.',
};

export default function Home() {
  return <LandingPage />;
}
