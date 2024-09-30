// Typing for moodReducer
// export interface MoodAction {
//   type: string;
//   mood: number;
// }

import { DateData } from "react-native-calendars";

export type calendarProps = {
  props: {
    selectedDay: string;
    setSelectedDay: React.Dispatch<React.SetStateAction<string>>;
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
  };
};

export type SaveMoodProps = {
  props: {
    moodPicker: boolean;
    setMoodPicker: React.Dispatch<React.SetStateAction<boolean>>;
    // moods: Moods;
    setMoods: (list: Moods) => void;
    selectedDay: string;
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
    editing: boolean;
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

export type NavigationType = {
  navigate: (path: "index") => void;
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
