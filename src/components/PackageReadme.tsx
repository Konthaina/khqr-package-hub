import InstallBanner from "./InstallBanner";
import PackageSidebar from "./PackageSidebar";
import MarkdownRenderer from "./MarkdownRenderer";
import { installCommands, type PackageId } from "@/data/packages";
import { useEffect, useState } from "react";

interface PackageReadmeProps {
  packageId: PackageId;
}

type NpmRegistryResponse = {
  readme?: string;
  versions?: Record<string, { readme?: string }>;
  "dist-tags"?: {
    latest?: string;
  };
};

type PyPiResponse = {
  info?: {
    description?: string;
  };
};

type PackagistVersion = {
  time?: string;
  readme?: string;
  source?: {
    url?: string;
    reference?: string;
  };
};

type PackagistResponse = {
  package?: {
    repository?: string;
    versions?: Record<string, PackagistVersion>;
  };
};

const getLatestPackagistVersion = (versions?: Record<string, PackagistVersion>) => {
  if (!versions) return null;
  const entries = Object.values(versions).filter((version) => Boolean(version.time));
  if (!entries.length) return null;
  return entries.sort((a, b) => (a.time && b.time ? Date.parse(b.time) - Date.parse(a.time) : 0))[0];
};

const getGithubRepo = (url?: string) => {
  if (!url) return null;
  const normalized = url
    .replace(/^git\+/, "")
    .replace(/^git:\/\//, "https://")
    .replace(/\.git$/, "")
    .replace(/\/$/, "");
  const match = normalized.match(/github\.com[/:]([^/]+)\/([^/]+)$/i);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
};

const fetchGithubReadme = async (owner: string, repo: string, ref: string | undefined, readmePath: string | undefined) => {
  const path = (readmePath || "README.md").replace(/^\//, "");
  const candidates = [
    { ref, path },
    { ref, path: "README.md" },
    { ref, path: "README" },
    { ref: "main", path },
    { ref: "master", path },
  ].filter((candidate, index, self) =>
    candidate.ref &&
    self.findIndex((entry) => entry.ref === candidate.ref && entry.path === candidate.path) === index
  ) as { ref: string; path: string }[];

  for (const candidate of candidates) {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${candidate.ref}/${candidate.path}`;
    const response = await fetch(url);
    if (response.ok) {
      return response.text();
    }
  }

  return null;
};

const PackageReadme = ({ packageId }: PackageReadmeProps) => {
  const installCommand = installCommands[packageId];
  const [remoteReadme, setRemoteReadme] = useState<Partial<Record<PackageId, string>>>({});
  const [isLoadingRemote, setIsLoadingRemote] = useState<Partial<Record<PackageId, boolean>>>({});

  useEffect(() => {
    if (packageId !== "npm" && packageId !== "pip" && packageId !== "composer") {
      return;
    }

    let isActive = true;
    setIsLoadingRemote((prev) => ({ ...prev, [packageId]: true }));

    const fetchReadme = async () => {
      try {
        if (packageId === "npm") {
          const res = await fetch("https://registry.npmjs.org/konthaina-khqr");
          if (!res.ok) {
            throw new Error(`Failed to load npm README: ${res.status}`);
          }
          const data = (await res.json()) as NpmRegistryResponse;
          const latest = data["dist-tags"]?.latest;
          const fromLatest = latest ? data.versions?.[latest]?.readme : undefined;
          const nextReadme = data.readme || fromLatest;
          if (nextReadme && isActive) {
            setRemoteReadme((prev) => ({ ...prev, [packageId]: nextReadme }));
          }
          return;
        }

        if (packageId === "pip") {
          const res = await fetch("https://pypi.org/pypi/konthaina-khqr/json");
          if (!res.ok) {
            throw new Error(`Failed to load PyPI README: ${res.status}`);
          }
          const data = (await res.json()) as PyPiResponse;
          const nextReadme = data.info?.description;
          if (nextReadme && isActive) {
            setRemoteReadme((prev) => ({ ...prev, [packageId]: nextReadme }));
          }
          return;
        }

        const res = await fetch("https://packagist.org/packages/konthaina/khqr-php.json");
        if (!res.ok) {
          throw new Error(`Failed to load Packagist metadata: ${res.status}`);
        }
        const data = (await res.json()) as PackagistResponse;
        const latest = getLatestPackagistVersion(data.package?.versions);
        const sourceUrl = latest?.source?.url || data.package?.repository;
        const reference = latest?.source?.reference;
        const readmePath = latest?.readme || "README.md";
        const repo = getGithubRepo(sourceUrl);
        if (!repo) {
          return;
        }
        const nextReadme = await fetchGithubReadme(repo.owner, repo.repo, reference, readmePath);
        if (nextReadme && isActive) {
          setRemoteReadme((prev) => ({ ...prev, [packageId]: nextReadme }));
        }
      } catch {
        if (!isActive) return;
      } finally {
        if (!isActive) return;
        setIsLoadingRemote((prev) => ({ ...prev, [packageId]: false }));
      }
    };

    void fetchReadme();

    return () => {
      isActive = false;
    };
  }, [packageId]);

  const readme =
    packageId === "npm"
      ? remoteReadme.npm || "README not available right now. Please check the npm registry page."
      : packageId === "pip"
        ? remoteReadme.pip || "README not available right now. Please check the PyPI project page."
        : remoteReadme.composer || "README not available right now. Please check the Packagist project page.";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
      {/* Main content */}
      <div className="min-w-0">
        {/* Install Banner */}
        <div className="mb-6">
          <InstallBanner command={installCommand} />
        </div>

        {(packageId === "npm" || packageId === "pip" || packageId === "composer") && isLoadingRemote[packageId] && (
          <p className="text-xs text-muted-foreground mb-3">
            Fetching latest {packageId === "npm" ? "npm" : packageId === "pip" ? "PyPI" : "Packagist"} README...
          </p>
        )}

        {/* Readme Content */}
        <MarkdownRenderer content={readme} />
      </div>

      {/* Sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-20">
          <PackageSidebar packageId={packageId} />
        </div>
      </div>
    </div>
  );
};

export default PackageReadme;
