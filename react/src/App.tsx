import React, { createContext, useEffect, useRef, useState } from "react";

// import logo from "./logo.svg";
import "./App.css";

import ThemeProvider from "./contexts/ThemeProvider";
import Nav from "./components/Nav";
import ThemeToggle from "./components/ThemeToggle";
import Child from "./components/Child";

const mood = {
  happy: ":)",
  sad: ":(",
};
const AppContext = createContext(mood.happy);

// hooks based
function App() {
  // reactive state - changes will trigger a re-render
  const [count, setCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // called on any state/context
  useEffect(() => {
    console.log("any state change");

    return () => console.log("goodbye");
  });

  // called only initially, e.g. when no dependencies
  useEffect(() => {
    console.log("on init");
  }, []);

  // called only when specific "dependency" state change
  useEffect(() => {
    console.log("only 'count' state change", count);
    countPrevRef.current = count;

    return () => console.log("goodbye count", count);
  }, [count]);

  // non-reactive 'local' state - that is NOT saved between rerenders
  // it will be 0 on each re-render
  let countLocal = 0;

  // non reactive 'local' state - that is saved between rerenders
  const countRef = useRef(0);

  // the way to 'grab' HTML elements from the template
  const htmlRef = useRef<HTMLButtonElement>(null);

  const [valueContext, setValueContext] = useState(mood.sad);

  const countPrevRef = useRef(0);

  return (
    <ThemeProvider>
      <div className="App">
        <AppContext.Provider value={valueContext}>
          <Nav />
          <ThemeToggle />

          <button onClick={() => setCount(count + 1)}>
            Count {count} , prev {countPrevRef.current}
          </button>

          <button onClick={() => setLoaded(true)}>Loaded {"" + loaded}</button>

          <button
            onClick={() => {
              countRef.current++;
              htmlRef.current!.disabled = true;
            }}
          >
            CountRef {countRef.current}
          </button>

          <button onClick={() => countLocal++} ref={htmlRef}>
            CountLocal {countLocal}
          </button>

          <button onClick={() => setValueContext(valueContext === mood.happy ? mood.sad : mood.happy)}>
            Change context
          </button>

          <Child />
        </AppContext.Provider>
      </div>
    </ThemeProvider>
  );
}
export { AppContext };
export default App;
