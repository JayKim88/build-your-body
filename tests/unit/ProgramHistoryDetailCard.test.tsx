import { render, screen } from "@testing-library/react";
import { ProgramHistoryDetailCard } from "@/app/component/ProgramHistoryDetailCard";
import { ExerciseType } from "@/app/component/Filter";
import userEvent from "@testing-library/user-event";
import { act } from "react";

const mockData = {
  id: "1",
  img_url: "test-file-stub",
  name: "Squat",
  type: "leg" as ExerciseType,
  exerciseSetValues: [
    { order: 1, weight: 100, repeat: 10, checked: false },
    { order: 2, weight: 100, repeat: 8, checked: false },
  ],
};

describe("ProgramHistoryDetailCard", () => {
  it("renders program name and set details", () => {
    render(<ProgramHistoryDetailCard data={mockData} onClick={() => {}} />);
    expect(screen.getByText("Squat")).toBeInTheDocument();
    expect(screen.getByText("1 set")).toBeInTheDocument();
    expect(screen.getAllByText("100 kg")).toHaveLength(2);
    expect(screen.getByText("10 times")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const handleClick = jest.fn();
    render(<ProgramHistoryDetailCard data={mockData} onClick={handleClick} />);
    await act(async () => {
      await userEvent.click(screen.getByRole("img"));
    });
    expect(handleClick).toHaveBeenCalled();
  });
});
