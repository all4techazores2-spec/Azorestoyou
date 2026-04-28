
import React, { useState } from 'react';
import { Restaurant, Supplier, SupplierOrder, Language, StaffMember, FleetVehicle } from '../types';
import { 
  ShoppingBag, Package, Truck, CheckCircle, Clock, X, 
  Mail, Phone, MapPin, LogOut, LayoutDashboard, Search,
  Filter, Bell, User, Users, Plus, Trash2, Edit, Calendar, Lock, ShieldCheck
} from 'lucide-react';
import { getTranslation } from '../translations';
import { motion, AnimatePresence } from 'framer-motion';

interface SupplierDashboardProps {
  allRestaurants: Restaurant[];
  supplierEmail: string;
  onUpdateRestaurants: (updated: Restaurant[]) => void;
  onUpdateRestaurant: (updated: Restaurant) => void;
  onLogout: () => void;
  language?: Language;
}

type SupplierTab = 'orders' | 'staff' | 'fleet' | 'profile' | 'history';

const SupplierDashboard: React.FC<SupplierDashboardProps> = ({
  allRestaurants = [],
  supplierEmail,
  onUpdateRestaurants,
  onUpdateRestaurant,
  onLogout,
  language = 'pt'
}) => {
  const [activeTab, setActiveTab] = useState<SupplierTab>('orders');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'sent' | 'received'>('all');
  
  // Find which supplier object belongs to this email (across all restaurants, they should be the same ID/NIF)
  let supplierInfo: Supplier | undefined;
  for (const r of allRestaurants) {
    const found = r.suppliers?.find(s => s.email.toLowerCase() === supplierEmail.toLowerCase());
    if (found) {
      supplierInfo = found;
      break;
    }
  }

  // Local state for staff and fleet (since they might not be fully synced in db.json yet)
  // In a real app, this would be its own collection in db.json
  const [staff, setStaff] = useState<StaffMember[]>(supplierInfo?.staff || []);
  const [fleet, setFleet] = useState<FleetVehicle[]>(supplierInfo?.fleet || []);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [showAddFleet, setShowAddFleet] = useState(false);
  const [editingFleet, setEditingFleet] = useState<FleetVehicle | null>(null);

  if (!supplierInfo) return <div className="p-20 text-center">Erro: Fornecedor não encontrado.</div>;

  const t = (key: any) => getTranslation(language as Language, key);

  // Aggregate all orders from all restaurants sent to this supplier (by ID or NIF)
  const allOrders: (SupplierOrder & { restaurantName: string, restaurantId: string })[] = [];
  allRestaurants.forEach(r => {
    if (r.supplierOrders) {
      r.supplierOrders.forEach(o => {
        // Assume matching by name or email for now if ID is not consistent
        if (o.supplierId === supplierInfo?.id || r.suppliers?.some(s => s.email === supplierEmail)) {
           allOrders.push({ ...o, restaurantName: r.name, restaurantId: r.id });
        }
      });
    }
  });

  const filteredOrders = allOrders.filter(o => {
    if (filter === 'all') return true;
    return o.status === filter;
  });

  const handleUpdateOrderStatus = (restaurantId: string, orderId: string, newStatus: SupplierOrder['status']) => {
    const rest = allRestaurants.find(r => r.id === restaurantId);
    if (!rest) return;
    const updatedOrders = (rest.supplierOrders || []).map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    onUpdateRestaurant({ ...rest, supplierOrders: updatedOrders });
    alert(`Pedido ${newStatus === 'approved' ? 'aprovado' : 'enviado'} com sucesso!`);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'approved': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'sent': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'received': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const saveSupplierData = (newStaff?: StaffMember[], newFleet?: FleetVehicle[]) => {
     // Update local state and sync with all restaurants that have this supplier
     const updatedRestaurants = allRestaurants.map(r => {
        const hasSup = r.suppliers?.some(s => s.email.toLowerCase() === supplierEmail.toLowerCase());
        if (hasSup) {
           const updatedSuppliers = r.suppliers?.map(s => {
              if (s.email.toLowerCase() === supplierEmail.toLowerCase()) {
                 return { ...s, staff: newStaff || staff, fleet: newFleet || fleet };
              }
              return s;
           });
           return { ...r, suppliers: updatedSuppliers };
        }
        return r;
     });
     onUpdateRestaurants(updatedRestaurants);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col fixed h-full z-20">
        <div className="p-8 border-b border-white/5">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                 <ShoppingBag size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight uppercase">Supplier</h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Portal Logístico</p>
              </div>
           </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
           <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left p-4 rounded-2xl flex items-center gap-3 font-bold transition-all ${activeTab === 'orders' ? 'bg-indigo-600 shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-white/5'}`}
           >
              <Package size={20} /> Pedidos Recebidos
           </button>
           <button 
            onClick={() => setActiveTab('staff')}
            className={`w-full text-left p-4 rounded-2xl flex items-center gap-3 font-bold transition-all ${activeTab === 'staff' ? 'bg-indigo-600 shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-white/5'}`}
           >
              <Users size={20} /> Funcionários
           </button>
           <button 
            onClick={() => setActiveTab('fleet')}
            className={`w-full text-left p-4 rounded-2xl flex items-center gap-3 font-bold transition-all ${activeTab === 'fleet' ? 'bg-indigo-600 shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-white/5'}`}
           >
              <Truck size={20} /> Gestão de Frotas
           </button>
           <button 
            onClick={() => setActiveTab('history')}
            className={`w-full text-left p-4 rounded-2xl flex items-center gap-3 font-bold transition-all ${activeTab === 'history' ? 'bg-indigo-600 shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-white/5'}`}
           >
              <Clock size={20} /> Histórico
           </button>
           <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left p-4 rounded-2xl flex items-center gap-3 font-bold transition-all ${activeTab === 'profile' ? 'bg-indigo-600 shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-white/5'}`}
           >
              <User size={20} /> Perfil Empresa
           </button>
        </nav>

        <div className="p-6">
           <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 p-4 text-red-400 font-bold hover:bg-red-500/10 rounded-2xl transition-all"
           >
              <LogOut size={20} /> Sair do Portal
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-10">
         {/* Header */}
         <header className="flex justify-between items-center mb-12">
            <div>
               <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tighter">Olá, {supplierInfo.name}</h1>
               <p className="text-slate-400 font-medium italic mt-1">Gestão centralizada de logística e frotas</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex flex-col items-end">
                  <p className="text-sm font-black text-slate-800">{supplierInfo.email}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">NIF: {supplierInfo.nif}</p>
               </div>
               <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-black">
                  {supplierInfo.name.charAt(0)}
               </div>
            </div>
         </header>

         {activeTab === 'orders' && (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 {[
                   { label: 'Pendentes', value: allOrders.filter(o => o.status === 'pending').length, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
                   { label: 'Aprovados', value: allOrders.filter(o => o.status === 'approved').length, icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
                   { label: 'Em Trânsito', value: allOrders.filter(o => o.status === 'sent').length, icon: Truck, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                   { label: 'Concluídos', value: allOrders.filter(o => o.status === 'received').length, icon: Package, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                 ].map((stat, i) => (
                   <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4">
                      <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                         <stat.icon size={24} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                         <p className="text-2xl font-black text-slate-800">{stat.value}</p>
                      </div>
                   </div>
                 ))}
              </div>

              {/* Orders List */}
              <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                 <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Pedidos Recentes (Todos Restaurantes)</h2>
                    <div className="flex items-center gap-2">
                       {(['all', 'pending', 'approved', 'sent', 'received'] as const).map(f => (
                         <button 
                           key={f}
                           onClick={() => setFilter(f)}
                           className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-white text-slate-400 border border-slate-200 hover:border-indigo-300'}`}
                         >
                           {f === 'all' ? 'Todos' : f === 'pending' ? 'Pendente' : f === 'approved' ? 'Aprovado' : f === 'sent' ? 'Enviado' : 'Entregue'}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="overflow-x-auto">
                    <table className="w-full">
                       <thead>
                          <tr className="text-left border-b border-slate-100">
                             <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Restaurante</th>
                             <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ID Pedido</th>
                             <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Data</th>
                             <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Itens</th>
                             <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                             <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Ações</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {filteredOrders.length > 0 ? filteredOrders.map(order => (
                            <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                               <td className="p-6">
                                  <div className="flex items-center gap-2">
                                     <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-[10px] font-black">{order.restaurantName.charAt(0)}</div>
                                     <span className="text-xs font-black text-slate-800">{order.restaurantName}</span>
                                  </div>
                               </td>
                               <td className="p-6">
                                  <span className="text-[10px] font-black text-slate-500">#{order.id.slice(-6)}</span>
                               </td>
                               <td className="p-6">
                                  <p className="text-xs font-bold text-slate-600">{new Date(order.createdAt).toLocaleDateString('pt-PT')}</p>
                               </td>
                               <td className="p-6">
                                  <div className="space-y-1">
                                     {order.items.map((item, idx) => (
                                       <div key={idx} className="flex items-center gap-2">
                                          <span className="w-5 h-5 bg-indigo-50 text-indigo-600 rounded flex items-center justify-center text-[9px] font-bold">{item.quantity}x</span>
                                          <span className="text-xs font-bold text-slate-700">Produto {idx + 1}</span>
                                       </div>
                                     ))}
                                  </div>
                               </td>
                               <td className="p-6">
                                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                                     {order.status === 'pending' ? 'Pendente' : 
                                      order.status === 'approved' ? 'Aprovado' : 
                                      order.status === 'sent' ? 'Enviado' : 'Concluído'}
                                  </span>
                               </td>
                               <td className="p-6 text-right">
                                  <div className="flex justify-end gap-2">
                                     {order.status === 'pending' && (
                                       <button 
                                         onClick={() => handleUpdateOrderStatus(order.restaurantId, order.id, 'approved')}
                                         className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                                       >
                                         Aprovar
                                       </button>
                                     )}
                                     {order.status === 'approved' && (
                                       <button 
                                         onClick={() => handleUpdateOrderStatus(order.restaurantId, order.id, 'sent')}
                                         className="bg-indigo-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                                       >
                                         Enviar
                                       </button>
                                     )}
                                     <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                                        <Search size={18} />
                                     </button>
                                  </div>
                               </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={6} className="p-20 text-center">
                                 <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-200">
                                       <ShoppingBag size={40} />
                                    </div>
                                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Nenhum pedido encontrado</p>
                                 </div>
                              </td>
                            </tr>
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>
           </motion.div>
         )}

         {activeTab === 'staff' && (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="flex justify-between items-center">
                 <div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Equipa de Logística</h2>
                    <p className="text-slate-400 text-sm font-medium">Gestão de motoristas e armazém</p>
                 </div>
                 <button 
                  onClick={() => { setEditingStaff(null); setShowAddStaff(true); }}
                  className="px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-500/20 hover:scale-105 transition-all flex items-center gap-2"
                 >
                    <Plus size={16} /> Novo Funcionário
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {staff.map(member => (
                   <div key={member.id} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all group">
                      <div className="flex items-center gap-4 mb-6">
                         <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-xl font-black">
                            {member.name.charAt(0)}
                         </div>
                         <div>
                            <p className="font-black text-slate-800">{member.name}</p>
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest">{member.role}</span>
                         </div>
                      </div>
                      <div className="space-y-2 mb-6">
                         <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><Mail size={14}/> {member.email}</div>
                         <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><Phone size={14}/> {member.phone}</div>
                      </div>
                      <div className="flex gap-2">
                         <button 
                          onClick={() => { setEditingStaff(member); setShowAddStaff(true); }}
                          className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                         >Editar</button>
                         <button 
                          onClick={() => {
                             const updated = staff.filter(s => s.id !== member.id);
                             setStaff(updated);
                             saveSupplierData(updated);
                          }}
                          className="p-3 text-red-400 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                         ><Trash2 size={16}/></button>
                      </div>
                   </div>
                 ))}
                 {staff.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                       <Users className="w-16 h-16 mx-auto mb-4 text-slate-200" />
                       <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Nenhum funcionário registado</p>
                    </div>
                 )}
              </div>
           </motion.div>
         )}

         {activeTab === 'fleet' && (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="flex justify-between items-center">
                 <div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Gestão de Frotas</h2>
                    <p className="text-slate-400 text-sm font-medium">Controlo de veículos e matriculas</p>
                 </div>
                 <button 
                  onClick={() => { setEditingFleet(null); setShowAddFleet(true); }}
                  className="px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-500/20 hover:scale-105 transition-all flex items-center gap-2"
                 >
                    <Plus size={16} /> Novo Veículo
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {fleet.map(vehicle => (
                   <div key={vehicle.id} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-4">
                         <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${vehicle.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                            {vehicle.status === 'active' ? 'Ativo' : 'Manutenção'}
                         </span>
                      </div>
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
                         <Truck className="text-slate-400" size={32} />
                      </div>
                      <div className="mb-6">
                         <p className="text-2xl font-black text-slate-800 tracking-tighter">{vehicle.plate}</p>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{vehicle.model}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl mb-8 flex items-center gap-3">
                         <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            <User size={16} className="text-indigo-600" />
                         </div>
                         <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Responsável</p>
                            <p className="text-xs font-black text-slate-700">
                               {staff.find(s => s.id === vehicle.responsibleStaffId)?.name || 'Nenhum atribuído'}
                            </p>
                         </div>
                      </div>
                      <div className="flex gap-2">
                         <button 
                          onClick={() => { setEditingFleet(vehicle); setShowAddFleet(true); }}
                          className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                         >Editar</button>
                         <button 
                          onClick={() => {
                             const updated = fleet.filter(v => v.id !== vehicle.id);
                             setFleet(updated);
                             saveSupplierData(undefined, updated);
                          }}
                          className="p-3 text-red-400 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                         ><Trash2 size={16}/></button>
                      </div>
                   </div>
                 ))}
                 {fleet.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                       <Truck className="w-16 h-16 mx-auto mb-4 text-slate-200" />
                       <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Nenhuma viatura registada</p>
                    </div>
                 )}
              </div>
           </motion.div>
         )}

         {activeTab === 'history' && (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Histórico de Conclusões</h2>
              <div className="bg-white rounded-[3rem] border border-slate-100 p-8">
                 {allOrders.filter(o => o.status === 'received').length > 0 ? (
                    <div className="space-y-4">
                       {allOrders.filter(o => o.status === 'received').map(order => (
                          <div key={order.id} className="flex justify-between items-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                             <div>
                                <p className="font-black text-slate-800">{order.restaurantName}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Entregue em {new Date(order.createdAt).toLocaleDateString()}</p>
                             </div>
                             <div className="text-right">
                                <p className="font-black text-indigo-600">€{order.total.toFixed(2)}</p>
                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Finalizado</span>
                             </div>
                          </div>
                       ))}
                    </div>
                 ) : (
                    <p className="text-center py-20 text-slate-400 font-bold uppercase text-xs tracking-widest">Ainda sem histórico</p>
                 )}
              </div>
           </motion.div>
         )}

         {activeTab === 'profile' && (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-8">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Perfil da Empresa</h2>
              <div className="bg-white rounded-[3rem] border border-slate-100 p-8 shadow-sm">
                 <div className="space-y-6">
                    <div className="flex items-center gap-6 mb-8">
                       <div className="w-24 h-24 bg-indigo-600 text-white rounded-3xl flex items-center justify-center text-4xl font-black shadow-xl shadow-indigo-600/20">
                          {supplierInfo.name.charAt(0)}
                       </div>
                       <div>
                          <p className="text-2xl font-black text-slate-800 tracking-tight">{supplierInfo.name}</p>
                          <p className="text-slate-400 font-medium">NIF {supplierInfo.nif}</p>
                       </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email de Contacto</label>
                          <div className="p-4 bg-slate-50 rounded-2xl font-bold text-slate-700 flex items-center gap-3 border border-slate-100"><Mail size={16} className="text-indigo-600"/> {supplierInfo.email}</div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Telemóvel</label>
                          <div className="p-4 bg-slate-50 rounded-2xl font-bold text-slate-700 flex items-center gap-3 border border-slate-100"><Phone size={16} className="text-indigo-600"/> {supplierInfo.phone}</div>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Morada Sede</label>
                       <div className="p-4 bg-slate-50 rounded-2xl font-bold text-slate-700 flex items-center gap-3 border border-slate-100"><MapPin size={16} className="text-indigo-600"/> {supplierInfo.address}</div>
                    </div>
                    <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                       <div>
                          <p className="font-black text-slate-800">Segurança</p>
                          <p className="text-xs text-slate-400 font-medium">Altere a sua password de acesso</p>
                       </div>
                       <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all">Alterar Password</button>
                    </div>
                 </div>
              </div>
           </motion.div>
         )}

         {/* Modals for Staff and Fleet */}
         <AnimatePresence>
            {showAddStaff && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
                 <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg p-8">
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-6">Novo Funcionário</h3>
                    <form className="space-y-4" onSubmit={(e) => {
                       e.preventDefault();
                       const fd = new FormData(e.currentTarget);
                       const newM: StaffMember = {
                          id: editingStaff?.id || 'SUP_STF_' + Date.now(),
                          name: fd.get('name') as string,
                          email: fd.get('email') as string,
                          phone: fd.get('phone') as string,
                          password: fd.get('password') as string || '123456',
                          role: fd.get('role') as any
                       };
                       const updated = editingStaff ? staff.map(s => s.id === editingStaff.id ? newM : s) : [...staff, newM];
                       setStaff(updated);
                       saveSupplierData(updated);
                       setShowAddStaff(false);
                    }}>
                       <input name="name" placeholder="Nome Completo" defaultValue={editingStaff?.name} className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none" required />
                       <input name="email" type="email" placeholder="Email" defaultValue={editingStaff?.email} className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none" required />
                       <input name="phone" placeholder="Telemóvel" defaultValue={editingStaff?.phone} className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none" required />
                       <select name="role" defaultValue={editingStaff?.role || 'motorista'} className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none">
                          <option value="motorista">Motorista</option>
                          <option value="armazem">Armazém</option>
                          <option value="administrativo">Administrativo</option>
                       </select>
                       <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest mt-4">Guardar</button>
                       <button type="button" onClick={() => setShowAddStaff(false)} className="w-full py-2 text-slate-400 font-bold">Cancelar</button>
                    </form>
                 </motion.div>
              </div>
            )}

            {showAddFleet && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
                 <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg p-8">
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-6">Gestão de Veículo</h3>
                    <form className="space-y-4" onSubmit={(e) => {
                       e.preventDefault();
                       const fd = new FormData(e.currentTarget);
                       const newV: FleetVehicle = {
                          id: editingFleet?.id || 'FLEET_' + Date.now(),
                          plate: fd.get('plate') as string,
                          model: fd.get('model') as string,
                          responsibleStaffId: fd.get('staffId') as string,
                          status: 'active'
                       };
                       const updated = editingFleet ? fleet.map(v => v.id === editingFleet.id ? newV : v) : [...fleet, newV];
                       setFleet(updated);
                       saveSupplierData(undefined, updated);
                       setShowAddFleet(false);
                    }}>
                       <input name="plate" placeholder="Matrícula (ex: 00-AA-00)" defaultValue={editingFleet?.plate} className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none" required />
                       <input name="model" placeholder="Modelo do Veículo" defaultValue={editingFleet?.model} className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none" required />
                       <select name="staffId" defaultValue={editingFleet?.responsibleStaffId} className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none">
                          <option value="">Selecionar Responsável</option>
                          {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                       </select>
                       <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest mt-4">Guardar</button>
                       <button type="button" onClick={() => setShowAddFleet(false)} className="w-full py-2 text-slate-400 font-bold">Cancelar</button>
                    </form>
                 </motion.div>
              </div>
            )}
         </AnimatePresence>
      </main>
    </div>
  );
};

export default SupplierDashboard;
