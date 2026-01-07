import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { Theme, ThemeProvider, useTheme } from 'remix-themes';
import 'virtual:uno.css';
import { Canonical, DefaultErrorBoundary } from './components';
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

// 客户端获取主题
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return Theme.DARK;
  const stored = localStorage.getItem('theme');
  if (stored === 'light') return Theme.LIGHT;
  if (stored === 'dark') return Theme.DARK;
  // 跟随系统
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.DARK : Theme.LIGHT;
}

const App: React.FC = () => {
  const { i18n } = useTranslation();
  const [theme] = useTheme();

  return (
    <html lang={i18n.language} dir={i18n.dir(i18n.language)} data-theme={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <Meta />
        <Links />
        <Canonical />
        {/* 防止主题闪烁 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('theme');
                if (!theme) {
                  theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                document.documentElement.setAttribute('data-theme', theme);
              })();
            `,
          }}
        />
      </head>
      <body className="select-none">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

const AppWithProviders = () => {
  const [theme, setTheme] = useState<Theme>(Theme.DARK);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getInitialTheme());
    setMounted(true);
  }, []);

  if (!mounted) {
    // 避免 hydration mismatch
    return null;
  }

  return (
    <ThemeProvider specifiedTheme={theme} themeAction="" disableTransitionOnThemeChange={false}>
      <App />
    </ThemeProvider>
  );
};

export const ErrorBoundary: React.FC = () => {
  try {
    return (
      <ThemeProvider specifiedTheme={Theme.DARK} themeAction="">
        <DefaultErrorBoundary />
      </ThemeProvider>
    );
  } catch {
    return null;
  }
};

export default AppWithProviders;
