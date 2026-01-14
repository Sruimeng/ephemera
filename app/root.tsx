import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from 'react-router';
import 'virtual:uno.css';
import type { Route } from './+types/root';
import { i18nServer } from './.server/i18n.server';
import { Canonical, DefaultErrorBoundary } from './components';
import { StyleFilterProvider } from './components/post-processing';
import { I18nConfig } from './locales';
import './root.css';

export const links = () => {
  return [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico',
    },
  ];
};

export async function loader({ request }: Route.LoaderArgs) {
  const locale = await i18nServer.getLocale(request);
  return { locale };
}

/**
 * Ephemera V2 Root Layout
 * 简化版本 - 移除 ThemeProvider 依赖
 */
export default function App() {
  const { locale } = useLoaderData<typeof loader>();

  return (
    <html lang={locale || I18nConfig.fallbackLng} data-theme="dark">
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
