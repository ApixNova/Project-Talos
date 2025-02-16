import { Calendar } from "react-native-calendars";
import Setting from "../model/Setting";
import { ThemeType } from "../types";

export const moodColor = {
  black: "#0f0f0f",
  red: "#ab2b40",
  gray: "#595959",
  blue: "#2f1f94",
  green: "#3e9e5e",
};

export const paletteDark = {
  background: "#0c0414",
  text: "#eae9fc",
  primary: "#4650d8",
  secondary: "#8f97ea",
  accent: "#dc254a",
  rose: "#de5974",
  black: "black",
  gray: "#757272",
  // calendarBackground: "#7d7bb3",
};

const paletteLight = {
  background: "#d6e6ff",
  text: "#040316",
  primary: "#2731b9",
  secondary: "#8f97ea",
  accent: "#dc254a",
  rose: "#de5974",
  black: "black",
  gray: "#757272",
  // calendarBackground: "pink",
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
