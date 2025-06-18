import './globals.css';
import { Providers } from './providers'

export const metadata = {
  title: {
    default: 'Cadastro de bolão'
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
      </body>
    </html>
  )
}
