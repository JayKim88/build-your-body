import { SatisfiedStatus } from "../my-programs/complete/WorkoutSummary";
import Terrible from "@/public/workout-complete-icon/terrible.svg";
import NotSatisfied from "@/public/workout-complete-icon/not-satisfied.svg";
import Soso from "@/public/workout-complete-icon/soso.svg";
import Happy from "@/public/workout-complete-icon/happy.svg";
import Lol from "@/public/workout-complete-icon/lol.svg";

export const SatisfictionIcon = ({ status }: { status?: SatisfiedStatus }) => {
  let result;
  switch (status) {
    case "terrible":
      result = <Terrible />;
      break;
    case "notSatisfied":
      result = <NotSatisfied />;
      break;
    case "soso":
      result = <Soso />;
      break;
    case "happy":
      result = <Happy />;
      break;
    default:
      result = <Lol />;
      break;
  }

  return <span className="[&>svg]:fill-yellow scale-75">{result}</span>;
};
