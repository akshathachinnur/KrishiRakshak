import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { FarmerDashboard } from './components/FarmerDashboard';
import { PathologyScanner } from './components/PathologyScanner';
import { FarmMap } from './components/FarmMap';
import { DiseaseHotspotMap } from './components/DiseaseHotspotMap';
import { CropAndFertilizerHub } from './components/CropAndFertilizerHub';
import { MandiAndWeatherHub } from './components/MandiAndWeatherHub';
import { FarmerChatBot } from './components/FarmerChatBot';
import { FarmerSchemesAndHelp } from './components/FarmerSchemesAndHelp';
import { FarmRecordsVault } from './components/FarmRecordsVault';
import { FarmerCommunity } from './components/FarmerCommunity';
import { AgriBlogs } from './components/AgriBlogs';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import {
  auth,
  subscribeToDiagnoses,
  saveDiagnosisToCloud,
  subscribeToCropPlans,
  subscribeToDiseaseReports,
  subscribeToFarmProfile,
  saveFarmProfileToCloud,
} from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  DiagnosisRecord,
  CropPlanRecord,
  SoilMetrics,
  AppLanguage,
  DiseaseReport,
  FarmProfile,
} from './types';
import {
  DEFAULT_TEST_FARM,
  INITIAL_DEMO_REPORTS,
  calculateHaversineDistance,
  DISEASE_ALERT_RADIUS_KM,
} from './lib/geoUtils';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedDialect, setSelectedDialect] = useState<AppLanguage>('hi');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [diagnoses, setDiagnoses] = useState<DiagnosisRecord[]>([]);
  const [cropPlans, setCropPlans] = useState<CropPlanRecord[]>([]);
  const [diseaseReports, setDiseaseReports] = useState<DiseaseReport[]>(INITIAL_DEMO_REPORTS);
  const [farmProfile, setFarmProfile] = useState<FarmProfile | null>(DEFAULT_TEST_FARM);
  const [currentSoilContext, setCurrentSoilContext] = useState<SoilMetrics | undefined>(undefined);
  const [currentDiseaseContext, setCurrentDiseaseContext] = useState<string | undefined>(undefined);

  // Subscribe to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to real-time global disease reports (surveillance stream)
  useEffect(() => {
    const unsubReports = subscribeToDiseaseReports((reports) => {
      setDiseaseReports(reports);
    });
    return () => unsubReports();
  }, []);

  // Subscribe to user farm profile & digital diary synchronization
  useEffect(() => {
    if (!currentUser) {
      // Check local storage for farm profile fallback
      const savedLocal = localStorage.getItem('krishi_farm_profile_guest');
      if (savedLocal) {
        try {
          setFarmProfile(JSON.parse(savedLocal));
        } catch (_) {}
      } else {
        setFarmProfile(DEFAULT_TEST_FARM);
      }

      // Check local storage for saved diagnoses or fallback to initial baseline
      const savedDiagnoses = localStorage.getItem('krishi_diagnoses_history');
      if (savedDiagnoses) {
        try {
          const parsed = JSON.parse(savedDiagnoses);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setDiagnoses(parsed);
          } else {
            setDiagnoses([
              {
                id: 'demo-1',
                userId: 'demo',
                cropName: 'Tomato (Solanum lycopersicum)',
                diseaseName: 'Tomato Early Blight',
                scientificName: 'Alternaria solani',
                confidence: 98.4,
                status: 'critical',
                description: 'Concentric brown rings on lower foliage. High probability of plant defoliation.',
                organicTreatment: 'Neem oil extract (Azadirachtin 10000 ppm) at 3ml/L.',
                chemicalTreatment: 'Mancozeb 75% WP @ 2.0g per liter water.',
                timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
                fieldName: 'FIELD-001 - North Plot #2',
                imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHA5hDg4kKTUoiO7YUBekluLFNURfuGvZ_Ik82Ww7PWcg4tZDXwD0xBw-fJzlqWz1yXulmd9X4_38FlcSQiBYtBcetxYUiuSlVr5KYHLHlq3DTmBALkFw_fCC_w5YYkBpBYxE-ySh7_sWauJ_Vc_ATD0T2__CNDZYemsWSI5KJbMDTzlgZdA502V8KzcUebmFtlYXLFWHYfOmKSY2X-rEm_t4IR6NL7z1nA1hI5AMVZ6eCk9gzQV5D',
                foliarLesionPercent: 97.4
              }
            ]);
          }
        } catch (_) {
          setDiagnoses([
            {
              id: 'demo-1',
              userId: 'demo',
              cropName: 'Tomato (Solanum lycopersicum)',
              diseaseName: 'Tomato Early Blight',
              scientificName: 'Alternaria solani',
              confidence: 98.4,
              status: 'critical',
              description: 'Concentric brown rings on lower foliage. High probability of plant defoliation.',
              organicTreatment: 'Neem oil extract (Azadirachtin 10000 ppm) at 3ml/L.',
              chemicalTreatment: 'Mancozeb 75% WP @ 2.0g per liter water.',
              timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
              fieldName: 'FIELD-001 - North Plot #2',
              imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHA5hDg4kKTUoiO7YUBekluLFNURfuGvZ_Ik82Ww7PWcg4tZDXwD0xBw-fJzlqWz1yXulmd9X4_38FlcSQiBYtBcetxYUiuSlVr5KYHLHlq3DTmBALkFw_fCC_w5YYkBpBYxE-ySh7_sWauJ_Vc_ATD0T2__CNDZYemsWSI5KJbMDTzlgZdA502V8KzcUebmFtlYXLFWHYfOmKSY2X-rEm_t4IR6NL7z1nA1hI5AMVZ6eCk9gzQV5D',
              foliarLesionPercent: 97.4
            }
          ]);
        }
      } else {
        setDiagnoses([
          {
            id: 'demo-1',
            userId: 'demo',
            cropName: 'Tomato (Solanum lycopersicum)',
            diseaseName: 'Tomato Early Blight',
            scientificName: 'Alternaria solani',
            confidence: 98.4,
            status: 'critical',
            description: 'Concentric brown rings on lower foliage. High probability of plant defoliation.',
            organicTreatment: 'Neem oil extract (Azadirachtin 10000 ppm) at 3ml/L.',
            chemicalTreatment: 'Mancozeb 75% WP @ 2.0g per liter water.',
            timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
            fieldName: 'FIELD-001 - North Plot #2',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHA5hDg4kKTUoiO7YUBekluLFNURfuGvZ_Ik82Ww7PWcg4tZDXwD0xBw-fJzlqWz1yXulmd9X4_38FlcSQiBYtBcetxYUiuSlVr5KYHLHlq3DTmBALkFw_fCC_w5YYkBpBYxE-ySh7_sWauJ_Vc_ATD0T2__CNDZYemsWSI5KJbMDTzlgZdA502V8KzcUebmFtlYXLFWHYfOmKSY2X-rEm_t4IR6NL7z1nA1hI5AMVZ6eCk9gzQV5D',
            foliarLesionPercent: 97.4
          }
        ]);
      }
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

    const unsubFarm = subscribeToFarmProfile(currentUser.uid, (profile) => {
      if (profile) {
        setFarmProfile(profile);
      }
    });

    return () => {
      unsubDiagnoses();
      unsubPlans();
      unsubFarm();
    };
  }, [currentUser]);

  // Calculate nearby threats within 5 km of farmer's registered farm
  const nearbyAlertsCount = useMemo(() => {
    const activeFarmCoords = farmProfile || DEFAULT_TEST_FARM;
    return diseaseReports.filter(report => {
      if (typeof report.latitude !== 'number' || typeof report.longitude !== 'number') return false;
      const distance = calculateHaversineDistance(
        activeFarmCoords.latitude,
        activeFarmCoords.longitude,
        report.latitude,
        report.longitude
      );
      return distance <= DISEASE_ALERT_RADIUS_KM;
    }).length;
  }, [diseaseReports, farmProfile]);

  const handleUpdateFarmProfile = (newProfile: FarmProfile) => {
    setFarmProfile(newProfile);
    if (!currentUser) {
      localStorage.setItem('krishi_farm_profile_guest', JSON.stringify(newProfile));
    }
  };

  const handleAskKisanAI = (crop: string, metrics: SoilMetrics) => {
    setCurrentSoilContext(metrics);
    setCurrentDiseaseContext(crop);
    setActiveTab('chatbot');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRecordDiagnosis = (record: DiagnosisRecord) => {
    setDiagnoses((prev) => {
      // Remove any record with identical id or identical timestamp
      const filtered = prev.filter(r => r.id !== record.id && r.timestamp !== record.timestamp);
      const updated = [record, ...filtered];
      if (!currentUser) {
        localStorage.setItem('krishi_diagnoses_history', JSON.stringify(updated));
      }
      return updated;
    });

    if (currentUser) {
      saveDiagnosisToCloud(currentUser.uid, {
        userId: currentUser.uid,
        cropName: record.cropName,
        diseaseName: record.diseaseName,
        scientificName: record.scientificName,
        confidence: record.confidence,
        status: record.status,
        description: record.description,
        organicTreatment: record.organicTreatment,
        chemicalTreatment: record.chemicalTreatment,
        imageUrl: record.imageUrl,
        fieldName: record.fieldName,
        foliarLesionPercent: record.foliarLesionPercent,
      }).catch((err) => console.warn('Cloud sync diagnosis error:', err));
    }
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#0f172a] dark:bg-[#0c1510] dark:text-[#dae5dc] transition-colors duration-200">
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        selectedDialect={selectedDialect}
        setSelectedDialect={setSelectedDialect}
        diagnosesCount={diagnoses.length}
        nearbyAlertsCount={nearbyAlertsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 pt-28 sm:pt-32">
        {/* 1. Farmer Home Dashboard */}
        {activeTab === 'overview' && (
          <div className="pt-2 pb-12">
            <FarmerDashboard
              selectedDialect={selectedDialect}
              onNavigate={handleNavigate}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              currentUser={currentUser}
              farmProfile={farmProfile}
              diseaseReports={diseaseReports}
            />
          </div>
        )}

        {/* 2. Plant Doctor (Pathology Vision) — PRIMARY CROP SCAN TAB */}
        {activeTab === 'scanner' && (
          <div className="pt-4 pb-12">
            <PathologyScanner
              currentUser={currentUser}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              selectedDialect={selectedDialect}
              setSelectedDialect={setSelectedDialect}
              onDiagnosisSaved={() => handleNavigate('vault')}
              farmProfile={farmProfile}
              diagnosesHistory={diagnoses}
              onRecordDiagnosis={handleRecordDiagnosis}
            />
          </div>
        )}

        {/* 2b. Interactive Farm Map */}
        {activeTab === 'map' && (
          <div className="pt-4 pb-12">
            <FarmMap farmProfile={farmProfile} />
          </div>
        )}

        {/* 3. Disease Hotspot Map & 5 KM Radar */}
        {activeTab === 'hotspot-map' && (
          <div className="pt-4 pb-12">
            <DiseaseHotspotMap
              currentUser={currentUser}
              farmProfile={farmProfile}
              diseaseReports={diseaseReports}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onUpdateFarmProfile={handleUpdateFarmProfile}
              onNavigateToScanner={() => handleNavigate('scanner')}
            />
          </div>
        )}

        {/* 4. Crop & Fertilizer Unified Hub */}
        {activeTab === 'crop-fertilizer' && (
          <div className="pt-4 pb-12">
            <CropAndFertilizerHub
              currentUser={currentUser}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onAskKisanAI={handleAskKisanAI}
              selectedDialect={selectedDialect}
            />
          </div>
        )}

        {/* 5. Mandi & Weather Unified Hub */}
        {activeTab === 'mandi-weather' && (
          <div className="pt-4 pb-12">
            <MandiAndWeatherHub
              selectedDialect={selectedDialect}
            />
          </div>
        )}

        {/* 6. Kisan AI Voice & Chatbot */}
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

        {/* 7. Farmer Chaupal (Peer Community) */}
        {activeTab === 'community' && (
          <div className="pt-4 pb-12">
            <FarmerCommunity />
          </div>
        )}

        {/* 8. Agri Advisory Blogs */}
        {activeTab === 'blogs' && (
          <div className="pt-4 pb-12">
            <AgriBlogs />
          </div>
        )}

        {/* 9. Government Schemes & Subsidies */}
        {activeTab === 'schemes' && (
          <div className="pt-4 pb-12">
            <FarmerSchemesAndHelp />
          </div>
        )}

        {/* 10. Farm Vault (Digital Diary) */}
        {activeTab === 'vault' && (
          <div className="pt-4 pb-12">
            <FarmRecordsVault
              currentUser={currentUser}
              diagnoses={diagnoses}
              cropPlans={cropPlans}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onNavigateToScanner={() => handleNavigate('scanner')}
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

