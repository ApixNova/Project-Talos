// Typing for moodReducer
// export interface MoodAction {
//   type: string;
//   mood: number;
// }

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

export type Note = {
  id: string;
  date: string;
  mood: number;
  title: string;
  content: string;
  createdAt: number;
};

export type NoteProps = {
  props: {
    day: string;
    editing: boolean;
    id: string;
  };
};
