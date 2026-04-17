import { createContext, useContext, useEffect, useState } from 'react';

export type TabWidth = 2 | 4 | 8;
export type ColorMode = 'dark' | 'light' | 'device';
export type Theme =
  | 'slate'
  | 'gray'
  | 'zinc'
  | 'neutral'
  | 'stone'
  | 'taupe'
  | 'mauve'
  | 'mist'
  | 'olive';

type Settings = {
  tabWidth: TabWidth;
  theme: Theme;
  colorMode: ColorMode;
};

export const DEFAULT_SETTINGS: Settings = {
  tabWidth: 2,
  theme: 'slate',
  colorMode: 'dark',
};

type SettingsContextValue = Settings & {
  setTabWidth: (width: TabWidth) => void;
  setTheme: (theme: Theme) => void;
  setColorMode: (mode: ColorMode) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tabWidth, setTabWidth] = useState<TabWidth>(DEFAULT_SETTINGS.tabWidth);
  const [theme, setTheme] = useState<Theme>(DEFAULT_SETTINGS.theme);
  const [colorMode, setColorMode] = useState<ColorMode>(
    DEFAULT_SETTINGS.colorMode,
  );

  useEffect(() => {
    chrome?.storage?.sync.get(DEFAULT_SETTINGS).then((stored) => {
      setTabWidth(stored.tabWidth as TabWidth);
      setTheme(stored.theme as Theme);
      setColorMode(stored.colorMode as ColorMode);
    });
  }, []);

  useEffect(() => {
    chrome?.storage?.sync.set({ theme });
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    chrome?.storage?.sync.set({ colorMode });
    document.body.setAttribute('data-color-mode', colorMode);
  }, [colorMode]);

  useEffect(() => {
    chrome?.storage?.sync.set({ tabWidth });
    document.body.style.setProperty('--tab-width', `${tabWidth}ch`);
  }, [tabWidth]);

  return (
    <SettingsContext
      value={{
        tabWidth,
        setTabWidth,
        theme,
        setTheme,
        colorMode,
        setColorMode,
      }}
    >
      {children}
    </SettingsContext>
  );
};

export const useSettings = (): SettingsContextValue => {
  const ctx = useContext(SettingsContext);

  if (!ctx) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }

  return ctx;
};
