export interface Question {
  title: string;
  options?: string[];
  key: string;
  type?: "number" | "multiselect";
  placeholder?: string;
  image: string;
}

export interface QuizState {
  currentStep: number;
  answers: {
    activityLevel?: string;
    age?: number;
    goal?: string;
    height?: number;
    weight?: number;
    diet?: string;
    injuries?: string[];
    medicalConditions?: string[];
    dietaryRestrictions?: string[];
    supplementUse?: string;
    sleepHours?: number;
    stressLevel?: string;
  };
  setAnswer: (key: keyof QuizState["answers"], value: any) => void;
  nextStep: () => void;
  previousStep: () => void;
  reset: () => void;
  getNextQuestion: () => number;
}
