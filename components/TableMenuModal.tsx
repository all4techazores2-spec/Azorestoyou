import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Search, Utensils, Coffee, Wine, Beer, Sparkles, ChefHat, ChevronRight } from 'lucide-react';
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

const CATEGORIES = ['Todos', 'Pratos', 'Bebidas', 'Cafetaria', 'Sobremesas', 'Vinhos'];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Todos': <ShoppingBag size={14} />,
  'Pratos': <Utensils size={14} />,
  'Bebidas': <Beer size={14} />,
  'Cafetaria': <Coffee size={14} />,
  'Sobremesas': <Sparkles size={14} />,
  'Vinhos': <Wine size={14} />
};

const TableMenuModal: React.FC<TableMenuModalProps> = ({ 
  isOpen, 
  onClose, 
  restaurant,
  tableId,
  reservationId,
  tableStatus,
  onPlaceOrder
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [search, setSearch] = useState('');
  const [step, setStep] = useState<'menu' | 'review'>('menu');

  if (!isOpen) return null;

  // Combine dishes and products
  const allItems: any[] = [
    ...(restaurant.dishes || []).map(d => ({ ...d, category: d.category || 'Pratos' })),
    ...(restaurant.products || []).map(p => ({ ...p, category: p.category || 'Bebidas' }))
  ];

  const filteredItems = allItems.filter(item => 
    (activeCategory === 'Todos' || item.category === activeCategory) &&
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalAmount = cart.reduce((acc, item) => acc + (item.dish.price * item.quantity), 0);
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

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
    setStep('menu');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center bg-slate-955/85 backdrop-blur-md p-0 md:p-6">
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 250 }}
        className="bg-slate-900 text-white w-full h-[92vh] md:h-[85vh] md:max-w-md md:rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border-t md:border border-slate-800"
      >
        {/* TOP BAR / HEADER */}
        <div className="px-6 py-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between z-10">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                <ChefHat size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">Mesa #{tableId.replace('T','')}</p>
                <h2 className="text-lg font-black tracking-tight leading-none mt-0.5">Mobile POS</h2>
              </div>
           </div>
           <button 
             onClick={onClose} 
             className="w-10 h-10 bg-slate-800 text-slate-400 hover:text-white rounded-full flex items-center justify-center transition-all border border-slate-700/50 hover:bg-slate-700"
           >
             <X size={18} />
           </button>
        </div>

        {/* STEP 1: MENU AND CART ADDING */}
        <AnimatePresence mode="wait">
          {step === 'menu' ? (
            <motion.div 
              key="menu"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 flex flex-col min-h-0 overflow-hidden"
            >
              {/* CATEGORIES & SEARCH */}
              <div className="p-5 bg-slate-900 border-b border-slate-800 space-y-4">
                 <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input 
                      className="w-full bg-slate-800/50 border border-slate-800 rounded-xl py-3.5 pl-11 pr-4 text-xs font-bold text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      placeholder="Pesquisar pratos ou bebidas..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                 </div>
                 
                 {/* Category Scroll Bar */}
                 <div className="flex overflow-x-auto gap-2 pb-1.5 custom-scrollbar">
                    {CATEGORIES.map(cat => {
                      const isActive = activeCategory === cat;
                      return (
                        <button 
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`px-4 py-2.5 rounded-xl whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 border ${
                             isActive 
                               ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20' 
                               : 'bg-slate-800/40 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                          }`}
                        >
                           {CATEGORY_ICONS[cat]}
                           <span>{cat}</span>
                        </button>
                      );
                    })}
                 </div>
              </div>

              {/* DISHES LIST */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-950/40 custom-scrollbar">
                 {filteredItems.length === 0 ? (
                   <div className="text-center py-20 opacity-30">
                      <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Sem itens nesta categoria</p>
                   </div>
                 ) : (
                   <div className="grid grid-cols-2 gap-3">
                      {filteredItems.map((item, idx) => {
                         const cartItem = cart.find(c => c.dish.name === item.name);
                         return (
                           <div key={idx} className="bg-slate-900 border border-slate-800/60 p-3 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-colors shadow-sm relative overflow-hidden group">
                              
                              {/* Price tag on image */}
                              <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[9px] font-black text-orange-400 z-10 border border-white/5">
                                €{item.price.toFixed(2)}
                              </div>

                              <div className="space-y-2.5">
                                 <div className="h-28 bg-slate-950/50 rounded-xl overflow-hidden flex items-center justify-center relative">
                                    {item.image ? (
                                       <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                       <Utensils className="text-slate-700 w-8 h-8" />
                                    )}
                                 </div>
                                 <div>
                                   <h3 className="font-bold text-slate-200 text-[11px] leading-tight line-clamp-1">{item.name}</h3>
                                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-0.5">{item.category}</p>
                                 </div>
                              </div>

                              <div className="mt-3">
                                 {cartItem ? (
                                    <div className="flex items-center justify-between bg-slate-950/60 rounded-xl p-1 border border-slate-800">
                                       <button 
                                         onClick={() => updateQuantity(item, -1)} 
                                         className="w-7 h-7 bg-slate-850 rounded-lg hover:bg-slate-750 flex items-center justify-center font-bold text-slate-400 active:scale-90 transition-transform"
                                       >
                                         <Minus size={10} />
                                       </button>
                                       <span className="font-black text-slate-200 text-xs">{cartItem.quantity}</span>
                                       <button 
                                         onClick={() => updateQuantity(item, 1)} 
                                         className="w-7 h-7 bg-slate-850 rounded-lg hover:bg-slate-750 flex items-center justify-center font-bold text-slate-400 active:scale-90 transition-transform"
                                       >
                                         <Plus size={10} />
                                       </button>
                                    </div>
                                 ) : (
                                    <button 
                                      onClick={() => updateQuantity(item, 1)} 
                                      className="py-2.5 bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-white font-black text-[9px] uppercase tracking-widest rounded-xl transition-all w-full text-center border border-orange-500/20"
                                    >
                                       Adicionar
                                    </button>
                                 )}
                              </div>
                           </div>
                         );
                      })}
                   </div>
                 )}
              </div>

              {/* NEXT / CHECKOUT BAR */}
              <div className="p-5 border-t border-slate-800 bg-slate-900">
                 <div className="flex justify-between items-center mb-3">
                    <div>
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Acumulado</span>
                       <p className="text-xl font-black text-orange-500">€{totalAmount.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Itens</span>
                       <p className="text-sm font-black text-slate-200">{totalItemsCount} un</p>
                    </div>
                 </div>
                 
                 <button 
                   disabled={cart.length === 0}
                   onClick={() => setStep('review')}
                   className="w-full py-4.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-orange-500/10 hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:scale-100 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                 >
                    Seguinte <ChevronRight size={14} />
                 </button>
              </div>
            </motion.div>
          ) : (
            /* STEP 2: REVIEW ORDER AND CONFIRM */
            <motion.div 
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col min-h-0 overflow-hidden"
            >
              <div className="p-6 bg-slate-900 border-b border-slate-800">
                 <h3 className="font-black uppercase tracking-[0.25em] text-xs flex items-center gap-2 text-orange-400">
                    <ShoppingBag size={14} /> Confirmar Pedido
                 </h3>
                 <p className="text-[10px] text-slate-400 mt-1">Os itens abaixo serão adicionados à conta da sua mesa e enviados ao restaurante.</p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950/40 custom-scrollbar">
                 {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
                       <div className="flex items-center gap-3">
                          <span className="w-7 h-7 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-lg flex items-center justify-center text-xs font-black">{item.quantity}x</span>
                          <div className="flex flex-col">
                             <span className="font-bold text-sm text-slate-200">{item.dish.name}</span>
                             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.dish.category}</span>
                          </div>
                       </div>
                       <span className="font-black text-sm text-slate-100">€{(item.dish.price * item.quantity).toFixed(2)}</span>
                    </div>
                 ))}
              </div>

              <div className="p-6 border-t border-slate-800 bg-slate-900 space-y-4">
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-400">
                      <span>Subtotal</span>
                      <span className="text-slate-200 font-black">€{totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-400">
                      <span>Taxa de Serviço (0%)</span>
                      <span className="text-slate-200 font-black">€0,00</span>
                    </div>
                    <div className="border-t border-slate-800 pt-2 flex justify-between items-end">
                       <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total do Pedido</span>
                       <span className="text-2xl font-black text-orange-500">€{totalAmount.toFixed(2)}</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => setStep('menu')}
                      className="py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all"
                    >
                       Voltar
                    </button>
                    <button
                      disabled={cart.length === 0}
                      onClick={handleSubmit}
                      className="py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                       Confirmar & Enviar
                    </button>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default TableMenuModal;
