import React, { useState } from 'react';
import {
  Users,
  MessageCircle,
  Heart,
  Share2,
  Send,
  Sparkles,
  Tractor,
  Sprout,
  Wheat,
  Image as ImageIcon,
  CheckCircle,
  Tag,
  ShieldCheck,
  Award
} from 'lucide-react';
import { CommunityPost } from '../types';

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    author: 'Farmer Ramesh (Solapur, MH)',
    avatarType: 'tractor',
    time: '2 hours ago',
    content: 'Just tried an organic Jeevamrut & neem oil combination on our pomegranate plot. The fungal spots on new flushes have dried up completely and foliage looks vigorous.',
    image: '/community/img1.jpg',
    likes: 42,
    comments: 8,
    topic: 'Organic Remedies',
    replies: [
      {
        id: 'rep-1',
        author: 'Dr. Deshmukh (Agri Officer)',
        time: '1 hour ago',
        text: 'Excellent practice Ramesh ji. Ensure 15-day intervals during high humidity to maintain systemic suppression of bacterial blight.',
        isExpert: true,
      },
      {
        id: 'rep-2',
        author: 'Suresh Patil',
        time: '45 mins ago',
        text: 'What was your spray concentration per 200 liter drum?',
      }
    ]
  },
  {
    id: 'post-2',
    author: 'Farmer Priya (Mandya, KA)',
    avatarType: 'sprout',
    time: '5 hours ago',
    content: 'Noticed early yellow stem borer damage in 30-day paddy tillers. Any recommendations for biological trap lures vs light traps before taking chemical action?',
    image: '/community/img2.jpg',
    likes: 29,
    comments: 6,
    topic: 'Pest Advisory',
    replies: [
      {
        id: 'rep-3',
        author: 'Krishi Vigyan Kendra (KVK)',
        time: '3 hours ago',
        text: 'Install pheromone traps with Scirpophaga incertulas lures @ 8 traps/acre. Release Trichogramma japonicum egg parasitoids @ 20,000/acre weekly.',
        isExpert: true,
      }
    ]
  },
  {
    id: 'post-3',
    author: 'Farmer Rohit (Karnal, HR)',
    avatarType: 'wheat',
    time: '1 day ago',
    content: 'Harvest season for late-sown wheat concluded with average yield of 22 quintals/acre. Grateful for the timely rainfall in February and balanced potassium application.',
    image: '/community/img3.jpg',
    likes: 68,
    comments: 14,
    topic: 'Harvest & Yield',
    replies: [
      {
        id: 'rep-4',
        author: 'Balwinder Singh',
        time: '18 hours ago',
        text: 'Which seed variety did you sow? DBW 187 or HD 3086?',
      }
    ]
  }
];

