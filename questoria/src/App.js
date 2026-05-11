import React, { useState, useMemo } from 'react';
import { 
  School, User, LayoutDashboard, ChevronRight, ArrowLeft, 
  Lock, AlertCircle, LogOut, MessageSquare, BookOpen, 
  Search, PlusCircle, Trash2, CheckCircle, ArrowUp, X,
  BarChart3, Hash, CheckSquare
} from 'lucide-react';

const SUBJECTS = [
  "PENDIDIKAN AGAMA", "PENDIDIKAN PANCASILA", "BAHASA INDONESIA", 
  "MATEMATIKA", "BAHASA INGGRIS", "PENJASORKES", "SEJARAH", 
  "SENI BUDAYA", "MULOK (BAHASA JAWA)", "BIOLOGI", "FISIKA", 
  "KIMIA", "MATEMATIKA TK. LANJUT", "PRAKARYA", "INFORMATIKA", 
  "EKONOMI", "SOSIOLOGI", "BAHASA JERMAN", "GEOGRAFI"
];

const ROLES = { TEACHER: 'teacher', STUDENT: 'student' };

const STUDENT_DB = [
  { id: 's1', name: 'admins', password: 'admins', class: 'Grade 11 - Alpha' },
  { id: 's2', name: 'Bob Johnson', password: 'learning000', class: 'Grade 11 - Alpha' },
  { id: 's3', name: 'Charlie Brown', password: 'password1', class: 'Grade 10 - Beta' }
];

const TEACHER_DB = [
  { id: 't1', name: 'tch', password: 'tch', class: 'Grade 11 - Alpha' },
  { id: 't2', name: 'Ms. Garcia', password: 'biology456', class: 'Grade 11 - Alpha' }
];

const INITIAL_QUESTIONS = [
  {
    id: 'q1',
    type: 'forum',
    title: 'How to calculate standard deviation?',
    content: 'I am confused about the N-1 vs N in the denominator. When do we use which?',
    subject: 'MATEMATIKA',
    author: 'admins',
    authorId: 's1',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    votes: 12,
    className: 'Grade 11 - Alpha'
  },
  {
    id: 'q2',
    type: 'exercise',
    title: 'Cell Mitosis Phases Quiz',
    content: 'Identify the phase where chromosomes align at the equator.',
    subject: 'BIOLOGI',
    author: 'tch',
    authorId: 't1',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    votes: 5,
    className: 'Grade 11 - Alpha'
  }
];

