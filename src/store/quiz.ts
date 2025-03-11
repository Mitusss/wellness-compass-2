"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Question, QuizState } from "@/types/quiz";

export const questions: Question[] = [{
  title: "Qual é o seu nível de atividade física?",
  options: ["Sedentário", "Levemente ativo", "Moderadamente ativo", "Muito ativo"],
  key: "activityLevel",
  image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2940"
}, {
  title: "Você tem alguma lesão ou limitação física?",
  type: "multiselect",
  key: "injuries",
  options: ["Joelho", "Costas", "Ombro", "Nenhuma"],
  image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2940"
}, {
  title: "Qual é a sua idade?",
  type: "number",
  key: "age",
  placeholder: "Digite sua idade",
  image: "https://picsum.photos/200"
}, {
  title: "Você tem alguma condição médica?",
  type: "multiselect",
  key: "medicalConditions",
  options: ["Hipertensão", "Diabetes", "Colesterol Alto", "Nenhuma"],
  image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2940"
}, {
  title: "Você usa suplementos alimentares?",
  key: "supplementUse",
  options: ["Sim, regularmente", "Às vezes", "Não"],
  image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2940"
}, {
  title: "Qual é o seu objetivo?",
  options: ["Manter peso", "Perder peso", "Ganhar peso"],
  key: "goal",
  image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=2940"
}, {
  title: "Quantas horas você dorme por noite em média?",
  type: "number",
  key: "sleepHours",
  placeholder: "Digite o número de horas",
  image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=2940"
}, {
  title: "Como você avalia seu nível de estresse?",
  key: "stressLevel",
  options: ["Baixo", "Moderado", "Alto"],
  image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=2940"
}, {
  title: "Qual é a sua altura? (cm)",
  type: "number",
  key: "height",
  placeholder: "Digite sua altura em centímetros",
  image: "https://images.unsplash.com/photo-1588286840104-8957b019727f?q=80&w=2940"
}, {
  title: "Qual é o seu peso? (kg)",
  type: "number",
  key: "weight",
  placeholder: "Digite seu peso em quilos",
  image: "https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=2940"
}, {
  title: "Você tem restrições alimentares?",
  type: "multiselect",
  key: "dietaryRestrictions",
  options: ["Vegetariano", "Vegano", "Sem Glúten", "Sem Lactose", "Nenhuma"],
  image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2940"
}];



export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      answers: {} as QuizState["answers"],
      setAnswer: (key, value) =>
        set((state) => ({
          answers: { ...state.answers, [key]: value },
        })),
      nextStep: () =>
        set((state) => ({
          currentStep: get().getNextQuestion(),
        })),
      previousStep: () =>
        set((state) => ({
          currentStep: Math.max(0, state.currentStep - 1),
        })),
      reset: () =>
        set({
          currentStep: 0,
          answers: {},
        }),
      getNextQuestion: () => {
        const { currentStep } = get();
        return currentStep + 1;
      },
    }),
    {
      name: 'quiz-storage',
    }
  )
);
