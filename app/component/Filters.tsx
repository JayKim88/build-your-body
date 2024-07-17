import Image from "next/image";

export const Filters = ({
  onSelect,
  selected,
}: {
  onSelect: (v: string) => void;
  selected?: string;
}) => {
  const Chip = ({
    title,
    src,
    selectedColor,
  }: {
    title: string;
    src: string;
    selectedColor: string;
  }) => {
    const isSelected = selected === title;

    return (
      <button
        onClick={() => {
          onSelect(title);
        }}
        className={`${isSelected ? selectedColor : "bg-gray2"}
        } flex items-center justify-center gap-2 rounded-[32px] py-2 px-4 text-[20px] ${
          isSelected ? "" : "hover:bg-gray6 hover:text-black"
        }  
        `}
      >
        <Image src={src} width={24} height={24} alt={title} />
        <span>{title}</span>
      </button>
    );
  };

  return (
    <section className="w-[1100px] flex overflow-auto">
      <Chip
        title="Chest"
        src="/filter-icon/chest.png"
        selectedColor="bg-lightRed"
      />
    </section>
  );
};
