import React, { useState, useEffect } from 'react';
import { ViewType, UserProfile, Parcel, SensorProbe } from './types';
import { MOCK_PARCELS, MOCK_SENSORS } from './data/mockData';
import { api } from './services/api';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { ExportModal } from './components/common/ExportModal';
import { Toast } from './components/common/Toast';
import { SignInView } from './components/views/SignInView';
import { SignUpView } from './components/views/SignUpView';
import { LandingView } from './components/views/LandingView';
import { MyFieldsView } from './components/views/MyFieldsView';
import { CropTracingView } from './components/views/CropTracingView';
import { VraDashboardView } from './components/views/VraDashboardView';
import { SoilSensorsView } from './components/views/SoilSensorsView';
import { YieldForecastView } from './components/views/YieldForecastView';

export function App() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (!localStorage.getItem('arovoly_token')) return null;
    const saved = localStorage.getItem('arovoly_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [currentView, setCurrentView] = useState<ViewType>(() => {
    return localStorage.getItem('arovoly_user') && localStorage.getItem('arovoly_token') ? 'my_fields' : 'landing';
  });
  const [parcels, setParcels] = useState<Parcel[]>(MOCK_PARCELS);
  const [selectedParcelId, setSelectedParcelId] = useState<string>(MOCK_PARCELS[0]?.id || '402-alaotra');
  const [sensors, setSensors] = useState<SensorProbe[]>(MOCK_SENSORS);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSignOutNotice, setIsSignOutNotice] = useState(false);

  const selectedParcel = parcels.find((p) => p.id === selectedParcelId) || parcels[0];

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 4000);
  };

  const handleSignIn = (signedInUser: UserProfile) => {
    setUser(signedInUser);
    localStorage.setItem('arovoly_user', JSON.stringify(signedInUser));
    setIsSignOutNotice(false);
    setCurrentView('my_fields');
    showToast(`Bienvenue sur le terminal AROVOLY Madagascar, ${signedInUser.name}`);
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('arovoly_user');
    localStorage.removeItem('arovoly_token');
    setIsSignOutNotice(true);
    setCurrentView('landing');
    showToast('Session fermée avec succès.');
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [apiParcels, apiSensors] = await Promise.all([
          api.getParcels(),
          api.getSensors(),
        ]);
        if (apiParcels) {
          setParcels(apiParcels);
          setSelectedParcelId((prev) =>
            apiParcels.some((p) => p.id === prev) ? prev : apiParcels[0]?.id || ''
          );
        }
        if (apiSensors && apiSensors.length > 0) {
          setSensors(apiSensors);
        }
      } catch (err) {
        console.warn('API sync warning:', err);
      }
    }
    loadData();
  }, []);

  const handleDeploySensor = async (newSensor: SensorProbe) => {
    setSensors((prev) => [newSensor, ...prev]);
    try {
      await api.deploySensor(newSensor);
    } catch (err) {
      console.warn('Failed to persist sensor:', err);
    }
  };

  const handleSaveParcel = async (newParcel: Parcel) => {
    setParcels((prev) => [newParcel, ...prev]);
    setSelectedParcelId(newParcel.id);
    try {
      await api.createParcel(newParcel);
    } catch (err) {
      console.warn('Failed to persist parcel:', err);
    }
  };

  const handleUpdateParcel = async (updatedParcel: Parcel) => {
    setParcels((prev) => prev.map((parcel) => (parcel.id === updatedParcel.id ? updatedParcel : parcel)));
    try {
      const persistedParcel = await api.updateParcel(updatedParcel.id, updatedParcel);
      if (persistedParcel) {
        setParcels((prev) => prev.map((parcel) => (parcel.id === updatedParcel.id ? persistedParcel : parcel)));
      }
    } catch (err) {
      console.warn('Failed to update parcel on backend:', err);
    }
  };

  const handleDeleteParcel = async (parcelId: string) => {
    setParcels((prev) => prev.filter((p) => p.id !== parcelId));
    showToast('Parcelle supprimée du registre.');
    try {
      await api.deleteParcel(parcelId);
    } catch (err) {
      console.warn('Failed to delete parcel on backend:', err);
    }
  };

  // 1. Landing / Presentation page (accessible to all visitors and users)
  if (currentView === 'landing') {
    return (
      <>
        <LandingView
          onGoToSignIn={() => setCurrentView('sign_in')}
          onGoToDashboard={() => setCurrentView(user ? 'my_fields' : 'sign_in')}
          onQuickDemo={() => setCurrentView('sign_in')}
          isAuthenticated={!!user}
          userName={user?.name}
          userRole={user?.role}
          onSignOut={handleSignOut}
          onNavigate={(view: ViewType) => {
            if (['my_fields', 'crop_tracing', 'vra_dashboard', 'soil_sensors', 'yield_forecast'].includes(view) && !user) {
              setCurrentView('sign_in');
              return;
            }
            setCurrentView(view);
          }}
        />
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      </>
    );
  }

  if (currentView === 'sign_up') {
    return (
      <>
        <SignUpView
          onSignUpSuccess={handleSignIn}
          onGoToSignIn={() => setCurrentView('sign_in')}
          onGoToLanding={() => setCurrentView('landing')}
        />
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      </>
    );
  }

  // 2. If on Sign-In screen or unauthenticated, show full-screen sign-in view
  if (currentView === 'sign_in' || !user) {
    return (
      <>
        <SignInView
          onSignInSuccess={handleSignIn}
          onGoToLanding={() => setCurrentView('landing')}
          onGoToSignUp={() => setCurrentView('sign_up')}
          isSignOutNotice={isSignOutNotice}
        />
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      </>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#fcf9f3] text-[#1c1c18] font-sans">
      {/* Top Header */}
      <Header
        user={user}
        currentView={currentView}
        onNavigate={setCurrentView}
        onSignOut={handleSignOut}
      />

      {/* Main Body with Sidebar + View */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentView={currentView}
          onNavigate={setCurrentView}
          onOpenReportModal={() => setIsExportModalOpen(true)}
        />

        <main className="flex-1 flex flex-col overflow-hidden relative pb-20 md:pb-0">
          {currentView === 'my_fields' && (
            <MyFieldsView
              parcels={parcels}
              selectedParcelId={selectedParcelId}
              onSelectParcel={setSelectedParcelId}
              onNavigate={setCurrentView}
              sensors={sensors}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onShowToast={showToast}
            />
          )}

          {currentView === 'crop_tracing' && (
            <CropTracingView
              parcels={parcels}
              onSaveParcel={handleSaveParcel}
              onUpdateParcel={handleUpdateParcel}
              onDeleteParcel={handleDeleteParcel}
              onShowToast={showToast}
              onOpenExportModal={() => setIsExportModalOpen(true)}
            />
          )}

          {currentView === 'vra_dashboard' && (
            <VraDashboardView
              parcels={parcels}
              selectedParcelId={selectedParcelId}
              onSelectParcel={setSelectedParcelId}
              sensors={sensors}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onShowToast={showToast}
            />
          )}

          {currentView === 'soil_sensors' && (
            <SoilSensorsView
              sensors={sensors}
              parcels={parcels}
              onDeploySensor={handleDeploySensor}
              onShowToast={showToast}
            />
          )}

          {currentView === 'yield_forecast' && (
            <YieldForecastView
              parcels={parcels}
              selectedParcelId={selectedParcelId}
              onSelectParcel={setSelectedParcelId}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Export & Report Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        selectedParcel={selectedParcel}
        onSuccess={showToast}
      />

      {/* Floating Notifications */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}

export default App;
