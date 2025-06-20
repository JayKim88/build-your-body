import { render } from "@testing-library/react";
import { SatisfictionIcon } from "@/app/component/SatisfactionIcon";

describe("SatisfictionIcon", () => {
  it("renders the correct icon for each status (mocked)", () => {
    const { rerender, container } = render(
      <SatisfictionIcon status="terrible" />
    );
    expect(container.querySelector("test-file-stub")).toBeInTheDocument();

    rerender(<SatisfictionIcon status="notSatisfied" />);
    expect(container.querySelector("test-file-stub")).toBeInTheDocument();

    rerender(<SatisfictionIcon status="soso" />);
    expect(container.querySelector("test-file-stub")).toBeInTheDocument();

    rerender(<SatisfictionIcon status="happy" />);
    expect(container.querySelector("test-file-stub")).toBeInTheDocument();

    rerender(<SatisfictionIcon />);
    expect(container.querySelector("test-file-stub")).toBeInTheDocument();
  });
});
