import React, { useMemo } from 'react';
import { GameTransaction, Stats } from '../types';
import { Wallet, ShoppingBag, RotateCcw, Calculator } from 'lucide-react';

interface StatsOverviewProps {
  games: GameTransaction[];
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ games }) => {
  const stats: Stats = useMemo(() => {
    let totalSpent = 0;
    let totalRecovered = 0;
    let soldCount = 0;
    let totalUnsoldCurrentValue = 0;

    games.forEach(game => {
      totalSpent += game.purchasePrice;
      if (game.isSold && game.salePrice) {
        totalRecovered += game.salePrice;
        soldCount++;
      } else if (!game.isSold && game.currentValue) {
        totalUnsoldCurrentValue += game.currentValue;
      }
    });

    const netCost = totalSpent - totalRecovered;
    const gameCount = games.length;
    
    // Projected Cost = Total Spent - (Total Recovered + Potential Recovery from unsold games)
    // Effectively: Net Cost - Total Value of Unsold Games
    const projectedCost = netCost - totalUnsoldCurrentValue;

    return {
      totalSpent,
      totalRecovered,
      netCost,
      gameCount,
      soldCount,
      projectedCost
    };
  }, [games]);

  const StatCard = ({ title, value, subValue, icon: Icon, colorClass }: any) => {
    // Extract text color class (e.g., 'text-blue-500') to use for the large background icon
    // This prevents the background color (e.g., 'bg-blue-500') from creating a box
    const textColor = colorClass.split(' ').find((c: string) => c.startsWith('text-')) || 'text-slate-500';

    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-lg relative overflow-hidden group transition-colors duration-300">
        {/* Large background watermark icon - use only text color */}
        <div className={`absolute -right-4 -top-4 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-300 ${textColor}`}>
          <Icon size={80} />
        </div>
        
        <div className="flex items-center gap-3 mb-2 relative z-10">
          {/* Small icon with background badge - uses full colorClass for bg and text */}
          <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10 dark:bg-opacity-20`}>
            <Icon size={20} className={colorClass.replace('bg-', 'text-')} />
          </div>
          <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</span>
        </div>
        
        <div className="flex flex-col relative z-10">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">¥{value.toFixed(0)}</span>
          {subValue && <span className="text-xs text-slate-500 dark:text-slate-500 mt-1">{subValue}</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatCard 
        title="总支出" 
        value={stats.totalSpent} 
        subValue={`共购买 ${stats.gameCount} 款游戏`}
        icon={ShoppingBag}
        colorClass="text-blue-500 bg-blue-500"
      />
      <StatCard 
        title="已回血" 
        value={stats.totalRecovered} 
        subValue={`已卖出 ${stats.soldCount} 款游戏`}
        icon={RotateCcw}
        colorClass="text-green-500 bg-green-500"
      />
      <StatCard 
        title="实际花费" 
        value={stats.netCost} 
        subValue="净支出 (支出 - 回血)"
        icon={Wallet}
        colorClass="text-purple-500 bg-purple-500"
      />
      <StatCard 
        title="预计花销" 
        value={stats.projectedCost} 
        subValue="若全部卖出(按二手价)"
        icon={Calculator}
        colorClass="text-orange-500 bg-orange-500"
      />
    </div>
  );
};

export default StatsOverview;