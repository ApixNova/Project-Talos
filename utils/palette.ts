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
  primary: "#2731b9",
  secondary: "#8f97ea",
  accent: "#dc254a",
  rose: "#de5974",
  black: "black",
  gray: "#757272",
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
