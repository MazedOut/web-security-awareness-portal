import React from 'react';

/**
 * FormattedText converts markdown-style formatting (bold, italic, code, bullets)
 * into clean React elements, preventing raw asterisks (**) from rendering in UI.
 */
export const FormattedText = ({ text, className = '' }) => {
  if (!text) return null;

  const parseInline = (str) => {
    const parts = [];
    let lastIndex = 0;
    // Match **bold**, `code`, or *italic*
    const regex = /(\*\*(.*?)\*\*|`(.*?)`|\*(.*?)\*)/g;
    let match;

    while ((match = regex.exec(str)) !== null) {
      if (match.index > lastIndex) {
        parts.push(str.substring(lastIndex, match.index));
      }

      const [, , boldText, codeText, italicText] = match;

      if (boldText !== undefined) {
        parts.push(
          <strong key={match.index} className="font-extrabold text-inherit">
            {boldText}
          </strong>
        );
      } else if (codeText !== undefined) {
        parts.push(
          <code
            key={match.index}
            className="px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 border border-slate-300/40 text-cyber-purple-dark font-mono text-xs"
          >
            {codeText}
          </code>
        );
      } else if (italicText !== undefined) {
        parts.push(
          <em key={match.index} className="italic text-inherit">
            {italicText}
          </em>
        );
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < str.length) {
      parts.push(str.substring(lastIndex));
    }

    return parts.length > 0 ? parts : str;
  };

  const lines = text.split('\n');

  return (
    <div className={`space-y-1.5 ${className}`}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Bullet check (supports •, -, *)
        const isBullet = trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ');
        const isNumbered = /^\d+\.\s/.test(trimmed);

        if (isBullet) {
          const content = trimmed.replace(/^(•|-|\*)\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-cyber-purple font-bold select-none mt-0.5">•</span>
              <div className="flex-1">{parseInline(content)}</div>
            </div>
          );
        }

        if (isNumbered) {
          const matchNum = trimmed.match(/^(\d+\.)\s*(.*)/);
          if (matchNum) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="text-cyber-purple font-bold font-mono text-xs select-none mt-0.5">
                  {matchNum[1]}
                </span>
                <div className="flex-1">{parseInline(matchNum[2])}</div>
              </div>
            );
          }
        }

        return (
          <p key={idx} className="leading-relaxed">
            {parseInline(line)}
          </p>
        );
      })}
    </div>
  );
};
