import React from "react";

// The mock will now accept props and render the animationData prop as JSON
// so that tests can verify the correct data was passed.
export default function Lottie({ animationData }: { animationData?: object }) {
  return React.createElement(
    "div",
    { "data-testid": "lottie-mock" },
    JSON.stringify(animationData || {})
  );
}
