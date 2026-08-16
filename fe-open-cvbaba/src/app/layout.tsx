import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { TooltipProvider } from './components/ui/Tooltip';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './components/ThemeProvider';
import GoogleAnalytics from './components/Sidebar/components/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  // TODO: Replace with your actual production domain
  metadataBase: new URL('http://localhost:3000'),
  title: "open-cvbaba - Design & Create Professional Documents",
  description:
    "open-cvbaba is your intelligent document designer. Generate beautifully formatted PDF and Word documents instantly. More than just writing—create stunning reports, proposals, and CVs.",
  openGraph: {
    title: "open-cvbaba - Design & Create Professional Documents",
    description:
      "Generate beautifully formatted PDF and Word documents instantly. More than just writing—create stunning reports, proposals, and CVs with AI.",
    images: [
      {
        url: "/images/header-babaai-v1.png",
        width: 1200,
        height: 630,
        alt: "open-cvbaba - AI Document Designer",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "open-cvbaba - Design & Create Professional Documents",
    description:
      "Generate beautifully formatted PDF and Word documents instantly. More than just writing—create stunning reports, proposals, and CVs with AI.",
    images: ['/images/header-babaai-v1.png'],
  },
  icons: {
    icon: '/images/header-babaai-v1.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={inter.className}>
        <GoogleAnalytics />
        <LanguageProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <TooltipProvider>{children}</TooltipProvider>
          </ThemeProvider>
        </LanguageProvider>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
