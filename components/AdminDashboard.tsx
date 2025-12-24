import React, { useState, useEffect } from 'react';
import { Project, UserProfile, SubProject } from '../types';
import { getProjects, saveProjects, getProfile, saveProfile, deleteProjectDoc } from '../services/storage';
import { generateProjectDescription } from '../services/gemini';
import { Button } from './ui/Button';
import { Login } from './Login';
import { Plus, Trash2, Edit2, Save, Sparkles, X, LayoutDashboard, LogOut, Loader2, Cloud, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'profile'>('projects');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // Edit State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Initial Fetch after Login
  useEffect(() => {
    if (isAuthenticated) {
        fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    setIsLoadingData(true);
    const p = await getProjects();
    const u = await getProfile();
    setProjects(p);
    setProfile(u);
    setIsLoadingData(false);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profile) {
      await saveProfile(profile);
      alert('Đã cập nhật thông tin cá nhân lên Cloud!');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm('Bạn chắc chắn muốn xóa dự án này?')) {
      await deleteProjectDoc(id); // Delete from Cloud
      setProjects(prev => prev.filter(p => p.id !== id)); // Update Local State
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject({ ...project });
  };

  const handleCreateProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: 'New Project',
      client: '',
      year: new Date().getFullYear().toString(),
      category: 'Video',
      thumbnail: 'https://picsum.photos/800/600',
      description: '',
      subProjects: [],
      tags: []
    };
    setEditingProject(newProject);
  };

  const saveEditingProject = async () => {
    if (!editingProject) return;
    
    // Optimistic UI Update
    let updatedProjects = [...projects];
    const index = updatedProjects.findIndex(p => p.id === editingProject.id);
    
    if (index >= 0) {
      updatedProjects[index] = editingProject;
    } else {
      updatedProjects.unshift(editingProject);
    }
    
    setProjects(updatedProjects);
    setEditingProject(null);

    // Save to Cloud
    await saveProjects(updatedProjects);
  };

  const handleGenerateAI = async () => {
    if (!editingProject?.title) return;
    setIsGenerating(true);
    const desc = await generateProjectDescription(editingProject.title, editingProject.tags.join(', '));
    setEditingProject(prev => prev ? { ...prev, description: desc } : null);
    setIsGenerating(false);
  };

  const addSubProject = () => {
    if (!editingProject) return;
    const newSub: SubProject = {
        id: Date.now().toString(),
        title: 'New Cut',
        videoUrl: ''
    };
    setEditingProject({
        ...editingProject,
        subProjects: [...editingProject.subProjects, newSub]
    });
  };

  const updateSubProject = (id: string, field: keyof SubProject, value: string) => {
      if (!editingProject) return;
      const updatedSubs = editingProject.subProjects.map(sub => 
        sub.id === id ? { ...sub, [field]: value } : sub
      );
      setEditingProject({ ...editingProject, subProjects: updatedSubs });
  };

  const removeSubProject = (id: string) => {
      if (!editingProject) return;
      setEditingProject({
          ...editingProject,
          subProjects: editingProject.subProjects.filter(sub => sub.id !== id)
      });
  };

  if (!isAuthenticated) {
      return <Login onSuccess={() => setIsAuthenticated(true)} />;
  }

  if (isLoadingData || !profile) {
      return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white flex-col gap-4">
            <Loader2 className="animate-spin text-amber-500" size={32} />
            <p className="text-zinc-500 animate-pulse">Connecting to Cloud Database...</p>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 flex-shrink-0">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="font-display font-bold text-xl tracking-widest text-white flex items-center gap-2">
            CMS <Cloud size={16} className="text-green-500" />
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Cloud Backend Manager</p>
        </div>
        <nav className="p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'projects' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            <LayoutDashboard size={18} /> Projects
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'profile' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            <Edit2 size={18} /> Profile Info
          </button>
          <Link 
            to="/" 
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors text-zinc-400 hover:text-amber-500 hover:bg-zinc-900"
          >
            <ExternalLink size={18} /> View Live Site
          </Link>
        </nav>
        <div className="p-4 mt-auto border-t border-zinc-800">
          <button onClick={onLogout} className="w-full flex items-center gap-2 text-zinc-500 hover:text-red-400 text-sm px-4 py-2">
            <LogOut size={16} /> Exit CMS
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto h-screen">
        
        {/* PROJECTS TAB */}
        {activeTab === 'projects' && !editingProject && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Quản lý Dự án</h1>
              <Button onClick={handleCreateProject}>
                <Plus size={16} className="mr-2" /> Thêm Dự án mới
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {projects.map(project => (
                <div key={project.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-4 group hover:border-zinc-700 transition-colors">
                  <img src={project.thumbnail} alt={project.title} className="w-20 h-20 object-cover rounded bg-zinc-800" />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{project.title}</h3>
                    <p className="text-zinc-400 text-sm">{project.category} • {project.year}</p>
                    <div className="flex gap-2 mt-2">
                        {project.tags.map(t => <span key={t} className="text-xs bg-zinc-800 px-2 py-1 rounded border border-zinc-700">{t}</span>)}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 sm:mt-0">
                    <Button variant="outline" size="sm" onClick={() => handleEditProject(project)}>
                      <Edit2 size={14} />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteProject(project.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <div className="text-zinc-500 text-center py-10 border border-dashed border-zinc-800 rounded">
                    Chưa có dự án nào. Thêm dự án mới hoặc kiểm tra kết nối Firebase.
                </div>
              )}
            </div>
          </div>
        )}

        {/* EDIT PROJECT FORM */}
        {activeTab === 'projects' && editingProject && (
          <div className="max-w-3xl mx-auto">
             <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingProject.id.length > 10 ? 'Thêm Dự án' : 'Chỉnh sửa'}</h2>
              <Button variant="ghost" onClick={() => setEditingProject(null)}><X size={20}/></Button>
            </div>

            <div className="space-y-6 bg-zinc-900/50 p-6 rounded-lg border border-zinc-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1 uppercase">Tên dự án</label>
                  <input 
                    type="text" 
                    value={editingProject.title} 
                    onChange={e => setEditingProject({...editingProject, title: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-700 p-2 rounded focus:border-zinc-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1 uppercase">Khách hàng</label>
                  <input 
                    type="text" 
                    value={editingProject.client} 
                    onChange={e => setEditingProject({...editingProject, client: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-700 p-2 rounded focus:border-zinc-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1 uppercase">Năm</label>
                  <input 
                    type="text" 
                    value={editingProject.year} 
                    onChange={e => setEditingProject({...editingProject, year: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-700 p-2 rounded focus:border-zinc-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1 uppercase">Thumbnail URL</label>
                  <input 
                    type="text" 
                    value={editingProject.thumbnail} 
                    onChange={e => setEditingProject({...editingProject, thumbnail: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-700 p-2 rounded focus:border-zinc-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1 uppercase">Tags (phân cách bằng dấu phẩy)</label>
                <input 
                  type="text" 
                  value={editingProject.tags.join(', ')} 
                  onChange={e => setEditingProject({...editingProject, tags: e.target.value.split(',').map(t => t.trim())})}
                  className="w-full bg-zinc-950 border border-zinc-700 p-2 rounded focus:border-zinc-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-end mb-1">
                   <label className="block text-xs font-bold text-zinc-500 uppercase">Mô tả</label>
                   <button 
                    type="button"
                    onClick={handleGenerateAI}
                    disabled={isGenerating}
                    className="text-xs text-amber-500 flex items-center hover:text-amber-400 disabled:opacity-50"
                   >
                     <Sparkles size={12} className="mr-1" /> {isGenerating ? 'Đang viết...' : 'Viết bằng AI'}
                   </button>
                </div>
                <textarea 
                  rows={4}
                  value={editingProject.description} 
                  onChange={e => setEditingProject({...editingProject, description: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-700 p-2 rounded focus:border-zinc-500 focus:outline-none"
                />
              </div>

              {/* SUB PROJECTS SECTION */}
              <div className="pt-4 border-t border-zinc-800">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold uppercase text-zinc-400">Dự án con / Video Clips</h3>
                    <Button variant="outline" size="sm" onClick={addSubProject}>+ Thêm clip</Button>
                </div>
                <div className="space-y-3">
                    {editingProject.subProjects.map((sub) => (
                        <div key={sub.id} className="flex gap-2 items-center bg-zinc-950 p-2 rounded border border-zinc-800">
                            <input 
                                className="bg-transparent border-b border-zinc-800 flex-1 text-sm p-1 focus:border-zinc-500 outline-none"
                                placeholder="Tiêu đề (VD: Social Cut)"
                                value={sub.title}
                                onChange={(e) => updateSubProject(sub.id, 'title', e.target.value)}
                            />
                            <input 
                                className="bg-transparent border-b border-zinc-800 flex-[2] text-sm p-1 text-zinc-400 focus:border-zinc-500 outline-none"
                                placeholder="Video URL"
                                value={sub.videoUrl}
                                onChange={(e) => updateSubProject(sub.id, 'videoUrl', e.target.value)}
                            />
                            <button onClick={() => removeSubProject(sub.id)} className="text-red-500 hover:text-red-400 p-1">
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                    {editingProject.subProjects.length === 0 && (
                        <p className="text-zinc-600 text-sm italic text-center py-2">Chưa có dự án con nào.</p>
                    )}
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setEditingProject(null)}>Hủy</Button>
                <Button onClick={saveEditingProject}>
                  <Save size={16} className="mr-2" /> Lưu Thay Đổi
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold mb-8">Thông tin Cá nhân</h1>
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1 uppercase">Họ và Tên</label>
                <input 
                  type="text" 
                  value={profile.name} 
                  onChange={e => setProfile({...profile, name: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded focus:border-zinc-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1 uppercase">Role / Chức danh</label>
                <input 
                  type="text" 
                  value={profile.role} 
                  onChange={e => setProfile({...profile, role: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded focus:border-zinc-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1 uppercase">Bio Giới thiệu</label>
                <textarea 
                  rows={4}
                  value={profile.bio} 
                  onChange={e => setProfile({...profile, bio: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded focus:border-zinc-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1 uppercase">Showreel / Hero Video URL (YouTube)</label>
                <input 
                  type="text" 
                  value={profile.heroVideoUrl || ''} 
                  onChange={e => setProfile({...profile, heroVideoUrl: e.target.value})}
                  placeholder="https://youtube.com/..."
                  className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded focus:border-zinc-500 focus:outline-none"
                />
                <p className="text-xs text-zinc-500 mt-1">Video này sẽ hiện nút "View Showreel" ở trang chủ.</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 mb-1 uppercase">Email Liên hệ</label>
                <input 
                  type="email" 
                  value={profile.email} 
                  onChange={e => setProfile({...profile, email: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded focus:border-zinc-500 focus:outline-none"
                />
              </div>
              <Button type="submit">Lưu Hồ Sơ</Button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
};