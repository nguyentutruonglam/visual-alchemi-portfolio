import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Project, UserProfile, INITIAL_PROFILE } from './types';
import { getProjects, getProfile } from './services/storage';
import { AdminDashboard } from './components/AdminDashboard';
import { Button } from './components/ui/Button';
import { Menu, X, ArrowRight, Play, Instagram, Linkedin, Mail, Lock, ExternalLink, Loader2, PlayCircle } from 'lucide-react';

// --- Components defined locally to keep file count manageable within constraints ---

const Navbar: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <Link to="/" className="text-xl font-display font-bold tracking-widest text-white uppercase flex items-center gap-2 group">
          <div className="w-8 h-8 bg-white text-black flex items-center justify-center rounded-sm font-bold text-xs group-hover:bg-amber-500 transition-colors">VA</div>
          <span className="group-hover:text-zinc-300 transition-colors">Visual<span className="text-zinc-500 group-hover:text-amber-500 transition-colors">Alchemi</span></span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center text-xs font-bold tracking-widest uppercase">
          <Link to="/" className="text-zinc-400 hover:text-white transition-colors">Work</Link>
          <a href="#about" className="text-zinc-400 hover:text-white transition-colors">About</a>
          <a href="#contact" className="text-zinc-400 hover:text-white transition-colors">Contact</a>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-zinc-950 border-b border-zinc-900 p-6 flex flex-col gap-6 animate-slideUp">
          <Link to="/" onClick={() => setIsOpen(false)} className="text-lg font-bold uppercase text-white">Work</Link>
          <a href="#about" onClick={() => setIsOpen(false)} className="text-lg font-bold uppercase text-zinc-400">About</a>
          <a href="#contact" onClick={() => setIsOpen(false)} className="text-lg font-bold uppercase text-zinc-400">Contact</a>
        </div>
      )}
    </nav>
  );
};

