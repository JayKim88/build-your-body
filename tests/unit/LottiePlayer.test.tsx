import { render, screen } from "@testing-library/react";
import LottiePlayer from "@/app/component/LottiePlayer";

jest.mock("lottie-react");

describe("LottiePlayer", () => {
  it("renders the mocked Lottie component", () => {
    render(<LottiePlayer type="loading" />);
    const lottieMock = screen.getByTestId("lottie-mock");
    expect(lottieMock).toBeInTheDocument();
  });

  it("renders for a different animation type", () => {
    render(<LottiePlayer type="complete" />);
    const lottieMock = screen.getByTestId("lottie-mock");
    expect(lottieMock).toBeInTheDocument();
  });
});
