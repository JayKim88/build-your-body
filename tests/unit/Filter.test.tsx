import { render, screen } from "@testing-library/react";
import { Filter } from "@/app/component/Filter";
import userEvent from "@testing-library/user-event";
import { exerciseTypes, ExerciseType } from "@/app/component/Filter";

describe("Filter", () => {
  it("renders all exercise type chips", () => {
    render(<Filter onFilter={() => {}} selectedType="all" />);
    ["All", "Chest", "Back", "Leg", "Shoulder", "Arm"].forEach((type) => {
      expect(screen.getByText(type)).toBeInTheDocument();
    });
  });

  it("calls onFilter with correct ExerciseType and applies correct bgColor when each chip is clicked", async () => {
    const handleFilter = jest.fn();
    let selectedType = "all" as ExerciseType;
    const { rerender } = render(
      <Filter
        selectedType={selectedType}
        onFilter={(v) => {
          handleFilter(v);
          selectedType = v;
        }}
      />
    );
    for (const { type, selectedBgColor } of exerciseTypes) {
      const targetChip = screen.getByText(new RegExp(type, "i"));
      await userEvent.click(targetChip);
      rerender(
        <Filter
          selectedType={type}
          onFilter={(v) => {
            handleFilter(v);
            selectedType = v;
          }}
        />
      );
      expect(handleFilter).toHaveBeenLastCalledWith(type);
      expect(targetChip.parentElement).toHaveClass(selectedBgColor);
    }
    expect(handleFilter).toHaveBeenCalledTimes(exerciseTypes.length);
  });
});
