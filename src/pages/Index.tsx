import { useEffect, useState } from "react";
import Header from "@/components/Header";
import KhqrCard from "@/components/KhqrCard";
import PackageReadme from "@/components/PackageReadme";
import { type PackageId } from "@/data/packages";

const tabs: {
  id: PackageId;
  label: string;
  iconSrc: string;
  iconClassName: string;
}[] = [
    {
      id: "npm",
      label: "npm (TypeScript)",
      iconSrc: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/npm/npm-original.svg",
      iconClassName: "h-5 w-10",
    },
    {
      id: "pip",
      label: "pip (Python)",
      iconSrc: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pypi/pypi-original.svg",
      iconClassName: "h-5 w-10",
    },
    {
      id: "composer",
      label: "Composer (PHP)",
      iconSrc: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/composer/composer-original.svg",
      iconClassName: "h-5 w-10",
    },
  ];

const Index = () => {
  const [activeTab, setActiveTab] = useState<PackageId>("npm");
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  useEffect(() => {
    if (!isDonateOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isDonateOpen]);

  return (
    <div className="min-h-screen bg-background">
      <Header onDonateClick={() => setIsDonateOpen(true)} isDonateOpen={isDonateOpen} />

      {/* Hero */}
      <div className="bg-header text-header-foreground py-10">
        <div className="container max-w-6xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">konthaina-khqr</h1>
          <p className="text-base opacity-80 max-w-2xl">
            KHQR / EMVCo merchant-presented QR payload generator for Bakong (Cambodia).
          </p>
          <div className="flex gap-2 mt-4 flex-wrap">
            {["MIT License", "CRC-16 Verification", "Static & Dynamic QR"].map((badge) => (
              <span key={badge} className="border border-header-foreground/20 text-xs font-mono px-3 py-1 opacity-70">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {isDonateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10">
          <button
            type="button"
            aria-label="Close donate modal"
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsDonateOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-[360px]"
          >
            <KhqrCard />
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-border bg-background sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex gap-0 -mb-px overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
              >
                <span className="inline-flex items-center">
                  <img
                    src={tab.iconSrc}
                    alt=""
                    aria-hidden="true"
                    className={`${tab.iconClassName} shrink-0`}
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container max-w-6xl mx-auto px-4 py-8">
        <PackageReadme packageId={activeTab} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12">
        <div className="container max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Built by{" "}
            <a href="https://github.com/Konthaina" target="_blank" rel="noopener noreferrer" className="text-link hover:underline font-medium">
              Konthaina
            </a>{" "}
            · MIT License · {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