const ProjectCard: React.FC<{ project: Project; onClick: () => void }> = ({ project, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer relative w-full aspect-[16/9] overflow-hidden bg-zinc-900 rounded-sm border border-zinc-900 hover:border-amber-500/50 transition-all duration-300"
    >
      <img 
        src={project.thumbnail} 
        alt={project.title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
      
      {/* Play Icon Overlay for Editors */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
        <div className="w-16 h-16 rounded-full bg-amber-500/90 text-black flex items-center justify-center backdrop-blur-sm shadow-[0_0_30px_rgba(245,158,11,0.4)]">
             <Play className="fill-current ml-1" size={32} />
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 pointer-events-none">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center gap-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity delay-75">
             <div className="h-[1px] w-6 bg-amber-500"></div>
             <p className="text-amber-500 text-[10px] font-bold uppercase tracking-widest">{project.category}</p>
          </div>
          <h3 className="text-2xl md:text-3xl font-display font-bold text-white uppercase leading-none mb-1 shadow-black drop-shadow-lg">{project.title}</h3>
          <p className="text-zinc-400 text-xs uppercase tracking-wide opacity-80">{project.client} <span className="mx-2 text-zinc-600">//</span> {project.year}</p>
        </div>
      </div>
    </div>
  );
};

const VideoModal: React.FC<{ url: string; onClose: () => void }> = ({ url, onClose }) => {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fadeIn">
      <div className="w-full max-w-6xl aspect-video relative bg-black shadow-2xl border border-zinc-800 rounded-lg overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 text-white bg-black/50 p-2 rounded-full hover:bg-white hover:text-black transition-all">
          <X size={24} />
        </button>
        <iframe 
            src={url.replace('watch?v=', 'embed/').split('&')[0] + '?autoplay=1'} 
            className="w-full h-full" 
            allow="autoplay; fullscreen"
            title="Video Player"
        />
      </div>
    </div>
  );
}

const Modal: React.FC<{ project: Project; onClose: () => void }> = ({ project, onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-4 bg-black/90 backdrop-blur-sm overflow-hidden">
      <div className="bg-zinc-950 w-full h-full md:h-auto md:max-w-6xl md:max-h-[90vh] overflow-y-auto md:rounded-lg md:border border-zinc-800 animate-slideUp shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-zinc-950/95 backdrop-blur border-b border-zinc-800 p-6 flex justify-between items-center z-10">
            <div>
              <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">{project.category}</p>
              <h2 className="text-2xl md:text-3xl font-display uppercase font-bold text-white">{project.title}</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors"><X size={24} /></button>
        </div>
        
        <div className="p-6 md:p-10 space-y-12">
            {/* Project Info & Description */}
            <div className="grid md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-6">
                    <p className="text-zinc-300 leading-relaxed text-lg whitespace-pre-line font-light">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                            <span key={tag} className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-400 uppercase tracking-wider rounded-sm">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="space-y-6 text-sm text-zinc-500 bg-zinc-900/30 p-6 rounded border border-zinc-800/50 h-fit">
                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                        <span className="text-zinc-500 font-bold uppercase tracking-wider">Client</span>
                        <span className="text-white">{project.client}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                        <span className="text-zinc-500 font-bold uppercase tracking-wider">Year</span>
                        <span className="text-white">{project.year}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                        <span className="text-zinc-500 font-bold uppercase tracking-wider">Role</span>
                        <span className="text-white">{project.category}</span>
                    </div>
                </div>
            </div>

            {/* Deliverables / Sub Projects */}
            <div className="space-y-10">
                <h3 className="text-xl font-display font-bold uppercase border-b border-zinc-800 pb-4 text-white flex items-center gap-2">
                    <PlayCircle size={20} className="text-amber-500"/> Project Media
                </h3>
                
                {project.subProjects.length > 0 ? (
                    <div className="grid gap-12">
                      {project.subProjects.map(sub => (
                        <div key={sub.id} className="group">
                             <div className="flex justify-between items-end mb-4">
                                <h4 className="text-lg font-bold text-white flex items-center gap-3">
                                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_10px_orange]"></div> 
                                  {sub.title}
                                </h4>
                                {sub.videoUrl && !sub.videoUrl.includes('youtube') && !sub.videoUrl.includes('vimeo') && (
                                   <a href={sub.videoUrl} target="_blank" rel="noreferrer" className="text-xs flex items-center gap-1 text-zinc-500 hover:text-white transition-colors">
                                     Open Link <ExternalLink size={12}/>
                                   </a>
                                )}
                             </div>
                             
                             <div className="w-full bg-zinc-900 border border-zinc-800 overflow-hidden relative shadow-lg group-hover:border-zinc-700 transition-colors">
                                {sub.videoUrl.includes('youtube') || sub.videoUrl.includes('vimeo') ? (
                                    <div className="aspect-video">
                                      <iframe 
                                          src={sub.videoUrl.replace('watch?v=', 'embed/').split('&')[0]} 
                                          className="w-full h-full" 
                                          allowFullScreen 
                                          title={sub.title}
                                      />
                                    </div>
                                ) : (
                                    <div className="aspect-video flex flex-col items-center justify-center bg-zinc-950 p-10 text-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-grain opacity-20"></div>
                                        <p className="text-zinc-500 mb-4 z-10">External Content</p>
                                        <Button onClick={() => window.open(sub.videoUrl, '_blank')} variant="outline" className="z-10">
                                            View Content <ExternalLink className="ml-2" size={14}/>
                                        </Button>
                                    </div>
                                )}
                             </div>
                        </div>
                      ))}
                    </div>
                ) : (
                    <div className="p-12 text-center border border-dashed border-zinc-800 rounded bg-zinc-900/20">
                        <p className="text-zinc-500 italic">Visual assets for this project are currently being updated.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showReelModal, setShowReelModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const p = await getProjects();
            const u = await getProfile();
            setProjects(p);
            setProfile(u);
        } catch (e) {
            console.error(e);
            setProfile(INITIAL_PROFILE); 
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  if (loading) {
      return (
          <div className="h-screen w-full bg-zinc-950 flex items-center justify-center text-white">
              <Loader2 className="animate-spin text-amber-500" size={32} />
          </div>
      )
  }

  if (!profile) return null;

  return (
    <div className="bg-zinc-950 min-h-screen text-zinc-50 font-sans selection:bg-amber-500/30 relative">
      {/* Film Grain Overlay - Cinematic feel */}
      <div className="bg-grain"></div>

      <Navbar profile={profile} />
      
      {/* Hero Section */}
      <header className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-[85vh] flex flex-col justify-center overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-gradient-to-b from-amber-500/10 to-transparent rounded-full blur-[100px] -z-10 opacity-50" />
        <div className="absolute bottom-20 left-0 w-[300px] h-[300px] bg-zinc-800/20 rounded-full blur-[80px] -z-10" />
        
        <div className="animate-slideUp z-10">
          <div className="flex items-center gap-4 mb-6">
             <div className="h-[1px] w-12 bg-amber-500"></div>
             <p className="text-amber-500 font-bold tracking-[0.3em] text-xs uppercase">Portfolio 2024</p>
          </div>
          
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-display font-bold uppercase leading-[0.9] tracking-tighter mb-8 text-white">
            {profile.role.split(' ').map((word, i) => (
               <span key={i} className={`block ${i === 1 ? 'glitch-text cursor-default' : ''}`}>{word}</span>
            ))}
          </h1>
          
          <p className="text-zinc-400 max-w-xl text-lg md:text-xl leading-relaxed mb-12 font-light border-l border-zinc-800 pl-6">
            {profile.bio}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6">
             <Button size="lg" className="h-14 px-8 text-lg" onClick={() => document.getElementById('work')?.scrollIntoView({behavior: 'smooth'})}>
                Selected Works
             </Button>
             
             {profile.heroVideoUrl && (
               <button 
                 onClick={() => setShowReelModal(true)}
                 className="group flex items-center gap-4 text-white hover:text-amber-500 transition-colors px-4"
               >
                 <div className="w-14 h-14 rounded-full border border-zinc-700 flex items-center justify-center group-hover:border-amber-500 group-hover:bg-amber-500/10 transition-all relative overflow-hidden">
                    <div className="absolute inset-0 bg-amber-500/20 scale-0 group-hover:scale-100 transition-transform rounded-full"></div>
                    <Play size={20} className="fill-current relative z-10" />
                 </div>
                 <span className="font-bold uppercase tracking-widest text-sm">Watch Showreel</span>
               </button>
             )}
          </div>
        </div>
      </header>

      {/* Projects Grid */}
      <section id="work" className="px-6 py-20 max-w-7xl mx-auto border-t border-zinc-900/50 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold uppercase text-white mb-2">Selected Works</h2>
              <p className="text-zinc-500">Curated projects from 2023-2024</p>
            </div>
            <div className="text-right hidden md:block">
              <span className="text-4xl font-display font-bold text-zinc-800 tracking-tighter stroke-text">
                {String(projects.length).padStart(2, '0')}
              </span>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-20">
          {projects.map((project, index) => (
            <div key={project.id} className={`${index % 3 === 2 ? 'md:col-span-2' : ''} fade-in-section`}>
               <ProjectCard project={project} onClick={() => setSelectedProject(project)} />
            </div>
          ))}
        </div>
      </section>

      {/* About / Contact */}
      <section id="about" className="bg-zinc-900/30 py-32 px-6 border-t border-zinc-900 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-display font-bold uppercase mb-8 leading-tight">Let's Create<br/><span className="text-amber-500 glitch-text inline-block">Something visual.</span></h2>
            <p className="text-zinc-400 text-xl mb-12 max-w-2xl mx-auto font-light">
                Ready to take your brand's visual storytelling to the next level? I'm available for freelance projects and collaborations.
            </p>
            <div className="flex justify-center gap-6 mb-16">
                 {/* Social links */}
                 {profile.socials.instagram && (
                   <a href={profile.socials.instagram} className="w-12 h-12 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-full hover:bg-white hover:text-black transition-all hover:scale-110 hover:border-amber-500">
                     <Instagram size={20} />
                   </a>
                 )}
                 {profile.socials.linkedin && (
                   <a href={profile.socials.linkedin} className="w-12 h-12 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-full hover:bg-white hover:text-black transition-all hover:scale-110 hover:border-amber-500">
                     <Linkedin size={20} />
                   </a>
                 )}
                 <a href={`mailto:${profile.email}`} className="w-12 h-12 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-full hover:bg-white hover:text-black transition-all hover:scale-110 hover:border-amber-500">
                   <Mail size={20} />
                 </a>
            </div>
            <div className="flex flex-col gap-2 text-zinc-600 text-xs uppercase tracking-widest">
              <p>© 2024 {profile.name}</p>
              <p>Designed with Visual Alchemi Style</p>
            </div>
        </div>
      </section>

      {/* Admin Toggle Footer */}
      <footer className="py-6 border-t border-zinc-900 text-center bg-zinc-950 relative z-10">
          <Link to="/admin" className="text-zinc-800 hover:text-zinc-600 text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
             <Lock size={10} /> Admin Access
          </Link>
      </footer>

      {/* Modals */}
      {selectedProject && <Modal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      {showReelModal && profile.heroVideoUrl && (
        <VideoModal url={profile.heroVideoUrl} onClose={() => setShowReelModal(false)} />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminRoute />} />
      </Routes>
    </HashRouter>
  );
};

// Simple pseudo-auth wrapper for the admin route
const AdminRoute: React.FC = () => {
    const navigate = useNavigate();
    // In a real app, check auth token here.
    return <AdminDashboard onLogout={() => navigate('/')} />;
};

export default App;