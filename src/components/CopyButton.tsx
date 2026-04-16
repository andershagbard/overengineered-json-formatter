import { useState } from 'react';

import cn from 'classnames';
import { Check, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const CopyButton: React.FC<
  {
    value: string | number | boolean | null;
  } & React.JSX.IntrinsicElements['button']
> = ({ value, className, ...props }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = value === null ? 'null' : value.toString();

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        'flex size-4 cursor-pointer items-center justify-center rounded-sm text-mist-500 opacity-0 transition-opacity',
        'hover:text-mist-200',
        'group-focus-within:opacity-100 group-hover:opacity-100',
        'outline-none focus-visible:ring-2 focus-visible:ring-blue-600',
        className,
      )}
      aria-label={t('aria.copy')}
      {...props}
    >
      {copied ? (
        <Check className="size-3 text-emerald-400" />
      ) : (
        <Copy className="size-3" />
      )}
    </button>
  );
};
