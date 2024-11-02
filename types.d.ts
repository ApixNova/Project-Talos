// Typing for moodReducer
// export interface MoodAction {
//   type: string;
//   mood: number;
// }

import { DateData } from "react-native-calendars";
import { SharedValue } from "react-native-reanimated";

export type calendarProps = {
  props: {
    selectedDay: string;
    setSelectedDay: React.Dispatch<React.SetStateAction<string>>;
    open: SharedValue<boolean>;
  };
};

export type MoodPickerProps = {
  handlePress: (moodType: number) => void;
};

export type Moods = {
  [key: string]: number;
};

export type MoodOptionProps = {
  props: {
    text: string;
    handlePress(moodType: number): Promise<void> | void;
    type: number;
    style: {
      backgroundColor: string;
    };
    disable: boolean;
    setMoodUpdating: React.Dispatch<React.SetStateAction<boolean>>;
  };
};

export type SaveMoodProps = {
  props: {
    // moods: Moods;
    setMoods: (list: Moods) => void;
    selectedDay: string;
    open: SharedValue<boolean>;
  };
};

export type SerializedNote = {
  id: string;
  day: string;
  title: string;
  content: string;
  created_at: number;
  updated_at: number;
};

export type NoteProps = {
  props: {
    day: string;
    id: string;
  };
};

export type SettingProp = {
  id: string;
  type: string;
  value: string;
};

export type NewNoteCalendarProp = {
  props: {
    setNewNoteMenu: React.Dispatch<React.SetStateAction<boolean>>;
  };
};

export type PickerProps = {
  title: string;
  options: string[];
  state: string;
  setState: (value: string) => void;
};

export type OnMonthChangeProps = {
  date: DateData;
  moods: Moods;
  dispatch: ThunkDispatch<
    {
      moods: {
        value: Moods;
      };
      notes: never[];
      settings: never[];
    },
    undefined,
    UnknownAction
  > &
    Dispatch<UnknownAction>;
};

export type ReloadNotesProps = {
  dispatch: ThunkDispatch<
    {
      moods: {
        value: Moods;
      };
      notes: never[];
      settings: never[];
    },
    undefined,
    UnknownAction
  > &
    Dispatch<UnknownAction>;
};

const themeTypeList = [
  "background",
  "text",
  "primary",
  "secondary",
  "accent",
  "rose",
  "black",
  "gray",
  // "calendarBackground",
] as const;

type ThemeType = (typeof themeTypeList)[number];

export type AuthProps = {
  setLoginPressed(state: boolean): void;
  setAlert(message: string): void;
  mailConfirmationAlert(mail: string): void;
};

export type UserPageProps = {
  setAlert(message: string): void;
  alertOnSignout(signOut: () => Promise<void>): void;
};

type ChangesData = {
  notes: {
    created: [];
    deleted: string[];
    updated: {
      id: string;
      day: string;
      title: string;
      content: string;
      created_at: number;
      updated_at: number;
    }[];
  };
  feelings: {
    created: [];
    deleted: string[];
    updated: {
      id: string;
      day: string;
      type: number;
      created_at: number;
      updated_at: number;
    }[];
  };
};
