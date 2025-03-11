"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { Activity, Dumbbell, Scale, Droplets, ChevronRight } from "lucide-react";
import { QuizHistory } from "@/components/QuizHistory";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-8 relative overflow-hidden">
      <QuizHistory />
      <div 
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?q=80&w=3540')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="max-w-5xl w-full mx-auto z-10 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/90 backdrop-blur-sm p-12 rounded-3xl shadow-2xl"
        >
          <motion.h1 
            className="text-3xl sm:text-6xl font-bold text-gray-800 mb-4 sm:mb-8 leading-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Transforme sua
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Jornada de Bem-Estar
            </span>
          </motion.h1>
          <p className="text-base sm:text-xl text-gray-600 mb-4 sm:mb-8 leading-relaxed">
            Através do nosso quiz personalizado, você receberá:
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Taxa Metabólica Basal</h3>
                <p className="text-gray-600">Descubra quantas calorias seu corpo necessita diariamente</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <Dumbbell className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Proteína Ideal</h3>
                <p className="text-gray-600">Calcule sua necessidade proteica baseada em seu nível de atividade</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Scale className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Peso Ideal</h3>
                <p className="text-gray-600">Saiba seu peso ideal e receba dicas personalizadas</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Droplets className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Hidratação</h3>
                <p className="text-gray-600">Calcule sua necessidade diária de água</p>
              </div>
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => router.push("/quiz")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-xl font-semibold shadow-lg w-full"
            >
              Começar o Quiz
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
