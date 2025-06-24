import './globals.css';
import { Providers } from './providers'
import toast, { Toaster } from 'react-hot-toast';
export const metadata = {
  title: {
    default: 'SuperOdds',
    template: '%s | SuperOdds',
  },
  icons: {
    icon: '/logo.svg',
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>
        <Providers>{children}</Providers>
        <Toaster
          position="bottom-center"
          />
      </body>
    </html>
  )
}
