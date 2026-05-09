'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ShoppingBag, Coins, Shield, Users, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SLIDES = [
  {
    id: 1,
    label: 'Marketplace',
    title: 'Buy, Sell & Ship',
    titleHighlight: 'with Pi',
    subtitle: 'The world\'s most secure marketplace powered by Pi Network blockchain technology. Thousands of verified listings await you.',
    cta: 'Browse Marketplace',
    ctaSecondary: 'View All Listings',
    href: '/marketplace',
    hrefSecondary: '/marketplace',
    icon: ShoppingBag,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80',
    accent: '#f59e0b',
    gradient: 'from-black/90 via-black/60 to-amber-900/30',
  },
  {
    id: 2,
    label: 'Earn Pi Rewards',
    title: 'Earn Pi',
    titleHighlight: 'Every Day',
    subtitle: 'Complete tasks, make sales, and earn Pi Network rewards. The more you participate, the more you earn on the Beagvs platform.',
    cta: 'Start Earning',
    ctaSecondary: 'View Tasks',
    href: '/earn',
    hrefSecondary: '/earn',
    icon: Coins,
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1920&q=80',
    accent: '#10b981',
    gradient: 'from-black/90 via-black/60 to-emerald-900/30',
  },
  {
    id: 3,
    label: 'Secure Escrow',
    title: 'Your Money',
    titleHighlight: 'Always Safe',
    subtitle: 'Every transaction protected by Pi Network escrow — your Pi is held securely until delivery is confirmed. Zero risk, total peace of mind.',
    cta: 'Learn How It Works',
    ctaSecondary: 'Start Shopping',
    href: '/about',
    hrefSecondary: '/marketplace',
    icon: Shield,
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1920&q=80',
    accent: '#6366f1',
    gradient: 'from-black/90 via-black/60 to-indigo-900/30',
  },
  {
    id: 4,
    label: 'Community',
    title: 'Connect with',
    titleHighlight: 'the World',
    subtitle: 'Join a thriving global community of buyers, sellers, and creators. Share, discover, and grow together on the Beagvs feed.',
    cta: 'Join the Community',
    ctaSecondary: 'Discover Users',
    href: '/feed',
    hrefSecondary: '/discover',
    icon: Users,
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=80',
    accent: '#ec4899',
    gradient: 'from-black/90 via-black/60 to-pink-900/30',
  },
  {
    id: 5,
    label: 'Global Shipping',
    title: 'Ship Anywhere',
    titleHighlight: 'in the World',
    subtitle: 'Multiple delivery options with real-time tracking, full insurance, and Pi-powered payments. Seamless logistics for every order.',
    cta: 'Ship with Pi',
    ctaSecondary: 'Track Package',
    href: '/ship-with-pi',
    hrefSecondary: '/track-shipping',
    icon: Truck,
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80',
    accent: '#0ea5e9',
    gradient: 'from-black/90 via-black/60 to-sky-900/30',
  },
];

const INTERVAL = 6000;

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);
  const currentRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const goTo = useCallback((index: number) => {
    currentRef.current = index;
    setCurrent(index);
    setProgress(0);
  }, []);

  const next = useCallback(() => {
    const nextIndex = (currentRef.current + 1) % SLIDES.length;
    goTo(nextIndex);
  }, [goTo]);

  const prev = useCallback(() => {
    const prevIndex = (currentRef.current - 1 + SLIDES.length) % SLIDES.length;
    goTo(prevIndex);
  }, [goTo]);

  // Auto-advance timer — only depends on isPaused, never on current
  useEffect(() => {
    isPausedRef.current = isPaused;

    const startTimer = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        if (!isPausedRef.current) {
          const nextIndex = (currentRef.current + 1) % SLIDES.length;
          currentRef.current = nextIndex;
          setCurrent(nextIndex);
          setProgress(0);
        }
      }, INTERVAL);
    };

    if (!isPaused) {
      startTimer();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  // Progress bar animation
  useEffect(() => {
    if (progressRef.current) clearInterval(progressRef.current);
    if (isPaused) return;

    const start = Date.now();
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / INTERVAL) * 100, 100);
      setProgress(pct);
    }, 30);

    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [current, isPaused]);

  const slide = SLIDES[current];
  const Icon = slide.icon;

  return (
    <section
      className="relative w-full min-h-screen overflow-hidden bg-black"
    >
      {/* Background slides */}
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${s.image})` }}
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${s.gradient}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex items-center min-h-screen pt-20">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-3xl">
            <div
              key={`badge-${current}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-semibold backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ backgroundColor: `${slide.accent}22`, border: `1px solid ${slide.accent}55` }}
            >
              <Icon className="h-4 w-4" style={{ color: slide.accent }} />
              <span style={{ color: slide.accent }}>{slide.label}</span>
            </div>

            <h1
              key={`title-${current}`}
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight animate-in fade-in slide-in-from-bottom-8 duration-500"
            >
              {slide.title}{' '}
              <span style={{ color: slide.accent }}>{slide.titleHighlight}</span>
            </h1>

            <p
              key={`sub-${current}`}
              className="text-lg md:text-xl text-white/75 mb-10 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-500"
              style={{ animationDelay: '100ms' }}
            >
              {slide.subtitle}
            </p>

            <div
              key={`cta-${current}`}
              className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-8 duration-500"
              style={{ animationDelay: '200ms' }}
            >
              <Button
                size="lg"
                className="font-bold px-8 py-6 text-base hover:scale-105 transition-all duration-300 shadow-2xl text-black"
                style={{ backgroundColor: slide.accent, boxShadow: `0 0 30px ${slide.accent}44` }}
                asChild
              >
                <Link href={slide.href}>{slide.cta}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 px-8 py-6 text-base hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link href={slide.hrefSecondary}>{slide.ctaSecondary}</Link>
              </Button>
            </div>

            <div className="mt-12 flex items-center gap-8 text-white/50 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span>10,000+ Active Users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: slide.accent }} />
                <span>5,000+ Listings</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span>98% Success Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/25 backdrop-blur-md text-white p-3 md:p-4 rounded-full transition-all duration-300 hover:scale-110 border border-white/20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/25 backdrop-blur-md text-white p-3 md:p-4 rounded-full transition-all duration-300 hover:scale-110 border border-white/20"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      {/* Dot indicators + counter */}
      <div className="absolute bottom-10 left-0 right-0 z-20 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          {SLIDES.map((s, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            >
              <div
                className="rounded-full transition-all duration-500"
                style={{
                  width: i === current ? '32px' : '10px',
                  height: '10px',
                  backgroundColor: i === current ? slide.accent : 'rgba(255,255,255,0.35)',
                }}
              />
            </button>
          ))}
        </div>
        <div className="text-white/40 text-xs font-mono tracking-widest">
          {String(current + 1).padStart(2, '0')} — {String(SLIDES.length).padStart(2, '0')}
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-[3px] bg-white/10">
        <div
          className="h-full"
          style={{ width: `${progress}%`, backgroundColor: slide.accent, transition: 'width 30ms linear' }}
        />
      </div>

      {/* Pause/Resume */}
      <div className="absolute top-8 right-8 z-20">
        <button
          onClick={() => setIsPaused(p => !p)}
          className="text-white/50 hover:text-white/90 text-xs backdrop-blur-sm bg-white/10 border border-white/20 px-3 py-1.5 rounded-full transition-all duration-200"
        >
          {isPaused ? '▶ Resume' : '⏸ Pause'}
        </button>
      </div>
    </section>
  );
}
