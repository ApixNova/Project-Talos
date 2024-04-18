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
  };
};

export type Moods = {
  [key: string]: number;
};
