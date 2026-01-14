import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import 'virtual:uno.css';
import { Canonical, DefaultErrorBoundary } from './components';
import { StyleFilterProvider } from './components/post-processing';
import { I18nConfig } from './locales';
import './root.css';

export const links = () => [
  {
    rel: 'icon',
    type: 'image/x-icon',
    href: '/favicon.ico',
  },
];

export default function App() {
  return (
    <html lang={I18nConfig.fallbackLng} data-theme="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <Meta />
        <Links />
        <Canonical />
      </head>
      <body className="select-none">
        <StyleFilterProvider>
          <Outlet />
        </StyleFilterProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  return <DefaultErrorBoundary />;
}
