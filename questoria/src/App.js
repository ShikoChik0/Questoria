import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, LayoutDashboard, ChevronRight, ArrowLeft, 
  LogOut, MessageSquare, BookOpen, Menu, X, // Added Menu and X icons
  Search, PlusCircle, Trash2, CheckCircle, Sparkles, Award
} from 'lucide-react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, query, orderBy, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAxLyq_H1N35BmQG1izcqAqzSUVsT5M6Mk",
  authDomain: "questoria-8f0bb.firebaseapp.com",
  projectId: "questoria-8f0bb",
  storageBucket: "questoria-8f0bb.firebasestorage.app",
  messagingSenderId: "430292311030",
  appId: "1:430292311030:web:11e6f8839a47275e2245d7",
  measurementId: "G-X73HJ51Q6E"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const SUBJECTS = [
  "PENDIDIKAN AGAMA", "PENDIDIKAN PANCASILA", "BAHASA INDONESIA",
  "MATEMATIKA", "BAHASA INGGRIS", "PENJASORKES", "SEJARAH", 
  "SENI BUDAYA", "MULOK (BAHASA JAWA)", "BIOLOGI", "FISIKA", 
  "KIMIA", "MATEMATIKA TK. LANJUT", "PRAKARYA", "INFORMATIKA", 
  "EKONOMI", "SOSIOLOGI", "BAHASA JERMAN", "GEOGRAFI"
];

const ROLES = { TEACHER: 'teacher', STUDENT: 'student' };

