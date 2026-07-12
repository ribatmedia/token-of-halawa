import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Token of Halawa | Intelligent Donation Management',
  description: 'Enterprise donation management software for NGOs, charities, schools, and religious institutions. Manage campaigns, volunteers, and digital receipts.',
  keywords: ['donation srv', 'donation management', 'mosque donation', 'madrasa', 'charity saas', 'digital receipts'],
  authors: [{ name: 'Token of Halawa Team' }]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <style>{`
          html, body {
            font-family: 'Outfit', sans-serif;
          }
        `}</style>
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
