
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Trophy, 
  Plus, 
  Save,
  Bell,
  Search,
  LogOut,
  UserCircle,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import ClassManagement from './components/ClassManagement';
import StudentManagement from './components/StudentManagement';
import Rankings from './components/Rankings';
import Login from './components/Login';
import Profile from './components/Profile';
import StudentPortal from './components/StudentPortal';
import { Student, Class, View, User } from './types';
import * as storage from './services/storageService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadedData = storage.loadData();
    setStudents(loadedData.students);
    setClasses(loadedData.classes);
    setUsers(loadedData.users || []);
  }, []);

  useEffect(() => {
    if (currentUser?.role === 'student') {
      setActiveView('student-portal');
    } else {
      setActiveView('dashboard');
    }
  }, [currentUser]);

  const handleSaveAll = useCallback(() => {
    setIsSaving(true);
    storage.saveData({ students, classes, users });
    setTimeout(() => {
      setIsSaving(false);
    }, 800);
  }, [students, classes, users]);

  const addStudent = (student: Student) => setStudents(prev => [...prev, student]);
  const addClass = (cls: Class) => setClasses(prev => [...prev, cls]);
  
  const updateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  const updateProfile = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
  };

  const currentStudentData = useMemo(() => {
    if (currentUser?.role === 'student' && currentUser.studentId) {
      return students.find(s => s.id === currentUser.studentId);
    }
    return null;
  }, [currentUser, students]);

  const currentStudentClass = useMemo(() => {
    if (currentStudentData) {
      return classes.find(c => c.id === currentStudentData.classId);
    }
    return undefined;
  }, [currentStudentData, classes]);

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} users={users} />;
  }

  const isAdmin = currentUser.role === 'admin';

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Tổng quan', hidden: !isAdmin },
    { id: 'student-portal', icon: BookOpen, label: 'Cổng thông tin', hidden: isAdmin },
    { id: 'classes', icon: GraduationCap, label: 'Quản lý Lớp', hidden: !isAdmin },
    { id: 'students', icon: Users, label: 'Học sinh', hidden: !isAdmin },
    { id: 'rankings', icon: Trophy, label: 'Xếp hạng' },
    { id: 'profile', icon: UserCircle, label: 'Hồ sơ cá nhân' },
  ];

  return (
    <div className="flex min-h-screen bg-white text-slate-900">
      {/* Sidebar - Minimal White */}
      <aside className="w-64 bg-white border-r border-slate-100 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-slate-50">
          <h1 className="font-extrabold text-lg leading-tight tracking-tight text-black">Hệ thống<br/>Quản lý giáo dục</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mt-2">Bởi Lê Thái Bình</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 mt-4">
          {navItems.filter(i => !i.hidden).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as View)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeView === item.id 
                ? 'bg-black text-white shadow-lg shadow-slate-200' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-black'
              }`}
            >
              <item.icon size={18} />
              <span className="text-sm font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-50">
          <button 
            onClick={() => { handleSaveAll(); setCurrentUser(null); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut size={18} />
            <span className="text-sm font-semibold">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header - Transparent/White */}
        <header className="h-20 bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-30 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                type="text" 
                placeholder="Tìm kiếm thông tin..." 
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-full focus:bg-white focus:border-slate-300 transition-all outline-none text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {isAdmin && (
              <button 
                onClick={handleSaveAll}
                disabled={isSaving}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs transition-all ${
                  isSaving 
                  ? 'bg-slate-100 text-slate-400' 
                  : 'bg-black text-white hover:bg-slate-800'
                }`}
              >
                {isSaving ? <div className="animate-spin rounded-full h-3 w-3 border-2 border-slate-300 border-t-transparent"></div> : <Save size={14} />}
                {isSaving ? 'ĐANG LƯU...' : 'LƯU DỮ LIỆU'}
              </button>
            )}
            <div className="h-6 w-px bg-slate-100"></div>
            <div 
              onClick={() => setActiveView('profile')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-black group-hover:underline">{currentUser.fullName}</p>
                <p className="text-[10px] text-slate-400 font-medium">{currentUser.role === 'admin' ? 'Quản trị viên' : 'Học sinh'}</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-full overflow-hidden border border-slate-100">
                <img src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username}`} alt="Avatar" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 md:p-12 flex-1 overflow-auto bg-white">
          <div className="max-w-7xl mx-auto">
            {activeView === 'dashboard' && <Dashboard students={students} classes={classes} />}
            {activeView === 'classes' && <ClassManagement classes={classes} addClass={addClass} />}
            {activeView === 'students' && (
              <StudentManagement 
                students={students} 
                classes={classes} 
                addStudent={addStudent} 
                updateStudent={updateStudent}
                searchTerm={searchTerm}
              />
            )}
            {activeView === 'rankings' && <Rankings students={students} classes={classes} />}
            {activeView === 'profile' && <Profile user={currentUser} onUpdate={updateProfile} />}
            {activeView === 'student-portal' && currentStudentData && (
              <StudentPortal student={currentStudentData} studentClass={currentStudentClass} />
            )}
            {activeView === 'student-portal' && !currentStudentData && (
              <div className="text-center py-32 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">Dữ liệu học sinh chưa được liên kết.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