const STUDENT_DB = [
  { id: 's1', nis: '8255', fullName: 'ABIFAEYZA MUHAMMAD DYAURRAHMAN', password: '8255', gender: 'L', class: 'XI 3' },
  { id: 's2', nis: '8257', fullName: 'ABIYYU NAUFAL ZAKY ASNAR', password: '8257', gender: 'L', class: 'XI 3' },
  { id: 's3', nis: '8273', fullName: 'AISYAH ZAHIRA', password: '8273', gender: 'P', class: 'XI 3' },
  { id: 's4', nis: '8566', fullName: 'ALDO VANTINALDO', password: '8566', gender: 'L', class: 'XI 3' },
  { id: 's5', nis: '8290', fullName: 'ANANTA PRATAMA', password: '8290', gender: 'L', class: 'XI 3' },
  { id: 's6', nis: '8296', fullName: 'ANISAH PRATIWI', password: '8296', gender: 'P', class: 'XI 3' },
  { id: 's7', nis: '8315', fullName: 'BACHRALFRIDHO REYSHADIN ILMAN', password: '8315', gender: 'L', class: 'XI 3' },
  { id: 's8', nis: '8317', fullName: 'BENI RAIHAN ADRIANSYAH', password: '8317', gender: 'L', class: 'XI 3' },
  { id: 's9', nis: '8338', fullName: 'DEA KAHAYA AISHAWA', password: '8338', gender: 'P', class: 'XI 3' },
  { id: 's10', nis: '8346', fullName: 'DIRGAHAYU RISKA RAMADANI', password: '8346', gender: 'P', class: 'XI 3' },
  { id: 's11', nis: '8365', fullName: 'FAWWAZKA FALAJ WAHANDY', password: '8365', gender: 'L', class: 'XI 3' },
  { id: 's12', nis: '8374', fullName: 'GALUH AVRIL DINDA ZASKIA', password: '8374', gender: 'P', class: 'XI 3' },
  { id: 's13', nis: '8387', fullName: 'JOSEPH KENZIE SURYA WIJAYA', password: '8387', gender: 'L', class: 'XI 3' },
  { id: 's14', nis: '8404', fullName: 'LIVINA MARIA ASHRAEL', password: '8404', gender: 'P', class: 'XI 3' },
  { id: 's15', nis: '8406', fullName: 'M. AHNAF RAMADHANI', password: '8406', gender: 'L', class: 'XI 3' },
  { id: 's16', nis: '8426', fullName: 'MOCHAMAD NURIL MAHMUDI AL TAZAM BILLAH', password: '8426', gender: 'L', class: 'XI 3' },
  { id: 's17', nis: '8433', fullName: 'MOHAMMAD ADAM RAYLIANSYAH', password: '8433', gender: 'L', class: 'XI 3' },
  { id: 's18', nis: '8439', fullName: 'MUHAMMAD ALDO RIZQIANSYAH', password: '8439', gender: 'L', class: 'XI 3' },
  { id: 's19', nis: '8450', fullName: 'MUHAMMAD HENDRIK.A.P', password: '8450', gender: 'L', class: 'XI 3' },
  { id: 's20', nis: '8571', fullName: 'MUHAMMAD IZZULIL HAQ', password: '8571', gender: 'L', class: 'XI 3' },
  { id: 's21', nis: '8461', fullName: 'MUHAMMAD SYAUQIL JINAN', password: '8461', gender: 'L', class: 'XI 3' },
  { id: 's22', nis: '8462', fullName: 'MUHAMMAD WAHYU AL AKBAR', password: '8462', gender: 'L', class: 'XI 3' },
  { id: 's23', nis: '8464', fullName: 'MUKHAMMAD RIZQI YAHYA', password: '8464', gender: 'L', class: 'XI 3' },
  { id: 's24', nis: '8476', fullName: 'NAVISYA AURA MADA', password: '8476', gender: 'P', class: 'XI 3' },
  { id: 's25', nis: '8483', fullName: 'NESSA ACHDIA MAGDALENA TUNGGADEWI', password: '8483', gender: 'P', class: 'XI 3' },
  { id: 's26', nis: '8573', fullName: 'OCTAVIAN AMRULLAH', password: '8573', gender: 'L', class: 'XI 3' },
  { id: 's27', nis: '8513', fullName: 'REIVALDIANO BINTANG MAHARDIKA', password: '8513', gender: 'L', class: 'XI 3' },
  { id: 's28', nis: '8516', fullName: 'REVANO ARDIANSA PUTRA RAMADANI', password: '8516', gender: 'L', class: 'XI 3' },
  { id: 's29', nis: '8519', fullName: 'RIFQI ATHALLAH SYAH', password: '8519', gender: 'L', class: 'XI 3' },
  { id: 's30', nis: '8522', fullName: 'RIZA AKBAR ALMUQSITH', password: '8522', gender: 'L', class: 'XI 3' },
  { id: 's31', nis: '8524', fullName: 'RIZKI ANDI ABDILLAH', password: '8524', gender: 'L', class: 'XI 3' },
  { id: 's32', nis: '8530', fullName: 'SALSA BIEANKA FEBITAMA', password: '8530', gender: 'P', class: 'XI 3' },
  { id: 's33', nis: '8544', fullName: 'TIARA VIONA VIRDAUS', password: '8544', gender: 'P', class: 'XI 3' },
  { id: 's34', nis: '8559', fullName: 'YOSSI AMRU AT-TAUFIK', password: '8559', gender: 'L', class: 'XI 3' },
  { id: 's35', nis: '8562', fullName: 'ZALFA NAIDIA NATASYA', password: '8562', gender: 'P', class: 'XI 3' },
  { id: 's36', nis: '8576', fullName: 'ZASKIA FAIDA AZMI', password: '8576', gender: 'P', class: 'XI 3' },
  { id: 's37', nis: '8258', fullName: 'ACHMAD FAUZAN DWI GHAZALAH', password: '8258', gender: 'L', class: 'XI 4' },
  { id: 's38', nis: '8262', fullName: 'ADINDA LAILATUZ ZUHRO', password: '8262', gender: 'P', class: 'XI 4' },
  { id: 's39', nis: '8268', fullName: 'AHMAD ELMAN NAFI GUNARTO', password: '8268', gender: 'L', class: 'XI 4' },
  { id: 's40', nis: '8292', fullName: 'ANGGA RIZKY PUTRA SETIAWAN', password: '8292', gender: 'L', class: 'XI 4' },
  { id: 's41', nis: '8301', fullName: 'ARKA DAEGAL ATMA JAYA', password: '8301', gender: 'L', class: 'XI 4' },
  { id: 's42', nis: '8313', fullName: 'AZIZ AHMAD MUDHAKAR', password: '8313', gender: 'L', class: 'XI 4' },
  { id: 's43', nis: '8314', fullName: 'AZLAN RIZQI FEBRIANSYAH', password: '8314', gender: 'L', class: 'XI 4' },
  { id: 's44', nis: '8319', fullName: 'BIANCHA VALENCIA ARIFIZANTY.P', password: '8319', gender: 'P', class: 'XI 4' },
  { id: 's45', nis: '8325', fullName: 'CATRIN AYU MAHESYA', password: '8325', gender: 'P', class: 'XI 4' },
  { id: 's46', nis: '8326', fullName: 'CHALLYSTA ZABANIYAH HOSHI SUSISCO', password: '8326', gender: 'P', class: 'XI 4' },
  { id: 's47', nis: '8327', fullName: 'CHAREN VERONICA KUSUMA', password: '8327', gender: 'P', class: 'XI 4' },
  { id: 's48', nis: '8334', fullName: 'DAHANA SAIKATZU ALBARIZY', password: '8334', gender: 'L', class: 'XI 4' },
  { id: 's49', nis: '8337', fullName: 'DAVIN DWI DARMA', password: '8337', gender: 'L', class: 'XI 4' },
  { id: 's50', nis: '8341', fullName: 'DEVANDIO RIDHO AL KHAFIDZ', password: '8341', gender: 'L', class: 'XI 4' },
  { id: 's51', nis: '8352', fullName: 'ELFITRI SUGI PRIHATI', password: '8352', gender: 'P', class: 'XI 4' },
  { id: 's52', nis: '8381', fullName: 'ISLAUKHA NUZRILIA', password: '8381', gender: 'P', class: 'XI 4' },
  { id: 's53', nis: '8407', fullName: 'M. ABYAZ MAULIDI AL BALAWI', password: '8407', gender: 'L', class: 'XI 4' },
  { id: 's54', nis: '8429', fullName: 'MOCHAMMAD IBNU AHLUL A\'FA', password: '8429', gender: 'L', class: 'XI 4' },
  { id: 's55', nis: '8435', fullName: 'MUHAMAD SYIAM SEPTIAN SYAH', password: '8435', gender: 'L', class: 'XI 4' },
  { id: 's56', nis: '8444', fullName: 'MUHAMMAD FACHRI AR RASYID', password: '8444', gender: 'L', class: 'XI 4' },
  { id: 's57', nis: '8447', fullName: 'MUHAMMAD FATHIR AFZA ANWAR', password: '8447', gender: 'L', class: 'XI 4' },
  { id: 's58', nis: '8452', fullName: 'MUHAMMAD IRFAN', password: '8452', gender: 'L', class: 'XI 4' },
  { id: 's59', nis: '8455', fullName: 'MUHAMMAD RAGAN ENGGRIYANG', password: '8455', gender: 'L', class: 'XI 4' },
  { id: 's60', nis: '8456', fullName: 'MUHAMMAD RIFKY ARIFUDIN', password: '8456', gender: 'L', class: 'XI 4' },
  { id: 's61', nis: '8458', fullName: 'MUHAMMAD SATRIA MAULANA', password: '8458', gender: 'L', class: 'XI 4' },
  { id: 's62', nis: '8471', fullName: 'NAJWA ANINDYA BILQIS RIZKIYUDIN', password: '8471', gender: 'P', class: 'XI 4' },
  { id: 's63', nis: '8477', fullName: 'NAYAKA MAULANA AZKA SYARIF', password: '8477', gender: 'L', class: 'XI 4' },
  { id: 's64', nis: '8485', fullName: 'NIKMA FATIHAH OCEAN HANANI', password: '8485', gender: 'P', class: 'XI 4' },
  { id: 's65', nis: '8493', fullName: 'NURUS SA\'IIDATUL HAQIQI', password: '8493', gender: 'P', class: 'XI 4' },
  { id: 's66', nis: '8502', fullName: 'RAFAEL ANGGORO', password: '8502', gender: 'L', class: 'XI 4' },
  { id: 's67', nis: '8505', fullName: 'RAHARDIAN PUTRA RAYA ALBANI', password: '8505', gender: 'L', class: 'XI 4' },
  { id: 's68', nis: '8509', fullName: 'RASYA ISLAMI HEPPY PRATAMA', password: '8509', gender: 'L', class: 'XI 4' },
  { id: 's69', nis: '8517', fullName: 'REZA TANGGUH SAGARA', password: '8517', gender: 'L', class: 'XI 4' },
  { id: 's70', nis: '8534', fullName: 'SEVILLA MAHARANI', password: '8534', gender: 'P', class: 'XI 4' },
  { id: 's71', nis: '8548', fullName: 'VANIA EKA AMANDA PUTRI', password: '8548', gender: 'P', class: 'XI 4' },
  { id: 's72', nis: '8553', fullName: 'WHISNU ADI PRASETYO', password: '8553', gender: 'L', class: 'XI 4' }
];

