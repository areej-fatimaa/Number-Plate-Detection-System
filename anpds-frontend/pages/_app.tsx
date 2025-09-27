// pages/_app.tsx
import '../app/globals.css'; // Ensure this path is correct for your project

import { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
