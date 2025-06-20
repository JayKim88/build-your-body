import { render, screen } from "@testing-library/react";
import { LoginButton } from "@/app/component/LoginButton";

jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));
jest.mock("@/app/store", () => ({
  useCartStore: () => ({ removeAll: jest.fn(), setProgramName: jest.fn() }),
  useProgressStore: () => ({
    resetProgramInfo: jest.fn(),
    resetWorkoutTime: jest.fn(),
    resetExercisesStatus: jest.fn(),
    resetCompletedAt: jest.fn(),
  }),
}));

describe("LoginButton", () => {
  it("renders JOIN NOW when not logged in", () => {
    render(<LoginButton />);
    expect(
      screen.getByRole("button", { name: /join now/i })
    ).toBeInTheDocument();
  });

  it("renders LOGOUT when logged in", () => {
    jest.doMock("next-auth/react", () => ({
      useSession: () => ({
        data: { user: { name: "Jay" } },
        status: "authenticated",
      }),
      signIn: jest.fn(),
      signOut: jest.fn(),
    }));
    // Clear the require cache for the component to pick up the new mock
    jest.resetModules();
    const {
      LoginButton: LoginButtonAuthed,
    } = require("@/app/component/LoginButton");
    render(<LoginButtonAuthed />);
    expect(
      screen.getByRole("button", { name: /log out/i })
    ).toBeInTheDocument();
  });
});
