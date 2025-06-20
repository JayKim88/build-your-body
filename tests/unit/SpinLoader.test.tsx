import React from "react";
import { render } from "@testing-library/react";
import { SpinLoader } from "@/app/component/SpinLoader";

describe("SpinLoader", () => {
  it("renders without crashing", () => {
    const { container } = render(<SpinLoader />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
