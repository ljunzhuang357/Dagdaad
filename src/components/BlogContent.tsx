import React from "react";

function inlineMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Bold **text**
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Italic *text*
    const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);
    // Link [text](url)
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
    // Inline code `text`
    const codeMatch = remaining.match(/`([^`]+)`/);

    const matches = [
      boldMatch && { type: "bold" as const, match: boldMatch[0], content: boldMatch[1], index: boldMatch.index! },
      italicMatch && { type: "italic" as const, match: italicMatch[0], content: italicMatch[1], index: italicMatch.index! },
      linkMatch && { type: "link" as const, match: linkMatch[0], content: linkMatch[1], url: linkMatch[2], index: linkMatch.index! },
      codeMatch && { type: "code" as const, match: codeMatch[0], content: codeMatch[1], index: codeMatch.index! },
    ].filter(Boolean) as Array<{
      type: string;
      match: string;
      content: string;
      index: number;
      url?: string;
    }>;

    if (matches.length === 0) {
      parts.push(remaining);
      break;
    }

    matches.sort((a, b) => a.index - b.index);
    const nearest = matches[0];

    if (nearest.index > 0) {
      parts.push(remaining.slice(0, nearest.index));
    }

    switch (nearest.type) {
      case "bold":
        parts.push(<strong key={key++}>{nearest.content}</strong>);
        break;
      case "italic":
        parts.push(<em key={key++}>{nearest.content}</em>);
        break;
      case "link":
        parts.push(
          <a key={key++} href={nearest.url} className="underline hover:text-[var(--accent-orange)] transition-colors" target="_blank" rel="noopener noreferrer">
            {nearest.content}
          </a>
        );
        break;
      case "code":
        parts.push(<code key={key++} className="bg-[#F5F0E8] px-1.5 py-0.5 rounded text-sm font-mono">{nearest.content}</code>);
        break;
    }

    remaining = remaining.slice(nearest.index + nearest.match.length);
  }

  return parts;
}

function processListBlock(lines: string[], startIdx: number): { node: React.ReactNode; consumed: number } {
  const items: React.ReactNode[] = [];
  let i = startIdx;
  const isOrdered = lines[i].match(/^\d+\.\s/);

  while (i < lines.length) {
    const line = lines[i];
    const unordered = line.match(/^[-*]\s(.+)/);
    const ordered = line.match(/^\d+\.\s(.+)/);

    if (isOrdered) {
      if (!ordered) break;
      items.push(<li key={i}>{inlineMarkdown(ordered[1])}</li>);
    } else {
      if (!unordered) break;
      items.push(<li key={i}>{inlineMarkdown(unordered[1])}</li>);
    }
    i++;
  }

  if (isOrdered) {
    return { node: <ol key={startIdx} className="list-decimal pl-6 space-y-1 my-4">{items}</ol>, consumed: i - startIdx };
  }
  return { node: <ul key={startIdx} className="list-disc pl-6 space-y-1 my-4">{items}</ul>, consumed: i - startIdx };
}

export default function BlogContent({ content }: { content: string }) {
  const blocks: React.ReactNode[] = [];
  const lines = content.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // h2
    const h2 = line.match(/^##\s(.+)/);
    if (h2) {
      blocks.push(<h2 key={i} className="text-xl font-bold mt-8 mb-3">{inlineMarkdown(h2[1])}</h2>);
      i++;
      continue;
    }

    // h3
    const h3 = line.match(/^###\s(.+)/);
    if (h3) {
      blocks.push(<h3 key={i} className="text-lg font-bold mt-6 mb-2">{inlineMarkdown(h3[1])}</h3>);
      i++;
      continue;
    }

    // Blockquote
    const bq = line.match(/^>\s(.+)/);
    if (bq) {
      const quoteLines: string[] = [];
      while (i < lines.length) {
        const q = lines[i].match(/^>\s?(.*)/);
        if (!q) break;
        quoteLines.push(q[1]);
        i++;
      }
      blocks.push(
        <blockquote key={i} className="border-l-4 border-[var(--accent-orange)] pl-4 italic my-4 text-[var(--text-secondary)]">
          {quoteLines.map((ql, qi) => <p key={qi}>{inlineMarkdown(ql)}</p>)}
        </blockquote>
      );
      continue;
    }

    // Horizontal rule
    if (/^---$/.test(line.trim())) {
      blocks.push(<hr key={i} className="my-8 border-t-2 border-[#F0E8D8]" />);
      i++;
      continue;
    }

    // Unordered list
    if (/^[-*]\s/.test(line)) {
      const { node, consumed } = processListBlock(lines, i);
      blocks.push(node);
      i += consumed;
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      const { node, consumed } = processListBlock(lines, i);
      blocks.push(node);
      i += consumed;
      continue;
    }

    // Paragraph (default)
    const paraLines: string[] = [];
    while (i < lines.length) {
      const l = lines[i].trim();
      if (l === "") break;
      if (/^##/.test(l)) break;
      if (/^[-*]\s/.test(l)) break;
      if (/^\d+\.\s/.test(l)) break;
      if (/^>\s/.test(l)) break;
      if (/^---$/.test(l)) break;
      paraLines.push(l);
      i++;
    }

    if (paraLines.length > 0) {
      blocks.push(
        <p key={i} className="mb-4 leading-relaxed">
          {paraLines.map((pl, pi) => (
            <React.Fragment key={pi}>
              {pi > 0 && <br />}
              {inlineMarkdown(pl)}
            </React.Fragment>
          ))}
        </p>
      );
    }
  }

  return <div className="blog-content">{blocks}</div>;
}
