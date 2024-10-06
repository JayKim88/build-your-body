import type { Config } from "tailwindcss";
import { PluginAPI } from "tailwindcss/types/config";

export const colors = {
  black: "#000000",
  gray0: "#222222",
  gray1: "#333333",
  gray2: "#4F4F4F",
  gray4: "#BDBDBD",
  gray6: "#F2F2F2",
  red: "red",
  lightRed: "#EB5757",
  green: "#27AE60",
  lightGreen: "#6FCF97",
  softGreen: "#74CF8F",
  realGreen: "#00DE09",
  yellow: "#FFD600",
  blue: "#2F80ED",
  purple: "#B149D2",
  orange: "#F2994A",
  transparent: "transparent",
} as const;

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors,
    extend: {
      fontSize: {
        fluid: "clamp(6rem, 7vw + 1rem, 7.4rem)",
      },
      keyframes: {
        heartBeat: {
          "0%, 100%": {
            transform: "scale(1.0)",
          },
          "50%": {
            transform: "scale(1.4)",
          },
        },
      },
      animation: {
        heartBeat: "heartBeat 1s infinite",
      },
    },
  },
  plugins: [
    function ({ addUtilities }: PluginAPI) {
      const newUtilities = {
        ".text-stroke-1": {
          "-webkit-text-stroke-width": "1px",
        },
        ".text-stroke-2": {
          "-webkit-text-stroke-width": "2px",
        },
        ".text-stroke-3": {
          "-webkit-text-stroke-width": "3px",
        },
        ".text-stroke-4": {
          "-webkit-text-stroke-width": "4px",
        },
        ".text-stroke-red": {
          "-webkit-text-stroke-color": "red",
        },
        ".text-stroke-blue": {
          "-webkit-text-stroke-color": "blue",
        },
        ".text-stroke-black": {
          "-webkit-text-stroke-color": "black",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
export default config;
