import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import type { PackageId } from "@/data/packages";

interface PackageSidebarProps {
  packageId: PackageId;
}

type NpmRegistryResponse = {
  "dist-tags"?: { latest?: string };
  versions?: Record<
    string,
    {
      license?: unknown;
      keywords?: unknown;
      repository?: unknown;
      author?: unknown;
      maintainers?: unknown;
    }
  >;
  license?: unknown;
  keywords?: unknown;
  repository?: unknown;
  author?: unknown;
  maintainers?: unknown;
};

type PyPiResponse = {
  info?: {
    version?: string;
    license?: string;
    keywords?: string;
    project_urls?: Record<string, string>;
    home_page?: string;
    author?: string;
    maintainer?: string;
    author_email?: string;
    maintainer_email?: string;
  };
};

type PackagistVersion = {
  time?: string;
  license?: string[] | string;
  keywords?: string[];
  source?: { url?: string };
  authors?: Array<{ name?: string; email?: string; homepage?: string }>;
};

type PackagistResponse = {
  package?: {
    repository?: string;
    versions?: Record<string, PackagistVersion>;
  };
};

type RemoteMeta = {
  version?: string;
  license?: string;
  keywords?: string[];
  registryUrl?: string;
  repoUrl?: string;
  author?: string;
};

const normalizeKeywords = (keywords: unknown) => {
  if (Array.isArray(keywords)) {
    return keywords.filter((kw): kw is string => typeof kw === "string");
  }
  if (typeof keywords === "string") {
    return keywords
      .split(/[,\\s]+/)
      .map((kw) => kw.trim())
      .filter(Boolean);
  }
  return [];
};

const normalizeLicense = (license: unknown) => {
  if (typeof license === "string") {
    return license;
  }
  if (Array.isArray(license)) {
    return license.filter((item): item is string => typeof item === "string").join(", ");
  }
  if (license && typeof license === "object" && "type" in license) {
    const maybeType = (license as { type?: unknown }).type;
    if (typeof maybeType === "string") {
      return maybeType;
    }
  }
  return undefined;
};

const normalizeAuthor = (author: unknown) => {
  if (!author) return undefined;
  if (typeof author === "string") {
    return author.trim() || undefined;
  }
  if (typeof author === "object") {
    const maybeName = (author as { name?: unknown }).name;
    if (typeof maybeName === "string" && maybeName.trim()) {
      return maybeName.trim();
    }
  }
  return undefined;
};

const normalizeMaintainers = (maintainers: unknown) => {
  if (!Array.isArray(maintainers)) return undefined;
  const names = maintainers
    .map((maintainer) => {
      if (typeof maintainer === "string") return maintainer.trim();
      if (maintainer && typeof maintainer === "object") {
        const maybeName = (maintainer as { name?: unknown }).name;
        if (typeof maybeName === "string") return maybeName.trim();
      }
      return "";
    })
    .filter(Boolean);
  return names.length ? names.join(", ") : undefined;
};

const normalizeAuthorList = (authors?: Array<{ name?: string }>) => {
  if (!authors?.length) return undefined;
  const names = authors
    .map((author) => (author?.name || "").trim())
    .filter(Boolean);
  return names.length ? names.join(", ") : undefined;
};

const getRepositoryUrl = (repository: unknown) => {
  if (!repository) return undefined;
  if (typeof repository === "string") return repository;
  if (typeof repository === "object") {
    const maybeUrl = (repository as { url?: unknown }).url;
    if (typeof maybeUrl === "string") return maybeUrl;
  }
  return undefined;
};

