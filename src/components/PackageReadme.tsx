import InstallBanner from "./InstallBanner";
import PackageSidebar from "./PackageSidebar";
import MarkdownRenderer from "./MarkdownRenderer";
import { packages, type PackageId } from "@/data/packages";
import { npmReadme, pipReadme, composerReadme } from "@/data/readmes";

interface PackageReadmeProps {
  packageId: PackageId;
}

const readmeContent: Record<PackageId, string> = {
  npm: npmReadme,
  pip: pipReadme,
  composer: composerReadme,
};

const PackageReadme = ({ packageId }: PackageReadmeProps) => {
  const pkg = packages[packageId];
  const readme = readmeContent[packageId];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
      {/* Main content */}
      <div className="min-w-0">
        {/* Install Banner */}
        <div className="mb-6">
          <InstallBanner command={pkg.installCommand} />
        </div>

        {/* Readme Content */}
        <MarkdownRenderer content={readme} />
      </div>

      {/* Sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-20">
          <PackageSidebar pkg={pkg} />
        </div>
      </div>
    </div>
  );
};

export default PackageReadme;
