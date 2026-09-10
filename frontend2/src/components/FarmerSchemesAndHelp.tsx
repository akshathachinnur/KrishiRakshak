import React, { useState } from 'react';
import { 
  PhoneCall, 
  ShieldCheck, 
  HelpCircle, 
  FileCheck, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Droplets,
  Sun,
  Award,
  BookOpen,
  Wheat
} from 'lucide-react';

export const FarmerSchemesAndHelp: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const schemes = [
    {
      title: 'PM-Kisan Samman Nidhi',
      benefit: '₹6,000 / year direct cash transfer',
      description: 'Central government income support for all landholding farmers. Delivered in 3 equal installments of ₹2,000 directly into Aadhaar-linked bank accounts.',
      eligibility: 'All small & marginal landholder farmer families',
      actionUrl: 'https://pmkisan.gov.in',
      tag: 'Direct Financial Aid'
    },
    {
      title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      benefit: 'Comprehensive Crop Insurance Protection',
      description: 'Financial support against crop loss caused by unseasonal rains, drought, flood, hailstorms, and severe pest or fungal attacks at a nominal premium rate of 1.5% to 2%.',
      eligibility: 'All farmers growing notified food grains, oilseeds, & commercial crops',
      actionUrl: 'https://pmfby.gov.in',
      tag: 'Crop Loss Insurance'
    },
    {
      title: 'Soil Health Card Scheme (SHC)',
      benefit: 'Free Soil Testing & Fertilizer Prescription',
      description: 'Issued by Ministry of Agriculture every 2 years. Analyzes 12 soil parameters (N, P, K, pH, Zinc, Organic Carbon) to help you save money on excess chemical fertilizers.',
      eligibility: 'Available for every farm plot across India through local KVK',
      actionUrl: 'https://soilhealth.dac.gov.in',
      tag: 'Free Soil Test'
    },
    {
      title: 'Kisan Credit Card (KCC)',
      benefit: 'Low-Interest Loans at 4% Effective Rate',
      description: 'Affordable institutional credit up to ₹3,00,000 for purchasing seeds, organic fertilizers, diesel, pesticides, and post-harvest maintenance expenses without high interest money-lenders.',
      eligibility: 'Individual/joint farmers, tenant farmers, & self-help groups',
      actionUrl: 'https://www.myscheme.gov.in/schemes/kcc',
      tag: 'Subsidized Credit'
    }
  ];

  const practicalTips = [
    {
      icon: Sun,
      title: 'Best Spraying Time',
      tip: 'Always spray foliar medicines and neem extracts in the early morning (before 9:00 AM) or late afternoon (after 4:30 PM). Hot noon sun evaporates the medicine too quickly and can scorch tender foliage.'
    },
    {
      icon: Droplets,
      title: 'Water Quality Matters',
      tip: 'Always use clean borewell or tap water when mixing biocides and fungicides. Muddy or stagnant pond water contains alkaline salts and dirt that deactivate chemical and biological sprays by up to 40%.'
    },
    {
      icon: ShieldCheck,
      title: 'Farmer Safety First',
      tip: 'Always wear a protective cloth mask or bandana and gloves when spraying. Never spray against the wind direction. Wash hands, arms, and face thoroughly with soap immediately after spraying.'
    },
    {
      icon: Wheat,
      title: 'Balanced Fertilization',
      tip: 'Do not rely only on Urea (Nitrogen). Excessive Urea makes crops tender and highly vulnerable to fungal blasts and insect borers. Always balance with Potash (K) and composted cow dung manure.'
    }
  ];

  const faqs = [
    {
      q: 'How do I take a good photo of a diseased leaf?',
      a: 'Hold the camera steady in daylight (avoid direct blinding sun). Focus closely on the leaf showing yellow spots, brown patches, or curled edges so the symptom is clear and sharp.'
    },
    {
      q: 'What should I do if a disease is diagnosed as Critical or Severe?',
      a: 'First, isolate and remove badly infected fallen leaves so spores do not blow to healthy plants. Then apply the recommended biological or chemical spray immediately. For free expert confirmation, call 1800-180-1551.'
    },
    {
      q: 'Are the organic remedies safe for vegetable and fruit crops?',
      a: 'Yes! Neem oil (Azadirachtin), fermented butter-milk (chaas), and Trichoderma bio-fungicide leave zero harmful chemical residues and are safe for harvest within 2-3 days.'
    },
    {
      q: 'Is this application completely free to use?',
      a: 'Yes, KrishiRakshak is 100% free for all Indian farmers, gardeners, and agriculture students with no subscription fees or hidden costs.'
    }
  ];

  return (
    <section id="schemes-and-help" className="w-full bg-[#07100b] py-16 px-4 sm:px-6 lg:px-12 border-t border-[#18221c]">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-[#222c26]">
          <div className="max-w-2xl flex flex-col gap-2">
            <span className="font-space text-xs font-bold text-[#5bf06c] uppercase tracking-widest flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#5bf06c]" />
              Government Schemes &amp; Farmer Welfare
            </span>
            <h2 className="font-space text-3xl sm:text-4xl font-bold text-[#dae5dc] tracking-tight">
              Farmer Assistance &amp; Practical Advice
            </h2>
            <p className="text-sm text-[#bccbb6] leading-relaxed">
              Explore official central government support schemes, free farmer toll-free helplines, and golden guidelines for healthy, disease-free crops.
            </p>
          </div>

          {/* Quick Call Helpline Button */}
          <a
            href="tel:18001801551"
            className="h-12 px-6 rounded-2xl bg-[#5bf06c] text-[#00390c] font-space text-sm font-bold flex items-center gap-2.5 shadow-[0_0_20px_rgba(91,240,108,0.3)] hover:brightness-110 active:scale-95 transition-all self-start md:self-auto"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call Kisan Helpline: 1800-180-1551</span>
          </a>
        </div>

        {/* 24/7 Helpline Banner Card */}
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#142319] via-[#121c16] to-[#18261e] border border-[#2d3731] shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#5bf06c]/20 text-[#5bf06c] border border-[#5bf06c]/40 flex items-center justify-center shrink-0">
              <PhoneCall className="w-7 h-7" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h3 className="font-space text-xl font-bold text-[#dae5dc]">
                  Kisan Call Center (किसान कॉल सेंटर)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#5bf06c]/20 text-[#5bf06c] text-[10px] font-bold uppercase border border-[#5bf06c]/30">
                  Toll-Free 24x7
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#bccbb6] max-w-2xl leading-relaxed">
                Need immediate phone consultation with an agricultural scientist? Call <strong className="text-[#5bf06c]">1800-180-1551</strong> from any mobile or landline. Free telephone support available 6:00 AM to 10:00 PM in Hindi, Kannada, Telugu, Tamil, Marathi, Punjabi, Bengali, and 15 other languages.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:18001801551"
              className="px-5 py-3 rounded-2xl bg-[#222c26] hover:bg-[#2d3731] text-[#dae5dc] border border-[#3d4a3b] text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <span>Dial 1800-180-1551</span>
            </a>
          </div>
        </div>

        {/* Top 4 Government Schemes Grid */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-space text-lg font-bold text-[#dae5dc] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#5bf06c]" />
              Major Government Farmer Welfare Schemes
            </h3>
            <span className="text-xs text-[#869582]">Verified Official Portals</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {schemes.map((scheme, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[#141e18] border border-[#222c26] hover:border-[#3d4a3b] transition-all flex flex-col justify-between gap-5"
              >
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-space text-lg font-bold text-[#dae5dc]">
                      {scheme.title}
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#5bf06c]/15 text-[#5bf06c] text-[10px] font-bold uppercase tracking-wider border border-[#5bf06c]/30 shrink-0">
                      {scheme.tag}
                    </span>
                  </div>

                  <span className="text-sm font-semibold text-[#83da84]">
                    {scheme.benefit}
                  </span>

                  <p className="text-xs text-[#bccbb6] leading-relaxed">
                    {scheme.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#222c26] flex items-center justify-between text-xs">
                  <span className="text-[#869582] text-[11px]">
                    Eligibility: <strong className="text-[#bccbb6]">{scheme.eligibility}</strong>
                  </span>
                  <a
                    href={scheme.actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#5bf06c] hover:underline font-semibold flex items-center gap-1 shrink-0 ml-2"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Practical Farming Golden Rules */}
        <div className="flex flex-col gap-4 pt-2">
          <h3 className="font-space text-lg font-bold text-[#dae5dc] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#5bf06c]" />
            Practical Tips for Everyday Farmers
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {practicalTips.map((tip, idx) => {
              const IconComp = tip.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#141e18] border border-[#222c26] flex flex-col gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#5bf06c]/15 text-[#5bf06c] flex items-center justify-center">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h4 className="font-space text-base font-bold text-[#dae5dc]">
                    {tip.title}
                  </h4>
                  <p className="text-xs text-[#bccbb6] leading-relaxed">
                    {tip.tip}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="p-6 md:p-8 rounded-3xl bg-[#141e18] border border-[#222c26] flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#5bf06c]" />
            <h3 className="font-space text-lg font-bold text-[#dae5dc]">
              Frequently Asked Questions (FAQ)
            </h3>
          </div>

          <div className="flex flex-col divide-y divide-[#222c26]">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="py-3.5 first:pt-0 last:pb-0">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left flex items-center justify-between gap-4 text-sm font-semibold text-[#dae5dc] hover:text-[#5bf06c] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="text-lg font-mono text-[#5bf06c]">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <p className="mt-2 text-xs text-[#bccbb6] leading-relaxed">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
