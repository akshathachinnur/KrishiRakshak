import React, { useState } from 'react';
import { 
  Cloud, 
  Trash2, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Leaf,
  Layers,
  Database,
  ExternalLink
} from 'lucide-react';
import { DiagnosisRecord, CropPlanRecord } from '../types';
import { deleteDiagnosisRecord } from '../lib/firebase';

interface FarmRecordsVaultProps {
  currentUser: any;
  diagnoses: DiagnosisRecord[];
  cropPlans: CropPlanRecord[];
  onOpenAuth: () => void;
  onNavigateToScanner: () => void;
}

export const FarmRecordsVault: React.FC<FarmRecordsVaultProps> = ({
  currentUser,
  diagnoses,
  cropPlans,
  onOpenAuth,
  onNavigateToScanner,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'diagnoses' | 'plans'>('diagnoses');
  const [filter, setFilter] = useState<'all' | 'critical' | 'optimal'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id?: string) => {
    if (!id || !currentUser) return;
    try {
      setDeletingId(id);
      await deleteDiagnosisRecord(currentUser.uid, id);
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredDiagnoses = diagnoses.filter(d => {
    if (filter === 'all') return true;
    return d.status === filter;
  });

  return (
    <section id="farm-vault" className="w-full bg-[#0c1510] py-16 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-[#222c26]">
          <div className="max-w-2xl flex flex-col gap-2">
            <span className="font-space text-xs font-bold text-[#5bf06c] uppercase tracking-widest flex items-center gap-1.5">
              <Database className="w-4 h-4 text-[#5bf06c]" />
              My Farm Notebook
            </span>
            <h2 className="font-space text-3xl sm:text-4xl font-bold text-[#dae5dc] tracking-tight">
              Saved Leaf Scans &amp; Crop Plans
            </h2>
            <p className="text-sm text-[#bccbb6] leading-relaxed">
              Your saved crop checks, recommended medicine spray amounts, and seasonal planting plans safely preserved for your field records.
            </p>
          </div>

          {/* Sync Status Badge */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#141e18] border border-[#2d3731] text-xs text-[#5bf06c]">
                <span className="w-2 h-2 rounded-full bg-[#5bf06c] animate-pulse"></span>
                <span>Saved &amp; Synced Safely</span>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-2xl bg-[#5bf06c] text-[#00390c] text-xs font-bold shadow hover:brightness-110 transition-all"
              >
                Sign In to Save Your Farm History
              </button>
            )}
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-[#141e18] border border-[#222c26]">
            <button
              onClick={() => setActiveSubTab('diagnoses')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === 'diagnoses'
                  ? 'bg-[#5bf06c] text-[#00390c]'
                  : 'text-[#bccbb6] hover:text-[#dae5dc]'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              <span>Pathology Records ({diagnoses.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('plans')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === 'plans'
                  ? 'bg-[#5bf06c] text-[#00390c]'
                  : 'text-[#bccbb6] hover:text-[#dae5dc]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Soil &amp; Crop Plans ({cropPlans.length})</span>
            </button>
          </div>

          {activeSubTab === 'diagnoses' && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#869582]">Filter:</span>
              {(['all', 'critical', 'optimal'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                    filter === f
                      ? 'bg-[#222c26] text-[#5bf06c] border-[#5bf06c]/40'
                      : 'bg-[#141e18] text-[#bccbb6] border-[#222c26]'
                  }`}
                >
                  {f === 'all' ? 'All' : f === 'critical' ? 'Blight / Critical' : 'Healthy'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content: Diagnoses List */}
        {activeSubTab === 'diagnoses' && (
          <div className="flex flex-col gap-4">
            {filteredDiagnoses.length === 0 ? (
              <div className="p-12 rounded-3xl bg-[#141e18] border border-[#222c26] text-center flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#222c26] text-[#869582] flex items-center justify-center">
                  <Leaf className="w-7 h-7" />
                </div>
                <div className="flex flex-col gap-1 max-w-sm">
                  <h4 className="font-space text-lg font-bold text-[#dae5dc]">
                    No Cloud Records Found
                  </h4>
                  <p className="text-xs text-[#bccbb6]">
                    Run a disease scan in the Pathology Vision module and click "Save to Cloud Vault" to persist field logs.
                  </p>
                </div>
                <button
                  onClick={onNavigateToScanner}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-[#5bf06c] text-[#00390c] text-xs font-bold shadow hover:brightness-110 transition-all"
                >
                  Open Pathology Vision Scanner
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredDiagnoses.map((record) => (
                  <div
                    key={record.id}
                    className="p-5 rounded-3xl bg-[#141e18] border border-[#2d3731] hover:border-[#3d4a3b] shadow-xl flex flex-col justify-between gap-4 transition-all group"
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {record.imageUrl && (
                          <img
                            src={record.imageUrl}
                            alt={record.cropName}
                            className="w-12 h-12 rounded-xl object-cover border border-[#222c26]"
                          />
                        )}
                        <div>
                          <span className="text-[10px] text-[#869582] uppercase tracking-wider font-space block">
                            {record.cropName}
                          </span>
                          <h4 className="font-space text-base font-bold text-[#dae5dc]">
                            {record.diseaseName}
                          </h4>
                          <span className="text-[11px] italic text-[#bccbb6] block">
                            {record.scientificName}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-space uppercase border ${
                          record.status === 'optimal'
                            ? 'bg-[#5bf06c]/20 text-[#5bf06c] border-[#5bf06c]/30'
                            : 'bg-[#93000a]/20 text-[#ffb4ab] border-[#ffb4ab]/30'
                        }`}
                      >
                        {record.status}
                      </span>
                    </div>

                    {/* Treatments */}
                    <div className="p-3 rounded-2xl bg-[#18221c] text-xs text-[#bccbb6] flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-[#dae5dc] font-semibold text-[11px]">
                        <span>Prescribed Treatment:</span>
                        <span className="text-[#5bf06c] font-mono">{record.confidence}% Conf.</span>
                      </div>
                      <p className="line-clamp-2">
                        {record.chemicalTreatment || record.organicTreatment || record.description}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#222c26] text-xs text-[#869582]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(record.timestamp).toLocaleDateString()} {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>

                      {currentUser && record.id && (
                        <button
                          onClick={() => handleDelete(record.id)}
                          disabled={deletingId === record.id}
                          className="text-[#869582] hover:text-[#ffb4ab] transition-colors p-1 rounded-lg"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content: Crop Plans List */}
        {activeSubTab === 'plans' && (
          <div className="flex flex-col gap-4">
            {cropPlans.length === 0 ? (
              <div className="p-12 rounded-3xl bg-[#141e18] border border-[#222c26] text-center flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#222c26] text-[#869582] flex items-center justify-center">
                  <Layers className="w-7 h-7" />
                </div>
                <div className="flex flex-col gap-1 max-w-sm">
                  <h4 className="font-space text-lg font-bold text-[#dae5dc]">
                    No Crop Plans Saved Yet
                  </h4>
                  <p className="text-xs text-[#bccbb6]">
                    Simulate your field's NPK and climate telemetry in the Agronomic ML section and save the tailored crop recommendation.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {cropPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="p-5 rounded-3xl bg-[#141e18] border border-[#2d3731] hover:border-[#3d4a3b] shadow-xl flex flex-col justify-between gap-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] text-[#5bf06c] font-space uppercase tracking-wider block">
                          {plan.regionPreset || 'Field Soil Test'}
                        </span>
                        <h4 className="font-space text-xl font-bold text-[#dae5dc]">
                          {plan.cropName}
                        </h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-[#5bf06c]/15 text-[#5bf06c] text-xs font-bold">
                        {plan.netMargin}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#18221c] text-xs text-center">
                      <div>
                        <span className="text-[10px] text-[#869582] block">Nitrogen</span>
                        <span className="font-bold text-[#dae5dc]">{plan.metrics.nitrogen} N</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#869582] block">Phosphorus</span>
                        <span className="font-bold text-[#dae5dc]">{plan.metrics.phosphorus} P</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#869582] block">Potassium</span>
                        <span className="font-bold text-[#dae5dc]">{plan.metrics.potassium} K</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#869582] pt-2 border-t border-[#222c26]">
                      <span>Yield Est: <strong className="text-[#dae5dc]">{plan.yieldEstimate}</strong></span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(plan.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
