"use client";

import { motion } from "framer-motion";
import { Clock, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState, useRef } from "react";
import { Button } from "./ui/Button";

interface QuizResult {
  date: string;
  bmr: number;
  proteinIntake: number;
  idealWeight: number;
  waterIntake: number;
}

export function QuizHistory() {
  const [history, setHistory] = useState<QuizResult[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('quiz-history');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('quiz-history');
    setHistory([]);
  };

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 right-4 z-50"
    >
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/90 backdrop-blur-sm hover:bg-white/95 text-gray-800 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
      >
        <Clock className="w-5 h-5 text-blue-600" />
        <span className="font-semibold">Histórico ({history.length})</span>
      </Button>

      {isOpen && (
        <div 
          ref={menuRef}
          className="absolute top-12 right-0 w-80 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-4 space-y-3 max-h-96 overflow-y-auto"
        >
          <div className="flex justify-end">
            <Button
              onClick={clearHistory}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          {history.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-3 shadow-sm border border-gray-100"
            >
              <p className="text-xs text-gray-500 mb-2">
                {format(new Date(result.date), "d 'de' MMMM 'às' HH:mm", {
                  locale: ptBR,
                })}
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-600">TMB</p>
                  <p className="font-semibold text-blue-600">
                    {result.bmr.toFixed(0)} kcal
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Proteína</p>
                  <p className="font-semibold text-green-600">
                    {result.proteinIntake.toFixed(1)}g
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Peso Ideal</p>
                  <p className="font-semibold text-purple-600">
                    {result.idealWeight.toFixed(1)}kg
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Água</p>
                  <p className="font-semibold text-orange-600">
                    {result.waterIntake.toFixed(1)}L
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