const TEACHER_DB = [
  { id: 't1', piagamNumber: '1234/HGN/001', fullName: 'Ahmad, S.Pd. M.T.', password: '001' },
  { id: 't2', piagamNumber: '1234/HGN/002', fullName: 'Dra. Siti Aminah', password: '002' },
  { id: 't3', piagamNumber: '1234/HGN/003', fullName: 'Drs. Bambang Suparto', password: '003' },
  { id: 't4', piagamNumber: '1234/HGN/004', fullName: 'Drs. Nur Slamet M.Pdi', password: '004' },
  { id: 't5', piagamNumber: '1234/HGN/005', fullName: 'Budi Triono S.Pd.', password: '005' },
  { id: 't6', piagamNumber: '1234/HGN/006', fullName: 'Iin Winarti S.Pd.', password: '006' },
  { id: 't7', piagamNumber: '1234/HGN/007', fullName: 'Nur Romlah S.Pd.', password: '007' },
  { id: 't8', piagamNumber: '1234/HGN/008', fullName: 'Sunardyah Nugraningsih S.Pd', password: '008' },
  { id: 't9', piagamNumber: '1234/HGN/009', fullName: 'Zulaihah S.Pd', password: '009' },
  { id: 't10', piagamNumber: '1234/HGN/010', fullName: 'Titik Tustiani S.Pd.', password: '010' },
  { id: 't11', piagamNumber: '1234/HGN/011', fullName: 'Norhayati S.Pd.', password: '011' },
  { id: 't12', piagamNumber: '1234/HGN/012', fullName: 'Himawati Adiapsari M.Pd', password: '012' },
  { id: 't13', piagamNumber: '1234/HGN/013', fullName: 'Ida Nurhayati S.Pd.', password: '013' },
  { id: 't14', piagamNumber: '1234/HGN/014', fullName: 'Mu’alim S.Pd. M.Pd', password: '014' },
  { id: 't15', piagamNumber: '1234/HGN/015', fullName: 'Ihdiyati Nurhayinah S.Pd.', password: '015' },
  { id: 't16', piagamNumber: '1234/HGN/016', fullName: 'Retno Bintarti S.Pd.', password: '016' },
  { id: 't17', piagamNumber: '1234/HGN/017', fullName: 'Drs. Samsudi M.Kp', password: '017' },
  { id: 't18', piagamNumber: '1234/HGN/018', fullName: 'Zulkifli Zakaria M.Pd', password: '018' },
  { id: 't19', piagamNumber: '1234/HGN/019', fullName: 'Drs. Hakim Prayitno', password: '019' },
  { id: 't20', piagamNumber: '1234/HGN/020', fullName: 'Putut Wahyu Widodo S.Pd. M.Pd', password: '020' },
  { id: 't21', piagamNumber: '1234/HGN/021', fullName: 'Moh. Ali Wardoyo S.Si', password: '021' },
  { id: 't22', piagamNumber: '1234/HGN/022', fullName: 'Ika Widyastutik S.Pd', password: '022' },
  { id: 't23', piagamNumber: '1234/HGN/023', fullName: 'Lukmanuddin A.Md', password: '023' },
  { id: 't24', piagamNumber: '1234/HGN/024', fullName: 'Drs. Didik Eko Iswahjoedi', password: '024' },
  { id: 't25', piagamNumber: '1234/HGN/025', fullName: 'Fajar Indra Kurniawan M.Kom', password: '025' },
  { id: 't26', piagamNumber: '1234/HGN/026', fullName: 'Umi Nuril Arifah S.Si.', password: '026' },
  { id: 't27', piagamNumber: '1234/HGN/027', fullName: 'Eka Rekatawati S.Pd.', password: '027' },
  { id: 't28', piagamNumber: '1234/HGN/028', fullName: 'Achmad Rifa\'i S.Pd.', password: '028' },
  { id: 't29', piagamNumber: '1234/HGN/029', fullName: 'Linda Widyastutik S.Pd.', password: '029' },
  { id: 't30', piagamNumber: '1234/HGN/030', fullName: 'Indahwati S.Pd.', password: '030' },
  { id: 't31', piagamNumber: '1234/HGN/031', fullName: 'Ismiatur Rodlijana S.Pd.', password: '031' },
  { id: 't32', piagamNumber: '1234/HGN/032', fullName: 'Setyo Wawan A S.Pd M.Pd', password: '032' },
  { id: 't33', piagamNumber: '1234/HGN/033', fullName: 'Drs. Bambang Efendi M.Pd', password: '033' },
  { id: 't34', piagamNumber: '1234/HGN/034', fullName: 'Tri Endah Ernawati S.Pd', password: '034' },
  { id: 't35', piagamNumber: '1234/HGN/035', fullName: 'Siti RahayuM.Pd', password: '035' },
  { id: 't36', piagamNumber: '1234/HGN/036', fullName: 'Emi Nurwahyuningsih S.Pd.M.Pd', password: '036' },
  { id: 't37', piagamNumber: '1234/HGN/037', fullName: 'Dwi Mei Endrastutik S.Pd', password: '037' },
  { id: 't38', piagamNumber: '1234/HGN/038', fullName: 'Praneswi Palupita Sari S.Pd', password: '038' },
  { id: 't39', piagamNumber: '1234/HGN/039', fullName: 'Kristiawan Dwi Cahyono S.Pd. M.Pdi', password: '039' },
  { id: 't40', piagamNumber: '1234/HGN/040', fullName: 'Fendy Suhartanto S.Pd', password: '040' },
  { id: 't41', piagamNumber: '1234/HGN/041', fullName: 'Ratna Damayanti Gita R. S.Pd', password: '041' },
  { id: 't42', piagamNumber: '1234/HGN/042', fullName: 'Anik Noerachini S.Pd', password: '042' },
  { id: 't43', piagamNumber: '1234/HGN/043', fullName: 'Jhoni Agustiawan Emadeju S.Pd', password: '043' },
  { id: 't44', piagamNumber: '1234/HGN/044', fullName: 'Nur Ida Ayu Fitriana S.Pd.I', password: '044' },
  { id: 't45', piagamNumber: '1234/HGN/045', fullName: 'Yulian Nur H. S.Pd', password: '045' },
  { id: 't46', piagamNumber: '1234/HGN/046', fullName: 'Danar Ilafi S.Pd', password: '046' },
  { id: 't47', piagamNumber: '1234/HGN/047', fullName: 'Ika Puspita S.Pd', password: '047' },
  { id: 't48', piagamNumber: '1234/HGN/046', fullName: 'Danar Ilafi S.Pd', password: '046' },
  { id: 't49', piagamNumber: '1234/HGN/047', fullName: 'Ika Puspita S.Pd', password: '047' },
  { id: 't50', piagamNumber: '1234/HGN/048', fullName: 'Herman Shalahuddin S.Pd', password: '048' },
  { id: 't51', piagamNumber: '1234/HGN/049', fullName: 'Achmad Rif\'an Maulana M.Si', password: '049' },
  { id: 't52', piagamNumber: '1234/HGN/050', fullName: 'Sunariati S.Pd', password: '050' },
  { id: 't53', piagamNumber: '1234/HGN/051', fullName: 'Fitrya Khoirunnisa S.Pd', password: '051' },
  { id: 't54', piagamNumber: '1234/HGN/052', fullName: 'Emilda Fajriyah S.P.d', password: '052' },
  { id: 't55', piagamNumber: '1234/HGN/053', fullName: 'Tantry Padhmasari S.Pd M.Pdi', password: '053' },
  { id: 't56', piagamNumber: '1234/HGN/054', fullName: 'Ika Widyawati M.Pd', password: '054' },
  { id: 't57', piagamNumber: '1234/HGN/055', fullName: 'Cynthia Aviva S.Pd', password: '055' },
  { id: 't58', piagamNumber: '1234/HGN/056', fullName: 'Davin Indra S S.Or', password: '056' },
  { id: 't59', piagamNumber: '1234/HGN/057', fullName: 'Dra. Zufa Choirunnisak', password: '057' },
  { id: 't60', piagamNumber: '1234/HGN/058', fullName: 'Achmad sarief Yusuf S.Pd', password: '058' }
];

