import { render } from "@testing-library/react";
import { CartButton } from "@/app/component/CartButton";

jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: { user: {} } }),
}));
jest.mock("next/navigation", () => ({
  usePathname: () => "/exercises",
}));
jest.mock("@/app/store", () => ({
  useCartStore: () => ({ stored: [] }),
}));

describe("CartButton", () => {
  it("renders cart icon when logged in and on exercises page", () => {
    const { container } = render(<CartButton />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
