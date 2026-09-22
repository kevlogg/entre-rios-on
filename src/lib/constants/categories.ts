import { 
  ShoppingBag, 
  ShoppingCart, 
  Utensils, 
  Home, 
  Shirt, 
  Laptop, 
  Car, 
  Factory, 
  HardHat, 
  HeartPulse, 
  Umbrella, 
  LayoutGrid,
  LucideIcon
} from 'lucide-react';

export interface CategoryDef {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
  imageUrl: string;
  badge?: string;
  iconBg: string;
  iconColor: string;
  activeBg: string;
}

export const CATEGORIES_LIST: CategoryDef[] = [
  { 
    id: 'autos', 
    label: 'Autos, Motos y Vehículos', 
    icon: Car,
    description: 'Vehículos, motocicletas, repuestos y servicio automotor regional.',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80',
    iconBg: 'bg-rose-500/15 border-rose-200',
    iconColor: 'text-rose-600',
    activeBg: 'from-rose-600 to-rose-800'
  },
  { 
    id: 'tecnologia', 
    label: 'Celulares y Tecnología', 
    icon: Laptop,
    description: 'Dispositivos, computación, electrodomésticos y equipamiento digital.',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
    iconBg: 'bg-indigo-500/15 border-indigo-200',
    iconColor: 'text-indigo-600',
    activeBg: 'from-indigo-600 to-indigo-800'
  },
  { 
    id: 'gastronomia', 
    label: 'Gastronomía y Sabores', 
    icon: Utensils,
    description: 'Pescados de río, viñedos, comedores de barranca y repostería.',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
    iconBg: 'bg-amber-500/15 border-amber-200',
    iconColor: 'text-amber-600',
    activeBg: 'from-amber-500 to-amber-700'
  },
  { 
    id: 'hogar', 
    label: 'Hogar, Muebles y Jardín', 
    icon: Home,
    description: 'Muebles de madera regional, alfarería, deco y artículos para el hogar.',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80',
    iconBg: 'bg-emerald-500/15 border-emerald-200',
    iconColor: 'text-emerald-600',
    activeBg: 'from-emerald-600 to-emerald-800'
  },
  { 
    id: 'indumentaria', 
    label: 'Ropa, Calzado y Accesorios', 
    icon: Shirt,
    description: 'Calzado urbano, prendas de lana autóctona, accesorios y moda.',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
    iconBg: 'bg-pink-500/15 border-pink-200',
    iconColor: 'text-pink-600',
    activeBg: 'from-pink-600 to-rose-700'
  },
  { 
    id: 'comercios', 
    label: 'Comercios y Servicios B2B', 
    icon: ShoppingBag,
    description: 'Guía B2B de comercios, servicios profesionales y locales gastronómicos.',
    imageUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=400&q=80',
    iconBg: 'bg-blue-500/15 border-blue-200',
    iconColor: 'text-[#0047BA]',
    activeBg: 'from-[#0047BA] to-[#002878]'
  },
  { 
    id: 'productos', 
    label: 'Productos y Artesanías', 
    icon: ShoppingCart,
    description: 'Catálogo de productos regionales, artesanías y manufactura.',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=400&q=80',
    iconBg: 'bg-cyan-500/15 border-cyan-200',
    iconColor: 'text-[#00ADB5]',
    activeBg: 'from-[#00ADB5] to-[#007C8A]'
  },
  { 
    id: 'industria', 
    label: 'Herramientas e Industria', 
    icon: Factory,
    description: 'Insumos industriales, metalúrgica, parques industriales y maquinaria agro.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
    iconBg: 'bg-slate-500/15 border-slate-300',
    iconColor: 'text-slate-700',
    activeBg: 'from-slate-700 to-slate-900'
  },
  { 
    id: 'construccion', 
    label: 'Construcción e Inmuebles', 
    icon: HardHat,
    description: 'Corralones, grifería, cerámicos, revestimientos y servicios de obra.',
    imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=400&q=80',
    iconBg: 'bg-orange-500/15 border-orange-200',
    iconColor: 'text-orange-600',
    activeBg: 'from-orange-600 to-amber-700'
  },
  { 
    id: 'salud', 
    label: 'Belleza, Salud y Fitness', 
    icon: HeartPulse,
    description: 'Spas termales, cosmética natural, nutrición y centros de salud.',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80',
    iconBg: 'bg-red-500/15 border-red-200',
    iconColor: 'text-red-500',
    activeBg: 'from-red-500 to-rose-700'
  },
  { 
    id: 'turismo', 
    label: 'Turismo, Termas y Posadas', 
    icon: Umbrella,
    description: 'Paseos náuticos, complejos termales, playas, alojamientos y excursiones.',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80',
    iconBg: 'bg-teal-500/15 border-teal-200',
    iconColor: 'text-teal-600',
    activeBg: 'from-teal-600 to-cyan-700'
  },
  { 
    id: 'mas', 
    label: 'Más categorías', 
    icon: LayoutGrid,
    description: 'Sorteos, agronomía, servicios educativos y rubros adicionales.',
    imageUrl: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=400&q=80',
    iconBg: 'bg-violet-500/15 border-violet-200',
    iconColor: 'text-violet-600',
    activeBg: 'from-violet-600 to-purple-800'
  },
];
