import { useState } from "react";
import Header from "@/components/Header";
import PackageReadme from "@/components/PackageReadme";
import { type PackageId } from "@/data/packages";

const tabs: { id: PackageId; label: string; icon: string }[] = [
  { id: "npm", label: "npm (TypeScript)", icon: "📦" },
  { id: "pip", label: "pip (Python)", icon: "🐍" },
  { id: "composer", label: "Composer (PHP)", icon: "🐘" },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState<PackageId>("npm");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <div className="bg-header text-header-foreground py-10">
        <div className="container max-w-6xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">konthaina-khqr</h1>
          <p className="text-base opacity-80 max-w-2xl">
            KHQR / EMVCo merchant-presented QR payload generator for Bakong (Cambodia).
          </p>
          <div className="flex gap-2 mt-4 flex-wrap">
            {["MIT License", "CRC-16 Verification", "Static & Dynamic QR"].map((badge) => (
              <span key={badge} className="border border-header-foreground/20 text-xs font-mono px-3 py-1 rounded-full opacity-70">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border bg-background sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex gap-0 -mb-px overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                <span className="mr-1.5">{tab.icon}</span>
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
