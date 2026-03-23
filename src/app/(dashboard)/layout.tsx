"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Users,
  Coins,
  UserCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sprout,
  TreePine,
  Leaf,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils/cn";
import { NotificationBell } from "@/components/notifications/notification-bell";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

// ---------------------------------------------------------------------------
// Mock user — replace with real auth data
// ---------------------------------------------------------------------------

const MOCK_USER = {
  name: "Dott.ssa Marta Ferretti",
  avatarInitials: "MF",
  growthStage: "Esploratore",
  growthStageIcon: Sprout,
};

const GROWTH_STAGE_CONFIG: Record<string, { icon: React.ComponentType<{ size?: number; className?: string }>; bg: string; text: string }> = {
  Esploratore: { icon: Sprout, bg: "bg-primary-100", text: "text-primary-700" },
  Crescita: { icon: Leaf, bg: "bg-secondary-100", text: "text-secondary-700" },
  Consolidato: { icon: TreePine, bg: "bg-accent-100", text: "text-accent-700" },
};

// ---------------------------------------------------------------------------
// Nav items
// ---------------------------------------------------------------------------

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard/psychologist", label: "Panoramica", icon: LayoutDashboard },
  { href: "/dashboard/psychologist/cases", label: "Casi in arrivo", icon: Inbox },
  { href: "/dashboard/psychologist/patients", label: "I miei pazienti", icon: Users },
  { href: "/dashboard/psychologist/credits", label: "Crediti", icon: Coins },
  { href: "/dashboard/psychologist/profile", label: "Profilo", icon: UserCircle },
  { href: "/dashboard/psychologist/settings", label: "Impostazioni", icon: Settings },
];

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

function Sidebar({
  collapsed,
  onToggleCollapse,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const pathname = usePathname();
  const stageConfig = GROWTH_STAGE_CONFIG[MOCK_USER.growthStage] ?? GROWTH_STAGE_CONFIG["Esploratore"];
  const StageIcon = stageConfig.icon;

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen bg-surface border-r border-border sticky top-0 transition-all duration-300 ease-in-out shrink-0",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      {/* Logo / brand */}
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-5 border-b border-border",
          collapsed && "justify-center px-2"
        )}
      >
        <div className="w-8 h-8 rounded-xl bg-primary-500 flex items-center justify-center shrink-0">
          <Sprout size={16} className="text-white" />
        </div>
        {!collapsed && (
          <span className="text-base font-heading font-bold text-text tracking-tight">Synapsy</span>
        )}
      </div>

      {/* User card */}
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-4 border-b border-border",
          collapsed && "justify-center px-2"
        )}
      >
        <div className="w-9 h-9 rounded-full bg-primary-200 flex items-center justify-center shrink-0">
          <span className="text-xs font-heading font-bold text-primary-700">
            {MOCK_USER.avatarInitials}
          </span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-body font-semibold text-text truncate leading-tight">
              {MOCK_USER.name}
            </p>
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs font-body px-1.5 py-0.5 rounded-full mt-0.5",
                stageConfig.bg,
                stageConfig.text
              )}
            >
              <StageIcon size={10} />
              {MOCK_USER.growthStage}
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/dashboard/psychologist"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-body font-medium transition-all duration-150 group relative",
                    isActive
                      ? "bg-primary-100 text-primary-700"
                      : "text-text-secondary hover:bg-bg-subtle hover:text-text",
                    collapsed && "justify-center px-2"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon
                    size={18}
                    className={cn(
                      "shrink-0 transition-colors",
                      isActive ? "text-primary-600" : "text-text-tertiary group-hover:text-text-secondary"
                    )}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary-500 rounded-full"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-border">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center h-9 rounded-xl text-text-tertiary hover:bg-bg-subtle hover:text-text-secondary transition-colors"
          aria-label={collapsed ? "Espandi sidebar" : "Comprimi sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Mobile bottom nav
// ---------------------------------------------------------------------------

function MobileNav() {
  const pathname = usePathname();
  const mobileItems = NAV_ITEMS.slice(0, 5); // show first 5

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border">
      <ul className="flex">
        {mobileItems.map((item) => {
          const isActive =
            item.href === "/dashboard/psychologist"
              ? pathname === item.href
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-body font-medium transition-colors",
                  isActive ? "text-primary-600" : "text-text-tertiary"
                )}
              >
                <Icon size={20} />
                <span className="truncate leading-none">{item.label.split(" ")[0]}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Mobile top bar
// ---------------------------------------------------------------------------

function MobileTopBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const currentItem = NAV_ITEMS.find((item) =>
    item.href === "/dashboard/psychologist"
      ? pathname === item.href
      : pathname.startsWith(item.href)
  );
  const stageConfig = GROWTH_STAGE_CONFIG[MOCK_USER.growthStage] ?? GROWTH_STAGE_CONFIG["Esploratore"];
  const StageIcon = stageConfig.icon;

  return (
    <>
      <header className="md:hidden sticky top-0 z-30 bg-surface border-b border-border px-4 py-3 flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center shrink-0">
          <Sprout size={14} className="text-white" />
        </div>
        <span className="flex-1 text-sm font-heading font-semibold text-text">
          {currentItem?.label ?? "Dashboard"}
        </span>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "hidden sm:inline-flex items-center gap-1 text-xs font-body px-2 py-0.5 rounded-full",
              stageConfig.bg,
              stageConfig.text
            )}
          >
            <StageIcon size={10} />
            {MOCK_USER.growthStage}
          </span>
          <NotificationBell />
          <div className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center">
            <span className="text-xs font-heading font-bold text-primary-700">
              {MOCK_USER.avatarInitials}
            </span>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:bg-bg-subtle transition-colors"
            aria-label="Menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="md:hidden fixed top-[57px] left-0 right-0 z-20 bg-surface border-b border-border shadow-md"
          >
            <nav className="py-2 px-2">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === "/dashboard/psychologist"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-body font-medium transition-colors mb-0.5",
                      isActive
                        ? "bg-primary-100 text-primary-700"
                        : "text-text-secondary hover:bg-bg-subtle hover:text-text"
                    )}
                  >
                    <Icon size={18} className={isActive ? "text-primary-600" : "text-text-tertiary"} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Desktop sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <MobileTopBar />

        {/* Desktop top bar */}
        <header className="hidden md:flex items-center justify-between px-6 py-4 bg-surface border-b border-border sticky top-0 z-20">
          <div />
          <div className="flex items-center gap-3">
            {(() => {
              const stageConfig = GROWTH_STAGE_CONFIG[MOCK_USER.growthStage] ?? GROWTH_STAGE_CONFIG["Esploratore"];
              const StageIcon = stageConfig.icon;
              return (
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 text-xs font-body font-medium px-2.5 py-1 rounded-full",
                    stageConfig.bg,
                    stageConfig.text
                  )}
                >
                  <StageIcon size={12} />
                  {MOCK_USER.growthStage}
                </span>
              );
            })()}
            <NotificationBell />
            <div className="w-9 h-9 rounded-full bg-primary-200 flex items-center justify-center">
              <span className="text-sm font-heading font-bold text-primary-700">
                {MOCK_USER.avatarInitials}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <MobileNav />
    </div>
  );
}
