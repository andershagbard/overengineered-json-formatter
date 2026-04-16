import { useMemo, useState } from 'react';

import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';

import type { Json } from 'types/json';
import { maxDepth, nodeCount } from 'utils/json';

import { JsonTree } from './JsonTree';

const LevelButton: React.FC<
  { isActive: boolean } & React.JSX.IntrinsicElements['button']
> = ({ children, className, isActive, ...props }) => {
  return (
    <button
      type="button"
      className={cn(
        className,
        'flex h-7 w-7 cursor-pointer items-center justify-center rounded text-xs font-medium transition-colors select-none',
        'ring-blue-600 outline-none focus-visible:ring-2',
        {
          'bg-blue-600 text-white': isActive,
          'text-mist-300 hover:bg-mist-700 hover:text-mist-50 focus-visible:bg-mist-700 focus-visible:text-mist-50':
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

  const nodes = useMemo(() => nodeCount(data), [data]);
  const depth = useMemo(() => maxDepth(data), [data]);
  const levels = useMemo(
    () => Array.from({ length: depth }, (_, i) => i + 1),
    [depth],
  );

  return (
    <div className="min-h-screen bg-mist-900 text-mist-50">
      <div className="sticky top-0 z-10 p-2">
        <div className="flex items-center gap-4 rounded-2xl border border-mist-700/50 bg-mist-800/50 px-4 py-2 backdrop-blur">
          <div className="flex items-center gap-3 font-mono text-xs text-mist-400">
            <span>
              <span className="font-semibold text-mist-200">
                {nodes.toLocaleString()}
              </span>{' '}
              {t('nodes')}
            </span>
            <span>
              <span className="font-semibold text-mist-200">{depth}</span>{' '}
              {t('depth')}
            </span>
          </div>
          <div className="h-4 w-px bg-mist-700" />
          <span className="text-xs font-medium tracking-wide text-mist-400 uppercase">
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