export const FarmerCommunity: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [newPostText, setNewPostText] = useState<string>('');
  const [newPostAuthor, setNewPostAuthor] = useState<string>('');
  const [newPostTopic, setNewPostTopic] = useState<string>('General Discussion');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const topics = ['All', 'Organic Remedies', 'Pest Advisory', 'Harvest & Yield', 'Machinery & Tools', 'Market Tips'];

  const handleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      const isCurrentlyLiked = next.has(postId);
      if (isCurrentlyLiked) {
        next.delete(postId);
      } else {
        next.add(postId);
      }

      setPosts((currentPosts) =>
        currentPosts.map((p) =>
          p.id === postId
            ? { ...p, likes: isCurrentlyLiked ? p.likes - 1 : p.likes + 1 }
            : p
        )
      );

      return next;
    });
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      author: newPostAuthor.trim() ? newPostAuthor.trim() : 'Progressive Farmer',
      avatarType: 'sprout',
      time: 'Just now',
      content: newPostText.trim(),
      likes: 1,
      comments: 0,
      topic: newPostTopic,
      replies: [],
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
  };

  const handleAddReply = (postId: string) => {
    if (!replyText.trim()) return;

    setPosts((currentPosts) =>
      currentPosts.map((p) => {
        if (p.id === postId) {
          const newReply = {
            id: `rep-${Date.now()}`,
            author: 'Kisan Member',
            time: 'Just now',
            text: replyText.trim(),
          };
          return {
            ...p,
            comments: p.comments + 1,
            replies: [...(p.replies || []), newReply],
          };
        }
        return p;
      })
    );
    setReplyText('');
  };

  const filteredPosts = posts.filter(
    (p) => selectedTopic === 'All' || p.topic === selectedTopic
  );

  const renderAvatar = (type: string) => {
    switch (type) {
      case 'tractor':
        return (
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <Tractor className="w-5 h-5" />
          </div>
        );
      case 'wheat':
        return (
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
            <Wheat className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-2xl bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300 flex items-center justify-center shrink-0">
            <Sprout className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-green-700 to-teal-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-semibold backdrop-blur-md mb-3 border border-emerald-400/20">
            <Users className="w-3.5 h-3.5" />
            Kisan Chaupal & Peer Community
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            Farmer Community Forum
          </h1>
          <p className="mt-2 text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-xl">
            Ask pest questions, share seasonal harvest results, and exchange local farming wisdom with progressive growers and agricultural scientists.
          </p>
        </div>
      </div>

      {/* Topic Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
        {topics.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setSelectedTopic(t)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedTopic === t
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white dark:bg-[#121c16] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#222c26] hover:border-emerald-400'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Create New Post Box */}
      <div className="bg-white dark:bg-[#121c16] rounded-3xl border border-slate-200 dark:border-[#222c26] p-5 sm:p-6 shadow-sm mb-8">
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Sprout className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Your Name / District (e.g., Ramesh - Pune)"
              value={newPostAuthor}
              onChange={(e) => setNewPostAuthor(e.target.value)}
              className="flex-1 bg-slate-50 dark:bg-[#18241d] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <select
              value={newPostTopic}
              onChange={(e) => setNewPostTopic(e.target.value)}
              className="bg-slate-50 dark:bg-[#18241d] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="Organic Remedies">Organic</option>
              <option value="Pest Advisory">Pest Alert</option>
              <option value="Harvest & Yield">Harvest</option>
              <option value="Machinery & Tools">Machinery</option>
              <option value="Market Tips">Mandi</option>
            </select>
          </div>

          <textarea
            rows={3}
            placeholder="Share your field observation, pest outbreak warning, or ask for crop advice..."
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#18241d] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition resize-none"
            required
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified Farmer Network
            </span>

            <button
              type="submit"
              disabled={!newPostText.trim()}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              Publish to Chaupal
            </button>
          </div>
        </form>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {filteredPosts.map((post) => {
          const isLiked = likedPosts.has(post.id);
          const showReplies = activeCommentsPostId === post.id;

          return (
            <div
              key={post.id}
              className="bg-white dark:bg-[#121c16] rounded-3xl border border-slate-200 dark:border-[#222c26] p-5 sm:p-7 shadow-sm transition hover:shadow-md"
            >
              {/* Post Author Header */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  {renderAvatar(post.avatarType)}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                        {post.author}
                      </h3>
                      <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {post.time}
                    </p>
                  </div>
                </div>

                {post.topic && (
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-[#18241d] text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                    {post.topic}
                  </span>
                )}
              </div>

              {/* Post Text */}
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed mb-4">
                {post.content}
              </p>

              {/* Post Image Attachment */}
              {post.image && (
                <div className="rounded-2xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-900 aspect-[16/9] max-h-96">
                  <img
                    src={post.image}
                    alt="Field crop photo"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                <button
                  type="button"
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer ${
                    isLiked
                      ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/30'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`}
                  />
                  <span>{post.likes}</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveCommentsPostId(showReplies ? null : post.id)
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments} Comments</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: post.author, text: post.content });
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>

              {/* Expandable Replies Section */}
              {showReplies && (
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                  {post.replies && post.replies.length > 0 ? (
                    <div className="space-y-2.5">
                      {post.replies.map((rep) => (
                        <div
                          key={rep.id}
                          className={`p-3.5 rounded-2xl text-xs sm:text-sm ${
                            rep.isExpert
                              ? 'bg-emerald-50/80 dark:bg-[#18291f] border border-emerald-200 dark:border-emerald-800/60'
                              : 'bg-slate-50 dark:bg-[#18241d]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 dark:text-white">
                                {rep.author}
                              </span>
                              {rep.isExpert && (
                                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-600 text-white">
                                  <ShieldCheck className="w-2.5 h-2.5" />
                                  Expert
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400">
                              {rep.time}
                            </span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300">
                            {rep.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-2">
                      No replies yet. Be the first to advise!
                    </p>
                  )}

                  {/* Add Reply Input */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Write your advice or answer..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddReply(post.id);
                      }}
                      className="flex-1 bg-slate-50 dark:bg-[#18241d] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddReply(post.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer transition"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
