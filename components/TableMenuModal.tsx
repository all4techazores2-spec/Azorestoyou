import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Search, Utensils, Coffee, Wine, Beer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Restaurant, OrderItem, Product, Dish } from '../types';

interface TableMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: Restaurant;
  tableId: string;
  reservationId: string;
  tableStatus: string;
  onPlaceOrder: (items: OrderItem[]) => void;
}

const CATEGORIES = ['Pratos', 'Bebidas', 'Cafetaria', 'Sobremesas', 'Vinhos'];

const TableMenuModal: React.FC<TableMenuModalProps> = ({ 
  isOpen, 
  onClose, 
  restaurant,
  tableId,
  reservationId,
  tableStatus,
  onPlaceOrder
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('Pratos');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  // Combine dishes and products
  const allItems: any[] = [
    ...(restaurant.dishes || []).map(d => ({ ...d, category: 'Pratos' })),
    ...(restaurant.products || [])
  ];

  const filteredItems = allItems.filter(item => 
    (activeCategory === 'Todos' || item.category === activeCategory) &&
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalAmount = cart.reduce((acc, item) => acc + (item.dish.price * item.quantity), 0);

  const updateQuantity = (itemObj: any, delta: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.dish.name === itemObj.name);
      if (existing) {
        if (existing.quantity + delta <= 0) {
           return prev.filter(i => i.dish.name !== itemObj.name);
        }
        return prev.map(i => i.dish.name === itemObj.name ? { ...i, quantity: i.quantity + delta } : i);
      } else if (delta > 0) {
        return [...prev, { dish: itemObj as Dish, quantity: 1 }];
      }
      return prev;
    });
  };

  const handleSubmit = () => {
    if (cart.length === 0) return;
    onPlaceOrder(cart);
    setCart([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-0 md:p-6">
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-white w-full h-full md:h-[90vh] md:max-w-4xl md:rounded-[3rem] shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white z-10">
           <div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Mesa #{tableId.replace('T','')}</p>
              <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Fazer Pedido Extra</h2>
           </div>
           <button 
             onClick={onClose} 
             className="p-3 bg-white text-slate-800 hover:bg-blue-600 hover:text-white rounded-full transition-all shadow-lg border border-slate-100 group"
           >
             <X size={20} className="group-active:scale-90 transition-transform" />
           </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
           {/* Menu Area */}
           <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
              <div className="p-4 bg-white border-b border-slate-100">
                 <div className="flex overflow-x-auto gap-2 pb-2 custom-scrollbar">
                    {CATEGORIES.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-5 py-2 rounded-2xl whitespace-nowrap text-xs font-black uppercase tracking-widest transition-all ${
                           activeCategory === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                         {cat}
                      </button>
                    ))}
                 </div>
                 <div className="relative mt-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      className="w-full bg-slate-100 border-none rounded-xl p-3 pl-11 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Pesquisar..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredItems.map((item, idx) => {
                       const cartItem = cart.find(c => c.dish.name === item.name);
                       return (
                         <div key={idx} className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm flex flex-col justify-between">
                            <div>
                               <div className="h-24 bg-slate-50 rounded-2xl mb-4 overflow-hidden flex items-center justify-center">
                                  {item.image ? (
                                     <img src={item.image} className="w-full h-full object-cover" />
                                  ) : (
                                     <Utensils className="text-slate-300 w-8 h-8" />
                                  )}
                               </div>
                               <h3 className="font-bold text-slate-800 text-sm mb-1">{item.name}</h3>
                               <p className="text-lg font-black text-blue-600">€{item.price.toFixed(2)}</p>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                               {cartItem ? (
                                  <div className="flex items-center gap-4 bg-slate-100 rounded-xl p-1">
                                     <button onClick={() => updateQuantity(item, -1)} className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center font-bold text-slate-600">-</button>
                                     <span className="font-black text-slate-800">{cartItem.quantity}</span>
                                     <button onClick={() => updateQuantity(item, 1)} className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center font-bold text-slate-600">+</button>
                                  </div>
                               ) : (
                                  <button onClick={() => updateQuantity(item, 1)} className="px-4 py-2 bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-blue-600 hover:text-white transition-all w-full text-center">
                                     Adicionar
                                  </button>
                               )}
                            </div>
                         </div>
                       )
                    })}
                 </div>
              </div>
           </div>

           {/* Cart Area */}
           <div className="w-full md:w-80 bg-white border-l border-slate-100 flex flex-col h-64 md:h-auto shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] md:shadow-none z-20">
              <div className="p-6 bg-slate-900 text-white rounded-t-3xl md:rounded-none">
                 <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2 mb-1">
                    <ShoppingBag size={16} className="text-blue-400" /> O seu pedido
                 </h3>
                 <p className="text-[10px] text-slate-400 font-medium">Será adicionado à conta da mesa</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                 {cart.length === 0 ? (
                    <div className="text-center py-10 opacity-50">
                       <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                       <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Cesto Vazio</p>
                    </div>
                 ) : (
                    cart.map((item, idx) => (
                       <div key={idx} className="flex justify-between items-center text-sm border-b border-slate-50 pb-3">
                          <div className="flex-1 min-w-0 pr-4">
                             <span className="font-black text-blue-600 mr-2">{item.quantity}x</span>
                             <span className="font-bold text-slate-700 truncate">{item.dish.name}</span>
                          </div>
                          <span className="font-black text-slate-900">€{(item.dish.price * item.quantity).toFixed(2)}</span>
                       </div>
                    ))
                 )}
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50">
                 <div className="flex justify-between items-end mb-4">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Extra</span>
                    <span className="text-2xl font-black text-slate-800">€{totalAmount.toFixed(2)}</span>
                 </div>
                 <button 
                   disabled={cart.length === 0 || tableStatus === 'available'}
                   onClick={handleSubmit}
                   className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                 >
                    {tableStatus === 'available' ? 'Mesa Não Ativa' : 'Confirmar Pedido'}
                 </button>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TableMenuModal;
