
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Restaurant, Activity, Language, Dish, Flight, Hotel, Car, BusSchedule } from '../types';
import { getTranslation } from '../translations';
import { 
  Utensils, Mountain, Edit, Trash2, Plus, Save, X, LogOut, 
  LayoutDashboard, Plane, BedDouble, Car as CarIcon, Bus, 
  Image as ImageIcon, Lock, Users, Cloud as CloudSync,
  ShoppingBag, Mail, MapPin, Phone, Sparkles,
  Scissors, User, Flower2, Brush, ArrowRight
} from 'lucide-react';

interface AdminDashboardProps {
  restaurants: Restaurant[];
  shops: Restaurant[];
  beauty: Restaurant[];
  activities: Activity[];
  flights: Flight[];
  hotels: Hotel[];
  cars: Car[];
  busSchedules: BusSchedule[];
  
  onUpdateRestaurants: (newRestaurants: Restaurant[]) => void;
  onUpdateShops: (newShops: Restaurant[]) => void;
  onUpdateBeauty: (newBeauty: Restaurant[]) => void;
  onUpdateActivities: (newActivities: Activity[]) => void;
  onUpdateFlights: (newFlights: Flight[]) => void;
  onUpdateHotels: (newHotels: Hotel[]) => void;
  onUpdateCars: (newCars: Car[]) => void;
  onUpdateBusSchedules: (newSchedules: BusSchedule[]) => void;

  onLogout: () => void;
  onFullSync?: () => void;
  language?: Language;
}

