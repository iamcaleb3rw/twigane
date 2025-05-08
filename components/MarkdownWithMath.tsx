"use client";

import { useState, useCallback } from "react";
import type React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";

interface MarkdownWithMathProps {
  content: string;
}

// Define proper types for the code component props
interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const MarkdownWithMath: React.FC<MarkdownWithMathProps> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        // Improved code block with copy button
        code({ node, inline, className, children, ...props }: CodeProps) {
          const match = /language-(\w+)/.exec(className || "");
          const codeString = String(children).replace(/\n$/, "");

          return !inline && match ? (
            <CodeBlock language={match[1]} codeString={codeString} {...props} />
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        // Improved table styling
        table({ node, ...props }) {
          return (
            <div className="overflow-x-auto my-8">
              <table
                className="min-w-full divide-y divide-gray-300 border border-gray-300"
                {...props}
              />
            </div>
          );
        },
        thead({ node, ...props }) {
          return <thead className="bg-gray-50" {...props} />;
        },
        tbody({ node, ...props }) {
          return (
            <tbody className="divide-y divide-gray-200 bg-white" {...props} />
          );
        },
        tr({ node, ...props }) {
          return <tr className="hover:bg-gray-50" {...props} />;
        },
        th({ node, ...props }) {
          return (
            <th
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              {...props}
            />
          );
        },
        td({ node, ...props }) {
          return (
            <td
              className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
              {...props}
            />
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

interface CodeBlockProps {
  language: string;
  codeString: string;
  [key: string]: any;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  language,
  codeString,
  ...props
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [codeString]);

  return (
    <div className="relative group">
      <button
        onClick={copyToClipboard}
        className="absolute right-2 top-2 p-1 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        aria-label="Copy code"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        PreTag="div"
        {...props}
        customStyle={{ marginTop: 0 }}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};

export default MarkdownWithMath;
