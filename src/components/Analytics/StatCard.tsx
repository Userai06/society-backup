import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, subtitle }) => {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-900
                    rounded-xl shadow-lg border border-gray-700 dark:border-gray-700 p-6
                    hover:shadow-xl hover:border-blue-500 dark:hover:border-blue-500
                    transition-all duration-300 transform hover:scale-105">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 dark:text-gray-400 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-white dark:text-white mb-1">{value}</p>
          {subtitle && (
            <p className="text-gray-500 dark:text-gray-500 text-xs">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
