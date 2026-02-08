export type PackageId = "npm" | "pip" | "composer";

export const installCommands: Record<PackageId, string> = {
  npm: "npm i konthaina-khqr",
  pip: "pip install konthaina-khqr",
  composer: "composer require konthaina/khqr-php",
};
