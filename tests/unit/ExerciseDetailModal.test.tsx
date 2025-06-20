import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExerciseDetailModal } from "@/app/component/ExerciseDetailModal";
import { useCartStore } from "@/app/store";
import * as exerciseApi from "@/app/api/exercise/getData";
import { Exercise } from "@/app/api/types";
import { useSession } from "next-auth/react";
import { ModalWrapperProps } from "@/app/component/ModalWrapper";

// Mock dependencies
jest.mock("next-auth/react", () => ({
  __esModule: true,
  useSession: jest.fn(),
}));
jest.mock("@/app/api/exercise/getData");
jest.mock("@/app/store");
jest.mock("@/app/component/ModalWrapper", () => ({
  ModalWrapper: ({ isOpen, children, onClose }: ModalWrapperProps) =>
    isOpen ? <div onClick={onClose}>{children}</div> : null,
}));
jest.mock("@/app/hook/useSnackbar", () => ({
  useBodySnackbar: () => ({
    bodySnackbar: jest.fn(),
  }),
}));
// Mocking the CartTitleButton which is a child component
jest.mock("@/app/component/CartTitleButton", () => ({
  CartTitleButton: ({
    title,
    onClick,
  }: {
    title: string;
    onClick: () => void;
  }) => <button onClick={onClick}>{title}</button>,
}));

const mockExercise: Exercise = {
  _id: "ex123",
  name: "Test Push-ups",
  description: "A great exercise for the chest.",
  type: "chest",
  summary: "A summary.",
  guide: ["Step 1", "Step 2"],
  thumbnail_img_url: "/thumb.jpg",
  video_url: "https://example.com/video",
  ref: [{ title: "Reference", url: "https://example.com" }],
};

const mockAddToCart = jest.fn();
const mockRemoveFromCart = jest.fn();

describe("ExerciseDetailModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSession as jest.Mock).mockReturnValue({ data: { user: "test" } });
    (useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        stored: [],
        add: mockAddToCart,
        remove: mockRemoveFromCart,
      };
      return selector(state);
    });
  });

  it("renders with data passed via props", () => {
    render(
      <ExerciseDetailModal
        isOpen={true}
        onClose={jest.fn()}
        data={mockExercise}
      />
    );
    expect(screen.getByText("Test Push-ups")).toBeInTheDocument();
    expect(
      screen.getByText("A great exercise for the chest.")
    ).toBeInTheDocument();
  });

  it("fetches data when exerciseId is provided", async () => {
    (exerciseApi.getExerciseData as jest.Mock).mockResolvedValue(mockExercise);
    render(
      <ExerciseDetailModal
        isOpen={true}
        onClose={jest.fn()}
        exerciseId="ex123"
      />
    );

    await waitFor(() =>
      expect(exerciseApi.getExerciseData).toHaveBeenCalledWith("ex123")
    );
    await waitFor(() =>
      expect(screen.getByText("Test Push-ups")).toBeInTheDocument()
    );
  });

  it("calls addToCart when 'Add' button is clicked", async () => {
    render(
      <ExerciseDetailModal
        isOpen={true}
        onClose={jest.fn()}
        data={mockExercise}
      />
    );
    const addButton = await screen.findByText("Add");
    await userEvent.click(addButton);
    expect(mockAddToCart).toHaveBeenCalled();
  });

  it("calls removeFromCart when 'Delete' button is clicked", async () => {
    // Simulate item being in cart
    (useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        stored: [{ id: "ex123" }],
        add: mockAddToCart,
        remove: mockRemoveFromCart,
      };
      return selector(state);
    });

    render(
      <ExerciseDetailModal
        isOpen={true}
        onClose={jest.fn()}
        data={mockExercise}
      />
    );

    const deleteButton = await screen.findByText("Delete");
    await userEvent.click(deleteButton);
    expect(mockRemoveFromCart).toHaveBeenCalledWith("ex123");
  });
});
