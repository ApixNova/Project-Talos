import Setting from "../model/Setting";
import { ThemeType } from "../types";

export const moodColor = {
  black: "#100F0F",
  red: "#BD394E",
  gray: "#595959",
  blue: "#312198",
  green: "#33A95A",
};

export const paletteDark = {
  background: "#120B28",
  text: "#EAE9FC",
  primary: "#8F97EA",
  secondary: "#4650d8",
  accent: "#DC254A",
  rose: "#F4BFCC",
  black: "black",
  gray: "#757272",
};

const paletteLight = {
  background: "#d6e6ff",
  text: "#040316",
  primary: "#8f97ea",
  secondary: "#2731b9",
  accent: "#dc254a",
  rose: "#de5974",
  black: "black",
  gray: "#757272",
};

export function dynamicTheme(
  settings: Setting[],
  type: ThemeType,
  opacity?: number
) {
  const theme = getTheme(settings);
  let alpha = "";
  if (opacity !== undefined) {
    const clampedOpacity = Math.min(Math.max(opacity, 0), 100);
    // converting from percentage to a value in range 0-255
    alpha = Math.round((clampedOpacity * 255) / 100)
      .toString(16)
      .padStart(2, "0");
  }
  return (theme === "Light" ? paletteLight[type] : paletteDark[type]) + alpha;
}

export function getTheme(settings: Setting[]) {
  const theme = settings.find((element) => element.type == "theme");
  return theme ? theme.value : "Dark";
}
