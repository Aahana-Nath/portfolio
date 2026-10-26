import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans, Caveat } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import SmoothScroll from '@/components/SmoothScroll'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  weight: ['400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Aahana — Product Manager',
  description:
    'Building AI-powered products and scalable systems. From AI workflows to fintech systems, I design product experiences that solve real operational problems.',
  openGraph: {
    title: 'Aahana — Product Manager',
    description:
      'Building AI-powered products and scalable systems.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${caveat.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <SmoothScroll>{children}</SmoothScroll>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function (clarityWindow, clarityDocument, clarityKey, scriptTag, projectId) {
              clarityWindow[clarityKey] = clarityWindow[clarityKey] || function () {
                (clarityWindow[clarityKey].q = clarityWindow[clarityKey].q || []).push(arguments);
              };
              var clarityScript = clarityDocument.createElement(scriptTag);
              clarityScript.async = true;
              clarityScript.src = "https://www.clarity.ms/tag/" + projectId;
              var firstScript = clarityDocument.getElementsByTagName(scriptTag)[0];
              firstScript.parentNode.insertBefore(clarityScript, firstScript);
            })(window, document, "clarity", "script", "z3mgob98e7");
          `}
        </Script>
        <Analytics />
      </body>
    </html>
  )
}
