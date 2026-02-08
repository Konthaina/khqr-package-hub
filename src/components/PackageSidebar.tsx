import { ExternalLink } from "lucide-react";

interface PackageSidebarProps {
  pkg: {
    version: string;
    license: string;
    language: string;
    registryUrl: string;
    repoUrl: string;
    keywords: readonly string[];
  };
}

const PackageSidebar = ({ pkg }: PackageSidebarProps) => {
  return (
    <aside className="space-y-6 text-sm">
      <div>
        <h3 className="font-semibold text-foreground mb-2">Version</h3>
        <p className="text-muted-foreground">{pkg.version}</p>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-2">License</h3>
        <p className="text-muted-foreground">{pkg.license}</p>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-2">Links</h3>
        <ul className="space-y-1.5">
          <li>
            <a href={pkg.registryUrl} target="_blank" rel="noopener noreferrer" className="text-link hover:underline inline-flex items-center gap-1">
              Package Registry <ExternalLink className="w-3 h-3" />
            </a>
          </li>
          <li>
            <a href={pkg.repoUrl} target="_blank" rel="noopener noreferrer" className="text-link hover:underline inline-flex items-center gap-1">
              Repository <ExternalLink className="w-3 h-3" />
            </a>
          </li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-2">Keywords</h3>
        <div className="flex flex-wrap gap-1.5">
          {pkg.keywords.map((kw) => (
            <span key={kw} className="bg-badge text-badge-foreground px-2 py-0.5 rounded text-xs font-mono">
              {kw}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default PackageSidebar;
