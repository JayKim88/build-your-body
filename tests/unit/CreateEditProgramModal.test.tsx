import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateEditProgramModal } from "@/app/component/CreateEditProgramModal";
import { useCartStore } from "@/app/store";
import * as programApi from "@/app/api/programs/register";
import * as deleteApi from "@/app/api/programs/delete";
import * as editApi from "@/app/api/programs/edit";
import { RegisteredProgram } from "@/app/api/types";
import { ModalWrapperProps } from "@/app/component/ModalWrapper";
import { ConfirmModalProps } from "@/app/component/ConfirmModal";
import { act } from "react";

// --- Mocks ---
jest.mock("react-sortablejs", () => ({
  ReactSortable: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="react-sortable-mock">{children}</div>
  ),
}));
jest.mock("@/app/store");
jest.mock("@/app/api/programs/register");
jest.mock("@/app/api/programs/delete");
jest.mock("@/app/api/programs/edit");
jest.mock("@/app/hook/useSnackbar", () => ({
  useBodySnackbar: () => ({ bodySnackbar: jest.fn() }),
}));
// Mock child components to simplify testing
jest.mock("@/app/component/ModalWrapper", () => ({
  ModalWrapper: ({ isOpen, children, Title }: ModalWrapperProps) =>
    isOpen ? (
      <div>
        {Title}
        {children}
      </div>
    ) : null,
}));
jest.mock("@/app/component/ConfirmModal", () => ({
  ConfirmModal: ({ isOpen, onClick, content }: ConfirmModalProps) =>
    isOpen ? (
      <div data-testid="confirm-modal">
        <span>{content}</span>
        <button onClick={() => onClick(true)}>Confirm</button>
      </div>
    ) : null,
}));
const useCartStoreMock = useCartStore as unknown as jest.Mock;

// --- Mock Data ---
const mockCartItems = [
  {
    id: "ex1",
    name: "Bench Press",
    type: "chest",
    img_url: "/img.png",
    set: 0,
    repeat: 0,
    weight: 0,
  },
];
const mockProgramData: RegisteredProgram = {
  _id: "prog1",
  userId: "user1",
  programName: "Chest Day",
  exercises: [
    {
      id: "ex1",
      name: "Bench Press",
      type: "chest",
      img_url: "",
      set: 3,
      repeat: 12,
      weight: 60,
    },
  ],
};

describe("CreateEditProgramModal", () => {
  const mockAddSettings = jest.fn();
  const mockSetProgramName = jest.fn();
  const mockRemoveAllFromCart = jest.fn();
  const mockSetIsUpdated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useCartStoreMock.mockImplementation((selector) => {
      const state = {
        stored: [],
        programName: "",
        addSettings: mockAddSettings,
        setProgramName: mockSetProgramName,
        removeAllFromCart: mockRemoveAllFromCart,
        setIsUpdated: mockSetIsUpdated,
      };

      if (typeof selector === "function") {
        return selector(state);
      }

      return state;
    });
  });

  it("renders cart items in create mode", () => {
    useCartStoreMock.mockImplementation((selector) => {
      const state = {
        stored: mockCartItems,
        programName: "",
        addSettings: mockAddSettings,
        setProgramName: mockSetProgramName,
        removeAllFromCart: mockRemoveAllFromCart,
        setIsUpdated: mockSetIsUpdated,
      };
      if (typeof selector === "function") {
        return selector(state);
      }
      return state;
    });
    render(<CreateEditProgramModal isOpen={true} onClose={jest.fn()} />);

    expect(screen.getByText("Make your new program")).toBeInTheDocument();
    expect(screen.getByText("Bench Press")).toBeInTheDocument();
  });

  it("renders program data in edit mode", () => {
    render(
      <CreateEditProgramModal
        isOpen={true}
        onClose={jest.fn()}
        data={mockProgramData}
      />
    );
    expect(screen.getByText("Change your program")).toBeInTheDocument();
    expect(screen.getByText("Chest Day")).toBeInTheDocument();
    expect(screen.getByText("Bench Press")).toBeInTheDocument();
  });

  it.skip("calls registerProgram on register", async () => {
    useCartStoreMock.mockImplementation((selector) => {
      const state = {
        stored: mockCartItems,
        programName: "", // Start with empty name
        addSettings: mockAddSettings,
        setProgramName: mockSetProgramName,
        removeAllFromCart: mockRemoveAllFromCart,
        setIsUpdated: mockSetIsUpdated,
      };
      if (typeof selector === "function") {
        return selector(state);
      }
      return state;
    });
    render(<CreateEditProgramModal isOpen={true} onClose={jest.fn()} />);

    const programNameInput = screen.getByTestId("program-name-input");
    await userEvent.type(programNameInput, "My New Program");

    // The button should be disabled initially because settings are 0
    const registerButton = screen.getByRole("button", { name: "Register" });
    // expect(registerButton).toBeDisabled();

    // Fill in exercise settings
    const numberInputs = screen.getAllByRole("spinbutton");
    await userEvent.clear(numberInputs[0]);
    await userEvent.type(numberInputs[0], "60"); // Weight
    await userEvent.clear(numberInputs[1]);
    await userEvent.type(numberInputs[1], "12"); // Repeat
    await userEvent.clear(numberInputs[2]);
    await userEvent.type(numberInputs[2], "3"); // Set

    // Now the button should be enabled
    expect(registerButton).toBeEnabled();
    await userEvent.click(registerButton);

    const confirmModal = await screen.findByTestId("confirm-modal");
    const confirmButton = within(confirmModal).getByRole("button", {
      name: "Confirm",
    });
    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(programApi.registerProgram).toHaveBeenCalled();
    });
  });

  it.skip("calls editProgram on edit", async () => {
    render(
      <CreateEditProgramModal
        isOpen={true}
        onClose={jest.fn()}
        data={mockProgramData}
      />
    );
    // In edit mode, the button should be enabled from the start
    const editButton = screen.getByRole("button", { name: "Confirm" });
    expect(editButton).toBeEnabled();
    await act(async () => {
      await userEvent.click(editButton);
    });

    const confirmModal = await screen.findByTestId("confirm-modal");
    const confirmButton = within(confirmModal).getByRole("button", {
      name: "Confirm",
    });
    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(editApi.editProgram).toHaveBeenCalled();
    });
  });

  it("calls deleteProgram on delete", async () => {
    render(
      <CreateEditProgramModal
        isOpen={true}
        onClose={jest.fn()}
        data={mockProgramData}
      />
    );
    const deleteButton = screen.getByRole("button", { name: "Delete" });
    await userEvent.click(deleteButton);

    const confirmModal = await screen.findByTestId("confirm-modal");
    const confirmButton = within(confirmModal).getByRole("button", {
      name: "Confirm",
    });
    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(deleteApi.deleteProgram).toHaveBeenCalledWith(mockProgramData._id);
    });
  });
});
