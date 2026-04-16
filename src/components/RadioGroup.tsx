import cn from 'classnames';

type Option<T> = {
  value: T;
  label: React.ReactNode;
  ariaLabel?: string;
};

type Props<T extends string | number> = {
  name: string;
  groupLabel: string;
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
};

export const RadioGroup = <T extends string | number>({
  name,
  groupLabel,
  value,
  onChange,
  options,
  ...props
}: Props<T> & React.JSX.IntrinsicElements['fieldset']) => {
  const row = options.length <= 3;

  return (
    <fieldset {...props}>
      <legend className="text-ui-text mb-2 text-xs font-medium">
        {groupLabel}
      </legend>
      <div className={cn('flex gap-1', !row && 'flex-col')}>
        {options.map((option) => (
          <label
            key={String(option.value)}
            className={cn('group relative cursor-pointer', row && 'flex-1')}
          >
            <input
              type="radio"
              name={name}
              value={String(option.value)}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              aria-label={option.ariaLabel}
              className="peer sr-only"
            />
            <span
              className={cn(
                'flex h-7 items-center rounded text-xs font-medium transition-colors',
                'peer-focus-visible:ring-accent peer-focus-visible:ring-2',
                row
                  ? [
                      'w-full justify-center border',
                      'border-ui-border bg-ui-surface-raised text-ui-text-muted',
                      'group-hover:border-ui-border-strong group-hover:text-ui-text',
                      'peer-checked:border-accent peer-checked:bg-accent peer-checked:text-white',
                      'peer-checked:group-hover:border-accent peer-checked:group-hover:bg-accent',
                    ]
                  : [
                      'w-full px-2',
                      'text-ui-text-muted',
                      'group-hover:bg-ui-surface-hover group-hover:text-ui-text',
                      'peer-checked:bg-accent peer-checked:text-white',
                      'peer-checked:group-hover:bg-accent',
                    ],
              )}
            >
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
};
