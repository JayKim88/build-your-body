import React from "react";
import { render, screen } from "@testing-library/react";
import { TotalWidget } from "@/app/component/TotalWidget";

describe("TotalWidget", () => {
  it("renders title and data", () => {
    render(<TotalWidget title="Total" data={1234} />);
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("1,234")).toBeInTheDocument();
  });

  it("renders unit if provided", () => {
    render(<TotalWidget title="Total" data={100} unit="kg" />);
    expect(screen.getByText("kg")).toBeInTheDocument();
  });

  it("shows loader when loading", () => {
    render(<TotalWidget title="Total" data={0} loading />);
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByTestId("spin-loader")).toBeVisible();
  });
});
