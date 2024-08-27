export type Category = {
  label: CategoryLabel;
  icon: string;
};

export type CategoryLabel =
  | "guitar"
  | "piano"
  | "ukelele"
  | "saxophone"
  | "drumming"
  | "keyboard"
  | "violin"
  | "flute"
  | "trumpet"
  | "cello";

export const categories: Category[] = [
  {
    label: "cello",
    icon: "/icons/cello.svg",
  },
  {
    label: "drumming",
    icon: "/icons/drum.svg",
  },
  {
    label: "flute",
    icon: "/icons/flute.svg",
  },
  {
    label: "guitar",
    icon: "/icons/guitar.svg",
  },
  {
    label: "keyboard",
    icon: "/icons/keyboard.svg",
  },
  {
    label: "piano",
    icon: "/icons/piano.svg",
  },
  {
    label: "saxophone",
    icon: "/icons/saxophone.svg",
  },
  {
    label: "trumpet",
    icon: "/icons/trumpet.svg",
  },
  {
    label: "ukelele",
    icon: "/icons/ukelele.svg",
  },
  {
    label: "violin",
    icon: "/icons/violin.svg",
  },
];
