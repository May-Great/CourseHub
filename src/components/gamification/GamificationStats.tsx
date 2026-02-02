import React from 'react';
import { Trophy, Zap, Award, Target } from 'lucide-react';

interface GamificationStatsProps {
  points: number;
  streak: number;
  achievementsCount: number;
}

export const GamificationStats: React.FC<GamificationStatsProps> = ({ points, streak, achievementsCount }) => {
  const level = Math.floor(points / 1000) + 1;
  const progressToNextLevel = (points % 1000) / 10; // 0-100

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
          <Trophy className="w-6 h-6" />
        </div>
        <div>
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Баллы</div>
          <div className="text-2xl font-bold text-slate-900">{points}</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
          <Target className="w-6 h-6" />
        </div>
        <div>
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Уровень {level}</div>
          <div className="w-24 h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
              style={{ width: `${progressToNextLevel}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
          <Zap className="w-6 h-6" />
        </div>
        <div>
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Серия</div>
          <div className="text-2xl font-bold text-slate-900">{streak} дней</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
          <Award className="w-6 h-6" />
        </div>
        <div>
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Награды</div>
          <div className="text-2xl font-bold text-slate-900">{achievementsCount}</div>
        </div>
      </div>
    </div>
  );
};
