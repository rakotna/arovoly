import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { ViewType } from '../../types';
import { BrandLogo } from '../common/BrandLogo';
import {
  Satellite,
  Radio,
  Layers,
  TrendingUp,
  MapPin,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Shield,
  Sparkles,
  Droplets,
  Cpu,
  BookOpen,
  Info,
  Globe,
  ExternalLink,
  ChevronUp,
  Menu,
  X,
  Mail,
  Send,
  Check,
  Activity,
  Award,
  Users,
  Sprout,
  Compass,
  ArrowUpRight,
  LogOut,
  Sliders,
  Tractor,
} from 'lucide-react';

interface LandingViewProps {
  onGoToSignIn: () => void;
  onGoToDashboard?: () => void;
  onQuickDemo?: () => void;
  isAuthenticated: boolean;
  userName?: string;
  userRole?: string;
  onSignOut?: () => void;
  onNavigate?: (view: ViewType) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onGoToSignIn,
  onGoToDashboard,
  onQuickDemo,
  isAuthenticated,
  userName,
  userRole,
  onSignOut,
  onNavigate,
}) => {
  const { language, toggleLanguage } = useTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeSimTab, setActiveSimTab] = useState<'ndvi' | 'vra' | 'soil' | 'yield'>('ndvi');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const headerRef = useRef<HTMLElement | null>(null);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    organization: '',
    region: 'Alaotra-Mangoro',
    message: '',
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Keep the sticky navigation aligned with the section currently in view.
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.landing-section'));
    const revealElements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('landing-reveal-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px' }
    );

    revealElements.forEach((element) => revealObserver.observe(element));

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const headerHeight = headerRef.current?.offsetHeight ?? 72;
      setShowScrollTop(scrollY > 400);
      setIsHeaderScrolled(scrollY > 24);

      const visibleSection = sections.reduce((current, section) => {
        return section.getBoundingClientRect().top <= headerHeight + 32 ? section.id || 'hero' : current;
      }, 'hero');
      setActiveSection(visibleSection);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      revealObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactForm({
        name: '',
        email: '',
        organization: '',
        region: 'Alaotra-Mangoro',
        message: '',
      });
    }, 4000);
  };

  const faqs = [
    {
      q: language === 'fr'
        ? "Qu'est-ce qu'AROVOLY et quelle est son origine ?"
        : "What is AROVOLY and what is its origin?",
      a: language === 'fr'
        ? "« Aro » signifie « Protection » et « Voly » signifie « Culture » ou « Plantation » en langue malgache. AROVOLY est une plateforme intégrée d'agriculture de précision combinant l'imagerie satellite multispectrale (Sentinel-2, Esri), les sondes racinaires connectées en LoRaWAN et l'intelligence agronomique pour optimiser les rendements et préserver les sols à Madagascar."
        : "« Aro » means « Protection » and « Voly » means « Crop » or « Crop Plantation » in Malagasy. AROVOLY is an integrated precision agriculture platform combining multispectral satellite imagery (Sentinel-2, Esri), LoRaWAN connected root sensors, and agronomic AI to optimize yields and preserve soils in Madagascar."
    },
    {
      q: language === 'fr'
        ? "Comment fonctionne le mode Démo Immédiat en 1-clic ?"
        : "How does the 1-click Instant Demo access work?",
      a: language === 'fr'
        ? "Le mode Démo permet d'accéder instantanément à l'ensemble du terminal agricole avec le profil du Dr. Éléonore Vance (Directrice Agronome). Vous pouvez explorer les cartes satellites du Lac Alaotra, inspecter les capteurs de sol IoT en temps réel, moduler les doses d'engrais VRA et exporter les rapports au format Shapefile sans avoir besoin de créer un compte préalable."
        : "The Instant Demo allows anyone to explore the operational terminal as Dr. Éléonore Vance (Regional Lead Agronomist). You can explore Lake Alaotra satellite maps, inspect live IoT soil probes, calculate VRA fertilizer modulations, and export Shapefiles without registering first."
    },
    {
      q: language === 'fr'
        ? "D'où proviennent les données satellitaires et les indices NDVI ?"
        : "Where do satellite imagery and NDVI indices come from?",
      a: language === 'fr'
        ? "La plateforme exploite les flux spatiaux de la constellation Sentinel-2 de l'Agence Spatiale Européenne (ESA / Copernicus) qui survole Madagascar tous les 5 jours avec une résolution de 10 mètres par pixel, complétés par le fond mondial Esri World Imagery (Maxar/Earthstar). Les indices de végétation (NDVI, NDWI) sont calculés automatiquement à chaque nouvelle passe orbitale sans nuages."
        : "The platform ingests European Space Agency (ESA / Copernicus) Sentinel-2 multispectral passes visiting Madagascar every 5 days at 10-meter spatial resolution, combined with Esri World Imagery (Maxar/Earthstar). Vegetation indices (NDVI, NDWI) are processed automatically after each cloudless pass."
    },
    {
      q: language === 'fr'
        ? "Comment fonctionnent les sondes IoT en milieu rural malgache sans connexion 4G ?"
        : "How do soil IoT probes operate in rural Madagascar without 4G?",
      a: language === 'fr'
        ? "Chaque station de sol AROVOLY est 100% autonome en énergie grâce à un mini-panneau solaire et une batterie lithium. Elles transmettent leurs télémesures par radio longue portée LoRaWAN (868 MHz) jusqu'à une passerelle locale située à 15 km de distance. Aucune carte SIM 4G n'est nécessaire au pied des parcelles."
        : "Each AROVOLY field probe station is 100% solar self-powered. Probes transmit sensor telemetry over long-range LoRaWAN radio (868 MHz) up to a 15 km radius gateway. No cellular 4G coverage is needed at field level."
    },
    {
      q: language === 'fr'
        ? "Comment la modulation de dose variable (VRA) fait-elle économiser de l'argent ?"
        : "How does Variable Rate Application (VRA) save operational money?",
      a: language === 'fr'
        ? "Au lieu d'épandre une dose uniforme d'engrais (souvent excessive sur les zones riches et insuffisante sur les zones carencées), le moteur VRA segmente la parcelle en micro-zones. Les zones à forte vigueur reçoivent la juste dose d'entretien tandis que les zones carencées reçoivent le complément ciblé. Cela permet une réduction moyenne de 20% des intrants chimiques (Urée 46%, NPK) tout en évitant la verse du riz."
        : "Rather than applying blanket fertilizer (wasteful on fertile spots and inadequate on depleted patches), VRA delineates precise micro-zones. Vigorous zones receive lower maintenance doses while deficient zones receive targeted nutrition, saving an average of 20% on fertilizer costs while preventing crop lodging."
    },
    {
      q: language === 'fr'
        ? "Puis-je exporter les cartes de prescription pour mes machines et consoles ?"
        : "Can I export prescription maps for machinery and consoles?",
      a: language === 'fr'
        ? "Absolument. Le module d'exportation génère des fichiers Shapefile (.SHP/.DBF/.SHX) compatibles avec les consoles John Deere GreenStar, Trimble et Topcon, ainsi que des fichiers Google Earth (.KML) pour smartphones et des GeoJSON pour QGIS ou ArcGIS."
        : "Yes. The export suite generates industry-standard Shapefiles (.SHP/.DBF/.SHX) compatible with John Deere GreenStar, Trimble, Topcon, as well as Google Earth (.KML) and GeoJSON for GIS applications."
    },
    {
      q: language === 'fr'
        ? "Quelles sont les grandes régions agricoles actuellement intégrées ?"
        : "Which key agricultural regions are currently modeled?",
      a: language === 'fr'
        ? "Trois terroirs emblématiques sont intégrés : le Bassin du Lac Alaotra (Ambatondrazaka - riziculture SRI Makalioka 34), les Hauts Plateaux du Vakinankaratra (Betafo/Antsirabe - maïs hybride IRAT 200 et cultures de tanety) et les terres volcaniques du Lac Itasy (Ampefy - manioc Ampasimbe). Des extensions sont en préparation pour le Menabe et la côte Est."
        : "Three landmark regions are pre-seeded: Lake Alaotra Basin (Ambatondrazaka - luxury Makalioka 34 SRI rice), Vakinankaratra Highlands (Betafo/Antsirabe - hybrid maize IRAT 200 on tanety ridges), and Lake Itasy Volcanic Lands (Ampefy - Ampasimbe cassava)."
    },
    {
      q: language === 'fr'
        ? "Mes données parcellaires sont-elles confidentielles et protégées ?"
        : "Is my farm and parcel data secure and confidential?",
      a: language === 'fr'
        ? "Oui. Toutes les données géométriques, agronomiques et financières sont protégées par un chiffrement de niveau bancaire (SSL 256-bit). Aucune donnée d'exploitation n'est partagée ou revendue à des tiers. Les propriétaires conservent 100% de la propriété intellectuelle de leurs parcelles."
        : "Yes. All spatial, agronomic, and yield revenue data are protected with 256-bit SSL encryption. Farm data is never shared or resold. Agricultural producers maintain 100% intellectual property ownership."
    }
  ];

  const renderMetricCard = (className: string) => (
    <div className={`${className} rounded-2xl bg-[#76c043] p-4 shadow-2xl shadow-black/40 border border-white/20 text-[#0a2000] backdrop-blur-sm`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">4.9</span>
            <span className="text-lg font-bold">★</span>
          </div>
          <p className="text-[11px] sm:text-xs font-semibold text-[#183a00] mt-0.5">
            {language === 'fr' ? '1200+ Agronomes & Exploitations Actifs' : '1200+ Agronomists & Farms Active'}
          </p>
        </div>
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#183a00] text-white flex items-center justify-center">
          <span className="material-symbols-outlined text-sm sm:text-base">add</span>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-[#183a00]/15 flex items-center gap-2">
        <div className="flex -space-x-1.5">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#183a00] text-[9px] font-bold text-white border-2 border-[#76c043]">AK</span>
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#204b00] text-[9px] font-bold text-white border-2 border-[#76c043]">RN</span>
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#316b00] text-[9px] font-bold text-white border-2 border-[#76c043]">MD</span>
        </div>
        <span className="text-[10px] sm:text-[11px] leading-tight font-medium text-[#183a00]">
          {language === 'fr'
            ? 'Déployé dans 22 Régions (Alaotra, Vakinankaratra, Boeny)'
            : 'Live in 22 Regions (Alaotra, Vakinankaratra, Boeny)'}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] sm:text-[11px] font-bold pt-2 border-t border-[#183a00]/15">
        <span className="px-2 py-0.5 rounded bg-[#183a00]/10 tracking-wide uppercase">SENTINEL-2 ESA ORBIT</span>
        <span className="text-[#0a2000] font-mono">98.4% Telemetry Acc.</span>
      </div>
    </div>
  );

  return (
    <div className="landing-page min-h-screen bg-[#fcf9f3] text-[#1c1c18] font-sans antialiased selection:bg-[#76c043]/30 selection:text-[#0a2000] p-0 m-0 overflow-x-clip relative">
      
      {/* Top Session Active Notification (if authenticated) */}
      {isAuthenticated && (
        <aside aria-label="Notification de session active" className="bg-[#0b1d15] text-[#a9f773] border-b border-[#205234] px-3 sm:px-4 py-2 text-xs flex items-center justify-between sticky top-0 z-[60]">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-7xl mx-auto w-full justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-[#8eda5a] animate-pulse"></span>
              <span className="font-semibold text-white shrink-0">
                {language === 'fr' ? 'Session active :' : 'Active session:'}
              </span>
              <span className="truncate">{userName || 'Utilisateur AROVOLY'}</span>
              {userRole && <span className="hidden sm:inline text-[#7fe88b]">({userRole})</span>}
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              {onGoToDashboard && (
                <button
                  onClick={onGoToDashboard}
                  className="px-3.5 py-1 rounded-full bg-[#20bb55] hover:bg-[#1caa4d] text-[#052511] font-bold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>{language === 'fr' ? 'Aller au Tableau de Bord' : 'Open Dashboard'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              {onSignOut && (
                <button
                  onClick={onSignOut}
                  className="p-1 rounded-lg text-slate-300 hover:text-red-400 hover:bg-white/5 transition-colors"
                  title={language === 'fr' ? 'Déconnexion' : 'Sign out'}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </aside>
      )}

      {/* ==================== TOP NAVIGATION BAR ==================== */}
      <header
        ref={headerRef}
        className={`sticky self-start ${isAuthenticated ? 'top-16 sm:top-10' : 'top-0'} left-0 w-full z-50 px-3 sm:px-6 lg:px-10 py-2.5 sm:py-4 transition-all duration-300 ${
          isHeaderScrolled ? 'bg-[#fcf9f3]/95 shadow-lg shadow-black/10 backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <BrandLogo tone={isHeaderScrolled ? 'dark' : 'light'} onClick={scrollToTop} />

          {/* Pill Nav (Desktop) */}
          <nav className="hidden lg:flex items-center bg-white/90 backdrop-blur-md px-3.5 py-1.5 xl:px-5 xl:py-2 rounded-full shadow-lg shadow-black/5 border border-white/60 gap-2.5 xl:gap-5 text-[11px] xl:text-xs font-semibold text-[#1c1c18]">
            <a className={`${activeSection === 'overview' ? 'text-[#316b00]' : 'text-[#414939] hover:text-[#1c1c18]'} transition-colors`} href="#overview">
              {language === 'fr' ? 'Présentation' : 'Overview'}
            </a>
            <a className={`${activeSection === 'how-it-works' ? 'text-[#316b00]' : 'text-[#414939] hover:text-[#1c1c18]'} transition-colors`} href="#how-it-works">
              {language === 'fr' ? 'Fonctionnement' : 'How It Works'}
            </a>
            <a className={`${activeSection === 'simulator' ? 'text-[#316b00]' : 'text-[#414939] hover:text-[#1c1c18]'} flex items-center gap-1 transition-colors`} href="#simulator">
              <span className="material-symbols-outlined text-xs text-[#316b00]">auto_awesome</span>
              <span>{language === 'fr' ? 'Simulateur' : 'Simulator'}</span>
            </a>
            <a className={`${activeSection === 'features' ? 'text-[#316b00]' : 'text-[#414939] hover:text-[#1c1c18]'} transition-colors`} href="#features">
              {language === 'fr' ? 'Fonctionnalités' : 'Features'}
            </a>
            <a className={`${activeSection === 'apropos' ? 'text-[#316b00]' : 'text-[#414939] hover:text-[#1c1c18]'} transition-colors`} href="#apropos">
              {language === 'fr' ? 'À Propos' : 'About'}
            </a>
            <a className={`${activeSection === 'regions' ? 'text-[#316b00]' : 'text-[#414939] hover:text-[#1c1c18]'} transition-colors`} href="#regions">
              {language === 'fr' ? 'Terroirs' : 'Regions'}
            </a>
            <a className={`${activeSection === 'faq' ? 'text-[#316b00]' : 'text-[#414939] hover:text-[#1c1c18]'} transition-colors`} href="#faq">
              {language === 'fr' ? 'Aide & FAQ' : 'Help & FAQ'}
            </a>
            <a className={`${activeSection === 'contact' ? 'text-[#316b00]' : 'text-[#414939] hover:text-[#1c1c18]'} transition-colors`} href="#contact">
              {language === 'fr' ? 'Contact' : 'Contact'}
            </a>
          </nav>

          {/* Action items */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Language Selector */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-full bg-white/80 hover:bg-white backdrop-blur-md text-[#1c1c18] text-xs font-medium border border-white/40 shadow-sm transition-all"
              title={language === 'fr' ? 'Changer de langue' : 'Switch language'}
            >
              <span className="material-symbols-outlined text-sm">language</span>
              <span>{language.toUpperCase()}</span>
            </button>

            {/* 1-Click Demo */}
            {onQuickDemo && !isAuthenticated && (
              <button
                onClick={onQuickDemo}
                className="hidden sm:inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-[#245100] text-xs font-bold shadow-md shadow-black/5 border border-white/70 transition-all hover:scale-[1.02]"
                title={language === 'fr' ? 'Accès démo immédiat' : 'Instant 1-Click Demo'}
              >
                <span className="material-symbols-outlined text-sm text-[#316b00]">spark</span>
                <span>{language === 'fr' ? 'Démo 1-Clic' : '1-Click Demo'}</span>
              </button>
            )}

            {/* Sign In / Dashboard */}
            {isAuthenticated && onGoToDashboard ? (
              <button
                onClick={onGoToDashboard}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#1b4332] hover:bg-[#143225] text-white text-xs font-semibold shadow-lg shadow-black/20 hover:scale-[1.02] transition-all"
              >
                <span>{language === 'fr' ? 'Tableau de Bord' : 'Open Dashboard'}</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            ) : (
              <button
                onClick={onGoToSignIn}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#1b4332] hover:bg-[#143225] text-white text-xs font-semibold shadow-lg shadow-black/20 hover:scale-[1.02] transition-all"
              >
                <span>{language === 'fr' ? 'Se Connecter' : 'Sign In'}</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="inline-flex lg:hidden items-center justify-center w-10 h-10 rounded-full bg-[#1b4332] text-white shadow-lg shadow-black/20"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-landing-navigation"
              aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          <nav
            id="mobile-landing-navigation"
            aria-hidden={!isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`lg:hidden fixed inset-0 z-[70] h-[100dvh] bg-black/35 transition-opacity duration-300 ${
              isMobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            <div
              onClick={(event) => event.stopPropagation()}
              className={`ml-auto flex h-full w-[min(88vw,24rem)] flex-col bg-[#fcf9f3] text-[#1c1c18] shadow-2xl transition-transform duration-300 ease-out ${
                isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
            >
              <div className="relative flex h-20 shrink-0 items-center justify-center border-b border-[#e5e2dc] bg-white/90 px-4">
                <BrandLogo
                  tone="dark"
                  compact
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    scrollToTop();
                  }}
                />
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#1b4332] text-white shadow-lg"
                  aria-label={language === 'fr' ? 'Fermer le menu' : 'Close menu'}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex shrink-0 justify-center border-b border-[#e5e2dc] px-5 py-5">
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 rounded-full border border-[#e5e2dc] bg-white px-4 py-2.5 text-xs font-bold text-[#1c1c18] shadow-sm"
                  title={language === 'fr' ? 'Changer de langue' : 'Switch language'}
                >
                  <span className="material-symbols-outlined text-sm text-[#316b00]">language</span>
                  <span>{language === 'fr' ? 'Français' : 'English'} ({language.toUpperCase()})</span>
                </button>
              </div>

              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-5">
                <span className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#717a68]">
                  {language === 'fr' ? 'Explorer AROVOLY' : 'Explore AROVOLY'}
                </span>
                <div className="flex flex-col gap-1">
                  {[
                    ['overview', language === 'fr' ? 'Présentation' : 'Overview'],
                    ['how-it-works', language === 'fr' ? 'Fonctionnement' : 'How It Works'],
                    ['simulator', language === 'fr' ? 'Simulateur' : 'Simulator'],
                    ['features', language === 'fr' ? 'Fonctionnalités' : 'Features'],
                    ['apropos', language === 'fr' ? 'À Propos' : 'About'],
                    ['regions', language === 'fr' ? 'Terroirs' : 'Regions'],
                    ['faq', language === 'fr' ? 'Aide & FAQ' : 'Help & FAQ'],
                    ['contact', 'Contact'],
                  ].map(([id, label]) => (
                    <a
                      key={id}
                      href={`#${id}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex min-h-12 items-center rounded-xl px-3 text-sm font-semibold transition-colors ${
                        activeSection === id
                          ? 'bg-[#c3ecd2] text-[#316b00]'
                          : 'text-[#414939] hover:bg-[#f0eee8] hover:text-[#316b00]'
                      }`}
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="shrink-0 border-t border-[#e5e2dc] bg-white/70 p-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (isAuthenticated && onGoToDashboard) onGoToDashboard();
                    else onGoToSignIn();
                  }}
                  className="flex min-h-12 w-full items-center justify-center rounded-xl bg-[#1b4332] px-3 text-sm font-semibold text-white shadow-lg"
                >
                  {isAuthenticated
                    ? (language === 'fr' ? 'Tableau de Bord' : 'Open Dashboard')
                    : (language === 'fr' ? 'Se Connecter' : 'Sign In')}
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* ==================== HERO SECTION (FULL SCREEN, EDGE-TO-EDGE) ==================== */}
      <section id="hero" className="landing-section relative min-h-[85vh] lg:min-h-[92vh] w-full flex flex-col justify-between pt-24 sm:pt-28 pb-8 sm:pb-12 px-4 sm:px-8 lg:px-12 overflow-hidden">
        {/* Background Image with Ambient Gradient & Darkening Overlay for Sharp Legibility */}
        <div className="absolute inset-0 z-0">
          <img
            alt="Breathtaking high angle drone view of lush green terraced rice paddy fields in Madagascar"
            className="landing-hero-image w-full h-full object-cover object-center scale-[1.02] filter contrast-[1.05]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZQw3FJG9f2xd3_PvHYPePQoDL2ey7yTqIa3HIX7I9z4Clje1bSuSU4sjAWCRQo4RXPsHJy4pIG05DWQY09ef38jFEwqAmCxVjHnhRjKXkR3NM8uu0DGaVJWwPJmo6rzZKkTmKlzeVAFhjIAjfBQ85-oGUJzOT5j7QCkScud8Cphqt9xQf7kTpszfZL1RIxjpZU_-cBuQIRZ1vmt5LRMkEKpeWbCSAEgWgw4Yz6qE"
          />
          {/* Deep cinematic dark gradient layers for crystal contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#031309]/95 via-[#062013]/85 to-[#051c10]/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#021008] via-transparent to-[#04160b]/70"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Main Hero Center / Upper Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full my-auto py-4 sm:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left: Headline & Telemetry intro */}
            <div className="lg:col-span-8 flex flex-col items-start space-y-4 sm:space-y-5">
              {/* Tag Pill */}
              <div className="landing-hero-tag inline-flex w-full sm:w-auto items-center justify-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#a9f773] text-[11px] sm:text-xs font-medium tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8eda5a] animate-pulse"></span>
                <span>
                  {language === 'fr'
                    ? 'Plateforme Intégrée d’Agriculture de Précision & Télédétection Spatiale'
                    : 'Integrated Precision Agriculture & Spatial Remote Sensing Platform'}
                </span>
              </div>
              <a
                href="#overview"
                className="-mt-2 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70 transition-colors hover:text-[#a9f773]"
              >
                <span>{language === 'fr' ? 'Faire défiler pour découvrir' : 'Scroll to explore'}</span>
                <ChevronDown className="h-3.5 w-3.5 animate-bounce text-[#8eda5a]" />
              </a>

              {renderMetricCard('lg:hidden w-full')}

              {/* Main Title */}
              <h1 className="landing-hero-title text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] xl:text-5xl font-extrabold text-white tracking-tight leading-[1.14]">
                {language === 'fr' ? (
                  <>
                    L’intelligence spatiale et l’IoT au service des{' '}
                    <span className="text-[#7fe88b] bg-clip-text text-transparent bg-gradient-to-r from-[#8eda5a] to-[#4eed8a]">
                      terroirs agricoles de Madagascar
                    </span>
                  </>
                ) : (
                  <>
                    Spatial AI &amp; IoT telemetry safeguarding{' '}
                    <span className="text-[#7fe88b] bg-clip-text text-transparent bg-gradient-to-r from-[#8eda5a] to-[#4eed8a]">
                      Madagascar's agricultural food baskets
                    </span>
                  </>
                )}
              </h1>

              {/* Body Description */}
              <p className="landing-hero-copy text-white/85 text-xs sm:text-sm md:text-base max-w-2xl font-normal leading-relaxed">
                {language === 'fr'
                  ? "AROVOLY (« Protection des cultures » en malgache) réunit la cartographie satellite Sentinel-2 (ESA), les indices multispectraux NDVI, les sondes racinaires IoT LoRaWAN et la modulation d'engrais VRA pour donner aux exploitants et agronomes les moyens de sécuriser leurs rendements."
                  : "AROVOLY (« Crop Protection » in Malagasy) unifies Sentinel-2 (ESA) orbital telemetry, NDVI vegetative indices, LoRaWAN root-zone IoT capacitive probes, and VRA precision fertilizer modulation to empower farmers and agronomists across Madagascar."}
              </p>

              {/* CTAs */}
              <div className="landing-hero-actions grid w-full max-w-xl grid-cols-2 items-stretch gap-2.5 pt-1 lg:flex lg:flex-wrap lg:items-center lg:gap-3">
                {isAuthenticated && onGoToDashboard ? (
                  <button
                    onClick={onGoToDashboard}
                    className="col-span-1 inline-flex w-full justify-center items-center gap-2 px-3 py-2.5 lg:w-auto lg:px-6 lg:py-3 rounded-full bg-[#20bb55] hover:bg-[#1caa4d] text-[#052511] font-bold text-xs sm:text-sm shadow-xl shadow-[#20bb55]/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <span>{language === 'fr' ? 'Accéder au Tableau de Bord' : 'Open Dashboard'}</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>
                ) : (
                  <button
                    onClick={onGoToSignIn}
                    className="col-span-1 inline-flex w-full justify-center items-center gap-2 px-3 py-2.5 lg:w-auto lg:px-6 lg:py-3 rounded-full bg-[#20bb55] hover:bg-[#1caa4d] text-[#052511] font-bold text-xs sm:text-sm shadow-xl shadow-[#20bb55]/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <span>{language === 'fr' ? 'Se Connecter au Terminal' : 'Sign In to Terminal'}</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>
                )}

                {onQuickDemo && !isAuthenticated && (
                  <button
                    onClick={onQuickDemo}
                    className="col-span-1 inline-flex w-full justify-center items-center gap-1.5 px-3 py-2.5 lg:w-auto lg:px-5 lg:py-3 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white font-semibold text-xs sm:text-sm transition-all hover:scale-[1.02]"
                  >
                    <span className="material-symbols-outlined text-sm text-[#8eda5a]">auto_awesome</span>
                    <span>{language === 'fr' ? 'Essai Démo Immédiat' : 'Instant 1-Click Demo'}</span>
                  </button>
                )}

                <a
                  className="col-span-2 inline-flex w-full justify-center items-center gap-1.5 px-4 py-2.5 lg:w-auto lg:col-span-1 lg:px-5 lg:py-3 rounded-full bg-black/30 hover:bg-black/40 backdrop-blur-md border border-white/15 text-white/90 font-medium text-xs sm:text-sm transition-all"
                  href="#overview"
                >
                  <span className="material-symbols-outlined text-sm">menu_book</span>
                  <span>{language === 'fr' ? 'Découvrir la Plateforme' : 'Explore Platform'}</span>
                </a>
              </div>
            </div>

            <div className="hidden lg:flex lg:col-span-4 w-full justify-end">
              {renderMetricCard('w-full max-w-sm')}
            </div>

          </div>
        </div>

        {/* Bottom: Floating Telemetry Cards (Sentinel-2 & Capacitive Soil Matrix) */}
        <div className="relative z-10 max-w-7xl mx-auto w-full pt-4 sm:pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4.5">
            {/* Card 1: Sentinel-2 Multispectral */}
            <div className="landing-telemetry-card bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-3.5 sm:p-4 shadow-xl border border-white/60 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 transition-transform hover:-translate-y-1 duration-300">
              {/* Mini Viz Box */}
              <div className="w-full sm:w-36 md:w-40 bg-[#0a2012] rounded-xl p-2.5 sm:p-3 text-white flex flex-col justify-between shrink-0">
                <div className="flex justify-between items-center text-[9px] font-mono text-[#a8d0b7]">
                  <span>NDVI-INDEX</span>
                  <span className="flex items-center gap-1 text-[#8eda5a]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8eda5a] animate-ping"></span>
                    ORBIT 10m
                  </span>
                </div>
                <div className="my-2 flex justify-center items-center py-1.5 bg-[#12311f] rounded-lg border border-[#205234]">
                  <span className="material-symbols-outlined text-2xl text-[#7fe88b]">satellite_alt</span>
                </div>
                <div className="flex justify-between items-end text-[10px]">
                  <div>
                    <span className="text-white/60 text-[8px] block">Zone</span>
                    <span className="font-semibold text-xs">Alaotra Rice</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white/60 text-[8px] block">Health</span>
                    <span className="font-mono font-bold text-[#8eda5a] text-xs">0.78</span>
                  </div>
                </div>
              </div>

              {/* Card Info */}
              <div className="flex-1 flex flex-col justify-between w-full h-full py-0.5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#c3ecd2] text-[#002113]">ESA ORBIT</span>
                    <span className="text-[10px] text-[#416652] font-semibold">{language === 'fr' ? 'Autonome' : 'Autonomous'}</span>
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-[#1c1c18]">Sentinel-2 &amp; Drone Multispectral</h3>
                  <p className="text-[11px] text-[#414939] mt-0.5 line-clamp-2">
                    {language === 'fr'
                      ? 'Détection orbitale continue du stress azoté, de l’humidité du feuillage et des anomalies sanitaires.'
                      : 'Continuous orbital imagery detection for nitrogen stress, canopy moisture & crop diseases.'}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between">
                  <a className="text-[11px] font-semibold text-[#1c1c18] hover:text-[#316b00] inline-flex items-center gap-1" href="#simulator">
                    <span>{language === 'fr' ? 'Voir les détails' : 'View Details'}</span>
                    <span className="material-symbols-outlined text-sm text-[#416652]">north_east</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Card 2: Capacitive Soil Probe Matrix */}
            <div className="landing-telemetry-card bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-3.5 sm:p-4 shadow-xl border border-white/60 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 transition-transform hover:-translate-y-1 duration-300">
              {/* Card Info */}
              <div className="flex-1 flex flex-col justify-between w-full h-full order-2 sm:order-1 py-0.5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#c3ecd2] text-[#002113]">LoRaWAN RF</span>
                    <span className="flex items-center gap-1 text-[10px] text-[#316b00] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#316b00]"></span>
                      {language === 'fr' ? 'Liaison active' : 'Active link'}
                    </span>
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-[#1c1c18]">{language === 'fr' ? 'Matrice de Sondes Sol Capacitives' : 'Capacitive Soil Probe Matrix'}</h3>
                  <p className="text-[11px] text-[#414939] mt-0.5 line-clamp-2">
                    {language === 'fr'
                      ? 'Humidité souterraine, température racinaire et conductivité minérale NPK calibrées pour les sols de Madagascar.'
                      : 'Subsurface moisture, root-temperature, and NPK mineral conductivity calibrated for Madagascar soil types.'}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-gray-100">
                  <a className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#143225] hover:bg-[#0b1d15] text-white text-[11px] font-semibold shadow-sm transition-all" href="#simulator">
                    <span>{language === 'fr' ? 'Explorer la Télémétrie' : 'Explore Telemetry'}</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </a>
                </div>
              </div>

              {/* Mini Viz Box */}
              <div className="w-full sm:w-36 md:w-40 bg-[#081e13] rounded-xl p-2.5 sm:p-3 text-white font-mono shrink-0 order-1 sm:order-2 border border-[#16432c]">
                <div className="flex justify-between items-center text-[9px] text-white/70 pb-1 border-b border-white/10">
                  <span>SENSOR #821</span>
                  <span className="text-[#8eda5a] text-[8px] font-sans font-bold bg-[#8eda5a]/20 px-1 py-0.5 rounded">VRA Ready</span>
                </div>
                <div className="space-y-1 pt-1.5 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-white/60">Moisture:</span>
                    <span className="text-[#8eda5a] font-bold">42.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Root Temp:</span>
                    <span>23.4°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Nitrogen N:</span>
                    <span className="text-[#7fe88b]">Optimal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PLATFORM VALUE PILLARS SECTION ==================== */}
      <section className="landing-section py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-12 bg-[#fcf9f3]" id="overview" data-reveal>
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c3ecd2] text-[#002113] text-xs font-bold mb-2.5">
                <span className="material-symbols-outlined text-xs">auto_awesome</span>
                <span>{language === 'fr' ? 'Architecture AgTech Nouvelle Génération' : 'Next-Gen AgTech Framework'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1c1c18] tracking-tight leading-tight">
                {language === 'fr'
                  ? 'Porte l’agriculture de précision et la télédétection spatiale vers de nouveaux sommets'
                  : 'Elevates precision farming & spatial remote sensing to new heights'}
              </h2>
            </div>
            <a
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#717a68]/40 hover:border-[#1c1c18] bg-white text-xs font-bold text-[#1c1c18] shadow-sm transition-all shrink-0 hover:bg-[#f6f3ed]"
              href="#features"
            >
              <span>{language === 'fr' ? 'Explorer toutes les fonctionnalités' : 'Explore All Capabilities'}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>

          {/* Feature 3-Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Pillar 1 */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-[#e5e2dc] flex flex-col justify-between hover:shadow-xl hover:border-[#76c043]/50 transition-all duration-300 group">
              <div>
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#f0eee8] group-hover:bg-[#c3ecd2] flex items-center justify-center text-[#316b00] transition-colors mb-4">
                  <span className="material-symbols-outlined text-xl sm:text-2xl">cloud_sync</span>
                </div>
                <h3 className="text-lg font-bold text-[#1c1c18] mb-2">
                  {language === 'fr' ? 'Télédétection Orbitale' : 'Orbital Remote Sensing'}
                </h3>
                <p className="text-xs sm:text-sm text-[#414939] leading-relaxed">
                  {language === 'fr'
                    ? 'Flux synoptiques de la constellation ESA Sentinel-2 traités par des modèles d’IA calibrés pour les rizières tropicales, les plantations de vanille et le manioc.'
                    : 'ESA Sentinel-2 constellation synoptic feeds processed via AI models calibrated for tropical rice paddies, vanilla orchards, and cassava crops.'}
                </p>
              </div>
              <div className="pt-5 mt-4 border-t border-[#f0eee8] flex items-center justify-between text-xs font-bold text-[#1c1c18]">
                <span className="text-[#316b00]">
                  {language === 'fr' ? 'Cadence de réobservation 5 jours' : '5-Day Revisit Cadence'}
                </span>
                <span className="material-symbols-outlined text-sm text-[#717a68] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-[#e5e2dc] flex flex-col justify-between hover:shadow-xl hover:border-[#76c043]/50 transition-all duration-300 group">
              <div>
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#f0eee8] group-hover:bg-[#c3ecd2] flex items-center justify-center text-[#316b00] transition-colors mb-4">
                  <span className="material-symbols-outlined text-xl sm:text-2xl">sensors</span>
                </div>
                <h3 className="text-lg font-bold text-[#1c1c18] mb-2">
                  {language === 'fr' ? 'IoT LoRaWAN 100% Solaire' : 'Solar LoRaWAN IoT'}
                </h3>
                <p className="text-xs sm:text-sm text-[#414939] leading-relaxed">
                  {language === 'fr'
                    ? 'Sondes autonomes à ultra-basse consommation déployées directement au cœur des parcelles sans couverture cellulaire, avec une portée jusqu’à 15 km.'
                    : 'Ultra-low power autonomous probes deployed directly in remote parcel fields without needing cellular coverage, bridging up to 15km range.'}
                </p>
              </div>
              <div className="pt-5 mt-4 border-t border-[#f0eee8] flex items-center justify-between text-xs font-bold text-[#1c1c18]">
                <span className="text-[#316b00]">
                  {language === 'fr' ? 'Résilience radio Sub-GHz' : 'Sub-GHz Resilience'}
                </span>
                <span className="material-symbols-outlined text-sm text-[#717a68] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-[#e5e2dc] flex flex-col justify-between hover:shadow-xl hover:border-[#76c043]/50 transition-all duration-300 group">
              <div>
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#f0eee8] group-hover:bg-[#c3ecd2] flex items-center justify-center text-[#316b00] transition-colors mb-4">
                  <span className="material-symbols-outlined text-xl sm:text-2xl">bolt</span>
                </div>
                <h3 className="text-lg font-bold text-[#1c1c18] mb-2">
                  {language === 'fr' ? 'Modulation VRA & Prédictions' : 'VRA & Yield Predictor'}
                </h3>
                <p className="text-xs sm:text-sm text-[#414939] leading-relaxed">
                  {language === 'fr'
                    ? 'Cartes de prescription à taux variable pour la fertilisation et l’irrigation, économisant jusqu’à 35% sur les intrants tout en augmentant la production.'
                    : 'Variable Rate Application prescription maps for fertilizer and irrigation, saving up to 35% on input costs while increasing crop yields.'}
                </p>
              </div>
              <div className="pt-5 mt-4 border-t border-[#f0eee8] flex items-center justify-between text-xs font-bold text-[#1c1c18]">
                <span className="text-[#316b00]">
                  {language === 'fr' ? '+38% Stabilité du Rendement' : '+38% Yield Stability'}
                </span>
                <span className="material-symbols-outlined text-sm text-[#717a68] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== INTERACTIVE SIMULATOR SHOWCASE ==================== */}
      <section id="simulator" className="landing-section px-4 sm:px-8 lg:px-12 py-10 sm:py-14 max-w-7xl mx-auto border-t border-[#e5e2dc]">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c3ecd2] text-[#002113] text-xs font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-sm text-[#316b00]">auto_awesome</span>
            <span>{language === 'fr' ? 'Démonstration Interactive' : 'Interactive Showcase'}</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1c1c18]">
            {language === 'fr'
              ? 'Testez les fonctionnalités clés de la console AROVOLY'
              : 'Preview core AROVOLY capabilities in real-time'}
          </h2>
          <p className="text-[#414939] text-xs sm:text-sm mt-1.5">
            {language === 'fr'
              ? 'Cliquez sur les onglets ci-dessous pour inspecter les données en direct comme sur le terrain.'
              : 'Select any module below to inspect live field data and simulation screens.'}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 sm:mb-8">
          <button
            onClick={() => setActiveSimTab('ndvi')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${
              activeSimTab === 'ndvi'
                ? 'bg-[#1b4332] text-white shadow-md'
                : 'bg-white hover:bg-[#f0eee8] text-[#1c1c18] border border-[#e5e2dc]'
            }`}
          >
            <Satellite className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#7fe88b]" />
            <span>{language === 'fr' ? '1. Carte Satellite & NDVI' : '1. Satellite & NDVI'}</span>
          </button>

          <button
            onClick={() => setActiveSimTab('vra')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${
              activeSimTab === 'vra'
                ? 'bg-[#1b4332] text-white shadow-md'
                : 'bg-white hover:bg-[#f0eee8] text-[#1c1c18] border border-[#e5e2dc]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#7fe88b]" />
            <span>{language === 'fr' ? '2. Prescription VRA' : '2. VRA Modulation'}</span>
          </button>

          <button
            onClick={() => setActiveSimTab('soil')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${
              activeSimTab === 'soil'
                ? 'bg-[#1b4332] text-white shadow-md'
                : 'bg-white hover:bg-[#f0eee8] text-[#1c1c18] border border-[#e5e2dc]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#7fe88b]" />
            <span>{language === 'fr' ? '3. Sondes Racine IoT' : '3. IoT Soil Probes'}</span>
          </button>

          <button
            onClick={() => setActiveSimTab('yield')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${
              activeSimTab === 'yield'
                ? 'bg-[#1b4332] text-white shadow-md'
                : 'bg-white hover:bg-[#f0eee8] text-[#1c1c18] border border-[#e5e2dc]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#7fe88b]" />
            <span>{language === 'fr' ? '4. Prévision Récolte & MGA' : '4. Yield & Ariary MGA'}</span>
          </button>
        </div>

        {/* Tab Content Display Card */}
        <div className="bg-[#051a0e] rounded-2xl border border-[#205234] p-4 sm:p-6 lg:p-7 shadow-2xl relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#316b00]/20 rounded-full blur-3xl pointer-events-none"></div>

          {activeSimTab === 'ndvi' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#1b4332] text-[#8eda5a] text-xs font-bold">
                    Secteur 04 • Lac Alaotra
                  </span>
                  <span className="text-xs text-white/70">Casier PC15 (Polder Est) • 7.50 ha</span>
                </div>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                  {language === 'fr'
                    ? 'Indice NDVI Multispectral (Sentinel-2 MSI L2A)'
                    : 'Multispectral NDVI Vegetation Index (Sentinel-2)'}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                  {language === 'fr'
                    ? "Calculé à partir des bandes rouge (B04) et proche infrarouge (B08) de Sentinel-2 à 10 m de résolution. La parcelle présente une excellente couverture foliaire avec un indice moyen de 0.78 (+0.04 en 10 jours), confirmant le tallage vigoureux du riz Makalioka."
                    : "Computed from Sentinel-2 Red (B04) and NIR (B08) spectral channels at 10m resolution. Parcel indicates optimal vegetative vigor with an average NDVI of 0.78 (+0.04 over 10 days), indicating healthy tillering."}
                </p>

                {/* NDVI Scale visual */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-[11px] text-white/70 font-semibold mb-1">
                    <span>Sol nu / Stress (0.1)</span>
                    <span className="text-[#8eda5a] font-bold">Optimal : 0.78</span>
                    <span>Végétation dense (1.0)</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-gradient-to-r from-red-500 via-yellow-400 via-emerald-400 to-[#316b00] relative">
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white ring-2 ring-[#051a0e] shadow-md"
                      style={{ left: '78%' }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-white/60 uppercase font-semibold">Santé Végétale</span>
                    <div className="text-base font-extrabold text-[#7fe88b] mt-0.5">96% Optimal</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-white/60 uppercase font-semibold">Nuages</span>
                    <div className="text-base font-extrabold text-white mt-0.5">&lt; 2% Dégagé</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-white/60 uppercase font-semibold">Dernier Passage</span>
                    <div className="text-base font-extrabold text-[#a8d0b7] mt-0.5">Il y a 18 min</div>
                  </div>
                </div>
              </div>

              {/* Graphic Mockup Card */}
              <div className="lg:col-span-5 p-5 rounded-2xl bg-[#031309] border border-[#205234] shadow-inner flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Satellite className="w-4 h-4 text-[#8eda5a]" />
                    <span className="text-xs font-bold text-white">Sentinel-2A • Esri Imagery</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#316b00]/30 text-[#8eda5a] font-mono">
                    10 m / px
                  </span>
                </div>

                <div className="h-44 w-full rounded-xl bg-gradient-to-br from-[#062013] via-[#0b291a] to-[#04160b] border border-[#205234] relative flex items-center justify-center overflow-hidden p-4">
                  <div className="w-3/4 h-3/4 rounded-lg border-2 border-[#8eda5a] bg-[#316b00]/30 backdrop-blur-sm flex flex-col items-center justify-center p-3 relative shadow-lg">
                    <span className="text-xs font-extrabold text-white">Casier PC15 — Makalioka 34</span>
                    <span className="text-[11px] text-[#8eda5a] font-mono mt-1">NDVI : 0.78 • 7.50 ha</span>
                    <span className="text-[9px] uppercase tracking-wider text-white mt-2 px-2 py-0.5 bg-[#20bb55] text-[#052511] font-bold rounded-full">
                      Vigueur Maximale
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => onNavigate ? onNavigate('my_fields') : (isAuthenticated && onGoToDashboard ? onGoToDashboard() : onGoToSignIn())}
                    className="text-xs text-[#8eda5a] hover:text-white font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <span>{language === 'fr' ? 'Ouvrir sur la carte interactive' : 'View on interactive map'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSimTab === 'vra' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#476c58]/30 text-[#c3ecd2] text-xs font-bold">
                    Modulation Variable (VRA)
                  </span>
                  <span className="text-xs text-white/70">Intrants Urée 46% & NPK</span>
                </div>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                  {language === 'fr'
                    ? 'Carte de Prescription d’Épandage Intelligente'
                    : 'Targeted Variable Rate Application Prescriptions'}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                  {language === 'fr'
                    ? "Le moteur VRA segmente la parcelle en 3 zones intra-parcellaires. Au lieu d'épandre une dose uniforme de 120 kg/ha, les zones à forte biomasse sont réduites à 90 kg/ha pour éviter la verse, tandis que les zones carencées reçoivent 120 kg/ha. Vous économisez 8 640 kg d'engrais par campagne."
                    : "VRA splits the parcel into 3 intra-field prescription zones. High biomass zones are cut down to 90 kg/ha to avoid lodging while lower vigor spots receive targeted boosts. 8,640 kg of fertilizer saved across the perimeter."}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-white/60 uppercase font-semibold">Zone A (Haute Vigueur)</span>
                    <div className="text-sm font-extrabold text-[#7fe88b] mt-0.5">85 kg/ha (-29%)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-white/60 uppercase font-semibold">Zone B (Normale)</span>
                    <div className="text-sm font-extrabold text-[#a8d0b7] mt-0.5">105 kg/ha (-12%)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-white/60 uppercase font-semibold">Zone C (Correction)</span>
                    <div className="text-sm font-extrabold text-amber-300 mt-0.5">125 kg/ha (+4%)</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0a2617] border border-[#205234] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white">Économie Financière VRA Estimée</span>
                    <p className="text-[11px] text-[#8eda5a]">1 420 $ (~6 390 000 MGA) d’engrais économisés</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#20bb55] text-[#052511]">
                    -21.4% d’engrais
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-5 rounded-2xl bg-[#031309] border border-[#205234] shadow-inner flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#8eda5a]" />
                    <span className="text-xs font-bold text-white">Fichiers Machines ISOBUS</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-[#a8d0b7] font-mono">
                    .SHP / .KML
                  </span>
                </div>

                <div className="space-y-2 py-2">
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                    <span className="font-mono text-white/80">Prescription_Alaotra_Urée.shp</span>
                    <span className="text-[#8eda5a] font-bold">Compatible Trimble</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                    <span className="font-mono text-white/80">VRA_Casier_PC15.kml</span>
                    <span className="text-[#8eda5a] font-bold">Google Earth / Mobile</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                    <span className="font-mono text-white/80">Fertilizer_Zoning.geojson</span>
                    <span className="text-[#8eda5a] font-bold">ISOBUS Terminal</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate ? onNavigate('vra_dashboard') : (isAuthenticated && onGoToDashboard ? onGoToDashboard() : onGoToSignIn())}
                  className="w-full mt-2 py-2.5 rounded-xl bg-[#20bb55] hover:bg-[#1caa4d] text-[#052511] font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <span>{language === 'fr' ? 'Générer une modulation VRA' : 'Generate VRA Prescription'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {activeSimTab === 'soil' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#1b4332] text-[#8eda5a] text-xs font-bold">
                    Télémétrie LoRaWAN 868 MHz
                  </span>
                  <span className="text-xs text-white/70">Station Sonde SP-01 • Casier PC15</span>
                </div>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                  {language === 'fr'
                    ? 'Diagnostic d’Humidité Racinologue Multi-Profondeurs'
                    : 'Multi-Depth Soil Moisture & Root Zone Telemetry'}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                  {language === 'fr'
                    ? "Mesure en temps réel de l'humidité volumique à 3 niveaux clés de la rhizosphère, du potentiel matriciel de succion (kPa) et de la température du sol. Permet de piloter précisément les vannes d'irrigation et d'éviter les assecs précoces du riz SRI."
                    : "Real-time volumetric soil moisture tracking at 3 rhizosphere levels, matric suction potential (kPa), and soil temperature. Enables precise irrigation sluice control and avoids SRI rice moisture stress."}
                </p>

                {/* 3 depths bar gauge */}
                <div className="space-y-3 pt-1">
                  <div>
                    <div className="flex items-center justify-between text-xs text-white/80 font-semibold mb-1">
                      <span>Profondeur 10 cm (Surface)</span>
                      <span className="text-[#8eda5a] font-bold">38.4% • Optimal</span>
                    </div>
                    <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#20bb55] rounded-full" style={{ width: '38.4%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs text-white/80 font-semibold mb-1">
                      <span>Profondeur 30 cm (Cœur Racinologue)</span>
                      <span className="text-[#8eda5a] font-bold">42.1% • Saturé</span>
                    </div>
                    <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#7fe88b] rounded-full" style={{ width: '42.1%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs text-white/80 font-semibold mb-1">
                      <span>Profondeur 60 cm (Réserve Utile Profonde)</span>
                      <span className="text-[#8eda5a] font-bold">47.8% • Hydromorphe</span>
                    </div>
                    <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#a8d0b7] rounded-full" style={{ width: '47.8%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-white/60 uppercase font-semibold">Succion Matricielle</span>
                    <div className="text-sm font-extrabold text-[#7fe88b] mt-0.5">-28 kPa</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-white/60 uppercase font-semibold">Température Sol</span>
                    <div className="text-sm font-extrabold text-white mt-0.5">22.4 °C</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-white/60 uppercase font-semibold">Batterie Solaire</span>
                    <div className="text-sm font-extrabold text-[#8eda5a] mt-0.5">98% (100% Solaire)</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 p-5 rounded-2xl bg-[#031309] border border-[#205234] shadow-inner flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-[#8eda5a]" />
                    <span className="text-xs font-bold text-white">Sonde LoRaWAN SP-01</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#1b4332] text-[#8eda5a] font-mono">
                    En ligne • 868 MHz
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">Signal radio :</span>
                    <span className="text-[#8eda5a] font-mono font-bold">-74 dBm (Excellent)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">Passerelle :</span>
                    <span className="text-white">Ambatondrazaka Sud (42ms)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">Seuil d'irrigation :</span>
                    <span className="text-amber-400 font-bold">32.0%</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate ? onNavigate('soil_sensors') : (isAuthenticated && onGoToDashboard ? onGoToDashboard() : onGoToSignIn())}
                  className="w-full mt-2 py-2.5 rounded-xl bg-[#20bb55] hover:bg-[#1caa4d] text-[#052511] font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <span>{language === 'fr' ? 'Gérer les sondes de sol' : 'Manage Soil Sensors'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {activeSimTab === 'yield' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#1b4332] text-[#8eda5a] text-xs font-bold">
                    IA Prédictive des Récoltes
                  </span>
                  <span className="text-xs text-white/70">Modélisation Degrés-Jours (GDD)</span>
                </div>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                  {language === 'fr'
                    ? 'Projection de Rendement & Valorisation en Francs Malgaches (Ariary)'
                    : 'Harvest Yield Projections & Economic Valuation in Ariary MGA'}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                  {language === 'fr'
                    ? "En combinant l'historique NDVI de la parcelle, les degrés-jours cumulés et l'humidité racinaire, le réseau neuronal AROVOLY projette un rendement de 6.8 t/ha pour le casier PC15 (+4.6% au-dessus de l'objectif initial), valorisé à 114,75 millions d'Ariary."
                    : "Combining historical NDVI trends, growing degree-days, and root moisture, the AROVOLY model projects 6.8 t/ha yield for polder PC15 (+4.6% over baseline), with an estimated harvest value of 114.75M Ariary."}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-white/60 uppercase font-semibold">Rendement Projeté</span>
                    <div className="text-base font-extrabold text-[#7fe88b] mt-0.5">6.80 t/ha</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-white/60 uppercase font-semibold">Production Totale</span>
                    <div className="text-base font-extrabold text-white mt-0.5">51.00 tonnes</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-white/60 uppercase font-semibold">Indice de Confiance</span>
                    <div className="text-base font-extrabold text-[#a8d0b7] mt-0.5">94.2%</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0a2617] border border-[#205234] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white">Valeur Marchande Estimée</span>
                    <p className="text-base font-extrabold text-[#7fe88b]">114 750 000 MGA (~25 500 $)</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#20bb55] text-[#052511]">
                    2 250 MGA / kg
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-5 rounded-2xl bg-[#031309] border border-[#205234] shadow-inner flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#8eda5a]" />
                    <span className="text-xs font-bold text-white">Analyse des Scénarios de Récolte</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-[#a8d0b7] font-mono">
                    Scénario Optimal
                  </span>
                </div>

                <div className="space-y-2.5 py-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">Scénario Optimiste (+10% pluie) :</span>
                    <span className="text-[#7fe88b] font-bold">7.2 t/ha • 121.5M MGA</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">Scénario Central (Référence) :</span>
                    <span className="text-white font-bold">6.8 t/ha • 114.7M MGA</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">Scénario Aléa Sécheresse :</span>
                    <span className="text-amber-400 font-bold">5.9 t/ha • 99.5M MGA</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate ? onNavigate('yield_forecast') : (isAuthenticated && onGoToDashboard ? onGoToDashboard() : onGoToSignIn())}
                  className="w-full mt-2 py-2.5 rounded-xl bg-[#20bb55] hover:bg-[#1caa4d] text-[#052511] font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <span>{language === 'fr' ? 'Consulter les prévisions de récolte' : 'Open Yield Analytics'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ==================== HOW IT WORKS / PIPELINE ==================== */}
      <section id="how-it-works" className="landing-section py-12 sm:py-16 px-4 md:px-8 lg:px-12 bg-[#f0eee8] border-t border-[#e5e2dc]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c3ecd2] text-[#002113] text-xs font-bold mb-2.5">
              <span className="material-symbols-outlined text-xs">route</span>
              <span>{language === 'fr' ? 'Fonctionnement Pas-à-Pas' : 'Step-by-Step Telemetry'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1c1c18] tracking-tight leading-tight">
              {language === 'fr'
                ? 'Comment circule la donnée agronomique sur AROVOLY ?'
                : 'How does AROVOLY deliver actionable crop intelligence?'}
            </h2>
            <p className="text-[#414939] text-xs sm:text-sm mt-2 max-w-2xl mx-auto">
              {language === 'fr'
                ? 'De l’orbite terrestre à la rhizosphère, découvrez comment notre pipeline transforme les signaux bruts en prescriptions de terrain.'
                : 'From earth orbit down to root zone pores, discover how raw signals transform into precision application prescriptions.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e5e2dc] flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#76c043] font-mono">01</span>
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#c3ecd2] flex items-center justify-center text-[#316b00] my-3">
                  <span className="material-symbols-outlined text-xl sm:text-2xl">satellite_alt</span>
                </div>
                <h3 className="font-bold text-sm sm:text-base text-[#1c1c18] mb-1.5">
                  {language === 'fr' ? 'Acquisition Spatiale' : 'Orbital Capture'}
                </h3>
                <p className="text-xs text-[#414939] leading-relaxed">
                  {language === 'fr'
                    ? 'Sentinel-2 (ESA) scanne Madagascar tous les 5 jours à 10 m de résolution. Extraction automatique du rouge et proche infrarouge.'
                    : 'Sentinel-2 passes every 5 days at 10m resolution. Near-infrared and red bands are extracted after cloud masking.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#f0eee8] text-xs font-bold text-[#316b00]">
                Sentinel-2 &amp; Esri Imagery
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e5e2dc] flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#76c043] font-mono">02</span>
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#c3ecd2] flex items-center justify-center text-[#316b00] my-3">
                  <span className="material-symbols-outlined text-xl sm:text-2xl">sensors</span>
                </div>
                <h3 className="font-bold text-sm sm:text-base text-[#1c1c18] mb-1.5">
                  {language === 'fr' ? 'Sondes Sols LoRaWAN' : 'LoRaWAN Soil Probes'}
                </h3>
                <p className="text-xs text-[#414939] leading-relaxed">
                  {language === 'fr'
                    ? 'Sondes autonomes solaires mesurant l’humidité volumique à 10, 30 et 60 cm et le potentiel de succion racinaire (kPa).'
                    : 'Solar capacitive probes monitor moisture at 10, 30, and 60 cm alongside root matric tension over 15km wireless radio.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#f0eee8] text-xs font-bold text-[#316b00]">
                868 MHz • 100% Solaire
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e5e2dc] flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#76c043] font-mono">03</span>
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#c3ecd2] flex items-center justify-center text-[#316b00] my-3">
                  <span className="material-symbols-outlined text-xl sm:text-2xl">neurology</span>
                </div>
                <h3 className="font-bold text-sm sm:text-base text-[#1c1c18] mb-1.5">
                  {language === 'fr' ? 'IA & Degrés-Jours GDD' : 'AI & GDD Degree-Days'}
                </h3>
                <p className="text-xs text-[#414939] leading-relaxed">
                  {language === 'fr'
                    ? 'Calcul automatique du NDVI, des degrés-jours de croissance et des alertes de stress hydrique pour chaque casier.'
                    : 'Automated NDVI vegetative vigor curves, growing degree-days, and real-time alerts for nitrogen deficiency.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#f0eee8] text-xs font-bold text-[#316b00]">
                Modélisation Prédictive
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e5e2dc] flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#76c043] font-mono">04</span>
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#c3ecd2] flex items-center justify-center text-[#316b00] my-3">
                  <span className="material-symbols-outlined text-xl sm:text-2xl">precision_manufacturing</span>
                </div>
                <h3 className="font-bold text-sm sm:text-base text-[#1c1c18] mb-1.5">
                  {language === 'fr' ? 'Modulation VRA & Tracteurs' : 'VRA & Farm Machines'}
                </h3>
                <p className="text-xs text-[#414939] leading-relaxed">
                  {language === 'fr'
                    ? 'Exports de cartes de modulation d’engrais Shapefile et KML directement compatibles avec les consoles John Deere et Trimble.'
                    : 'Universal Shapefile, GeoJSON, and KML export ready for John Deere GreenStar, Trimble, and tractor consoles.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#f0eee8] text-xs font-bold text-[#316b00]">
                Shapefile, KML, GeoJSON
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== ABOUT AROVOLY SECTION ==================== */}
      <section id="apropos" className="landing-section py-12 sm:py-16 px-4 md:px-8 lg:px-12 bg-[#fcf9f3] border-t border-[#e5e2dc]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-6 space-y-4 sm:space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c3ecd2] text-[#002113] text-xs font-bold">
                <span className="material-symbols-outlined text-xs">info</span>
                <span>{language === 'fr' ? 'À Propos d’AROVOLY' : 'About AROVOLY'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1c1c18] tracking-tight leading-tight">
                {language === 'fr'
                  ? 'Une initiative technologique et agronomique pour la souveraineté de Madagascar'
                  : 'A sovereign technology initiative for Madagascar’s agricultural resilience'}
              </h2>
              <p className="text-xs sm:text-sm text-[#414939] leading-relaxed">
                {language === 'fr'
                  ? "Le nom AROVOLY provient de la langue malgache : « ARO » signifie Protection et « VOLY » signifie Cultures ou Plantations. Notre ambition est d'armer les coopératives, agronomes régionaux et exploitants agricoles des technologies de télédétection spatiale les plus avancées, sans la dépendance à des logiciels propriétaires coûteux et inadaptés aux réalités locales."
                  : "The name AROVOLY originates from the Malagasy language: « ARO » means Protection and « VOLY » stands for Crops or Plantations. Our ambition is to empower cooperatives, regional agronomists, and growers with world-class earth observation telemetry, free from expensive proprietary software that ignores tropical realities."}
              </p>

              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#c3ecd2] text-[#316b00] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-base">verified</span>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#1c1c18]">
                      {language === 'fr' ? 'Précision Calibrée aux Sols Tropicaux' : 'Calibrated for Tropical Soils'}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-[#414939] mt-0.5">
                      {language === 'fr'
                        ? 'Modèles calibrés pour les rizières hydromorphes, alluvions de baiboho et terres ferrallitiques acides de tanety.'
                        : 'Calibrated for hydromorphic paddies, alluvial baiboho soils, and acidic upland tanety ridges.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#c3ecd2] text-[#316b00] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-base">shield</span>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#1c1c18]">
                      {language === 'fr' ? 'Souveraineté des Données Agricoles' : 'Agricultural Data Sovereignty'}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-[#414939] mt-0.5">
                      {language === 'fr'
                        ? 'Vos données de parcelles restent votre propriété stricte. Aucun transfert de données vers des spéculateurs de grains.'
                        : 'Your parcel polygons and yield forecasts remain 100% your private property.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#c3ecd2] text-[#316b00] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-base">groups</span>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#1c1c18]">
                      {language === 'fr' ? 'Co-conçu avec les Producteurs' : 'Co-developed with Farmers'}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-[#414939] mt-0.5">
                      {language === 'fr'
                        ? 'Développé en lien direct avec les coopératives du Lac Alaotra, du Vakinankaratra et du Menabe.'
                        : 'Built side-by-side with rice cooperatives and field agronomists across Madagascar.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="lg:col-span-6 bg-[#0c1f15] p-5 sm:p-6 lg:p-7 rounded-2xl border border-[#205234] text-white shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-3.5 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
                  alt="Dr. Vance"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover ring-2 ring-[#76c043]"
                />
                <div>
                  <h4 className="font-heading font-bold text-sm sm:text-base text-white">Dr. Éléonore Vance (Andrianina)</h4>
                  <p className="text-xs text-[#7fe88b] font-semibold">
                    {language === 'fr' ? 'Directrice Agronome Régionale' : 'Regional Lead Agronomist'}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-white/60">Coordination Lac Alaotra &amp; Vakinankaratra</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-white/90 italic leading-relaxed">
                {language === 'fr'
                  ? "« Grâce à AROVOLY, nous avons pour la première fois couplé la télédétection spatiale de nos casiers de riz avec les vannes d’irrigation et les sondes LoRaWAN. En une seule campagne, nous avons économisé plus de 8 600 kg d’engrais tout en sécurisant un rendement record de 6,8 t/ha sur les polders d’Ambatondrazaka. C'est une révolution pour la riziculture malgache. »"
                  : "« Thanks to AROVOLY, we connected our paddy polder satellite observations directly to irrigation sluices and LoRaWAN soil moisture probes. In a single harvest season, we saved over 8,600 kg of fertilizer while securing a stellar 6.8 t/ha yield at Ambatondrazaka. A true turning point for Malagasy agriculture. »"}
              </p>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
                <span className="flex items-center gap-1.5 text-[#8eda5a] font-semibold text-[11px]">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  <span>Validation Agronomique Reconnue</span>
                </span>
                <span className="text-[11px]">Campagne 2025/2026</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== AGRICULTURAL BASINS OF MADAGASCAR ==================== */}
      <section id="regions" className="landing-section py-12 sm:py-16 px-4 md:px-8 lg:px-12 bg-[#f0eee8] border-t border-[#e5e2dc]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c3ecd2] text-[#002113] text-xs font-bold mb-2.5">
              <span className="material-symbols-outlined text-xs">map</span>
              <span>{language === 'fr' ? 'Terroirs Agricoles' : 'Mapped Food Baskets'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1c1c18] tracking-tight leading-tight">
              {language === 'fr'
                ? 'Déploiement sur les greniers agricoles de la Grande Île'
                : 'Deployed across Madagascar’s premier agricultural basins'}
            </h2>
            <p className="text-xs sm:text-sm text-[#414939] mt-2">
              {language === 'fr'
                ? 'Chaque région possède ses caractéristiques pédologiques et ses cultures phares intégrées dans la plateforme.'
                : 'Each terroir features tailored soil profiles and crops modeled within the engine.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Alaotra */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-[#e5e2dc] flex flex-col justify-between hover:shadow-xl hover:border-[#76c043]/50 transition-all duration-300">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#c3ecd2] text-[#002113] text-[11px] font-bold">
                    Secteur 04 • Alaotra-Mangoro
                  </span>
                  <span className="text-[11px] text-[#414939] font-medium">Ambatondrazaka</span>
                </div>
                <h3 className="font-heading font-bold text-base sm:text-lg text-[#1c1c18] mb-1.5">
                  {language === 'fr' ? 'Bassin du Lac Alaotra (Casier PC15)' : 'Lake Alaotra Basin (Polder PC15)'}
                </h3>
                <p className="text-xs text-[#414939] leading-relaxed">
                  {language === 'fr'
                    ? 'Premier grenier à riz de Madagascar. Surveillance des rizières irriguées par le canal PC15 et du Système de Riziculture Intensive (SRI) avec la variété d’exception Vary Makalioka 34.'
                    : 'Madagascar’s primary rice granary. Precision monitoring of canal-irrigated alluvials and SRI (System of Rice Intensification) with premier Vary Makalioka 34 paddy.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#f0eee8] text-xs text-[#414939] flex items-center justify-between">
                <span>{language === 'fr' ? 'Surface : 485 ha modélisés' : 'Area: 485 ha modeled'}</span>
                <span className="text-[#316b00] font-bold">{language === 'fr' ? 'Riz de Luxe' : 'Luxury Rice'}</span>
              </div>
            </div>

            {/* Vakinankaratra */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-[#e5e2dc] flex flex-col justify-between hover:shadow-xl hover:border-[#76c043]/50 transition-all duration-300">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ffdbce] text-[#c2410c] text-[11px] font-bold">
                    Secteur 02 • Vakinankaratra
                  </span>
                  <span className="text-[11px] text-[#414939] font-medium">Antsirabe / Betafo</span>
                </div>
                <h3 className="font-heading font-bold text-base sm:text-lg text-[#1c1c18] mb-1.5">
                  {language === 'fr' ? 'Hauts Plateaux & Tanety' : 'Highlands & Tanety Hills'}
                </h3>
                <p className="text-xs text-[#414939] leading-relaxed">
                  {language === 'fr'
                    ? 'Terres ferrallitiques d’altitude exposées au lessivage et à l’acidité des sols (pH 5.4). Conduite du maïs hybride IRAT 200 avec apport d’amendement calcaire et urée fractionnée.'
                    : 'High-altitude volcanic and ferrallitic tanety slopes prone to nutrient leaching and low pH. Management of hybrid maize IRAT 200 with liming and split urea doses.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#f0eee8] text-xs text-[#414939] flex items-center justify-between">
                <span>{language === 'fr' ? 'Surface : 310 ha modélisés' : 'Area: 310 ha modeled'}</span>
                <span className="text-[#c2410c] font-bold">{language === 'fr' ? 'Maïs & Tanety' : 'Maize & Tanety'}</span>
              </div>
            </div>

            {/* Itasy */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-[#e5e2dc] flex flex-col justify-between hover:shadow-xl hover:border-[#76c043]/50 transition-all duration-300">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#c3ecd2] text-[#002113] text-[11px] font-bold">
                    Secteur 09 • Itasy
                  </span>
                  <span className="text-[11px] text-[#414939] font-medium">Miarinarivo / Ampefy</span>
                </div>
                <h3 className="font-heading font-bold text-base sm:text-lg text-[#1c1c18] mb-1.5">
                  {language === 'fr' ? 'Terres Volcaniques du Lac Itasy' : 'Lake Itasy Volcanic Lands'}
                </h3>
                <p className="text-xs text-[#414939] leading-relaxed">
                  {language === 'fr'
                    ? 'Terroir volcanique d’une fertilité exceptionnelle. Culture intensive de manioc Ampasimbe à forte teneur en fécule, bénéficiant d’une rétention hydrique optimale sur les berges du lac.'
                    : 'Exceptional fertile volcanic soil near Lake Itasy. High-yield production of high-starch Ampasimbe cassava thriving in rich mineral substrates.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#f0eee8] text-xs text-[#414939] flex items-center justify-between">
                <span>{language === 'fr' ? 'Surface : 195 ha modélisés' : 'Area: 195 ha modeled'}</span>
                <span className="text-[#316b00] font-bold">{language === 'fr' ? 'Manioc Fécule' : 'Cassava Starch'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FAQ ACCORDION ==================== */}
      <section id="faq" className="landing-section py-12 sm:py-16 px-4 md:px-8 lg:px-12 bg-[#fcf9f3] border-t border-[#e5e2dc]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c3ecd2] text-[#002113] text-xs font-bold mb-2.5">
              <span className="material-symbols-outlined text-xs">help</span>
              <span>{language === 'fr' ? 'Foire Aux Questions' : 'FAQ & Support'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1c1c18] tracking-tight leading-tight">
              {language === 'fr' ? 'Questions Fréquentes' : 'Frequently Asked Questions'}
            </h2>
            <p className="text-xs sm:text-sm text-[#414939] mt-2">
              {language === 'fr'
                ? 'Toutes les réponses pour comprendre le fonctionnement et démarrer sur AROVOLY.'
                : 'Everything you need to know about getting started and telemetry specs.'}
            </p>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-[#e5e2dc] bg-white overflow-hidden transition-all shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-4.5 text-left flex items-center justify-between gap-4 hover:bg-[#f6f3ed] transition-colors"
                  >
                    <span className="font-heading font-bold text-xs sm:text-sm text-[#1c1c18]">{faq.q}</span>
                    <span
                      className={`material-symbols-outlined text-base text-[#316b00] transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-4.5 pb-4 pt-1 text-xs sm:text-sm text-[#414939] leading-relaxed border-t border-[#f0eee8]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== CONTACT & DEPLOYMENT REQUEST ==================== */}
      <section id="contact" className="landing-section py-12 sm:py-16 px-4 md:px-8 lg:px-12 bg-[#f0eee8] border-t border-[#e5e2dc]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c3ecd2] text-[#002113] text-xs font-bold mb-2.5">
              <span className="material-symbols-outlined text-xs">mail</span>
              <span>{language === 'fr' ? 'Contact & Déploiement' : 'Contact & Deployment'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1c1c18] tracking-tight leading-tight">
              {language === 'fr'
                ? 'Déployez AROVOLY sur votre exploitation agricole'
                : 'Request an AROVOLY deployment for your agricultural estate'}
            </h2>
            <p className="text-xs sm:text-sm text-[#414939] mt-2">
              {language === 'fr'
                ? 'Nos agronomes et spécialistes SIG vous accompagnent pour cartographier vos casiers et installer vos sondes LoRaWAN.'
                : 'Our agronomists and GIS engineers assist you with parcel digitization and IoT probe setups.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5e2dc] p-5 sm:p-7 shadow-lg">
            {contactSubmitted ? (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#c3ecd2] text-[#316b00] flex items-center justify-center ring-2 ring-[#76c043]">
                  <span className="material-symbols-outlined text-3xl">check</span>
                </div>
                <h3 className="font-heading font-extrabold text-xl text-[#1c1c18]">
                  {language === 'fr' ? 'Demande bien enregistrée !' : 'Request Received!'}
                </h3>
                <p className="text-sm text-[#414939] max-w-md">
                  {language === 'fr'
                    ? 'Merci ! Notre équipe de coordination agronomique AROVOLY à Madagascar vous contactera sous 24h ouvrées.'
                    : 'Thank you! The AROVOLY Madagascar agronomy coordination team will contact you within 24 business hours.'}
                </p>
                <button
                  onClick={() => setContactSubmitted(false)}
                  className="mt-2 text-xs font-bold text-[#316b00] hover:underline"
                >
                  {language === 'fr' ? 'Envoyer un autre message' : 'Send another inquiry'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1c1c18] mb-1.5">
                      {language === 'fr' ? 'Nom et Prénom *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder={language === 'fr' ? 'Dr. Éléonore Vance' : 'Full Name'}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#fcf9f3] border border-[#e5e2dc] text-[#1c1c18] text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#316b00] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1c1c18] mb-1.5">
                      {language === 'fr' ? 'Email Professionnel *' : 'Work Email *'}
                    </label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="contact@exploitation.mg"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#fcf9f3] border border-[#e5e2dc] text-[#1c1c18] text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#316b00] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1c1c18] mb-1.5">
                      {language === 'fr' ? 'Nom de l’Exploitation / Organisation' : 'Farm / Organization Name'}
                    </label>
                    <input
                      type="text"
                      value={contactForm.organization}
                      onChange={(e) => setContactForm({ ...contactForm, organization: e.target.value })}
                      placeholder={language === 'fr' ? 'Coopérative Rizicole Alaotra' : 'Farm Cooperative'}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#fcf9f3] border border-[#e5e2dc] text-[#1c1c18] text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#316b00] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1c1c18] mb-1.5">
                      {language === 'fr' ? 'Région / Bassin Agricole' : 'Target Agricultural Basin'}
                    </label>
                    <select
                      value={contactForm.region}
                      onChange={(e) => setContactForm({ ...contactForm, region: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#fcf9f3] border border-[#e5e2dc] text-[#1c1c18] text-xs focus:outline-none focus:border-[#316b00] transition-colors"
                    >
                      <option value="Alaotra-Mangoro">Alaotra-Mangoro (Ambatondrazaka)</option>
                      <option value="Vakinankaratra">Vakinankaratra (Antsirabe / Betafo)</option>
                      <option value="Itasy">Itasy (Ampefy / Miarinarivo)</option>
                      <option value="Menabe">Menabe (Morondava / Mahabo)</option>
                      <option value="Autre">Autre région / Extension</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1c1c18] mb-1.5">
                    {language === 'fr' ? 'Détails de votre besoin ou projet' : 'Project description & specific needs'}
                  </label>
                  <textarea
                    rows={3}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder={
                      language === 'fr'
                        ? 'Ex: Nous gérons 120 ha de rizières au Lac Alaotra et souhaitons tester les sondes LoRaWAN et la modulation d’urée VRA...'
                        : 'Ex: We manage 120 ha of paddy fields and want to pilot LoRaWAN root telemetry and VRA urea maps...'
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fcf9f3] border border-[#e5e2dc] text-[#1c1c18] text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#316b00] transition-colors"
                  ></textarea>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <span className="text-[11px] text-[#414939]">
                    {language === 'fr'
                      ? 'Support technique direct : support@arovoly.mg • Antananarivo & Ambatondrazaka'
                      : 'Direct technical contact: support@arovoly.mg • Antananarivo & Ambatondrazaka'}
                  </span>

                  <button
                    type="submit"
                    className="w-full sm:w-auto py-3 px-8 rounded-full bg-[#20bb55] hover:bg-[#1caa4d] text-[#052511] font-bold text-xs shadow-lg transition-all transform hover:scale-[1.02]"
                  >
                    <span>{language === 'fr' ? 'Envoyer la Demande' : 'Submit Deployment Request'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-[#0c1f15] text-[#a8d0b7] py-8 px-4 md:px-10 lg:px-16 border-t border-[#1a3827]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-wider text-white">AROVOLY MADAGASCAR</span>
            <span className="text-[#416652]">•</span>
            <span className="text-white/70">Crop Intelligence &amp; Orbital Telemetry</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-white/80">
            <a className="hover:text-white transition-colors" href="#overview">
              {language === 'fr' ? 'Présentation' : 'Overview'}
            </a>
            <a className="hover:text-white transition-colors" href="#how-it-works">
              {language === 'fr' ? 'Fonctionnement' : 'Pipeline'}
            </a>
            <a className="hover:text-white transition-colors" href="#features">
              {language === 'fr' ? 'Fonctionnalités' : 'Features'}
            </a>
            <a className="hover:text-white transition-colors" href="#apropos">
              {language === 'fr' ? 'À propos' : 'About'}
            </a>
            <a className="hover:text-white transition-colors" href="#regions">
              {language === 'fr' ? 'Terroirs' : 'Regions'}
            </a>
            <button
              onClick={onGoToSignIn}
              className="text-[#8eda5a] hover:text-white font-bold transition-colors"
            >
              {language === 'fr' ? 'Connexion Terminal' : 'Terminal Login'}
            </button>
            <span className="font-mono text-[#8eda5a] text-[11px] bg-[#143825] px-2 py-0.5 rounded">Terminal v3.4</span>
          </div>
        </div>
      </footer>

      {/* Floating Scroll-to-Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[#1b4332] hover:bg-[#143225] border border-white/20 text-white shadow-2xl transition-all transform hover:scale-110 active:scale-95"
          title={language === 'fr' ? 'Retour en haut de page' : 'Back to top'}
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
