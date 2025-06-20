import { render, screen } from "@testing-library/react";
import { ExerciseSummaryCard } from "@/app/component/ExerciseSummaryCard";
import { ExerciseType } from "@/app/component/Filter";
import userEvent from "@testing-library/user-event";
import { act } from "react";

const mockData = {
  id: "1",
  type: "chest" as ExerciseType,
  img_url: "test-file-stub",
  name: "bench press",
  repeat: 10,
  set: 3,
  weight: 50,
};

describe("ExerciseSummaryCard", () => {
  it("renders exercise info and image", () => {
    render(<ExerciseSummaryCard data={mockData} onClick={() => {}} />);
    expect(screen.getByText("Bench press")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "test-file-stub");
    expect(screen.getByText("50 kg")).toBeInTheDocument();
    expect(screen.getByText("10 times")).toBeInTheDocument();
    expect(screen.getByText("3 sets")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const handleClick = jest.fn();
    render(<ExerciseSummaryCard data={mockData} onClick={handleClick} />);
    await act(async () => {
      await userEvent.click(screen.getByRole("img"));
    });
    expect(handleClick).toHaveBeenCalled();
  });
});
