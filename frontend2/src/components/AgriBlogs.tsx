import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Tag,
  Clock,
  User,
  Share2,
  Bookmark,
  Sparkles,
  ArrowRight,
  X,
  ThumbsUp,
  Calendar,
  CheckCircle,
  Leaf
} from 'lucide-react';
import { BlogPost } from '../types';

const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Monsoon-Ready Soil Management: 5 Essential Pre-Rain Checks',
    excerpt: 'Simple proactive checks to preserve soil microbiology, avoid waterlogging, and calibrate nitrogen levels before heavy monsoon showers.',
    cover: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2050&auto=format&fit=crop',
    category: 'Soil Health',
    author: {
      name: 'Dr. Arvind Sharma (ICAR)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
    date: '2025-08-14',
    minutes: 4,
    tags: ['monsoon', 'soil', 'drainage', 'organic'],
    content: `Effective monsoon preparation protects topsoil from erosion and optimizes nutrient availability throughout the Kharif season.

### 1. Dig Boundary Drainage Trenches
Water stagnation suffocates root zones, especially in black cotton and heavy clay soils. Construct peripheral channels with a 1-2% gradient to safely evacuate storm surges into farm ponds.

### 2. Check Soil pH and Apply Gypsum or Lime Early
Acidic soils benefit from agricultural lime 3-4 weeks prior to intense rain. For saline or sodic soils, gypsum application improves flocculation, allowing rainwater to penetrate deeper.

### 3. Incorporate Green Manure (Dhaincha / Sunn Hemp)
Turn in 45-day-old green manure crops 10 days before primary sowing. The decomposition rapidly releases organic carbon and elevates the soil's water retention capacity.

### 4. Nitrogen Split-Dosing Strategy
Never apply full basal nitrogen when continuous heavy downpours are forecast. Split applications into 3 installments (basal, tillering, and panicle initiation) to reduce leaching losses.

### 5. Biological Seed Inoculation
Treat seeds with Trichoderma viride and Rhizobium/Azotobacter to form a protective biofilm around germinating radicles against damping-off fungi.`
  },
  {
    id: 'blog-2',
    title: 'Drip Irrigation Economics: Upfront Capital vs 3-Year Crop Yields',
    excerpt: 'Detailed cost-benefit analysis of micro-irrigation systems for cotton, chilli, and sugarcane with subsidy reimbursement workflows.',
    cover: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=2050&auto=format&fit=crop',
    category: 'Irrigation',
    author: {
      name: 'Krishi Lab Agronomists',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    },
    date: '2025-07-28',
    minutes: 5,
    tags: ['water', 'drip', 'fertigation', 'subsidies'],
    content: `Water scarcity is reshaping agriculture across peninsular and western India. Switching from flood irrigation to pressure-compensated drip tubing yields immediate dividends.

### Water Conservation Metrics
- Flood irrigation efficiency: 35% - 40%
- Inline Drip irrigation efficiency: 85% - 92%
- Fertigation efficiency improvement: 30% reduction in commercial fertilizer requirement.

### Payback Timeline
Smallholders cultivating high-value horticulture (pomegranate, tomato, capsicum) typically break even within 1.2 crop cycles. For field crops like cotton and maize, payback averages 2.1 seasons under the Pradhan Mantri Krishi Sinchayee Yojana (PMKSY) 55% subsidy slab.`
  },
  {
    id: 'blog-3',
    title: 'Natural Integrated Pest Management (IPM) That Actually Works',
    excerpt: 'Combining neem kernel extract, pheromone lure traps, and border barrier crops to suppress bollworms and whiteflies without toxic chemicals.',
    cover: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=2050&auto=format&fit=crop',
    category: 'Pest Management',
    author: {
      name: 'Suresh Patil (Progressive Farmer)',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
    date: '2025-06-19',
    minutes: 4,
    tags: ['IPM', 'neem', 'traps', 'biological'],
    content: `Repeated calendar-based spraying of broad-spectrum synthetic pyrethroids has created severe pest resurgence and eliminated beneficial predators like ladybird beetles.

### 3 Pillars of Field IPM:
1. **Pheromone Traps**: Install 5 funnel traps per acre at crop canopy level. 8-10 moths captured in 3 consecutive nights signals the exact window for bio-spray intervention.
2. **Neem Seed Kernel Extract (NSKE 5%)**: Spray within 48 hours of egg laying. Azadirachtin halts feeding and disrupts insect molting hormones.
3. **Trap Cropping**: Plant 2 rows of marigold around tomato fields to intercept Helicoverpa armigera caterpillars.`
  },
  {
    id: 'blog-4',
    title: 'Zero-Budget Natural Farming: Microbial Inoculants (Jeevammrut)',
    excerpt: 'Recipe, fermentation protocol, and field application steps for cow dung-based native microbial boosters.',
    cover: 'https://images.unsplash.com/photo-1592417817098-8f3d69102a47?q=80&w=2050&auto=format&fit=crop',
    category: 'Organic Farming',
    author: {
      name: 'Vandana Deshmukh',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    },
    date: '2025-05-10',
    minutes: 6,
    tags: ['ZBNF', 'jeevamrut', 'organic', 'soil-biology'],
    content: `Native Desi cow dung contains millions of beneficial soil microorganisms that catalyze bound minerals into crop-absorbable ions.

### Standard 200-Liter Drum Recipe:
- 10 kg fresh indigenous cow dung
- 5 to 10 liters cow urine
- 2 kg jaggery (gur) as microbial feedstock
- 2 kg pulse flour (besan) as nitrogen protein source
- 1 handful of undisturbed virgin soil from farm bund

Ferment in shade for 48 to 72 hours, stirring clockwise twice daily. Apply 200 liters per acre through irrigation water twice a month.`
  },
  {
    id: 'blog-5',
    title: 'Drone Spraying SOP: Battery Management, Droplet Micron, and Coverage',
    excerpt: 'Commercial guidelines for adopting agricultural UAVs for foliar nutrition and emergency pest control across tall crops.',
    cover: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=2050&auto=format&fit=crop',
    category: 'AgriTech',
    author: {
      name: 'Krishi Drone Syndicate',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop',
    },
    date: '2025-04-22',
    minutes: 4,
    tags: ['drones', 'spraying', 'precision', 'automation'],
    content: `Agricultural drones reduce water consumption for pesticide spraying by up to 90% while completing 1 acre of dense sugarcane or cotton in just 7 minutes.

### Crucial Operating Rules:
- **Flight Altitude**: Maintain 2.0 to 2.5 meters above crop canopy.
- **Flight Speed**: 3 to 5 m/s depending on wind conditions.
- **Droplet Size**: Calibrate centrifugal nozzles between 150 - 250 microns to minimize off-target drift.`
  },
  {
    id: 'blog-6',
    title: 'PM-Kisan & KCC Subsidies: Maximize Low-Interest Working Capital',
    excerpt: 'Step-by-step checklist to ensure your Aadhaar e-KYC and land records are synchronized to avoid installment holds.',
    cover: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?q=80&w=2050&auto=format&fit=crop',
    category: 'Policies',
    author: {
      name: 'Advisory Bureau',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    },
    date: '2025-03-30',
    minutes: 3,
    tags: ['PM-Kisan', 'KCC', 'finance', 'subsidies'],
    content: `Eligible farmers can unlock credit limits up to ₹3,00,000 at an effective 4% annual interest rate when prompt repayment incentives are claimed.

Always cross-verify that the beneficiary bank account is active with NPCI Aadhaar Seeding. Contact the nearest CSC (Common Service Center) or district agricultural department if your installment status shows land seeding pending.`
  }
];

