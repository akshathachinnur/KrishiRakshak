import React from 'react';
import { PhoneCall, GitBranch, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#07100b] border-t border-[#18221c] py-14 px-4 sm:px-6 lg:px-12 text-[#869582] text-xs">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <img
                alt="KrishiRakshak Brand Logo"
                className="h-7 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1X3NLjsN4hPWJcRgYI7-FL3W-SBk_iWWZ1rlKEIsPMMCt4JJQi0Rugsbx8JmUqyRpv7-q2Dh0LTfRnCfoZrKGV3PGVO4cHxNpgdTEsk56384uk1vmMMwr7NvhEl799nkEKEbNnDAVri44bD9UbRYGczgC2o7mGtG-IkWjAuElipZxDj9vszwCCG0F2VLw4aYwR_Sa8ooJNQ0KmpFib9LLR9arPDu9Cvrq02-_tzSrDx12bp8WmMakNNUZo"
              />
              <span className="font-space text-base font-bold text-[#dae5dc]">
                KrishiRakshak • Precision Bio-AI
              </span>
            </div>
            <p className="text-xs text-[#bccbb6] max-w-sm leading-relaxed">
              Empowering Indian farmers with instant crop disease detection, organic remedies, today's Mandi market rates, and local voice assistance in regional languages.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-[#5bf06c]">
              <ShieldCheck className="w-4 h-4" />
              <span>Aligned with ICAR &amp; Ministry of Agriculture Guidelines</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 flex flex-col gap-2.5">
            <span className="font-space text-xs font-bold uppercase tracking-wider text-[#dae5dc]">
              Emergency Farm Helpline
            </span>
            <a
              href="tel:18001801551"
              className="hover:text-[#5bf06c] transition-colors flex items-center gap-2"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#ffcb87]" />
              <span>Kisan Call Center: <strong>1800-180-1551</strong> (24/7 Toll-Free)</span>
            </a>
            <span className="text-[11px]">Free agriculture doctor telephone advice in your local language</span>
          </div>

          {/* Project Info */}
          <div className="md:col-span-4 flex flex-col gap-2.5">
            <span className="font-space text-xs font-bold uppercase tracking-wider text-[#dae5dc]">
              Farmer Welfare &amp; Community
            </span>
            <a
              href="https://github.com/akshathachinnur/KrishiRakshak"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#dae5dc] hover:text-[#5bf06c] transition-colors flex items-center gap-2"
            >
              <GitBranch className="w-4 h-4 text-[#5bf06c]" />
              <span>KrishiRakshak Open Agricultural Project</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <span className="text-[11px]">
              Designed to work smoothly even on low-speed 2G/3G mobile networks in remote villages.
            </span>
          </div>
        </div>

        <div className="pt-6 border-t border-[#18221c] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <span>© 2026 KrishiRakshak Systems. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Engineered with <Heart className="w-3 h-3 text-[#5bf06c] fill-[#5bf06c]" /> for Indian Farmers
          </span>
        </div>
      </div>
    </footer>
  );
};
