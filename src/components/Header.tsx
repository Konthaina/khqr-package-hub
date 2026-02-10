import { Link } from "react-router-dom";
import { Package, Heart } from "lucide-react";

type HeaderProps = {
  onDonateClick?: () => void;
};

const Header = ({ onDonateClick }: HeaderProps) => {
  return (
    <header className="bg-header text-header-foreground">
      <div className="container flex items-center justify-between h-16 px-4 max-w-6xl mx-auto">
        <Link to="/" className="flex items-center gap-3">
          <Package className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold tracking-tight">konthaina</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/source" className="opacity-80 hover:opacity-100 transition-opacity">
            Source
          </Link>
          <a href="https://www.npmjs.com/package/konthaina-khqr" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
            npm
          </a>
          <a href="https://pypi.org/project/konthaina-khqr/" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
            PyPI
          </a>
          <a href="https://packagist.org/packages/konthaina/khqr-php" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
            Packagist
          </a>
          <button
            type="button"
            onClick={onDonateClick}
            className="inline-flex items-center gap-2 rounded border border-header-foreground/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-header-foreground/90 transition-colors hover:text-header-foreground hover:border-header-foreground/40"
          >
            <Heart className="h-4 w-4" />
            Donate
          </button>
        </nav>
        <button
          type="button"
          onClick={onDonateClick}
          className="md:hidden inline-flex items-center gap-2 rounded border border-header-foreground/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-header-foreground/90 transition-colors hover:text-header-foreground hover:border-header-foreground/40"
        >
          <Heart className="h-4 w-4" />
          Donate
        </button>
      </div>
    </header>
  );
};

export default Header;
