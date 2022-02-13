import { useState, useRef } from "react";
import { useClickOutside } from "../../util/hooks";
import { ChevronRightIcon } from "@heroicons/react/outline";
function Select({ title, value, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref} className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="border border-slate-300 bg-white shadow-sm flex items-center justify-center w-full rounded-md  px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 focus:ring-slate-200 transition duration-50 ease-out"
          onClick={() => setOpen((prev) => !prev)}
        >
          {title}
          <ChevronRightIcon
            className={`transform ${
              open ? "" : "rotate-90"
            } text-slate-600 ml-1 h-4 w-4 stroke-path-3 transition-transform duration-50 ease-out`}
          />
        </button>
      </div>
      {open && (
        <div
          className={`${
            open ? "block" : "hideen"
          } origin-top-right absolute right-0 mt-2 max-w-max rounded-md shadow-lg bg-white ring-1 ring-slate-100`}
        >
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {Array.isArray(value) ? (
              <>
                {value.map((val) => (
                  <button
                    key={"select-input-" + val}
                    className="w-full text-left px-4 py-2 text-md text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    role="menuitem"
                    onClick={() =>
                      typeof onSelect === "function" && onSelect(val)
                    }
                  >
                    <span className="flex flex-col">
                      <span>{val}</span>
                    </span>
                  </button>
                ))}
              </>
            ) : (
              <button
                className="w-full px-4 py-2 text-md text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                role="menuitem"
                onClick={() =>
                  typeof onSelect === "function" && onSelect(value)
                }
              >
                <span className="flex flex-col">
                  <span>{value}</span>
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Select;