const getRepoOwner = (repoUrl?: string) => {
  if (!repoUrl) return undefined;
  const normalized = repoUrl
    .replace(/^git\+/, "")
    .replace(/^git:\/\//, "https://")
    .replace(/\.git$/, "")
    .replace(/\/$/, "");
  const match = normalized.match(/github\.com[/:]([^/]+)\/([^/]+)$/i);
  if (!match) return undefined;
  return match[1];
};

const getLatestPackagistEntry = (versions?: Record<string, PackagistVersion>, allowDev = true) => {
  if (!versions) return null;
  const entries = Object.entries(versions).filter(([key, version]) => {
    if (!version.time) return false;
    if (allowDev) return true;
    return !key.startsWith("dev-");
  });
  if (!entries.length) return null;
  return entries.sort((a, b) => Date.parse(b[1].time ?? "0") - Date.parse(a[1].time ?? "0"))[0];
};

const getPreferredPackagistEntry = (versions?: Record<string, PackagistVersion>) => {
  return getLatestPackagistEntry(versions, false) ?? getLatestPackagistEntry(versions, true);
};

const PackageSidebar = ({ packageId }: PackageSidebarProps) => {
  const [remoteMeta, setRemoteMeta] = useState<Partial<Record<PackageId, RemoteMeta>>>({});
  const [isLoadingRemote, setIsLoadingRemote] = useState<Partial<Record<PackageId, boolean>>>({});
  const cachedMeta = remoteMeta[packageId];

  useEffect(() => {
    if (cachedMeta) {
      return;
    }

    let isActive = true;
    setIsLoadingRemote((prev) => ({ ...prev, [packageId]: true }));

    const fetchMeta = async () => {
      try {
        if (packageId === "npm") {
          const res = await fetch("https://registry.npmjs.org/konthaina-khqr");
          if (!res.ok) {
            throw new Error(`Failed to load npm metadata: ${res.status}`);
          }
          const data = (await res.json()) as NpmRegistryResponse;
          const latest = data["dist-tags"]?.latest;
          const latestVersion = latest ? data.versions?.[latest] : undefined;
          const nextKeywords = normalizeKeywords(latestVersion?.keywords ?? data.keywords);
          const nextLicense = normalizeLicense(latestVersion?.license ?? data.license);
          const repo = getRepositoryUrl(latestVersion?.repository) ?? getRepositoryUrl(data.repository);
          const nextAuthor =
            normalizeAuthor(latestVersion?.author ?? data.author) ||
            normalizeMaintainers(latestVersion?.maintainers ?? data.maintainers) ||
            getRepoOwner(repo);

          if (isActive) {
            setRemoteMeta((prev) => ({
              ...prev,
              [packageId]: {
                version: latest,
                license: nextLicense,
                keywords: nextKeywords.length ? nextKeywords : undefined,
                author: nextAuthor,
                repoUrl: repo,
                registryUrl: "https://www.npmjs.com/package/konthaina-khqr",
              },
            }));
          }
          return;
        }

        if (packageId === "pip") {
          const res = await fetch("https://pypi.org/pypi/konthaina-khqr/json");
          if (!res.ok) {
            throw new Error(`Failed to load PyPI metadata: ${res.status}`);
          }
          const data = (await res.json()) as PyPiResponse;
          const nextKeywords = normalizeKeywords(data.info?.keywords);
          const projectUrls = data.info?.project_urls ?? {};
          const nextAuthor =
            (data.info?.author || "").trim() ||
            (data.info?.maintainer || "").trim() ||
            (data.info?.author_email || "").trim() ||
            (data.info?.maintainer_email || "").trim() ||
            undefined;
          const repoUrl =
            projectUrls.Source ||
            projectUrls.Repository ||
            projectUrls.Homepage ||
            data.info?.home_page;

          if (isActive) {
            setRemoteMeta((prev) => ({
              ...prev,
              [packageId]: {
                version: data.info?.version,
                license: data.info?.license,
                keywords: nextKeywords.length ? nextKeywords : undefined,
                author: nextAuthor || getRepoOwner(repoUrl),
                repoUrl,
                registryUrl: "https://pypi.org/project/konthaina-khqr/",
              },
            }));
          }
          return;
        }

        const res = await fetch("https://packagist.org/packages/konthaina/khqr-php.json");
        if (!res.ok) {
          throw new Error(`Failed to load Packagist metadata: ${res.status}`);
        }
        const data = (await res.json()) as PackagistResponse;
        const latestEntry = getPreferredPackagistEntry(data.package?.versions);
        const versionKey = latestEntry?.[0];
        const version = latestEntry?.[1];
        const nextLicense = normalizeLicense(version?.license);
        const nextKeywords = normalizeKeywords(version?.keywords);
        const nextAuthor = normalizeAuthorList(version?.authors);
        const repoUrl = version?.source?.url || data.package?.repository;

        if (isActive) {
          setRemoteMeta((prev) => ({
            ...prev,
            [packageId]: {
              version: versionKey,
              license: nextLicense,
              keywords: nextKeywords.length ? nextKeywords : undefined,
              author: nextAuthor || getRepoOwner(repoUrl),
              repoUrl,
              registryUrl: "https://packagist.org/packages/konthaina/khqr-php",
            },
          }));
        }
      } catch {
        if (!isActive) return;
      } finally {
        if (!isActive) return;
        setIsLoadingRemote((prev) => ({ ...prev, [packageId]: false }));
      }
    };

    void fetchMeta();

    return () => {
      isActive = false;
    };
  }, [packageId, cachedMeta]);

  const resolvedMeta = remoteMeta[packageId] ?? {};
  const keywords = resolvedMeta.keywords ?? [];

  return (
    <aside className="space-y-6 text-sm">
      <div>
        <h3 className="font-semibold text-foreground mb-2">Version</h3>
        <p className="text-muted-foreground">{resolvedMeta.version || "--"}</p>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-2">License</h3>
        <p className="text-muted-foreground">{resolvedMeta.license || "--"}</p>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-2">Author</h3>
        <p className="text-muted-foreground">{resolvedMeta.author || "--"}</p>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-2">Links</h3>
        <ul className="space-y-1.5">
          <li>
            {resolvedMeta.registryUrl ? (
              <a href={resolvedMeta.registryUrl} target="_blank" rel="noopener noreferrer" className="text-link hover:underline inline-flex items-center gap-1">
                Package Registry <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <span className="text-muted-foreground">Package Registry</span>
            )}
          </li>
          <li>
            {resolvedMeta.repoUrl ? (
              <a href={resolvedMeta.repoUrl} target="_blank" rel="noopener noreferrer" className="text-link hover:underline inline-flex items-center gap-1">
                Repository <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <span className="text-muted-foreground">Repository</span>
            )}
          </li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-2">Keywords</h3>
        {keywords.length ? (
          <div className="flex flex-wrap gap-1.5">
            {keywords.map((kw) => (
              <span key={kw} className="bg-badge text-badge-foreground px-2 py-0.5 rounded text-xs font-mono">
                {kw}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">--</p>
        )}
      </div>

      {isLoadingRemote[packageId] && (
        <p className="text-xs text-muted-foreground">Updating package metadata...</p>
      )}
    </aside>
  );
};

export default PackageSidebar;


