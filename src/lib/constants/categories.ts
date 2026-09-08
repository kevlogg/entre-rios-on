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
}

export const CATEGORIES_LIST: CategoryDef[] = [
  { 
    id: 'comercios', 
    label: 'Comercios y Servicios', 
    icon: ShoppingBag,
    description: 'Guía B2B de comercios, servicios profesionales y locales gastronómicos de Entre Ríos.'
  },
  { 
    id: 'productos', 
    label: 'Productos', 
    icon: ShoppingCart,
    description: 'Catálogo de productos regionales, artesanías y manufactura entrerriana.'
  },
  { 
    id: 'gastronomia', 
    label: 'Gastronomía', 
    icon: Utensils,
    description: 'Pescados de río, viñedos, comedores de barranca y repostería artesanal.'
  },
  { 
    id: 'hogar', 
    label: 'Hogar y Deco', 
    icon: Home,
    description: 'Muebles de madera regional, alfarería, deco y artículos para el hogar.'
  },
  { 
    id: 'indumentaria', 
    label: 'Indumentaria', 
    icon: Shirt,
    description: 'Calzado urbano, prendas de lana autóctona, accesorios y moda litoraleña.'
  },
  { 
    id: 'tecnologia', 
    label: 'Tecnología', 
    icon: Laptop,
    description: 'Dispositivos, computación, electrodomésticos y equipamiento digital.'
  },
  { 
    id: 'autos', 
    label: 'Autos y Motos', 
    icon: Car,
    description: 'Vehículos, motocicletas, repuestos y servicio automotor regional.'
  },
  { 
    id: 'industria', 
    label: 'Industria', 
    icon: Factory,
    description: 'Insumos industriales, metalúrgica, parques industriales y maquinaria agro.'
  },
  { 
    id: 'construccion', 
    label: 'Construcción', 
    icon: HardHat,
    description: 'Corralones, grifería, cerámicos, revestimientos y servicios de obra.'
  },
  { 
    id: 'salud', 
    label: 'Salud y Bienestar', 
    icon: HeartPulse,
    description: 'Spas termales, cosmética natural, nutrición y centros de salud.'
  },
  { 
    id: 'turismo', 
    label: 'Turismo', 
    icon: Umbrella,
    description: 'Paseos náuticos, complejas termas, playas, alojamientos y excursiones.'
  },
  { 
    id: 'mas', 
    label: 'Más categorías', 
    icon: LayoutGrid,
    description: 'Sorteos, agronomía, servicios educativos y rubros adicionales.'
  },
];
