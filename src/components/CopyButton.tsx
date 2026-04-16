import { useState } from 'react';

import { Check, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const CopyButton = ({
  value,
}: {
  value: string | number | boolean | null;
}) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text =
      value === null
        ? 'null'
        : typeof value === 'string'
          ? value
          : String(value);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="ml-1.5 cursor-pointer text-mist-500 opacity-0 transition-opacity group-hover:opacity-100 hover:text-mist-200"
      aria-label={t('aria.copy')}
    >
      {copied ? (
        <Check className="size-3 text-emerald-400" />
      ) : (
        <Copy className="size-3" />
      )}
    </button>
  );
};
