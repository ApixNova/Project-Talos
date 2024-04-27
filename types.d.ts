export type calendarProps = {
  props: {
    selectedDay: string;
    setSelectedDay: React.Dispatch<React.SetStateAction<string>>;
    moods: Moods;
  };
};

export type MoodPickerProps = {
  props: {
    selectedDay: string;
    setMoods: React.Dispatch<React.SetStateAction<Moods>>;
    moods: Moods;
    setMoodPicker: React.Dispatch<React.SetStateAction<boolean>>;
  };
};

export type Moods = {
  [key: string]: number;
};

export type MoodOptionProps = {
  props: {
    text: string;
    handlePress(moodType: number): Promise<void>;
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
    moods: Moods;
    setMoods: React.Dispatch<React.SetStateAction<Moods>>;
    selectedDay: string;
  };
};
