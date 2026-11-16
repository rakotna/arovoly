import React, { useState, useEffect } from 'react';
import { ViewType, UserProfile, Parcel, SensorProbe } from './types';
import { INITIAL_USER, MOCK_PARCELS, MOCK_SENSORS } from './data/mockData';
import { api } from './services/api';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { ExportModal } from './components/common/ExportModal';
import { Toast } from './components/common/Toast';
import { SignInView } from './components/views/SignInView';
import { MyFieldsView } from './components/views/MyFieldsView';
import { CropTracingView } from './components/views/CropTracingView';
import { VraDashboardView } from './components/views/VraDashboardView';
import { SoilSensorsView } from './components/views/SoilSensorsView';
import { YieldForecastView } from './components/views/YieldForecastView';

export function App() {
  const [currentView, setCurrentView] = useState<ViewType>('my_fields');
  const [user, setUser] = useState<UserProfile | null>(INITIAL_USER);
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
    setIsSignOutNotice(false);
    setCurrentView('my_fields');
    showToast(`Bienvenue sur le terminal AgroField Madagascar, ${signedInUser.name}`);
  };

  const handleSignOut = () => {
    setUser(null);
    setIsSignOutNotice(true);
    setCurrentView('sign_in');
    showToast('Session fermée avec succès.');
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [apiParcels, apiSensors] = await Promise.all([
          api.getParcels(),
          api.getSensors(),
        ]);
        if (apiParcels && apiParcels.length > 0) {
          setParcels(apiParcels);
          setSelectedParcelId((prev) =>
            apiParcels.some((p) => p.id === prev) ? prev : apiParcels[0].id
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

  const handleDeleteParcel = async (parcelId: string) => {
    setParcels((prev) => prev.filter((p) => p.id !== parcelId));
    showToast('Parcelle supprimée du registre.');
    try {
      await api.deleteParcel(parcelId);
    } catch (err) {
      console.warn('Failed to delete parcel on backend:', err);
    }
  };

  // If on Sign-In screen, show full-screen sign-in view
  if (currentView === 'sign_in') {
    return (
      <>
        <SignInView
          onSignInSuccess={handleSignIn}
          isSignOutNotice={isSignOutNotice}
        />
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      </>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#faf8ff] text-[#0f172a] font-sans">
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

        <main className="flex-1 flex flex-col overflow-hidden relative">
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
