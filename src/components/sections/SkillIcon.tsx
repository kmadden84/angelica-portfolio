"use client";

import {
  Search,
  BarChart3,
  Target,
  Calendar,
  Palette,
  Share2,
  Table,
  PenTool,
  Users,
  TrendingUp,
  Globe,
  Lightbulb,
  MessageSquare,
  Layout,
  Database,
  Code,
  Megaphone,
  Heart,
  Star,
  Zap,
  Briefcase,
  Award,
  Shield,
  Eye,
  Mic,
  Compass,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const iconMap: Record<string, LucideIcon> = {
  Search,
  BarChart3,
  Target,
  Calendar,
  Palette,
  Share2,
  Table,
  PenTool,
  Users,
  TrendingUp,
  Globe,
  Lightbulb,
  MessageSquare,
  Layout,
  Database,
  Code,
  Megaphone,
  Heart,
  Star,
  Zap,
  Briefcase,
  Award,
  Shield,
  Eye,
  Mic,
  Compass,
  Rocket,
};

interface SkillIconProps {
  name?: string;
  className?: string;
}

export function SkillIcon({ name, className }: SkillIconProps) {
  const Icon = name ? iconMap[name] : null;
  if (!Icon) {
    return <Zap className={cn("w-5 h-5", className)} />;
  }
  return <Icon className={cn("w-5 h-5", className)} />;
}
