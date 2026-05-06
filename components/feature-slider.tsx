'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ShoppingBag, Users, MessageSquare, Award, Truck, BarChart3, Lock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HERO_SLIDES = [
  {
    id: 1,
    title: 'Browse Thousands of Products',
    subtitle: 'Discover amazing products and services from verified sellers worldwide',
    icon: ShoppingBag,
    href: '/marketplace',
    bgImage: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(30, 58, 138, 0.9) 100%)',
    accentColor: 'from-blue-500 to-blue-700',
  },
  {
    id: 2,
    title: 'Connect & Network',
    subtitle: 'Follow creators and build relationships with sellers and buyers',
    icon: Users,
    href: '/discover',
    bgImage: 'linear-gradient(135deg, rgba(88, 28, 135, 0.8) 0%, rgba(49, 46, 129, 0.9) 100%)',
    accentColor: 'from-purple-500 to-purple-700',
  },
  {
    id: 3,
    title: 'Direct Messaging',
    subtitle: 'Chat instantly with users, negotiate deals, and close transactions',
    icon: MessageSquare,
    href: '/messages',
    bgImage: 'linear-gradient(135deg, rgba(190, 24, 93, 0.8) 0%, rgba(136, 14, 79, 0.9) 100%)',
    accentColor: 'from-pink-500 to-pink-700',
  },
  {
    id: 4,
    title: 'Earn Rewards Daily',
    subtitle: 'Complete tasks and earn Pi Network tokens with every transaction',
    icon: Award,
    href: '/earn',
    bgImage: 'linear-gradient(135deg, rgba(217, 119, 6, 0.8) 0%, rgba(180, 83, 9, 0.9) 100%)',
    accentColor: 'from-amber-500 to-amber-700',
  },
  {
    id: 5,
    title: 'Seamless Shipping',
    subtitle: 'Multiple delivery options with real-time tracking and full insurance',
    icon: Truck,
    href: '/ship-with-pi',
    bgImage: 'linear-gradient(135deg, rgba(34, 197, 94, 0.8) 0%, rgba(21, 128, 61, 0.9) 100%)',
    accentColor: 'from-green-500 to-green-700',
  },
  {
    id: 6,
    title: 'Account Verification',
    subtitle: 'Get verified and build trust with a premium verification badge',
    icon: Award,
    href: '/marketplace',
    bgImage: 'linear-gradient(135deg, rgba(6, 182, 212, 0.8) 0%, rgba(15, 118, 110, 0.9) 100%)',
    accentColor: 'from-cyan-500 to-cyan-700',
  },
  {
    id: 7,
    title: 'Powerful Admin Dashboard',
    subtitle: 'Manage payments, tasks, users, and platform operations with ease',
    icon: BarChart3,
    href: '/dashboard',
    bgImage: 'linear-gradient(135deg, rgba(71, 85, 105, 0.8) 0%, rgba(30, 41, 59, 0.9) 100%)',
    accentColor: 'from-slate-500 to-slate-700',
  },
  {
    id: 8,
    title: 'Secure Payments',
    subtitle: 'Manual verification with transaction tracking and receipt uploads',
    icon: Lock,
    href: '/marketplace',
    bgImage: 'linear-gradient(135deg, rgba(220, 38, 38, 0.8) 0%, rgba(153, 27, 27, 0.9) 100%)',
    accentColor: 'from-red-500 to-red-700',
  },
];

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  icon: any;
  href: string;
  bgImage: string;
  accentColor: string;
}

export function FeatureSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [nextSlide, setNextSlide] = useState(1);

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
      setNextSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setNextSlide((index + 1) % HERO_SLIDES.length);
    setIsAutoPlay(false);
  };

  const goToPrevious = () => {
    const newIndex = (currentSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;
    setCurrentSlide(newIndex);
    setNextSlide((newIndex + 1) % HERO_SLIDES.length);
    setIsAutoPlay(false);
  };

  const goToNext = () => {
    const newIndex = (currentSlide + 1) % HERO_SLIDES.length;
    setCurrentSlide(newIndex);
    setNextSlide((newIndex + 1) % HERO_SLIDES.length);
    setIsAutoPlay(false);
  };

  const slide = HERO_SLIDES[currentSlide];
  const Icon = slide.icon;

  return (
    <section className="relative w-full overflow-hidden bg-background">
      {/* Main Hero Slider */}
      <div className="relative h-screen md:h-[600px] w-full overflow-hidden">
        {/* Slides */}
        {HERO_SLIDES.map((feature, index) => (
          <div
            key={feature.id}
            className={`absolute inset-0 transition-all duration-1200 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            {/* Background with gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: feature.bgImage,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />

            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

            {/* Animated pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-start">
              <div className="container mx-auto px-4 md:px-8">
                <div className="max-w-2xl">
                  {/* Icon Badge */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.accentColor} shadow-2xl mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Title */}
                  <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 text-balance leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                    {feature.title}
                  </h2>

                  {/* Subtitle */}
                  <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl text-pretty leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    {feature.subtitle}
                  </p>

                  {/* CTA Button */}
                  <Link href={feature.href}>
                    <Button
                      size="lg"
                      className={`bg-gradient-to-r ${feature.accentColor} text-white hover:shadow-2xl transition-all duration-300 font-semibold px-8 py-6 text-base animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300`}
                    >
                      Explore Now
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-3 md:p-4 rounded-full transition-all duration-300 hover:scale-110 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 md:h-7 md:w-7 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-6 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-3 md:p-4 rounded-full transition-all duration-300 hover:scale-110 group"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 md:h-7 md:w-7 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Slide Indicators with slide numbers */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-6">
        {/* Slide Counter */}
        <div className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold">
          {String(currentSlide + 1).padStart(2, '0')} / {String(HERO_SLIDES.length).padStart(2, '0')}
        </div>

        {/* Dot Indicators */}
        <div className="flex gap-3 flex-wrap justify-center px-4">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-500 rounded-full ${
                index === currentSlide
                  ? 'w-8 h-2 bg-white shadow-lg'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Auto-play Toggle - Bottom Right */}
      <button
        onClick={() => setIsAutoPlay(!isAutoPlay)}
        className="absolute bottom-8 right-8 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
      >
        {isAutoPlay ? '⏸ Pause' : '▶ Play'}
      </button>

      {/* Info Badge - Top Left */}
      <div className="absolute top-8 left-8 z-20 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium">
        {slide.title}
      </div>
    </section>
  );
}
