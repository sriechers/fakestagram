import { useState, useRef, useEffect } from "react";
import { useClickOutside } from "../util/hooks";
import { motion, AnimatePresence } from "framer-motion";
import Portal from "../HOC/Portal";
import Button from "./Button";
function Modal({
  children,
  open = false,
  to = "#portal-layer",
  cancelText = "cancel",
  okText = "ok",
  onValue,
  onClose,
}) {
  const [_open, setOpen] = useState(open);
  const ref = useRef();
  useClickOutside(ref, () => {
    setOpen(false);
    typeof onClose === "function" && onClose();
  });

  const handleSubmit = (value) => {
    if (!value) {
      typeof onClose === "function" && onClose();
      return setOpen(false);
    }

    typeof onValue === "function" && onValue(value);
    setOpen(false);
  };

  useEffect(() => {
    setOpen(open);
  }, [open]);

  return (
    <Portal to={to}>
      <AnimatePresence>
        {_open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ zIndex: 1000 }}
            className="fixed w-screen h-screen top-0 left-0 bg-slate-900 bg-opacity-30 backdrop-blur-sm"
          >
            <div className="overflow-hidden px-6 py-4 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl shadow-slate-400">
              <motion.form
                ref={ref}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                initial={{ opacity: 0, y: "1rem" }}
                animate={{ opacity: 1, y: "0rem" }}
                exit={{ opacity: 0, y: "1rem" }}
              >
                {children}
                <div className="flex justify-end items-center">
                  <Button className="max-w-max" type="submit">
                    {okText}
                  </Button>
                  <button
                    type="button"
                    onClick={() => handleSubmit(false)}
                    className="text-slate-400 tracking-wide mx-2"
                  >
                    {cancelText}
                  </button>
                </div>
              </motion.form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}

export default Modal;
