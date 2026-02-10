import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import PackageReadme from "@/components/PackageReadme";
import Footer from "@/components/Footer";
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

const tabIds = tabs.map((tab) => tab.id);

const getTabFromPath = (pathname: string): PackageId | null => {
  const segment = pathname.split("/").filter(Boolean)[0];
  if (!segment) return null;
  return tabIds.includes(segment as PackageId) ? (segment as PackageId) : null;
};

const Index = () => {
  const [activeTab, setActiveTab] = useState<PackageId>("npm");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const tabFromPath = getTabFromPath(location.pathname);
    if (tabFromPath && tabFromPath !== activeTab) {
      setActiveTab(tabFromPath);
      return;
    }
    if (!tabFromPath && location.pathname === "/" && activeTab !== "npm") {
      setActiveTab("npm");
    }
  }, [activeTab, location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header onDonateClick={() => navigate("/donate", { state: { backgroundLocation: location } })} />

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

      {/* Tabs */}
      <div className="border-b border-border bg-background sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex gap-0 -mb-px overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  navigate(`/${tab.id}`);
                }}
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
      <Footer />
    </div>
  );
};

export default Index;




