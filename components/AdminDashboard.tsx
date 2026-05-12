// Deploy Timestamp: 2026-05-12T21:32

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Restaurant, Activity, Language, Dish, Flight, Hotel, Car, BusSchedule, Business } from '../types';
import { getTranslation } from '../translations';
import { 
  Utensils, Mountain, Edit, Trash2, Plus, Save, X, LogOut, 
  LayoutDashboard, Plane, BedDouble, Car as CarIcon, Bus, 
  Image as ImageIcon, Lock, Users, Cloud as CloudSync,
  ShoppingBag, Mail, MapPin, Phone, Sparkles,
  Scissors, User, Flower2, Brush, ArrowRight, RefreshCw, Home,
  Wrench, Zap, Hammer, Droplets, Paintbrush, HardHat, PencilRuler, 
  ThermometerSnowflake, DraftingCompass, Settings, ShoppingCart, 
  MessageSquare, Dog, Building2, Dumbbell, CarFront, Briefcase, Laptop, Pipette, Calendar, Database,
  CheckCircle, AlertTriangle
} from 'lucide-react';

import * as constants from '../constants';

import { API_BASE_URL } from '../config';

console.log("%c🚀 Azores4you v1.2.1 - Pro Instance Active", "color: #10b981; font-weight: bold; font-size: 14px;");

interface AdminDashboardProps {
  restaurants: Restaurant[];
  shops: Business[];
  beauty: Business[];
  services: Business[];
  autoRepairs: Business[];
  autoElectronics: Business[];
  usedMarket: Business[];
  animals: Business[];
  realEstate: Business[];
  gyms: Business[];
  stands: Business[];
  offices: Business[];
  itServices: Business[];
  perfumes: Business[];
  activities: Activity[];
  flights: Flight[];
  hotels: Hotel[];
  cars: Car[];
  busSchedules: BusSchedule[];
  
  onUpdateRestaurants: (newRestaurants: Restaurant[]) => void;
  onUpdateShops: (newShops: Business[]) => void;
  onUpdateBeauty: (newBeauty: Business[]) => void;
  onUpdateServices: (newServices: Business[]) => void;
  onUpdateAutoRepairs: (newAutoRepairs: Business[]) => void;
  onUpdateAutoElectronics: (newAutoElectronics: Business[]) => void;
  onUpdateUsedMarket: (newUsedMarket: Business[]) => void;
  onUpdateAnimals: (newAnimals: Business[]) => void;
  onUpdateRealEstate: (newRealEstate: Business[]) => void;
  onUpdateGyms: (newGyms: Business[]) => void;
  onUpdateStands: (newStands: Business[]) => void;
  onUpdateOffices: (newOffices: Business[]) => void;
  onUpdateITServices: (newITServices: Business[]) => void;
  onUpdatePerfumes: (newPerfumes: Business[]) => void;
  onUpdateActivities: (list: Activity[]) => void;
  onUpdateFlights: (list: Flight[]) => void;
  onUpdateHotels: (list: Hotel[]) => void;
  onUpdateCars: (list: Car[]) => void;
  onUpdateBusSchedules: (list: BusSchedule[]) => void;

  onLogout: () => void;
  onFullSync?: () => void;
  dbStatus?: any;
  language?: Language;
}

