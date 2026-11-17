import React, { useMemo, useState } from 'react';
import { UserProfile } from '../../types';
import { useTranslation } from '../../i18n/LanguageContext';
import { api } from '../../services/api';
import { BrandLogo } from '../common/BrandLogo';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  Leaf,
  Mail,
  Map,
  Radar,
  Satellite,
  ShieldCheck,
} from 'lucide-react';

interface SignUpViewProps {
  onSignUpSuccess: (user: UserProfile) => void;
  onGoToSignIn: () => void;
  onGoToLanding?: () => void;
}

type ProfileType = 'agronomist' | 'producer' | 'ngo';

const aerialImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB8wzW56G0JgCqkXGRZGlXYr96qlfB9osgkOmst_L3pXlB3rgxm8FUsYUJbSJ-BSCXSOAt7Tg_Y7CYipoIqc_0yVtUWf56O7gP-rEMkTKdkIe8zCsvbr0L94_ngOfqbemlvudq_Cl4d8AfJ0ZOKVJHs_eubc8kb0kTlmZE97vCsPzxzZeoWpI3p8bXI64nGeXvgcW2OraybsAWIu4PtAaWr4yiLv7jFzY5jfm8gfXM';
const satellitePreview =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD16861yNVR3h53VQ9bTBfRA4c_UhTNSD2d2VMEfiWapXHWZx3rYCQzDr2rGJY0i12drhKbR3xEAMv8bNrNwQJU8KWGfunorMpUBiJ-sVmmWFzJR8yIUTXt2XDJmd8HZoYQthEdXINXrjFS-Dh5Ty07n9jAye3TEKNlNCcv7-jhdbgoaACYH1xVhLaQn4J2fjpmQBG62Fy6TGfgxcs1RbDUO_rCdrD1zvMbr3O3sZo';

