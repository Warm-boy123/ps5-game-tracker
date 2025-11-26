import React, { useState, useEffect } from 'react';
import { GameFormData, GameTransaction, ModalType } from '../types';
import { X, Save, DollarSign, Trash2, AlertTriangle } from 'lucide-react';

interface GameModalProps {
  isOpen: boolean;
  type: ModalType;
  initialData?: GameTransaction | null;
  onClose: () => void;
  onSave: (data: GameFormData) => void;
}

const initialFormState: GameFormData = {
  title: '',
  purchasePrice: '',
  purchaseDate: new Date().toISOString().split('T')[0],
  retailer: '',
  currentValue: '',
  salePrice: '',
  saleDate: new Date().toISOString().split('T')[0],
  salePlatform: '闲鱼',
  isSold: false,
};

const GameModal: React.FC<GameModalProps> = ({ isOpen, type, initialData, onClose, onSave }) => {
  const [formData, setFormData] = useState<GameFormData>(initialFormState);

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        title: initialData.title,
        purchasePrice: initialData.purchasePrice.toString(),
        purchaseDate: initialData.purchaseDate,
        retailer: initialData.retailer,
        currentValue: initialData.currentValue ? initialData.currentValue.toString() : '',
        salePrice: initialData.salePrice ? initialData.salePrice.toString() : '',
        saleDate: initialData.saleDate || new Date().toISOString().split('T')[0],
        salePlatform: initialData.salePlatform || '闲鱼',
        // Force isSold to true if in SELL mode, otherwise keep existing status
        isSold: type === ModalType.SELL ? true : initialData.isSold,
      });
    } else if (isOpen && !initialData) {
      setFormData(initialFormState);
    }
  }, [isOpen, initialData, type]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const isSellMode = type === ModalType.SELL;
  const isDeleteMode = type === ModalType.DELETE;
  
  let titleText = '新增游戏记录';
  let TitleIcon = Save;
  let titleColor = 'text-blue-500';

  if (isSellMode) {
    titleText = '卖出回血';
    TitleIcon = DollarSign;
    titleColor = 'text-green-500';
  } else if (isDeleteMode) {
    titleText = '删除记录';
    TitleIcon = Trash2;
    titleColor = 'text-red-500';
  } else if (type === ModalType.EDIT) {
    titleText = '编辑记录';
  }

  // If deleting, render a simplified confirmation view
  if (isDeleteMode) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-red-600 dark:text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">确认删除?</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              你确定要删除 <span className="font-bold text-slate-800 dark:text-slate-200">"{formData.title}"</span> 的记录吗？此操作无法撤销。
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={() => onSave(formData)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors font-medium shadow-lg shadow-red-500/20"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 transition-colors duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <TitleIcon className={titleColor} />
            {titleText}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Read-only info for Sell Mode */}
          {isSellMode && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 rounded-lg">
              <p className="text-sm text-blue-600 dark:text-blue-300">正在出售: <span className="font-bold text-slate-800 dark:text-white">{formData.title}</span></p>
              <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">当时购入: ¥{formData.purchasePrice}</p>
            </div>
          )}

          {/* Basic Info */}
          <div className={isSellMode ? 'hidden' : 'space-y-4'}>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">游戏名称</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                placeholder="例如: 艾尔登法环"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">购入价格 (¥)</label>
                <input
                  required
                  type="number"
                  min="0"
                  value={formData.purchasePrice}
                  onChange={e => setFormData({...formData, purchasePrice: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">当前二手参考价 (¥)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.currentValue}
                  onChange={e => setFormData({...formData, currentValue: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="可选, 用于估算回血"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">购入日期</label>
                <input
                  required
                  type="date"
                  value={formData.purchaseDate}
                  onChange={e => setFormData({...formData, purchaseDate: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">购买商家</label>
                <input
                  type="text"
                  value={formData.retailer}
                  onChange={e => setFormData({...formData, retailer: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="例如: 淘宝-XX电玩"
                />
              </div>
            </div>
          </div>

          {/* Sale Info - Shown if Sold or in Sell Mode */}
          {(isSellMode || formData.isSold) && (
             <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4 animate-in slide-in-from-top-4 duration-300">
                <div className="flex items-center justify-between">
                   <h3 className="text-green-600 dark:text-green-400 font-semibold text-sm uppercase tracking-wider">出售信息</h3>
                   {!isSellMode && (
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, isSold: false, salePrice: '', salePlatform: ''})}
                        className="text-xs text-red-500 hover:text-red-400 underline"
                      >
                        撤销出售状态
                      </button>
                   )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">卖出价格 (¥)</label>
                    <input
                      required={isSellMode || formData.isSold}
                      type="number"
                      min="0"
                      value={formData.salePrice}
                      onChange={e => setFormData({...formData, salePrice: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-green-200 dark:border-green-900/50 rounded-lg px-4 py-2 text-green-700 dark:text-green-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">卖出日期</label>
                    <input
                      required={isSellMode || formData.isSold}
                      type="date"
                      value={formData.saleDate}
                      onChange={e => setFormData({...formData, saleDate: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">交易平台/买家</label>
                  <input
                     required={isSellMode || formData.isSold}
                     type="text"
                     value={formData.salePlatform}
                     onChange={e => setFormData({...formData, salePlatform: e.target.value})}
                     className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                     placeholder="例如: 闲鱼, 朋友"
                  />
                </div>
             </div>
          )}

          <div className="pt-4 flex gap-3">
             <button
               type="button"
               onClick={onClose}
               className="flex-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors font-medium"
             >
               取消
             </button>
             <button
               type="submit"
               className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium text-white shadow-lg ${
                 isSellMode 
                 ? 'bg-green-600 hover:bg-green-500 shadow-green-500/20' 
                 : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'
               }`}
             >
               {isSellMode ? '确认卖出' : '保存记录'}
             </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default GameModal;