type Tab = 'restaurants' | 'shops' | 'beauty' | 'activities' | 'flights' | 'hotels' | 'cars' | 'buses' | 'accounts' | 'suppliers';

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  restaurants = [], shops = [], beauty = [], activities = [], flights = [], hotels = [], cars = [], busSchedules = [],
  onUpdateRestaurants, onUpdateShops, onUpdateBeauty, onUpdateActivities, onUpdateFlights, onUpdateHotels, onUpdateCars, onUpdateBusSchedules,
  onLogout, onFullSync,
  language = 'pt'
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('restaurants');
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [beautyFilter, setBeautyFilter] = useState<string>('all');
  const [shopsFilter, setShopsFilter] = useState<string>('all');
  const [hotelFilter, setHotelFilter] = useState<string>('all');
  
  // Account management states
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);
  const [adminFormData, setAdminFormData] = useState({ email: '', password: '' });
  const [addingStaffToId, setAddingStaffToId] = useState<string | null>(null);
  const [staffFormData, setStaffFormData] = useState({ name: '', email: '', password: '', role: 'waiter' });
  const [addingSupplierToId, setAddingSupplierToId] = useState<string | null>(null);
  const [editingSupplierId, setEditingSupplierId] = useState<string | null>(null);
  const [supplierFormData, setSupplierFormData] = useState({ name: '', email: '', phone: '', nif: '', address: '' });

  const togglePassword = (id: string) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const lang = language as Language;

  const t = (key: any) => getTranslation(lang, key);

  // -- ACCOUNT MANAGEMENT HANDLERS --
  const handleUpdateAdmin = (restId: string) => {
    const findAndReplace = (list: any[]) => list.map(r => r.id === restId ? { ...r, adminEmail: adminFormData.email, adminPassword: adminFormData.password } : r);
    
    // Logic: Identify which list the business belongs to and update only that list
    if (restaurants.some(r => r.id === restId)) {
      onUpdateRestaurants(findAndReplace(restaurants));
    } else if (shops.some(s => s.id === restId)) {
      onUpdateShops(findAndReplace(shops));
    } else if (beauty.some(b => b.id === restId)) {
      onUpdateBeauty(findAndReplace(beauty));
    }
    
    setEditingAdminId(null);
    alert('Dados de administrador atualizados com sucesso!');
  };

  const handleAddStaff = (restId: string) => {
    const newStaff = {
      id: `STF_${Date.now()}`,
      ...staffFormData
    };
    const findAndAdd = (list: any[]) => list.map(r => r.id === restId ? { ...r, staff: [...(r.staff || []), newStaff] } : r);
    onUpdateRestaurants(findAndAdd(restaurants));
    onUpdateRestaurants(findAndAdd(shops));
    onUpdateRestaurants(findAndAdd(beauty));
    setAddingStaffToId(null);
    setStaffFormData({ name: '', email: '', password: '', role: 'waiter' });
    alert('Funcionário adicionado com sucesso!');
  };

  const handleRemoveStaff = (restId: string, staffId: string) => {
    if (!window.confirm('Remover este funcionário?')) return;
    const findAndRemove = (list: any[]) => list.map(r => r.id === restId ? { ...r, staff: (r.staff || []).filter((s: any) => s.id !== staffId) } : r);
    onUpdateRestaurants(findAndRemove(restaurants));
    onUpdateRestaurants(findAndRemove(shops));
    onUpdateRestaurants(findAndRemove(beauty));
  };
  
  const handleAddSupplier = (restId: string, data: any) => {
    const newSup = {
      id: `SUP_${Date.now()}`,
      ...data,
      password: Math.random().toString(36).slice(-8)
    };
    const findAndAddSup = (list: any[]) => list.map(r => r.id === restId ? { ...r, suppliers: [...(r.suppliers || []), newSup] } : r);
    onUpdateRestaurants(findAndAddSup(restaurants));
    onUpdateRestaurants(findAndAddSup(shops));
    onUpdateRestaurants(findAndAddSup(beauty));
    setAddingSupplierToId(null);
    alert('Fornecedor adicionado com sucesso!');
  };

  const handleUpdateSupplier = (restId: string, supId: string, data: any) => {
    const findAndUpdateSup = (list: any[]) => list.map(r => r.id === restId ? { ...r, suppliers: r.suppliers?.map(s => s.id === supId ? { ...s, ...data } : s) } : r);
    onUpdateRestaurants(findAndUpdateSup(restaurants));
    onUpdateRestaurants(findAndUpdateSup(shops));
    onUpdateRestaurants(findAndUpdateSup(beauty));
    setEditingSupplierId(null);
    alert('Fornecedor atualizado com sucesso!');
  };

  const handleRemoveSupplier = (restId: string, supId: string) => {
    if (!window.confirm('Remover este fornecedor?')) return;
    const findAndRemoveSup = (list: any[]) => list.map(r => r.id === restId ? { ...r, suppliers: (r.suppliers || []).filter((s: any) => s.id !== supId) } : r);
    onUpdateRestaurants(findAndRemoveSup(restaurants));
    onUpdateRestaurants(findAndRemoveSup(shops));
    onUpdateRestaurants(findAndRemoveSup(beauty));
  };

  // -- CRUD HANDLERS --

  const handleDelete = (id: string) => {
    if (!window.confirm('Tem a certeza que deseja apagar este item?')) return;
    
    switch (activeTab) {
      case 'restaurants': onUpdateRestaurants(restaurants.filter(r => r.id !== id)); break;
      case 'shops': onUpdateShops(shops.filter(s => s.id !== id)); break;
      case 'beauty': onUpdateBeauty(beauty.filter(b => b.id !== id)); break;
      case 'activities': onUpdateActivities(activities.filter(a => a.id !== id)); break;
      case 'flights': onUpdateFlights(flights.filter(f => f.id !== id)); break;
      case 'hotels': onUpdateHotels(hotels.filter(h => h.id !== id)); break;
      case 'cars': onUpdateCars(cars.filter(c => c.id !== id)); break;
      case 'buses': onUpdateBusSchedules(busSchedules.filter(b => b.id !== id)); break;
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    // Helper to add or update item in list
    const updateList = (list: any[], setter: (l: any[]) => void) => {
      const updatedItem = { ...editingItem };
      if (isAddingNew) {
        // Generate simple ID if needed
        if (!updatedItem.id) updatedItem.id = `${activeTab.substring(0,3).toUpperCase()}${Date.now()}`;
        setter([...list, updatedItem]);
      } else {
        setter(list.map(item => item.id === updatedItem.id ? updatedItem : item));
      }
    };

    switch (activeTab) {
      case 'restaurants': updateList(restaurants, onUpdateRestaurants); break;
      case 'shops': updateList(shops, onUpdateShops); break;
      case 'beauty': updateList(beauty, onUpdateBeauty); break;
      case 'activities': updateList(activities, onUpdateActivities); break;
      case 'flights': updateList(flights, onUpdateFlights); break;
      case 'hotels': updateList(hotels, onUpdateHotels); break;
      case 'cars': updateList(cars, onUpdateCars); break;
      case 'buses': updateList(busSchedules, onUpdateBusSchedules); break;
    }

    setEditingItem(null);
    setIsAddingNew(false);
  };

  const startEdit = (item: any) => {
    // Clone item to avoid direct mutation
    const itemClone = JSON.parse(JSON.stringify(item));
    setEditingItem(itemClone);
    setIsAddingNew(false);
  };

  const startAdd = () => {
    const timestamp = Date.now();
    let newItem: any = {};

    switch (activeTab) {
      case 'restaurants':
        newItem = { 
          id: `R${timestamp}`, 
          name: '', 
          island: 'PDL', 
          cuisine: '', 
          rating: 4.5, 
          reviews: 0, 
          image: '', 
          description: '', 
          dishes: [],
          adminEmail: '',
          adminPassword: '',
          subcategory: '',
          services: []
        };
        break;
      case 'activities':
        newItem = { id: `A${timestamp}`, title: '', type: 'trail', island: 'PDL', image: '', description: '', distance: '', duration: '', difficulty: 'Moderado' };
        break;
      case 'flights':
        newItem = { id: `F${timestamp}`, airline: '', flightNumber: '', origin: 'LIS', destination: 'PDL', departureTime: '00:00', arrivalTime: '00:00', price: 0, status: 'A Horas', stops: 0, duration: '' };
        break;
      case 'hotels':
        newItem = { id: `H${timestamp}`, name: '', island: 'PDL', stars: 4, pricePerNight: 0, image: '', description: '', type: hotelFilter !== 'all' ? hotelFilter : 'hotel' };
        break;
      case 'cars':
        newItem = { id: `C${timestamp}`, model: '', companyId: '', type: 'Económico', fuelType: 'Gasolina', pricePerDay: 0, image: '', seats: 5, isAvailable: true, description: '', features: [] };
        break;
      case 'buses':
        newItem = { id: `B${timestamp}`, company: '', island: 'PDL', origin: '', destination: '', times: [], price: 0, duration: '' };
        break;
      case 'shops':
        newItem = { 
          id: `S${timestamp}`, name: '', island: 'PDL', rating: 4.5, reviews: 0, image: '', description: '', 
          subcategory: shopsFilter !== 'all' ? shopsFilter : 'crafts',
          adminEmail: '', adminPassword: ''
        };
        break;
      case 'beauty':
        newItem = { 
          id: `B${timestamp}`, name: '', island: 'PDL', rating: 4.5, reviews: 0, image: '', description: '', 
          subcategory: beautyFilter !== 'all' ? beautyFilter : 'beauty_salon',
          adminEmail: '', adminPassword: '',
          dishes: []
        };
        break;
      case 'suppliers':
        alert('Por favor, adicione fornecedores diretamente no cartão de cada restaurante abaixo.');
        return;
    }
    
    setEditingItem(newItem);
    setIsAddingNew(true);
  };

  // -- DISH MANAGEMENT (Restaurants only) --
  const addDish = () => {
    const newDish: Dish = { name: 'Novo Prato', description: '', price: 0, image: '' };
    setEditingItem({ ...editingItem, dishes: [...editingItem.dishes, newDish] });
  };

  const updateDish = (index: number, field: keyof Dish, value: any) => {
    const newDishes = [...editingItem.dishes];
    newDishes[index] = { ...newDishes[index], [field]: value };
    setEditingItem({ ...editingItem, dishes: newDishes });
  };

  const removeDish = (index: number) => {
    setEditingItem({ ...editingItem, dishes: editingItem.dishes.filter((_:any, i:number) => i !== index) });
  };

  // -- FORM RENDERING --
  const renderFormFields = () => {
    if (!editingItem) return null;

    const commonInput = (label: string, field: string, type: string = 'text', colSpan: boolean = false) => (
      <div className={colSpan ? 'md:col-span-2' : ''}>
        <label className="block text-sm font-bold text-slate-700 mb-1">{label}</label>
        <input 
          type={type} 
          className="w-full border p-2 rounded-lg"
          value={editingItem[field]}
          onChange={e => setEditingItem({...editingItem, [field]: type === 'number' ? parseFloat(e.target.value) : e.target.value})}
          required
        />
      </div>
    );

    const islandSelect = (field: string = 'island') => (
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">{t('item_island')}</label>
        <select 
          className="w-full border p-2 rounded-lg bg-white"
          value={editingItem[field]}
          onChange={e => setEditingItem({...editingItem, [field]: e.target.value})}
        >
          {['PDL', 'TER', 'HOR', 'PIX', 'SJZ', 'GRW', 'FLW', 'CVU', 'SMA', 'LIS', 'OPO', 'BOS', 'YYZ'].map(i => <option key={i} value={i}>{i}</option>)}
        </select>
      </div>
    );

    switch (activeTab) {
      case 'restaurants':
      case 'shops':
      case 'beauty':
        return (
          <>
            {commonInput(t('item_name'), 'name')}
            {islandSelect()}
            {activeTab === 'restaurants' && commonInput(t('field_cuisine'), 'cuisine')}
            {activeTab === 'beauty' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subcategoria</label>
                <select className="w-full border p-2 rounded-lg bg-white font-bold" value={editingItem.subcategory} onChange={e => setEditingItem({...editingItem, subcategory: e.target.value})}>
                  <option value="beauty_salon">Salão de Beleza</option>
                  <option value="hairdresser">Cabeleireiro</option>
                  <option value="barber">Barbearia</option>
                  <option value="manicure">Manicure</option>
                  <option value="massage">Massagem</option>
                </select>
              </div>
            )}
            {activeTab === 'shops' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subcategoria</label>
                <select className="w-full border p-2 rounded-lg bg-white font-bold" value={editingItem.subcategory} onChange={e => setEditingItem({...editingItem, subcategory: e.target.value})}>
                  <option value="crafts">Artesanato</option>
                  <option value="food">Produtos Regionais / Gastronomia</option>
                </select>
              </div>
            )}
            {commonInput(t('item_rating'), 'rating', 'number')}
            {commonInput(t('item_reviews'), 'reviews', 'number')}
            {commonInput(t('item_image'), 'image', 'text', true)}
            {commonInput('Admin Email', 'adminEmail')}
            {commonInput('Admin Password', 'adminPassword')}
            <div className="md:col-span-2">
               <label className="block text-sm font-bold text-slate-700 mb-1">{t('item_desc')}</label>
               <textarea className="w-full border p-2 rounded-lg h-24" value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
            </div>
            
            {/* Dishes/Services Section */}
            <div className="md:col-span-2 border-t pt-4 mt-2">
              <div className="flex justify-between items-center mb-2">
                 <h4 className="font-bold">{activeTab === 'beauty' ? 'Serviços' : activeTab === 'shops' ? 'Produtos em Destaque' : t('dishes_management')}</h4>
                 <button type="button" onClick={addDish} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">+ {activeTab === 'beauty' ? 'Serviço' : activeTab === 'shops' ? 'Produto' : t('add_dish')}</button>
              </div>
              <div className="space-y-2">
                {editingItem.dishes?.map((dish: Dish, idx: number) => (
                  <div key={idx} className="flex gap-2 bg-slate-50 p-2 rounded border">
                    <input className="border p-1 rounded w-1/4" placeholder="Nome" value={dish.name} onChange={e => updateDish(idx, 'name', e.target.value)} />
                    <input className="border p-1 rounded w-1/4" placeholder="Preço" type="number" value={dish.price} onChange={e => updateDish(idx, 'price', parseFloat(e.target.value))} />
                    <input className="border p-1 rounded w-1/2" placeholder="Desc" value={dish.description} onChange={e => updateDish(idx, 'description', e.target.value)} />
                    <button type="button" onClick={() => removeDish(idx)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      
      case 'activities':
        return (
          <>
            {commonInput(t('item_name'), 'title')}
            {islandSelect()}
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-1">{t('field_type')}</label>
               <select className="w-full border p-2 rounded-lg bg-white" value={editingItem.type} onChange={e => setEditingItem({...editingItem, type: e.target.value})}>
                 <option value="trail">Trail</option>
                 <option value="culture">Culture</option>
                 <option value="landscape">Landscape</option>
                 <option value="poi">POI</option>
                 <option value="activity">Activity</option>
               </select>
            </div>
            {commonInput(t('item_image'), 'image', 'text')}
            <div className="md:col-span-2">
               <label className="block text-sm font-bold text-slate-700 mb-1">{t('item_desc')}</label>
               <textarea className="w-full border p-2 rounded-lg h-24" value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
            </div>
          </>
        );

      case 'flights':
        return (
          <>
             {commonInput(t('field_airline'), 'airline')}
             {commonInput(t('field_flight_num'), 'flightNumber')}
             {islandSelect('origin')}
             {islandSelect('destination')}
             {commonInput(t('field_dep_time'), 'departureTime', 'time')}
             {commonInput(t('field_arr_time'), 'arrivalTime', 'time')}
             {commonInput(t('item_price'), 'price', 'number')}
             <div>
               <label className="block text-sm font-bold text-slate-700 mb-1">{t('field_status')}</label>
               <select className="w-full border p-2 rounded-lg bg-white" value={editingItem.status} onChange={e => setEditingItem({...editingItem, status: e.target.value})}>
                 <option value="A Horas">A Horas</option>
                 <option value="Atrasado">Atrasado</option>
                 <option value="Embarque">Embarque</option>
                 <option value="Cancelado">Cancelado</option>
               </select>
             </div>
             {commonInput('Stops', 'stops', 'number')}
             {commonInput('Duration', 'duration')}
          </>
        );

      case 'hotels':
        return (
          <>
            {commonInput(t('item_name'), 'name')}
            {islandSelect()}
            {commonInput(t('field_stars'), 'stars', 'number')}
            {commonInput(t('price_night'), 'pricePerNight', 'number')}
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Tipo de Alojamento</label>
                <select 
                  className="w-full border p-2 rounded-lg bg-white font-bold" 
                  value={editingItem.type || 'hotel'} 
                  onChange={e => setEditingItem({...editingItem, type: e.target.value})}
                >
                  <option value="hotel">Hotel</option>
                  <option value="al">AL (Alojamento Local)</option>
                </select>
            </div>
            {commonInput(t('item_image'), 'image', 'text', true)}
            <div className="md:col-span-2">
               <label className="block text-sm font-bold text-slate-700 mb-1">{t('item_desc')}</label>
               <textarea className="w-full border p-2 rounded-lg h-24" value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
            </div>
          </>
        );

      case 'cars':
        return (
          <>
            {commonInput(t('field_model'), 'model')}
            {commonInput(t('company'), 'company')}
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-1">{t('field_type')}</label>
               <select className="w-full border p-2 rounded-lg bg-white" value={editingItem.type} onChange={e => setEditingItem({...editingItem, type: e.target.value})}>
                 <option value="Económico">Económico</option>
                 <option value="SUV">SUV</option>
                 <option value="Descapotável">Descapotável</option>
                 <option value="Carrinha">Carrinha</option>
               </select>
            </div>
            {commonInput(t('field_seats'), 'seats', 'number')}
            {commonInput(t('daily_rate'), 'pricePerDay', 'number')}
            {commonInput(t('item_image'), 'image', 'text', true)}
          </>
        );

      case 'buses':
        return (
          <>
            {commonInput(t('company'), 'company')}
            {islandSelect()}
            {commonInput(t('bus_origin'), 'origin')}
            {commonInput(t('bus_destination'), 'destination')}
            {commonInput(t('item_price'), 'price', 'number')}
            {commonInput('Duration', 'duration')}
            <div className="md:col-span-2">
               <label className="block text-sm font-bold text-slate-700 mb-1">{t('field_times')}</label>
               <textarea 
                 className="w-full border p-2 rounded-lg h-24 font-mono text-sm" 
                 value={Array.isArray(editingItem.times) ? editingItem.times.join(', ') : editingItem.times} 
                 onChange={e => setEditingItem({...editingItem, times: e.target.value.split(',').map((t: string) => t.trim())})} 
               />
            </div>
          </>
        );
    }
  };

  const getListItems = () => {
    switch (activeTab) {
      case 'restaurants': return restaurants;
      case 'shops': 
        return shopsFilter === 'all' ? shops : shops.filter(s => s.subcategory === shopsFilter);
      case 'beauty': 
        return beautyFilter === 'all' ? beauty : beauty.filter(b => b.subcategory === beautyFilter);
      case 'activities': return activities;
      case 'flights': return flights;
      case 'hotels': 
        return hotelFilter === 'all' ? hotels : hotels.filter(h => h.type === hotelFilter);
      case 'cars': return cars;
      case 'buses': return busSchedules;
      default: return [];
    }
  };

  const getItemName = (item: any) => {
    if (activeTab === 'flights') return `${item.airline} ${item.flightNumber} (${item.origin}->${item.destination})`;
    if (activeTab === 'buses') return `${item.company}: ${item.origin} -> ${item.destination}`;
    return item.name || item.title || item.model;
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-20 overflow-y-auto">
        <div className="p-6 border-b border-slate-800">
           <h2 className="text-xl font-bold flex items-center gap-2">
             <LayoutDashboard className="text-blue-500" /> Admin
           </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => { setActiveTab('flights'); setEditingItem(null); }} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 ${activeTab === 'flights' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
            <Plane className="w-5 h-5" /> {t('manage_flights')}
          </button>
          <button onClick={() => { setActiveTab('hotels'); setEditingItem(null); }} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 ${activeTab === 'hotels' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
            <BedDouble className="w-5 h-5" /> {t('manage_hotels')}
          </button>
          <button onClick={() => { setActiveTab('cars'); setEditingItem(null); }} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 ${activeTab === 'cars' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
            <CarIcon className="w-5 h-5" /> {t('manage_cars')}
          </button>
          <button onClick={() => { setActiveTab('buses'); setEditingItem(null); }} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 ${activeTab === 'buses' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
            <Bus className="w-5 h-5" /> {t('manage_buses')}
          </button>
          <button onClick={() => { setActiveTab('restaurants'); setEditingItem(null); }} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 ${activeTab === 'restaurants' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
            <Utensils className="w-5 h-5" /> {t('manage_restaurants')}
          </button>
          <button onClick={() => { setActiveTab('shops'); setEditingItem(null); }} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 ${activeTab === 'shops' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
            <ShoppingBag className="w-5 h-5" /> Lojas Regionais
          </button>
          <button onClick={() => { setActiveTab('beauty'); setEditingItem(null); }} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 ${activeTab === 'beauty' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
            <Sparkles className="w-5 h-5" /> Beleza Homem/Mulher
          </button>
          <button onClick={() => { setActiveTab('activities'); setEditingItem(null); }} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 ${activeTab === 'activities' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
            <Mountain className="w-5 h-5" /> {t('manage_activities')}
          </button>
          <div className="pt-4 mt-4 border-t border-slate-800">
             <button onClick={() => setActiveTab('accounts')} className={`flex items-center gap-3 w-full px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${activeTab === 'accounts' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-100'}`}>
                <Users size={20} /> Contas Restaurante
             </button>

             <button onClick={() => setActiveTab('suppliers')} className={`flex items-center gap-3 w-full px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${activeTab === 'suppliers' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-100'}`}>
                <ShoppingBag size={20} /> Fornecedores
             </button>
          </div>
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-2">
          {onFullSync && (
            <button 
              onClick={onFullSync} 
              className="w-full flex items-center gap-3 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 p-3 rounded-xl transition-all border border-blue-500/30"
            >
               <CloudSync className="w-5 h-5" /> Enviar p/ Servidor
            </button>
          )}
          <button onClick={onLogout} className="w-full flex items-center gap-3 text-red-400 hover:text-red-300 p-3 rounded-xl hover:bg-red-400/10">
             <LogOut className="w-5 h-5" /> {t('logout_admin')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
         <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 uppercase tracking-wide">
              {t(`manage_${activeTab}`)} ({getListItems().length})
            </h1>
            <button 
              onClick={startAdd}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-green-700 shadow-md transition-colors"
            >
              <Plus className="w-5 h-5" /> {t('add_new')}
            </button>
         </div>

          {/* ACCOUNTS VIEW */}
          {activeTab === 'accounts' && !editingItem && (
            <div className="space-y-12">
               {/* Restaurants Section */}
               <section>
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                       <Utensils size={20} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Contas Restaurantes</h2>
                 </div>
                 
                 <div className="grid grid-cols-1 gap-6">
                    {restaurants.map(rest => (
                      <div key={rest.id} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                         <div className="p-8">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-100">
                               <div className="flex items-center gap-4">
                                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100">
                                     {rest.image ? <img src={rest.image} className="w-full h-full object-cover" /> : <Utensils className="text-slate-300" />}
                                  </div>
                                  <div>
                                     <h3 className="text-xl font-black text-slate-800">{rest.name}</h3>
                                     <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{rest.island}</p>
                                  </div>
                               </div>
                               
                               <div className="flex gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 items-center">
                                  {editingAdminId === rest.id ? (
                                    <div className="flex gap-2">
                                       <input 
                                         className="border p-1 rounded text-xs w-32" 
                                         value={adminFormData.email} 
                                         onChange={e => setAdminFormData({...adminFormData, email: e.target.value})}
                                         placeholder="Email Admin"
                                       />
                                       <input 
                                         className="border p-1 rounded text-xs w-24" 
                                         value={adminFormData.password} 
                                         onChange={e => setAdminFormData({...adminFormData, password: e.target.value})}
                                         placeholder="Password"
                                       />
                                       <button onClick={() => handleUpdateAdmin(rest.id)} className="bg-blue-600 text-white p-1 rounded"><Save size={14}/></button>
                                       <button onClick={() => setEditingAdminId(null)} className="bg-slate-200 text-slate-600 p-1 rounded"><X size={14}/></button>
                                    </div>
                                  ) : (
                                    <>
                                      <div>
                                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Admin Email</p>
                                         <p className="font-bold text-slate-700">{rest.adminEmail || 'N/A'}</p>
                                      </div>
                                      <div className="border-l border-slate-200 pl-4">
                                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Password</p>
                                         <div className="flex items-center gap-2">
                                            <p className="font-mono font-bold text-blue-600">
                                               {showPassword[rest.id] ? rest.adminPassword : '••••••••'}
                                            </p>
                                            <button 
                                              onClick={() => togglePassword(rest.id)}
                                              className="text-slate-400 hover:text-blue-500 transition-colors"
                                            >
                                               <ImageIcon size={14} />
                                            </button>
                                            <button 
                                              onClick={() => {
                                                setEditingAdminId(rest.id);
                                                setAdminFormData({ email: rest.adminEmail || '', password: rest.adminPassword || '' });
                                              }}
                                              className="text-slate-400 hover:text-blue-500 ml-2"
                                            >
                                               <Edit size={14} />
                                            </button>
                                         </div>
                                      </div>
                                    </>
                                  )}
                               </div>
                            </div>
                            
                            <div className="mt-6">
                               <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-2">
                                     <Users size={16} className="text-slate-400" />
                                     <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Funcionários ({rest.staff?.length || 0})</h4>
                                  </div>
                                  <button 
                                    onClick={() => setAddingStaffToId(rest.id)}
                                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase hover:bg-blue-200 transition-colors"
                                  >
                                    + Adicionar Funcionário
                                  </button>
                               </div>

                               {addingStaffToId === rest.id && (
                                 <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 mb-6 animate-in fade-in slide-in-from-top-2">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                       <input className="bg-white border-none p-3 rounded-xl text-xs shadow-sm" placeholder="Nome" value={staffFormData.name} onChange={e => setStaffFormData({...staffFormData, name: e.target.value})} />
                                       <input className="bg-white border-none p-3 rounded-xl text-xs shadow-sm" placeholder="Email" value={staffFormData.email} onChange={e => setStaffFormData({...staffFormData, email: e.target.value})} />
                                       <input className="bg-white border-none p-3 rounded-xl text-xs shadow-sm" placeholder="Password" value={staffFormData.password} onChange={e => setStaffFormData({...staffFormData, password: e.target.value})} />
                                       <select className="bg-white border-none p-3 rounded-xl text-xs shadow-sm" value={staffFormData.role} onChange={e => setStaffFormData({...staffFormData, role: e.target.value as any})}>
                                          <option value="waiter">Empregado</option>
                                          <option value="chef">Cozinheiro</option>
                                          <option value="manager">Gerente</option>
                                       </select>
                                    </div>
                                    <div className="flex justify-end gap-3 mt-4">
                                       <button onClick={() => setAddingStaffToId(null)} className="px-4 py-2 text-xs font-black uppercase text-slate-400 hover:text-slate-600">Cancelar</button>
                                       <button onClick={() => handleAddStaff(rest.id)} className="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase shadow-lg shadow-blue-500/20">Guardar Funcionário</button>
                                    </div>
                                 </div>
                               )}
                               
                               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {rest.staff && rest.staff.length > 0 ? rest.staff.map((s: any) => (
                                    <div key={s.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center group hover:border-blue-200 transition-all">
                                       <div>
                                          <p className="font-bold text-slate-800 text-sm">{s.name}</p>
                                          <p className="text-[10px] font-black text-slate-400 uppercase">{s.role}</p>
                                       </div>
                                       <div className="text-right flex items-center gap-3">
                                          <div>
                                             <p className="text-[9px] font-mono text-slate-500">{s.email}</p>
                                             <p className="text-[9px] font-mono text-blue-600 font-bold">
                                                {showPassword[s.id] ? s.password : '••••••'}
                                             </p>
                                          </div>
                                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                             <button onClick={() => togglePassword(s.id)} className="p-1 text-slate-400 hover:text-blue-500"><ImageIcon size={12}/></button>
                                             <button onClick={() => handleRemoveStaff(rest.id, s.id)} className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={12}/></button>
                                          </div>
                                       </div>
                                    </div>
                                  )) : (
                                    <p className="text-xs text-slate-400 italic">Nenhum funcionário registado.</p>
                                  )}
                               </div>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
               </section>
             </div>
           )}

           {activeTab === 'suppliers' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 mb-20">
                <div className="flex justify-between items-center bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                   <div>
                     <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Gestão de Fornecedores</h2>
                     <p className="text-slate-400 font-medium italic">Administração de contas de acesso para fornecedores externos</p>
                   </div>
                </div>
 
                <div className="grid grid-cols-1 gap-6">
                   {[...restaurants, ...shops, ...beauty].map(rest => (
                     <div key={rest.id} className="bg-white p-8 rounded-[3rem] shadow-sm space-y-6 border border-slate-100">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-100">
                            <div className="flex items-center gap-4">
                               <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
                                  {rest.name.charAt(0)}
                               </div>
                               <div>
                                  <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">{rest.name}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                     <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-100">
                                        {rest.suppliers?.length || 0} Fornecedores
                                     </span>
                                     <button 
                                       onClick={() => {
                                         setAddingSupplierToId(rest.id);
                                       }}
                                       className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-1"
                                     >
                                       <Plus size={10} /> Adicionar Fornecedor
                                     </button>
                                  </div>
                               </div>
                            </div>
                         </div>

                        {addingSupplierToId === rest.id && (
                          <motion.form 
                            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                            onSubmit={(e) => {
                              e.preventDefault();
                              const fd = new FormData(e.currentTarget);
                              const data = {
                                name: fd.get('name') as string,
                                email: fd.get('email') as string,
                                phone: fd.get('phone') as string,
                                nif: fd.get('nif') as string,
                                address: fd.get('address') as string,
                              };
                              handleAddSupplier(rest.id, data);
                            }}
                            className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 mb-6 overflow-hidden"
                          >
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-black text-blue-400 uppercase ml-2">Nome Empresa</label>
                                  <input name="name" className="w-full bg-white border-none p-3 rounded-xl text-xs shadow-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Peixe Fresco Lda" required />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-black text-blue-400 uppercase ml-2">Email</label>
                                  <input name="email" type="email" className="w-full bg-white border-none p-3 rounded-xl text-xs shadow-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="email@fornecedor.com" required />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-black text-blue-400 uppercase ml-2">Telemóvel</label>
                                  <input name="phone" className="w-full bg-white border-none p-3 rounded-xl text-xs shadow-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+351 ..." required />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-black text-blue-400 uppercase ml-2">NIF</label>
                                  <input name="nif" maxLength={9} className="w-full bg-white border-none p-3 rounded-xl text-xs shadow-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="123456789" required />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-black text-blue-400 uppercase ml-2">Morada</label>
                                  <input name="address" className="w-full bg-white border-none p-3 rounded-xl text-xs shadow-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Rua ..." required />
                                </div>
                             </div>
                             <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setAddingSupplierToId(null)} className="px-6 py-2.5 text-xs font-black uppercase text-slate-400 hover:text-slate-600 transition-colors">Cancelar</button>
                                <button type="submit" className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">Criar Fornecedor</button>
                             </div>
                          </motion.form>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {rest.suppliers && rest.suppliers.length > 0 ? rest.suppliers.map(sup => (
                             <div key={sup.id} className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 relative group hover:border-blue-200 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                   <div>
                                      <p className="font-black text-slate-800">{sup.name}</p>
                                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NIF: {sup.nif}</p>
                                   </div>
                                 {editingSupplierId === sup.id ? (
                                   <form 
                                     onSubmit={(e) => {
                                       e.preventDefault();
                                       const fd = new FormData(e.currentTarget);
                                       handleUpdateSupplier(rest.id, sup.id, {
                                         email: fd.get('email') as string,
                                         password: fd.get('password') as string
                                       });
                                       setEditingSupplierId(null);
                                     }}
                                     className="space-y-3 w-full mt-4"
                                   >
                                      <div>
                                        <label className="text-[9px] font-black text-blue-400 uppercase">Email de Acesso</label>
                                        <input name="email" defaultValue={sup.email} className="w-full bg-white border border-blue-100 p-2.5 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none" required />
                                      </div>
                                      <div>
                                        <label className="text-[9px] font-black text-blue-400 uppercase">Password</label>
                                        <input name="password" defaultValue={sup.password} className="w-full bg-white border border-blue-100 p-2.5 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none" required />
                                      </div>
                                      <div className="flex gap-2 pt-2">
                                         <button type="button" onClick={() => setEditingSupplierId(null)} className="flex-1 py-2 text-[10px] font-black uppercase text-slate-400">Cancelar</button>
                                         <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-blue-500/20">Guardar</button>
                                      </div>
                                   </form>
                                 ) : (
                                   <>
                                      <div className="space-y-2 mb-6">
                                         <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                           <Mail size={14} className="text-slate-300" /> {sup.email}
                                         </div>
                                         <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                           <Lock size={14} className="text-slate-300" /> 
                                           {showPassword[sup.id] ? sup.password || '---' : '••••••••'}
                                         </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <button 
                                         onClick={() => setEditingSupplierId(sup.id)}
                                         className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                                        >
                                          Editar Dados de Acesso
                                        </button>
                                      </div>
                                   </>
                                 )}
                               </div>
                               <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4">
                                  <button onClick={() => setEditingSupplierId(sup.id)} className="p-1 text-slate-400 hover:text-blue-500"><Edit size={14}/></button>
                                  <button onClick={() => togglePassword(sup.id)} className="p-1 text-slate-400 hover:text-blue-500"><ImageIcon size={14}/></button>
                                  <button onClick={() => handleRemoveSupplier(rest.id, sup.id)} className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
                               </div>
                             </div>
                           )) : (
                             <div className="col-span-full py-8 text-center bg-slate-100/50 rounded-[2rem] border border-dashed border-slate-200">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest italic">Sem fornecedores registados.</p>
                             </div>
                           )}
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}

          {/* LIST VIEW */}
          {activeTab !== 'accounts' && activeTab !== 'suppliers' && !editingItem && (
            <div className="space-y-6">
              
              {/* SUBCATEGORY FILTER BAR for Beauty/Shops */}
              {activeTab === 'beauty' && (
                <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                  {[
                    { id: 'all', label: 'Todos', icon: <LayoutDashboard size={18} />, color: '#1A75BB' },
                    { id: 'beauty_salon', label: 'Salões', icon: <Sparkles size={18} />, color: '#FF2D78' },
                    { id: 'hairdresser', label: 'Cabeleireiros', icon: <Scissors size={18} />, color: '#8B5CF6' },
                    { id: 'barber', label: 'Barbeiros', icon: <User size={18} />, color: '#10B981' },
                    { id: 'manicure', label: 'Manicure', icon: <Brush size={18} />, color: '#F59E0B' },
                    { id: 'massage', label: 'Massagens', icon: <Flower2 size={18} />, color: '#EC4899' },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setBeautyFilter(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border
                        ${beautyFilter === cat.id ? 'bg-white text-slate-900 border-slate-200 shadow-md' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
                      style={{ borderBottom: beautyFilter === cat.id ? `3px solid ${cat.color}` : undefined }}
                    >
                      <span style={{ color: cat.color }}>{cat.icon}</span> {cat.label}
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'shops' && (
                <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                  {[
                    { id: 'all', label: 'Todas as Lojas', icon: <LayoutDashboard size={18} />, color: '#1A75BB' },
                    { id: 'crafts', label: 'Artesanato', icon: <ShoppingBag size={18} />, color: '#F59E0B' },
                    { id: 'food', label: 'Gastronomia', icon: <Utensils size={18} />, color: '#10B981' },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setShopsFilter(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border
                        ${shopsFilter === cat.id ? 'bg-white text-slate-900 border-slate-200 shadow-md' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
                      style={{ borderBottom: shopsFilter === cat.id ? `3px solid ${cat.color}` : undefined }}
                    >
                      <span style={{ color: cat.color }}>{cat.icon}</span> {cat.label}
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'hotels' && (
                <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                  {[
                    { id: 'all', label: 'Todos', icon: <LayoutDashboard size={18} />, color: '#1A75BB' },
                    { id: 'hotel', label: 'Hotéis', icon: <BedDouble size={18} />, color: '#1A75BB' },
                    { id: 'al', label: 'AL (Local)', icon: <Home size={18} />, color: '#F59E0B' },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setHotelFilter(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border
                        ${hotelFilter === cat.id ? 'bg-white text-slate-900 border-slate-200 shadow-md' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
                      style={{ borderBottom: hotelFilter === cat.id ? `3px solid ${cat.color}` : undefined }}
                    >
                      <span style={{ color: cat.color }}>{cat.icon}</span> {cat.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {getListItems().map((item: any) => (
               <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col group relative">
                 
                 {/* Image or Icon Placeholder */}
                 <div className="h-32 relative bg-slate-100 flex items-center justify-center">
                   {item.image ? (
                     <img src={item.image} className="w-full h-full object-cover" alt="" />
                   ) : (
                     <ImageIcon className="w-10 h-10 text-slate-300" />
                   )}
                   
                   {/* Action Buttons Overlay */}
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button onClick={() => startEdit(item)} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-500 text-white rounded hover:bg-red-600"><Trash2 className="w-4 h-4" /></button>
                   </div>

                   {/* Badges */}
                   <div className="absolute bottom-2 left-2 flex gap-1">
                     {item.island && <span className="bg-black/60 text-white px-2 py-1 rounded text-xs font-bold">{item.island}</span>}
                     {item.status && <span className="bg-white/90 text-slate-800 px-2 py-1 rounded text-xs font-bold">{item.status}</span>}
                     {item.price && <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">€{item.price}</span>}
                  </div>
                </div>

                <div className="p-4 flex-1">
                  <h3 className="font-bold text-slate-800 leading-tight">{getItemName(item)}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {item.description || item.type || item.company}
                  </p>
                  {activeTab === 'hotels' && item.type && (
                    <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${item.type === 'al' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                       {item.type === 'al' ? 'AL (Local)' : 'Hotel'}
                    </span>
                  )}
                  
                  {/* Credentials Preview for Businesses */}
                  {['restaurants', 'shops', 'beauty'].includes(activeTab) && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        <Mail size={12} className="text-blue-500" /> {item.adminEmail || 'Sem email'}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        <Lock size={12} className="text-blue-500" /> {showPassword[item.id] ? item.adminPassword || '---' : '••••••••'}
                        <button onClick={() => togglePassword(item.id)} className="ml-auto text-blue-500 hover:underline">Ver</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
             ))}
             </div>
           </div>
         )}
         {/* EDIT FORM */}
         {editingItem && (
           <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto border border-slate-200 animate-in fade-in slide-in-from-bottom-4 mb-20">
             <div className="flex justify-between items-center mb-6 pb-4 border-b">
               <h2 className="text-2xl font-bold text-slate-800">{isAddingNew ? t('add_new') : t('edit')}</h2>
               <button 
                  onClick={() => setEditingItem(null)} 
                  className="p-3 bg-white text-slate-800 hover:bg-blue-600 hover:text-white rounded-full transition-all shadow-lg border border-slate-100 group"
                >
                  <X size={20} className="group-active:scale-90 transition-transform" />
                </button>

             </div>

             <form onSubmit={handleSave} className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {renderFormFields()}
               </div>

               <div className="flex gap-4 pt-6 border-t mt-6">
                 <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 flex justify-center items-center gap-2">
                    <Save className="w-5 h-5" /> {t('save')}
                 </button>
                 <button type="button" onClick={() => setEditingItem(null)} className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-300">
                    {t('cancel')}
                 </button>
               </div>
             </form>
           </div>
         )}
      </main>
    </div>
  );
};

export default AdminDashboard;
