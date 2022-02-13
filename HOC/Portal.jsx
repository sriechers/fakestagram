import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const Portal = ({ children, to = "#portal-layer" }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted ? createPortal(children, document.querySelector(to)) : null;
};

export default Portal;