export const SignUpView: React.FC<SignUpViewProps> = ({
  onSignUpSuccess,
  onGoToSignIn,
  onGoToLanding,
}) => {
  const { language, toggleLanguage } = useTranslation();
  const [profileType, setProfileType] = useState<ProfileType>('agronomist');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('');
  const [surface, setSurface] = useState('50 — 500 Hectares');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const strength = useMemo(() => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError(null);
    try {
      const role =
        profileType === 'agronomist'
          ? 'Agronome / R&D'
          : profileType === 'producer'
            ? 'Exploitant / Coop'
            : 'Institution / ONG';
      const user = await api.register({
        name: `${firstName} ${lastName}`.trim(),
        email,
        password,
        role,
        region: region || 'Madagascar',
      });
      setSubmitted(true);
      onSignUpSuccess(user);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Inscription impossible.");
    }
  };

  const fieldClass =
    'mt-1 w-full rounded-lg bg-[#f0eee8] px-4 py-2.5 text-sm text-[#1c1c18] outline-none transition focus:bg-white focus:ring-2 focus:ring-[#76c043]';

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-x-hidden overflow-y-auto bg-[#fcf9f3] p-3 pt-20 font-sans text-[#1c1c18] sm:p-6 sm:pt-20 lg:p-10">
      <div className="fixed inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: `url("${aerialImage}")` }} />
      <div className="fixed inset-0 -z-10 bg-[#fcf9f3]/75 backdrop-blur-[16px]" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#fcf9f3]/40 via-[#fcf9f3]/80 to-[#fcf9f3]" />
      <div className="fixed inset-0 -z-10 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#316b00 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="fixed left-4 top-4 z-20">
        <button onClick={onGoToLanding || onGoToSignIn} className="flex items-center gap-2 rounded-full bg-[#fcf9f3]/90 px-4 py-2 text-xs font-bold shadow backdrop-blur-xl transition hover:text-[#316b00]">
          <ArrowLeft className="h-4 w-4 text-[#316b00]" />
          <BrandLogo compact />
          <span>{onGoToLanding ? 'Accueil' : 'Connexion'}</span>
        </button>
      </div>
      <div className="fixed right-4 top-4 z-20 flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-full bg-[#fcf9f3]/90 px-4 py-2 font-mono text-[10px] font-semibold tracking-wider shadow backdrop-blur-xl sm:flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#76c043]" /> TÉLÉMÉTRIE ACTIVE
        </div>
        <button onClick={toggleLanguage} className="rounded-full bg-[#fcf9f3]/90 px-3 py-2 text-xs font-bold uppercase shadow backdrop-blur-xl">{language} <ChevronDown className="ml-1 inline h-3 w-3" /></button>
      </div>

      <div className="signin-content relative z-10 grid w-full max-w-7xl grid-cols-1 items-start gap-6 pb-20 lg:gap-8 lg:py-10">
        <section className="flex flex-col gap-5 lg:col-span-5">
          <div className="flex flex-col gap-2">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#fcf9f3]/90 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[#316b00] shadow">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#76c043]" /> Passage Orbital S2-B // 09:42 UTC
            </span>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">Initialisez votre surveillance agronomique de précision.</h1>
            <p className="text-base leading-relaxed text-[#414939]">Rejoignez plus de 1 200 agronomes, coopératives vivrières et chercheurs surveillant les parcelles de Madagascar.</p>
          </div>
          <div className="rounded-2xl bg-[#fcf9f3]/85 p-5 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-sm font-bold"><Radar className="h-5 w-5 text-[#316b00]" /> Couverture Multispectrale Sentinel</span>
              <span className="rounded-full bg-[#c3ecd2] px-2 py-1 font-mono text-[10px] text-[#2a4e3b]">10m RES</span>
            </div>
            <div className="relative mt-3 h-32 overflow-hidden rounded-xl bg-cover bg-center" style={{ backgroundImage: `url("${satellitePreview}")` }}>
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#1c1c18]/80 to-transparent p-3 text-white">
                <div><span className="font-mono text-[10px] opacity-80">BASSIN D'ALAOTRA-MANGORO</span><strong className="block text-lg">NDVI Moyen : 0.81</strong></div>
                <span className="ml-auto rounded-full bg-[#76c043]/90 px-2 py-1 text-xs font-bold text-[#204b00]">+4.2%</span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                ['Humidité Sol', '34.8%', 'Idéal'],
                ['Stress Hydrique', '0.12', 'Bas'],
                ['Canopée (LAI)', '4.6', 'Vigoureux'],
              ].map(([label, value, status]) => (
                <div key={label} className="rounded-lg bg-[#f0eee8]/80 p-2"><span className="block text-[10px] text-[#717a68]">{label}</span><strong className="text-lg">{value}</strong><span className="block text-[10px] font-bold text-[#316b00]">{status}</span></div>
              ))}
            </div>
            <div className="mt-4 space-y-2 text-xs text-[#414939]">
              {['Essai pilote 30 jours sans engagement technique', 'Compatibilité passerelles LoRaWAN & NB-IoT locales', 'Cadastre parcellaire conforme aux directives du MAEP'].map((item) => <div key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#316b00]" />{item}</div>)}
            </div>
          </div>
          <div className="rounded-xl bg-[#fcf9f3]/60 p-4 text-xs italic text-[#414939] shadow backdrop-blur-md">“AROVOLY a permis à notre union rizicole d'anticiper la sécheresse de 18 jours dans le Vakinankaratra.”<strong className="mt-1 block not-italic text-[#316b00]">Dr. Mialy Razafindrakoto — Chercheur Cirad / FOFIFA</strong></div>
        </section>

        <section className="relative rounded-2xl bg-[#fcf9f3]/95 p-5 shadow-2xl backdrop-blur-2xl sm:p-7 lg:col-span-7 lg:p-8">
          <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#316b00]"><Map className="h-4 w-4" /> Nouveau Déploiement Parcellaire</div><h2 className="mt-1 text-2xl font-bold">Créer votre terminal d'exploitation</h2></div>
            <span className="self-start rounded-full bg-[#ebe8e2] px-3 py-1 font-mono text-[10px] text-[#717a68]">PASSEUR // V4.1</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {authError && <div className="rounded-lg border border-[#f0aaa5] bg-[#ffe1df] p-3 text-xs font-semibold text-[#ba1a1a]" role="alert">{authError}</div>}
            <fieldset>
              <legend className="mb-1 text-sm font-semibold">Type d'Accréditation</legend>
              <div className="grid grid-cols-3 gap-1 rounded-xl bg-[#ebe8e2] p-1">
                {([
                  ['agronomist', 'Agronome / R&D'],
                  ['producer', 'Exploitant / Coop'],
                  ['ngo', 'Institution / ONG'],
                ] as const).map(([value, label]) => (
                  <label key={value} className={`cursor-pointer rounded-lg px-1 py-2 text-center text-[10px] font-semibold transition sm:px-2 sm:text-xs ${profileType === value ? 'bg-white shadow-sm' : 'text-[#717a68]'}`}>
                    <input type="radio" name="profileType" value={value} checked={profileType === value} onChange={() => setProfileType(value)} className="sr-only" />{label}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="text-xs font-semibold">Prénom<input required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="ex. Andry" className={fieldClass} /></label>
              <label className="text-xs font-semibold">Nom de famille<input required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="ex. Randrianasolo" className={fieldClass} /></label>
            </div>
            <label className="block text-xs font-semibold">Courriel d'exploitation ou institutionnel<span className="relative block"><Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#52634a]" /><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contact.agronome@coop-terroirs.mg" className={`${fieldClass} pl-11`} /></span></label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="text-xs font-semibold">Bassin Hydro-Agricole<select required value={region} onChange={(e) => setRegion(e.target.value)} className={fieldClass}><option value="">Sélectionner la région cible</option><option>Alaotra-Mangoro</option><option>Vakinankaratra</option><option>Boeny</option><option>Menabe</option><option>Itasy</option></select></label>
              <label className="text-xs font-semibold">Superficie Parcellaire Estimée<select value={surface} onChange={(e) => setSurface(e.target.value)} className={fieldClass}><option>&lt; 50 Hectares</option><option>50 — 500 Hectares</option><option>500 — 2 500 Hectares</option><option>&gt; 2 500 Hectares</option></select></label>
            </div>
            <label className="block text-xs font-semibold">Mot de passe d'authentification chiffrée<span className="relative block"><input required minLength={8} type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 caractères, un symbole & chiffre" className={`${fieldClass} pr-12`} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#52634a]" aria-label="Afficher ou masquer le mot de passe">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></span><span className="mt-2 grid grid-cols-4 gap-1">{[0, 1, 2, 3].map((meter) => <span key={meter} className={`h-1.5 rounded-full ${strength > meter ? strength === 1 ? 'bg-[#ba1a1a]' : 'bg-[#76c043]' : 'bg-[#ebe8e2]'}`} />)}</span></label>
            <label className="flex items-start gap-2 text-xs leading-relaxed text-[#414939]"><input required type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-1 h-4 w-4 accent-[#316b00]" /><span>J'approuve les conditions d'exploitation des flux orbitaux Sentinel et la <a href="#ethics" className="font-semibold underline">charte éthique de souveraineté des données agronomiques</a> de Madagascar.</span></label>
            <div className="flex flex-col items-center justify-between gap-3 pt-1 sm:flex-row">
              <button type="submit" className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#76c043] px-5 py-3 text-sm font-bold text-[#204b00] shadow-lg transition hover:bg-[#316b00] hover:text-white sm:w-auto"><span>{submitted ? 'Espace initialisé' : 'Initialiser mon espace de télémétrie'}</span><ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" /></button>
              <button type="button" onClick={onGoToSignIn} className="text-xs text-[#414939] hover:text-[#316b00]"><span>Déjà déployé ? </span><strong className="underline">Se connecter au terminal</strong></button>
            </div>
            {submitted && <div className="flex items-center gap-2 rounded-lg bg-[#c3ecd2] p-3 text-xs text-[#2a4e3b]"><ShieldCheck className="h-5 w-5 text-[#316b00]" /> Attribution du node spectral en cours... Redirection vers la cartographie parcellaire.</div>}
          </form>
        </section>
      </div>

      <div className="fixed bottom-4 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-[#fcf9f3]/90 px-4 py-2 text-xs shadow backdrop-blur-xl sm:flex"><Satellite className="h-4 w-4 text-[#316b00]" /><strong>Sentinel S2-B</strong><span className="opacity-40">//</span><span>Sécurité &amp; Support</span></div>
    </main>
  );
};
