import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Progress } from "@/app/my-programs/[programId]/Progress";
import { mockProgramData } from "../__mocks__/data";
import { act } from "react";
import { useProgressStore } from "@/app/store";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/test-path",
}));

afterEach(() => {
  const state = useProgressStore.getState();
  state.resetWorkoutTime();
  state.resetProgramInfo();
  state.resetExercisesStatus();
});

describe("Progress Integration", () => {
  it("starts and pauses workout", async () => {
    jest.useFakeTimers();
    render(<Progress data={mockProgramData} lastWorkoutData={undefined} />);
    // Start workout
    fireEvent.click(screen.getByText(/Start/i));
    // Advance timer by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(await screen.findByAltText(/pause program/i)).toBeInTheDocument();
    // Pause workout
    fireEvent.click(await screen.findByAltText(/pause program/i));
    expect(await screen.findByAltText(/resume program/i)).toBeInTheDocument();
    jest.useRealTimers();
  });

  it("checks set, shows break modal, and updates set values", async () => {
    render(<Progress data={mockProgramData} lastWorkoutData={undefined} />);
    fireEvent.click(screen.getByText(/Start/i));

    const checkboxes = screen.getAllByRole("checkbox", {
      name: new RegExp(`${mockProgramData.exercises[0].name} set-`, "i"),
    });

    fireEvent.click(checkboxes[0]);

    expect(await screen.findByLabelText(/break-time/i)).toBeInTheDocument();

    const stopBtn = screen.queryByText(/Stop/i);
    if (stopBtn) fireEvent.click(stopBtn);

    expect(checkboxes[0]).toBeChecked();
  });

  it("adds and removes a set", () => {
    render(<Progress data={mockProgramData} lastWorkoutData={undefined} />);
    fireEvent.click(screen.getByText(/Start/i));

    const firstCard = screen.getByLabelText(
      new RegExp(`exercise-card-${mockProgramData.exercises[0].name}`, "i")
    );
    fireEvent.click(within(firstCard).getByText(/Add Set/i));
    expect(within(firstCard).getAllByRole("checkbox").length).toBeGreaterThan(
      mockProgramData.exercises[0].set
    );

    fireEvent.click(within(firstCard).getByText(/Remove Set/i));
    expect(within(firstCard).getAllByRole("checkbox").length).toBe(
      mockProgramData.exercises[0].set
    );
  });

  it("moves to next exercise when all sets are checked", async () => {
    render(<Progress data={mockProgramData} lastWorkoutData={undefined} />);
    fireEvent.click(screen.getByText(/Start/i));

    const firstExerciseName = mockProgramData.exercises[0].name;
    const checkboxes = screen.getAllByRole("checkbox", {
      name: new RegExp(`${firstExerciseName} set-`, "i"),
    });
    checkboxes.forEach((cb) => fireEvent.click(cb));

    const secondExerciseName = mockProgramData.exercises[1].name;

    const secondCard = screen.getByLabelText(
      new RegExp(`exercise-card-${secondExerciseName}`, "i")
    );
    const secondCardCheckboxes = within(secondCard).getAllByRole("checkbox");
    secondCardCheckboxes.forEach((cb) => {
      expect(cb).not.toBeDisabled();
    });
  });
});
