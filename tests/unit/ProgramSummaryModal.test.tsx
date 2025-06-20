import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProgramSummaryModal } from "@/app/component/ProgramSummaryModal";
import { RegisteredProgram } from "@/app/api/types";
import { act } from "react";
import { ModalWrapperProps } from "@/app/component/ModalWrapper";
import { ExerciseSummaryCardProps } from "@/app/component/ExerciseSummaryCard";
import { ExerciseDetailModalProps } from "@/app/component/ExerciseDetailModal";

// Mock child components to isolate the ProgramSummaryModal
jest.mock("@/app/component/ModalWrapper", () => ({
  ModalWrapper: ({ isOpen, onClose, Title, children }: ModalWrapperProps) =>
    isOpen ? (
      <div>
        <div data-testid="mock-title">{Title}</div>
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    ) : null,
}));
jest.mock("@/app/component/ExerciseSummaryCard", () => ({
  ExerciseSummaryCard: ({ data, onClick }: ExerciseSummaryCardProps) => (
    <div onClick={() => onClick(data.id)} data-testid={`exercise-${data.id}`}>
      {data.name}
    </div>
  ),
}));
jest.mock("@/app/component/ExerciseDetailModal", () => ({
  ExerciseDetailModal: ({ isOpen, exerciseId }: ExerciseDetailModalProps) =>
    isOpen ? <div data-testid="detail-modal">{exerciseId}</div> : null,
}));

const mockProgram: RegisteredProgram = {
  _id: "program1",
  programName: "Full Body Workout",
  exercises: [
    {
      id: "ex1",
      name: "Push Ups",
      type: "chest",
      set: 3,
      repeat: 10,
      img_url: "",
    },
    {
      id: "ex2",
      name: "Squats",
      type: "leg",
      set: 3,
      repeat: 12,
      img_url: "",
    },
  ],
  userId: "testuser",
};

describe("ProgramSummaryModal", () => {
  const onCloseMock = jest.fn();

  beforeEach(() => onCloseMock.mockClear());

  it("renders program name and exercise cards", () => {
    render(
      <ProgramSummaryModal
        isOpen={true}
        onClose={onCloseMock}
        data={mockProgram}
      />
    );
    expect(screen.getByTestId("mock-title")).toHaveTextContent(
      "Full Body Workout"
    );
    expect(screen.getByText("Push Ups")).toBeInTheDocument();
    expect(screen.getByText("Squats")).toBeInTheDocument();
  });

  it("opens ExerciseDetailModal when an exercise card is clicked", async () => {
    render(
      <ProgramSummaryModal
        isOpen={true}
        onClose={onCloseMock}
        data={mockProgram}
      />
    );

    expect(screen.queryByTestId("detail-modal")).not.toBeInTheDocument();

    const pushUpsCard = screen.getByText("Push Ups");
    await act(async () => await userEvent.click(pushUpsCard));

    const detailModal = screen.getByTestId("detail-modal");
    expect(detailModal).toBeInTheDocument();
    expect(detailModal).toHaveTextContent("ex1");
  });

  it("renders nothing when isOpen is false", () => {
    const { container } = render(
      <ProgramSummaryModal
        isOpen={false}
        onClose={onCloseMock}
        data={mockProgram}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
