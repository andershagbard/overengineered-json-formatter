import { useEffect, useMemo, useRef, useState } from 'react';

import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import cn from 'classnames';
import {
  type ColorMode,
  type TabWidth,
  type Theme,
  useSettings,
} from 'context/SettingsContext';
import { Filter, Monitor, Moon, Settings, Sun, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { JsonTree } from 'components/JsonTree';
import { Popover } from 'components/Popover';
import { RadioGroup } from 'components/RadioGroup';
import type { Json } from 'types/json';
import { runFilter } from 'utils/filter';
import { maxDepth, nodeCount } from 'utils/json';

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

const App: React.FC<{ data: Json }> = ({ data }) => {
  const { t } = useTranslation();
  const [currentLevel, setCurrentLevel] = useState<number | 'all'>('all');
  const [filterQuery, setFilterQuery] = useState('');
  const [filteredData, setFilteredData] = useState<Json | undefined>(undefined);
  const [filterError, setFilterError] = useState<string | null>(null);
  const [filterKey, setFilterKey] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const {
    tabWidth,
    setTabWidth,
    theme,
    setTheme,
    colorMode,
    setColorMode,
    wrapContent,
    setWrapContent,
  } = useSettings();

  const nodes = useMemo(() => nodeCount(data), [data]);
  const depth = useMemo(() => maxDepth(data), [data]);
  const levels = useMemo(
    () => Array.from({ length: depth }, (_, i) => i + 1),
    [depth],
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(
      () => {
        if (!filterQuery.trim()) {
          setFilteredData(undefined);
          setFilterError(null);
          return;
        }
        const result = runFilter(data, filterQuery);
        if (result.ok) {
          setFilteredData(result.value);
          setFilterError(null);
          setFilterKey((k) => k + 1);
        } else {
          setFilterError(result.error);
        }
      },
      filterQuery.trim() ? 250 : 0,
    );

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [filterQuery, data]);

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
    <div className="min-h-screen space-y-2">
      <div className="sticky top-0 z-10 px-2 pt-2">
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

          <div className="relative flex min-w-32 flex-1 items-center">
            <Filter className="text-ui-text-muted pointer-events-none absolute left-2 size-3 shrink-0" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder={t('filter.placeholder')}
              aria-label={t('aria.filter')}
              spellCheck={false}
              className={cn(
                'bg-ui-surface/50 border-ui-border/50 text-ui-text placeholder:text-ui-text-muted ring-accent w-full rounded-lg border py-1 pr-7 pl-7 font-mono text-xs transition-colors outline-none focus-visible:ring-2',
                {
                  'border-red-500/70 focus-visible:ring-red-500/70':
                    filterError !== null,
                },
              )}
            />
            {filterQuery && (
              <button
                type="button"
                onClick={() => {
                  setFilterQuery('');
                  setFilteredData(undefined);
                  setFilterError(null);
                }}
                aria-label={t('filter.clear')}
                className="text-ui-text-muted hover:text-ui-text absolute right-2 cursor-pointer outline-none"
              >
                <X className="size-3" />
              </button>
            )}
          </div>

          <div className="ml-0">
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

                <RadioGroup
                  name="wrap-content"
                  groupLabel={t('settings.wrapContent')}
                  value={wrapContent ? 'on' : 'off'}
                  onChange={(v) => setWrapContent(v === 'on')}
                  options={[
                    { value: 'on', label: t('settings.on') },
                    { value: 'off', label: t('settings.off') },
                  ]}
                />
              </div>
            </Popover>
          </div>
        </div>
        {filterError && (
          <p className="truncate px-4 pt-1 font-mono text-xs text-red-400">
            {filterError}
          </p>
        )}
      </div>

      <JsonTree
        key={`${currentLevel}-${filterKey}`}
        data={filteredData !== undefined ? filteredData : data}
        expandedDepth={currentLevel}
        className="overflow-auto px-4 pb-2"
      />
    </div>
  );
};

export default App;
