import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StatSections } from "@/app/my-stats/Sections";
import { mockTotalSummary, mockPrograms } from "../__mocks__/data";
import { HistoryByDateSection } from "@/app/my-stats/HistoryByDateSection";

describe("Stats Dashboard Integration", () => {
  it("renders summary widgets and program list", async () => {
    render(
      <StatSections totalSummary={mockTotalSummary} programs={mockPrograms} />
    );
    await waitFor(() => {
      expect(screen.getByText("Total Lift")).toBeInTheDocument();
      expect(screen.getByText("Total Workout")).toBeInTheDocument();
    });
    expect(screen.getByText("Total Portion Ratio")).toBeInTheDocument();

    mockPrograms
      .filter((p) => !p.deleted)
      .forEach((program) => {
        expect(screen.getByText(program.programName)).toBeInTheDocument();
      });

    expect(screen.getByText(/669,904/)).toBeInTheDocument();
    expect(screen.getByText(/87/)).toBeInTheDocument();
  });

  it("shows deleted programs when toggling 'In progress' switch", async () => {
    render(
      <StatSections totalSummary={mockTotalSummary} programs={mockPrograms} />
    );

    const toggle = screen.getByRole("checkbox");

    await userEvent.click(toggle);

    expect(await screen.findByText("Leg Day Special")).toBeInTheDocument();

    mockPrograms
      .filter((p) => !p.deleted)
      .forEach((program) => {
        expect(screen.queryByText(program.programName)).not.toBeInTheDocument();
      });
  });

  it("opens program summary modal when magnifier is clicked", async () => {
    render(
      <StatSections totalSummary={mockTotalSummary} programs={mockPrograms} />
    );
    const magnifierButtons = screen.getAllByRole("button");
    await userEvent.click(magnifierButtons[0]);

    const modals = await screen.findAllByRole("dialog");
    const visibleModal = modals.find(
      (modal) => !modal.className.includes("hidden")
    );
    expect(
      within(visibleModal!).getByText(mockPrograms[0].programName)
    ).toBeInTheDocument();
  });

  it("renders the Total Portion Ratio section with chart and correct percentages", async () => {
    render(
      <StatSections totalSummary={mockTotalSummary} programs={mockPrograms} />
    );
    expect(screen.getByText("Total Portion Ratio")).toBeInTheDocument();
    expect(screen.getByText("Mocked Doughnut Chart")).toBeInTheDocument();

    const { liftByType } = mockTotalSummary;
    const total = liftByType.reduce((acc, cur) => acc + cur.lift, 0);

    liftByType.forEach(({ type, lift }) => {
      const label = type.charAt(0).toUpperCase() + type.slice(1);
      const percentage = ((lift / total) * 100).toFixed(2);

      expect(
        screen.getByText(
          (content) =>
            content.replace(/\s/g, "") ===
            `${label}:${percentage}%`.replace(/\s/g, "")
        )
      ).toBeInTheDocument();
    });
  });

  /**
   * @todo improve this tests with remain widgets
   */
  it("shows dots on dates with data in the calendar", async () => {
    render(<HistoryByDateSection />);
    await waitFor(() => {
      const thirteenth = screen.getByText("12");
      const twentieth = screen.getByText("20");
      expect(thirteenth.parentElement?.className).toContain("rdp-day");
      expect(twentieth.parentElement?.className).toContain("rdp-day");
    });
  });
});
