import React from "react";
import { render, screen } from "@testing-library/react";
import { SearchInput } from "@/app/component/SearchInput";

describe.skip("SearchInput", () => {
  it("renders input and search icon", () => {
    render(<SearchInput />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    // FontAwesomeIcon does not have a test id, so check for svg
    expect(document.querySelector("svg")).toBeInTheDocument();
  });
});
