import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProblemAndPipeline } from './components/ProblemAndPipeline';
import { PathologyScanner } from './components/PathologyScanner';
import { CropRecommendationML } from './components/CropRecommendationML';
import { AgriTelemetryAndMandi } from './components/AgriTelemetryAndMandi';
import { FarmerChatBot } from './components/FarmerChatBot';
import { FarmerSchemesAndHelp } from './components/FarmerSchemesAndHelp';
import { FarmRecordsVault } from './components/FarmRecordsVault';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { auth, subscribeToDiagnoses, subscribeToCropPlans } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { DiagnosisRecord, CropPlanRecord, SoilMetrics, AppLanguage } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedDialect, setSelectedDialect] = useState<AppLanguage>('hi');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [diagnoses, setDiagnoses] = useState<DiagnosisRecord[]>([]);
  const [cropPlans, setCropPlans] = useState<CropPlanRecord[]>([]);
  const [currentSoilContext, setCurrentSoilContext] = useState<SoilMetrics | undefined>(undefined);
  const [currentDiseaseContext, setCurrentDiseaseContext] = useState<string | undefined>(undefined);

  // Subscribe to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to real-time Firestore database synchronization when user changes
  useEffect(() => {
    if (!currentUser) {
      // Seed default sample records for immediate farmer preview if not logged in
      setDiagnoses([
        {
          id: 'demo-1',
          userId: 'demo',
          cropName: 'Tomato (Solanum lycopersicum)',
          diseaseName: 'Tomato Early Blight',
          scientificName: 'Alternaria solani',
          confidence: 98.4,
          status: 'critical',
          description: 'Concentric brown rings on lower foliage. High probability of leaf defoliation.',
          organicTreatment: 'Neem oil extract (Azadirachtin 10000 ppm) at 3ml/L.',
          chemicalTreatment: 'Mancozeb 75% WP @ 2.0g per liter water.',
          timestamp: Date.now() - 1000 * 60 * 60 * 3,
          fieldName: 'North Plot #2',
          imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHA5hDg4kKTUoiO7YUBekluLFNURfuGvZ_Ik82Ww7PWcg4tZDXwD0xBw-fJzlqWz1yXulmd9X4_38FlcSQiBYtBcetxYUiuSlVr5KYHLHlq3DTmBALkFw_fCC_w5YYkBpBYxE-ySh7_sWauJ_Vc_ATD0T2__CNDZYemsWSI5KJbMDTzlgZdA502V8KzcUebmFtlYXLFWHYfOmKSY2X-rEm_t4IR6NL7z1nA1hI5AMVZ6eCk9gzQV5D'
        }
      ]);
      setCropPlans([
        {
          id: 'demo-plan-1',
          userId: 'demo',
          cropName: 'Rice (Paddy)',
          metrics: {
            nitrogen: 90,
            phosphorus: 42,
            potassium: 43,
            ph: 6.5,
            temperature: 24.5,
            humidity: 82,
            rainfall: 210,
          },
          yieldEstimate: '4.8 MT / ha',
          netMargin: '₹44,500 / acre',
          timestamp: Date.now() - 1000 * 60 * 60 * 24,
          regionPreset: 'Bengal Delta Paddy Formulation'
        }
      ]);
      return;
    }

    // Live Real-Time Firestore subscription for logged-in user
    const unsubDiagnoses = subscribeToDiagnoses(currentUser.uid, (records) => {
      setDiagnoses(records);
    });

    const unsubPlans = subscribeToCropPlans(currentUser.uid, (plans) => {
      setCropPlans(plans);
    });

    return () => {
      unsubDiagnoses();
      unsubPlans();
    };
  }, [currentUser]);

  const handleAskKisanAI = (crop: string, metrics: SoilMetrics) => {
    setCurrentSoilContext(metrics);
    setCurrentDiseaseContext(crop);
    setActiveTab('chatbot');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#0f172a] dark:bg-[#0c1510] dark:text-[#dae5dc] transition-colors duration-200">
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        selectedDialect={selectedDialect}
        setSelectedDialect={setSelectedDialect}
        diagnosesCount={diagnoses.length}
      />

      {/* Main Views Container */}
      <main className="flex-1 pt-16">
        {/* Full Platform Overview Screen */}
        {activeTab === 'overview' && (
          <div>
            <HeroSection
              onLaunchDiagnostic={() => {
                setActiveTab('scanner');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSimulateML={() => {
                setActiveTab('crop-ml');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            <ProblemAndPipeline />
            <PathologyScanner
              currentUser={currentUser}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              selectedDialect={selectedDialect}
              setSelectedDialect={setSelectedDialect}
              onDiagnosisSaved={() => {}}
            />
            <CropRecommendationML
              currentUser={currentUser}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onAskKisanAI={handleAskKisanAI}
            />
            <AgriTelemetryAndMandi />
            <FarmerChatBot
              selectedDialect={selectedDialect}
              setSelectedDialect={setSelectedDialect}
              soilContext={currentSoilContext}
              diagnosedDiseaseContext={currentDiseaseContext}
            />
            <FarmerSchemesAndHelp />
          </div>
        )}

        {/* Dedicated Pathology Vision Screen */}
        {activeTab === 'scanner' && (
          <div className="pt-4 pb-12">
            <PathologyScanner
              currentUser={currentUser}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              selectedDialect={selectedDialect}
              setSelectedDialect={setSelectedDialect}
              onDiagnosisSaved={() => setActiveTab('vault')}
            />
          </div>
        )}

        {/* Dedicated Agronomic ML Screen */}
        {activeTab === 'crop-ml' && (
          <div className="pt-4 pb-12">
            <CropRecommendationML
              currentUser={currentUser}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onAskKisanAI={handleAskKisanAI}
            />
          </div>
        )}

        {/* Dedicated Telemetry Suite Screen */}
        {activeTab === 'telemetry' && (
          <div className="pt-4 pb-12">
            <AgriTelemetryAndMandi />
          </div>
        )}

        {/* Dedicated Kisan AI Chatbot Screen */}
        {activeTab === 'chatbot' && (
          <div className="pt-4 pb-12">
            <FarmerChatBot
              selectedDialect={selectedDialect}
              setSelectedDialect={setSelectedDialect}
              soilContext={currentSoilContext}
              diagnosedDiseaseContext={currentDiseaseContext}
            />
          </div>
        )}

        {/* Dedicated Farmer Schemes & Help Screen */}
        {activeTab === 'schemes' && (
          <div className="pt-4 pb-12">
            <FarmerSchemesAndHelp />
          </div>
        )}

        {/* Dedicated Farm Vault Screen (Real-Time Firestore Sync) */}
        {activeTab === 'vault' && (
          <div className="pt-4 pb-12">
            <FarmRecordsVault
              currentUser={currentUser}
              diagnoses={diagnoses}
              cropPlans={cropPlans}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onNavigateToScanner={() => setActiveTab('scanner')}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
      />
    </div>
  );
}
