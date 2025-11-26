import React, { useState, useEffect } from 'react';
import { GameTransaction, GameFormData, ModalType } from './types';
import StatsOverview from './components/StatsOverview';
import GameList from './components/GameList';
import GameModal from './components/GameModal';
import { analyzeSpendingHabits } from './services/geminiService';
import { Plus, Sparkles, Gamepad2, BrainCircuit, Sun, Moon } from 'lucide-react';

// Key for LocalStorage
const STORAGE_KEY = 'ps5_tracker_data_v1';
const THEME_KEY = 'ps5_tracker_theme';

const App: React.FC = () => {
  const [games, setGames] = useState<GameTransaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
  const [selectedGame, setSelectedGame] = useState<GameTransaction | null>(null);
  
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(THEME_KEY);
      return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
    }
    return 'dark';
  });

  // Apply theme class to html element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Load data on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setGames(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
  }, []);

  // Save data on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  }, [games]);

  const handleAddGame = () => {
    setSelectedGame(null);
    setModalType(ModalType.ADD);
    setIsModalOpen(true);
  };

  const handleEditGame = (game: GameTransaction) => {
    setSelectedGame(game);
    setModalType(ModalType.EDIT);
    setIsModalOpen(true);
  };

  const handleSellGame = (game: GameTransaction) => {
    setSelectedGame(game);
    setModalType(ModalType.SELL);
    setIsModalOpen(true);
  };

  const handleDeleteGame = (id: string) => {
    const game = games.find(g => g.id === id);
    if (game) {
      setSelectedGame(game);
      setModalType(ModalType.DELETE);
      setIsModalOpen(true);
    }
  };

  const handleSaveGame = (data: GameFormData) => {
    if (modalType === ModalType.DELETE) {
      if (selectedGame) {
        setGames(prev => prev.filter(g => g.id !== selectedGame.id));
      }
      setIsModalOpen(false);
      return;
    }

    if (modalType === ModalType.ADD) {
      const newGame: GameTransaction = {
        id: crypto.randomUUID(),
        title: data.title,
        purchasePrice: parseFloat(data.purchasePrice),
        purchaseDate: data.purchaseDate,
        retailer: data.retailer,
        currentValue: data.currentValue ? parseFloat(data.currentValue) : undefined,
        isSold: false,
        createdAt: Date.now()
      };
      setGames(prev => [newGame, ...prev]);
    } else if (modalType === ModalType.EDIT || modalType === ModalType.SELL) {
      if (!selectedGame) return;
      
      const updatedGame: GameTransaction = {
        ...selectedGame,
        title: data.title,
        purchasePrice: parseFloat(data.purchasePrice),
        purchaseDate: data.purchaseDate,
        retailer: data.retailer,
        currentValue: data.currentValue ? parseFloat(data.currentValue) : undefined,
        isSold: data.isSold,
        // Only add sale details if marked as sold
        ...(data.isSold ? {
           salePrice: parseFloat(data.salePrice),
           saleDate: data.saleDate,
           salePlatform: data.salePlatform
        } : {
           salePrice: undefined,
           saleDate: undefined,
           salePlatform: undefined
        })
      };
      
      setGames(prev => prev.map(g => g.id === selectedGame.id ? updatedGame : g));
    }
    
    setIsModalOpen(false);
  };

  const handleAIAnalysis = async () => {
    if (games.length === 0) return;
    setIsAnalyzing(true);
    setShowAnalysis(true);
    const result = await analyzeSpendingHabits(games);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500 selection:text-white pb-20 transition-colors duration-300">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
                <Gamepad2 size={24} className="text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">PS5 <span className="text-blue-600 dark:text-blue-500">账本</span></h1>
            </div>
            <div className="flex gap-2 items-center">
               <button
                 onClick={toggleTheme}
                 className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors mr-1"
                 title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
               >
                 {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
               </button>
               
               <button
                 onClick={handleAIAnalysis}
                 disabled={isAnalyzing || games.length === 0}
                 className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-300 bg-purple-100 dark:bg-purple-500/10 hover:bg-purple-200 dark:hover:bg-purple-500/20 rounded-full transition-all border border-purple-200 dark:border-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {isAnalyzing ? <span className="animate-pulse">思考中...</span> : (
                   <>
                     <Sparkles size={16} />
                     <span className="hidden sm:inline">AI 账单分析</span>
                   </>
                 )}
               </button>
               <button 
                 onClick={handleAddGame}
                 className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-full transition-all shadow-lg shadow-blue-500/20"
               >
                 <Plus size={18} />
                 <span className="hidden sm:inline">记一笔</span>
               </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Statistics */}
        <StatsOverview games={games} />

        {/* AI Analysis Result Section */}
        {showAnalysis && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
             <div className="bg-gradient-to-br from-white to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-purple-200 dark:border-purple-500/30 p-6 relative overflow-hidden shadow-sm dark:shadow-none">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <BrainCircuit size={100} className="text-purple-500" />
                </div>
                <div className="flex justify-between items-start relative z-10">
                  <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-4 flex items-center gap-2">
                     <Sparkles size={18} /> Gemini 财务洞察
                  </h3>
                  <button onClick={() => setShowAnalysis(false)} className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
                    关闭
                  </button>
                </div>
                
                {isAnalyzing ? (
                   <div className="space-y-3 animate-pulse">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                   </div>
                ) : (
                   <div className="prose prose-slate dark:prose-invert prose-sm max-w-none text-slate-700 dark:text-slate-300">
                      {/* Very simple markdown rendering or just text preserving whitespace */}
                      <div className="whitespace-pre-wrap leading-relaxed">
                         {aiAnalysis}
                      </div>
                   </div>
                )}
             </div>
          </div>
        )}

        {/* Game List */}
        <div className="flex items-center justify-between mb-6">
           <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">购买记录</h2>
           <span className="text-sm text-slate-500">{games.length} 款游戏</span>
        </div>
        
        <GameList 
          games={games} 
          onEdit={handleEditGame} 
          onSell={handleSellGame} 
          onDelete={handleDeleteGame}
        />
      </main>

      <GameModal 
        isOpen={isModalOpen}
        type={modalType}
        initialData={selectedGame}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveGame}
      />
    </div>
  );
};

export default App;