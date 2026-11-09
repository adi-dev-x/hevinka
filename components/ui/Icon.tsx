import {
  AppWindow, BadgeCheck, Box, Briefcase, BuildingComplex, Calendar, ChartColumn, ChartLine, ChartPie,
  CircleQuestionMark, ClipboardCheck, CloudCog, Code, ConciergeBell, Contact, Database, Factory, FileText, Forklift,
  Fuel, Funnel, Gauge, Globe, Handshake, HardHat, Headset, Infinity as InfinityIcon, Key, Laptop, Layers,
  LayoutDashboard, Lightbulb, Lock, Mail, Map, MapPin, Megaphone, MessageCircle, MessagesSquare, MonitorCog,
  MousePointer, Network, PackageCheck, Phone, Plug, Puzzle, Receipt, RefreshCw, Rocket, Route, Search, Server,
  Settings, Shapes, ShieldCheck, Ship, ShoppingBag, ShoppingCart, SlidersHorizontal, Smartphone, Sprout, Target,
  Telescope, Tractor, TrendingUp, Truck, TriangleAlert, User, UserPlus, Users, Wallet, Warehouse, Workflow, Wrench, Zap,
  type LucideIcon, type LucideProps,
} from "lucide-react";
import type { IconName } from "@/lib/content";

const map: Record<IconName, LucideIcon> = {
  globe: Globe, "cloud-cog": CloudCog, "shield-check": ShieldCheck, users: Users, telescope: Telescope, target: Target,
  lightbulb: Lightbulb, search: Search, puzzle: Puzzle, code: Code, "trending-up": TrendingUp, settings: Settings,
  "pie-chart": ChartPie, laptop: Laptop, network: Network, rocket: Rocket, user: User, headset: Headset,
  "bar-chart": ChartColumn, "monitor-cog": MonitorCog, contact: Contact, excavator: Tractor, truck: Truck,
  workflow: Workflow, "app-window": AppWindow, "mouse-pointer": MousePointer, building: HardHat, ship: Ship,
  forklift: Forklift, "shopping-cart": ShoppingCart, factory: Factory, "shopping-bag": ShoppingBag,
  concierge: ConciergeBell, briefcase: Briefcase, "building-2": BuildingComplex, shapes: Shapes,
  sliders: SlidersHorizontal, handshake: Handshake, "layout-dashboard": LayoutDashboard,
  "message-circle": MessageCircle, mail: Mail, database: Database, lock: Lock, "user-plus": UserPlus,
  "help-circle": CircleQuestionMark, megaphone: Megaphone, messages: MessagesSquare, "line-chart": ChartLine, key: Key,
  receipt: Receipt, plug: Plug, phone: Phone, "map-pin": MapPin, box: Box, zap: Zap, layers: Layers, server: Server,
  smartphone: Smartphone, refresh: RefreshCw, wallet: Wallet, calendar: Calendar, "file-text": FileText,
  wrench: Wrench, "clipboard-check": ClipboardCheck, "alert-triangle": TriangleAlert, route: Route, fuel: Fuel,
  "package-check": PackageCheck, warehouse: Warehouse, gauge: Gauge, map: Map, "badge-check": BadgeCheck,
  funnel: Funnel, infinity: InfinityIcon, sprout: Sprout,
};

/** Brand line icon — 1.5 stroke, rounded joins (matches the brochure). Decorative by default. */
export function Icon({ name, strokeWidth = 1.5, ...props }: { name: IconName } & LucideProps) {
  const Cmp = map[name];
  return <Cmp strokeWidth={strokeWidth} aria-hidden="true" focusable="false" {...props} />;
}
