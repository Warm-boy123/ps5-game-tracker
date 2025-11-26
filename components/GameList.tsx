import React from 'react';
import { GameTransaction } from '../types';
import { Edit2, DollarSign, Trash2, Calendar, ShoppingBag, Tag, TrendingUp } from 'lucide-react';

interface GameListProps {
  games: GameTransaction[];
  onEdit: (game: GameTransaction) => void;
  onSell: (game: GameTransaction) => void;
  onDelete: (id: string) => void;
}

const GameList: React.FC<GameListProps> = ({ games, onEdit, onSell, onDelete }) => {
  if (games.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-100 dark:bg-slate-800/30 rounded-2xl border border-slate-300 dark:border-slate-700 border-dashed transition-colors duration-300">
        <p className="text-slate-500 dark:text-slate-400 text-lg">暂无游戏记录</p>
        <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">点击右上角 "+" 添加你的第一款游戏</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {games.map((game) => {
        const netCost = game.isSold ? game.purchasePrice - (game.salePrice || 0) : game.purchasePrice;
        
        return (
          <div 
            key={game.id} 
            className={`relative group bg-white dark:bg-slate-800 rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
              game.isSold 
                ? 'border-slate-200 dark:border-slate-700 opacity-80' 
                : 'border-slate-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500/50'
            }`}
          >
            {/* Status Badge */}
            <div className="absolute top-3 right-3">
              {game.isSold ? (
                <span className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 text-xs px-2 py-1 rounded-md border border-green-200 dark:border-green-800 font-medium">
                  已售出 ¥{game.salePrice}
                </span>
              ) : (
                <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 text-xs px-2 py-1 rounded-md border border-blue-200 dark:border-blue-800 font-medium">
                  持有中
                </span>
              )}
            </div>

            <div className="p-5">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 pr-16 truncate" title={game.title}>
                {game.title}
              </h3>

              <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={14} className="text-slate-400 dark:text-slate-500" />
                    <span>购入</span>
                  </div>
                  <span className="text-slate-700 dark:text-slate-200">¥{game.purchasePrice}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400 dark:text-slate-500" />
                    <span>日期</span>
                  </div>
                  <span className="text-slate-500 dark:text-slate-500 text-xs">{game.purchaseDate}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-slate-400 dark:text-slate-500" />
                    <span>渠道</span>
                  </div>
                  <span className="text-slate-500 dark:text-slate-500 text-xs truncate max-w-[120px]">{game.retailer}</span>
                </div>
                
                {game.isSold ? (
                  <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-700/50">
                    <div className="flex justify-between items-center text-green-600 dark:text-green-400/90">
                      <span>实际花费</span>
                      <span className="font-bold">¥{netCost}</span>
                    </div>
                  </div>
                ) : (
                  game.currentValue ? (
                    <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-700/50">
                      <div className="flex justify-between items-center text-blue-600 dark:text-blue-400/90">
                        <div className="flex items-center gap-2">
                          <TrendingUp size={14} />
                          <span>参考回血</span>
                        </div>
                        <span className="font-bold">¥{game.currentValue}</span>
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="bg-slate-50 dark:bg-slate-900/50 px-5 py-3 border-t border-slate-100 dark:border-slate-700/50 flex justify-between items-center rounded-b-xl">
               <div className="text-xs text-slate-500 dark:text-slate-600 font-mono">
                 {game.isSold ? game.salePlatform : 'Playing...'}
               </div>
               {/* Updated opacity: visible by default, only hover-based on medium screens and up */}
               <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                 {!game.isSold && (
                    <button 
                      onClick={() => onSell(game)}
                      className="p-1.5 hover:bg-green-100 dark:hover:bg-green-500/10 text-slate-400 hover:text-green-600 dark:hover:text-green-400 rounded-lg transition-colors"
                      title="出售"
                    >
                      <DollarSign size={16} />
                    </button>
                 )}
                 <button 
                   onClick={() => onEdit(game)}
                   className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-500/10 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors"
                   title="编辑"
                 >
                   <Edit2 size={16} />
                 </button>
                 <button 
                   onClick={(e) => {
                     e.stopPropagation(); // Stop propagation to prevent issues
                     onDelete(game.id);
                   }}
                   className="p-1.5 hover:bg-red-100 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors"
                   title="删除"
                 >
                   <Trash2 size={16} />
                 </button>
               </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GameList;