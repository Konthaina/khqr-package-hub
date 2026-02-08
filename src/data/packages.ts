import { Braces, Code2, Package, type LucideIcon } from "lucide-react";

type PackageInfo = {
  id: "npm" | "pip" | "composer";
  name: string;
  language: string;
  langShort: string;
  icon: LucideIcon;
  version: string;
  license: string;
  installCommand: string;
  registryUrl: string;
  repoUrl: string;
  keywords: readonly string[];
  description: string;
};

export const packages = {
  npm: {
    id: "npm",
    name: "konthaina-khqr",
    language: "TypeScript / JavaScript",
    langShort: "npm",
    icon: "📦",
    version: "0.1.4",
    license: "MIT",
    installCommand: "npm i konthaina-khqr",
    registryUrl: "https://www.npmjs.com/package/konthaina-khqr",
    repoUrl: "https://github.com/Konthaina/khqr-npm",
    keywords: ["KHQR", "Bakong", "EMVCo", "QR", "Cambodia", "CRC16", "TLV"],
    description:
      "KHQR / EMVCo merchant-presented QR payload generator for Bakong (Cambodia), inspired by konthaina/khqr-php.",
  },
  pip: {
    id: "pip",
    name: "konthaina-khqr",
    language: "Python",
    langShort: "pip",
    icon: "🐍",
    version: "0.1.7",
    license: "MIT",
    installCommand: "pip install konthaina-khqr",
    registryUrl: "https://pypi.org/project/konthaina-khqr/",
    repoUrl: "https://github.com/Konthaina/khqr-python",
    keywords: ["KHQR", "Bakong", "EMVCo", "QR", "Cambodia"],
    description:
      "KHQR / EMVCo merchant-presented QR payload generator for Bakong / Cambodia (NBC KHQR spec v2.7-style TLV) with CRC-16/CCITT-FALSE verification.",
  },
  composer: {
    id: "composer",
    name: "konthaina/khqr-php",
    language: "PHP (Laravel)",
    langShort: "composer",
    icon: "🐘",
    version: "1.0.2",
    license: "MIT",
    installCommand: "composer require konthaina/khqr-php",
    registryUrl: "https://packagist.org/packages/konthaina/khqr-php",
    repoUrl: "https://github.com/Konthaina/khqr-laravel",
    keywords: ["QR", "Cambodia", "EMVCo", "Bakong", "KHQR"],
    description:
      "KHQR / EMVCo QR payload generator for PHP (merchant presented) with CRC16 (NBC KHQR spec). Laravel compatible.",
  },
} as const;

export type PackageId = keyof typeof packages;
