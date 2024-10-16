import Setting from "../model/Setting";
import { ThemeType } from "../types";

export const moodColor = {
  black: "#0f0f0f",
  red: "#ab2b40",
  blue: "#2f1f94",
  green: "#3e9e5e",
};

export const paletteDark = {
  background: "#0c0414",
  text: "#eae9fc",
  primary: "#4650d8",
  // secondary: "#dc254a",
  // accent: "#8f97ea",
  secondary: "#8f97ea",
  accent: "#dc254a",
  rose: "#de5974",
  black: "black",
  gray: "#757272",
};

const paletteLight = {
  background: "#c6def1",
  text: "#0c0414",
  primary: "#4650d8",
  secondary: "#dc254a",
  accent: "#8f97ea",
  rose: "#de5974",
  black: "black",
  gray: "pink",
};

export function dynamicTheme(settings: Setting[], type: ThemeType) {
  if (getTheme(settings) == "Light") {
    return paletteLight[type];
  } else {
    return paletteDark[type];
  }
}

export function getTheme(settings: Setting[]) {
  const theme = settings.find((element) => element.type == "theme");
  return theme ? theme.value : "Dark";
}