const INITIAL_ANSWERS = [
  {
    id: 'a1',
    questionId: 'q1',
    text: 'Use N-1 (Bessel\'s correction) for a sample, and N for the entire population.',
    author: 'Bob Johnson',
    authorId: 's2',
    isVerified: true,
    votes: 8,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginStep, setLoginStep] = useState('selection'); 
  const [loginRole, setLoginRole] = useState(ROLES.STUDENT);
  const [activeTab, setActiveTab] = useState('forum');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingQuestion, setViewingQuestion] = useState(null);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  const [answers, setAnswers] = useState(INITIAL_ANSWERS);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostSubject, setNewPostSubject] = useState(SUBJECTS[0]);
  const [answerText, setAnswerText] = useState('');

  const stats = useMemo(() => {
    if (!currentUser) return { asked: 0, answered: 0, verified: 0 };
    
    if (currentUser.role === ROLES.TEACHER) {
      // Teacher stats: Class-wide overview (No verified count per request)
      const classQuestions = questions.filter(q => q.className === currentUser.className);
      const classAnswers = answers.filter(a => questions.find(q => q.id === a.questionId)?.className === currentUser.className);
      return { 
        asked: classQuestions.length, 
        answered: classAnswers.length 
      };
    } else {
      // Student stats: Personal activity
      const myQuestions = questions.filter(q => q.authorId === currentUser.id);
      const myAnswers = answers.filter(a => a.authorId === currentUser.id);
      const myVerified = myAnswers.filter(a => a.isVerified);
      return { 
        asked: myQuestions.length, 
        answered: myAnswers.length, 
        verified: myVerified.length 
      };
    }
  }, [questions, answers, currentUser]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    const database = loginRole === ROLES.TEACHER ? TEACHER_DB : STUDENT_DB;
    const userMatch = database.find(u => u.name === username && u.password === password);

    if (userMatch) {
      setCurrentUser({
        id: userMatch.id,
        name: userMatch.name,
        role: loginRole,
        className: userMatch.class
      });
    } else {
      setLoginError(`Invalid credentials for the ${loginRole} portal.`);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginStep('selection');
    setViewingQuestion(null);
    setUsername('');
    setPassword('');
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    const newPost = {
      id: 'q' + Date.now(),
      type: activeTab,
      title: newPostTitle,
      content: newPostContent,
      subject: newPostSubject,
      author: currentUser.name,
      authorId: currentUser.id,
      createdAt: new Date().toISOString(),
      votes: 0,
      className: currentUser.className
    };
    setQuestions([newPost, ...questions]);
    setIsModalOpen(false);
    setNewPostTitle('');
    setNewPostContent('');
  };

  const handleDeletePost = (id, e) => {
    if (e) e.stopPropagation();
    // Teacher can delete anything. Student cannot (as per requirement).
    if (currentUser.role === ROLES.TEACHER) {
      setQuestions(questions.filter(q => q.id !== id));
      setAnswers(answers.filter(a => a.questionId !== id));
      if (viewingQuestion?.id === id) setViewingQuestion(null);
    }
  };

  const handleDeleteAnswer = (answerId) => {
    if (currentUser.role === ROLES.TEACHER) {
      setAnswers(answers.filter(a => a.id !== answerId));
    }
  };

  const handleVerifyAnswer = (answerId) => {
    if (currentUser.role !== ROLES.TEACHER) return;
    setAnswers(answers.map(a => 
      a.id === answerId ? { ...a, isVerified: !a.isVerified } : a
    ));
  };

  const handlePostAnswer = (e) => {
    e.preventDefault();
    if (!answerText.trim()) return;
    const newAns = {
      id: 'a' + Date.now(),
      questionId: viewingQuestion.id,
      text: answerText,
      author: currentUser.name,
      authorId: currentUser.id,
      isVerified: false,
      votes: 0,
      createdAt: new Date().toISOString(),
    };
    setAnswers([...answers, newAns]);
    setAnswerText('');
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            q.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === 'All' || q.subject === selectedSubject;
      const matchesType = q.type === activeTab;
      const matchesClass = q.className === currentUser?.className;
      return matchesSearch && matchesSubject && matchesType && matchesClass;
    });
  }, [questions, searchQuery, selectedSubject, activeTab, currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-200 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-[#f8fafc] rounded-[40px] shadow-2xl p-10 border border-white/50 relative overflow-hidden">
          {loginStep === 'selection' ? (
            <div className="text-center space-y-8">
              <div className="flex justify-center">
                <div className="flex flex-col items-center space-y-2">
                  <img 
                  src="/logo.png" 
                  alt="Logo" className="w-40 h-40 object-contain" />
                  <h1 className="text-4xl font-black text-slate-800">Questoria</h1>
                  <p className="text-slate-500 font-medium">Crowdsourced Knowledge</p>
                </div>  
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => { setLoginRole(ROLES.STUDENT); setLoginStep('login'); }}
                  className="w-full group flex items-center p-5 bg-white/60 hover:bg-white rounded-3xl border border-slate-200 transition-all text-left shadow-sm"
                >
                  <div className="bg-indigo-100 p-3 rounded-xl mr-4 text-indigo-600"><User size={24} /></div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800">Student Portal</h3>
                    <p className="text-xs text-slate-400">Learn together</p>
                  </div>
                  <ChevronRight size={20} className="text-slate-300" />
                </button>

                <button 
                  onClick={() => { setLoginRole(ROLES.TEACHER); setLoginStep('login'); }}
                  className="w-full group flex items-center p-5 bg-white/60 hover:bg-white rounded-3xl border border-slate-200 transition-all text-left shadow-sm"
                >
                  <div className="bg-emerald-100 p-3 rounded-xl mr-4 text-emerald-600"><LayoutDashboard size={24} /></div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800">Teacher Portal</h3>
                    <p className="text-xs text-slate-400">Validate knowledge</p>
                  </div>
                  <ChevronRight size={20} className="text-slate-300" />
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <button 
                onClick={() => { setLoginStep('selection'); setLoginError(''); }}
                className="flex items-center text-slate-500 hover:text-indigo-600 text-xs font-black uppercase tracking-widest mb-6"
              >
                <ArrowLeft size={16} className="mr-2" /> Back
              </button>
              <h2 className="text-2xl font-black text-slate-800 capitalize mb-6">{loginRole} Login</h2>
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Username</label>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none" required />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none" required />
                </div>
                {loginError && <p className="text-red-500 text-xs font-bold">{loginError}</p>}
                <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl">Authenticate</button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex items-center space-x-3 mb-10">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
            <span className="text-xl font-black tracking-tight">Questoria</span>
            </div>

          <nav className="space-y-1 mb-8">
            <button onClick={() => { setActiveTab('forum'); setViewingQuestion(null); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'forum' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}>
              <MessageSquare size={20} /><span>Forum</span>
            </button>
            <button onClick={() => { setActiveTab('exercise'); setViewingQuestion(null); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'exercise' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}>
              <BookOpen size={20} /><span>Exercises</span>
            </button>
          </nav>

          <div className="mb-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-4">Subject Filter</p>
            <div className="space-y-1">
              <button onClick={() => setSelectedSubject('All')} className={`w-full text-left px-4 py-2 rounded-xl text-sm font-bold ${selectedSubject === 'All' ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-500'}`}>All Subjects</button>
              {SUBJECTS.slice(0, 8).map(sub => (
                <button key={sub} onClick={() => setSelectedSubject(sub)} className={`w-full text-left px-4 py-2 rounded-xl text-sm font-bold truncate ${selectedSubject === sub ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-500'}`}>{sub}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Statistics Block */}
        <div className="p-4 border-t border-slate-100 bg-white space-y-4">
          <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
              {currentUser.role === ROLES.TEACHER ? 'Class Insights' : 'My Progress'}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-500">
                <Hash size={14} className="text-slate-400" />
                <span className="text-[10px] font-black uppercase">Asked</span>
              </div>
              <span className="text-sm font-black text-indigo-600">{stats.asked}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-500">
                <MessageSquare size={14} className="text-slate-400" />
                <span className="text-[10px] font-black uppercase">Answered</span>
              </div>
              <span className="text-sm font-black text-indigo-600">{stats.answered}</span>
            </div>
            {/* Verified only for students */}
            {currentUser.role === ROLES.STUDENT && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-slate-500">
                  <CheckSquare size={14} className="text-emerald-500" />
                  <span className="text-[10px] font-black uppercase">Verified</span>
                </div>
                <span className="text-sm font-black text-emerald-600">{stats.verified}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold shrink-0">{currentUser.name[0]}</div>
            <div className="min-w-0">
              <p className="text-xs font-black truncate">{currentUser.name}</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase">{currentUser.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-500 font-black uppercase tracking-widest text-[10px] hover:bg-red-50 rounded-xl transition-all">
            <LogOut size={14} /><span>Sign Out</span>
          </button>
        </div>
      </aside>

      {}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search concepts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl outline-none font-medium text-sm" />
          </div>
          <div className="flex items-center space-x-4 ml-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-slate-400 uppercase">{currentUser.className}</p>
              <p className="text-xs font-bold text-slate-800">Active View</p>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg">
              <PlusCircle size={20} /><span className="hidden sm:inline">New Post</span>
            </button>
          </div>
        </header>

        <div className="p-8">
          {viewingQuestion ? (
            <div className="max-w-4xl mx-auto">
              <button onClick={() => setViewingQuestion(null)} className="flex items-center text-slate-500 font-bold text-sm mb-6"><ArrowLeft size={18} className="mr-2" /> Back</button>
              <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 mb-8 relative">
                {currentUser.role === ROLES.TEACHER && (
                  <button onClick={(e) => handleDeletePost(viewingQuestion.id, e)} className="absolute top-8 right-8 p-3 text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 size={20} />
                  </button>
                )}
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-full">{viewingQuestion.subject}</span>
                <h1 className="text-3xl font-black text-slate-800 my-4">{viewingQuestion.title}</h1>
                <p className="text-slate-600 text-lg mb-8">{viewingQuestion.content}</p>
                <div className="flex items-center space-x-3 text-slate-400 text-xs font-bold">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-indigo-400">{viewingQuestion.author[0]}</div>
                  <span>{viewingQuestion.author}</span>
                  <span>•</span>
                  <span>{new Date(viewingQuestion.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {}
              <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-800">Responses</h3>
                {answers.filter(a => a.questionId === viewingQuestion.id).map(answer => (
                  <div key={answer.id} className={`bg-white rounded-[32px] p-8 border ${answer.isVerified ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-100'} relative group`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center font-bold">{answer.author[0]}</div>
                        <div className="font-black text-slate-800">{answer.author}</div>
                        {answer.isVerified && <div className="px-2 py-1 bg-emerald-600 text-white text-[9px] font-black uppercase rounded-full">Verified</div>}
                      </div>
                      
                      <div className="flex space-x-2">
                        {currentUser.role === ROLES.TEACHER && (
                          <>
                            <button onClick={() => handleVerifyAnswer(answer.id)} className={`p-2 rounded-xl transition-all ${answer.isVerified ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-400 hover:text-emerald-600'}`}>
                              <CheckCircle size={18} />
                            </button>
                            <button onClick={() => handleDeleteAnswer(answer.id)} className="p-2 bg-slate-50 text-slate-400 hover:text-red-500 rounded-xl transition-all">
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{answer.text}</p>
                  </div>
                ))}
                
                <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
                  <textarea value={answerText} onChange={e => setAnswerText(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none min-h-[120px] focus:ring-2 ring-indigo-500/20" placeholder="Contribute your knowledge..." />
                  <button onClick={handlePostAnswer} className="mt-4 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs shadow-lg shadow-indigo-200">Publish Answer</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-slate-800 capitalize">{activeTab} Bank</h2>
                  <p className="text-slate-500 font-medium">{currentUser.className} • {selectedSubject}</p>
                </div>
              </div>

              <div className="grid gap-6">
                {filteredQuestions.length > 0 ? filteredQuestions.map(q => (
                  <div key={q.id} onClick={() => setViewingQuestion(q)} className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group relative">
                    {currentUser.role === ROLES.TEACHER && (
                      <button onClick={(e) => handleDeletePost(q.id, e)} className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all">
                        <Trash2 size={18} />
                      </button>
                    )}
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-full">{q.subject}</span>
                    <h3 className="text-xl font-black text-slate-800 mt-3 group-hover:text-indigo-600 transition-colors">{q.title}</h3>
                    <p className="text-slate-500 line-clamp-2 mt-2 font-medium">{q.content}</p>
                    <div className="mt-6 flex items-center justify-between pt-6 border-t border-slate-50">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-bold">{q.author[0]}</div>
                        <div className="text-xs font-bold text-slate-400">By {q.author}</div>
                      </div>
                      <div className="flex space-x-4 text-slate-400">
                        <div className="flex items-center space-x-1.5"><MessageSquare size={14} /> <span className="text-xs font-black">{answers.filter(a => a.questionId === q.id).length}</span></div>
                        {answers.some(a => a.questionId === q.id && a.isVerified) && <CheckCircle size={14} className="text-emerald-500" />}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[40px] bg-slate-50/50">
                    <Search className="mx-auto text-slate-300 mb-4" size={48} />
                    <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest">No resources found</h3>
                    <p className="text-slate-400">Be the first to contribute to this bank!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-[40px] p-10 shadow-2xl">
            <h2 className="text-2xl font-black mb-8">Create New {activeTab}</h2>
            <form onSubmit={handleCreatePost} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Subject Category</label>
                <select value={newPostSubject} onChange={e => setNewPostSubject(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-none">
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <input type="text" value={newPostTitle} onChange={e => setNewPostTitle(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-none" placeholder="Catchy title..." required />
              <textarea value={newPostContent} onChange={e => setNewPostContent(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl min-h-[120px] outline-none border-none" placeholder="Provide details, steps, or context..." required />
              <div className="flex space-x-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold hover:bg-slate-200 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200">Publish Now</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}