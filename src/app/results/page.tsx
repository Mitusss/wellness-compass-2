"use client";

import { useQuizStore } from "@/store/quiz";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ShareableCard } from "@/components/ShareableCard";

const calculateBMR = (weight: number, height: number, age: number) => {
  // Harris-Benedict Formula
  return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
};

const calculateProteinFactor = (activityLevel: string) => {
  const factors = {
    "Sedentário": { factor: 0.8, calories: 1.2 },
    "Levemente ativo": { factor: 1.0, calories: 1.375 },
    "Moderadamente ativo": { factor: 1.2, calories: 1.55 },
    "Muito ativo": { factor: 1.6, calories: 1.725 },
  };
  return factors[activityLevel as keyof typeof factors] || { factor: 1.0, calories: 1.2 };
};

const calculateIdealWeight = (height: number) => {
  return (height - 100) * 0.9;
};

const calculateWaterIntake = (weight: number) => {
  return weight * 35;
};

export default function ResultsPage() {
  const { answers } = useQuizStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const loadAnswers = () => {
      try {
        const savedAnswers = localStorage.getItem('quizAnswers');
        if (!savedAnswers) {
          router.push("/quiz");
          return;
        }

        const parsedAnswers = JSON.parse(savedAnswers);
        
        // Validate all required fields
        const requiredFields = [
          'weight', 'height', 'age', 'activityLevel', 
          'goal', 'dietaryRestrictions'
        ];
        
        const missingFields = requiredFields.filter(field => {
          if (field === 'dietaryRestrictions') {
            return !Array.isArray(parsedAnswers[field]);
          }
          return !parsedAnswers[field];
        });

        if (missingFields.length > 0) {
          console.error('Missing required fields:', missingFields);
          router.push("/quiz");
          return;
        }

        useQuizStore.setState(state => ({
          answers: { ...state.answers, ...parsedAnswers }
        }));
      } catch (error) {
        console.error('Error loading quiz answers:', error);
        router.push("/quiz");
      }
    };

    loadAnswers();
  }, [router]);

  useEffect(() => {
    if (!mounted) return;
    
    if (!answers.weight || !answers.height || !answers.age || !answers.activityLevel) {
      router.push("/quiz");
      return;
    }

    const bmr = calculateBMR(answers.weight, answers.height, answers.age);
    const activityFactors = calculateProteinFactor(answers.activityLevel);
    const idealWeight = calculateIdealWeight(answers.height);
    const waterIntake = calculateWaterIntake(answers.weight);

    const newResult = {
      date: new Date().toISOString(),
      bmr,
      proteinIntake: answers.weight * activityFactors.factor,
      idealWeight,
      waterIntake: waterIntake / 1000
    };

    try {
      const history = JSON.parse(localStorage.getItem('quiz-history') || '[]');
      localStorage.setItem('quiz-history', JSON.stringify([newResult, ...history].slice(0, 10)));
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  }, [mounted, answers]);

  if (!mounted) return null;

  if (!answers.weight || !answers.height || !answers.age || !answers.activityLevel || !answers.goal) {
    router.push("/quiz");
    return null;
  }

  const bmr = calculateBMR(answers.weight, answers.height, answers.age);
  const activityFactors = calculateProteinFactor(answers.activityLevel);
  const proteinFactor = activityFactors.factor;
  const calorieMultiplier = activityFactors.calories;
  const idealWeight = calculateIdealWeight(answers.height);
  const waterIntake = calculateWaterIntake(answers.weight);
  const weightDifference = answers.weight - idealWeight;
  const dailyCalories = bmr * calorieMultiplier;
  
  const goalAdjustedCalories = answers.goal === "Perder peso" 
    ? dailyCalories - 500 
    : answers.goal === "Ganhar peso" 
      ? dailyCalories + 500 
      : dailyCalories;

  const nutritionSuggestions = {
    "Perder peso": [
      "Priorize proteínas magras e vegetais",
      "Evite carboidratos refinados",
      "Faça 5-6 refeições menores por dia",
      "Inclua fibras em todas as refeições"
    ],
    "Ganhar peso": [
      "Aumente o consumo de proteínas e carboidratos complexos",
      "Adicione gorduras boas como abacate e oleaginosas",
      "Faça refeições maiores e mais frequentes",
      "Consuma shakes proteicos entre as refeições"
    ],
    "Manter peso": [
      "Mantenha uma dieta balanceada",
      "Distribua macronutrientes igualmente",
      "Mantenha horários regulares de refeição",
      "Varie as fontes de proteína"
    ]
  };

  const ResultCard = ({ title, value, unit, description }: { 
    title: string; 
    value: number; 
    unit: string;
    description: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 transform hover:scale-105 transition-transform duration-300"
    >
      <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-blue-600 mb-2">
        {value.toFixed(1)} <span className="text-lg text-gray-500">{unit}</span>
      </p>
      <p className="text-sm text-gray-600">{description}</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-8 relative overflow-hidden">
      <div 
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2940')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="max-w-4xl mx-auto z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">Seus Resultados</h1>
          <p className="text-base sm:text-lg text-gray-600">
            Com base nas suas respostas, aqui estão suas recomendações personalizadas
          </p>
        </motion.div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <ResultCard
              title="Taxa Metabólica Basal"
              value={bmr}
              unit="kcal/dia"
              description="Energia necessária para manter funções vitais em repouso"
            />
            <ResultCard
              title="Calorias Diárias Recomendadas"
              value={goalAdjustedCalories}
              unit="kcal/dia"
              description={`Ajustado para seu objetivo de ${answers.goal.toLowerCase()}`}
            />
            <ResultCard
              title="Proteína Recomendada"
              value={answers.weight * proteinFactor}
              unit="g/dia"
              description="Baseado no seu nível de atividade física"
            />
            <ResultCard
              title="Consumo de Água"
              value={waterIntake / 1000}
              unit="L/dia"
              description="Para manter-se bem hidratado"
            />
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Controle de Peso
            </h3>
            <p className="text-sm text-gray-500 mb-4 italic">
              * O peso ideal é apenas uma estimativa baseada em fórmulas gerais. O peso saudável pode variar significativamente dependendo da sua composição corporal, massa muscular, estrutura óssea e outros fatores individuais. Consulte um profissional de saúde para uma avaliação personalizada.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="flex-1">
                <p className="text-gray-600 mb-2">Peso Atual</p>
                <p className="text-2xl font-bold text-blue-600">{answers.weight} kg</p>
              </div>
              <div className="flex-1">
                <p className="text-gray-600 mb-2">Peso Ideal</p>
                <p className="text-2xl font-bold text-green-600">{idealWeight.toFixed(1)} kg</p>
              </div>
              <div className="flex-1">
                <p className="text-gray-600 mb-2">Diferença</p>
                <p className={`text-2xl font-bold ${weightDifference > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                  {Math.abs(weightDifference).toFixed(1)} kg
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Sugestões Nutricionais
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {nutritionSuggestions[answers.goal as keyof typeof nutritionSuggestions]?.map((suggestion, index) => (
                <div key={index} className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  {suggestion}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 mb-8">
          <ShareableCard
            bmr={bmr}
            proteinIntake={answers.weight * proteinFactor}
            idealWeight={idealWeight}
            waterIntake={waterIntake / 1000}
          />
        </div>

        <div className="text-center mt-8">
          <Button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar ao Início
          </Button>
        </div>
      </div>
    </div>
  );
}
