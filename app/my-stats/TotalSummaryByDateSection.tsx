import { format } from "date-fns";
import { TotalWidget } from "../component/TotalWidget";
import { formattedTime } from "../utils";

type TotalSummaryByDateSectionProps = {
  selectedDate: Date;
  totalLift: number;
  totalWorkoutTime: number;
};

export const TotalSummaryByDateSection = ({
  selectedDate,
  totalLift,
  totalWorkoutTime,
}: TotalSummaryByDateSectionProps) => (
  <div className="flex flex-col gap-y-5">
    <TotalWidget
      title={`${format(selectedDate, "MM/dd")} Lift`}
      data={totalLift}
      unit="kg"
    />
    <TotalWidget
      title={`${format(selectedDate, "MM/dd")} Workout`}
      data={formattedTime(totalWorkoutTime) || "0s"}
    />
  </div>
);
