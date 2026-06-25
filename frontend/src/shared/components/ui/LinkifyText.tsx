import type { ReactNode } from 'react';

interface LinkifyTextProps {
  text: string;
  className?: string;
  linkClassName?: string;
}

function isUrl(token: string): { url: string; display: string } | null {
  // Match http/https URLs and bare www. addresses.
  const match = token.match(
    /^(https?:\/\/[-a-zA-Z0-9@:%._+~#=/]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*))|(www\.[-a-zA-Z0-9@:%._+~#=/]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*))$/i
  );

  if (!match) return null;

  const raw = match[1] ?? match[2];
  const url = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return { url, display: raw };
}

export default function LinkifyText({ text, className, linkClassName }: LinkifyTextProps) {
  if (!text) return null;

  const parts: ReactNode[] = [];
  const tokens = text.split(/(\s+)/);

  tokens.forEach((token, index) => {
    const link = isUrl(token);
    if (link) {
      parts.push(
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={
            linkClassName ??
            'text-indigo-600 dark:text-indigo-400 hover:underline break-all'
          }
          onClick={(e) => e.stopPropagation()}
        >
          {link.display}
        </a>
      );
    } else {
      parts.push(
        <span key={index} className="break-all">
          {token}
        </span>
      );
    }
  });

  return <span className={className}>{parts}</span>;
}
