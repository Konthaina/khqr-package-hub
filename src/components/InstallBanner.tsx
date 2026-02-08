import { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";

interface InstallBannerProps {
  command: string;
}

const InstallBanner = ({ command }: InstallBannerProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3 bg-code-block text-code-block-foreground rounded px-4 py-3 font-mono text-sm">
      <Terminal className="w-4 h-4 shrink-0 opacity-50" />
      <span className="flex-1 overflow-x-auto">{command}</span>
      <button onClick={handleCopy} className="shrink-0 p-1 rounded hover:bg-muted/20 transition-colors" aria-label="Copy">
        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 opacity-60 hover:opacity-100" />}
      </button>
    </div>
  );
};

export default InstallBanner;
