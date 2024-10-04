import { format } from "date-fns";
import { TotalWidget } from "../component/TotalWidget";
import { formattedTime } from "../utils";

type TotalSummaryByDateSectionProps = {
  selectedDate: Date;
  totalLift: number;
  totalWorkoutTime: number;
  loading: boolean;
};

export const TotalSummaryByDateSection = ({
  selectedDate,
  totalLift,
  totalWorkoutTime,
  loading,
}: TotalSummaryByDateSectionProps) => (
  <div className="flex flex-col gap-y-5">
    <TotalWidget
      title={`${format(selectedDate, "MM/dd")} Lift`}
      data={Math.floor(totalLift)}
      unit="kg"
      loading={loading}
    />
    <TotalWidget
      title={`${format(selectedDate, "MM/dd")} Workout`}
      data={formattedTime(totalWorkoutTime) || "0s"}
      loading={loading}
    />
  </div>
);
