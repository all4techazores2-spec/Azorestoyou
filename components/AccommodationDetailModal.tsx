
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hotel, Room, Language } from '../types';
import { 
  X, Mail, Phone, MapPin, Star, BedDouble, 
  Users, Check, ArrowRight, Home, Building2,
  ChevronRight, Info
} from 'lucide-react';
import { getTranslation } from '../translations';

interface AccommodationDetailModalProps {
  accommodation: Hotel;
  language: string;
  onClose: () => void;
  onConfirm: (accommodation: Hotel, selectedRoom?: Room, rentType?: 'room' | 'house') => void;
}

const AccommodationDetailModal: React.FC<AccommodationDetailModalProps> = ({
  accommodation,
  language,
  onClose,
  onConfirm
}) => {
  const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3001'
    : 'https://azorestoyou-1.onrender.com';

  const [rentType, setRentType] = useState<'room' | 'house' | null>(null);
  const [showALOptions, setShowALOptions] = useState(accommodation.type === 'al');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [previewRoom, setPreviewRoom] = useState<Room | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  // Auto-slide effect for main accommodation images
  useEffect(() => {
    const images = [accommodation.image, ...(accommodation.gallery || [])];
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setMainImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [accommodation]);

  // Auto-slide effect for room preview
  useEffect(() => {
    if (!previewRoom) {
      setCurrentImageIndex(0);
      return;
    }
    const images = [previewRoom.image, ...(previewRoom.gallery || [])];
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [previewRoom]);

  const lang = language as Language;
  const t = (key: any) => getTranslation(lang, key);

  // Mock rooms if none exist
  const rooms: Room[] = accommodation.rooms || [
    { 
      id: 'R1', name: 'Quarto Standard', description: 'Conforto essencial com vista para a montanha.', 
      pricePerNight: accommodation.pricePerNight, capacity: 2, image: 'https://picsum.photos/800/600?random=20',
      amenities: ['Wi-Fi', 'TV Plana', 'Ar Condicionado', 'Minibar'],
      bedType: 'Casal',
      gallery: ['https://picsum.photos/800/600?random=100', 'https://picsum.photos/800/600?random=101']
    },
    { 
      id: 'R2', name: 'Quarto Deluxe', description: 'Espaçoso com varanda privada e vista mar.', 
      pricePerNight: accommodation.pricePerNight + 40, capacity: 2, image: 'https://picsum.photos/800/600?random=21',
      amenities: ['Wi-Fi Grátis', 'TV Plana 4K', 'Ar Condicionado', 'Minibar Premium', 'Máquina Café'],
      bedType: 'Dupla',
      gallery: ['https://picsum.photos/800/600?random=102', 'https://picsum.photos/800/600?random=103']
    },
    { 
      id: 'R3', name: 'Suite Familiar', description: 'A solução ideal para famílias, com dois quartos comunicantes.', 
      pricePerNight: accommodation.pricePerNight + 80, capacity: 4, image: 'https://picsum.photos/800/600?random=22',
      amenities: ['Wi-Fi Grátis', '2 TVs Planas', 'Ar Condicionado', 'Área de Estar', 'Cozinha'],
      bedType: 'Casal',
      gallery: ['https://picsum.photos/800/600?random=104', 'https://picsum.photos/800/600?random=105']
    },
  ];

  const handleConfirm = () => {
    if (accommodation.type === 'al' && !rentType) return;
    if (accommodation.type === 'hotel' && !selectedRoom) return;
    if (accommodation.type === 'al' && rentType === 'room' && !selectedRoom) return;

    onConfirm(accommodation, selectedRoom || undefined, rentType || undefined);
  };

  const openGoogleMaps = () => {
    if (accommodation.mapsUrl) {
      window.open(accommodation.mapsUrl, '_blank');
    } else {
      const query = encodeURIComponent(`${accommodation.name}, ${accommodation.island}, Azores`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative"
      >
        {/* Main Close Button - Refined */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-3 bg-white text-slate-800 hover:bg-blue-600 hover:text-white rounded-full transition-all shadow-lg border border-slate-100 group"
        >
          <X size={20} className="group-active:scale-90 transition-transform" />
        </button>

        {/* Hero Section with Slider */}
        <div className="h-64 relative shrink-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img 
              key={accommodation.id + mainImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              src={[accommodation.image, ...(accommodation.gallery || [])][mainImageIndex].startsWith('/') ? `${API_BASE_URL}${[accommodation.image, ...(accommodation.gallery || [])][mainImageIndex]}` : [accommodation.image, ...(accommodation.gallery || [])][mainImageIndex]} 
              className="w-full h-full object-cover" 
              alt={accommodation.name} 
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute bottom-6 left-8 right-8">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${accommodation.type === 'al' ? 'bg-orange-500 text-white' : 'bg-blue-600 text-white'}`}>
                {accommodation.type === 'al' ? 'AL (Alojamento Local)' : 'Hotel'}
              </span>
              <div className="flex gap-0.5">
                {[...Array(accommodation.stars)].map((_, i) => (
                  <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">{accommodation.name}</h2>
            <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
              <MapPin size={14} className="text-blue-400" />
              <span className="font-bold">{accommodation.island}</span>
            </div>
          </div>

          {/* Main Slider Dots */}
          {accommodation.gallery && accommodation.gallery.length > 0 && (
             <div className="absolute bottom-6 right-8 flex gap-1.5">
                {[accommodation.image, ...accommodation.gallery].map((_, i) => (
                  <div key={i} className={`w-1 h-1 rounded-full transition-all ${mainImageIndex === i ? 'bg-white w-3' : 'bg-white/30'}`} />
                ))}
             </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-8 flex flex-col md:flex-row gap-8 scrollbar-hide">
          {/* Left Column: Info & Contacts */}
          <div className="md:w-1/3 space-y-6">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Info size={14} /> Contactos
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Mail size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Email</span>
                    <span className="text-sm font-bold text-slate-700">{accommodation.email || `info@${accommodation.id.toLowerCase()}.az`}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Phone size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Telefone</span>
                    <span className="text-sm font-bold text-slate-700">{accommodation.phone || '+351 296 000 000'}</span>
                  </div>
                </div>
                <button 
                  onClick={openGoogleMaps}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all group"
                >
                  <MapPin size={16} className="text-red-500 group-hover:text-white" />
                  Ver Direções
                </button>
              </div>
            </div>

            <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
               <p className="text-xs text-blue-800/70 font-medium leading-relaxed italic">
                 "{accommodation.description}"
               </p>
            </div>
          </div>

          {/* Right Column: Options & Rooms */}
          <div className="flex-1 space-y-6">
            <AnimatePresence mode="wait">
              {showALOptions ? (
                <motion.div 
                  key="al-options"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2">Como deseja alugar?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                      onClick={() => { setRentType('room'); setShowALOptions(false); }}
                      className="p-6 bg-white border-2 border-slate-100 rounded-[2rem] text-left hover:border-blue-500 hover:bg-blue-50 transition-all group"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <BedDouble size={24} />
                      </div>
                      <h4 className="font-black text-slate-800 uppercase tracking-tight">Apenas Quarto</h4>
                      <p className="text-xs text-slate-400 font-medium mt-1">Alugue um quarto privado e partilhe as áreas comuns.</p>
                      <div className="mt-4 flex items-center text-blue-600 text-[10px] font-black uppercase tracking-widest">
                        Escolher Quarto <ChevronRight size={14} />
                      </div>
                    </button>
                    <button 
                      onClick={() => { setRentType('house'); setSelectedRoom(rooms[0]); handleConfirm(); }}
                      className="p-6 bg-white border-2 border-slate-100 rounded-[2rem] text-left hover:border-blue-500 hover:bg-blue-50 transition-all group"
                    >
                      <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-4 group-hover:bg-orange-600 group-hover:text-white transition-all">
                        <Home size={24} />
                      </div>
                      <h4 className="font-black text-slate-800 uppercase tracking-tight">Casa Toda</h4>
                      <p className="text-xs text-slate-400 font-medium mt-1">Tenha total privacidade alugando a propriedade completa.</p>
                      <div className="mt-4 flex items-center text-orange-600 text-[10px] font-black uppercase tracking-widest">
                        Reservar Agora <ChevronRight size={14} />
                      </div>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="room-selection"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Escolha o Quarto</h3>
                    {accommodation.type === 'al' && (
                      <button 
                        onClick={() => setShowALOptions(true)}
                        className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                      >
                        Voltar a Opções
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {rooms.map(room => (
                      <div key={room.id} className="relative">
                        <button 
                          onClick={() => setPreviewRoom(room)}
                          className={`w-full flex items-center p-4 rounded-[1.5rem] border-2 transition-all gap-4 text-left group
                            ${selectedRoom?.id === room.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}
                        >
                          <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative">
                            <img 
                              src={room.image.startsWith('/') ? `${API_BASE_URL}${room.image}` : room.image} 
                              className="w-full h-full object-cover" 
                              alt={room.name} 
                            />
                            <div 
                              onClick={(e) => { e.stopPropagation(); setPreviewRoom(room); }}
                              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            >
                               <span className="text-[10px] font-black text-white uppercase tracking-widest">Ver Fotos</span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h4 className="font-black text-slate-800 uppercase tracking-tight truncate">{room.name}</h4>
                              <span className="text-blue-600 font-black text-sm whitespace-nowrap">€{room.pricePerNight}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{room.description}</p>
                            <div className="flex items-center gap-3 mt-2">
                               <div className="flex items-center gap-1 text-slate-400">
                                 <Users size={12} />
                                 <span className="text-[10px] font-bold">{room.capacity} Pax</span>
                               </div>
                               <div className="flex items-center gap-1 text-slate-400">
                                 <BedDouble size={12} />
                                 <span className="text-[10px] font-bold">{room.bedType}</span>
                               </div>
                            </div>
                          </div>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all
                            ${selectedRoom?.id === room.id ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200'}`}>
                            {selectedRoom?.id === room.id && <Check size={14} />}
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4">
                    <button 
                      onClick={handleConfirm}
                      disabled={!selectedRoom}
                      className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all
                        ${selectedRoom 
                          ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 hover:scale-[1.02]' 
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                    >
                      Confirmar Seleção <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Room Preview Modal (Popup) */}
        <AnimatePresence>
          {previewRoom && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xl">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white w-full max-w-2xl rounded-[2rem] md:rounded-[3rem] overflow-y-auto md:overflow-hidden shadow-2xl flex flex-col relative max-h-[95vh] md:max-h-none"
              >
                {/* Close Button - Refined */}
                <button 
                  onClick={() => setPreviewRoom(null)}
                  className="absolute top-6 right-6 z-20 p-3 bg-white text-slate-800 hover:bg-blue-600 hover:text-white rounded-full transition-all shadow-lg border border-slate-100 group"
                >
                  <X size={20} className="group-active:scale-90 transition-transform" />
                </button>

                {/* Image Slider with Fade In/Out */}
                <div className="h-72 relative overflow-hidden group/slider">
                   <motion.img 
                     key={previewRoom.id + currentImageIndex}
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     transition={{ duration: 0.8 }}
                     src={[previewRoom.image, ...(previewRoom.gallery || [])][currentImageIndex].startsWith('/') ? `${API_BASE_URL}${[previewRoom.image, ...(previewRoom.gallery || [])][currentImageIndex]}` : [previewRoom.image, ...(previewRoom.gallery || [])][currentImageIndex]} 
                     className="w-full h-full object-cover" 
                     alt={previewRoom.name} 
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                   
                   {/* Slider Navigation Indicators */}
                   <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-2">
                      {[previewRoom.image, ...(previewRoom.gallery || [])].map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 
                            ${currentImageIndex === i ? 'bg-blue-600 w-4' : 'bg-slate-300'}`} 
                        />
                      ))}
                   </div>
                </div>

                <div className="p-6 md:p-10 -mt-12 md:-mt-20 relative bg-white rounded-t-[2.5rem] md:rounded-t-[3rem] flex-1">
                   <div className="flex justify-between items-end mb-6">
                      <div>
                        <h3 className="text-xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter">{previewRoom.name}</h3>
                        <div className="flex items-center gap-2 text-blue-600 mt-1">
                           <BedDouble size={16} />
                           <span className="text-xs font-black uppercase tracking-widest">Cama {previewRoom.bedType}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl md:text-4xl font-black text-slate-900">€{previewRoom.pricePerNight}</span>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">por noite</p>
                      </div>
                   </div>

                   <p className="text-slate-500 font-medium leading-relaxed mb-8">
                     {previewRoom.description} Explore o máximo conforto neste quarto meticulosamente preparado para a sua estadia.
                   </p>

                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
                      {previewRoom.amenities?.map((amenity, i) => (
                        <div key={i} className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                           <div className="w-2 h-2 bg-blue-500 rounded-full" />
                           <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">{amenity}</span>
                        </div>
                      ))}
                   </div>

                   <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pb-6 md:pb-0">
                      <button 
                        onClick={() => { setSelectedRoom(previewRoom); setPreviewRoom(null); }}
                        className="flex-1 py-4 md:py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                      >
                        Selecionar Quarto <Check size={16} />
                      </button>
                      <button 
                        onClick={() => setPreviewRoom(null)}
                        className="flex-1 py-4 md:py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-black transition-all"
                      >
                        Voltar
                      </button>
                   </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AccommodationDetailModal;
