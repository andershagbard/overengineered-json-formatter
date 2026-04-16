import { useState } from 'react';

import cn from 'classnames';
import { Check, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const CopyButton: React.FC<
  {
    copyValue: string | number | boolean | null;
  } & React.JSX.IntrinsicElements['button']
> = ({ copyValue, className, ...props }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = copyValue === null ? 'null' : copyValue.toString();

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
        'text-ui-text-dim flex size-4 cursor-pointer items-center justify-center rounded-sm opacity-0 transition-opacity',
        'hover:text-ui-text',
        'group-focus-within:opacity-100 group-hover:opacity-100',
        'focus-visible:ring-accent outline-none focus-visible:ring-2',
        className,
      )}
      aria-label={t('aria.copy')}
      {...props}
    >
      {copied ? (
        <Check className="text-syntax-string size-3" />
      ) : (
        <Copy className="size-3" />
      )}
    </button>
  );
};
