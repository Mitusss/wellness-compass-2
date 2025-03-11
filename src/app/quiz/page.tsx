"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useQuizStore, questions } from "@/store/quiz";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function QuizPage() {
  const {
    currentStep,
    answers,
    setAnswer,
    nextStep,
    previousStep
  } = useQuizStore();
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const currentQuestion = questions[currentStep];
  const handleNext = () => {
    // Special handling for multiselect questions
    if (currentQuestion.type === "multiselect") {
      const selectedOptions = answers[currentQuestion.key as keyof typeof answers] as string[] | undefined;
      if (!selectedOptions || selectedOptions.length === 0) {
        setError("Por favor, selecione pelo menos uma opção antes de continuar.");
        return;
      }
    } else if (!answers[currentQuestion.key as keyof typeof answers]) {
      setError("Por favor, responda a pergunta antes de continuar.");
      return;
    }
    setError("");
    if (currentStep === questions.length - 1) {
      try {
        localStorage.setItem('quizAnswers', JSON.stringify(answers));
        router.push("/results");
      } catch (error) {
        console.error('Error saving quiz answers:', error);
        setError("Ocorreu um erro ao salvar suas respostas. Por favor, tente novamente.");
      }
    } else {
      nextStep();
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10" style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2940')",
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }} />
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-4 sm:p-8 w-[95%] max-w-2xl z-10">
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full">
            <motion.div className="h-2 bg-blue-600 rounded-full" initial={{
            width: "0%"
          }} animate={{
            width: `${(currentStep + 1) / questions.length * 100}%`
          }} transition={{
            duration: 0.3
          }} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: -20
        }} className="space-y-6">
            <div className="mb-4">
              <div className="relative h-32 sm:h-48 mb-4 rounded-xl overflow-hidden">
                <img src={currentQuestion.image} alt={currentQuestion.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <h2 className="absolute bottom-4 left-4 text-xl sm:text-3xl font-bold text-white">
                  {currentQuestion.title}
                </h2>
              </div>
            </div>

            {currentQuestion.type === "number" ? <input type="number" className="w-full p-3 border rounded-lg" placeholder={currentQuestion.placeholder} value={String(answers[currentQuestion.key as keyof typeof answers] || "")} onChange={e => setAnswer(currentQuestion.key as keyof typeof answers, Number(e.target.value))} /> : currentQuestion.type === "multiselect" ? <div className="grid grid-cols-1 gap-4">
                {currentQuestion.options?.map(option => {
              const selectedOptions = answers[currentQuestion.key as keyof typeof answers] as string[] || [];
              const isSelected = selectedOptions.includes(option);
              return <button key={option} className={`p-4 rounded-lg border-2 transition-all ${isSelected ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`} onClick={() => {
                const currentSelected = selectedOptions;
                const newSelected = isSelected ? currentSelected.filter(item => item !== option) : [...currentSelected, option];
                setAnswer(currentQuestion.key as keyof typeof answers, newSelected);
              }}>
                      {option}
                    </button>;
            })}
              </div> : <div className="grid grid-cols-1 gap-4">
                {currentQuestion.options?.map(option => <button key={option} className={`p-4 rounded-lg border-2 transition-all ${answers[currentQuestion.key as keyof typeof answers] === option ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`} onClick={() => setAnswer(currentQuestion.key as keyof typeof answers, option)}>
                    {option}
                  </button>)}
              </div>}

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <div className="flex justify-between pt-6">
              <Button onClick={previousStep} disabled={currentStep === 0} className="px-6 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300">
                Anterior
              </Button>
              <Button onClick={handleNext} className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700">
                {currentStep === questions.length - 1 ? "Ver Resultados" : "Próxima"}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>;
}
