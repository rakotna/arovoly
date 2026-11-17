import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { ViewType } from '../../types';
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
  Mail,
  Phone,
  Send,
  Building,
  Check,
  Play,
  Activity,
  Calendar,
  CloudSun,
  Flame,
  Gauge,
  Award,
  Users,
  Sprout,
  Compass,
  ArrowUpRight,
  LogOut,
  Sliders,
  Filter,
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
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    organization: '',
    region: 'Alaotra-Mangoro',
    message: '',
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Monitor scroll for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white relative overflow-x-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-96 right-10 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-[1800px] left-10 w-[550px] h-[550px] bg-emerald-700/10 rounded-full blur-[160px] pointer-events-none"></div>

      {/* Top Session Active Notification (if authenticated) */}
      {isAuthenticated && (
        <aside aria-label="Notification de session active" className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-b border-emerald-500/30 px-4 py-2 text-xs flex items-center justify-between text-emerald-200">
          <div className="flex items-center gap-2 max-w-4xl mx-auto w-full justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-semibold text-white">
                {language === 'fr' ? 'Session active :' : 'Active session:'}
              </span>
              <span>{userName || 'Utilisateur AROVOLY'}</span>
              {userRole && <span className="hidden sm:inline text-emerald-400">({userRole})</span>}
            </div>

            <div className="flex items-center gap-3">
              {onGoToDashboard && (
                <button
                  onClick={onGoToDashboard}
                  className="px-3 py-1 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all flex items-center gap-1.5"
                >
                  <span>{language === 'fr' ? 'Aller au Tableau de Bord' : 'Open Dashboard'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              {onSignOut && (
                <button
                  onClick={onSignOut}
                  className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors"
                  title={language === 'fr' ? 'Déconnexion' : 'Sign out'}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </aside>
      )}

      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 w-full bg-slate-900/85 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 lg:px-12 py-3.5 flex items-center justify-between transition-all">
        {/* Brand Logo & Tagline */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={scrollToTop}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-[0_0_20px_-3px_rgba(16,185,129,0.5)] group-hover:scale-105 transition-transform">
            <span className="text-xl">🌱</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-white text-lg tracking-tight leading-none">
                ARO<span className="text-emerald-400">VOLY</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                v3.4 • Madagascar
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium tracking-tight mt-0.5 hidden sm:inline-block">
              {language === 'fr'
                ? 'Plateforme Spatiale & IoT d’Agriculture de Précision'
                : 'Spatial AI & IoT Precision Agriculture Platform'}
            </span>
          </div>
        </div>

        {/* Center Navigation Anchor Links */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <a href="#presentation" className="hover:text-emerald-400 transition-colors">
            {language === 'fr' ? 'Présentation' : 'Overview'}
          </a>
          <a href="#architecture" className="hover:text-emerald-400 transition-colors">
            {language === 'fr' ? 'Fonctionnement' : 'How it Works'}
          </a>
          <a href="#simulator" className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-emerald-400">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'fr' ? 'Simulateur' : 'Simulator'}</span>
          </a>
          <a href="#features" className="hover:text-emerald-400 transition-colors">
            {language === 'fr' ? 'Fonctionnalités' : 'Features'}
          </a>
          <a href="#apropos" className="hover:text-emerald-400 transition-colors">
            {language === 'fr' ? 'À Propos' : 'About Us'}
          </a>
          <a href="#regions" className="hover:text-emerald-400 transition-colors">
            {language === 'fr' ? 'Terroirs' : 'Regions'}
          </a>
          <a href="#faq" className="hover:text-emerald-400 transition-colors">
            {language === 'fr' ? 'Aide & FAQ' : 'Help & FAQ'}
          </a>
          <a href="#contact" className="hover:text-emerald-400 transition-colors">
            {language === 'fr' ? 'Contact' : 'Contact'}
          </a>
        </div>

        {/* Right CTA Actions & Language */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200 text-xs font-bold transition-all shadow-sm"
            title="Changer de langue / Switch language"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span className="tracking-wider">{language.toUpperCase()}</span>
          </button>

          {/* Instant 1-Click Demo Button */}
          {onQuickDemo && !isAuthenticated && (
            <button
              onClick={onQuickDemo}
              className="hidden sm:flex items-center gap-1.5 py-2 px-3.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 text-xs font-bold transition-all"
              title={language === 'fr' ? 'Tester immédiatement sans mot de passe' : 'Try immediately without password'}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'fr' ? 'Démo 1-Clic' : '1-Click Demo'}</span>
            </button>
          )}

          {/* Primary Navigation CTA */}
          {isAuthenticated && onGoToDashboard ? (
            <button
              onClick={onGoToDashboard}
              className="py-2 px-4 sm:px-5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-[0_0_20px_-3px_rgba(16,185,129,0.5)] flex items-center gap-2 transition-all transform hover:scale-105"
            >
              <span>{language === 'fr' ? 'Tableau de Bord' : 'Open Dashboard'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onGoToSignIn}
              className="py-2 px-4 sm:px-5 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-xs shadow-[0_0_20px_-3px_rgba(16,185,129,0.5)] flex items-center gap-2 transition-all transform hover:scale-105"
            >
              <span>{language === 'fr' ? 'Se Connecter' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-8 lg:px-12 pt-16 pb-20 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide mb-6 animate-fade-in shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>
            {language === 'fr'
              ? 'Système Intégré d’Agriculture de Précision & Télédétection Madagascar'
              : 'Integrated Precision Agriculture & Spatial Remote Sensing Platform'}
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight max-w-4xl leading-tight">
          {language === 'fr' ? (
            <>
              L’intelligence spatiale et l’IoT au service des{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                terroirs agricoles de Madagascar
              </span>
            </>
          ) : (
            <>
              Spatial AI & IoT telemetry safeguarding{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Madagascar’s agricultural food baskets
              </span>
            </>
          )}
        </h1>

        {/* Hero Subtitle */}
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl mt-6 leading-relaxed">
          {language === 'fr'
            ? "AROVOLY (« Protection des cultures ») rassemble la cartographie satellitaire Sentinel-2 (ESA), les indices multispectraux NDVI, le diagnostic racinaire IoT sans fil LoRaWAN et la modulation d'intrants VRA pour sécuriser les rendements du Lac Alaotra, du Vakinankaratra et du Lac Itasy."
            : "AROVOLY (« Crop Protection » in Malagasy) unifies Sentinel-2 (ESA) orbital telemetry, NDVI vegetative indices, LoRaWAN root-zone IoT capacitive probes, and VRA precision fertilizer modulation to empower farmers and agronomists across Madagascar."}
        </p>

        {/* Hero Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 mt-8">
          {isAuthenticated && onGoToDashboard ? (
            <button
              onClick={onGoToDashboard}
              className="py-3.5 px-7 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-[0_0_25px_-5px_rgba(16,185,129,0.6)] flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95"
            >
              <span>{language === 'fr' ? 'Accéder à mon Tableau de Bord' : 'Open My Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                onClick={onGoToSignIn}
                className="py-3.5 px-7 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-[0_0_25px_-5px_rgba(16,185,129,0.6)] flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95"
              >
                <span>{language === 'fr' ? 'Se Connecter au Terminal' : 'Sign In to Terminal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onQuickDemo && (
                <button
                  onClick={onQuickDemo}
                  className="py-3.5 px-6 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 text-emerald-300 font-bold text-sm shadow-sm flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'fr' ? 'Essai Démo Immédiat (1-clic)' : 'Instant 1-Click Demo'}</span>
                </button>
              )}
            </>
          )}

          <a
            href="#presentation"
            className="py-3.5 px-6 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-sm flex items-center gap-2 transition-all"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>{language === 'fr' ? 'Découvrir la Plateforme' : 'Explore Platform'}</span>
          </a>
        </div>

        {/* Live Key Metrics Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl mt-14 p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col items-center text-center p-2">
            <span className="font-heading font-extrabold text-2xl sm:text-4xl text-emerald-400">1 230 ha</span>
            <span className="text-xs font-semibold text-slate-300 mt-1">
              {language === 'fr' ? 'Surface modélisée' : 'Surface modeled'}
            </span>
            <span className="text-[11px] text-slate-400">
              {language === 'fr' ? 'Parcelles géoréférencées' : 'Geo-referenced parcels'}
            </span>
          </div>

          <div className="flex flex-col items-center text-center p-2">
            <span className="font-heading font-extrabold text-2xl sm:text-4xl text-emerald-400">-20%</span>
            <span className="text-xs font-semibold text-slate-300 mt-1">
              {language === 'fr' ? 'Économie d’intrants' : 'Fertilizer savings'}
            </span>
            <span className="text-[11px] text-slate-400">
              {language === 'fr' ? 'Grâce à la modulation VRA' : 'Via VRA modulation'}
            </span>
          </div>

          <div className="flex flex-col items-center text-center p-2">
            <span className="font-heading font-extrabold text-2xl sm:text-4xl text-emerald-400">94.2%</span>
            <span className="text-xs font-semibold text-slate-300 mt-1">
              {language === 'fr' ? 'Fiabilité prévisionnelle' : 'Yield model accuracy'}
            </span>
            <span className="text-[11px] text-slate-400">
              {language === 'fr' ? 'Modèle IA récolte' : 'Harvest AI projection'}
            </span>
          </div>

          <div className="flex flex-col items-center text-center p-2">
            <span className="font-heading font-extrabold text-2xl sm:text-4xl text-emerald-400">5 Sondes</span>
            <span className="text-xs font-semibold text-slate-300 mt-1">
              {language === 'fr' ? 'IoT LoRaWAN 24/7' : 'LoRaWAN active probes'}
            </span>
            <span className="text-[11px] text-slate-400">
              {language === 'fr' ? 'Télémesures 3 profondeurs' : '3-depth telemetry'}
            </span>
          </div>
        </div>
      </section>

      {/* Section: Interactive Platform Simulator / Live Demo */}
      <section id="simulator" className="px-4 sm:px-8 lg:px-12 py-16 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'Démonstration Interactive' : 'Interactive Showcase'}</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white">
            {language === 'fr'
              ? 'Testez les fonctionnalités clés de la console AROVOLY'
              : 'Preview core AROVOLY capabilities in real-time'}
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            {language === 'fr'
              ? 'Cliquez sur les onglets ci-dessous pour inspecter les données en direct comme sur le terrain.'
              : 'Select any module below to inspect live field data and simulation screens.'}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveSimTab('ndvi')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeSimTab === 'ndvi'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 ring-1 ring-emerald-400'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-white/10'
            }`}
          >
            <Satellite className="w-4 h-4" />
            <span>{language === 'fr' ? '1. Carte Satellite & NDVI' : '1. Satellite & NDVI'}</span>
          </button>

          <button
            onClick={() => setActiveSimTab('vra')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeSimTab === 'vra'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 ring-1 ring-emerald-400'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-white/10'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{language === 'fr' ? '2. Prescription VRA' : '2. VRA Modulation'}</span>
          </button>

          <button
            onClick={() => setActiveSimTab('soil')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeSimTab === 'soil'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 ring-1 ring-emerald-400'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-white/10'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>{language === 'fr' ? '3. Sondes Racine IoT' : '3. IoT Soil Probes'}</span>
          </button>

          <button
            onClick={() => setActiveSimTab('yield')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeSimTab === 'yield'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 ring-1 ring-emerald-400'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-white/10'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{language === 'fr' ? '4. Prévision Récolte & MGA' : '4. Yield & Ariary MGA'}</span>
          </button>
        </div>

        {/* Tab Content Display Card */}
        <div className="bg-slate-900/90 rounded-3xl border border-white/15 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          {/* Subtle glow orb */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {activeSimTab === 'ndvi' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                    Secteur 04 • Lac Alaotra
                  </span>
                  <span className="text-xs text-slate-400">Casier PC15 (Polder Est) • 7.50 ha</span>
                </div>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                  {language === 'fr'
                    ? 'Indice NDVI Multispectral (Sentinel-2 MSI L2A)'
                    : 'Multispectral NDVI Vegetation Index (Sentinel-2)'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {language === 'fr'
                    ? "Calculé à partir des bandes rouge (B04) et proche infrarouge (B08) de Sentinel-2 à 10 m de résolution. La parcelle présente une excellente couverture foliaire avec un indice moyen de 0.78 (+0.04 en 10 jours), confirmant le tallage vigoureux du riz Makalioka."
                    : "Computed from Sentinel-2 Red (B04) and NIR (B08) spectral channels at 10m resolution. Parcel indicates optimal vegetative vigor with an average NDVI of 0.78 (+0.04 over 10 days), indicating healthy tillering."}
                </p>

                {/* NDVI Scale visual */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
                    <span>Sol nu / Stress (0.1)</span>
                    <span className="text-emerald-400 font-bold">Optimal : 0.78</span>
                    <span>Végétation dense (1.0)</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-gradient-to-r from-red-500 via-yellow-400 via-emerald-400 to-emerald-700 relative">
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white ring-2 ring-slate-900 shadow-md"
                      style={{ left: '78%' }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-3">
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Santé Végétale</span>
                    <div className="text-base font-extrabold text-emerald-400 mt-0.5">96% Optimal</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Couverture Nuageuse</span>
                    <div className="text-base font-extrabold text-white mt-0.5">&lt; 2% Dégagé</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Dernier Passage</span>
                    <div className="text-base font-extrabold text-teal-300 mt-0.5">Il y a 18 min</div>
                  </div>
                </div>
              </div>

              {/* Graphic Mockup Card */}
              <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 shadow-inner flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Satellite className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">Sentinel-2A • Esri Imagery</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                    10 m / px
                  </span>
                </div>

                {/* Simulated Heatmap Area */}
                <div className="h-44 w-full rounded-xl bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 border border-emerald-500/20 relative flex items-center justify-center overflow-hidden p-4">
                  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:12px_12px]"></div>
                  <div className="w-3/4 h-3/4 rounded-lg border-2 border-emerald-400/80 bg-emerald-500/20 backdrop-blur-sm flex flex-col items-center justify-center p-3 relative shadow-glow-emerald">
                    <span className="text-xs font-extrabold text-white">Casier PC15 — Makalioka 34</span>
                    <span className="text-[11px] text-emerald-300 font-mono mt-1">NDVI : 0.78 • 7.50 ha</span>
                    <span className="text-[9px] uppercase tracking-wider text-emerald-200 mt-2 px-2 py-0.5 bg-emerald-600/50 rounded-full">
                      Vigueur Maximale
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => onNavigate ? onNavigate('my_fields') : (isAuthenticated && onGoToDashboard ? onGoToDashboard() : onGoToSignIn())}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <span>{language === 'fr' ? 'Ouvrir sur la carte interactive' : 'View on interactive map'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSimTab === 'vra' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
                    Modulation Variable (VRA)
                  </span>
                  <span className="text-xs text-slate-400">Intrants Urée 46% & NPK</span>
                </div>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                  {language === 'fr'
                    ? 'Carte de Prescription d’Épandage Intelligente'
                    : 'Targeted Variable Rate Application Prescriptions'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {language === 'fr'
                    ? "Le moteur VRA segmente la parcelle en 3 zones intra-parcellaires. Au lieu d'épandre une dose uniforme de 120 kg/ha, les zones à forte biomasse sont réduites à 90 kg/ha pour éviter la verse, tandis que les zones carencées reçoivent 120 kg/ha. Vous économisez 8 640 kg d'engrais par campagne."
                    : "VRA splits the parcel into 3 intra-field prescription zones. High biomass zones are cut down to 90 kg/ha to avoid lodging while lower vigor spots receive targeted boosts. 8,640 kg of fertilizer saved across the perimeter."}
                </p>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Zone A (Haute Vigueur)</span>
                    <div className="text-sm font-extrabold text-emerald-400 mt-0.5">85 kg/ha (-29%)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Zone B (Normale)</span>
                    <div className="text-sm font-extrabold text-teal-300 mt-0.5">105 kg/ha (-12%)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Zone C (Correction)</span>
                    <div className="text-sm font-extrabold text-amber-400 mt-0.5">125 kg/ha (+4%)</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white">Économie Financière VRA Estimée</span>
                    <p className="text-[11px] text-emerald-300">1 420 $ (~6 390 000 MGA) d’engrais économisés</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
                    -21.4% d’engrais
                  </span>
                </div>
              </div>

              {/* Graphic Mockup Card */}
              <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950 border border-amber-500/30 shadow-inner flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white">Fichiers Machines ISOBUS</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                    .SHP / .KML
                  </span>
                </div>

                <div className="space-y-2 py-2">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-300">Prescription_Alaotra_Urée.shp</span>
                    <span className="text-emerald-400 font-bold">Compatible Trimble</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-300">VRA_Casier_PC15.kml</span>
                    <span className="text-emerald-400 font-bold">Google Earth / Mobile</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-300">Fertilizer_Zoning.geojson</span>
                    <span className="text-emerald-400 font-bold">ISOBUS Terminal</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate ? onNavigate('vra_dashboard') : (isAuthenticated && onGoToDashboard ? onGoToDashboard() : onGoToSignIn())}
                  className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <span>{language === 'fr' ? 'Générer une modulation VRA' : 'Generate VRA Prescription'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {activeSimTab === 'soil' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold">
                    Télémétrie LoRaWAN 868 MHz
                  </span>
                  <span className="text-xs text-slate-400">Station Sonde SP-01 • Casier PC15</span>
                </div>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                  {language === 'fr'
                    ? 'Diagnostic d’Humidité Racinologue Multi-Profondeurs'
                    : 'Multi-Depth Soil Moisture & Root Zone Telemetry'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {language === 'fr'
                    ? "Mesure en temps réel de l'humidité volumique à 3 niveaux clés de la rhizosphère, du potentiel matriciel de succion (kPa) et de la température du sol. Permet de piloter précisément les vannes d'irrigation et d'éviter les assecs précoces du riz SRI."
                    : "Real-time volumetric soil moisture tracking at 3 rhizosphere levels, matric suction potential (kPa), and soil temperature. Enables precise irrigation sluice control and avoids SRI rice moisture stress."}
                </p>

                {/* 3 depths bar gauge */}
                <div className="space-y-3 pt-1">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-1">
                      <span>Profondeur 10 cm (Surface)</span>
                      <span className="text-emerald-400 font-bold">38.4% • Optimal</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '38.4%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-1">
                      <span>Profondeur 30 cm (Cœur Racinologue)</span>
                      <span className="text-emerald-400 font-bold">42.1% • Saturé</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-400 rounded-full" style={{ width: '42.1%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-1">
                      <span>Profondeur 60 cm (Réserve Utile Profonde)</span>
                      <span className="text-emerald-400 font-bold">47.8% • Hydromorphe</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full" style={{ width: '47.8%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Succion Matricielle</span>
                    <div className="text-sm font-extrabold text-emerald-400 mt-0.5">-28 kPa</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Température Sol</span>
                    <div className="text-sm font-extrabold text-white mt-0.5">22.4 °C</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Batterie Solaire</span>
                    <div className="text-sm font-extrabold text-teal-300 mt-0.5">98% (100% Solaire)</div>
                  </div>
                </div>
              </div>

              {/* Graphic Mockup Card */}
              <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950 border border-teal-500/30 shadow-inner flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-teal-400" />
                    <span className="text-xs font-bold text-white">Sonde LoRaWAN SP-01</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                    En ligne • 868 MHz
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Signal radio :</span>
                    <span className="text-emerald-400 font-mono font-bold">-74 dBm (Excellent)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Passerelle :</span>
                    <span className="text-white">Ambatondrazaka Sud (42ms)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Seuil d'irrigation :</span>
                    <span className="text-amber-400 font-bold">32.0%</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate ? onNavigate('soil_sensors') : (isAuthenticated && onGoToDashboard ? onGoToDashboard() : onGoToSignIn())}
                  className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <span>{language === 'fr' ? 'Gérer les sondes de sol' : 'Manage Soil Sensors'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {activeSimTab === 'yield' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold">
                    IA Prédictive des Récoltes
                  </span>
                  <span className="text-xs text-slate-400">Modélisation Degrés-Jours (GDD)</span>
                </div>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                  {language === 'fr'
                    ? 'Projection de Rendement & Valorisation en Francs Malgaches (Ariary)'
                    : 'Harvest Yield Projections & Economic Valuation in Ariary MGA'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {language === 'fr'
                    ? "En combinant l'historique NDVI de la parcelle, les degrés-jours cumulés et l'humidité racinaire, le réseau neuronal AROVOLY projette un rendement de 6.8 t/ha pour le casier PC15 (+4.6% au-dessus de l'objectif initial), valorisé à 114,75 millions d'Ariary."
                    : "Combining historical NDVI trends, growing degree-days, and root moisture, the AROVOLY model projects 6.8 t/ha yield for polder PC15 (+4.6% over baseline), with an estimated harvest value of 114.75M Ariary."}
                </p>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Rendement Projeté</span>
                    <div className="text-base font-extrabold text-emerald-400 mt-0.5">6.80 t/ha</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Production Totale</span>
                    <div className="text-base font-extrabold text-white mt-0.5">51.00 tonnes</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Indice de Confiance</span>
                    <div className="text-base font-extrabold text-cyan-400 mt-0.5">94.2%</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white">Valeur Marchande Estimée</span>
                    <p className="text-base font-extrabold text-emerald-400">114 750 000 MGA (~25 500 $)</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
                    Prix riz paddy : 2 250 MGA / kg
                  </span>
                </div>
              </div>

              {/* Graphic Mockup Card */}
              <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 shadow-inner flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white">Analyse des Scénarios de Récolte</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                    Scénario Optimal
                  </span>
                </div>

                <div className="space-y-2.5 py-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Scénario Optimiste (+10% pluie) :</span>
                    <span className="text-emerald-400 font-bold">7.2 t/ha • 121.5M MGA</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Scénario Central (Référence) :</span>
                    <span className="text-white font-bold">6.8 t/ha • 114.7M MGA</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Scénario Aléa Sécheresse Asara :</span>
                    <span className="text-amber-400 font-bold">5.9 t/ha • 99.5M MGA</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate ? onNavigate('yield_forecast') : (isAuthenticated && onGoToDashboard ? onGoToDashboard() : onGoToSignIn())}
                  className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <span>{language === 'fr' ? 'Consulter les prévisions de récolte' : 'Open Yield Analytics'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section: Platform Presentation & Core Philosophy */}
      <section id="presentation" className="px-4 sm:px-8 lg:px-12 py-16 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Présentation de la Plateforme' : 'Platform Overview'}</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white leading-tight">
              {language === 'fr'
                ? 'Une console agronomique souveraine pensée pour les exploitants et agronomes de terrain'
                : 'A sovereign agronomic console crafted for growers, agronomists, and farm managers'}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {language === 'fr'
                ? "Conçue pour répondre aux défis spécifiques de l'agriculture malgache — sols latéritiques acides de tanety, dérèglements pluviométriques de la mousson « Asara », et éloignement des infrastructures —, AROVOLY centralise l'observation spatiale, la télémétrie de sol sans fil et les outils d'aide à la décision sur une seule et même interface épurée."
                : "Engineered to overcome Madagascar’s unique agricultural constraints — acidic upland tanety soils, delayed monsoon rains, and rural infrastructure limits —, AROVOLY bridges satellite imagery, root telemetry, and precision modulation into one streamlined workspace."}
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {language === 'fr' ? 'Observation Multi-Échelles de la Parcelle' : 'Multi-Scale Field Intelligence'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {language === 'fr'
                      ? 'De la vue macroscopique régionale (Sentinel-2 à 10m) à la mesure microscopique racinaire (sondes capacitives à 10, 30 et 60 cm).'
                      : 'From orbital regional views (Sentinel-2 10m) down to root rhizosphere telemetry (10, 30, and 60 cm depth sensors).'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {language === 'fr' ? 'Zéro Verrouillage Propriétaire' : 'Open Standards & Full Interoperability'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {language === 'fr'
                      ? 'Tous vos polygones de parcelles et cartes de modulation sont téléchargeables immédiatement aux formats Shapefile, KML et GeoJSON.'
                      : 'All parcel boundaries and prescription layers can be instantly downloaded as Shapefile (.SHP), Google Earth (.KML), and GeoJSON.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {language === 'fr' ? 'Économies d’Engrais & Respect des Sols' : 'Fertilizer Savings & Soil Preservation'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {language === 'fr'
                      ? 'Évitez le surdosage d’azote qui acidifie les sols et fragilise les tiges de riz face aux vents cycloniques.'
                      : 'Eliminate excessive nitrogen that acidifies fragile tropical soils and predisposes paddy crops to cyclone lodging.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/10 backdrop-blur-xl shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-emerald-400" />
                  <span className="font-heading font-bold text-sm text-white">
                    {language === 'fr' ? 'Architecture du Système AROVOLY' : 'AROVOLY System Architecture'}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  Temps Réel
                </span>
              </div>

              <div className="space-y-4 pt-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Satellite className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between font-bold text-white">
                      <span>Constellation Sentinel-2 (ESA)</span>
                      <span className="text-emerald-400">10m / 5j</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">Passages spectraux B04, B08, NDVI, NDWI</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between font-bold text-white">
                      <span>Réseau LoRaWAN 868 MHz</span>
                      <span className="text-teal-400">Portée 15 km</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">Sondes sol multi-niveaux 100% solaires autonomes</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between font-bold text-white">
                      <span>Moteur d’IA Agronomique</span>
                      <span className="text-amber-400">Django + React</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">Calculs de modulation VRA & modélisation de rendement</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Tractor className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between font-bold text-white">
                      <span>Tracteurs & Consoles Machines</span>
                      <span className="text-cyan-400">ISOBUS / SHP</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">Épandage précis d’Urée et de Phosphate sur les parcelles</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: How It Works / 4-Step Pipeline */}
      <section id="architecture" className="px-4 sm:px-8 lg:px-12 py-16 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'Fonctionnement Pas-à-Pas' : 'Step-by-Step Pipeline'}</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white">
            {language === 'fr'
              ? 'Comment fonctionne la plateforme AROVOLY ?'
              : 'How does AROVOLY deliver actionable intelligence?'}
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            {language === 'fr'
              ? 'De l’orbite terrestre à la racine de la plante, découvrez le parcours de la donnée.'
              : 'From earth orbit down to the crop roots, discover our telemetry workflow.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-white/10 relative flex flex-col justify-between">
            <div>
              <span className="text-3xl font-extrabold text-emerald-500/30 font-heading">01</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center my-3">
                <Satellite className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-white mb-1.5">
                {language === 'fr' ? 'Acquisition Spatiale' : 'Spaceborne Capture'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'fr'
                  ? 'Sentinel-2 scanne Madagascar tous les 5 jours à 10 m de résolution. La plateforme élimine les nuages et extrait les bandes multispectrales.'
                  : 'Sentinel-2 scans Madagascar every 5 days at 10m resolution. Cloud masking algorithms extract clean multispectral bands.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-bold text-emerald-400">
              Sentinel-2 & Esri Imagery
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-white/10 relative flex flex-col justify-between">
            <div>
              <span className="text-3xl font-extrabold text-teal-500/30 font-heading">02</span>
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center my-3">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-white mb-1.5">
                {language === 'fr' ? 'Sondes Sols LoRaWAN' : 'LoRaWAN Soil Probes'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'fr'
                  ? 'Des sondes solaires autonomes mesurent l’humidité à 10, 30 et 60 cm, la tension d’eau racinaire (kPa) et transmettent en direct.'
                  : 'Solar capacitive probes monitor moisture at 10, 30, and 60 cm, tracking root tension without needing a cellular subscription.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-bold text-teal-400">
              868 MHz • 15 km de portée
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-white/10 relative flex flex-col justify-between">
            <div>
              <span className="text-3xl font-extrabold text-amber-500/30 font-heading">03</span>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center my-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-white mb-1.5">
                {language === 'fr' ? 'Algorithmes Agronomiques' : 'Agronomic Modeling'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'fr'
                  ? 'Calcul automatique du NDVI, des degrés-jours GDD et des alertes de stress hydrique ou azoté pour chaque parcelle.'
                  : 'Automated NDVI calculation, GDD growing degree-days, and early detection of nutrient and water stress anomalies.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-bold text-amber-400">
              Zonage VRA intelligent
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-white/10 relative flex flex-col justify-between">
            <div>
              <span className="text-3xl font-extrabold text-cyan-500/30 font-heading">04</span>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center my-3">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-white mb-1.5">
                {language === 'fr' ? 'Application & Export' : 'Prescription & Exports'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'fr'
                  ? 'Génération de fichiers Shapefile et KML pour consoles John Deere, Trimble ou pulvérisateurs, et prévisions de rendement.'
                  : 'Generation of Shapefiles and KML files for tractor consoles, alongside yield tonnages and revenue estimates in Ariary.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-bold text-cyan-400">
              Shapefile, KML, GeoJSON
            </div>
          </div>
        </div>
      </section>

      {/* Section: Comprehensive Feature Grid */}
      <section id="features" className="px-4 sm:px-8 lg:px-12 py-16 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'Fonctionnalités Complètes' : 'Complete Feature Suite'}</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white">
            {language === 'fr'
              ? 'Toutes les capacités du terminal AROVOLY'
              : 'Every tool you need to manage precision fields'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <Satellite className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-white mb-2">
                {language === 'fr' ? 'Surveillance NDVI & Sentinel-2' : 'NDVI & Sentinel-2 Vigor'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'fr'
                  ? 'Résolution 10 mètres avec carte de fond satellite Esri. Analyse multispectrale pour détecter les zones de chlorose, la vigueur foliaire et les carences.'
                  : '10m spatial resolution paired with Esri basemaps. Multispectral tracking to detect chlorosis, leaf vigor, and early deficiencies.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Calcul NDVI automatique' : 'Automated NDVI calculation'}</span>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-white mb-2">
                {language === 'fr' ? 'Télémétrie Racine IoT LoRaWAN' : 'Root Zone IoT Telemetry'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'fr'
                  ? 'Sondes capacitives mesurant en direct l’humidité à 10, 30 et 60 cm, le potentiel de succion racinaire (kPa) et la salinité du sol.'
                  : 'Multi-depth capacitive probes tracking moisture at 10, 30, and 60 cm, suction potential (kPa), and electrical conductivity.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-teal-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? '3 profondeurs racinaires' : '3 root depths measured'}</span>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-white mb-2">
                {language === 'fr' ? 'Modulation de Dose (VRA)' : 'Variable Rate Modulation (VRA)'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'fr'
                  ? 'Prescription modulée d’urée et de phosphore par zone intra-parcellaire. Évite la verse du riz et compense les pertes nutritives sur tanety.'
                  : 'Intra-field zone prescriptions for urea and phosphate. Prevents lodging in paddy and restores depleted hillside tanety soils.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? '-20% d’engrais épandus' : '20% average input reduction'}</span>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-white mb-2">
                {language === 'fr' ? 'Prévision de Récolte & MGA' : 'Harvest Yield Forecast & MGA'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'fr'
                  ? 'Réseau de neurones calibré sur les degrés-jours cumulés (GDD) avec simulation d’aléas météo et valorisation en Ariary malgache.'
                  : 'Neural network calibrated with Growing Degree-Days (GDD) and simulated monsoon risk scenarios valued in Malagasy Ariary.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-cyan-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? '94.2% de précision IA' : '94.2% model accuracy'}</span>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-white mb-2">
                {language === 'fr' ? 'Traçage & Éditeur Parcellaire' : 'Polygon Boundary Editor'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'fr'
                  ? 'Dessinez directement les contours de vos rizières et tanety au polygone sur fond satellite HD avec calcul automatique de la superficie (ha).'
                  : 'Digitize your paddy basins and upland fields in real-time on HD satellite imagery with automatic hectare calculation.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-purple-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Calcul de superficie instantané' : 'Instant hectare calculation'}</span>
            </div>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <ExternalLink className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-white mb-2">
                {language === 'fr' ? 'Exports Shapefile, KML & GeoJSON' : 'Universal Data Exports'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'fr'
                  ? 'Exportez vos couches SIG pour QGIS, ArcGIS, Google Earth et consoles d’épandeurs de précision John Deere ou Trimble.'
                  : 'Export GIS data for QGIS, ArcGIS, Google Earth, and precision terminal consoles from John Deere and Trimble.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Interopérabilité universelle' : 'Universal interoperability'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section: About AROVOLY (Origin, Mission & Values) */}
      <section id="apropos" className="px-4 sm:px-8 lg:px-12 py-16 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Info className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'À Propos d’AROVOLY' : 'About AROVOLY'}</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white">
              {language === 'fr'
                ? 'Une initiative technologique et agronomique pour la souveraineté de Madagascar'
                : 'A sovereign technology initiative for Madagascar’s agricultural resilience'}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {language === 'fr'
                ? "Le nom AROVOLY provient de la langue malgache : « ARO » signifie Protection et « VOLY » signifie Cultures ou Plantations. Notre ambition est d'armer les coopératives, agronomes régionaux et exploitants agricoles des technologies de télédétection spatiale les plus avancées, sans la dépendance à des logiciels propriétaires coûteux et inadaptés aux réalités locales."
                : "The name AROVOLY originates from the Malagasy language: « ARO » means Protection and « VOLY » stands for Crops or Plantations. Our ambition is to empower cooperatives, regional agronomists, and growers with world-class earth observation telemetry, free from expensive proprietary software that ignores tropical realities."}
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {language === 'fr' ? 'Précision Calibrée aux Sols Tropicaux' : 'Calibrated for Tropical Soils'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {language === 'fr'
                      ? 'Algorithmes calibrés pour les rizières hydromorphes, les sols alluviaux de baiboho et les terres ferrallitiques acides de tanety.'
                      : 'Algorithms tuned specifically for hydromorphic paddies, alluvial riverbeds, and acidic ferrallitic highland soils.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {language === 'fr' ? 'Souveraineté des Données Agricoles' : 'Agricultural Data Sovereignty'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {language === 'fr'
                      ? 'Vos données de parcelles restent votre propriété exclusive. Aucun transfert de données vers des tiers ou des spéculateurs de grains.'
                      : 'Your field geometries and yield data remain strictly your property. No sharing with commodity market speculators.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {language === 'fr' ? 'Co-construction avec les Acteurs Locaux' : 'Co-developed with Local Farmers'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {language === 'fr'
                      ? 'Développé en lien direct avec les agronomes d’Ambatondrazaka, d’Antsirabe et les coopératives rizicoles.'
                      : 'Developed side by side with rice cooperatives and field agronomists across Ambatondrazaka and Antsirabe.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial & Quote Card */}
          <div className="lg:col-span-6 bg-slate-900/80 p-8 rounded-3xl border border-white/10 backdrop-blur-xl relative overflow-hidden shadow-2xl">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl"></div>
            <div className="flex items-center gap-4 mb-6">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
                alt="Dr. Vance"
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/40 shadow-md"
              />
              <div>
                <h4 className="font-heading font-bold text-base text-white">Dr. Éléonore Vance (Andrianina)</h4>
                <p className="text-xs text-emerald-400 font-semibold">Directrice Agronome Régionale • Madagascar</p>
                <p className="text-[11px] text-slate-400">Coordination Lac Alaotra & Vakinankaratra</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
              {language === 'fr'
                ? "« Grâce à AROVOLY, nous avons pour la première fois couplé la télédétection spatiale de nos casiers de riz avec les vannes d’irrigation et les sondes LoRaWAN. En une seule campagne, nous avons économisé plus de 8 600 kg d’engrais tout en sécurisant un rendement record de 6,8 t/ha sur les polders d’Ambatondrazaka. C'est une révolution pour la riziculture malgache. »"
                : "« Thanks to AROVOLY, we connected our paddy polder satellite observations directly to irrigation sluices and LoRaWAN soil moisture probes. In a single harvest season, we saved over 8,600 kg of fertilizer while securing a stellar 6.8 t/ha yield at Ambatondrazaka. A true turning point for Malagasy agriculture. »"}
            </p>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Validation Agronomique Reconnue</span>
              </span>
              <span>Campagne 2025/2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Agricultural Basins of Madagascar */}
      <section id="regions" className="px-4 sm:px-8 lg:px-12 py-16 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'Terroirs Modélisés' : 'Mapped Food Baskets'}</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white">
            {language === 'fr'
              ? 'Déploiement sur les greniers agricoles de la Grande Île'
              : 'Deployed across Madagascar’s premier agricultural basins'}
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            {language === 'fr'
              ? 'Chaque région possède ses caractéristiques pédologiques et ses cultures phares intégrées dans la plateforme.'
              : 'Each terroir features tailored soil profiles and crops modeled within the engine.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Alaotra */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/30 flex flex-col justify-between hover:border-emerald-500/60 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                  Secteur 04 • Alaotra-Mangoro
                </span>
                <span className="text-xs text-slate-400 font-medium">Ambatondrazaka</span>
              </div>
              <h3 className="font-heading font-bold text-lg text-white mb-2">
                {language === 'fr' ? 'Bassin du Lac Alaotra (Casier PC15)' : 'Lake Alaotra Basin (Polder PC15)'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'fr'
                  ? 'Premier grenier à riz de Madagascar. Surveillance des rizières irriguées par le canal PC15 et du Système de Riziculture Intensive (SRI) avec la variété d’exception Vary Makalioka 34.'
                  : 'Madagascar’s primary rice granary. Precision monitoring of canal-irrigated alluvials and SRI (System of Rice Intensification) with premier Vary Makalioka 34 paddy.'}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-white/10 text-xs text-slate-400 flex items-center justify-between">
              <span>{language === 'fr' ? 'Surface : 485 ha modélisés' : 'Area: 485 ha modeled'}</span>
              <span className="text-emerald-400 font-bold">{language === 'fr' ? 'Riz de Luxe' : 'Luxury Rice'}</span>
            </div>
          </div>

          {/* Vakinankaratra */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-orange-500/30 flex flex-col justify-between hover:border-orange-500/60 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold">
                  Secteur 02 • Vakinankaratra
                </span>
                <span className="text-xs text-slate-400 font-medium">Antsirabe / Betafo</span>
              </div>
              <h3 className="font-heading font-bold text-lg text-white mb-2">
                {language === 'fr' ? 'Hauts Plateaux & Tanety' : 'Highlands & Tanety Hills'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'fr'
                  ? 'Terres ferrallitiques d’altitude exposées au lessivage et à l’acidité des sols (pH 5.4). Conduite du maïs hybride IRAT 200 avec apport d’amendement calcaire et urée fractionnée.'
                  : 'High-altitude volcanic and ferrallitic tanety slopes prone to nutrient leaching and low pH. Management of hybrid maize IRAT 200 with liming and split urea doses.'}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-white/10 text-xs text-slate-400 flex items-center justify-between">
              <span>{language === 'fr' ? 'Surface : 310 ha modélisés' : 'Area: 310 ha modeled'}</span>
              <span className="text-orange-400 font-bold">{language === 'fr' ? 'Maïs & Tanety' : 'Maize & Tanety'}</span>
            </div>
          </div>

          {/* Itasy */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-teal-500/30 flex flex-col justify-between hover:border-teal-500/60 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold">
                  Secteur 09 • Itasy
                </span>
                <span className="text-xs text-slate-400 font-medium">Miarinarivo / Ampefy</span>
              </div>
              <h3 className="font-heading font-bold text-lg text-white mb-2">
                {language === 'fr' ? 'Terres Volcaniques du Lac Itasy' : 'Lake Itasy Volcanic Lands'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'fr'
                  ? 'Terroir volcanique d’une fertilité exceptionnelle. Culture intensive de manioc Ampasimbe à forte teneur en fécule, bénéficiant d’une rétention hydrique optimale sur les berges du lac.'
                  : 'Exceptional fertile volcanic soil near Lake Itasy. High-yield production of high-starch Ampasimbe cassava thriving in rich mineral substrates.'}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-white/10 text-xs text-slate-400 flex items-center justify-between">
              <span>{language === 'fr' ? 'Surface : 195 ha modélisés' : 'Area: 195 ha modeled'}</span>
              <span className="text-teal-400 font-bold">{language === 'fr' ? 'Manioc Fécule' : 'Cassava Starch'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Help & FAQ */}
      <section id="faq" className="px-4 sm:px-8 lg:px-12 py-16 max-w-5xl mx-auto border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'Foire Aux Questions' : 'FAQ & Support'}</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white">
            {language === 'fr' ? 'Questions Fréquentes' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            {language === 'fr'
              ? 'Toutes les réponses pour bien démarrer et comprendre la technologie AROVOLY.'
              : 'Everything you need to know about getting started and our agronomic telemetry.'}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                >
                  <span className="font-heading font-bold text-sm text-white">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-emerald-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Section: Contact & Deployment Request Form */}
      <section id="contact" className="px-4 sm:px-8 lg:px-12 py-16 max-w-5xl mx-auto border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Mail className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'Contact & Déploiement' : 'Contact & Deployment'}</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white">
            {language === 'fr'
              ? 'Demander un déploiement sur votre exploitation'
              : 'Request a deployment for your agricultural estate'}
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            {language === 'fr'
              ? 'Nos agronomes et spécialistes SIG vous accompagnent pour cartographier vos casiers et installer des sondes LoRaWAN.'
              : 'Our agronomists and GIS engineers assist you with parcel digitization and IoT probe setups.'}
          </p>
        </div>

        <div className="bg-slate-900/80 rounded-3xl border border-white/15 p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
          {contactSubmitted ? (
            <div className="p-8 text-center flex flex-col items-center justify-center gap-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center ring-2 ring-emerald-400">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-extrabold text-xl text-white">
                {language === 'fr' ? 'Demande bien enregistrée !' : 'Request Received!'}
              </h3>
              <p className="text-sm text-slate-300 max-w-md">
                {language === 'fr'
                  ? 'Merci ! Notre équipe de coordination agronomique AROVOLY à Madagascar vous contactera sous 24h ouvrées.'
                  : 'Thank you! The AROVOLY Madagascar agronomy coordination team will contact you within 24 business hours.'}
              </p>
              <button
                onClick={() => setContactSubmitted(false)}
                className="mt-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 underline"
              >
                {language === 'fr' ? 'Envoyer un autre message' : 'Send another inquiry'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {language === 'fr' ? 'Nom et Prénom *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder={language === 'fr' ? 'Dr. Éléonore Vance' : 'Full Name'}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {language === 'fr' ? 'Email Professionnel *' : 'Work Email *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="contact@exploitation.mg"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {language === 'fr' ? 'Nom de l’Exploitation / Organisation' : 'Farm / Organization Name'}
                  </label>
                  <input
                    type="text"
                    value={contactForm.organization}
                    onChange={(e) => setContactForm({ ...contactForm, organization: e.target.value })}
                    placeholder={language === 'fr' ? 'Coopérative Rizicole Alaotra' : 'Farm Cooperative'}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {language === 'fr' ? 'Région / Bassin Agricole' : 'Target Agricultural Basin'}
                  </label>
                  <select
                    value={contactForm.region}
                    onChange={(e) => setContactForm({ ...contactForm, region: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
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
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
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
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <span className="text-[11px] text-slate-400">
                  {language === 'fr'
                    ? 'Support technique direct : support@arovoly.mg • Antananarivo & Ambatondrazaka'
                    : 'Direct technical contact: support@arovoly.mg • Antananarivo & Ambatondrazaka'}
                </span>

                <button
                  type="submit"
                  className="w-full sm:w-auto py-3 px-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-glow-emerald flex items-center justify-center gap-2 transition-all transform hover:scale-105"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === 'fr' ? 'Envoyer la Demande' : 'Submit Deployment Request'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="border-t border-white/10 bg-slate-950/90 px-4 sm:px-8 lg:px-12 py-12 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2 cursor-pointer" onClick={scrollToTop}>
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                🌱
              </div>
              <span className="font-heading font-extrabold text-white text-base">
                ARO<span className="text-emerald-400">VOLY</span>
              </span>
              <span className="text-[10px] text-slate-400">v3.4 Madagascar</span>
            </div>
            <p className="text-xs text-slate-400 text-center md:text-left max-w-sm">
              {language === 'fr'
                ? "Plateforme d’observation spatiale Sentinel-2, d’analyse NDVI et de diagnostic de sol IoT pour l'agriculture de précision à Madagascar."
                : "Sentinel-2 spatial observation, NDVI vegetation analytics, and IoT root telemetry for precision agriculture across Madagascar."}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <a href="#presentation" className="hover:text-emerald-400 transition-colors">
              {language === 'fr' ? 'Présentation' : 'Overview'}
            </a>
            <a href="#architecture" className="hover:text-emerald-400 transition-colors">
              {language === 'fr' ? 'Fonctionnement' : 'Pipeline'}
            </a>
            <a href="#features" className="hover:text-emerald-400 transition-colors">
              {language === 'fr' ? 'Fonctionnalités' : 'Features'}
            </a>
            <a href="#apropos" className="hover:text-emerald-400 transition-colors">
              {language === 'fr' ? 'À propos' : 'About'}
            </a>
            <a href="#regions" className="hover:text-emerald-400 transition-colors">
              {language === 'fr' ? 'Terroirs' : 'Regions'}
            </a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">
              {language === 'fr' ? 'FAQ' : 'Help'}
            </a>
            <button
              onClick={onGoToSignIn}
              className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
            >
              {language === 'fr' ? 'Connexion Terminal' : 'Terminal Login'}
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2025-2026 AROVOLY Precision Agriculture Inc. • Madagascar. Tous droits réservés.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Système 100% Opérationnel</span>
            </span>
            <span>Flux Sentinel-2 (ESA) & Esri World Imagery</span>
          </div>
        </div>
      </footer>

      {/* Floating Scroll-to-Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-slate-900/90 hover:bg-emerald-600 border border-white/20 text-white shadow-2xl transition-all transform hover:scale-110 active:scale-95"
          title={language === 'fr' ? 'Retour en haut de page' : 'Back to top'}
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