type Tab = 'dashboard' | 'restaurants' | 'shops' | 'beauty' | 'services' | 'auto_repairs' | 'auto_electronics' | 'used_market' | 'animals' | 'real_estate' | 'gyms' | 'stands' | 'offices' | 'it_services' | 'perfumes' | 'activities' | 'trails' | 'flights' | 'hotels' | 'cars' | 'buses' | 'accounts' | 'suppliers';

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  restaurants = [], shops = [], beauty = [], services = [], autoRepairs = [], autoElectronics = [], usedMarket = [], animals = [], realEstate = [], gyms = [], stands = [], offices = [], itServices = [], perfumes = [], activities = [], flights = [], hotels = [], cars = [], busSchedules = [],
  onUpdateRestaurants, onUpdateShops, onUpdateBeauty, onUpdateServices, onUpdateAutoRepairs, onUpdateAutoElectronics, onUpdateUsedMarket, onUpdateAnimals, onUpdateRealEstate, onUpdateGyms, onUpdateStands, onUpdateOffices, onUpdateITServices, onUpdatePerfumes, onUpdateActivities, onUpdateFlights, onUpdateHotels, onUpdateCars, onUpdateBusSchedules,
  onLogout, onFullSync, dbStatus,
  language = 'pt'
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [showOtherTabs, setShowOtherTabs] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [beautyFilter, setBeautyFilter] = useState<string>('all');
  const [shopsFilter, setShopsFilter] = useState<string>('all');
  const [hotelFilter, setHotelFilter] = useState<string>('all');
  const [servicesFilter, setServicesFilter] = useState<string>('all');
  const [autoRepairsFilter, setAutoRepairsFilter] = useState<string>('all');
  
  // Account management states
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);
  const [adminFormData, setAdminFormData] = useState({ email: '', password: '' });
  const [addingStaffToId, setAddingStaffToId] = useState<string | null>(null);
  const [staffFormData, setStaffFormData] = useState({ name: '', email: '', password: '', role: 'waiter' });
  const [addingSupplierToId, setAddingSupplierToId] = useState<string | null>(null);
  const [editingSupplierId, setEditingSupplierId] = useState<string | null>(null);
  const [supplierFormData, setSupplierFormData] = useState({ name: '', email: '', phone: '', nif: '', address: '' });
  const [isUploading, setIsUploading] = useState(false);
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0, label: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [islandFilter, setIslandFilter] = useState<string>('all');
  const [cuisineFilter, setCuisineFilter] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [bulkIsland, setBulkIsland] = useState<string>('PDL');
  const [bulkSubcategory, setBulkSubcategory] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState({ current: 0, total: 0 });
  const [compressionLabel, setCompressionLabel] = useState('');
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [showSyncSelector, setShowSyncSelector] = useState(false);
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);
  const [syncSelection, setSyncSelection] = useState<string[]>([]);
  const [modifiedCategories, setModifiedCategories] = useState<Set<string>>(new Set());

  const handleEmergencyRestore = async () => {
    if (!confirm('🚨 ATENÇÃO: Isto vai substituir os dados do Atlas pelos dados originais do sistema. Continuar?')) return;
    
    setIsSyncing(true);
    addLog('🚒 A iniciar restauro de emergência...');
    
    try {
        // Garantir que acedemos corretamente ao objeto DATA
        const allData = (constants as any).DATA;
        if (!allData) throw new Error('Não foi possível carregar os dados das constantes.');
        
        const data = allData[lang] || allData['pt'];
        if (!data) throw new Error(`Dados para a língua ${lang} não encontrados.`);

        const categories = [
            { key: 'restaurants', label: 'Restaurantes', items: data.restaurants || [] },
            { key: 'hotels', label: 'Alojamentos', items: data.hotels || [] },
            { key: 'activities', label: 'Atividades', items: data.activities || [] },
            { key: 'cars', label: 'Rentcar', items: data.cars || [] },
            { key: 'shops', label: 'Lojas', items: data.shops || [] },
            { key: 'beauty', label: 'Beleza', items: data.beauty || [] },
            { key: 'services', label: 'Serviços', items: data.services || [] },
            { key: 'auto_repairs', label: 'Reparação Auto', items: data.auto_repair || [] },
            { key: 'auto_electronics', label: 'Eletrónica Auto', items: data.auto_electronics || [] },
            { key: 'used_market', label: 'Mercado Usados', items: data.used_market || [] },
            { key: 'animals', label: 'Animais', items: data.animals || [] },
            { key: 'real_estate', label: 'Imobiliária', items: data.real_estate || [] },
            { key: 'gyms', label: 'Ginásios', items: data.gyms || [] },
            { key: 'stands', label: 'Stands', items: data.stands || [] },
            { key: 'offices', label: 'Escritórios', items: data.offices || [] },
            { key: 'it_services', label: 'Informática', items: data.it_services || [] },
            { key: 'perfumes', label: 'Perfumaria', items: data.perfumes || [] }
        ];

        for (const cat of categories) {
            addLog(`📤 A enviar ${cat.label}...`);
            const res = await fetch(`${API_BASE_URL}/api/${cat.key}/bulk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cat.items)
            });
            if (!res.ok) throw new Error(`Falha em ${cat.label}`);
        }
        
        addLog('✨ Restauro concluído! A atualizar página...');
        alert('✅ Dados restaurados com sucesso! A página vai recarregar.');
        window.location.reload();
    } catch (err: any) {
        addLog(`❌ Erro no restauro: ${err.message}`);
        alert('Erro ao restaurar: ' + err.message);
    } finally {
        setIsSyncing(false);
    }
  };

  useEffect(() => {
    setSelectedIds([]);
  }, [activeTab, islandFilter, beautyFilter, shopsFilter, hotelFilter, servicesFilter, autoRepairsFilter]);

  const togglePassword = (id: string) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    const currentItems = getListItems();
    const currentIds = currentItems.map(i => i.id);
    if (currentIds.length === 0) return;
    
    const allSelected = currentIds.every(id => selectedIds.includes(id));
    
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !currentIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...currentIds])));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Deseja apagar os ${selectedIds.length} itens selecionados?`)) return;

    const filterList = (list: any[]) => list.filter(item => !selectedIds.includes(item.id));

    switch (activeTab) {
      case 'restaurants': onUpdateRestaurants(filterList(restaurants)); break;
      case 'shops': onUpdateShops(filterList(shops)); break;
      case 'beauty': onUpdateBeauty(filterList(beauty)); break;
      case 'services': onUpdateServices(filterList(services)); break;
      case 'auto_repairs': onUpdateAutoRepairs(filterList(autoRepairs)); break;
      case 'auto_electronics': onUpdateAutoElectronics(filterList(autoElectronics)); break;
      case 'used_market': onUpdateUsedMarket(filterList(usedMarket)); break;
      case 'animals': onUpdateAnimals(filterList(animals)); break;
      case 'real_estate': onUpdateRealEstate(filterList(realEstate)); break;
      case 'gyms': onUpdateGyms(filterList(gyms)); break;
      case 'stands': onUpdateStands(filterList(stands)); break;
      case 'offices': onUpdateOffices(filterList(offices)); break;
      case 'it_services': onUpdateITServices(filterList(itServices)); break;
      case 'perfumes': onUpdatePerfumes(filterList(perfumes)); break;
      case 'activities': onUpdateActivities(filterList(activities)); break;
      case 'flights': onUpdateFlights(filterList(flights)); break;
      case 'hotels': onUpdateHotels(filterList(hotels)); break;
      case 'cars': onUpdateCars(filterList(cars)); break;
      case 'buses': onUpdateBusSchedules(filterList(busSchedules)); break;
    }

    setSelectedIds([]);
    alert(`${selectedIds.length} itens removidos com sucesso!`);
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
    if (restaurants.some(r => r.id === restId)) onUpdateRestaurants(findAndAdd(restaurants));
    else if (shops.some(s => s.id === restId)) onUpdateShops(findAndAdd(shops));
    else if (beauty.some(b => b.id === restId)) onUpdateBeauty(findAndAdd(beauty));
    setAddingStaffToId(null);
    setStaffFormData({ name: '', email: '', password: '', role: 'waiter' });
    alert('Funcionário adicionado com sucesso!');
  };

  const handleRemoveStaff = (restId: string, staffId: string) => {
    if (!window.confirm('Remover este funcionário?')) return;
    const findAndRemove = (list: any[]) => list.map(r => r.id === restId ? { ...r, staff: (r.staff || []).filter((s: any) => s.id !== staffId) } : r);
    if (restaurants.some(r => r.id === restId)) onUpdateRestaurants(findAndRemove(restaurants));
    else if (shops.some(s => s.id === restId)) onUpdateShops(findAndRemove(shops));
    else if (beauty.some(b => b.id === restId)) onUpdateBeauty(findAndRemove(beauty));
  };
  
  const handleAddSupplier = (restId: string, data: any) => {
    const newSup = {
      id: `SUP_${Date.now()}`,
      ...data,
      password: Math.random().toString(36).slice(-8)
    };
    const findAndAddSup = (list: any[]) => list.map(r => r.id === restId ? { ...r, suppliers: [...(r.suppliers || []), newSup] } : r);
    if (restaurants.some(r => r.id === restId)) onUpdateRestaurants(findAndAddSup(restaurants));
    else if (shops.some(s => s.id === restId)) onUpdateShops(findAndAddSup(shops));
    else if (beauty.some(b => b.id === restId)) onUpdateBeauty(findAndAddSup(beauty));
    setAddingSupplierToId(null);
    alert('Fornecedor adicionado com sucesso!');
  };

  const handleUpdateSupplier = (restId: string, supId: string, data: any) => {
    const findAndUpdateSup = (list: any[]) => list.map(r => r.id === restId ? { ...r, suppliers: r.suppliers?.map(s => s.id === supId ? { ...s, ...data } : s) } : r);
    if (restaurants.some(r => r.id === restId)) onUpdateRestaurants(findAndUpdateSup(restaurants));
    else if (shops.some(s => s.id === restId)) onUpdateShops(findAndUpdateSup(shops));
    else if (beauty.some(b => b.id === restId)) onUpdateBeauty(findAndUpdateSup(beauty));
    setEditingSupplierId(null);
    alert('Fornecedor atualizado com sucesso!');
  };

  const handleRemoveSupplier = (restId: string, supId: string) => {
    if (!window.confirm('Remover este fornecedor?')) return;
    const findAndRemoveSup = (list: any[]) => list.map(r => r.id === restId ? { ...r, suppliers: (r.suppliers || []).filter((s: any) => s.id !== supId) } : r);
    if (restaurants.some(r => r.id === restId)) onUpdateRestaurants(findAndRemoveSup(restaurants));
    else if (shops.some(s => s.id === restId)) onUpdateShops(findAndRemoveSup(shops));
    else if (beauty.some(b => b.id === restId)) onUpdateBeauty(findAndRemoveSup(beauty));
  };

  // -- CRUD HANDLERS --

  const handleDelete = (id: string) => {
    if (!window.confirm('Tem a certeza que deseja apagar este item?')) return;
    
    switch (activeTab) {
      case 'restaurants': onUpdateRestaurants(restaurants.filter(r => r.id !== id)); break;
      case 'shops': onUpdateShops(shops.filter(s => s.id !== id)); break;
      case 'beauty': onUpdateBeauty(beauty.filter(b => b.id !== id)); break;
      case 'services': onUpdateServices(services.filter(s => s.id !== id)); break;
      case 'auto_repairs': onUpdateAutoRepairs(autoRepairs.filter(a => a.id !== id)); break;
      case 'auto_electronics': onUpdateAutoElectronics(autoElectronics.filter(a => a.id !== id)); break;
      case 'used_market': onUpdateUsedMarket(usedMarket.filter(u => u.id !== id)); break;
      case 'animals': onUpdateAnimals(animals.filter(a => a.id !== id)); break;
      case 'real_estate': onUpdateRealEstate(realEstate.filter(r => r.id !== id)); break;
      case 'gyms': onUpdateGyms(gyms.filter(g => g.id !== id)); break;
      case 'stands': onUpdateStands(stands.filter(s => s.id !== id)); break;
      case 'offices': onUpdateOffices(offices.filter(o => o.id !== id)); break;
      case 'it_services': onUpdateITServices(itServices.filter(i => i.id !== id)); break;
      case 'perfumes': onUpdatePerfumes(perfumes.filter(p => p.id !== id)); break;
      case 'activities': onUpdateActivities(activities.filter(a => a.id !== id)); break;
      case 'flights': onUpdateFlights(flights.filter(f => f.id !== id)); break;
      case 'hotels': onUpdateHotels(hotels.filter(h => h.id !== id)); break;
      case 'cars': onUpdateCars(cars.filter(c => c.id !== id)); break;
      case 'buses': onUpdateBusSchedules(busSchedules.filter(b => b.id !== id)); break;
    }
    setModifiedCategories(prev => new Set(prev).add(activeTab));
  };

  const smartParseLine = (line: string) => {
    let name = line;
    let email = '';
    let contact = '';
    let address = '';

    // Extract Email
    const emailMatch = line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      email = emailMatch[0];
      name = name.replace(email, '').trim();
    }

    // Extract Phone (PT formats and international)
    const phoneMatch = line.match(/(\+\d{1,3}[-.\s]?)?(\d{9}|\d{3}[-.\s]?\d{3}[-.\s]?\d{3})/);
    if (phoneMatch) {
      contact = phoneMatch[0];
      name = name.replace(contact, '').trim();
    }

    // Extract Address using delimiters or keywords
    const parts = name.split(/[|;]/).map(p => p.trim());
    if (parts.length > 1) {
      name = parts[0];
      address = parts[1];
    } else {
      const addressKeywords = ['Rua', 'Avenida', 'Av.', 'Largo', 'Estrada', 'Caminho', 'Urbanização', 'R.', 'Travessa', 'Acesso'];
      const lowerName = name.toLowerCase();
      let foundIndex = -1;
      for (const kw of addressKeywords) {
        const idx = lowerName.indexOf(kw.toLowerCase());
        if (idx !== -1 && (foundIndex === -1 || idx < foundIndex)) {
          foundIndex = idx;
        }
      }
      if (foundIndex !== -1) {
        address = name.substring(foundIndex).trim();
        name = name.substring(0, foundIndex).replace(/[,-]$/, '').trim();
      }
    }

    // Final cleanup of Name
    name = name.replace(/^[-|;,\s]+|[-|;,\s]+$/g, '').trim();

    return { name, email, contact, address };
  };

  const handleBulkAdd = async () => {
    if (!bulkText.trim() || isSaving) return;
    setIsSaving(true);
    const timestamp = Date.now();

    // Split into blocks separated by blank lines
    // Each block = one business entry
    const blocks = bulkText
      .split(/\n\s*\n/) // split on blank lines
      .map(block => block.trim())
      .filter(block => block.length > 0);

    const newItems = blocks.map((block, idx) => {
      const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      
      // First line = name of the business
      const nameRaw = lines[0] || 'Sem Nome';
      
      // Remaining lines = contact/address info - merge and parse together
      const contactBlock = lines.slice(1).join(' ');
      
      // Parse contact block for email, phone, address
      const { email, contact, address } = smartParseLine(contactBlock);
      
      // Clean the name (remove any accidental contact info from name line too)
      const { name: cleanName } = smartParseLine(nameRaw);
      const name = cleanName || nameRaw;

      const id = `${activeTab.substring(0,3).toUpperCase()}${timestamp}${idx}`;
      
      switch (activeTab) {
        case 'activities':
          return { id, title: name, type: bulkSubcategory || 'trail', island: bulkIsland, image: '', description: address || '', isPaid: false, price: 0, mapUrl: '' };
        case 'flights':
          return { id, airline: name, flightNumber: '---', origin: 'LIS', destination: bulkIsland, departureTime: '00:00', arrivalTime: '00:00', price: 0, status: 'A Horas', stops: 0, duration: '' };
        case 'hotels':
          return { id, name, island: bulkIsland, stars: 4, pricePerNight: 0, image: '', description: '', type: bulkSubcategory || 'hotel', mapUrl: '', email, phone: contact, address };
        case 'cars':
          return { 
            id, name, island: bulkIsland, address, email, contact, image: '', 
            description: '', adminEmail: '', adminPassword: '', cars: [] 
          };
        default:
          return { 
            id, name, island: bulkIsland, rating: 4.5, reviews: 0, image: '', description: '', 
            adminEmail: '', adminPassword: '', subcategory: bulkSubcategory, dishes: [], services: [], mapUrl: '',
            address, phone: contact, publicEmail: email
          };
      }
    });

    try {
      switch (activeTab) {
        case 'restaurants': await onUpdateRestaurants([...restaurants, ...newItems]); break;
        case 'shops': await onUpdateShops([...shops, ...newItems]); break;
        case 'beauty': await onUpdateBeauty([...beauty, ...newItems]); break;
        case 'services': await onUpdateServices([...services, ...newItems]); break;
        case 'auto_repairs': await onUpdateAutoRepairs([...autoRepairs, ...newItems]); break;
        case 'auto_electronics': await onUpdateAutoElectronics([...autoElectronics, ...newItems]); break;
        case 'used_market': await onUpdateUsedMarket([...usedMarket, ...newItems]); break;
        case 'animals': await onUpdateAnimals([...animals, ...newItems]); break;
        case 'real_estate': await onUpdateRealEstate([...realEstate, ...newItems]); break;
        case 'gyms': await onUpdateGyms([...gyms, ...newItems]); break;
        case 'stands': await onUpdateStands([...stands, ...newItems]); break;
        case 'offices': await onUpdateOffices([...offices, ...newItems]); break;
        case 'it_services': await onUpdateITServices([...itServices, ...newItems]); break;
        case 'perfumes': await onUpdatePerfumes([...perfumes, ...newItems]); break;
        case 'activities': await onUpdateActivities([...activities, ...newItems]); break;
        case 'flights': await onUpdateFlights([...flights, ...newItems]); break;
        case 'hotels': await onUpdateHotels([...hotels, ...newItems]); break;
        case 'cars': await onUpdateCars([...cars, ...newItems]); break;
        case 'buses': await onUpdateBusSchedules([...busSchedules, ...newItems]); break;
      }

      setBulkText('');
      setShowBulkAdd(false);
      setModifiedCategories(prev => new Set(prev).add(activeTab));
      alert(`✅ ${newItems.length} itens adicionados e guardados no servidor com sucesso!`);
    } catch (e) {
      alert('❌ Erro ao guardar lista em massa.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || isSaving) return;
    setIsSaving(true);

    try {
      const updatedItem = { ...editingItem };
      
      // Helper to add or update item in local list (NO SERVER SYNC HERE)
      const updateLocal = (list: any[], setter: (l: any[]) => void) => {
        if (isAddingNew) {
          if (!updatedItem.id) updatedItem.id = `${activeTab.substring(0,3).toUpperCase()}${Date.now()}`;
          setter([...list, updatedItem]);
        } else {
          setter(list.map(item => item.id === updatedItem.id ? updatedItem : item));
        }
      };

      switch (activeTab) {
        case 'restaurants': updateLocal(restaurants, onUpdateRestaurants); break;
        case 'shops': updateLocal(shops, onUpdateShops); break;
        case 'beauty': updateLocal(beauty, onUpdateBeauty); break;
        case 'services': updateLocal(services, onUpdateServices); break;
        case 'auto_repairs': updateLocal(autoRepairs, onUpdateAutoRepairs); break;
        case 'auto_electronics': updateLocal(autoElectronics, onUpdateAutoElectronics); break;
        case 'used_market': updateLocal(usedMarket, onUpdateUsedMarket); break;
        case 'animals': updateLocal(animals, onUpdateAnimals); break;
        case 'real_estate': updateLocal(realEstate, onUpdateRealEstate); break;
        case 'gyms': updateLocal(gyms, onUpdateGyms); break;
        case 'stands': updateLocal(stands, onUpdateStands); break;
        case 'offices': updateLocal(offices, onUpdateOffices); break;
        case 'it_services': updateLocal(itServices, onUpdateITServices); break;
        case 'perfumes': updateLocal(perfumes, onUpdatePerfumes); break;
        case 'activities': updateLocal(activities, onUpdateActivities); break;
        case 'flights': updateLocal(flights, onUpdateFlights); break;
        case 'hotels': updateLocal(hotels, onUpdateHotels); break;
        case 'cars': updateLocal(cars, onUpdateCars); break;
        case 'buses': updateLocal(busSchedules, onUpdateBusSchedules); break;
      }

      setEditingItem(null);
      setIsAddingNew(false);
      setModifiedCategories(prev => new Set(prev).add(activeTab));
      alert('✅ Alterações guardadas localmente. Clique no botão verde para enviar para o servidor.');
    } catch (err: any) {
      alert('❌ Erro: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const compressImage = (base64Str: string, maxWidth = 1000, quality = 0.5): Promise<string> => {
    return new Promise((resolve) => {
      if (!base64Str || !base64Str.startsWith('data:image')) {
        resolve(base64Str);
        return;
      }
      
      const timeout = setTimeout(() => resolve(base64Str), 5000);

      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        clearTimeout(timeout);
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        // Optimized for WebP as requested by user
        resolve(canvas.toDataURL('image/webp', quality));
      };
      img.onerror = () => {
        clearTimeout(timeout);
        resolve(base64Str);
      };
    });
  };

  const compressObjectImages = async (obj: any) => {
    if (!obj || typeof obj !== 'object') return obj;
    const newObj = Array.isArray(obj) ? [...obj] : { ...obj };

    for (const key in newObj) {
      const value = newObj[key];
      if (typeof value === 'string' && value.startsWith('data:image')) {
        newObj[key] = await compressImage(value);
      } else if (typeof value === 'object' && value !== null) {
        newObj[key] = await compressObjectImages(value);
      }
    }
    return newObj;
  };

  const addLog = (msg: string) => {
    setSyncLogs(prev => [msg, ...prev].slice(0, 50));
    console.log(msg);
  };

  const handleSyncAndCompress = async () => {
    if (!onFullSync) return;
    if (syncSelection.length === 0) {
      alert('Por favor, selecione pelo menos uma categoria para publicar.');
      return;
    }

    setIsCompressing(true);
    setShowSyncSelector(false); // Close selector when starting
    setSyncLogs([]);
    addLog('🚀 A iniciar processo de sincronização seletiva...');
    
    const allLists = [
      { data: restaurants, label: 'restaurants', title: 'Restaurantes' },
      { data: shops, label: 'shops', title: 'Lojas' },
      { data: beauty, label: 'beauty', title: 'Beleza' },
      { data: hotels, label: 'hotels', title: 'Alojamentos' },
      { data: cars, label: 'cars', title: 'Rentcar' },
      { data: activities, label: 'activities', title: 'Atividades' },
      { data: services, label: 'services', title: 'Serviços' },
      { data: autoRepairs, label: 'auto_repairs', title: 'Reparação Auto' },
      { data: autoElectronics, label: 'auto_electronics', title: 'Eletrónica Auto' },
      { data: usedMarket, label: 'used_market', title: 'Mercado Usados' },
      { data: animals, label: 'animals', title: 'Animais' },
      { data: realEstate, label: 'real_estate', title: 'Imobiliária' },
      { data: gyms, label: 'gyms', title: 'Ginásios' },
      { data: stands, label: 'stands', title: 'Stands' },
      { data: offices, label: 'offices', title: 'Escritórios' },
      { data: itServices, label: 'it_services', title: 'Informática' },
      { data: perfumes, label: 'perfumes', title: 'Perfumaria' },
      { data: flights, label: 'flights', title: 'Voos' },
      { data: busSchedules, label: 'bus-schedules', title: 'Autocarros' }
    ];

    // Filter based on user selection
    const lists = allLists.filter(l => syncSelection.includes(l.label));

    const totalItems = lists.reduce((sum, l) => sum + l.data.length, 0);
    setCompressionProgress({ current: 0, total: totalItems });

    try {
      addLog(`📦 Iniciando sincronização incremental de ${totalItems} itens...`);
      
      let processedCount = 0;

      for (const listObj of lists) {
        addLog(`📂 Categoria: ${listObj.title}...`);
        
        for (let i = 0; i < listObj.data.length; i++) {
          const item = listObj.data[i];
          const itemName = item.name || item.title || item.id;
          
          setCompressionLabel(`A enviar (${i+1}/${listObj.data.length}): ${itemName}`);
          
          // Enviar item individualmente para modo INCREMENTAL (Merge)
          const response = await fetch(`${API_BASE_URL}/api/${listObj.label}?mode=merge`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
          });
          
          if (!response.ok) {
             const errorText = await response.text();
             throw new Error(`Erro ao enviar ${itemName}: ${errorText}`);
          }
          
          processedCount++;
          setCompressionProgress({ current: processedCount, total: totalItems });
        }
        
        addLog(`✅ Categoria ${listObj.title} concluída.`);
      }
      
      setCompressionLabel('Sincronização concluída com sucesso!');
      addLog('✨ SUCESSO: Todos os itens foram verificados e sincronizados!');
      
      await onFullSync(); 
      setModifiedCategories(prev => {
        const next = new Set(prev);
        lists.forEach(l => next.delete(l.label));
        return next;
      });
      
      setShowSyncSuccess(true);
      setTimeout(() => setShowSyncSuccess(false), 5000); 
    } catch (e: any) {
      addLog(`❌ ERRO: ${e.message}`);
      alert('❌ Erro na publicação: ' + e.message);
    } finally {
      setIsCompressing(false);
      setCompressionLabel('');
    }
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
      case 'shops':
      case 'beauty':
      case 'services':
      case 'auto_repairs':
      case 'auto_electronics':
      case 'used_market':
      case 'animals':
      case 'real_estate':
      case 'gyms':
      case 'stands':
      case 'offices':
      case 'it_services':
      case 'perfumes':
        newItem = { 
          id: `${activeTab.substring(0,3).toUpperCase()}${timestamp}`, 
          name: '', 
          island: 'PDL', 
          rating: 4.5, 
          reviews: 0, 
          image: '', 
          description: '', 
          adminEmail: '',
          adminPassword: '',
          subcategory: '',
          dishes: [],
          services: [],
          mapUrl: ''
        };
        break;
      case 'activities':
        newItem = { id: `ACT${timestamp}`, title: '', type: 'trail', island: 'PDL', image: '', description: '', distance: '', duration: '', difficulty: 'Moderado', isPaid: false, price: 0, mapUrl: '' };
        break;
      case 'flights':
        newItem = { id: `FLI${timestamp}`, airline: '', flightNumber: '', origin: 'LIS', destination: 'PDL', departureTime: '00:00', arrivalTime: '00:00', price: 0, status: 'A Horas', stops: 0, duration: '' };
        break;
      case 'hotels':
        newItem = { id: `HOT${timestamp}`, name: '', island: 'PDL', stars: 4, pricePerNight: 0, image: '', description: '', type: hotelFilter !== 'all' ? hotelFilter : 'hotel', mapUrl: '' };
        break;
      case 'cars':
        newItem = { 
          id: `RC${timestamp}`, 
          name: '', 
          island: 'PDL', 
          address: '', 
          email: '', 
          contact: '', 
          image: '', 
          description: '', 
          adminEmail: '', 
          adminPassword: '', 
          cars: [] 
        };
        break;
      case 'buses':
        newItem = { id: `BUS${timestamp}`, company: '', island: 'PDL', origin: '', destination: '', times: [], price: 0, duration: '' };
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

  const addCar = () => {
    const newCar: Car = { 
      id: `C${Date.now()}`, 
      model: 'Novo Modelo', 
      companyId: editingItem.id, 
      type: 'Económico', 
      fuelType: 'Gasolina', 
      pricePerDay: 40, 
      image: '', 
      seats: 5, 
      isAvailable: true, 
      description: 'Descrição do veículo...', 
      features: ['A/C', 'Manual'] 
    };
    setEditingItem({ ...editingItem, cars: [...(editingItem.cars || []), newCar] });
  };

  const updateCar = (index: number, field: keyof Car, value: any) => {
    const newCars = [...(editingItem.cars || [])];
    newCars[index] = { ...newCars[index], [field]: value };
    setEditingItem({ ...editingItem, cars: newCars });
  };

  const removeCar = (index: number) => {
    setEditingItem({ ...editingItem, cars: (editingItem.cars || []).filter((_:any, i:number) => i !== index) });
  };

  const addRoom = () => {
    if (!editingItem) return;
    const newRoom: Room = {
      id: `R${Date.now()}`,
      name: 'Novo Quarto',
      description: 'Descrição do quarto...',
      pricePerNight: 100,
      image: '',
      capacity: 2,
      gallery: []
    };
    setEditingItem({ ...editingItem, rooms: [...(editingItem.rooms || []), newRoom] });
  };

  const updateRoom = (index: number, field: keyof Room, value: any) => {
    if (!editingItem) return;
    const newRooms = [...(editingItem.rooms || [])];
    newRooms[index] = { ...newRooms[index], [field]: value };
    setEditingItem({ ...editingItem, rooms: newRooms });
  };

  const removeRoom = (index: number) => {
    if (!editingItem) return;
    setEditingItem({ ...editingItem, rooms: (editingItem.rooms || []).filter((_:any, i:number) => i !== index) });
  };

  const applyStandardRooms = () => {
    if (!editingItem) return;
    const basePrice = editingItem.pricePerNight || 100;
    const standardRooms: Room[] = [
      {
        id: `RM_${editingItem.id}_001`,
        name: "Duplo Standard",
        pricePerNight: basePrice,
        capacity: 2,
        image: "",
        gallery: [],
        description: "Quarto de 28m² com Varanda, Vista cidade, Banheira, Ar condicionado, Casa de banho privativa, Televisão de ecrã plano, Insonorização, Máquina de café, Minibar e Wi-Fi gratuito."
      },
      {
        id: `RM_${editingItem.id}_002`,
        name: "Duplo com Vista Mar",
        pricePerNight: Math.round(basePrice * 1.2),
        capacity: 2,
        image: "",
        gallery: [],
        description: "Quarto de 28m² com 1 cama de casal grande, Varanda, Vista mar, Vista piscina, Banheira, Ar condicionado, Casa de banho privativa, Televisão de ecrã plano, Insonorização, Terraço, Máquina de café, Minibar e Wi-Fi gratuito."
      },
      {
        id: `RM_${editingItem.id}_003`,
        name: "Individual Standard",
        pricePerNight: Math.round(basePrice * 0.85),
        capacity: 1,
        image: "",
        gallery: [],
        description: "Quarto de 28m² com Varanda, Vista cidade, Banheira, Ar condicionado, Casa de banho privativa, Televisão de ecrã plano, Insonorização, Máquina de café, Minibar e Wi-Fi gratuito."
      }
    ];
    setEditingItem({ ...editingItem, rooms: standardRooms });
  };

  const moveGalleryImage = (fromIndex: number, toIndex: number) => {
    if (!editingItem || !editingItem.gallery) return;
    if (toIndex < 0 || toIndex >= editingItem.gallery.length) return;
    const newGallery = [...editingItem.gallery];
    const [moved] = newGallery.splice(fromIndex, 1);
    newGallery.splice(toIndex, 0, moved);
    setEditingItem({ ...editingItem, gallery: newGallery });
  };

  const handleImageUpload = async (files: FileList | File[] | File, type: 'main' | 'gallery' | 'dish' | 'car' | 'room_main' | 'room_gallery', extraIndex?: number, roomGalleryIndex?: number) => {
    if (!editingItem) return;
    
    let fileArray: File[] = [];
    if (files instanceof FileList) {
      fileArray = Array.from(files);
    } else if (Array.isArray(files)) {
      fileArray = files;
    } else {
      fileArray = [files];
    }

    if (fileArray.length === 0) return;

    setIsUploading(true);
    setUploadProgress({ current: 0, total: fileArray.length, label: 'Iniciando processamento...' });
    
    try {
      let count = 0;
      for (const file of fileArray) {
        count++;
        setUploadProgress({ 
          current: count, 
          total: fileArray.length, 
          label: `A processar ficheiro ${count} de ${fileArray.length}...` 
        });

        let finalImage: any = file;
        // Converter para Base64 para compressão
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        // Sempre comprimir e converter para WebP
        const finalUrl = await compressImage(base64);

        // Atualizar estado conforme o tipo
        if (type === 'main') {
          setEditingItem(prev => ({ ...prev, image: finalUrl }));
        } else if (type === 'gallery') {
          setEditingItem(prev => ({ 
            ...prev, 
            gallery: [...(prev.gallery || []), finalUrl] 
          }));
        } else if (type === 'dish' && extraIndex !== undefined) {
          setEditingItem(prev => {
            const dishes = [...(prev.dishes || [])];
            dishes[extraIndex] = { ...dishes[extraIndex], image: finalUrl };
            return { ...prev, dishes };
          });
        } else if (type === 'car' && extraIndex !== undefined) {
          setEditingItem(prev => {
            const cars = [...(prev.cars || [])];
            cars[extraIndex] = { ...cars[extraIndex], image: finalUrl };
            return { ...prev, cars };
          });
        } else if (type === 'room_main' && extraIndex !== undefined) {
          setEditingItem(prev => {
            const rooms = [...(prev.rooms || [])];
            rooms[extraIndex] = { ...rooms[extraIndex], image: finalUrl };
            return { ...prev, rooms };
          });
        } else if (type === 'room_gallery' && extraIndex !== undefined) {
          setEditingItem(prev => {
            const rooms = [...(prev.rooms || [])];
            const roomGallery = [...(rooms[extraIndex].gallery || [])];
            rooms[extraIndex] = { ...rooms[extraIndex], gallery: [...roomGallery, finalUrl] };
            return { ...prev, rooms };
          });
        } else if (type === 'activity_gallery') {
          setEditingItem(prev => ({ 
            ...prev, 
            gallery: [...(prev.gallery || []), finalUrl] 
          }));
        }
      }
      setUploadProgress({ current: fileArray.length, total: fileArray.length, label: 'Concluído!' });
      setTimeout(() => setIsUploading(false), 1000);
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Erro ao carregar uma ou mais imagens.');
      setIsUploading(false);
    }
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
    // Handle Category Slider Configuration separately
    if (editingItem.type === 'config_slider') {
      return (
        <div className="md:col-span-2 space-y-6">
          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-center justify-between">
            <div>
               <h4 className="text-xl font-black text-blue-900 uppercase tracking-tighter">{editingItem.title}</h4>
               <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mt-1">Carregue as fotos que aparecerão no topo desta categoria</p>
            </div>
            <label className={`cursor-pointer px-8 py-3 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${isUploading ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'}`}>
               {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
               Adicionar Fotos
               <input type="file" className="hidden" multiple accept="image/*,.webp" onChange={e => e.target.files && handleImageUpload(e.target.files, 'activity_gallery')} disabled={isUploading} />
            </label>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {editingItem.gallery?.map((img: string, idx: number) => (
              <div key={idx} className="relative group aspect-video rounded-2xl overflow-hidden border-2 border-white shadow-lg">
                <img src={img} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                   <button type="button" onClick={() => setEditingItem({...editingItem, gallery: editingItem.gallery.filter((_:any, i:number) => i !== idx)})} className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all"><Trash2 className="w-5 h-5" /></button>
                </div>
              </div>
            ))}
          </div>
          
          {(!editingItem.gallery || editingItem.gallery.length === 0) && (
            <div className="py-20 border-4 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center text-slate-300">
               <ImageIcon size={64} className="mb-4 opacity-20" />
               <p className="font-black uppercase tracking-widest text-sm">Nenhuma foto carregada</p>
               <p className="text-xs mt-2">Use o botão acima para começar</p>
            </div>
          )}
        </div>
      );
    }

    switch (activeTab) {
      case 'restaurants':
      case 'shops':
      case 'beauty':
      case 'services':
      case 'auto_repairs':
      case 'auto_electronics':
      case 'used_market':
      case 'animals':
      case 'real_estate':
      case 'gyms':
      case 'stands':
      case 'offices':
      case 'it_services':
      case 'perfumes':
        return (
          <>
            {commonInput(t('item_name'), 'name')}
            {islandSelect()}
            {activeTab === 'restaurants' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Tipo de Cozinha</label>
                <select 
                  className="w-full border p-2 rounded-lg bg-white font-bold"
                  value={editingItem.cuisine || 'Regional'}
                  onChange={e => setEditingItem({...editingItem, cuisine: e.target.value})}
                >
                  <option value="Regional">Regional (Açoriana)</option>
                  <option value="Portuguesa">Portuguesa</option>
                  <option value="Italiana">Italiana</option>
                  <option value="Pizzaria">Pizzaria</option>
                  <option value="Chinesa">Chinesa</option>
                  <option value="Japonesa">Japonesa / Sushi</option>
                  <option value="Mexicana">Mexicana</option>
                  <option value="Americana">Americana / Fast Food</option>
                  <option value="Hamburgueria">Hamburgueria</option>
                  <option value="Vegetariana">Vegetariana</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Marisco">Marisco</option>
                  <option value="Peixe Fresco">Peixe Fresco</option>
                  <option value="Churrasco">Churrasco / Grelhados</option>
                  <option value="Mediterrânica">Mediterrânica</option>
                  <option value="Francesa">Francesa</option>
                  <option value="Indiana">Indiana</option>
                  <option value="Tailandesa">Tailandesa</option>
                  <option value="Brasileira">Brasileira</option>
                  <option value="Snack-Bar">Snack-Bar / Petiscos</option>
                  <option value="Pastelaria">Pastelaria / Café</option>
                  <option value="Gourmet">Gourmet / Autor</option>
                </select>
              </div>
            )}
            
            {/* Subcategory selection based on Tab */}
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
                  <option value="food">Produtos Regionais</option>
                </select>
              </div>
            )}
            {activeTab === 'auto_repairs' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subcategoria</label>
                <select className="w-full border p-2 rounded-lg bg-white font-bold" value={editingItem.subcategory} onChange={e => setEditingItem({...editingItem, subcategory: e.target.value})}>
                  <option value="parts">Peças</option>
                  <option value="workshop">Oficina</option>
                  <option value="bodywork">Bate-chapas</option>
                  <option value="electric">Elétrica</option>
                </select>
              </div>
            )}
            {activeTab === 'auto_electronics' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subcategoria</label>
                <select className="w-full border p-2 rounded-lg bg-white font-bold" value={editingItem.subcategory} onChange={e => setEditingItem({...editingItem, subcategory: e.target.value})}>
                  <option value="audio">Áudio & Som</option>
                  <option value="alarms">Alarmes</option>
                  <option value="navigation">Navegação/GPS</option>
                  <option value="diagnostics">Diagnóstico</option>
                </select>
              </div>
            )}
            {activeTab === 'services' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subcategoria</label>
                <select className="w-full border p-2 rounded-lg bg-white font-bold" value={editingItem.subcategory} onChange={e => setEditingItem({...editingItem, subcategory: e.target.value})}>
                  <option value="electrician">Eletricista</option>
                  <option value="mason">Pedreiro</option>
                  <option value="carpenter">Carpinteiro</option>
                  <option value="plumber">Canalizador</option>
                  <option value="painter">Pintor</option>
                  <option value="gardening">Jardinagem</option>
                  <option value="architect">Arquiteto</option>
                  <option value="engineer">Engenheiro</option>
                  <option value="hvac">Climatização</option>
                </select>
              </div>
            )}
            {activeTab === 'used_market' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subcategoria</label>
                <select className="w-full border p-2 rounded-lg bg-white font-bold" value={editingItem.subcategory} onChange={e => setEditingItem({...editingItem, subcategory: e.target.value})}>
                  <option value="clothing">Vestuário</option>
                  <option value="electronics">Eletrónica</option>
                  <option value="furniture">Móveis</option>
                  <option value="books">Livros</option>
                  <option value="sports">Desporto</option>
                </select>
              </div>
            )}
            {activeTab === 'animals' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subcategoria</label>
                <select className="w-full border p-2 rounded-lg bg-white font-bold" value={editingItem.subcategory} onChange={e => setEditingItem({...editingItem, subcategory: e.target.value})}>
                  <option value="vet">Veterinário</option>
                  <option value="grooming">Grooming/Banho</option>
                  <option value="petshop">Pet Shop</option>
                  <option value="training">Treino</option>
                </select>
              </div>
            )}
            {activeTab === 'real_estate' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subcategoria</label>
                <select className="w-full border p-2 rounded-lg bg-white font-bold" value={editingItem.subcategory} onChange={e => setEditingItem({...editingItem, subcategory: e.target.value})}>
                  <option value="rent">Arrendar</option>
                  <option value="buy">Comprar</option>
                  <option value="commercial">Comercial</option>
                </select>
              </div>
            )}
            {activeTab === 'gyms' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subcategoria</label>
                <select className="w-full border p-2 rounded-lg bg-white font-bold" value={editingItem.subcategory} onChange={e => setEditingItem({...editingItem, subcategory: e.target.value})}>
                  <option value="fitness">Fitness/Musculação</option>
                  <option value="crossfit">Crossfit</option>
                  <option value="yoga">Yoga/Pilates</option>
                  <option value="martial_arts">Artes Marciais</option>
                </select>
              </div>
            )}
            {activeTab === 'stands' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subcategoria</label>
                <select className="w-full border p-2 rounded-lg bg-white font-bold" value={editingItem.subcategory} onChange={e => setEditingItem({...editingItem, subcategory: e.target.value})}>
                  <option value="used_cars">Carros Usados</option>
                  <option value="new_cars">Carros Novos</option>
                  <option value="motorcycles">Motos</option>
                  <option value="boats">Barcos</option>
                </select>
              </div>
            )}
            {activeTab === 'offices' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subcategoria</label>
                <select className="w-full border p-2 rounded-lg bg-white font-bold" value={editingItem.subcategory} onChange={e => setEditingItem({...editingItem, subcategory: e.target.value})}>
                  <option value="law">Advocacia</option>
                  <option value="accounting">Contabilidade</option>
                  <option value="consulting">Consultoria</option>
                  <option value="design">Design/Marketing</option>
                </select>
              </div>
            )}
            {activeTab === 'it_services' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subcategoria</label>
                <select className="w-full border p-2 rounded-lg bg-white font-bold" value={editingItem.subcategory} onChange={e => setEditingItem({...editingItem, subcategory: e.target.value})}>
                  <option value="software">Software Dev</option>
                  <option value="hardware">Reparação Hardware</option>
                  <option value="network">Redes</option>
                  <option value="web">Web Design</option>
                </select>
              </div>
            )}
            {activeTab === 'perfumes' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subcategoria</label>
                <select className="w-full border p-2 rounded-lg bg-white font-bold" value={editingItem.subcategory} onChange={e => setEditingItem({...editingItem, subcategory: e.target.value})}>
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                  <option value="unisex">Unisexo</option>
                </select>
              </div>
            )}

            {commonInput(t('item_rating'), 'rating', 'number')}
            {commonInput(t('item_reviews'), 'reviews', 'number')}
            
            <div className="flex items-center gap-4 py-2 border-b border-slate-100 pb-4">
               <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editingItem.isPremium} onChange={e => setEditingItem({...editingItem, isPremium: e.target.checked})} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm font-bold text-slate-700">Destaque Premium</span>
               </label>
               <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${editingItem.isPremium ? 'bg-amber-100 text-amber-600 border border-amber-200' : 'bg-slate-100 text-slate-400'}`}>
                  {editingItem.isPremium ? 'Premium / Pago' : 'Grátis'}
               </span>
            </div>

            {commonInput('Google Maps Link', 'mapUrl', 'text', true)}
            
            {/* Image Upload Field */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">{t('item_image')} (URL ou Upload)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 border p-2 rounded-lg"
                  value={editingItem.image}
                  onChange={e => setEditingItem({...editingItem, image: e.target.value})}
                  placeholder="URL da imagem..."
                />
                <label className={`cursor-pointer p-2 rounded-lg border flex items-center justify-center transition-all ${isUploading ? 'bg-slate-100 opacity-50' : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'}`}>
                   {isUploading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                   <input 
                     type="file" 
                     className="hidden" 
                     accept="image/*,.webp"
                     disabled={isUploading}
                     onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'main')}
                   />
                </label>
              </div>
            </div>

            {commonInput('Admin Email', 'adminEmail')}
            {commonInput('Admin Password', 'adminPassword')}
            
            <div className="md:col-span-2">
               <label className="block text-sm font-bold text-slate-700 mb-1">{t('item_desc')}</label>
               <textarea className="w-full border p-2 rounded-lg h-24" value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
            </div>

            {/* Gallery Section */}
            <div className="md:col-span-2 border-t pt-4 mt-2">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="font-bold uppercase text-xs tracking-widest text-slate-500">Galeria de Imagens</h4>
                  <p className="text-[9px] text-slate-400">Arraste para reordenar ou use as setas</p>
                </div>
                <label className={`cursor-pointer px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2 ${isUploading ? 'bg-slate-100' : 'bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-500/20'}`}>
                  {isUploading ? <RefreshCw size={12} className="animate-spin" /> : <Plus size={12} />}
                  {isUploading ? 'A carregar...' : 'Adicionar Fotos (Múltiplas)'}
                  <input type="file" multiple className="hidden" accept="image/*,.webp" disabled={isUploading} onChange={e => e.target.files && handleImageUpload(e.target.files, 'gallery')} />
                </label>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                 {editingItem.gallery?.map((img: string, idx: number) => (
                   <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 group shadow-sm hover:shadow-md transition-all">
                      <img src={img} className="w-full h-full object-cover" alt="" />
                      
                      {/* Hover Controls */}
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                         <div className="flex gap-1">
                            <button type="button" onClick={() => moveGalleryImage(idx, idx - 1)} disabled={idx === 0} className="p-1.5 bg-white/20 hover:bg-white/40 rounded-lg text-white disabled:opacity-30"><ArrowRight size={14} className="rotate-180" /></button>
                            <button type="button" onClick={() => moveGalleryImage(idx, idx + 1)} disabled={idx === editingItem.gallery.length - 1} className="p-1.5 bg-white/20 hover:bg-white/40 rounded-lg text-white disabled:opacity-30"><ArrowRight size={14} /></button>
                         </div>
                         <button 
                            type="button" 
                            onClick={() => {
                              const newGallery = editingItem.gallery.filter((_:any, i:number) => i !== idx);
                              setEditingItem({ ...editingItem, image: img, gallery: newGallery });
                            }} 
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-blue-600"
                          >
                            Tornar Principal
                          </button>
                         <button type="button" onClick={() => setEditingItem({...editingItem, gallery: editingItem.gallery.filter((_:any, i:number) => i !== idx)})} className="p-1.5 bg-red-500/80 text-white rounded-lg hover:bg-red-600"><Trash2 size={14} /></button>
                      </div>
                      
                      {/* Index Badge */}
                      <div className="absolute top-2 left-2 bg-black/50 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-md">
                        {idx + 1}
                      </div>
                   </div>
                 ))}
              </div>
            </div>
            
            {/* Dishes/Services Section */}
            <div className="md:col-span-2 border-t pt-4 mt-2">
              <div className="flex justify-between items-center mb-2">
                 <h4 className="font-bold">Items/Serviços</h4>
                 <button type="button" onClick={addDish} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">+ Novo Item</button>
              </div>
              <div className="space-y-3">
                {editingItem.dishes?.map((dish: Dish, idx: number) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                    <div className="flex gap-2">
                      <input className="border p-2 rounded-lg w-1/3 font-bold" placeholder="Nome" value={dish.name} onChange={e => updateDish(idx, 'name', e.target.value)} />
                      <input className="border p-2 rounded-lg w-1/4" placeholder="Preço" type="number" value={dish.price} onChange={e => updateDish(idx, 'price', parseFloat(e.target.value))} />
                      <button type="button" onClick={() => removeDish(idx)} className="text-red-500 p-2"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      
      case 'activities':
      case 'trails':
        if (editingItem?.type === 'config_slider') {
          return (
            <>
              <div className="md:col-span-2">
                <h4 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-2">Configuração do Slider Principal</h4>
                <p className="text-xs text-slate-500 font-medium mb-6">Estas fotos aparecem no topo da categoria {activeTab === 'trails' ? 'Trilhos' : 'Atividades'}.</p>
              </div>
              {commonInput('Nome do Slider (Apenas Interno)', 'title', 'text', true)}
              
              <div className="md:col-span-2 border-t pt-6 mt-4">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h4 className="font-black text-xs uppercase tracking-[0.2em] text-blue-600">Galeria do Slider</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Imagens de Alta Resolução (WebP)</p>
                  </div>
                  <label className={`cursor-pointer px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${isUploading ? 'bg-slate-100' : 'bg-slate-900 text-white hover:bg-blue-600 shadow-xl shadow-slate-900/10'}`}>
                    {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    {isUploading ? 'A Otimizar...' : 'Adicionar Fotos'}
                    <input type="file" multiple className="hidden" accept="image/*,.webp" disabled={isUploading} onChange={e => e.target.files && handleImageUpload(e.target.files, 'activity_gallery')} />
                  </label>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {editingItem.gallery?.map((img: string, idx: number) => (
                    <div key={idx} className="relative aspect-[16/9] rounded-[1.5rem] overflow-hidden border-2 border-slate-100 group shadow-md">
                       <img src={img} className="w-full h-full object-cover" alt="" />
                       <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                          <div className="flex gap-2">
                             <button type="button" onClick={() => moveGalleryImage(idx, idx - 1)} disabled={idx === 0} className="p-2 bg-white/20 hover:bg-white/40 rounded-xl text-white disabled:opacity-30 transition-all"><ArrowRight size={16} className="rotate-180" /></button>
                             <button type="button" onClick={() => moveGalleryImage(idx, idx + 1)} disabled={idx === editingItem.gallery.length - 1} className="p-2 bg-white/20 hover:bg-white/40 rounded-xl text-white disabled:opacity-30 transition-all"><ArrowRight size={16} /></button>
                          </div>
                          <button type="button" onClick={() => setEditingItem({...editingItem, gallery: editingItem.gallery.filter((_:any, i:number) => i !== idx)})} className="px-4 py-2 bg-red-500/80 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 flex items-center gap-2">
                            <Trash2 size={12} /> Remover
                          </button>
                       </div>
                       <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-black text-slate-800 shadow-sm">
                         #{idx + 1}
                       </div>
                    </div>
                  ))}
                </div>
                {(!editingItem.gallery || editingItem.gallery.length === 0) && (
                  <div className="py-12 border-2 border-dashed border-slate-200 rounded-[2rem] text-center">
                    <ImageIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Nenhuma foto adicionada ao slider</p>
                  </div>
                )}
              </div>
            </>
          );
        }

        return (
          <>
            {commonInput(t('item_name'), 'title')}
            {islandSelect()}
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-1">{t('field_type')}</label>
               <select className="w-full border p-2 rounded-lg bg-white" value={editingItem.type} onChange={e => setEditingItem({...editingItem, type: e.target.value})}>
                 <option value="trail">Trilho</option>
                 <option value="culture">Cultura</option>
                 <option value="landscape">Paisagem</option>
                 <option value="poi">Ponto de Interesse</option>
                 <option value="activity">Atividade</option>
               </select>
            </div>
            
            {/* Trail Specific Details */}
            {editingItem.type === 'trail' && (
              <>
                {commonInput('Distância (ex: 5.4 Km)', 'distance')}
                {commonInput('Duração (ex: 2h 30m)', 'duration')}
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Dificuldade</label>
                   <select className="w-full border p-2 rounded-lg bg-white" value={editingItem.difficulty || 'Moderado'} onChange={e => setEditingItem({...editingItem, difficulty: e.target.value})}>
                     <option value="Fácil">Fácil</option>
                     <option value="Moderado">Moderado</option>
                     <option value="Difícil">Difícil</option>
                   </select>
                </div>
              </>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Foto Principal (Upload ou URL)</label>
              <div className="flex gap-2">
                <input type="text" className="flex-1 border p-2 rounded-lg" value={editingItem.image} onChange={e => setEditingItem({...editingItem, image: e.target.value})} placeholder="URL da imagem..." />
                <label className={`cursor-pointer p-2 rounded-lg border flex items-center justify-center transition-all ${isUploading ? 'bg-slate-100' : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'}`}>
                   {isUploading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                   <input type="file" className="hidden" accept="image/*,.webp" disabled={isUploading} onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'main')} />
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
               <label className="block text-sm font-bold text-slate-700 mb-1">{t('item_desc')}</label>
               <textarea className="w-full border p-2 rounded-lg h-24" value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
            </div>

            {/* Activity Gallery */}
            <div className="md:col-span-2 border-t pt-4 mt-2">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="font-bold uppercase text-xs tracking-widest text-slate-500">Galeria do Trilho (Slider)</h4>
                  <p className="text-[10px] text-slate-400">Fotos que aparecerão no carrossel individual deste trilho</p>
                </div>
                <label className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${isUploading ? 'bg-slate-100' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'}`}>
                   {isUploading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                   Adicionar Fotos
                   <input type="file" className="hidden" multiple accept="image/*,.webp" onChange={e => e.target.files && handleImageUpload(e.target.files, 'activity_gallery')} disabled={isUploading} />
                </label>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {editingItem.gallery?.map((img: string, idx: number) => (
                  <div key={idx} className="relative group aspect-video rounded-xl overflow-hidden border-2 border-white shadow-sm">
                    <img src={img} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                       <button type="button" onClick={() => setEditingItem({...editingItem, gallery: editingItem.gallery.filter((_:any, i:number) => i !== idx)})} className="p-1.5 bg-red-500/80 rounded-lg hover:bg-red-500 text-white"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
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
                <select className="w-full border p-2 rounded-lg bg-white font-bold" value={editingItem.type || 'hotel'} onChange={e => setEditingItem({...editingItem, type: e.target.value})}>
                  <option value="hotel">Hotel</option>
                  <option value="al">AL (Alojamento Local)</option>
                </select>
            </div>
            {commonInput('Google Maps Link', 'mapUrl', 'text')}
            
            {/* Hotel Main Photo */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Foto de Perfil do Hotel/AL</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 border p-2 rounded-lg"
                  value={editingItem.image}
                  onChange={e => setEditingItem({...editingItem, image: e.target.value})}
                  placeholder="URL da imagem..."
                />
                <label className={`cursor-pointer p-2 rounded-lg border flex items-center justify-center transition-all ${isUploading ? 'bg-slate-100 opacity-50' : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'}`}>
                   {isUploading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                   <input 
                     type="file" 
                     className="hidden" 
                     accept="image/*,.webp"
                     disabled={isUploading}
                     onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'main')}
                   />
                </label>
              </div>
            </div>

            {/* Hotel Gallery Slider */}
            <div className="md:col-span-2 border-t pt-4 mt-2">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="font-bold uppercase text-xs tracking-widest text-slate-500">Galeria Principal (Slider)</h4>
                  <p className="text-[10px] text-slate-400">Estas fotos aparecerão no carrossel de fotos do hotel</p>
                </div>
                <label className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${isUploading ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'}`}>
                   {isUploading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                   Adicionar Fotos
                   <input type="file" className="hidden" multiple accept="image/*,.webp" onChange={e => e.target.files && handleImageUpload(e.target.files, 'gallery')} disabled={isUploading} />
                </label>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {editingItem.gallery?.map((img: string, idx: number) => (
                  <div key={idx} className="relative group aspect-video rounded-xl overflow-hidden border-2 border-white shadow-sm">
                    <img src={img} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                       <button type="button" onClick={() => moveGalleryImage(idx, idx - 1)} className="p-1.5 bg-white/20 rounded-lg hover:bg-white/40 text-white"><ArrowRight className="w-4 h-4 rotate-180" /></button>
                       <button type="button" onClick={() => setEditingItem({...editingItem, gallery: editingItem.gallery.filter((_:any, i:number) => i !== idx)})} className="p-1.5 bg-red-500/80 rounded-lg hover:bg-red-500 text-white"><Trash2 className="w-4 h-4" /></button>
                       <button type="button" onClick={() => moveGalleryImage(idx, idx + 1)} className="p-1.5 bg-white/20 rounded-lg hover:bg-white/40 text-white"><ArrowRight className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
               <label className="block text-sm font-bold text-slate-700 mb-1">{t('item_desc')}</label>
               <textarea className="w-full border p-2 rounded-lg h-24" value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
            </div>

            {/* Rooms Management */}
            <div className="md:col-span-2 border-t pt-6 mt-4">
              <div className="flex justify-between items-center mb-6">
                 <div>
                   <h4 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Gestão de Quartos</h4>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Adicione e edite os tipos de quartos disponíveis</p>
                 </div>
                 <div className="flex gap-2">
                    <button type="button" onClick={applyStandardRooms} className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Padronizar (3 Tipos)
                    </button>
                    <button type="button" onClick={addRoom} className="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">+ Novo Quarto</button>
                 </div>
              </div>
              
              <div className="space-y-8">
                {editingItem.rooms?.map((room: Room, rIdx: number) => (
                  <div key={rIdx} className="bg-slate-50 p-6 rounded-[2rem] border-2 border-slate-100 space-y-4 relative group">
                    <button type="button" onClick={() => removeRoom(rIdx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-2">Nome do Quarto</label>
                        <input type="text" className="w-full border p-2 rounded-xl" value={room.name} onChange={e => updateRoom(rIdx, 'name', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-2">Preço por Noite (€)</label>
                        <input type="number" className="w-full border p-2 rounded-xl" value={room.pricePerNight} onChange={e => updateRoom(rIdx, 'pricePerNight', Number(e.target.value))} />
                      </div>
                      
                      {/* Room Main Photo */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-2">Foto de Perfil do Quarto</label>
                        <div className="flex gap-2">
                          <input type="text" className="flex-1 border p-2 rounded-xl text-xs" value={room.image} onChange={e => updateRoom(rIdx, 'image', e.target.value)} placeholder="URL..." />
                          <label className={`cursor-pointer p-2 rounded-xl border flex items-center justify-center transition-all ${isUploading ? 'bg-slate-100 opacity-50' : 'bg-white border-slate-200 text-blue-600 hover:bg-blue-50'}`}>
                             {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                             <input type="file" className="hidden" accept="image/*,.webp" disabled={isUploading} onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'room_main', rIdx)} />
                          </label>
                        </div>
                      </div>

                      {/* Room Gallery */}
                      <div className="md:col-span-2">
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-[10px] font-black uppercase text-slate-400 ml-2">Galeria do Quarto</label>
                          <label className={`cursor-pointer px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-1 ${isUploading ? 'bg-slate-100 text-slate-400' : 'bg-slate-800 text-white hover:bg-slate-900 shadow-md'}`}>
                             {isUploading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                             Fotos
                             <input type="file" className="hidden" multiple accept="image/*,.webp" onChange={e => e.target.files && handleImageUpload(e.target.files, 'room_gallery', rIdx)} disabled={isUploading} />
                          </label>
                        </div>
                        <div className="flex gap-2 overflow-x-auto py-2">
                          {room.gallery?.map((img, iIdx) => (
                            <div key={iIdx} className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 group">
                              <img src={img} className="w-full h-full object-cover" />
                              <button type="button" onClick={() => {
                                const newGal = room.gallery?.filter((_, i) => i !== iIdx);
                                updateRoom(rIdx, 'gallery', newGal);
                              }} className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-2">Descrição do Quarto</label>
                        <textarea className="w-full border p-2 rounded-xl h-20 text-xs" value={room.description} onChange={e => updateRoom(rIdx, 'description', e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case 'cars':
        return (
          <>
            {commonInput('Nome da Companhia', 'name')}
            {islandSelect()}
            {commonInput('Morada / Ponto de Recolha', 'address', 'text', true)}
            {commonInput('Email Público', 'email')}
            {commonInput('Contacto Telefónico', 'contact')}
            {commonInput('Email Admin', 'adminEmail')}
            {commonInput('Password Admin', 'adminPassword')}
            
            {/* Company Logo Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Logo da Companhia (URL ou Upload)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 border p-2 rounded-lg"
                  value={editingItem.image}
                  onChange={e => setEditingItem({...editingItem, image: e.target.value})}
                  placeholder="URL do logo..."
                />
                <label className={`cursor-pointer p-2 rounded-lg border flex items-center justify-center transition-all ${isUploading ? 'bg-slate-100 opacity-50' : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'}`}>
                   {isUploading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                   <input 
                     type="file" 
                     className="hidden" 
                     accept="image/*,.webp"
                     disabled={isUploading}
                     onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'main')}
                   />
                </label>
              </div>
            </div>
            
            {/* Rentcar Gallery Section */}
            <div className="md:col-span-2 border-t pt-4 mt-2">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="font-bold uppercase text-xs tracking-widest text-slate-500">Galeria da Companhia (Slider)</h4>
                  <p className="text-[10px] text-slate-400">Estas fotos aparecerão no slider da Rent-a-car</p>
                </div>
                <label className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${isUploading ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'}`}>
                   {isUploading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                   Adicionar Fotos
                   <input type="file" className="hidden" multiple accept="image/*,.webp" onChange={e => e.target.files && handleImageUpload(e.target.files, 'gallery')} disabled={isUploading} />
                </label>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {editingItem.gallery?.map((img: string, idx: number) => (
                  <div key={idx} className="relative group aspect-video rounded-xl overflow-hidden border-2 border-white shadow-sm">
                    <img src={img} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                       <button type="button" onClick={() => moveGalleryImage(idx, idx - 1)} className="p-1.5 bg-white/20 rounded-lg hover:bg-white/40 text-white"><ArrowRight className="w-4 h-4 rotate-180" /></button>
                       <button type="button" onClick={() => setEditingItem({...editingItem, gallery: editingItem.gallery.filter((_:any, i:number) => i !== idx)})} className="p-1.5 bg-red-500/80 rounded-lg hover:bg-red-500 text-white"><Trash2 className="w-4 h-4" /></button>
                       <button type="button" onClick={() => moveGalleryImage(idx, idx + 1)} className="p-1.5 bg-white/20 rounded-lg hover:bg-white/40 text-white"><ArrowRight className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
                {(!editingItem.gallery || editingItem.gallery.length === 0) && (
                  <div className="col-span-full py-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 italic text-sm">
                    <ImageIcon className="w-8 h-8 mb-2 opacity-20" />
                    Nenhuma foto na galeria
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
               <label className="block text-sm font-bold text-slate-700 mb-1">Descrição</label>
               <textarea className="w-full border p-2 rounded-lg h-24" value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
            </div>

            <div className="md:col-span-2 border-t pt-6 mt-4">
              <div className="flex justify-between items-center mb-6">
                 <div>
                   <h4 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Gestão da Frota</h4>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Adicione e edite os veículos desta companhia</p>
                 </div>
                 <button type="button" onClick={addCar} className="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">+ Nova Viatura</button>
              </div>
              
              <div className="space-y-6">
                {editingItem.cars?.map((car: Car, idx: number) => (
                  <div key={idx} className="bg-slate-50 p-6 rounded-[2rem] border-2 border-slate-100 space-y-4 relative group">
                    <button type="button" onClick={() => removeCar(idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Modelo do Veículo</label>
                        <input className="w-full border-2 border-white p-3 rounded-xl font-bold text-sm shadow-sm" placeholder="Ex: Renault Clio" value={car.model} onChange={e => updateCar(idx, 'model', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Tipo</label>
                        <select className="w-full border-2 border-white p-3 rounded-xl font-bold text-sm shadow-sm bg-white" value={car.type} onChange={e => updateCar(idx, 'type', e.target.value)}>
                          <option value="Económico">Económico</option>
                          <option value="SUV">SUV</option>
                          <option value="Descapotável">Descapotável</option>
                          <option value="Carrinha">Carrinha</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Combustível</label>
                        <select className="w-full border-2 border-white p-3 rounded-xl font-bold text-sm shadow-sm bg-white" value={car.fuelType} onChange={e => updateCar(idx, 'fuelType', e.target.value)}>
                          <option value="Gasolina">Gasolina</option>
                          <option value="Gasóleo">Gasóleo</option>
                          <option value="Híbrido">Híbrido</option>
                          <option value="Elétrico">Elétrico</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Lugares</label>
                        <input className="w-full border-2 border-white p-3 rounded-xl font-bold text-sm shadow-sm" type="number" value={car.seats} onChange={e => updateCar(idx, 'seats', parseInt(e.target.value))} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Preço/Dia (€)</label>
                        <input className="w-full border-2 border-white p-3 rounded-xl font-bold text-sm shadow-sm" type="number" value={car.pricePerDay} onChange={e => updateCar(idx, 'pricePerDay', parseFloat(e.target.value))} />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Foto do Veículo (URL ou Upload)</label>
                        <div className="flex gap-2">
                          <input 
                            className="flex-1 border-2 border-white p-3 rounded-xl font-bold text-sm shadow-sm" 
                            placeholder="URL da foto..." 
                            value={car.image} 
                            onChange={e => updateCar(idx, 'image', e.target.value)} 
                          />
                          <label className={`cursor-pointer px-4 rounded-xl border flex items-center justify-center transition-all ${isUploading ? 'bg-slate-100 opacity-50' : 'bg-white border-blue-100 text-blue-600 hover:bg-blue-50'}`}>
                             {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                             <input 
                               type="file" 
                               className="hidden" 
                               accept="image/*,.webp"
                               disabled={isUploading}
                               onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'car', idx)}
                             />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case 'buses':
        return (
          <>
            {commonInput('Empresa', 'company')}
            {islandSelect()}
            {commonInput('Origem', 'origin')}
            {commonInput('Destino', 'destination')}
            {commonInput(t('item_price'), 'price', 'number')}
          </>
        );
    }
  };

  const getListItems = () => {
    let list: any[] = [];
    switch (activeTab) {
      case 'restaurants': 
        list = restaurants; 
        if (cuisineFilter !== 'all') {
          list = list.filter(r => r.cuisine === cuisineFilter);
        }
        break;
      case 'shops': list = shopsFilter === 'all' ? shops : shops.filter(s => s.subcategory === shopsFilter); break;
      case 'beauty': list = beautyFilter === 'all' ? beauty : beauty.filter(b => b.subcategory === beautyFilter); break;
      case 'services': list = servicesFilter === 'all' ? services : services.filter(s => s.subcategory === servicesFilter); break;
      case 'auto_repairs': list = autoRepairsFilter === 'all' ? autoRepairs : autoRepairs.filter(a => a.subcategory === autoRepairsFilter); break;
      case 'auto_electronics': list = autoElectronics; break;
      case 'used_market': list = usedMarket; break;
      case 'animals': list = animals; break;
      case 'real_estate': list = realEstate; break;
      case 'gyms': list = gyms; break;
      case 'stands': list = stands; break;
      case 'offices': list = offices; break;
      case 'it_services': list = itServices; break;
      case 'perfumes': list = perfumes; break;
      case 'activities': list = activities; break;
      case 'trails': list = activities.filter(a => a.type === 'trail'); break;
      case 'flights': list = flights; break;
      case 'hotels': list = hotelFilter === 'all' ? hotels : hotels.filter(h => h.type === hotelFilter); break;
      case 'cars': list = cars; break;
      case 'buses': list = busSchedules; break;
      default: list = [];
    }

    if (islandFilter !== 'all') {
    list = list.filter(item => item.island === islandFilter);
    }
    return list;
  };

  const getItemName = (item: any) => {
    if (activeTab === 'flights') return `${item.airline} ${item.flightNumber} (${item.origin}->${item.destination})`;
    if (activeTab === 'buses') return `${item.company}: ${item.origin} -> ${item.destination}`;
    if (activeTab === 'itineraries') return `Roteiro: ${item.id}`;
    if (activeTab === 'trails') return item.title || 'Trilho sem nome';
    if (activeTab === 'cars') return item.name || 'Companhia Rent-a-car';
    return item.name || item.title || item.model || 'Sem Nome';
  };

  const getTabTitle = () => {
    const titles: any = {
      'restaurants': 'Restaurantes',
      'accommodation': 'Alojamentos',
      'rentcar': 'Rent-a-car',
      'activities': 'Atividades',
      'trails': 'Trilhos',
      'flights': 'Voos',
      'buses': 'Autocarros',
      'shops': 'Lojas',
      'beauty': 'Beleza & Estética',
      'services': 'Serviços Diversos',
      'auto_repair': 'Oficinas',
      'auto_electronics': 'Eletricidade Auto',
      'used_market': 'Mercado de Usados',
      'animals': 'Animais',
      'real_estate': 'Imobiliária',
      'gyms': 'Ginásios',
      'stands': 'Stands de Automóveis',
      'offices': 'Escritórios & Cowork',
      'it_services': 'Serviços IT',
      'perfumes': 'Perfumes & Fragrâncias'
    };
    return titles[activeTab as string] || activeTab?.toUpperCase() || 'Painel';
  };

  // Helper to inject data into the DOM if needed for debug/export
  const injectData = (data: any) => {
    console.log('Injected Data:', data);
    return JSON.stringify(data);
  };

  // Helper to get items for the main list view (excluding configs)
  const getVisibleItems = () => {
    return getListItems().filter(item => !item.id?.startsWith('CONFIG_SLIDER_'));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      {/* Upload Progress Overlay */}
      <AnimatePresence>
        {isUploading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-6"
          >
            <div className="bg-white rounded-[3rem] p-10 w-full max-w-md shadow-2xl border border-white/20 text-center space-y-6">
              <div className="relative w-24 h-24 mx-auto">
                <svg className="w-full h-full rotate-[-90deg]">
                  <circle
                    cx="48" cy="48" r="40"
                    className="stroke-slate-100 fill-none"
                    strokeWidth="8"
                  />
                  <motion.circle
                    cx="48" cy="48" r="40"
                    className="stroke-blue-600 fill-none"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    initial={{ strokeDashoffset: 251.2 }}
                    animate={{ strokeDashoffset: 251.2 - (251.2 * (uploadProgress.current / uploadProgress.total)) }}
                    transition={{ duration: 0.5 }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-black text-slate-800">
                    {uploadProgress.total > 0 ? Math.round((uploadProgress.current / uploadProgress.total) * 100) : 0}%
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">A Otimizar Imagens</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Transformando em WebP de Alta Performance</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
                  <span>{uploadProgress.label}</span>
                  <span>{uploadProgress.current}/{uploadProgress.total}</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress.total > 0 ? (uploadProgress.current / uploadProgress.total) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <p className="text-[9px] text-slate-400 italic font-medium leading-relaxed">
                Este processo reduz o tamanho dos ficheiros mantendo a qualidade máxima, garantindo que o seu site carregue instantaneamente.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-20 overflow-y-auto">
        <div className="p-6 border-b border-slate-800">
           <h2 className="text-xl font-bold flex items-center gap-2">
             <LayoutDashboard className="text-blue-500" /> Admin v1.2.1
           </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {/* DASHBOARD - SALIENTE E NO TOPO */}
          <button 
            onClick={() => { setActiveTab('dashboard'); setEditingItem(null); setShowOtherTabs(false); }} 
            className={`w-full text-left p-4 rounded-2xl flex items-center gap-3 transition-all ${activeTab === 'dashboard' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 shadow-xl shadow-blue-900/40 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
          >
            <LayoutDashboard className={`w-6 h-6 ${activeTab === 'dashboard' ? 'text-white' : 'text-blue-500'}`} /> 
            <span className="font-black uppercase tracking-widest text-xs">Dashboard</span>
          </button>
          
          <div className="h-px bg-slate-800/50 my-4 mx-2"></div>

          {/* MAIN TABS */}
          <button onClick={() => { setActiveTab('restaurants'); setEditingItem(null); setShowOtherTabs(false); }} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'restaurants' ? 'bg-blue-600 shadow-lg text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Utensils className="w-5 h-5" /> Restaurantes
          </button>

          <button onClick={() => { setActiveTab('buses'); setEditingItem(null); setShowOtherTabs(false); }} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'buses' ? 'bg-blue-600 shadow-lg text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Bus className="w-5 h-5" /> Autocarros
          </button>

          <button onClick={() => { setActiveTab('cars'); setEditingItem(null); setShowOtherTabs(false); }} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'cars' ? 'bg-blue-600 shadow-lg text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <CarIcon className="w-5 h-5" /> Rentcar
          </button>

          <button onClick={() => { setActiveTab('hotels'); setEditingItem(null); setShowOtherTabs(false); }} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'hotels' ? 'bg-blue-600 shadow-lg text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <BedDouble className="w-5 h-5" /> Alojamentos
          </button>

          <button onClick={() => { setActiveTab('activities'); setEditingItem(null); setShowOtherTabs(false); }} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'activities' ? 'bg-blue-600 shadow-lg text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Mountain className="w-5 h-5" /> Atividades
          </button>

          <button onClick={() => { setActiveTab('trails'); setEditingItem(null); setShowOtherTabs(false); }} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'trails' ? 'bg-blue-600 shadow-lg text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <MapPin className="w-5 h-5" /> Trilhos
          </button>

          {/* OUTROS BUTTON */}
          <button 
            onClick={() => setShowOtherTabs(!showOtherTabs)} 
            className={`w-full text-left p-4 mt-6 rounded-2xl flex items-center justify-between transition-all border-2 ${showOtherTabs ? 'bg-slate-800 border-blue-500' : 'bg-slate-800/30 border-white/5 hover:bg-slate-800'}`}
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-slate-400" /> 
              <span className="font-black uppercase tracking-widest text-[10px] text-slate-400">Outros Serviços</span>
            </div>
            <ArrowRight size={16} className={`text-slate-500 transition-transform duration-500 ${showOtherTabs ? 'rotate-90' : ''}`} />
          </button>

          {/* OTHER TABS SLIDER (ACCORDION STYLE) */}
          <AnimatePresence>
            {showOtherTabs && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-1 mt-2 pl-4"
              >
                <button onClick={() => { setActiveTab('shops'); setEditingItem(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 text-xs ${activeTab === 'shops' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <ShoppingBag size={14} /> Lojas Regionais
                </button>
                <button onClick={() => { setActiveTab('beauty'); setEditingItem(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 text-xs ${activeTab === 'beauty' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <Sparkles size={14} /> Beleza
                </button>
                <button onClick={() => { setActiveTab('services'); setEditingItem(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 text-xs ${activeTab === 'services' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <Briefcase size={14} /> Serviços Técnicos
                </button>
                <button onClick={() => { setActiveTab('auto_repairs'); setEditingItem(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 text-xs ${activeTab === 'auto_repairs' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <Wrench size={14} /> Reparação Auto
                </button>
                <button onClick={() => { setActiveTab('auto_electronics'); setEditingItem(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 text-xs ${activeTab === 'auto_electronics' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <Zap size={14} /> Eletrónica Auto
                </button>
                <button onClick={() => { setActiveTab('used_market'); setEditingItem(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 text-xs ${activeTab === 'used_market' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <ShoppingCart size={14} /> Mercado Usados
                </button>
                <button onClick={() => { setActiveTab('animals'); setEditingItem(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 text-xs ${activeTab === 'animals' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <Dog size={14} /> Animais
                </button>
                <button onClick={() => { setActiveTab('real_estate'); setEditingItem(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 text-xs ${activeTab === 'real_estate' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <Building2 size={14} /> Imobiliárias
                </button>
                <button onClick={() => { setActiveTab('gyms'); setEditingItem(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 text-xs ${activeTab === 'gyms' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <Dumbbell size={14} /> Ginásios
                </button>
                <button onClick={() => { setActiveTab('stands'); setEditingItem(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 text-xs ${activeTab === 'stands' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <CarFront size={14} /> Stands
                </button>
                <button onClick={() => { setActiveTab('offices'); setEditingItem(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 text-xs ${activeTab === 'offices' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <Building2 size={14} /> Escritórios
                </button>
                <button onClick={() => { setActiveTab('it_services'); setEditingItem(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 text-xs ${activeTab === 'it_services' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <Laptop size={14} /> Informática
                </button>
                <button onClick={() => { setActiveTab('perfumes'); setEditingItem(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 text-xs ${activeTab === 'perfumes' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <Pipette size={14} /> Perfumaria
                </button>
                <button onClick={() => { setActiveTab('flights'); setEditingItem(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 text-xs ${activeTab === 'flights' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <Plane size={14} /> Voos
                </button>
                <button onClick={() => { setActiveTab('suppliers'); setEditingItem(null); }} className={`w-full text-left p-2 rounded-lg flex items-center gap-3 text-xs ${activeTab === 'suppliers' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  <Users size={14} /> Fornecedores
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Database Status Badge */}
        <div className="mx-4 mb-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
           <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Database size={14} className={dbStatus?.isMongo ? 'text-emerald-400' : 'text-amber-400'} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estado da DB</span>
              </div>
              <button 
                onClick={async () => {
                  if (onFullSync) {
                    setIsSyncing(true);
                    try {
                      await onFullSync();
                      addLog('🔄 Dados sincronizados manualmente do Atlas.');
                    } finally {
                      setIsSyncing(false);
                    }
                  }
                }} 
                disabled={isSyncing}
                className="p-1 hover:bg-slate-700 rounded-md text-slate-400 transition-colors disabled:opacity-50"
                title="Sincronizar com Atlas"
              >
                <RefreshCw size={12} className={isSyncing ? 'animate-spin text-blue-400' : ''} />
              </button>
           </div>
           <p className={`text-[11px] font-bold ${dbStatus?.isMongo ? 'text-emerald-500' : 'text-amber-500'}`}>
              {dbStatus?.storage}
           </p>
           {!dbStatus?.isMongo && (
             <div className="mt-2 p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <p className="text-[9px] text-amber-600 leading-tight mb-1">
                  Atenção: Os dados são <b>temporários</b> e serão perdidos ao reiniciar.
                </p>
                <p className="text-[8px] text-slate-500">
                  Config: {dbStatus?.isConfigured ? '✅ URI Detetada' : '❌ URI em falta no Render'}
                </p>
                <p className="text-[8px] text-slate-500">
                  Ligação: {dbStatus?.isMongo ? '✅ Ativa' : '❌ Falhou'}
                </p>
                {dbStatus?.error && (
                  <p className="text-[7px] text-red-400 mt-1 font-mono break-all leading-tight">
                    Erro: {dbStatus.error}
                  </p>
                )}
                <p className="text-[7px] text-slate-600 mt-1 opacity-50">
                  Srv Time: {dbStatus?.timestamp ? new Date(dbStatus.timestamp).toLocaleTimeString() : 'N/A'}
                </p>
             </div>
           )}
        </div>

        <div className="p-4 border-t border-slate-800 space-y-2">
          {onFullSync && (
            <>
               {/* BUTTON 1: COMPRESS & SYNC */}
               <button 
                 onClick={() => {
                   const currentCategory = activeTab;
                   const allCategories = [
                     'restaurants', 'shops', 'beauty', 'hotels', 'cars', 'activities', 'services', 
                     'auto_repairs', 'auto_electronics', 'used_market', 'animals', 'real_estate', 
                     'gyms', 'stands', 'offices', 'it_services', 'perfumes', 'flights', 'bus-schedules'
                   ];
                   if (allCategories.includes(currentCategory)) {
                     setSyncSelection([currentCategory]);
                   } else {
                     setSyncSelection([]);
                   }
                   setShowSyncSelector(true);
                 }} 
                 disabled={isSyncing || isCompressing}
                 className={`w-full flex flex-col items-center gap-1 p-4 rounded-2xl transition-all border shadow-lg relative ${isCompressing ? 'bg-amber-600/40 text-white border-amber-500' : 'bg-emerald-600 text-white hover:bg-emerald-500 border-emerald-400'}`}
               >
                 <div className="flex items-center gap-3 w-full justify-center">
                    {isCompressing ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6" />}
                    <span className="font-black uppercase tracking-tighter text-sm">{isCompressing ? 'A Publicar...' : 'Publicar no Frontend'}</span>
                    {modifiedCategories.size > 0 && !isCompressing && (
                       <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] px-2 py-1 rounded-full animate-bounce shadow-lg border-2 border-slate-900">
                         {modifiedCategories.size}
                       </span>
                     )}
                 </div>
                 {isCompressing && (
                   <div className="w-full mt-2">
                      <div className="flex justify-between text-[10px] uppercase font-black mb-1">
                         <span>Progresso</span>
                         <span>{compressionProgress.total > 0 ? Math.round((compressionProgress.current / compressionProgress.total) * 100) : 0}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-900/50 rounded-full overflow-hidden border border-white/10">
                         <div 
                           className="h-full bg-white transition-all duration-300" 
                           style={{ width: `${compressionProgress.total > 0 ? (compressionProgress.current / compressionProgress.total) * 100 : 0}%` }}
                         />
                      </div>
                      <p className="text-[9px] mt-1 text-center font-bold text-white/90 truncate">
                        {compressionLabel}
                      </p>
                      <p className="text-[8px] mt-0.5 text-center font-black text-amber-300">
                        {compressionProgress.current} / {compressionProgress.total} itens processados
                      </p>
                   </div>
                 )}
              </button>

              {/* BUTTON 3: DANGER ZONE - WIPE ALL */}
              <button 
                onClick={async () => {
                  if (window.confirm('⚠️ AVISO CRÍTICO: Isto vai apagar TODOS os restaurantes, lojas, hotéis, etc. de uma só vez! Deseja recomeçar do zero?')) {
                    if (window.confirm('TEM A CERTEZA ABSOLUTA? Esta ação não pode ser revertida.')) {
                       setIsCompressing(true);
                       setSyncLogs([]);
                       addLog('🧨 A iniciar limpeza total da base de dados...');
                       
                       setTimeout(async () => {
                          try {
                            const res = await fetch(`${API_BASE_URL}/api/reset-db`, {
                              method: 'POST'
                            });
                            if (res.ok) {
                              addLog('✅ Base de dados limpa com sucesso!');
                              alert('✅ Base de dados LIMPA!');
                            } else {
                              addLog('❌ Falha ao limpar servidor.');
                            }
                          } catch (err) {
                            addLog('❌ Erro de ligação ao limpar.');
                          } finally {
                            setIsCompressing(false);
                          }
                        }, 1000);
                    }
                  }
                }} 
                disabled={isSyncing || isCompressing}
                className="w-full flex items-center gap-3 p-2 rounded-xl transition-all border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10"
              >
                 <Trash2 size={16} /> Limpar Tudo (RESET)
              </button>
            </>
          )}
          <button onClick={onLogout} className="w-full flex items-center gap-3 text-slate-500 hover:text-red-400 p-3 rounded-xl hover:bg-red-400/5 transition-colors">
             <LogOut className="w-5 h-5" /> <span className="font-bold uppercase text-[10px] tracking-widest">{t('logout_admin')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
         <div className="flex justify-between items-center mb-8">
            <div className="flex flex-col">
              <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter leading-none mb-1">
                {activeTab === 'dashboard' ? 'Panorama Geral' : `${getTabTitle()} (${getListItems().length})`}
              </h1>
              {activeTab !== 'dashboard' && <p className="text-slate-400 text-xs font-bold italic">Gestão de conteúdos e registos da plataforma</p>}
            </div>
            
            {activeTab === 'dashboard' && (
              <button 
                onClick={handleEmergencyRestore}
                disabled={isSyncing}
                className="group relative px-6 py-3 bg-red-50 border-2 border-red-100 text-red-600 rounded-2xl text-xs font-black uppercase flex items-center gap-3 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-xl shadow-red-500/5 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <AlertTriangle className="w-4 h-4" />
                <span>Repovoar Atlas (Emergência)</span>
              </button>
            )}
         </div>

          {/* DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
               {/* Stats Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total de Negócios</p>
                     <p className="text-4xl font-black text-slate-800 tracking-tighter">
                        {restaurants.length + shops.length + beauty.length + hotels.length + cars.length + realEstate.length + gyms.length + stands.length}
                     </p>
                     <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: '75%' }}></div>
                     </div>
                  </div>
                  <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Registos de Clientes</p>
                     <p className="text-4xl font-black text-slate-800 tracking-tighter">1.240</p>
                     <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-green-600 rounded-full" style={{ width: '60%' }}></div>
                     </div>
                  </div>
                  <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Visitas no Site</p>
                     <p className="text-4xl font-black text-slate-800 tracking-tighter">45.892</p>
                     <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-amber-600 rounded-full" style={{ width: '85%' }}></div>
                     </div>
                  </div>
                  <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Taxa de Conversão</p>
                     <p className="text-4xl font-black text-slate-800 tracking-tighter">12.4%</p>
                     <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-purple-600 rounded-full" style={{ width: '45%' }}></div>
                     </div>
                  </div>
               </div>

               {/* Categories Breakdown */}
               <div className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-xl shadow-slate-200/20">
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-8">Inventário por Categoria</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                     {[
                       { label: 'Restaurantes', count: restaurants.length, icon: Utensils, color: 'bg-blue-50 text-blue-600' },
                       { label: 'Alojamentos', count: hotels.length, icon: BedDouble, color: 'bg-indigo-50 text-indigo-600' },
                       { label: 'Rentcar', count: cars.length, icon: CarIcon, color: 'bg-emerald-50 text-emerald-600' },
                       { label: 'Atividades', count: activities.length, icon: Mountain, color: 'bg-amber-50 text-amber-600' },
                       { label: 'Trilhos', count: activities.filter(a => a.type === 'trail').length, icon: MapPin, color: 'bg-green-50 text-green-600' },
                       { label: 'Lojas', count: shops.length, icon: ShoppingBag, color: 'bg-rose-50 text-rose-600' },
                       { label: 'Beleza', count: beauty.length, icon: Sparkles, color: 'bg-pink-50 text-pink-600' },
                       { label: 'Imobiliária', count: realEstate.length, icon: Building2, color: 'bg-slate-50 text-slate-600' },
                       { label: 'Stands', count: stands.length, icon: CarFront, color: 'bg-orange-50 text-orange-600' },
                     ].map((cat, i) => (
                       <div key={i} className="flex flex-col items-center text-center group cursor-pointer">
                          <div className={`w-16 h-16 ${cat.color} rounded-3xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 group-hover:shadow-xl transition-all`}>
                             <cat.icon size={28} />
                          </div>
                          <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">{cat.label}</p>
                          <p className="text-xl font-black text-slate-800">{cat.count}</p>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

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
          {activeTab !== 'dashboard' && activeTab !== 'suppliers' && !editingItem && (
            <div className="space-y-6">
                
                <div className="flex justify-between items-center bg-white p-8 rounded-[3rem] shadow-sm mb-8 border border-slate-100">
                   <div className="flex gap-4 items-center">
                     <select 
                       className="border-2 border-slate-100 p-2 rounded-xl bg-white text-[10px] font-black uppercase tracking-wider text-slate-500 focus:border-blue-500 outline-none transition-all"
                       value={islandFilter}
                       onChange={e => setIslandFilter(e.target.value)}
                     >
                        <option value="all">Todas as Ilhas</option>
                        {['PDL', 'TER', 'HOR', 'PIX', 'SJZ', 'GRW', 'FLW', 'CVU', 'SMA'].map(i => <option key={i} value={i}>{i}</option>)}
                     </select>

                     {activeTab === 'restaurants' && (
                       <select 
                         className="border-2 border-slate-100 p-2 rounded-xl bg-white text-[10px] font-black uppercase tracking-wider text-slate-500 focus:border-blue-500 outline-none transition-all"
                         value={cuisineFilter}
                         onChange={e => setCuisineFilter(e.target.value)}
                       >
                         <option value="all">Todos os Tipos de Cozinha</option>
                         {Array.from(new Set(restaurants.map(r => r.cuisine).filter(Boolean))).sort().map(c => (
                           <option key={c} value={c}>{c}</option>
                         ))}
                       </select>
                     )}
                   </div>

                   <div className="flex items-center gap-6">
                     <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded-lg text-blue-600 focus:ring-blue-500"
                          checked={getListItems().length > 0 && getListItems().every(i => selectedIds.includes(i.id))}
                          onChange={toggleSelectAll}
                        />
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Selecionar Tudo</span>
                     </div>
                     <div>
                       <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tighter">{activeTab.replace('_', ' ')} ({getListItems().length})</h1>
                       <p className="text-slate-400 font-medium italic">Gestão de conteúdos e registos da plataforma</p>
                     </div>
                   </div>
                   <div className="flex gap-3">
                     {selectedIds.length > 0 && (
                       <motion.button 
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         onClick={handleBulkDelete}
                         className="px-8 py-4 bg-red-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all flex items-center gap-2"
                       >
                         <Trash2 size={16} /> Apagar Selecionados ({selectedIds.length})
                       </motion.button>
                     )}
                    <button 
                      onClick={() => setShowBulkAdd(!showBulkAdd)} 
                      className={`px-8 py-4 ${showBulkAdd ? 'bg-amber-500' : 'bg-slate-800'} text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg transition-all flex items-center gap-2`}
                    >
                      <Plus size={16} /> Lançamento Rápido (Lista)
                    </button>
                    <button 
                      onClick={startAdd} 
                      className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2"
                    >
                      <Plus size={16} /> Novo Registo
                    </button>
                  </div>
                </div>

                {showBulkAdd && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-[3rem] shadow-xl mb-8 border-2 border-amber-200"
                  >
                    <h3 className="text-lg font-black text-slate-800 uppercase mb-2">Lançamento Rápido em Massa</h3>
                    <p className="text-xs text-slate-500 mb-4 font-bold">Cole uma lista de nomes (um por linha). Selecione a Ilha e Subcategoria antes de publicar.</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-2">Ilha</label>
                        <select className="w-full border-2 border-slate-100 p-3 rounded-xl font-bold text-sm" value={bulkIsland} onChange={e => setBulkIsland(e.target.value)}>
                          {['PDL', 'TER', 'HOR', 'PIX', 'SJZ', 'GRW', 'FLW', 'CVU', 'SMA'].map(i => <option key={i} value={i}>{i}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-2">Subcategoria (Opcional)</label>
                        <input className="w-full border-2 border-slate-100 p-3 rounded-xl font-bold text-sm" value={bulkSubcategory} onChange={e => setBulkSubcategory(e.target.value)} placeholder="Ex: beauty_salon" />
                      </div>
                    </div>

                    <textarea 
                      className="w-full h-72 border-2 border-slate-100 p-4 rounded-2xl font-mono text-sm focus:border-amber-400 outline-none transition-colors"
                      placeholder={`Exemplo (separe cada negócio com uma linha em branco):

Restaurante A Tasca
Rua de Lisboa 12, Ponta Delgada
(+351) 296 111 222  info@atasca.pt

Cella Bar
Av. do Mar, Madalena, Pico
(+351) 292 555 888  cellbar@pico.pt`}
                      value={bulkText}
                      onChange={e => setBulkText(e.target.value)}
                    />
                    <div className="flex justify-end gap-3 mt-4">
                      <button onClick={() => setShowBulkAdd(false)} className="px-6 py-3 text-xs font-black uppercase text-slate-400 hover:text-slate-600">Cancelar</button>
                      <button onClick={handleBulkAdd} className="px-10 py-3 bg-amber-500 text-white rounded-xl text-xs font-black uppercase shadow-lg shadow-amber-500/20 hover:bg-amber-600 transition-all">Publicar Lista Agora</button>
                    </div>
                  </motion.div>
                )}

                {/* ISLAND FILTER BAR */}
                <div className="flex flex-wrap gap-2 mb-8 bg-slate-50 p-4 rounded-[2rem] border border-slate-100">
                   <button 
                     onClick={() => { setIslandFilter('all'); setVisibleCount(6); }}
                     className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${islandFilter === 'all' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-slate-100'}`}
                   >
                     Todas as Ilhas
                   </button>
                   {['PDL', 'TER', 'HOR', 'PIX', 'SJZ', 'GRW', 'FLW', 'CVU', 'SMA'].map(isl => (
                     <button 
                       key={isl}
                       onClick={() => { setIslandFilter(isl); setVisibleCount(6); }}
                       className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${islandFilter === isl ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-slate-100'}`}
                     >
                       {isl}
                     </button>
                   ))}
                </div>
              
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

              {activeTab === 'services' && (
                <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                  {[
                    { id: 'all', label: 'Todos', icon: <LayoutDashboard size={18} />, color: '#1A75BB' },
                    { id: 'electrician', label: 'Eletricista', icon: <Zap size={18} />, color: '#F59E0B' },
                    { id: 'mason', label: 'Pedreiro', icon: <HardHat size={18} />, color: '#D97706' },
                    { id: 'carpenter', label: 'Carpinteiro', icon: <Hammer size={18} />, color: '#8B4513' },
                    { id: 'plumber', label: 'Canalizador', icon: <Droplets size={18} />, color: '#3B82F6' },
                    { id: 'painter', label: 'Pintor', icon: <Paintbrush size={18} />, color: '#EC4899' },
                    { id: 'gardening', label: 'Jardinagem', icon: <Flower2 size={18} />, color: '#10B981' },
                    { id: 'architect', label: 'Arquiteto', icon: <DraftingCompass size={18} />, color: '#8B5CF6' },
                    { id: 'engineer', label: 'Engenheiro', icon: <Settings size={18} />, color: '#4B5563' },
                    { id: 'hvac', label: 'Climatização', icon: <ThermometerSnowflake size={18} />, color: '#06B6D4' },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setServicesFilter(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap
                        ${servicesFilter === cat.id ? 'bg-white text-slate-900 border-slate-200 shadow-md' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
                      style={{ borderBottom: servicesFilter === cat.id ? `3px solid ${cat.color}` : undefined }}
                    >
                      <span style={{ color: cat.color }}>{cat.icon}</span> {cat.label}
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'auto_repairs' && (
                <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                  {[
                    { id: 'all', label: 'Todos', icon: <LayoutDashboard size={18} />, color: '#1A75BB' },
                    { id: 'parts', label: 'Compra de Peças', icon: <Settings size={18} />, color: '#EF4444' },
                    { id: 'workshop', label: 'Oficinas', icon: <Wrench size={18} />, color: '#3B82F6' },
                    { id: 'bodywork', label: 'Bate Chapa e Pintura', icon: <Paintbrush size={18} />, color: '#F59E0B' },
                    { id: 'electric', label: 'Eletrónica Auto', icon: <Zap size={18} />, color: '#EAB308' },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setAutoRepairsFilter(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap
                        ${autoRepairsFilter === cat.id ? 'bg-white text-slate-900 border-slate-200 shadow-md' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
                      style={{ borderBottom: autoRepairsFilter === cat.id ? `3px solid ${cat.color}` : undefined }}
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

              {/* Category Slider Management Section */}
              {(activeTab === 'trails' || activeTab === 'activities') && (
                <div className="mb-10 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 p-8 rounded-[3rem] text-white shadow-2xl shadow-green-900/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-white/20 transition-all duration-700"></div>
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-[1.5rem] flex items-center justify-center border border-white/30 shadow-inner group-hover:rotate-12 transition-transform duration-500">
                      <Mountain className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-tighter leading-none mb-2">Slider Principal: {activeTab === 'trails' ? 'Trilhos' : 'Atividades'}</h3>
                      <p className="text-xs font-bold text-white/70 uppercase tracking-widest max-w-md">Personalize as fotos de grande formato que os utilizadores veem no topo desta categoria.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const sliderId = `CONFIG_SLIDER_${activeTab.toUpperCase()}`;
                      // Use getListItems() directly here to find the config even if filtered from visible list
                      const sliderItem = getListItems().find(i => i.id === sliderId) || {
                        id: sliderId,
                        title: `Slider Destaque ${activeTab}`,
                        type: 'config_slider',
                        gallery: []
                      };
                      startEdit(sliderItem);
                    }}
                    className="relative z-10 px-10 py-4 bg-white text-emerald-700 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-50 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
                  >
                    Gerir Fotos do Slider
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getVisibleItems()
                .slice(0, visibleCount).map((item: any) => (
                <div key={item.id} className={`group relative bg-white rounded-[2rem] border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col ${selectedIds.includes(item.id) ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-100'}`}>
                   
                   {/* Selection Checkbox */}
                   <div className="absolute top-4 left-4 z-10">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleSelection(item.id)}
                        className="w-5 h-5 rounded-lg border-white shadow-md text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                      />
                   </div>

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
                  {activeTab === 'cars' && (
                    <div className="flex items-center gap-2 mt-1">
                       <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
                          {item.cars?.length || 0} Veículos na Frota
                       </span>
                    </div>
                  )}
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {item.description || item.type || item.company || item.address}
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
             
             {getListItems().length > visibleCount && (
               <div className="flex justify-center mt-12 mb-20">
                 <button 
                   onClick={() => setVisibleCount(prev => prev + 12)}
                   className="px-12 py-5 bg-white border-2 border-slate-100 text-slate-800 rounded-[2rem] text-sm font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl shadow-slate-100"
                 >
                   Ver Mais Itens (+12)
                 </button>
               </div>
             )}
           </div>
         )}
          {/* SYNC PROGRESS MODAL */}
          <AnimatePresence>
            {isCompressing && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-sm">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]"
                >
                  <div className="p-8 border-b bg-slate-50">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                        <RefreshCw className="animate-spin" size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Otimização em Curso</h2>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{compressionLabel}</p>
                      </div>
                    </div>

                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${(compressionProgress.current / compressionProgress.total) * 100}%` }}
                         className="h-full bg-blue-600"
                       />
                    </div>
                    <div className="flex justify-between mt-2">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progresso Total</span>
                       <span className="text-sm font-black text-blue-600">{Math.round((compressionProgress.current / compressionProgress.total) * 100)}%</span>
                    </div>
                  </div>

                  <div className="flex-1 p-6 overflow-y-auto bg-slate-900 font-mono text-[10px] space-y-1">
                    {syncLogs.map((log, i) => (
                      <div key={i} className={`flex gap-3 ${log.includes('✅') ? 'text-emerald-400' : log.includes('❌') ? 'text-red-400' : 'text-blue-300'}`}>
                        <span className="opacity-30">[{new Date().toLocaleTimeString()}]</span>
                        <span className="flex-1">{log}</span>
                      </div>
                    ))}
                    {syncLogs.length === 0 && (
                      <div className="text-slate-600 italic">A aguardar início do processo...</div>
                    )}
                  </div>

                  <div className="p-4 bg-slate-50 border-t flex flex-col items-center gap-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Não feche esta janela enquanto o processo não terminar
                    </p>
                    <button 
                      onClick={() => {
                        if (window.confirm("Tem a certeza que deseja cancelar? O processo pode ficar incompleto.")) {
                          setIsCompressing(false);
                          window.location.reload(); // Hard reset to stop the process
                        }
                      }}
                      className="text-[10px] font-black text-red-500 uppercase hover:underline"
                    >
                      Cancelar e Recarregar
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

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
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className={`flex-1 py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all ${isSaving ? 'bg-slate-400 cursor-not-allowed text-white' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'}`}
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>A guardar...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>{t('save')}</span>
                      </>
                    )}
                  </button>
                  <button 
                    type="button" 
                    disabled={isSaving}
                    onClick={() => { setEditingItem(null); setIsAddingNew(false); }} 
                    className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-300 disabled:opacity-50"
                  >
                    {t('cancel')}
                  </button>
                </div>
             </form>
           </div>
         )}
      </main>
      {/* SYNC SELECTOR MODAL */}
      <AnimatePresence>
        {showSyncSelector && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-white/20"
            >
              <div className="p-8 bg-gradient-to-br from-slate-900 to-blue-900 text-white relative">
                 <button onClick={() => setShowSyncSelector(false)} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X size={24} />
                 </button>
                 <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40">
                       <Zap className="text-white" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black uppercase tracking-tighter">Publicar Alterações</h3>
                       <p className="text-blue-200 text-xs font-bold opacity-80 uppercase tracking-widest">Selecione o que deseja sincronizar</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => {
                     if (modifiedCategories.size === 0) {
                        alert('Não existem categorias com alterações pendentes.');
                        return;
                     }
                     setSyncSelection(Array.from(modifiedCategories));
                     setTimeout(handleSyncAndCompress, 100);
                   }}
                   className="mt-4 w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 text-white font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2"
                 >
                   <CloudSync size={16} /> Publicar Apenas Alterações ({modifiedCategories.size})
                 </button>
                 
                 <button 
                   onClick={() => {
                     setSyncSelection([
                       'restaurants', 'shops', 'beauty', 'hotels', 'cars', 'activities', 'services', 
                       'auto_repairs', 'auto_electronics', 'used_market', 'animals', 'real_estate', 
                       'gyms', 'stands', 'offices', 'it_services', 'perfumes', 'flights', 'bus-schedules'
                     ]);
                     setTimeout(handleSyncAndCompress, 100);
                   }}
                   className="mt-2 w-full py-2 bg-slate-800 text-slate-400 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                 >
                   Forçar Publicação de Tudo (Reset Sync)
                 </button>
              </div>

              <div className="p-8">
                 <div className="flex justify-between items-center mb-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Categorias Disponíveis</p>
                    <div className="flex gap-4">
                       <button 
                         onClick={() => setSyncSelection([
                           'restaurants', 'shops', 'beauty', 'hotels', 'cars', 'activities', 'services', 
                           'auto_repairs', 'auto_electronics', 'used_market', 'animals', 'real_estate', 
                           'gyms', 'stands', 'offices', 'it_services', 'perfumes', 'flights', 'bus-schedules'
                         ])}
                         className="text-[10px] font-black text-blue-600 uppercase hover:underline"
                       >
                         Selecionar Todas
                       </button>
                       <button 
                         onClick={() => setSyncSelection([])}
                         className="text-[10px] font-black text-slate-400 uppercase hover:underline"
                       >
                         Limpar
                       </button>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[40vh] overflow-y-auto p-2 scrollbar-hide">
                    {[
                      { id: 'restaurants', label: 'Restaurantes', icon: Utensils },
                      { id: 'hotels', label: 'Alojamentos', icon: BedDouble },
                      { id: 'cars', label: 'Rentcar', icon: CarIcon },
                      { id: 'activities', label: 'Atividades', icon: Mountain },
                      { id: 'shops', label: 'Lojas', icon: ShoppingBag },
                      { id: 'beauty', label: 'Beleza', icon: Sparkles },
                      { id: 'services', label: 'Serviços', icon: Briefcase },
                      { id: 'auto_repairs', label: 'Reparação Auto', icon: Wrench },
                      { id: 'auto_electronics', label: 'Eletrónica Auto', icon: Zap },
                      { id: 'used_market', label: 'Mercado Usados', icon: ShoppingCart },
                      { id: 'animals', label: 'Animais', icon: Dog },
                      { id: 'real_estate', label: 'Imobiliária', icon: Building2 },
                      { id: 'gyms', label: 'Ginásios', icon: Dumbbell },
                      { id: 'stands', label: 'Stands', icon: CarFront },
                      { id: 'offices', label: 'Escritórios', icon: Building2 },
                      { id: 'it_services', label: 'Informática', icon: Laptop },
                      { id: 'perfumes', label: 'Perfumaria', icon: Pipette },
                      { id: 'flights', label: 'Voos', icon: Plane },
                      { id: 'bus-schedules', label: 'Autocarros', icon: Bus }
                    ].map(cat => (
                      <label 
                        key={cat.id} 
                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer group ${syncSelection.includes(cat.id) ? 'bg-blue-50 border-blue-500 shadow-md shadow-blue-500/10' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}
                      >
                         <input 
                           type="checkbox" 
                           className="hidden" 
                           checked={syncSelection.includes(cat.id)}
                           onChange={() => {
                             if (syncSelection.includes(cat.id)) {
                               setSyncSelection(syncSelection.filter(s => s !== cat.id));
                             } else {
                               setSyncSelection([...syncSelection, cat.id]);
                             }
                           }}
                         />
                         <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${syncSelection.includes(cat.id) ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 group-hover:text-blue-500'}`}>
                            <cat.icon size={16} />
                         </div>
                         <span className={`text-[11px] font-black uppercase tracking-tight ${syncSelection.includes(cat.id) ? 'text-blue-900' : 'text-slate-500'}`}>
                            {cat.label}
                         </span>
                         {modifiedCategories.has(cat.id) && (
                            <span className="ml-auto bg-amber-100 text-amber-600 text-[8px] font-black px-2 py-0.5 rounded-full border border-amber-200">
                              ALTERADO
                            </span>
                          )}
                      </label>
                    ))}
                 </div>

                 <div className="mt-10 flex gap-4">
                    <button 
                      onClick={() => setShowSyncSelector(false)}
                      className="flex-1 py-4 rounded-2xl border-2 border-slate-100 text-slate-400 font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-all"
                    >
                       Cancelar
                    </button>
                    <button 
                      onClick={handleSyncAndCompress}
                      disabled={syncSelection.length === 0}
                      className="flex-[2] py-4 rounded-2xl bg-blue-600 text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-500/30 hover:bg-blue-700 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                    >
                       <Zap size={18} /> Publicar Selecionados ({syncSelection.length})
                    </button>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SYNC PROGRESS OVERLAY */}
      <AnimatePresence>
        {isCompressing && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
          >
             <div className="w-full max-w-lg space-y-12">
                <div className="relative">
                   <div className="absolute inset-0 bg-blue-500/20 blur-[100px] animate-pulse rounded-full" />
                   <motion.div 
                     animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                     className="w-24 h-24 border-4 border-blue-500/30 border-t-blue-500 rounded-full mx-auto relative z-10"
                   />
                   <Zap size={40} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 animate-bounce" />
                </div>

                <div className="space-y-4 relative z-10">
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Sincronização em Curso</h2>
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                      <p className="text-blue-400 font-bold uppercase tracking-[0.3em] text-xs">{compressionLabel}</p>
                    </div>
                 </div>

                 <div className="space-y-6 relative z-10">
                    <div className="flex justify-between text-[10px] font-black text-white/50 uppercase tracking-widest">
                       <span>Estado: {compressionProgress.current === compressionProgress.total ? 'Concluído' : 'Em andamento...'}</span>
                       <span className="text-blue-400">{Math.round((compressionProgress.current / (compressionProgress.total || 1)) * 100)}%</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/10 p-[2px]">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${compressionProgress.total > 0 ? (compressionProgress.current / compressionProgress.total) * 100 : 0}%` }}
                         className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                       />
                    </div>
                    <div className="flex justify-between items-center px-1">
                      <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest">
                         {compressionProgress.current} de {compressionProgress.total} itens processados
                      </p>
                      {compressionProgress.current === compressionProgress.total && (
                        <div className="flex items-center gap-1 text-emerald-400 text-[9px] font-black uppercase">
                          <CheckCircle size={10} /> Sincronizado
                        </div>
                      )}
                    </div>
                 </div>

                <div className="bg-black/40 border border-white/10 rounded-[2rem] p-6 h-48 overflow-y-auto text-left font-mono text-[10px] space-y-2 scrollbar-hide shadow-inner">
                   {syncLogs.map((log, i) => (
                     <div key={i} className={`flex gap-3 ${log.includes('✅') ? 'text-emerald-400' : log.includes('❌') ? 'text-red-400' : 'text-slate-400'}`}>
                        <span className="opacity-30">[{new Date().toLocaleTimeString()}]</span>
                        <span className="font-bold">{log}</span>
                     </div>
                   ))}
                </div>

                <div className="pt-4">
                   <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.5em] animate-pulse">Não feche esta janela até terminar</p>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {showSyncSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 right-10 z-[200] bg-emerald-600 text-white p-8 rounded-[2.5rem] shadow-2xl flex items-center gap-6 border-4 border-emerald-400/30 backdrop-blur-xl"
          >
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle size={32} className="text-emerald-600" />
             </div>
             <div className="pr-4">
                <h4 className="text-2xl font-black uppercase tracking-tighter">Publicado com Sucesso!</h4>
                <p className="text-emerald-100 text-sm font-bold opacity-90">Todos os dados foram enviados e já estão visíveis no Frontend.</p>
             </div>
             <button onClick={() => setShowSyncSuccess(false)} className="p-2 hover:bg-white/10 rounded-full">
                <X size={20} />
             </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
