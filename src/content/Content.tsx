import { useMemo, useState } from 'react';

import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import cn from 'classnames';
import {
  type ColorMode,
  type TabWidth,
  type Theme,
  useSettings,
} from 'context/SettingsContext';
import { Monitor, Moon, Settings, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Popover } from 'components/Popover';
import { RadioGroup } from 'components/RadioGroup';
import type { Json } from 'types/json';
import { maxDepth, nodeCount } from 'utils/json';

import { JsonTree } from './JsonTree';

const themes: Theme[] = [
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'taupe',
  'mauve',
  'mist',
  'olive',
];
const tabWidths: TabWidth[] = [2, 4, 8];
const colorModes: { value: ColorMode; icon: React.ReactNode }[] = [
  { value: 'dark', icon: <Moon size={14} /> },
  { value: 'light', icon: <Sun size={14} /> },
  { value: 'device', icon: <Monitor size={14} /> },
];

const LevelButton: React.FC<
  { isActive: boolean } & React.JSX.IntrinsicElements['button']
> = ({ children, className, isActive, ...props }) => {
  return (
    <button
      type="button"
      className={cn(
        className,
        'flex h-7 w-7 cursor-pointer items-center justify-center rounded text-xs font-medium transition-colors select-none',
        'ring-accent outline-none focus-visible:ring-2',
        {
          'bg-accent text-white': isActive,
          'text-ui-text-secondary hover:bg-ui-surface-hover hover:text-ui-text-bright focus-visible:bg-ui-surface-hover focus-visible:text-ui-text-bright':
            !isActive,
        },
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const Content: React.FC<{ data: Json }> = ({ data }) => {
  const { t } = useTranslation();
  const [currentLevel, setCurrentLevel] = useState<number | 'all'>('all');
  const { tabWidth, setTabWidth, theme, setTheme, colorMode, setColorMode } =
    useSettings();

  const nodes = useMemo(() => nodeCount(data), [data]);
  const depth = useMemo(() => maxDepth(data), [data]);
  const levels = useMemo(
    () => Array.from({ length: depth }, (_, i) => i + 1),
    [depth],
  );

  const tabWidthOptions = tabWidths.map((w) => ({
    value: w,
    label: String(w),
  }));

  const colorModeOptions = colorModes.map(({ value, icon }) => ({
    value,
    label: icon,
    ariaLabel: t(`settings.modes.${value}`),
  }));

  const themeOptions = themes.map((color) => ({
    value: color,
    label: t(`settings.themes.${color}`),
  }));

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 p-2">
        <div className="border-ui-border/50 bg-ui-surface/50 flex items-center gap-4 rounded-2xl border px-4 py-2 backdrop-blur">
          <div className="text-ui-text-muted flex items-center gap-3 font-mono text-xs">
            <span>
              <span className="text-ui-text font-semibold">
                {nodes.toLocaleString()}
              </span>{' '}
              {t('nodes')}
            </span>
            <span>
              <span className="text-ui-text font-semibold">{depth}</span>{' '}
              {t('depth')}
            </span>
          </div>
          <div className="bg-ui-border h-4 w-px" />
          <span className="text-ui-text-muted text-xs font-medium tracking-wide uppercase">
            {t('levels')}
          </span>

          <NavigationMenu.Root>
            <NavigationMenu.List className="m-0 flex list-none items-center gap-1 p-0">
              {levels.map((level) => (
                <NavigationMenu.Item key={level}>
                  <NavigationMenu.Link asChild>
                    <LevelButton
                      isActive={currentLevel === level}
                      onClick={() => setCurrentLevel(level)}
                    >
                      {level}
                    </LevelButton>
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
              ))}

              <NavigationMenu.Item>
                <NavigationMenu.Link asChild>
                  <LevelButton
                    isActive={currentLevel === 'all'}
                    onClick={() => setCurrentLevel('all')}
                  >
                    {t('all')}
                  </LevelButton>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            </NavigationMenu.List>
          </NavigationMenu.Root>

          <div className="ml-auto">
            <Popover
              trigger={
                <button
                  type="button"
                  className="text-ui-text-muted ring-accent hover:bg-ui-surface-hover hover:text-ui-text-bright flex h-7 w-7 cursor-pointer items-center justify-center rounded transition-colors outline-none focus-visible:ring-2"
                  aria-label={t('aria.settings')}
                >
                  <Settings size={14} />
                </button>
              }
            >
              <p className="text-ui-text-muted mb-3 text-xs font-semibold tracking-wide uppercase">
                {t('settings.label')}
              </p>

              <div className="flex flex-col gap-4">
                <RadioGroup
                  name="tab-width"
                  groupLabel={t('settings.tabWidth')}
                  value={tabWidth}
                  onChange={setTabWidth}
                  options={tabWidthOptions}
                />

                <RadioGroup
                  name="color-mode"
                  groupLabel={t('settings.colorMode')}
                  value={colorMode}
                  onChange={setColorMode}
                  options={colorModeOptions}
                />

                <RadioGroup
                  name="color-theme"
                  groupLabel={t('settings.colorTheme')}
                  value={theme}
                  onChange={setTheme}
                  options={themeOptions}
                />
              </div>
            </Popover>
          </div>
        </div>
      </div>

      <JsonTree
        key={String(currentLevel)}
        data={data}
        expandedDepth={currentLevel}
        className="p-4"
      />
    </div>
  );
};

export default Content;
