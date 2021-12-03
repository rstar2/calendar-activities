import React, { useContext, useEffect } from "react";

import { AppContext } from "../App";

// hooks based
function Child() {
  // reactive context state - changes will trigger a re-render
  let contextValue = useContext(AppContext);

  // called on any state/context
  useEffect(() => {
    console.log("child state change");

    return () => console.log("child goodbye");
  });

  return (
    <span className="Child">
      {contextValue}
    </span>
  );
}

export default Child;
