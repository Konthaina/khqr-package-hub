const Footer = () => {
  const githubLogoSrc = `${import.meta.env.BASE_URL}github-logo.png`;

  return (
    <footer className="border-t border-border py-8 mt-12">
      <div className="container max-w-6xl mx-auto px-4 text-sm text-muted-foreground flex flex-col gap-3 md:flex-row md:items-center md:justify-between items-center">
        <p>
          Built by{" "}
          <a href="https://github.com/Konthaina" target="_blank" rel="noopener noreferrer" className="text-link hover:underline font-medium">
            Konthaina
          </a>{" "}
          · MIT License · {new Date().getFullYear()}
        </p>
        <a
          href="https://github.com/Konthaina"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open GitHub"
          className="inline-flex items-center justify-center transition-opacity hover:opacity-80"
        >
          <img
            src={githubLogoSrc}
            alt=""
            aria-hidden="true"
            className="h-6 w-6"
            loading="lazy"
            decoding="async"
          />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
