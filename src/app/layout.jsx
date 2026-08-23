import './globals.css';

export const metadata = {
  title: 'PMS – Purchase Management System',
  description: 'Purchase Management System for GCoEJ',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
