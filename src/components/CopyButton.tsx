"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="px-4 py-2 text-xs uppercase tracking-widest border border-black bg-white text-black hover:bg-black hover:text-white transition-colors"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
