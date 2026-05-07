"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Menu, ShoppingBag, ShoppingCart, User, LogOut, Settings, MessageSquare, Package, HelpCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/auth-context';
import { useCart } from '@/contexts/cart-context';
import { PiPriceTicker } from './pi-price-ticker';

export function Navigation() {
  const authContext = useAuth();
  const cartContext = useCart();
  const [isOpen, setIsOpen] = useState(false);
  
  let user = authContext?.user || null;
  let isAuthenticated = authContext?.isAuthenticated || false;
  let login = authContext?.login || (() => {});
  let logout = authContext?.logout || (() => {});
  let items = cartContext?.items || [];
  
  const publicNavLinks = [
    { href: '/', label: 'Home' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/ship-with-pi', label: 'Ship with Pi' },
    { href: '/track-shipping', label: 'Track Shipping' },
    { href: '/feed', label: 'Feed' },
    { href: '/discover', label: 'Discover' },
    { href: '/list-task', label: 'Submit Task' },
    { href: '/earn', label: 'Earn Pi' },
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/news', label: 'News' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const dashboardLinks = user ? [
    { href: `/profile/${user.username || user.email?.split('@')[0] || 'user'}`, label: 'Profile', icon: User },
    { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
    ...(user.role === 'seller' ? [{ href: '/dashboard/listings', label: 'Listings', icon: Package }] : []),
    { href: '/dashboard/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/cart', label: 'Cart', icon: ShoppingCart },
    { href: '/dashboard/support', label: 'Support', icon: HelpCircle },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ] : [];

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Beagvs</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Top-level public links - Always show these core pages */}
            <Link href="/marketplace" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Marketplace
            </Link>
            <Link href="/ship-with-pi" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Ship
            </Link>
            <Link href="/track-shipping" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Track
            </Link>
            <Link href="/feed" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Feed
            </Link>
            <Link href="/discover" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Discover
            </Link>
            <Link href="/list-task" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Submit Task
            </Link>
            <Link href="/earn" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Earn Pi
            </Link>

            {/* More dropdown for secondary pages */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  More <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link href="/leaderboard">Leaderboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/news">News</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/about">About</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/contact">Contact</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Dashboard Links - Only when logged in */}
            {isAuthenticated && (
              <>
                <div className="h-4 w-px bg-border mx-1" />
                {dashboardLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                    {link.label === 'Cart' && cartItemCount > 0 && (
                      <span className="ml-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                ))}
              </>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <PiPriceTicker />
            {isAuthenticated && user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Hi, <span className="font-medium text-foreground">{user.username}</span>
                </span>
                {user.role === 'admin' && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={login}>Login</Button>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="flex lg:hidden items-center gap-2">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] overflow-y-auto">
                <div className="flex flex-col gap-4 mt-8 pb-20">
                  {isAuthenticated && user ? (
                    <>
                      {/* Public Links for logged-in users */}
                      <div className="space-y-2 pb-4 border-b">
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Browse</p>
                        {publicNavLinks.map((link) => (
                          <Link 
                            key={link.href}
                            href={link.href} 
                            className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors block" 
                            onClick={() => setIsOpen(false)}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>

                      {/* User account section */}
                      <div className="pb-4 border-b">
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">My Account</p>
                        <p className="font-semibold">{user.username}</p>
                        <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                      </div>

                      {/* Dashboard links */}
                      {dashboardLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-3"
                          onClick={() => setIsOpen(false)}
                        >
                          <link.icon className="h-5 w-5" />
                          <span>{link.label}</span>
                          {link.label === 'Cart' && cartItemCount > 0 && (
                            <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {cartItemCount}
                            </span>
                          )}
                        </Link>
                      ))}
                      
                      {user.role === 'admin' && (
                        <Link
                          href="/admin"
                          className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-3"
                          onClick={() => setIsOpen(false)}
                        >
                          <Settings className="h-5 w-5" />
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      
                      <Button 
                        variant="outline" 
                        onClick={() => { logout(); setIsOpen(false); }} 
                        className="bg-transparent mt-4 justify-start"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      {/* Single menu for visitors */}
                      {publicNavLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                      <Button onClick={() => { login(); setIsOpen(false); }} className="mt-4">
                        Login
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
