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
  badge?: string;
  iconBg: string;
  iconColor: string;
  activeBg: string;
}

export const CATEGORIES_LIST: CategoryDef[] = [
  { 
    id: 'comercios', 
    label: 'Comercios y Servicios', 
    icon: ShoppingBag,
    description: 'Guía B2B de comercios, servicios profesionales y locales gastronómicos.',
    iconBg: 'bg-blue-500/15 border-blue-200',
    iconColor: 'text-[#0047BA]',
    activeBg: 'from-[#0047BA] to-[#002878]'
  },
  { 
    id: 'productos', 
    label: 'Productos', 
    icon: ShoppingCart,
    description: 'Catálogo de productos regionales, artesanías y manufactura.',
    iconBg: 'bg-cyan-500/15 border-cyan-200',
    iconColor: 'text-[#00ADB5]',
    activeBg: 'from-[#00ADB5] to-[#007C8A]'
  },
  { 
    id: 'gastronomia', 
    label: 'Gastronomía', 
    icon: Utensils,
    description: 'Pescados de río, viñedos, comedores de barranca y repostería.',
    iconBg: 'bg-amber-500/15 border-amber-200',
    iconColor: 'text-amber-600',
    activeBg: 'from-amber-500 to-amber-700'
  },
  { 
    id: 'hogar', 
    label: 'Hogar y Deco', 
    icon: Home,
    description: 'Muebles de madera regional, alfarería, deco y artículos para el hogar.',
    iconBg: 'bg-emerald-500/15 border-emerald-200',
    iconColor: 'text-emerald-600',
    activeBg: 'from-emerald-600 to-emerald-800'
  },
  { 
    id: 'indumentaria', 
    label: 'Indumentaria', 
    icon: Shirt,
    description: 'Calzado urbano, prendas de lana autóctona, accesorios y moda.',
    iconBg: 'bg-pink-500/15 border-pink-200',
    iconColor: 'text-pink-600',
    activeBg: 'from-pink-600 to-rose-700'
  },
  { 
    id: 'tecnologia', 
    label: 'Tecnología', 
    icon: Laptop,
    description: 'Dispositivos, computación, electrodomésticos y equipamiento digital.',
    iconBg: 'bg-indigo-500/15 border-indigo-200',
    iconColor: 'text-indigo-600',
    activeBg: 'from-indigo-600 to-indigo-800'
  },
  { 
    id: 'autos', 
    label: 'Autos y Motos', 
    icon: Car,
    description: 'Vehículos, motocicletas, repuestos y servicio automotor regional.',
    iconBg: 'bg-rose-500/15 border-rose-200',
    iconColor: 'text-rose-600',
    activeBg: 'from-rose-600 to-rose-800'
  },
  { 
    id: 'industria', 
    label: 'Industria', 
    icon: Factory,
    description: 'Insumos industriales, metalúrgica, parques industriales y maquinaria agro.',
    iconBg: 'bg-slate-500/15 border-slate-300',
    iconColor: 'text-slate-700',
    activeBg: 'from-slate-700 to-slate-900'
  },
  { 
    id: 'construccion', 
    label: 'Construcción', 
    icon: HardHat,
    description: 'Corralones, grifería, cerámicos, revestimientos y servicios de obra.',
    iconBg: 'bg-orange-500/15 border-orange-200',
    iconColor: 'text-orange-600',
    activeBg: 'from-orange-600 to-amber-700'
  },
  { 
    id: 'salud', 
    label: 'Salud y Bienestar', 
    icon: HeartPulse,
    description: 'Spas termales, cosmética natural, nutrición y centros de salud.',
    iconBg: 'bg-red-500/15 border-red-200',
    iconColor: 'text-red-500',
    activeBg: 'from-red-500 to-rose-700'
  },
  { 
    id: 'turismo', 
    label: 'Turismo', 
    icon: Umbrella,
    description: 'Paseos náuticos, complejos termales, playas, alojamientos y excursiones.',
    iconBg: 'bg-teal-500/15 border-teal-200',
    iconColor: 'text-teal-600',
    activeBg: 'from-teal-600 to-cyan-700'
  },
  { 
    id: 'mas', 
    label: 'Más categorías', 
    icon: LayoutGrid,
    description: 'Sorteos, agronomía, servicios educativos y rubros adicionales.',
    iconBg: 'bg-violet-500/15 border-violet-200',
    iconColor: 'text-violet-600',
    activeBg: 'from-violet-600 to-purple-800'
  },
];
