import * as Accordion from '@radix-ui/react-accordion';
import cn from 'classnames';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { CopyButton } from 'components/CopyButton';
import type { Json } from 'types/json';
import { getEntries, isExpandable } from 'utils/json';

enum Char {
  OPEN_ARRAY = '[',
  CLOSE_ARRAY = ']',
  OPEN_OBJECT = '{',
  CLOSE_OBJECT = '}',
  TRAILING = ',',
}

const Primitive = ({ value }: { value: string | number | boolean | null }) => {
  if (value === null) {
    return <span className="text-syntax-null">null</span>;
  }

  if (typeof value === 'boolean') {
    return <span className="text-syntax-boolean">{String(value)}</span>;
  }

  if (typeof value === 'number') {
    return <span className="text-syntax-number">{value}</span>;
  }

  return <span className="text-syntax-string">{JSON.stringify(value)}</span>;
};

const Label: React.FC<{ keyName: string }> = ({ keyName }) => (
  <>
    <span className="text-syntax-key">&quot;{keyName}&quot;</span>
    <span className="text-tree-separator">:&nbsp;</span>
  </>
);

const BranchNode = ({
  entries,
  depth,
  expandedDepth,
  className,
  ...props
}: {
  entries: Array<[string, Json, boolean]>;
  depth: number;
  expandedDepth: number | 'all';
} & React.HTMLAttributes<HTMLDivElement>) => {
  const { t } = useTranslation();

  const defaultOpen = entries
    .filter(
      ([, v]) =>
        isExpandable(v) && (expandedDepth === 'all' || depth < expandedDepth),
    )
    .map(([key]) => key);

  return (
    <div
      className={cn('border-tree-indent border-l pl-(--tab-width)', className)}
      {...props}
    >
      <Accordion.Root type="multiple" defaultValue={defaultOpen}>
        {entries.map(([key, value, showKey], i) => {
          const isLast = i === entries.length - 1;
          const keyName = showKey ? key : undefined;

          if (isExpandable(value)) {
            const [OPEN_CHAR, CLOSE_CHAR] = Array.isArray(value)
              ? [Char.OPEN_ARRAY, Char.CLOSE_ARRAY]
              : [Char.OPEN_OBJECT, Char.CLOSE_OBJECT];
            const TRAILING_CHAR = isLast ? null : Char.TRAILING;
            const subEntries = getEntries(value);
            const summary = t(Array.isArray(value) ? 'item' : 'key', {
              count: subEntries.length,
            });

            if (subEntries.length === 0) {
              return (
                <div key={key} className="flex items-center py-px">
                  <span className="size-3 shrink-0" />
                  {keyName && <Label keyName={keyName} />}
                  <span className="text-tree-bracket">
                    {OPEN_CHAR}
                    {CLOSE_CHAR}
                  </span>
                  {TRAILING_CHAR && (
                    <span className="text-tree-separator">{TRAILING_CHAR}</span>
                  )}
                </div>
              );
            }

            return (
              <Accordion.Item key={key} value={key}>
                <Accordion.Trigger className="group hover:bg-tree-hover flex w-full cursor-pointer items-center rounded-sm py-px select-none">
                  <ChevronRight className="text-tree-separator size-3 shrink-0 transition-transform group-data-[state=open]:rotate-90" />
                  {keyName && <Label keyName={keyName} />}
                  <span className="text-tree-bracket">{OPEN_CHAR}</span>
                  <span className="group-data-[state=open]:hidden">
                    <span className="text-tree-separator mx-1 text-xs">
                      {summary}
                    </span>
                    <span className="text-tree-bracket">{CLOSE_CHAR}</span>
                    {TRAILING_CHAR && (
                      <span className="text-tree-separator">
                        {TRAILING_CHAR}
                      </span>
                    )}
                  </span>
                </Accordion.Trigger>
                <Accordion.Content>
                  <BranchNode
                    entries={subEntries}
                    depth={depth + 1}
                    expandedDepth={expandedDepth}
                  />
                  <div className="flex items-center py-px">
                    <span className="text-tree-bracket">{CLOSE_CHAR}</span>
                    {TRAILING_CHAR && (
                      <span className="text-tree-separator">
                        {TRAILING_CHAR}
                      </span>
                    )}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            );
          }

          return (
            <LeafNode
              key={key}
              keyName={keyName}
              value={value}
              isLast={isLast}
            />
          );
        })}
      </Accordion.Root>
    </div>
  );
};

const LeafNode: React.FC<
  {
    keyName?: string;
    value: string | number | boolean | null;
    isLast?: boolean;
  } & React.HTMLAttributes<HTMLDivElement>
> = ({ keyName, value, className, isLast = false, ...props }) => {
  return (
    <div className={cn('group flex py-px', className)} {...props}>
      <span className="size-3 shrink-0" />
      {keyName && <Label keyName={keyName} />}
      <span>
        <Primitive value={value} />
        {!isLast && (
          <span className="text-tree-separator">{Char.TRAILING}</span>
        )}
      </span>
      &nbsp;
      <CopyButton className="size-5" copyValue={value} />
    </div>
  );
};

export const JsonTree: React.FC<
  {
    data: Json;
    expandedDepth: number | 'all';
  } & React.HTMLAttributes<HTMLDivElement>
> = ({ data, expandedDepth, className, ...props }) => {
  const { t } = useTranslation();

  if (!isExpandable(data)) {
    return (
      <div className={cn('font-mono text-sm leading-5', className)} {...props}>
        <LeafNode value={data} />
      </div>
    );
  }

  const entries = getEntries(data);
  const isArray = Array.isArray(data);
  const openChar = isArray ? Char.OPEN_ARRAY : Char.OPEN_OBJECT;
  const closeChar = isArray ? Char.CLOSE_ARRAY : Char.CLOSE_OBJECT;
  const count = entries.length;
  const summary = t(isArray ? 'item' : 'key', { count });

  return (
    <div className={cn('font-mono text-sm leading-5', className)} {...props}>
      <Accordion.Root type="multiple" defaultValue={['root']}>
        <Accordion.Item value="root">
          <Accordion.Trigger className="group hover:bg-tree-hover flex w-full cursor-pointer items-center rounded-sm py-px select-none">
            <ChevronRight className="text-tree-separator size-3 shrink-0 transition-transform group-data-[state=open]:rotate-90" />
            <span className="text-tree-bracket">{openChar}</span>
            <span className="group-data-[state=open]:hidden">
              <span className="text-tree-separator mx-1 text-xs">
                {summary}
              </span>
              <span className="text-tree-bracket">{closeChar}</span>
            </span>
          </Accordion.Trigger>

          <Accordion.Content>
            <BranchNode
              entries={entries}
              depth={1}
              expandedDepth={expandedDepth}
            />

            <div className="flex items-center py-px">
              <span className="text-tree-bracket">{closeChar}</span>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
};
