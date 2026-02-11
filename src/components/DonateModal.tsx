import { useEffect } from "react";
import { useLocation, useNavigate, type Location } from "react-router-dom";
import KhqrCard from "@/components/KhqrCard";

type DonateLocationState = {
  backgroundLocation?: Location;
};

const DonateModal = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  const handleClose = () => {
    const state = location.state as DonateLocationState | null;
    if (state?.backgroundLocation) {
      navigate(-1);
      return;
    }
    navigate("/");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10">
      <button
        type="button"
        aria-label="Close donate modal"
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />
      <div role="dialog" aria-modal="true" className="relative w-full max-w-[720px]">
        <KhqrCard />
      </div>
    </div>
  );
};

export default DonateModal;
