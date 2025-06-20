import { act } from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProgramHistoryDetailModal } from "@/app/component/ProgramHistoryDetailModal";
import { MyStat } from "@/app/api/types";
import { ModalWrapperProps } from "@/app/component/ModalWrapper";
import { ProgramHistoryDetailCardProps } from "@/app/component/ProgramHistoryDetailCard";
import { ExerciseDetailModalProps } from "@/app/component/ExerciseDetailModal";
import { SatisfactionIconProps } from "@/app/component/SatisfactionIcon";

// Mock child components
jest.mock("@/app/component/ModalWrapper", () => ({
  ModalWrapper: ({ isOpen, Title, children }: ModalWrapperProps) =>
    isOpen ? (
      <div>
        <div data-testid="mock-title">{Title}</div>
        {children}
      </div>
    ) : null,
}));
jest.mock("@/app/component/ProgramHistoryDetailCard", () => ({
  ProgramHistoryDetailCard: ({
    data,
    onClick,
  }: ProgramHistoryDetailCardProps) => (
    <div
      onClick={() => onClick(data.id)}
      data-testid={`history-card-${data.id}`}
    >
      {data.name}
    </div>
  ),
}));
jest.mock("@/app/component/ExerciseDetailModal", () => ({
  ExerciseDetailModal: ({ isOpen, exerciseId }: ExerciseDetailModalProps) =>
    isOpen ? <div data-testid="detail-modal">{exerciseId}</div> : null,
}));
jest.mock("@/app/component/SatisfactionIcon", () => ({
  SatisfictionIcon: ({ status }: SatisfactionIconProps) => (
    <div data-testid="satisfaction-icon">{status}</div>
  ),
}));

const mockHistoryData: MyStat = {
  _id: "hist1",
  userId: "testuser",
  savedProgramId: "prog1",
  savedWorkoutTime: 3600,
  completedAt: new Date("2023-10-27T10:00:00Z").toISOString(),
  savedProgramName: "Morning Blast",
  title: "Felt great today",
  note: "Good energy levels.",
  satisfiedStatus: "happy",
  isPublic: true,
  savedExercisesStatus: [
    {
      id: "ex1",
      name: "Jump Rope",
      exerciseSetValues: [{ order: 1, weight: 0, repeat: 100, checked: true }],
      img_url: "",
      type: "arm",
    },
    {
      id: "ex2",
      name: "Crunches",
      exerciseSetValues: [{ order: 1, weight: 0, repeat: 30, checked: true }],
      img_url: "",
      type: "back",
    },
  ],
  imageUrl: "/test.jpg",
};

describe("ProgramHistoryDetailModal", () => {
  it("renders history data correctly", () => {
    render(
      <ProgramHistoryDetailModal
        isOpen={true}
        data={mockHistoryData}
        onClose={jest.fn()}
      />
    );
    expect(screen.getByTestId("mock-title")).toHaveTextContent("10/27");
    expect(screen.getByTestId("mock-title")).toHaveTextContent("Morning Blast");
    expect(screen.getByTestId("mock-title")).toHaveTextContent("Public");

    expect(screen.getByText("Felt great today")).toBeInTheDocument();
    expect(screen.getByText("Good energy levels.")).toBeInTheDocument();
    expect(screen.getByTestId("satisfaction-icon")).toHaveTextContent("happy");

    expect(screen.getByText("Jump Rope")).toBeInTheDocument();
    expect(screen.getByText("Crunches")).toBeInTheDocument();
  });

  it("shows private status", () => {
    const privateData = { ...mockHistoryData, isPublic: false };
    render(
      <ProgramHistoryDetailModal
        isOpen={true}
        data={privateData}
        onClose={jest.fn()}
      />
    );
    expect(screen.getByTestId("mock-title")).toHaveTextContent("Private");
  });

  it("opens detail modal on card click", async () => {
    render(
      <ProgramHistoryDetailModal
        isOpen={true}
        data={mockHistoryData}
        onClose={jest.fn()}
      />
    );
    expect(screen.queryByTestId("detail-modal")).not.toBeInTheDocument();

    const jumpRopeCard = screen.getByTestId("history-card-ex1");
    await act(async () => await userEvent.click(jumpRopeCard));

    const detailModal = screen.getByTestId("detail-modal");
    expect(detailModal).toBeInTheDocument();
    expect(detailModal).toHaveTextContent("ex1");
  });

  it("is not visible when isOpen is false", () => {
    const { container } = render(
      <ProgramHistoryDetailModal
        isOpen={false}
        data={mockHistoryData}
        onClose={jest.fn()}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
