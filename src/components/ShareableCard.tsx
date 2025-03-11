"use client";

import { useEffect, useRef } from "react";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import { Share2, Download, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/Button";

interface ShareableCardProps {
  bmr: number;
  proteinIntake: number;
  idealWeight: number;
  waterIntake: number;
}

export function ShareableCard({ bmr, proteinIntake, idealWeight, waterIntake }: ShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const generateImage = async () => {
    if (cardRef.current) {
      try {
        const dataUrl = await toPng(cardRef.current, {
          quality: 1.0,
          backgroundColor: '#ffffff'
        });
        saveAs(dataUrl, 'meus-resultados-wellness.png');
      } catch (err) {
        console.error('Error generating image:', err);
      }
    }
  };

  const shareToTwitter = () => {
    const text = `Acabei de descobrir meus resultados de bem-estar!\n\nTMB: ${bmr.toFixed(0)} kcal/dia\nProteína: ${proteinIntake.toFixed(1)}g/dia\nPeso Ideal: ${idealWeight.toFixed(1)}kg\nÁgua: ${waterIntake.toFixed(1)}L/dia\n\nFaça o quiz você também!`;
    const url = 'https://wellness-quiz.com'; // Replace with your actual URL
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div
        ref={cardRef}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto"
        style={{
          backgroundImage: 'linear-gradient(135deg, #f6f9fc 0%, #ffffff 100%)',
        }}
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Meus Resultados de Bem-Estar</h2>
          <p className="text-gray-600">Análise Personalizada</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Taxa Metabólica Basal</h3>
            <p className="text-3xl font-bold text-blue-600">{bmr.toFixed(0)}<span className="text-lg ml-1">kcal/dia</span></p>
          </div>
          
          <div className="bg-green-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Proteína Recomendada</h3>
            <p className="text-3xl font-bold text-green-600">{proteinIntake.toFixed(1)}<span className="text-lg ml-1">g/dia</span></p>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Peso Ideal</h3>
            <p className="text-3xl font-bold text-purple-600">{idealWeight.toFixed(1)}<span className="text-lg ml-1">kg</span></p>
          </div>
          
          <div className="bg-orange-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Consumo de Água</h3>
            <p className="text-3xl font-bold text-orange-600">{waterIntake.toFixed(1)}<span className="text-lg ml-1">L/dia</span></p>
          </div>
        </div>

      </div>

      <motion.div 
        className="flex flex-col sm:flex-row justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={generateImage}
          className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 flex items-center gap-2"
        >
          <Download size={20} />
          Baixar Imagem
        </Button>
        <Button
          onClick={shareToTwitter}
          className="bg-[#1DA1F2] text-white px-6 py-3 rounded-lg hover:bg-[#1a8cd8] flex items-center gap-2"
        >
          <Twitter size={20} />
          Compartilhar
        </Button>
      </motion.div>
    </div>
  );
}
