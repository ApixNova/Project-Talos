export type calendarProps = {
  props: {
    selectedDay: string;
    setSelectedDay: React.Dispatch<React.SetStateAction<string>>;
    moods: [string, number][];
  };
};

export type MoodPickerProps = {
  props: {
    selectedDay: string;
  };
};