const INITIAL_QUESTIONS = [
  {
    id: 'q1',
    type: 'forum',
    title: 'How to calculate standard deviation?',
    content: 'I am confused about the N-1 vs N in the denominator. When do we use which?',
    subject: 'MATEMATIKA',
    author: 'ABIFAEYZA MUHAMMAD DYAURRAHMAN',
    authorId: 's1',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    votes: 12,
    className: 'XI 3'
  }
];

const INITIAL_ANSWERS = [
  {
    id: 'a1',
    questionId: 'q1',
    text: 'Use N-1 (Bessel\'s correction) for a sample, and N for the entire population.',
    author: 'ABIYYU NAUFAL ZAKY ASNAR',
    authorId: 's2',
    isVerified: true,
    votes: 8,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  }
];

const MATH_SUBJECTS = ["MATEMATIKA", "MATEMATIKA TK. LANJUT"];
const MATH_SYMBOLS = ['+', '−', '×', '÷', '=', '≠', '±', '√', '²', '³', '^', 'π', '∞', '≤', '≥', '(', ')', '∫', 'Σ', 'lim', '→'];

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

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostSubject, setNewPostSubject] = useState(SUBJECTS[0]);
  const [answerText, setAnswerText] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); // State for mobile sidebar

  const postContentRef = useRef(null);
  const answerTextRef = useRef(null);

  const insertSymbol = (ref, symbol, setter) => {
    const textarea = ref.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    const newValue = before + symbol + after;

    setter(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + symbol.length, start + symbol.length);
    }, 0);
  };

  // Real-time synchronization with Firestore
  useEffect(() => {
    const qQuestions = query(collection(db, "questions"), orderBy("createdAt", "desc"));
    const unsubscribeQuestions = onSnapshot(qQuestions, (snapshot) => {
      const questData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()?.toISOString() || new Date().toISOString()
      }));
      setQuestions(questData.length > 0 ? questData : INITIAL_QUESTIONS);
    });

    const qAnswers = query(collection(db, "answers"), orderBy("createdAt", "asc"));
    const unsubscribeAnswers = onSnapshot(qAnswers, (snapshot) => {
      const ansData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()?.toISOString() || new Date().toISOString()
      }));
      setAnswers(ansData.length > 0 ? ansData : INITIAL_ANSWERS);
    });

    return () => {
      unsubscribeQuestions();
      unsubscribeAnswers();
    };
  }, []);

  const stats = useMemo(() => {
    if (!currentUser) return { asked: 0, answered: 0, verified: 0 };
    
    if (currentUser.role === ROLES.TEACHER) {
      // Teacher stats: Platform-wide overview
      return { 
        asked: questions.length, 
        answered: answers.length 
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
    const loginField = loginRole === ROLES.TEACHER ? 'piagamNumber' : 'nis';
    const userMatch = database.find(u => u[loginField] === username && u.password === password);

    if (userMatch) {
      setCurrentUser({
        id: userMatch.id,
        name: userMatch.fullName,
        role: loginRole,
        gender: loginRole === ROLES.STUDENT ? userMatch.gender : null,
        className: loginRole === ROLES.TEACHER ? 'All Classes' : userMatch.class
      });
    } else {
      const fieldLabel = loginRole === ROLES.TEACHER ? 'Piagam Number' : 'NIS';
      setLoginError(`Invalid ${fieldLabel} or password for the ${loginRole} portal.`);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginStep('selection');
    setViewingQuestion(null);
    setUsername('');
    setPassword('');
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const newPost = {
      type: activeTab,
      title: newPostTitle,
      content: newPostContent,
      subject: newPostSubject,
      author: currentUser.name,
      authorId: currentUser.id,
      createdAt: serverTimestamp(),
      votes: 0,
      className: currentUser.role === ROLES.TEACHER ? 'All Classes' : currentUser.className
    };
    
    await addDoc(collection(db, "questions"), newPost);
    setIsModalOpen(false);
    setNewPostTitle('');
    setNewPostContent('');
  };

  const handleDeletePost = async (id, e) => {
    if (e) e.stopPropagation();
    if (currentUser.role === ROLES.TEACHER) {
      await deleteDoc(doc(db, "questions", id));
      // Note: In a production app, you'd also delete associated answers
      if (viewingQuestion?.id === id) setViewingQuestion(null);
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (currentUser.role === ROLES.TEACHER) {
      await deleteDoc(doc(db, "answers", answerId));
    }
  };

  const handleVerifyAnswer = async (answerId) => {
    if (currentUser.role !== ROLES.TEACHER) return;
    const answer = answers.find(a => a.id === answerId);
    await updateDoc(doc(db, "answers", answerId), {
      isVerified: !answer.isVerified
    });
  };

  const handlePostAnswer = async (e) => {
    e.preventDefault();
    if (!answerText.trim()) return;
    const newAns = {
      questionId: viewingQuestion.id,
      text: answerText,
      author: currentUser.name,
      authorId: currentUser.id,
      isVerified: false,
      votes: 0,
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, "answers"), newAns);
    setAnswerText('');
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            q.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === 'All' || q.subject === selectedSubject;
      const matchesType = q.type === activeTab;
      // Teachers see everything; Students see their class or global posts
      const matchesClass = currentUser?.role === ROLES.TEACHER || 
                           q.className === currentUser?.className ||
                           q.className === 'All Classes';
      return matchesSearch && matchesSubject && matchesType && matchesClass;
    });
  }, [questions, searchQuery, selectedSubject, activeTab, currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-200 flex items-center justify-center p-4 font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-[#f8fafc] rounded-[40px] shadow-2xl p-6 sm:p-10 border border-white/50 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {loginStep === 'selection' ? (
            <motion.div 
              key="selection" 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="text-center space-y-6 sm:space-y-8">
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
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setLoginRole(ROLES.STUDENT); setLoginStep('login'); }}
                  className="w-full group flex items-center p-5 bg-white/60 hover:bg-white rounded-3xl border border-slate-200 transition-all text-left shadow-sm"
                >
                  <div className="bg-indigo-100 p-3 rounded-xl mr-4 text-indigo-600"><User size={24} /></div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800">Student Portal</h3>
                    <p className="text-xs text-slate-400">Learn together</p>
                  </div>
                  <ChevronRight size={20} className="text-slate-300" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setLoginRole(ROLES.TEACHER); setLoginStep('login'); }}
                  className="w-full group flex items-center p-5 bg-white/60 hover:bg-white rounded-3xl border border-slate-200 transition-all text-left shadow-sm"
                >
                  <div className="bg-emerald-100 p-3 rounded-xl mr-4 text-emerald-600"><LayoutDashboard size={24} /></div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800">Teacher Portal</h3>
                    <p className="text-xs text-slate-400">Validate knowledge</p>
                  </div>
                  <ChevronRight size={20} className="text-slate-300" />
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="duration-300"
            >
              <button 
                onClick={() => { setLoginStep('selection'); setLoginError(''); }}
                className="flex items-center text-slate-500 hover:text-indigo-600 text-xs font-black uppercase tracking-widest mb-6"
              >
                <ArrowLeft size={16} className="mr-2" /> Back
              </button>
              <h2 className="text-2xl font-black text-slate-800 capitalize mb-6">{loginRole} Login</h2>
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    {loginRole === ROLES.STUDENT ? 'NIS' : 'Piagam Number'}
                  </label>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none" required />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none" required />
                </div>
                {loginError && <p className="text-red-500 text-xs font-bold">{loginError}</p>}
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl">Authenticate</motion.button>
              </form>
            </motion.div>
          )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      {/* Mobile Sidebar Backdrop */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex-col transition-transform duration-300 ease-in-out ${isMobileSidebarOpen ? 'translate-x-0 flex' : '-translate-x-full hidden'} lg:flex lg:relative lg:translate-x-0`}>
        <div className="p-6 overflow-y-auto flex-1 flex flex-col">
          {/* Mobile Close Button and Logo */}
          <div className="flex items-center justify-between lg:hidden mb-6">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
              <span className="text-xl font-black tracking-tight">Questoria</span>
            </div>
            <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 text-slate-500 hover:text-red-500">
              <X size={24} />
            </button>
          </div>
          {/* Desktop Logo */}
          <div className="hidden lg:flex items-center space-x-3 mb-10">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
            <span className="text-xl font-black tracking-tight">Questoria</span>
            </div>

          <nav className="space-y-1 mb-8 relative">
            {['forum', 'exercise'].map((tab) => (
              <motion.button 
                key={tab}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setActiveTab(tab); setViewingQuestion(null); }} 
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl font-bold transition-colors relative ${activeTab === tab ? 'text-indigo-600' : 'text-slate-500 hover:bg-slate-50/50'}`}
              >
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeTabNav"
                    className="absolute inset-0 bg-indigo-50 rounded-2xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {tab === 'forum' ? <MessageSquare size={20} /> : <BookOpen size={20} />}
                <span className="capitalize">{tab}</span>
              </motion.button>
            ))}
          </nav>

          <div className="mb-10">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-4"
            >
              Subject Filter
            </motion.p>
            <div className="space-y-1">
              <button onClick={() => setSelectedSubject('All')} className={`w-full text-left px-4 py-2 rounded-xl text-sm font-bold ${selectedSubject === 'All' ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-500'}`}>All Subjects</button>
              {SUBJECTS.slice(0, 8).map(sub => (
                <button key={sub} onClick={() => setSelectedSubject(sub)} className={`w-full text-left px-4 py-2 rounded-xl text-sm font-bold truncate ${selectedSubject === sub ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-500'}`}>{sub}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Statistics Block */}
        <div className="p-4 border-t border-slate-100 bg-white space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[24px] p-5 text-white shadow-xl shadow-indigo-200 relative overflow-hidden group"
          >
            <Sparkles className="absolute -right-2 -top-2 opacity-20 group-hover:rotate-12 transition-transform" size={48} />
            <p className="text-[10px] font-black opacity-80 uppercase tracking-[0.2em] mb-4">
              {currentUser.role === ROLES.TEACHER ? 'Academy Insights' : 'Level Progress'}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-2xl font-black">{stats.asked}</p>
                <p className="text-[9px] font-bold opacity-70 uppercase tracking-widest">Questions</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-black">{stats.answered}</p>
                <p className="text-[9px] font-bold opacity-70 uppercase tracking-widest">Answers</p>
              </div>
            </div>
            {currentUser.role === ROLES.STUDENT && (
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award size={14} className="text-yellow-400" />
                  <span className="text-[9px] font-black uppercase">Verified Mastery</span>
                </div>
                <span className="text-sm font-black">{stats.verified}</span>
              </div>
            )}
          </motion.div>

          <div className="space-y-3">
            <motion.div 
              whileHover={{ x: 5 }}
              className="flex items-center space-x-3 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-default"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black shrink-0 shadow-inner ${
                currentUser.role === ROLES.TEACHER ? 'bg-slate-100 text-slate-500' :
                currentUser.gender === 'L' ? 'bg-blue-500 text-white' : 'bg-pink-500 text-white'
              }`}>
                {currentUser.name[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-slate-800 truncate leading-none mb-1">{currentUser.name}</p>
                <div className="flex items-center space-x-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${currentUser.role === ROLES.TEACHER ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{currentUser.role}</p>
                </div>
              </div>
            </motion.div>

            <button 
              onClick={handleLogout} 
              className="w-full flex items-center justify-center space-x-2 px-4 py-4 text-red-500 font-black uppercase tracking-widest text-[10px] hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100"
            >
              <LogOut size={14} /><span>Secure Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10">
          {/* Hamburger menu for mobile */}
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-500 hover:text-indigo-600 mr-4"
          >
            <Menu size={24} />
          </button>
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search concepts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl outline-none font-medium text-sm" />
          </div>
          <div className="flex items-center space-x-4 ml-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-slate-400 uppercase">{currentUser.className}</p>
              <p className="text-xs font-bold text-slate-800">Active View</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)} 
              className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg"
            >
              <PlusCircle size={20} /><span className="hidden sm:inline">New Post</span>
            </motion.button>
          </div>
        </header>

        {/* AnimatePresence for tab content */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab} // Key changes when activeTab changes, triggering exit/enter animations
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-4 sm:p-8 flex-1" // Ensure it takes up space and allows flex-1 to work
          >
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
                  {MATH_SUBJECTS.includes(viewingQuestion.subject) && (
                    <div className="flex flex-wrap gap-2 mb-3 p-2 bg-slate-50 rounded-xl">
                      {MATH_SYMBOLS.map(sym => (
                        <button key={sym} type="button" onClick={() => insertSymbol(answerTextRef, sym, setAnswerText)} className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 font-bold transition-all shadow-sm text-sm">
                          {sym}
                        </button>
                      ))}
                    </div>
                  )}
                  <textarea 
                    ref={answerTextRef}
                    value={answerText} 
                    onChange={e => setAnswerText(e.target.value)} 
                    className="w-full p-4 bg-slate-50 rounded-2xl outline-none min-h-[120px] focus:ring-2 ring-indigo-500/20" 
                    placeholder="Contribute your knowledge..." 
                  />
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

              <motion.div layout className="grid gap-6 auto-rows-min">
                <AnimatePresence mode='popLayout'>
                {filteredQuestions.length > 0 ? filteredQuestions.map((q) => (
                  <motion.div 
                    key={q.id} 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    onClick={() => setViewingQuestion(q)} 
                    className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-shadow cursor-pointer group relative">
                    {currentUser.role === ROLES.TEACHER && (
                      <button onClick={(e) => handleDeletePost(q.id, e)} className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all">
                        <Trash2 size={18} />
                      </button>
                    )}
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-full">{q.subject}</span>
                    <h3 className="text-xl font-black text-slate-800 mt-3 group-hover:text-indigo-600 transition-all">{q.title}</h3>
                    <p className="text-slate-500 line-clamp-2 mt-2 font-medium">{q.content}</p>
                    <div className="mt-6 flex items-center justify-between pt-6 border-t border-slate-50">
                      <div className="flex items-center space-x-2">
                        <motion.div whileHover={{ rotate: 15 }} className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-bold">{q.author[0]}</motion.div>
                        <div className="text-xs font-bold text-slate-400">By {q.author}</div>
                      </div>
                      <div className="flex space-x-4 text-slate-400">
                        <div className="flex items-center space-x-1.5"><MessageSquare size={14} /> <span className="text-xs font-black">{answers.filter(a => a.questionId === q.id).length}</span></div>
                        {answers.some(a => a.questionId === q.id && a.isVerified) && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle size={14} className="text-emerald-500" /></motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[40px] bg-slate-50/50"
                  >
                    <Search className="mx-auto text-slate-300 mb-4" size={48} />
                    <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest">No resources found</h3>
                    <p className="text-slate-400">Be the first to contribute to this bank!</p>
                  </motion.div>
                )}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
          </motion.div>
        </AnimatePresence>
      </main>

      {}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-lg rounded-[40px] p-6 sm:p-10 shadow-2xl origin-bottom"
            >
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
                
                {MATH_SUBJECTS.includes(newPostSubject) && (
                  <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-xl">
                    {MATH_SYMBOLS.map(sym => (
                      <button key={sym} type="button" onClick={() => insertSymbol(postContentRef, sym, setNewPostContent)} className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 font-bold transition-all shadow-sm text-sm">
                        {sym}
                      </button>
                    ))}
                  </div>
                )}

                <textarea 
                  ref={postContentRef}
                  value={newPostContent} 
                  onChange={e => setNewPostContent(e.target.value)} 
                  className="w-full p-4 bg-slate-50 rounded-2xl min-h-[120px] outline-none border-none" 
                  placeholder="Provide details, steps, or context..." 
                  required 
                />
                <div className="flex space-x-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold hover:bg-slate-200 transition-colors">Cancel</button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200"
                  >
                    Publish Now
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}