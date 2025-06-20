import { render, screen } from "@testing-library/react";
import { AuthLayout } from "@/app/component/AuthLayout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

jest.mock("next-auth/react", () => ({
  __esModule: true,
  useSession: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

describe("AuthLayout", () => {
  beforeEach(() => {
    (useSession as jest.Mock).mockClear();
    (useRouter as jest.Mock).mockClear();
  });

  it("renders children when authenticated", () => {
    (useSession as jest.Mock).mockReturnValue({ status: "authenticated" });
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    render(
      <AuthLayout>
        <div>child content</div>
      </AuthLayout>
    );
    expect(screen.getByText("child content")).toBeInTheDocument();
  });

  it("redirects and shows loading when unauthenticated", () => {
    const mockRouterPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    (useSession as jest.Mock).mockReturnValue({ status: "unauthenticated" });

    render(
      <AuthLayout>
        <div>child content</div>
      </AuthLayout>
    );

    expect(screen.getByText("loading")).toBeInTheDocument();
    expect(screen.queryByText("child content")).not.toBeInTheDocument();
    expect(mockRouterPush).toHaveBeenCalledWith("/", { scroll: false });
  });
});
