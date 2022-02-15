import { useEffect, useLayoutEffect, useState, useCallback } from "react";
import io from "socket.io-client";

export const useClickOutside = (ref, handler) => {
  useEffect(
    () => {
      const listener = (event) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handler(event);
      };
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler]
  );
};

// export const useMatchMedia = (sizes) => {
//   const [ mediaQueries ] = useState(sizes ? sizes : [
//     '768px',
//     '1080px'
//   ])
//   const [ mQuery, setMQuery ] = useState(false)
//   useEffect(() => {
//     if(typeof window === 'undefined') return

//     mediaQueries.map(query => {
//       let mediaQuery = window.matchMedia(`(min-width: ${})`);
//     })
//   }, [])
// }

export const useMatchMedia = (
  queries = ["(min-width: 768px)", "(min-width: 1024px)"],
  defaultValues = []
) => {
  const initialValues = defaultValues.length
    ? defaultValues
    : Array(queries.length).fill(false);

  if (typeof window === "undefined") return initialValues;

  const mediaQueryLists = queries.map((q) => window.matchMedia(q));
  const getValue = () => {
    // Return the value for the given queries
    const matchedQueries = mediaQueryLists.map((mql) => mql.matches);

    return matchedQueries;
  };

  // State and setter for matched value
  const [value, setValue] = useState(getValue);

  useLayoutEffect(() => {
    // Event listener callback
    // Note: By defining getValue outside of useEffect we ensure that it has ...
    // ... current values of hook args (as this hook only runs on mount/dismount).
    const handler = () => setValue(getValue);
    // Set a listener for each media query with above handler as callback.
    mediaQueryLists.forEach((mql) => mql.addListener(handler));
    // Remove listeners on cleanup
    return () => mediaQueryLists.forEach((mql) => mql.removeListener(handler));
  }, []);

  return value;
};

export const useKeyPress = (targetKey) => {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);
  // If pressed key is our target key then set to true
  function downHandler({ key }) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }
  // If released key is our target key then set to false
  const upHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };
  // Add event listeners
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount
  return keyPressed;
};

const useStorage = (key, defaultValue, storageObject) => {
  const [value, setValue] = useState(() => {
    const jsonValue = storageObject.getItem(key);
    if (jsonValue != null) return JSON.parse(jsonValue);

    if (typeof defaultValue === "function") {
      return defaultValue();
    } else {
      return defaultValue;
    }
  });

  useEffect(() => {
    if (value === undefined) return storageObject.removeItem(key);
    storageObject.setItem(key, JSON.stringify(value));
  }, [key, value, storageObject]);

  const remove = useCallback(() => {
    setValue(undefined);
  }, []);
  return [value, setValue, remove];
};

export const useLocalStorage = (key, defaultValue) => {
  if (typeof window === "undefined") {
    return typeof defaultValue === "function"
      ? [defaultValue(), null, null]
      : [defaultValue, null, null];
  }
  return useStorage(key, defaultValue, window.localStorage);
};

export const useSessionStorage = (key, defaultValue) => {
  if (typeof window === "undefined") {
    return typeof defaultValue === "function"
      ? [defaultValue(), null, null]
      : [defaultValue, null, null];
  }
  return useStorage(key, defaultValue, window.sessionStorage);
};
