import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { YoutubeModal } from "@/app/component/YoutubeModal";
import { useSession } from "next-auth/react";

jest.mock("next-auth/react", () => ({
  __esModule: true,
  useSession: jest.fn(),
}));

describe.skip("YoutubeModal", () => {
  beforeEach(() => (useSession as jest.Mock).mockClear());

  it("does not render when user is not logged in", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });
    const { container } = render(<YoutubeModal />);
    // The component renders an empty fragment, so the container should be empty
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the modal with search input when user is logged in", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: "Test" } },
      status: "authenticated",
    });
    render(<YoutubeModal />);
    expect(screen.getByPlaceholderText("Search for music")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });

  it("allows typing in the search input", async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: "Test" } },
      status: "authenticated",
    });
    render(<YoutubeModal />);
    const input =
      screen.getByPlaceholderText<HTMLInputElement>("Search for music");
    await userEvent.type(input, "lofi hip hop");
    expect(input.value).toBe("lofi hip hop");
  });
});
