import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Film, 
  Play, 
  Clock, 
  CheckCircle2, 
  BookOpen, 
  Gamepad2, 
  ExternalLink,
  Sparkles,
  Share2
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { AnimatedButton } from '../components/common/AnimatedButton';
import { Badge } from '../components/common/Badge';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { videoService } from '../services/videoService';

export const VideoHubPage = () => {
  const { lang, t } = useLanguage();
  const { user, markVideoWatched } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    videoService.getAllVideos().then((data) => {
      setVideos(data);
      const paramId = searchParams.get('id');
      if (paramId) {
        const found = data.find((v) => v.id === paramId);
        if (found) {
          setSelectedVideo(found);
          markVideoWatched(found.id, found.title);
          return;
        }
      }
      if (data.length > 0 && !selectedVideo) {
        setSelectedVideo(data[0]);
        markVideoWatched(data[0].id, data[0].title);
      }
    });
  }, [searchParams]);

  const categories = ['All', 'Phishing', 'Password Safety', 'Social Engineering', 'Network Security', 'Emerging Threats'];

  const filteredVideos = videos.filter((v) => {
    return activeCategory === 'All' || v.category === activeCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <GlassCard variant="default" className="p-6 sm:p-8 space-y-3 bg-white border border-slate-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="blue">Video Masterclasses</Badge>
              <Badge variant="gold">Visual Defense</Badge>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-graphite mt-2">
              {lang === 'hi' ? 'वीडियो हब: दृश्यमान साइबर सुरक्षा कक्षाएं' : 'Video Masterclasses: Visual Cyber Defense'}
            </h1>
            <p className="text-sm text-slate-600 font-medium mt-1 max-w-2xl">
              {lang === 'hi'
                ? 'विशेषज्ञों द्वारा समझाए गए वीडियो, मुख्य बिंदु और संबंधित लेख एवं सिमुलेटर टूल्स।'
                : 'Watch high-impact visual breakdowns of scams, network attacks, and defensive countermeasures.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shrink-0 text-center shadow-inner">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Watched Videos</span>
            <span className="text-2xl font-bold font-display text-cyber-blue-dark">
              {user.watchedVideos?.length || 0} / {videos.length}
            </span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 border-t border-slate-100 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
                activeCategory === cat
                  ? 'bg-cyber-blue-dark text-white font-bold'
                  : 'bg-white text-slate-500 hover:text-cyber-blue-dark border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Main Theater & Video Player */}
      {selectedVideo && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Video View & Takeaways */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 16:9 Video Player Box */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xl aspect-video">
              <iframe
                src={selectedVideo.embedUrl}
                title={selectedVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Video Meta Info */}
            <GlassCard variant="default" className="p-6 space-y-4 bg-white border border-slate-200 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Badge variant="blue">{selectedVideo.category}</Badge>
                  <Badge variant="gold">{selectedVideo.level}</Badge>
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {selectedVideo.duration}
                  </span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold font-display text-graphite">
                {lang === 'hi' && selectedVideo.titleHi ? selectedVideo.titleHi : selectedVideo.title}
              </h2>

              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                {lang === 'hi' && selectedVideo.descriptionHi ? selectedVideo.descriptionHi : selectedVideo.description}
              </p>

              {/* Key Takeaways Checklist */}
              {selectedVideo.keyTakeaways && (
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyber-gold-dark">
                    Key Defensive Takeaways:
                  </h4>
                  <div className="space-y-1.5">
                    {selectedVideo.keyTakeaways.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-cyber-green shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Actions */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                {selectedVideo.relatedArticleId && (
                  <AnimatedButton
                    variant="glass"
                    size="sm"
                    icon={BookOpen}
                    onClick={() => navigate(`/articles/${selectedVideo.relatedArticleId}`)}
                  >
                    Read Related Article
                  </AnimatedButton>
                )}
                {selectedVideo.relatedSimId && (
                  <AnimatedButton
                    variant="purple"
                    size="sm"
                    icon={Gamepad2}
                    onClick={() => navigate('/simulations?tab=phishing')}
                  >
                    Practice in Simulator
                  </AnimatedButton>
                )}
              </div>
            </GlassCard>
          </div>

          {/* Right Playlist Catalog */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Masterclass Playlist ({filteredVideos.length})
            </h3>

            <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
              {filteredVideos.map((vid) => {
                const isSelected = selectedVideo?.id === vid.id;
                const isWatched = user.watchedVideos?.includes(vid.id);

                return (
                  <div
                    key={vid.id}
                    onClick={() => {
                      setSelectedVideo(vid);
                      markVideoWatched(vid.id, vid.title);
                      setSearchParams({ id: vid.id });
                    }}
                    className={`p-3 rounded-2xl cursor-pointer border transition-all flex gap-3 shadow-sm ${
                      isSelected
                        ? 'bg-cyber-blue-light/20 border-cyber-blue/50'
                        : 'bg-white border-slate-200 hover:border-cyber-blue/30'
                    }`}
                  >
                    {/* Video Thumbnail */}
                    <div className="relative w-28 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                      <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play className="w-5 h-5 text-white fill-white shadow-sm" />
                      </div>
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-mono text-white">
                        {vid.duration}
                      </span>
                    </div>

                    {/* Text Details */}
                    <div className="space-y-1 overflow-hidden">
                      <p className={`text-xs font-bold line-clamp-2 leading-snug ${isSelected ? 'text-cyber-blue-dark' : 'text-graphite'}`}>
                        {lang === 'hi' && vid.titleHi ? vid.titleHi : vid.title}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium">{vid.category}</p>
                      {isWatched && (
                        <span className="text-[10px] font-bold text-cyber-green-dark flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Watched
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
