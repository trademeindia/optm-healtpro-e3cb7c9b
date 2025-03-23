
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Package, Zap, Server } from 'lucide-react';
import { PerformanceMetrics } from '../../types';
import { formatBytes, formatDuration } from '../../utils/formatters';

interface PerformanceMetricsCardsProps {
  metrics: PerformanceMetrics;
}

const PerformanceMetricsCards: React.FC<PerformanceMetricsCardsProps> = ({ metrics }) => {
  const cards = [
    {
      title: 'Latest Build Time',
      value: formatDuration(metrics.latestBuildTime),
      icon: Clock,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      change: metrics.buildTimeChange,
      changeLabel: metrics.buildTimeChange < 0 ? 'faster' : 'slower',
      isGoodWhenNegative: true
    },
    {
      title: 'Total Bundle Size',
      value: formatBytes(metrics.totalBundleSize),
      icon: Package,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      change: metrics.bundleSizeChange,
      changeLabel: metrics.bundleSizeChange < 0 ? 'smaller' : 'larger',
      isGoodWhenNegative: true
    },
    {
      title: 'Performance Score',
      value: `${metrics.performanceScore}/100`,
      icon: Zap,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      change: metrics.performanceScoreChange,
      changeLabel: metrics.performanceScoreChange > 0 ? 'better' : 'worse',
      isGoodWhenNegative: false
    },
    {
      title: 'Resource Usage',
      value: `${metrics.resourceUsage.cpu}% CPU`,
      secondaryValue: `${formatBytes(metrics.resourceUsage.memory)} RAM`,
      icon: Server,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={card.title}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">{card.title}</h3>
                <div className="text-2xl font-bold mt-1">{card.value}</div>
                {card.secondaryValue && (
                  <div className="text-sm text-muted-foreground">{card.secondaryValue}</div>
                )}
                {card.change !== undefined && (
                  <div className={`text-xs mt-1 flex items-center gap-1 ${
                    (card.isGoodWhenNegative && card.change < 0) || (!card.isGoodWhenNegative && card.change > 0)
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}>
                    <span>
                      {card.change > 0 ? '↑' : '↓'} {Math.abs(card.change)}% {card.changeLabel}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PerformanceMetricsCards;
