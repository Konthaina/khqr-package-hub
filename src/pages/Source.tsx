import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import InstallBanner from "@/components/InstallBanner";
import Footer from "@/components/Footer";

const repoUrl = "https://github.com/Konthaina/khqr-quickstart";
const cloneCommand = "git clone https://github.com/Konthaina/khqr-quickstart.git";
const downloadUrl = "https://github.com/Konthaina/khqr-quickstart/archive/refs/heads/main.zip";

const Source = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <Header onDonateClick={() => navigate("/donate", { state: { backgroundLocation: location } })} />

      <div className="bg-header text-header-foreground py-10">
        <div className="container max-w-6xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Source Code</h1>
          <p className="text-base opacity-80 max-w-2xl">
            Clone the repository or download the latest source bundle.
          </p>
        </div>
      </div>

      <main className="container max-w-6xl mx-auto px-4 py-10">
        <div className="space-y-8">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Repository URL</h2>
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link hover:underline break-all"
            >
              {repoUrl}
            </a>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Clone</h2>
            <InstallBanner command={cloneCommand} />
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Download</h2>
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded border border-border px-4 py-2 text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              Download ZIP
            </a>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Source;