export const AgriBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const categories = ['All', 'Soil Health', 'Irrigation', 'Pest Management', 'Organic Farming', 'AgriTech', 'Policies'];

  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const matchCat = selectedCategory === 'All' || b.category === selectedCategory;
      const matchQuery =
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchQuery;
    });
  }, [blogs, selectedCategory, searchQuery]);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-800 to-green-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden mb-8">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-semibold backdrop-blur-md mb-3 border border-emerald-400/20">
            <BookOpen className="w-3.5 h-3.5" />
            Farmer Knowledge Hub & Field Notes
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            Agricultural Blogs & Field Advisories
          </h1>
          <p className="mt-2 text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            Scientifically validated agronomic practices, water budgeting, organic inputs, and policy updates curated for Indian farmers.
          </p>
        </div>
      </div>

      {/* Controls: Search & Category Chips */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search blogs, pest remedies, techniques..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#121c16] border border-slate-200 dark:border-[#222c26] text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition shadow-sm"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white dark:bg-[#121c16] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#222c26] hover:border-emerald-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Cards Grid */}
      {filteredBlogs.length === 0 ? (
        <div className="bg-white dark:bg-[#121c16] rounded-3xl p-12 text-center border border-slate-200 dark:border-[#222c26]">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No articles found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Try searching for a different keyword or category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => {
            const isBookmarked = bookmarkedIds.has(blog.id);
            return (
              <div
                key={blog.id}
                onClick={() => setSelectedBlog(blog)}
                className="group bg-white dark:bg-[#121c16] rounded-3xl border border-slate-200/80 dark:border-[#222c26] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
              >
                {/* Image Cover */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <img
                    src={blog.cover}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />

                  {/* Category Badge */}
                  <span className="absolute top-3.5 left-3.5 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-white/90 dark:bg-[#121c16]/90 text-emerald-800 dark:text-emerald-300 backdrop-blur-md shadow-sm border border-white/20">
                    <Leaf className="w-3 h-3" />
                    {blog.category}
                  </span>

                  {/* Bookmark Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleBookmark(blog.id, e)}
                    className="absolute top-3.5 right-3.5 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur transition active:scale-90"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        isBookmarked ? 'fill-emerald-400 text-emerald-400' : 'text-white'
                      }`}
                    />
                  </button>
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {blog.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      {/* Author */}
                      <div className="flex items-center gap-2">
                        {blog.author.avatar ? (
                          <img
                            src={blog.author.avatar}
                            alt=""
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px]">
                            {blog.author.name[0]}
                          </div>
                        )}
                        <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[130px]">
                          {blog.author.name}
                        </span>
                      </div>

                      {/* Read Time */}
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {blog.minutes} min
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {blog.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 dark:bg-[#18241d] text-emerald-700 dark:text-emerald-400"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Article Reader Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#121c16] rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-[#222c26] flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="relative h-48 sm:h-64 w-full bg-slate-900 shrink-0">
              <img
                src={selectedBlog.cover}
                alt={selectedBlog.title}
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121c16] via-transparent to-black/40" />

              <button
                type="button"
                onClick={() => setSelectedBlog(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white mb-2 inline-block">
                  {selectedBlog.category}
                </span>
                <h2 className="text-lg sm:text-2xl font-black text-white leading-tight drop-shadow-md">
                  {selectedBlog.title}
                </h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>Written by {selectedBlog.author.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {selectedBlog.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {selectedBlog.minutes} min read
                  </span>
                </div>
              </div>

              {/* Formatted Content */}
              <div className="space-y-4 pt-2">
                {selectedBlog.content ? (
                  selectedBlog.content.split('\n\n').map((para, i) => {
                    if (para.startsWith('### ')) {
                      return (
                        <h4
                          key={i}
                          className="font-bold text-slate-900 dark:text-emerald-400 text-base sm:text-lg pt-2"
                        >
                          {para.replace('### ', '')}
                        </h4>
                      );
                    }
                    if (para.startsWith('- ')) {
                      return (
                        <ul key={i} className="list-disc ml-5 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                          {para.split('\n').map((line, liIdx) => (
                            <li key={liIdx}>{line.replace(/^- /, '')}</li>
                          ))}
                        </ul>
                      );
                    }
                    return <p key={i}>{para}</p>;
                  })
                ) : (
                  <p>{selectedBlog.excerpt}</p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#18241d] border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Field guide verified for Indian agronomic conditions
              </span>
              <button
                type="button"
                onClick={() => setSelectedBlog(null)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition cursor-pointer"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
