type TotalWidgetProps = {
  title: string;
  data: number;
  unit: string;
};

export const TotalWidget = ({ title, data, unit }: TotalWidgetProps) => {
  return (
    <div className="rounded-[32px] bg-gray6 flex flex-col w-[360px] h-[160px] px-5 py-4 text-gray0">
      <div className="text-[24px] tracking-wider">{title}</div>
      <div className="text-[64px] flex justify-end leading-[64px]  tracking-wider">
        {data.toLocaleString()}
      </div>
      <div className="text-[24px] flex justify-end leading-[16px] mt-2 tracking-wider">
        {unit}
      </div>
    </div>
  );
};
