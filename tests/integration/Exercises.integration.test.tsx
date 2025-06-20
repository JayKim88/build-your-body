import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { FilteredList } from "@/app/exercises/FilteredList";
import { mockExercises } from "../__mocks__/data";
import userEvent from "@testing-library/user-event";

jest.mock("@/app/store", () => {
  const actual = jest.requireActual("@/app/store");
  return {
    ...actual,
    useCartStore: jest.fn((selector) =>
      selector({
        stored: [],
        cartItems: [],
        add: jest.fn(),
        remove: jest.fn(),
        removeAll: jest.fn(),
        addSettings: jest.fn(),
        setProgramName: jest.fn(),
        setIsUpdated: jest.fn(),
      })
    ),
  };
});

jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { name: "Test User" } },
    status: "authenticated",
  }),
  signIn: jest.fn(),
  signOut: jest.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe("Exercise Browsing Integration", () => {
  it("renders all exercises and filters by type", async () => {
    render(<FilteredList data={mockExercises} />);

    mockExercises.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /back/i }));
    await waitFor(() => {
      mockExercises.forEach(({ name, type }) => {
        if (type === "back") {
          expect(screen.getByText(name)).toBeInTheDocument();
        } else {
          expect(screen.queryByText(name)).not.toBeInTheDocument();
        }
      });
    });

    await userEvent.click(screen.getByRole("button", { name: /all/i }));
    await waitFor(() => {
      mockExercises.forEach(({ name }) => {
        expect(screen.getByText(name)).toBeInTheDocument();
      });
    });
  });

  it("opens the exercise detail modal when an exercise is clicked", async () => {
    render(<FilteredList data={mockExercises} />);
    await userEvent.click(screen.getByText(mockExercises[0].name));
    await waitFor(() => {
      expect(screen.getByText(mockExercises[0].summary)).toBeInTheDocument();
    });
  });

  it("shows add/remove cart buttons for logged-in users", async () => {
    render(<FilteredList data={mockExercises} />);
    await userEvent.click(screen.getByText("Bench Press"));
    const modal = screen.getByTestId("modal-overlay");
    expect(
      within(modal).getByRole("button", { name: "Add" })
    ).toBeInTheDocument();
    expect(
      within(modal).getByRole("button", { name: "Delete" })
    ).toBeInTheDocument();
  });
});

describe("/api/exercises API (MSW integration)", () => {
  it("returns mock exercises from MSW", async () => {
    const res = await fetch("/api/exercises");
    expect(res.status).toBe(200);
    const json = await res.json();

    expect(json).toHaveProperty("data");
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.data[0]).toHaveProperty("name", json.data[0].name);
  });
});
