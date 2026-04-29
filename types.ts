
export type Language = 'pt' | 'en' | 'es' | 'it' | 'de';

export interface Airport {
  code: string;
  name: string;
  location: string;
  isAzores: boolean;
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string; // HH:mm
  arrivalTime: string;   // HH:mm
  price: number;
  status: 'A Horas' | 'Atrasado' | 'Embarque' | 'Cancelado';
  stops: number;         // 0 for direct
  duration: string;      // e.g., "2h 30m"
  layover?: string;      // e.g., "Escala em LIS (1h 20m)"
}

export interface Hotel {
  id: string;
  name: string;
  island: string;
  stars: number;
  pricePerNight: number;
  image: string;
  description: string;
}

export interface Car {
  id: string;
  model: string;
  companyId: string;
  type: 'Económico' | 'SUV' | 'Descapotável' | 'Carrinha';
  fuelType: 'Gasolina' | 'Gasóleo' | 'Híbrido' | 'Elétrico';
  pricePerDay: number;
  image: string;
  seats: number;
  isAvailable: boolean;
  description: string;
  features: string[];
}

export interface CarRentalCompany {
  id: string;
  name: string;
  address: string;
  email: string;
  contact: string;
  image: string;
}

export interface Dish {
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface OrderItem {
  dish: Dish;
  quantity: number;
  meatPoint?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  purchasePrice?: number;
  category: 'Pratos' | 'Bebidas' | 'Cafetaria' | 'Sobremesas' | 'Vinhos' | string;
  image: string;
  stock?: number;
  minStock?: number;
  supplierId?: string;
}

export interface KitchenOrder {
  id: string;
  tableId?: string;
  reservationId?: string;
  items: OrderItem[];
  status: 'pending_admin' | 'sent_to_kitchen' | 'preparing' | 'ready' | 'delivered' | 'waiting_confirmation';
  timestamp: string;
  isWalkIn?: boolean;
  requestedPrepTime?: string;
}

export interface RestaurantTable {
  id: string;
  number: number;
  seats: number;
  status: 'available' | 'occupied' | 'reserved';
  customerName?: string;
  reservationTime?: string;
  currentOrderId?: string;
  position?: { x: number, y: number };
  currentTab?: OrderItem[];
  alertStatus?: 'none' | 'calling_waiter' | 'waiting_bill' | 'new_order';
  walkInDetails?: { name: string; phone?: string; email?: string; pax: number };
}

export interface Reservation {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'accepted' | 'occupied' | 'cancelled' | 'finished';
  tableId?: string;
  createdAt: string;
  hasRated?: boolean;
  rating?: number;
  reviewNote?: string;
  // Advanced Workflow
  preOrder?: OrderItem[];
  consumedItems?: OrderItem[];
  prepRequested?: boolean;
  requestedTime?: string; // e.g., "now" or "15" (minutes)
  confirmedByRestaurant?: boolean;
}

export interface RestaurantUpdate {
  id: string;
  type: 'news' | 'event';
  title: string;
  description: string;
  date?: string; 
  image?: string;
  pricePerPerson?: number;
  pricePerCouple?: number;
}

export interface FiadoClient {
  id: string;
  name: string;
  phone: string;
  balance: number;
  lastVisit: string;
}

export interface StaffAttendanceLog {
  date: string;
  clockIn: string;
  clockOut?: string;
  totalHours?: number;
  status?: 'present' | 'justified_absence' | 'unjustified_absence';
  notes?: string;
}

export interface FleetVehicle {
  id: string;
  plate: string;
  model: string;
  responsibleStaffId?: string;
  status: 'active' | 'maintenance' | 'stopped';
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  nif: string;
  address: string;
  password?: string; // For supplier access
  staff?: StaffMember[];
  fleet?: FleetVehicle[];
}

export interface SupplierOrder {
  id: string;
  supplierId: string;
  restaurantId: string;
  restaurantName: string;
  items: { productId: string, quantity: number, price: number }[];
  status: 'pending' | 'approved' | 'sent' | 'received' | 'cancelled';
  total: number;
  createdAt: string;
}

export interface CashDrawerLog {
  id: string;
  type: 'open' | 'close';
  amount: number;
  timestamp: string;
  staffId?: string;
  notes?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'waiter' | 'chef' | 'manager';
  onDuty?: boolean;
  vacationStart?: string;
  vacationEnd?: string;
  attendanceLogs?: StaffAttendanceLog[];
  monthlyStats?: {
    month: string;
    totalHours: number;
    absences: number;
  }[];
}

export interface Restaurant {
  id: string;
  name: string;
  island: string;
  cuisine?: string;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  dishes?: Dish[];
  products?: Product[];
  tables?: RestaurantTable[];
  reservations?: Reservation[];
  kitchenOrders?: KitchenOrder[];
  updates?: RestaurantUpdate[];
  staff?: StaffMember[];
  adminEmail?: string;
  adminPassword?: string;
  phone?: string;
  address?: string;
  publicEmail?: string;
  mapsUrl?: string;
  latitude?: string;
  longitude?: string;
  gallery?: string[];
  fiadoClients?: FiadoClient[];
  suppliers?: Supplier[];
  supplierOrders?: SupplierOrder[];
  cashDrawerLogs?: CashDrawerLog[];
  isDrawerOpen?: boolean;
  currentDrawerAmount?: number;
  reviews_list?: { id: string, rating: number, comment: string, customerName: string, date: string }[];
  businessType?: 'restaurant' | 'shop' | 'beauty';
}

export interface Activity {
  id: string;
  title: string;
  type: 'trail' | 'culture' | 'landscape' | 'poi' | 'tradition' | 'activity' | 'bus';
  island: string;
  image: string;
  description: string;
  distance?: string;
  duration?: string;
  difficulty?: 'Fácil' | 'Moderado' | 'Difícil';
  mapUrl?: string;
}

export interface TourGuide {
  id: string;
  name: string;
  image: string;
  rating: number;
  price: number;
  languages: string[];
  specialty: string;
}

export interface BusStop {
  id: string;
  name: string;
}

export interface BusSchedule {
  id: string;
  company: string;
  island: string;
  origin: string;
  destination: string;
  times: string[];
  price: number;
  duration: string;
}

export type BookingStep = 'flights' | 'accommodation' | 'car' | 'summary';
export type ExploreCategory = 
  | 'restaurants' 
  | 'trails' 
  | 'culture' 
  | 'landscapes' 
  | 'rentcar' 
  | 'accommodation' 
  | 'activities' 
  | 'buses' 
  | 'poi' 
  | 'flights'
  | 'shops'
  | 'beauty'
  | null;

export type BeautySubCategory = 'beauty_salon' | 'hairdresser' | 'barber' | 'manicure' | 'massage';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  image: string;
}

export interface Business extends Restaurant {
  subcategory?: BeautySubCategory | string;
  services?: Service[];
}

export interface Itinerary {
  flight: Flight | null;
  hotel: Hotel | null;
  hotelStartDate?: string;
  hotelEndDate?: string;
  nights: number;
  car: Car | null;
  carStartDate?: string;
  carEndDate?: string;
  carDays: number;
}
