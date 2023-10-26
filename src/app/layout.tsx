import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';
import styles from './layout.module.css';

import { NavBar } from '../components/NavBar/NavBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'jss.computer',
  description: 'Frontend for the DevOps for TypeScript Developers Course',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar />

        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}
