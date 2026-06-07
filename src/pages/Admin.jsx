import React, { useState, useEffect } from 'react';
import { Lock, LogOut, Check, Trash2, Edit3, Plus, Image as ImageIcon, BarChart3, Database, X, Calendar, Award, Users, Target, Settings, Link as LinkIcon, AlertCircle, FileText } from 'lucide-react';

const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        // Compress as JPEG with 0.7 quality to conserve localStorage
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('stats'); // 'stats' | 'events' | 'achievements' | 'execomm' | 'committees' | 'gallery' | 'researchpapers' | 'news'

  // Registration States
  const [isRegistering, setIsRegistering] = useState(false);
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  // Stats / Site Settings State
  const [memberCount, setMemberCount] = useState('45');
  const [eventsCount, setEventsCount] = useState('75+');
  const [awardsCount, setAwardsCount] = useState('18+');
  const [papersCount, setPapersCount] = useState('15');
  const [mission, setMission] = useState('');
  const [vision, setVision] = useState('');
  const [tickerNoticesText, setTickerNoticesText] = useState('');
  const [statsSaved, setStatsSaved] = useState(false);

  // Gallery CRUD State
  const [galleryItems, setGalleryItems] = useState([]);

  // Events CRUD State
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  // Achievements CRUD State
  const [achievements, setAchievements] = useState([]);

  // Execomm CRUD State
  const [counselor, setCounselor] = useState({
    name: '', role: '', college: '', desc: '', email: '', linkedin: ''
  });
  const [execommMembers, setExecommMembers] = useState([]);
  const [counselorSaved, setCounselorSaved] = useState(false);

  // Committees CRUD State
  const [committees, setCommittees] = useState([]);

  // Research Papers CRUD State
  const [researchPapers, setResearchPapers] = useState([]);

  // Modal Control States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [modalType, setModalType] = useState('gallery'); // 'gallery' | 'event' | 'achievement' | 'member' | 'committee' | 'researchpaper' | 'news'
  const [currentItemId, setCurrentItemId] = useState(null);

  // Modal Form Inputs: Gallery
  const [formTitle, setFormTitle] = useState('');
  const [formCat, setFormCat] = useState('Workshop');
  const [formText, setFormText] = useState('');
  const [formImages, setFormImages] = useState([]);

  // Modal Form Inputs: Events
  const [eventTitle, setEventTitle] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  const [eventTag, setEventTag] = useState('Workshop');
  const [eventIsUpcoming, setEventIsUpcoming] = useState(true);
  const [eventLink, setEventLink] = useState('');
  const [eventHighlights, setEventHighlights] = useState('');

  // Modal Form Inputs: Achievements
  const [achTitle, setAchTitle] = useState('');
  const [achCategory, setAchCategory] = useState('');
  const [achDesc, setAchDesc] = useState('');
  const [achIconType, setAchIconType] = useState('trophy');

  // Modal Form Inputs: Execomm Members
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState('');
  const [memberCategory, setMemberCategory] = useState('main');
  const [memberDesc, setMemberDesc] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberLinkedin, setMemberLinkedin] = useState('');

  // Modal Form Inputs: Committees
  const [commName, setCommName] = useState('');
  const [commDesc, setCommDesc] = useState('');
  const [commLead, setCommLead] = useState('');
  const [commCoLead, setCommCoLead] = useState('');
  const [commTeamCount, setCommTeamCount] = useState(10);

  // Modal Form Inputs: Research Papers
  const [paperTitle, setPaperTitle] = useState('');
  const [paperAuthors, setPaperAuthors] = useState('');
  const [paperCategory, setPaperCategory] = useState('IEEE');
  const [paperDesc, setPaperDesc] = useState('');
  const [paperYear, setPaperYear] = useState(new Date().getFullYear().toString());
  const [paperFile, setPaperFile] = useState(null);

  // Modal Form Inputs: News Items
  const [newsTitle, setNewsTitle] = useState('');
  const [newsSource, setNewsSource] = useState('');
  const [newsDate, setNewsDate] = useState('');
  const [newsSnippet, setNewsSnippet] = useState('');
  const [newsColor, setNewsColor] = useState('#f59e0b');
  const [newsImage, setNewsImage] = useState(null);

  // News CRUD State
  const [newsItems, setNewsItems] = useState([]);

  // Predefined defaults
  const defaultAdmins = [
    { email: 'sakthipranavs.24cse@kongu.edu', password: '123456' },
    { email: 'ieee@kongu.edu', password: 'admin123' }
  ];

  const defaultGallery = [
    { id: 1, title: "Flutter Bootcamp 2026", cat: "Workshop", text: "Students developing cross-platform applications." },
    { id: 2, title: "National Expo Presentation", cat: "Exhibition", text: "KEC SRC teams displaying agricultural automation solutions." },
    { id: 3, title: "WIE Career Panel", cat: "Seminar", text: "Interactive panel discussion with tech industry experts." },
    { id: 4, title: "SPS Embedded DSP Lab Session", cat: "Hands-on", text: "Coding digital filters on microcontrollers." },
    { id: 5, title: "GreenTech Hackathon Pitching", cat: "Hackathon", text: "Teams presenting prototypes to judges." },
    { id: 6, title: "Branch Executive Committee Meet", cat: "Meeting", text: "Faculty advisor and branch officers discussing yearly plans." },
  ];

  const defaultUpcomingEvents = [
    {
      id: 1,
      title: "Hands-on Workshop: Flutter Application Development",
      desc: "Learn to build cross-platform mobile applications from scratch. Topics include widgets, state management, and API integration. Open to all branches.",
      date: "June 12, 2026",
      time: "09:00 AM - 04:30 PM",
      venue: "Advanced Computing Lab, KEC",
      tag: "Workshop",
      link: "https://forms.gle/mockregister"
    },
    {
      id: 2,
      title: "GreenTech Hackathon 2026",
      desc: "A 24-hour national hackathon challenging student groups to solve sustainability problems using hardware prototypes or intelligent software.",
      date: "June 26-27, 2026",
      time: "Starting 10:00 AM",
      venue: "KEC Technology Business Incubator",
      tag: "Hackathon",
      link: "https://forms.gle/mockregister"
    },
    {
      id: 3,
      title: "IEEE Membership Awareness Drive",
      desc: "Learn about the benefits of IEEE student membership, research databases access, grants, societies, and international networking events.",
      date: "July 03, 2026",
      time: "02:00 PM - 04:00 PM",
      venue: "Seminar Hall, CSE Dept, KEC",
      tag: "Seminar",
      link: "https://forms.gle/mockregister"
    }
  ];

  const defaultPastEvents = [
    {
      id: 101,
      title: "Workshop on Digital Signal Processing & IoT",
      desc: "A 3-day practical bootcamp focusing on capturing and processing real-time sensor waveforms using ESP32 and DSP filtering algorithms.",
      date: "May 18, 2026",
      venue: "DSP Lab, ECE Dept, KEC",
      tag: "SPS Chapter",
      highlights: "50+ participants built smart ECG filter prototypes."
    },
    {
      id: 102,
      title: "WIE CodeQuest: Coding Bootcamp for Girls",
      desc: "A bootcamp dedicated to teaching web building, database structure, and frontend hosting to young female engineers.",
      date: "April 24, 2026",
      venue: "Internet Lab, KEC",
      tag: "WIE Group",
      highlights: "Participated by 80 girls, 5 projects were selected for incubation support."
    },
    {
      id: 103,
      title: "National Conference on Computing & Communication (NCCC 2026)",
      desc: "Flagship paper presentation event featuring research papers from student groups across the region, judged by Anna University faculty.",
      date: "March 15, 2026",
      venue: "Maharaja Auditorium, KEC",
      tag: "Conference",
      highlights: "30+ research papers published in local IEEE digital archives."
    },
    {
      id: 104,
      title: "Guest Lecture: Opportunities in Edge AI & TinyML",
      desc: "A seminar on running micro neural-network models directly on resource-constrained microcontrollers.",
      date: "February 12, 2026",
      venue: "Mechanical Dept Seminar Hall, KEC",
      tag: "Guest Lecture",
      highlights: "Delivered by senior R&D engineer from Intel India."
    }
  ];

  const defaultAchievements = [
    {
      id: 1,
      iconType: 'trophy',
      title: "Best Student Branch Award 2025",
      category: "Section-level Recognition",
      desc: "Recognized as the 'Most Active Student Branch' under the IEEE Madras Section for executing 70+ technical events, community drives, and registering 400+ members in 2025."
    },
    {
      id: 2,
      iconType: 'award',
      title: "First Prize - Anna University Project Expo",
      category: "Student Accomplishment",
      desc: "A team of IEEE KEC final year students won the 1st prize of ₹50,000 for their prototype 'Smart Assistive Glove for Quadriplegic Patients' sponsored by IEEE SPS & KEC SRC."
    },
    {
      id: 3,
      iconType: 'star',
      title: "IEEE SPS Travel Grant Recipient",
      category: "Global Travel Grant",
      desc: "SPS Student Chair Karthik Raja was awarded a full travel and accommodation grant to present his research on edge voice filtering at IEEE ICASSP 2025 in Seoul, South Korea."
    },
    {
      id: 4,
      iconType: 'sparkles',
      title: "Outstanding Student Volunteer Award",
      category: "Individual Recognition",
      desc: "Student Branch Chair Abhishek M. received the Outstanding Volunteer Award from the IEEE Madras Section for his leadership in hosting E-Waste awareness campaigns across Erode."
    }
  ];

  const defaultCounselor = {
    name: "Dr. A. Sheela",
    role: "IEEE KEC Student Branch Counselor",
    college: "Kongu Engineering College",
    desc: "Professor & Head, Department of Electrical & Electronics Engineering. Dr. Sheela guides the overall strategic direction of the IEEE Student Branch and operational societies.",
    email: "sheela.eee@kongu.ac.in",
    linkedin: "https://linkedin.com"
  };

  const defaultMembers = [
    {
      id: 1,
      name: "Abhishek M.",
      role: "Student Branch Chair",
      category: "main",
      desc: "Steers KEC Student Branch activities, ensuring technical exposure and volunteer training for all members.",
      email: "abhishek.ieee@kec.ac.in",
      linkedin: "https://linkedin.com"
    },
    {
      id: 2,
      name: "Sneha R.",
      role: "Student Branch Vice Chair",
      category: "main",
      desc: "Coordinates inter-departmental collaborations and manages event execution operations.",
      email: "sneha.ieee@kec.ac.in",
      linkedin: "https://linkedin.com"
    },
    {
      id: 3,
      name: "Harish K.",
      role: "Student Secretary",
      category: "main",
      desc: "Manages correspondence, documents meetings, and oversees the branch documentation archive.",
      email: "harish.ieee@kec.ac.in",
      linkedin: "https://linkedin.com"
    },
    {
      id: 4,
      name: "Naveen S.",
      role: "Student Treasurer",
      category: "main",
      desc: "Handles financial planning, seed funding requests, and audits event budgets.",
      email: "naveen.ieee@kec.ac.in",
      linkedin: "https://linkedin.com"
    },
    {
      id: 5,
      name: "Dharini P.",
      role: "Student Webmaster",
      category: "main",
      desc: "Maintains digital branch platforms, handles portals, and manages online publications.",
      email: "dharini.ieee@kec.ac.in",
      linkedin: "https://linkedin.com"
    },
    {
      id: 6,
      name: "Karthik Raja V.",
      role: "SPS Student Chapter Chair",
      category: "sps",
      desc: "Organizes training programs and lectures on digital signal, speech, and image processing.",
      email: "karthik.sps@kec.ac.in",
      linkedin: "https://linkedin.com"
    },
    {
      id: 7,
      name: "Priyanka S.",
      role: "SPS Vice Chair",
      category: "sps",
      desc: "Coordinates labs and design reviews for signal processing projects under KEC SRC.",
      email: "priyanka.sps@kec.ac.in",
      linkedin: "https://linkedin.com"
    },
    {
      id: 8,
      name: "Anand M.",
      role: "SPS Secretary",
      category: "sps",
      desc: "Handles documentation and communication for all Signal Processing Society events.",
      email: "anand.sps@kec.ac.in",
      linkedin: "https://linkedin.com"
    },
    {
      id: 9,
      name: "Shruthi G.",
      role: "WIE Affinity Group Chair",
      category: "wie",
      desc: "Leads mentorship and development programs for female students, promoting STEM pathways.",
      email: "shruthi.wie@kec.ac.in",
      linkedin: "https://linkedin.com"
    },
    {
      id: 10,
      name: "Divya K.",
      role: "WIE Vice Chair",
      category: "wie",
      desc: "Coordinates programming workshops, leadership meetups, and community coding sessions.",
      email: "divya.wie@kec.ac.in",
      linkedin: "https://linkedin.com"
    },
    {
      id: 11,
      name: "Kavya R.",
      role: "WIE Secretary",
      category: "wie",
      desc: "Maintains student branch WIE records and manages publicity for gender empowerment events.",
      email: "kavya.wie@kec.ac.in",
      linkedin: "https://linkedin.com"
    }
  ];

  const defaultCommittees = [
    {
      id: 1,
      name: "Technical Committee",
      desc: "Manages hardware training, coding hackathons, project incubation labs, and website updates.",
      lead: "Manoj Kumar K. (Final ECE)",
      coLead: "Sandhiya R. (Third CSE)",
      teamCount: 15
    },
    {
      id: 2,
      name: "Editorial & Content Committee",
      desc: "In charge of publishing monthly newsletters, event documentations, and press releases.",
      lead: "Abirami S. (Final EEE)",
      coLead: "Gautham V. (Third IT)",
      teamCount: 10
    },
    {
      id: 3,
      name: "Creative & Design Committee",
      desc: "Handles branding assets, designing event posters, UI mockups, and video promos.",
      lead: "Sujith M. (Final Mech)",
      coLead: "Deepa N. (Third EIE)",
      teamCount: 12
    },
    {
      id: 4,
      name: "Public Relations & Publicity Committee",
      desc: "Drives student enrollment, social media marketing, and coordinates section-level announcements.",
      lead: "Vijay R. (Final ECE)",
      coLead: "Haritha P. (Third CSE)",
      teamCount: 14
    },
    {
      id: 5,
      name: "Event Management Committee",
      desc: "Manages logistics, registrations, hospitality for guests, and overall venue setup operations.",
      lead: "Arun Kumar S. (Final Chemical)",
      coLead: "Meena K. (Third EEE)",
      teamCount: 18
    }
  ];

  const defaultResearchPapers = [
    {
      id: 1,
      title: "Smart Assistive Glove for Quadriplegic Patients using IoT",
      authors: "Abhishek M., Sneha R.",
      category: "IEEE",
      desc: "A voice-controlled assistive glove prototype using IoT sensors and machine learning for rehabilitation.",
      year: "2026",
      fileUrl: "paper_001.pdf"
    },
    {
      id: 2,
      title: "Edge Computing for Real-Time ECG Processing",
      authors: "Karthik Raja, Harish K.",
      category: "IEEE",
      desc: "Implementation of digital signal processing algorithms on microcontrollers for cardiac monitoring.",
      year: "2025",
      fileUrl: "paper_002.pdf"
    },
    {
      id: 3,
      title: "GreenTech Solutions for Sustainable Agriculture Automation",
      authors: "Dharini P., Naveen S.",
      category: "Conference",
      desc: "Solar-powered smart irrigation system with AI-based crop monitoring.",
      year: "2025",
      fileUrl: "paper_003.pdf"
    }
  ];

  const defaultNews = [
    {
      id: 1,
      title: "IEEE Student Branch KEC wins Best Branch Laurels",
      source: "Erode Daily",
      date: "Oct 14, 2025",
      snippet: "Kongu Engineering College student branch recognized under Madras Section for outstanding technical contributions and volunteering.",
      color: "#f59e0b"
    },
    {
      id: 2,
      title: "Students showcase Smart Assistive Device at State Expo",
      source: "Tech Journal",
      date: "Nov 02, 2025",
      snippet: "Sponsored by IEEE SPS and KEC SRC, a student team built a voice-assisted glove prototype for quadriplegic rehabilitation.",
      color: "#8b5cf6"
    },
    {
      id: 3,
      title: "National Hackathon on Green Energy hosted by KEC IEEE SB",
      source: "The Campus News",
      date: "Jan 18, 2026",
      snippet: "More than 50 teams from across Southern India participated to pitch solar tracking and smart grid distribution prototypes.",
      color: "#10b981"
    }
  ];

  const defaultMission = "To cultivate a culture of innovation, foster teamwork, and enhance student capability in research and design through seminars, hands-on workshops, student-led projects, and professional networking.";
  const defaultVision = "To build a world-class center of technical learning and professional excellence that empowers young minds to create engineering solutions for a sustainable and technologically advanced society.";
  const defaultTicker = [
    "🌿 IEEE KEC Student Branch membership drive 2026 is now live! Sign up today.",
    "🏆 KEC Student Branch recognized as one of the most active branches in the Madras Section.",
    "🚀 Register for 'CodeSprint 2026' - National level Hackathon organized by KEC IEEE Computer Society.",
    "📢 Guest Lecture on 'AI & Edge Computing' scheduled for June 15, 2026."
  ];

  useEffect(() => {
    // Check if session exists
    const adminSession = sessionStorage.getItem('ieee_admin_session');
    if (adminSession === 'active') {
      setIsLoggedIn(true);
    }

    // Load Overview/Stats & Site Content Values
    setMemberCount(localStorage.getItem('ieee_member_count') || '45');
    setEventsCount(localStorage.getItem('ieee_events_count') || '75+');
    setAwardsCount(localStorage.getItem('ieee_awards_count') || '18+');
    setPapersCount(localStorage.getItem('ieee_papers_count') || '15');
    setMission(localStorage.getItem('ieee_mission') || defaultMission);
    setVision(localStorage.getItem('ieee_vision') || defaultVision);

    const storedTicker = localStorage.getItem('ieee_ticker_notices');
    if (storedTicker) {
      setTickerNoticesText(JSON.parse(storedTicker).join('\n'));
    } else {
      setTickerNoticesText(defaultTicker.join('\n'));
    }

    // Load Gallery
    const storedGallery = localStorage.getItem('ieee_gallery_items');
    if (storedGallery) {
      setGalleryItems(JSON.parse(storedGallery));
    } else {
      localStorage.setItem('ieee_gallery_items', JSON.stringify(defaultGallery));
      setGalleryItems(defaultGallery);
    }

    // Load Events
    const storedUpcoming = localStorage.getItem('ieee_events_upcoming');
    if (storedUpcoming) {
      setUpcomingEvents(JSON.parse(storedUpcoming));
    } else {
      localStorage.setItem('ieee_events_upcoming', JSON.stringify(defaultUpcomingEvents));
      setUpcomingEvents(defaultUpcomingEvents);
    }

    const storedPast = localStorage.getItem('ieee_events_past');
    if (storedPast) {
      setPastEvents(JSON.parse(storedPast));
    } else {
      localStorage.setItem('ieee_events_past', JSON.stringify(defaultPastEvents));
      setPastEvents(defaultPastEvents);
    }

    // Load Achievements
    const storedAchievements = localStorage.getItem('ieee_achievements');
    if (storedAchievements) {
      setAchievements(JSON.parse(storedAchievements));
    } else {
      localStorage.setItem('ieee_achievements', JSON.stringify(defaultAchievements));
      setAchievements(defaultAchievements);
    }

    // Load Execomm Counselor
    const storedCounselor = localStorage.getItem('ieee_execomm_counselor');
    if (storedCounselor) {
      setCounselor(JSON.parse(storedCounselor));
    } else {
      localStorage.setItem('ieee_execomm_counselor', JSON.stringify(defaultCounselor));
      setCounselor(defaultCounselor);
    }

    // Load Execomm Members
    const storedMembers = localStorage.getItem('ieee_execomm_members');
    if (storedMembers) {
      setExecommMembers(JSON.parse(storedMembers));
    } else {
      localStorage.setItem('ieee_execomm_members', JSON.stringify(defaultMembers));
      setExecommMembers(defaultMembers);
    }

    // Load Committees
    const storedCommittees = localStorage.getItem('ieee_operational_committees');
    if (storedCommittees) {
      setCommittees(JSON.parse(storedCommittees));
    } else {
      localStorage.setItem('ieee_operational_committees', JSON.stringify(defaultCommittees));
      setCommittees(defaultCommittees);
    }

    // Load Research Papers
    const storedPapers = localStorage.getItem('ieee_research_papers');
    if (storedPapers) {
      setResearchPapers(JSON.parse(storedPapers));
    } else {
      localStorage.setItem('ieee_research_papers', JSON.stringify(defaultResearchPapers));
      setResearchPapers(defaultResearchPapers);
      // Set initial papers count
      localStorage.setItem('ieee_papers_count', defaultResearchPapers.length.toString());
      setPapersCount(defaultResearchPapers.length.toString());
    }

    // Load News Items
    const storedNews = localStorage.getItem('ieee_news_items');
    if (storedNews) {
      setNewsItems(JSON.parse(storedNews));
    } else {
      localStorage.setItem('ieee_news_items', JSON.stringify(defaultNews));
      setNewsItems(defaultNews);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    // Fetch registered admins from localStorage
    const storedAdmins = JSON.parse(localStorage.getItem('ieee_registered_admins') || '[]');
    const allAdmins = [...defaultAdmins, ...storedAdmins];

    const matchedAdmin = allAdmins.find(
      (admin) => admin.email.toLowerCase() === email.toLowerCase() && admin.password === password
    );

    if (matchedAdmin) {
      setIsLoggedIn(true);
      sessionStorage.setItem('ieee_admin_session', 'active');
      setLoginError('');
    } else {
      setLoginError('Invalid Email or Password');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters long');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match');
      return;
    }

    // Fetch existing custom registered admins and check for duplicates
    const storedAdmins = JSON.parse(localStorage.getItem('ieee_registered_admins') || '[]');
    const allAdmins = [...defaultAdmins, ...storedAdmins];

    const exists = allAdmins.some(
      (admin) => admin.email.toLowerCase() === regEmail.toLowerCase()
    );

    if (exists) {
      setRegError('This email is already registered as an admin');
      return;
    }

    // Save newly registered admin
    const newAdmin = { email: regEmail, password: regPassword };
    const updatedAdmins = [...storedAdmins, newAdmin];
    localStorage.setItem('ieee_registered_admins', JSON.stringify(updatedAdmins));

    setRegSuccess('Registration successful! You can now log in.');
    setEmail(regEmail); // Pre-populate the login field for convenience
    setRegEmail('');
    setRegPassword('');
    setRegConfirmPassword('');

    setTimeout(() => {
      setIsRegistering(false);
      setRegSuccess('');
    }, 1500);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('ieee_admin_session');
    setEmail('');
    setPassword('');
  };

  // Stats & Site Settings Save
  const handleSaveStats = (e) => {
    e.preventDefault();
    localStorage.setItem('ieee_member_count', memberCount);
    localStorage.setItem('ieee_events_count', eventsCount);
    localStorage.setItem('ieee_awards_count', awardsCount);
    localStorage.setItem('ieee_papers_count', papersCount);
    localStorage.setItem('ieee_mission', mission);
    localStorage.setItem('ieee_vision', vision);

    // Convert ticker notices from lines to string array
    const tickerArray = tickerNoticesText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    localStorage.setItem('ieee_ticker_notices', JSON.stringify(tickerArray));

    setStatsSaved(true);
    setTimeout(() => setStatsSaved(false), 3000);
  };

  // Counselor Save
  const handleSaveCounselor = (e) => {
    e.preventDefault();
    localStorage.setItem('ieee_execomm_counselor', JSON.stringify(counselor));
    setCounselorSaved(true);
    setTimeout(() => setCounselorSaved(false), 3000);
  };

  // Images upload compression
  const handleImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    const compressedList = [];
    for (let file of files) {
      try {
        const compressed = await compressImage(file);
        compressedList.push(compressed);
      } catch (err) {
        console.error("Error compressing image:", err);
      }
    }
    setFormImages((prev) => [...prev, ...compressedList]);
  };

  const removeFormImage = (index) => {
    setFormImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Generic Open Add Modals
  const openAddModal = (type) => {
    setModalType(type);
    setModalMode('add');
    setCurrentItemId(null);

    if (type === 'gallery') {
      setFormTitle('');
      setFormCat('Workshop');
      setFormText('');
      setFormImages([]);
    } else if (type === 'event') {
      setEventTitle('');
      setEventDesc('');
      setEventDate('');
      setEventTime('');
      setEventVenue('');
      setEventTag('Workshop');
      setEventIsUpcoming(true);
      setEventLink('https://forms.gle/mockregister');
      setEventHighlights('');
    } else if (type === 'achievement') {
      setAchTitle('');
      setAchCategory('');
      setAchDesc('');
      setAchIconType('trophy');
    } else if (type === 'member') {
      setMemberName('');
      setMemberRole('');
      setMemberCategory('main');
      setMemberDesc('');
      setMemberEmail('');
      setMemberLinkedin('https://linkedin.com');
    } else if (type === 'committee') {
      setCommName('');
      setCommDesc('');
      setCommLead('');
      setCommCoLead('');
      setCommTeamCount(10);
    } else if (type === 'researchpaper') {
      setPaperTitle('');
      setPaperAuthors('');
      setPaperCategory('IEEE');
      setPaperDesc('');
      setPaperYear(new Date().getFullYear().toString());
      setPaperFile(null);
    } else if (type === 'news') {
      setNewsTitle('');
      setNewsSource('');
      setNewsDate('');
      setNewsSnippet('');
      setNewsColor('#f59e0b');
      setNewsImage(null);
    }
    setIsModalOpen(true);
  };

  // Generic Open Edit Modals
  const openEditModal = (type, item) => {
    setModalType(type);
    setModalMode('edit');
    setCurrentItemId(item.id);

    if (type === 'gallery') {
      setFormTitle(item.title);
      setFormCat(item.cat);
      setFormText(item.text);
      setFormImages(item.images || []);
    } else if (type === 'event') {
      setEventTitle(item.title);
      setEventDesc(item.desc);
      setEventDate(item.date);
      setEventTime(item.time || '');
      setEventVenue(item.venue);
      setEventTag(item.tag);
      const isUpcoming = item.link !== undefined;
      setEventIsUpcoming(isUpcoming);
      setEventLink(item.link || '');
      setEventHighlights(item.highlights || '');
    } else if (type === 'achievement') {
      setAchTitle(item.title);
      setAchCategory(item.category);
      setAchDesc(item.desc);
      setAchIconType(item.iconType);
    } else if (type === 'member') {
      setMemberName(item.name);
      setMemberRole(item.role);
      setMemberCategory(item.category);
      setMemberDesc(item.desc);
      setMemberEmail(item.email);
      setMemberLinkedin(item.linkedin);
    } else if (type === 'committee') {
      setCommName(item.name);
      setCommDesc(item.desc);
      setCommLead(item.lead);
      setCommCoLead(item.coLead);
      setCommTeamCount(item.teamCount);
    } else if (type === 'researchpaper') {
      setPaperTitle(item.title);
      setPaperAuthors(item.authors);
      setPaperCategory(item.category);
      setPaperDesc(item.desc);
      setPaperYear(item.year);
      setPaperFile(item.fileUrl);
    } else if (type === 'news') {
      setNewsTitle(item.title);
      setNewsSource(item.source);
      setNewsDate(item.date);
      setNewsSnippet(item.snippet);
      setNewsColor(item.color);
    }
    setIsModalOpen(true);
  };

  // Generic Delete Actions
  const handleDeleteItem = (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type} item?`)) return;

    if (type === 'gallery') {
      const updated = galleryItems.filter(item => item.id !== id);
      setGalleryItems(updated);
      localStorage.setItem('ieee_gallery_items', JSON.stringify(updated));
    } else if (type === 'event') {
      const updatedUpcoming = upcomingEvents.filter(item => item.id !== id);
      const updatedPast = pastEvents.filter(item => item.id !== id);
      setUpcomingEvents(updatedUpcoming);
      setPastEvents(updatedPast);
      localStorage.setItem('ieee_events_upcoming', JSON.stringify(updatedUpcoming));
      localStorage.setItem('ieee_events_past', JSON.stringify(updatedPast));
    } else if (type === 'achievement') {
      const updated = achievements.filter(item => item.id !== id);
      setAchievements(updated);
      localStorage.setItem('ieee_achievements', JSON.stringify(updated));
    } else if (type === 'member') {
      const updated = execommMembers.filter(item => item.id !== id);
      setExecommMembers(updated);
      localStorage.setItem('ieee_execomm_members', JSON.stringify(updated));
      
      // Decrement member count when a member is deleted
      const currentCount = parseInt(memberCount) || 0;
      const newCount = Math.max(currentCount - 1, 0);
      setMemberCount(newCount.toString());
      localStorage.setItem('ieee_member_count', newCount.toString());
    } else if (type === 'committee') {
      const updated = committees.filter(item => item.id !== id);
      setCommittees(updated);
      localStorage.setItem('ieee_operational_committees', JSON.stringify(updated));
    } else if (type === 'researchpaper') {
      const updated = researchPapers.filter(item => item.id !== id);
      setResearchPapers(updated);
      localStorage.setItem('ieee_research_papers', JSON.stringify(updated));
      
      // Decrement papers count when a paper is deleted
      const currentCount = parseInt(papersCount) || 0;
      const newCount = Math.max(currentCount - 1, 0);
      setPapersCount(newCount.toString());
      localStorage.setItem('ieee_papers_count', newCount.toString());
    } else if (type === 'news') {
      const updated = newsItems.filter(item => item.id !== id);
      setNewsItems(updated);
      localStorage.setItem('ieee_news_items', JSON.stringify(updated));
    }
  };

  // Generic Save Logic
  const handleSaveItem = (e) => {
    e.preventDefault();

    if (modalType === 'gallery') {
      if (!formTitle.trim() || !formText.trim()) return;
      let updated = [];
      if (modalMode === 'add') {
        const newItem = {
          id: galleryItems.length > 0 ? Math.max(...galleryItems.map(i => i.id)) + 1 : 1,
          title: formTitle,
          cat: formCat,
          text: formText,
          images: formImages
        };
        updated = [...galleryItems, newItem];
      } else {
        updated = galleryItems.map(item =>
          item.id === currentItemId
            ? { ...item, title: formTitle, cat: formCat, text: formText, images: formImages }
            : item
        );
      }
      setGalleryItems(updated);
      localStorage.setItem('ieee_gallery_items', JSON.stringify(updated));

    } else if (modalType === 'event') {
      if (!eventTitle.trim() || !eventDesc.trim() || !eventDate.trim() || !eventVenue.trim()) return;

      const combinedId = currentItemId || Date.now();
      let updatedUpcoming = [...upcomingEvents];
      let updatedPast = [...pastEvents];

      // Remove existing item from both lists if editing
      if (modalMode === 'edit') {
        updatedUpcoming = updatedUpcoming.filter(e => e.id !== currentItemId);
        updatedPast = updatedPast.filter(e => e.id !== currentItemId);
      }

      if (eventIsUpcoming) {
        const newEvent = {
          id: combinedId,
          title: eventTitle,
          desc: eventDesc,
          date: eventDate,
          time: eventTime,
          venue: eventVenue,
          tag: eventTag,
          link: eventLink
        };
        updatedUpcoming.push(newEvent);
      } else {
        const newEvent = {
          id: combinedId,
          title: eventTitle,
          desc: eventDesc,
          date: eventDate,
          venue: eventVenue,
          tag: eventTag,
          highlights: eventHighlights
        };
        updatedPast.push(newEvent);
      }

      setUpcomingEvents(updatedUpcoming);
      setPastEvents(updatedPast);
      localStorage.setItem('ieee_events_upcoming', JSON.stringify(updatedUpcoming));
      localStorage.setItem('ieee_events_past', JSON.stringify(updatedPast));

    } else if (modalType === 'achievement') {
      if (!achTitle.trim() || !achCategory.trim() || !achDesc.trim()) return;
      let updated = [];
      if (modalMode === 'add') {
        const newItem = {
          id: achievements.length > 0 ? Math.max(...achievements.map(i => i.id)) + 1 : 1,
          title: achTitle,
          category: achCategory,
          desc: achDesc,
          iconType: achIconType
        };
        updated = [...achievements, newItem];
      } else {
        updated = achievements.map(item =>
          item.id === currentItemId
            ? { ...item, title: achTitle, category: achCategory, desc: achDesc, iconType: achIconType }
            : item
        );
      }
      setAchievements(updated);
      localStorage.setItem('ieee_achievements', JSON.stringify(updated));

    } else if (modalType === 'member') {
      if (!memberName.trim() || !memberRole.trim() || !memberDesc.trim()) return;
      let updated = [];
      if (modalMode === 'add') {
        const newItem = {
          id: execommMembers.length > 0 ? Math.max(...execommMembers.map(i => i.id)) + 1 : 1,
          name: memberName,
          role: memberRole,
          category: memberCategory,
          desc: memberDesc,
          email: memberEmail,
          linkedin: memberLinkedin
        };
        updated = [...execommMembers, newItem];
        
        // Increment member count when a new member is added
        const currentCount = parseInt(memberCount) || 0;
        const newCount = currentCount + 1;
        setMemberCount(newCount.toString());
        localStorage.setItem('ieee_member_count', newCount.toString());
      } else {
        updated = execommMembers.map(item =>
          item.id === currentItemId
            ? { ...item, name: memberName, role: memberRole, category: memberCategory, desc: memberDesc, email: memberEmail, linkedin: memberLinkedin }
            : item
        );
      }
      setExecommMembers(updated);
      localStorage.setItem('ieee_execomm_members', JSON.stringify(updated));

    } else if (modalType === 'committee') {
      if (!commName.trim() || !commDesc.trim() || !commLead.trim() || !commCoLead.trim()) return;
      let updated = [];
      if (modalMode === 'add') {
        const newItem = {
          id: committees.length > 0 ? Math.max(...committees.map(i => i.id)) + 1 : 1,
          name: commName,
          desc: commDesc,
          lead: commLead,
          coLead: commCoLead,
          teamCount: parseInt(commTeamCount) || 10
        };
        updated = [...committees, newItem];
      } else {
        updated = committees.map(item =>
          item.id === currentItemId
            ? { ...item, name: commName, desc: commDesc, lead: commLead, coLead: commCoLead, teamCount: parseInt(commTeamCount) || 10 }
            : item
        );
      }
      setCommittees(updated);
      localStorage.setItem('ieee_operational_committees', JSON.stringify(updated));

    } else if (modalType === 'researchpaper') {
      if (!paperTitle.trim() || !paperAuthors.trim() || !paperDesc.trim()) return;
      let updated = [];
      if (modalMode === 'add') {
        const newItem = {
          id: researchPapers.length > 0 ? Math.max(...researchPapers.map(i => i.id)) + 1 : 1,
          title: paperTitle,
          authors: paperAuthors,
          category: paperCategory,
          desc: paperDesc,
          year: paperYear,
          fileUrl: paperFile || `paper_${Date.now()}.pdf`
        };
        updated = [...researchPapers, newItem];
        
        // Increment papers count when a new paper is added
        const currentCount = parseInt(papersCount) || 0;
        const newCount = currentCount + 1;
        setPapersCount(newCount.toString());
        localStorage.setItem('ieee_papers_count', newCount.toString());
      } else {
        updated = researchPapers.map(item =>
          item.id === currentItemId
            ? { ...item, title: paperTitle, authors: paperAuthors, category: paperCategory, desc: paperDesc, year: paperYear, fileUrl: paperFile || item.fileUrl }
            : item
        );
      }
      setResearchPapers(updated);
      localStorage.setItem('ieee_research_papers', JSON.stringify(updated));
    } else if (modalType === 'news') {
      if (!newsTitle.trim() || !newsSource.trim() || !newsDate.trim() || !newsSnippet.trim()) return;
      let updated = [];
      if (modalMode === 'add') {
        const newItem = {
          id: newsItems.length > 0 ? Math.max(...newsItems.map(i => i.id)) + 1 : 1,
          title: newsTitle,
          source: newsSource,
          date: newsDate,
          snippet: newsSnippet,
          color: newsColor
        };
        updated = [...newsItems, newItem];
      } else {
        updated = newsItems.map(item =>
          item.id === currentItemId
            ? { ...item, title: newsTitle, source: newsSource, date: newsDate, snippet: newsSnippet, color: newsColor }
            : item
        );
      }
      setNewsItems(updated);
      localStorage.setItem('ieee_news_items', JSON.stringify(updated));
    }

    setIsModalOpen(false);
  };

  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '75vh',
        backgroundColor: '#f5faff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px'
      }}>
        <div className="card" style={{
          maxWidth: '420px',
          width: '100%',
          padding: '36px',
          boxShadow: '0 8px 30px rgba(10, 56, 91, 0.08)',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #d0e4f2'
        }}>
          {/* Navigation Toggle for Login/Register */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
            <button
              onClick={() => {
                setIsRegistering(false);
                setLoginError('');
                setRegError('');
                setRegSuccess('');
              }}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '15px',
                fontWeight: '700',
                color: !isRegistering ? '#02619a' : '#8ca6b9',
                cursor: 'pointer',
                borderBottom: !isRegistering ? '2.5px solid #02619a' : 'none',
                paddingBottom: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsRegistering(true);
                setLoginError('');
                setRegError('');
                setRegSuccess('');
              }}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '15px',
                fontWeight: '700',
                color: isRegistering ? '#02619a' : '#8ca6b9',
                cursor: 'pointer',
                borderBottom: isRegistering ? '2.5px solid #02619a' : 'none',
                paddingBottom: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              Register
            </button>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#02619a',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Lock size={28} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0a385b', marginBottom: '8px' }}>
              {isRegistering ? 'Register Admin' : 'Admin Login'}
            </h2>
            <p style={{ fontSize: '13px', color: '#8ca6b9' }}>
              {isRegistering ? 'Create a new admin credential' : 'Authorize to manage branch portal database'}
            </p>
          </div>

          {/* Error & Success Messages */}
          {!isRegistering && loginError && (
            <div style={{
              padding: '10px 14px',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '20px',
              border: '1px solid #fca5a5'
            }}>
              ⚠️ {loginError}
            </div>
          )}

          {isRegistering && regError && (
            <div style={{
              padding: '10px 14px',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '20px',
              border: '1px solid #fca5a5'
            }}>
              ⚠️ {regError}
            </div>
          )}

          {isRegistering && regSuccess && (
            <div style={{
              padding: '10px 14px',
              backgroundColor: '#dcfce7',
              color: '#15803d',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '20px',
              border: '1px solid #bbf7d0'
            }}>
              ✅ {regSuccess}
            </div>
          )}

          {/* Conditional Form Render */}
          {!isRegistering ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #d0e4f2',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#f8fafc'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #d0e4f2',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#f8fafc'
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  backgroundColor: '#02619a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginTop: '10px'
                }}
                className="admin-login-btn"
              >
                Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Email</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="e.g. name@kongu.edu"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #d0e4f2',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#f8fafc'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Password</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #d0e4f2',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#f8fafc'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Confirm Password</label>
                <input
                  type="password"
                  required
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #d0e4f2',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#f8fafc'
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  backgroundColor: '#02619a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginTop: '10px'
                }}
                className="admin-login-btn"
              >
                Register Admin
              </button>
            </form>
          )}
        </div>

        <style>{`
          .admin-login-btn:hover {
            background-color: #0a385b !important;
            box-shadow: 0 4px 12px rgba(10, 56, 91, 0.2);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '80vh', paddingBottom: '80px' }}>
      {/* Header Panel */}
      <div style={{
        background: 'linear-gradient(135deg, #0a385b 0%, #02619a 100%)',
        color: '#ffffff',
        padding: '30px 0',
        marginBottom: '40px'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '28px', color: '#ffffff', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Database size={28} /> Admin Dashboard
            </h1>
            <p style={{ fontSize: '14px', color: '#d0e4f2', marginTop: '4px' }}>Welcome! You have full authority to modify the whole website's content.</p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1.5px solid #ffffff',
              color: '#ffffff',
              padding: '8px 20px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
            className="admin-logout-btn"
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </div>

      <div className="container">
        {/* Tab Selection */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '2px solid #e2e8f0',
          paddingBottom: '16px',
          marginBottom: '32px',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'stats', label: 'Stats & Site Info', icon: <Settings size={16} /> },
            { id: 'gallery', label: 'Photo Gallery', icon: <ImageIcon size={16} /> },
            { id: 'events', label: 'Events List', icon: <Calendar size={16} /> },
            { id: 'achievements', label: 'Achievements', icon: <Award size={16} /> },
            { id: 'execomm', label: 'Execomm SB Leaders', icon: <Users size={16} /> },
            { id: 'committees', label: 'Committees', icon: <Target size={16} /> },
            { id: 'news', label: 'News Clippings', icon: <FileText size={16} /> },
            { id: 'researchpapers', label: 'Research Papers', icon: <FileText size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                fontSize: '13.5px',
                fontWeight: '700',
                borderRadius: '30px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === tab.id ? '#02619a' : '#ffffff',
                color: activeTab === tab.id ? '#ffffff' : '#64748b',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(10,56,91,0.15)' : '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Statistics & Site Info Update Panel */}
        {activeTab === 'stats' && (
          <div className="card animate-fade-in" style={{ padding: '36px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '20px', color: '#0a385b', marginBottom: '8px', fontWeight: '800' }}>Manage Site-wide Overview Details</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '28px' }}>Modify the counters, mission/vision statements, and marquee announcements displayed on the Home page.</p>

            {statsSaved && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#dcfce7',
                color: '#15803d',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid #bbf7d0'
              }}>
                <Check size={18} /> Site settings updated successfully!
              </div>
            )}

            <form onSubmit={handleSaveStats} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '16px', color: '#0a385b', fontWeight: '750', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Home Statistics Counter</h3>
                
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#0a385b', marginBottom: '6px' }}>Active Members Count</label>
                  <input
                    type="text"
                    required
                    value={memberCount}
                    onChange={(e) => setMemberCount(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#0a385b', marginBottom: '6px' }}>Events Yearly</label>
                  <input
                    type="text"
                    required
                    value={eventsCount}
                    onChange={(e) => setEventsCount(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#0a385b', marginBottom: '6px' }}>National Awards</label>
                  <input
                    type="text"
                    required
                    value={awardsCount}
                    onChange={(e) => setAwardsCount(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#0a385b', marginBottom: '6px' }}>Research Papers Count</label>
                  <input
                    type="text"
                    required
                    value={papersCount}
                    onChange={(e) => setPapersCount(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '16px', color: '#0a385b', fontWeight: '750', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Statements & Tickers</h3>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#0a385b', marginBottom: '6px' }}>Mission Statement</label>
                  <textarea
                    required
                    rows="3"
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', resize: 'none', fontFamily: 'inherit' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#0a385b', marginBottom: '6px' }}>Vision Statement</label>
                  <textarea
                    required
                    rows="3"
                    value={vision}
                    onChange={(e) => setVision(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', resize: 'none', fontFamily: 'inherit' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#0a385b', marginBottom: '6px' }}>Ticker Notices (One announcement per line)</label>
                  <textarea
                    required
                    rows="4"
                    value={tickerNoticesText}
                    onChange={(e) => setTickerNoticesText(e.target.value)}
                    placeholder="🌿 Membership drive 2026 is live!"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </div>
              </div>

              <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#02619a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 30px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  className="admin-save-btn"
                >
                  Save Overview Settings
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Gallery CRUD Operations */}
        {activeTab === 'gallery' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '20px', color: '#0a385b', fontWeight: '800' }}>Manage Media Gallery Logs</h2>
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>Upload and describe event snapshots (Total: {galleryItems.length})</p>
              </div>
              <button
                onClick={() => openAddModal('gallery')}
                style={{
                  backgroundColor: '#02619a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '30px',
                  padding: '10px 20px',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(2,97,154,0.2)'
                }}
                className="admin-add-btn"
              >
                <Plus size={16} /> Add Photo Log
              </button>
            </div>

            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b' }}>Category</th>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b' }}>Title / Event</th>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b' }}>Description</th>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {galleryItems.map((item, idx) => (
                      <tr key={item.id} style={{ borderBottom: idx < galleryItems.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                        <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                          <span style={{ padding: '4px 10px', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '4px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
                            {item.cat}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: '600', color: '#0a385b', verticalAlign: 'top', minWidth: '180px' }}>
                          {item.title}
                        </td>
                        <td style={{ padding: '16px 20px', color: '#64748b', verticalAlign: 'top', minWidth: '240px' }}>
                          {item.text}
                        </td>
                        <td style={{ padding: '16px 20px', verticalAlign: 'top', textAlign: 'center', width: '130px' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button
                              onClick={() => openEditModal('gallery', item)}
                              style={{ color: '#02619a', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '4px', padding: '6px', cursor: 'pointer' }}
                              className="action-btn-hover-edit"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem('gallery', item.id)}
                              style={{ color: '#ef4444', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '4px', padding: '6px', cursor: 'pointer' }}
                              className="action-btn-hover-delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Events CRUD Operations */}
        {activeTab === 'events' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '20px', color: '#0a385b', fontWeight: '800' }}>Manage Website Events Calendar</h2>
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>
                  Upcoming events: {upcomingEvents.length} | Past events: {pastEvents.length}
                </p>
              </div>
              <button
                onClick={() => openAddModal('event')}
                style={{
                  backgroundColor: '#02619a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '30px',
                  padding: '10px 20px',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(2,97,154,0.2)'
                }}
                className="admin-add-btn"
              >
                <Plus size={16} /> Add Event Record
              </button>
            </div>

            {/* Combined Scrollable Table for Events */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b' }}>Timeline Status</th>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b' }}>Category / Tag</th>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b' }}>Event Title</th>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b' }}>Date & Venue</th>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Render Upcoming Events */}
                    {upcomingEvents.map((item) => (
                      <tr key={`upcoming-${item.id}`} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                          <span style={{ padding: '4px 10px', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '20px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>
                            Upcoming
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                          <span style={{ padding: '3px 8px', backgroundColor: '#e2e8f0', color: '#475569', borderRadius: '4px', fontSize: '11px', fontWeight: '700' }}>
                            {item.tag}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: '600', color: '#0a385b', verticalAlign: 'middle', minWidth: '220px' }}>
                          {item.title}
                        </td>
                        <td style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', verticalAlign: 'middle' }}>
                          <div>📅 {item.date}</div>
                          <div>📍 {item.venue}</div>
                        </td>
                        <td style={{ padding: '16px 20px', verticalAlign: 'middle', textAlign: 'center', width: '130px' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button
                              onClick={() => openEditModal('event', item)}
                              style={{ color: '#02619a', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '4px', padding: '6px', cursor: 'pointer' }}
                              className="action-btn-hover-edit"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem('event', item.id)}
                              style={{ color: '#ef4444', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '4px', padding: '6px', cursor: 'pointer' }}
                              className="action-btn-hover-delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {/* Render Past Events */}
                    {pastEvents.map((item, idx) => (
                      <tr key={`past-${item.id}`} style={{ borderBottom: idx < pastEvents.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                        <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                          <span style={{ padding: '4px 10px', backgroundColor: '#f1f5f9', color: '#64748b', borderRadius: '20px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>
                            Completed
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                          <span style={{ padding: '3px 8px', backgroundColor: '#e2e8f0', color: '#475569', borderRadius: '4px', fontSize: '11px', fontWeight: '700' }}>
                            {item.tag}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: '600', color: '#475569', verticalAlign: 'middle', minWidth: '220px' }}>
                          {item.title}
                        </td>
                        <td style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', verticalAlign: 'middle' }}>
                          <div>📅 {item.date}</div>
                          <div>📍 {item.venue}</div>
                        </td>
                        <td style={{ padding: '16px 20px', verticalAlign: 'middle', textAlign: 'center', width: '130px' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button
                              onClick={() => openEditModal('event', item)}
                              style={{ color: '#02619a', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '4px', padding: '6px', cursor: 'pointer' }}
                              className="action-btn-hover-edit"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem('event', item.id)}
                              style={{ color: '#ef4444', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '4px', padding: '6px', cursor: 'pointer' }}
                              className="action-btn-hover-delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Achievements CRUD Operations */}
        {activeTab === 'achievements' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '20px', color: '#0a385b', fontWeight: '800' }}>Manage Student Achievements</h2>
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>Laurels and awards rendered in the Achievements list (Total: {achievements.length})</p>
              </div>
              <button
                onClick={() => openAddModal('achievement')}
                style={{
                  backgroundColor: '#02619a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '30px',
                  padding: '10px 20px',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(2,97,154,0.2)'
                }}
                className="admin-add-btn"
              >
                <Plus size={16} /> Add Achievement
              </button>
            </div>

            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b' }}>Icon Class</th>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b' }}>Category Tag</th>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b' }}>Achievement Title</th>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b' }}>Short Description</th>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {achievements.map((item, idx) => (
                      <tr key={item.id} style={{ borderBottom: idx < achievements.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                        <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                          <span style={{ padding: '3px 8px', backgroundColor: '#fff7ed', color: '#ea580c', border: '1px solid #ffedd5', borderRadius: '4px', fontSize: '12px', fontWeight: '700' }}>
                            {item.iconType}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', verticalAlign: 'top', fontWeight: '600', color: 'var(--secondary)' }}>
                          {item.category}
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', verticalAlign: 'top', minWidth: '180px' }}>
                          {item.title}
                        </td>
                        <td style={{ padding: '16px 20px', color: '#64748b', verticalAlign: 'top', minWidth: '240px' }}>
                          {item.desc}
                        </td>
                        <td style={{ padding: '16px 20px', verticalAlign: 'top', textAlign: 'center', width: '130px' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button
                              onClick={() => openEditModal('achievement', item)}
                              style={{ color: '#02619a', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '4px', padding: '6px', cursor: 'pointer' }}
                              className="action-btn-hover-edit"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem('achievement', item.id)}
                              style={{ color: '#ef4444', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '4px', padding: '6px', cursor: 'pointer' }}
                              className="action-btn-hover-delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Execomm (Counselor Profile & Student Leaders list) */}
        {activeTab === 'execomm' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {/* Counselor Edit Form Card */}
            <div className="card" style={{ padding: '30px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '18px', color: '#0a385b', fontWeight: '800', marginBottom: '6px' }}>Manage Branch Counselor</h2>
              <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>Updates the faculty details featured under the Counselor spotlight segment.</p>
              
              {counselorSaved && (
                <div style={{ padding: '10px 14px', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '8px', fontSize: '13.5px', fontWeight: '600', marginBottom: '16px', border: '1px solid #bbf7d0' }}>
                  ✅ Counselor profile updated successfully!
                </div>
              )}

              <form onSubmit={handleSaveCounselor} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '4px' }}>Counselor Name</label>
                  <input
                    type="text"
                    required
                    value={counselor.name}
                    onChange={(e) => setCounselor({ ...counselor, name: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '4px' }}>Role / Designation</label>
                  <input
                    type="text"
                    required
                    value={counselor.role}
                    onChange={(e) => setCounselor({ ...counselor, role: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '4px' }}>College</label>
                  <input
                    type="text"
                    required
                    value={counselor.college}
                    onChange={(e) => setCounselor({ ...counselor, college: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '4px' }}>Email</label>
                  <input
                    type="email"
                    required
                    value={counselor.email}
                    onChange={(e) => setCounselor({ ...counselor, email: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '4px' }}>Linkedin Handle</label>
                  <input
                    type="text"
                    required
                    value={counselor.linkedin}
                    onChange={(e) => setCounselor({ ...counselor, linkedin: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '4px' }}>Bio / Description</label>
                  <textarea
                    required
                    rows="3"
                    value={counselor.desc}
                    onChange={(e) => setCounselor({ ...counselor, desc: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', resize: 'none', fontFamily: 'inherit' }}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    style={{ backgroundColor: '#02619a', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '10px 24px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                    className="admin-save-btn"
                  >
                    Save Counselor Profile
                  </button>
                </div>
              </form>
            </div>

            {/* Execomm Members Table CRUD */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', color: '#0a385b', fontWeight: '800' }}>Manage Student Office Bearers</h2>
                  <p style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>List of branch and society student leaders (Total: {execommMembers.length})</p>
                </div>
                <button
                  onClick={() => openAddModal('member')}
                  style={{
                    backgroundColor: '#02619a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '30px',
                    padding: '8px 18px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(2,97,154,0.15)'
                  }}
                  className="admin-add-btn"
                >
                  <Plus size={14} /> Add Leader Profile
                </button>
              </div>

              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                        <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b' }}>Society Category</th>
                        <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b' }}>Name</th>
                        <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b' }}>Role / Designation</th>
                        <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b' }}>Email & Socials</th>
                        <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {execommMembers.map((item, idx) => (
                        <tr key={item.id} style={{ borderBottom: idx < execommMembers.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                          <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                            <span style={{
                              padding: '4px 10px',
                              backgroundColor: item.category === 'main' ? '#eff6ff' : item.category === 'sps' ? '#f0fdf4' : '#fdf2f8',
                              color: item.category === 'main' ? '#1d4ed8' : item.category === 'sps' ? '#15803d' : '#be185d',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '800',
                              textTransform: 'uppercase'
                            }}>
                              {item.category === 'main' ? 'Branch SB' : item.category === 'sps' ? 'SPS Chapter' : 'WIE Affinity'}
                            </span>
                          </td>
                          <td style={{ padding: '16px 20px', fontWeight: '600', color: '#0a385b', verticalAlign: 'middle' }}>
                            {item.name}
                          </td>
                          <td style={{ padding: '16px 20px', color: '#475569', fontWeight: '500', verticalAlign: 'middle' }}>
                            {item.role}
                          </td>
                          <td style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px', verticalAlign: 'middle' }}>
                            <div>📧 {item.email}</div>
                            <div>🔗 <a href={item.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#02619a', textDecoration: 'none' }}>LinkedIn Profile</a></div>
                          </td>
                          <td style={{ padding: '16px 20px', verticalAlign: 'middle', textAlign: 'center', width: '130px' }}>
                            <div style={{ display: 'inline-flex', gap: '8px' }}>
                              <button
                                onClick={() => openEditModal('member', item)}
                                style={{ color: '#02619a', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '4px', padding: '6px', cursor: 'pointer' }}
                                className="action-btn-hover-edit"
                              >
                                <Edit3 size={15} />
                              </button>
                              <button
                                onClick={() => handleDeleteItem('member', item.id)}
                                style={{ color: '#ef4444', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '4px', padding: '6px', cursor: 'pointer' }}
                                className="action-btn-hover-delete"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Operational Committees */}
        {activeTab === 'committees' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '20px', color: '#0a385b', fontWeight: '800' }}>Manage Operational Committees</h2>
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>Operational subcommittees and core volunteer groups (Total: {committees.length})</p>
              </div>
              <button
                onClick={() => openAddModal('committee')}
                style={{
                  backgroundColor: '#02619a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '30px',
                  padding: '10px 20px',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(2,97,154,0.2)'
                }}
                className="admin-add-btn"
              >
                <Plus size={16} /> Add Committee
              </button>
            </div>

            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b' }}>Committee Name</th>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b' }}>Lead Officer</th>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b' }}>Co-Lead Officer</th>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', textAlign: 'center' }}>Volunteers Count</th>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {committees.map((item, idx) => (
                      <tr key={item.id} style={{ borderBottom: idx < committees.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                        <td style={{ padding: '16px 20px', fontWeight: '600', color: '#0a385b', verticalAlign: 'middle', minWidth: '180px' }}>
                          {item.name}
                        </td>
                        <td style={{ padding: '16px 20px', color: '#475569', fontWeight: '550', verticalAlign: 'middle' }}>
                          👤 {item.lead}
                        </td>
                        <td style={{ padding: '16px 20px', color: '#475569', fontWeight: '550', verticalAlign: 'middle' }}>
                          👤 {item.coLead}
                        </td>
                        <td style={{ padding: '16px 20px', color: 'var(--secondary)', fontWeight: '700', verticalAlign: 'middle', textAlign: 'center' }}>
                          {item.teamCount} Volunteers
                        </td>
                        <td style={{ padding: '16px 20px', verticalAlign: 'middle', textAlign: 'center', width: '130px' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button
                              onClick={() => openEditModal('committee', item)}
                              style={{ color: '#02619a', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '4px', padding: '6px', cursor: 'pointer' }}
                              className="action-btn-hover-edit"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem('committee', item.id)}
                              style={{ color: '#ef4444', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '4px', padding: '6px', cursor: 'pointer' }}
                              className="action-btn-hover-delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: News Clippings Management */}
        {activeTab === 'news' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '20px', color: '#0a385b', fontWeight: '800' }}>News Clippings Manager</h2>
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>Manage and publish news updates and announcements (Total: {newsItems.length})</p>
              </div>
              <button
                onClick={() => openAddModal('news')}
                style={{
                  backgroundColor: '#02619a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '30px',
                  padding: '10px 20px',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(2,97,154,0.2)'
                }}
                className="admin-add-btn"
              >
                <Plus size={16} /> Add News
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
              {newsItems.map(news => (
                <div key={news.id} className="card" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(10, 56, 91, 0.1)', overflow: 'hidden', transition: 'all 0.3s ease' }}>
                  <div style={{ height: '100px', background: `linear-gradient(135deg, ${news.color} 0%, ${news.color}dd 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.15)', position: 'absolute', right: '-15px', top: '-15px' }} />
                    <FileText size={40} color="#ffffff" style={{ opacity: 0.9 }} />
                  </div>
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#ffffff', backgroundColor: news.color, padding: '4px 10px', borderRadius: '18px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{news.source}</span>
                        <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>{news.date}</span>
                      </div>
                      <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0a385b', marginBottom: '8px', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{news.title}</h3>
                    </div>
                    <p style={{ fontSize: '12.5px', color: '#64748b', lineHeight: '1.5', marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{news.snippet}</p>
                    <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                      <button onClick={() => openEditModal('news', news)} style={{ flex: 1, backgroundColor: '#f0f4f8', color: '#02619a', border: 'none', borderRadius: '6px', padding: '8px 12px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} className="action-btn-hover-edit"><Edit3 size={14} /> Edit</button>
                      <button onClick={() => handleDeleteItem('news', news.id)} style={{ flex: 1, backgroundColor: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '6px', padding: '8px 12px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} className="action-btn-hover-delete"><Trash2 size={14} /> Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {newsItems.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                <FileText size={48} style={{ opacity: 0.4, marginBottom: '16px' }} />
                <p style={{ fontSize: '15px', fontWeight: '600' }}>No news items added yet</p>
                <p style={{ fontSize: '13px', marginTop: '8px' }}>Click "Add News" to publish news updates and announcements</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 7: Research Papers Management */}
        {activeTab === 'researchpapers' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '20px', color: '#0a385b', fontWeight: '800' }}>Research Papers Repository</h2>
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>Student research work submissions and publications (Total: {researchPapers.length})</p>
              </div>
              <button
                onClick={() => openAddModal('researchpaper')}
                style={{
                  backgroundColor: '#02619a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '30px',
                  padding: '10px 20px',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(2,97,154,0.2)'
                }}
                className="admin-add-btn"
              >
                <Plus size={16} /> Add Paper
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {researchPapers.map(paper => (
                <div key={paper.id} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '8px',
                        backgroundColor: '#f0f4f8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#02619a'
                      }}>
                        <FileText size={24} />
                      </div>
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--secondary)', textTransform: 'uppercase' }}>{paper.category}</span>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>📅 {paper.year}</p>
                      </div>
                    </div>
                  </div>
                  
                  <h3 style={{ fontSize: '15px', color: '#0a385b', fontWeight: '700', marginBottom: '8px', lineHeight: '1.4' }}>{paper.title}</h3>
                  
                  <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '12px', lineHeight: '1.4' }}>👥 {paper.authors}</p>
                  
                  <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', marginBottom: '16px', flex: 1 }}>{paper.desc}</p>
                  
                  <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                    <button
                      onClick={() => openEditModal('researchpaper', paper)}
                      style={{
                        flex: 1,
                        backgroundColor: '#f0f4f8',
                        color: '#02619a',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                      className="action-btn-hover-edit"
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem('researchpaper', paper.id)}
                      style={{
                        flex: 1,
                        backgroundColor: '#fef2f2',
                        color: '#ef4444',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                      className="action-btn-hover-delete"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {researchPapers.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                <FileText size={48} style={{ opacity: 0.4, marginBottom: '16px' }} />
                <p style={{ fontSize: '15px', fontWeight: '600' }}>No research papers added yet</p>
                <p style={{ fontSize: '13px', marginTop: '8px' }}>Click "Add Paper" to submit student research work</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CRUD Add/Edit Overlay Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(5, 23, 38, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div className="card" style={{
            maxWidth: '560px',
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            animation: 'modal-slide-up 0.25s ease-out'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              backgroundColor: '#0a385b',
              color: '#ffffff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexShrink: 0
            }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#ffffff' }}>
                {modalMode === 'add' ? 'Create New Entry' : 'Edit Existing Entry'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', display: 'flex' }}
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body Container with Scroll support */}
            <form onSubmit={handleSaveItem} style={{ padding: '24px', overflowY: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Conditional Form: Gallery */}
              {modalType === 'gallery' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Category/Tag</label>
                    <select
                      value={formCat}
                      onChange={(e) => setFormCat(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', backgroundColor: '#ffffff' }}
                    >
                      <option value="Workshop">Workshop</option>
                      <option value="Exhibition">Exhibition</option>
                      <option value="Seminar">Seminar</option>
                      <option value="Hands-on">Hands-on</option>
                      <option value="Hackathon">Hackathon</option>
                      <option value="Meeting">Meeting</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flutter Workshop 2026"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Description</label>
                    <textarea
                      required
                      rows="4"
                      placeholder="Provide details about what occurred in this photo log..."
                      value={formText}
                      onChange={(e) => setFormText(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', resize: 'none', fontFamily: 'inherit' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Upload Images</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImagesUpload}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', backgroundColor: '#ffffff' }}
                    />
                    {formImages.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px', padding: '8px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                        {formImages.map((img, idx) => (
                          <div key={idx} style={{ position: 'relative', width: '64px', height: '64px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                            <img src={img} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button
                              type="button"
                              onClick={() => removeFormImage(idx)}
                              style={{ position: 'absolute', top: '2px', right: '2px', backgroundColor: 'rgba(239, 68, 68, 0.9)', color: '#ffffff', border: 'none', borderRadius: '50%', width: '16px', height: '16px', fontSize: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Conditional Form: Events */}
              {modalType === 'event' && (
                <>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Event Classification</label>
                      <select
                        value={eventIsUpcoming ? 'upcoming' : 'past'}
                        onChange={(e) => setEventIsUpcoming(e.target.value === 'upcoming')}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', backgroundColor: '#ffffff' }}
                      >
                        <option value="upcoming">Upcoming Event (Accepts registration)</option>
                        <option value="past">Completed Event (Logs event highlights)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Event Type / Tag</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Workshop, Hackathon"
                        value={eventTag}
                        onChange={(e) => setEventTag(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Event Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flutter Bootcamp 2026"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Description</label>
                    <textarea
                      required
                      rows="3"
                      placeholder="Explain what the event is about..."
                      value={eventDesc}
                      onChange={(e) => setEventDesc(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', resize: 'none', fontFamily: 'inherit' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '4px', textTransform: 'uppercase' }}>Date</label>
                      <input
                        type="text"
                        required
                        placeholder="June 12, 2026"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '4px', textTransform: 'uppercase' }}>Time (Upcoming only)</label>
                      <input
                        type="text"
                        placeholder="09:00 AM - 04:30 PM"
                        disabled={!eventIsUpcoming}
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', backgroundColor: eventIsUpcoming ? '#ffffff' : '#f1f5f9' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Venue Location</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Advanced Computing Lab, KEC"
                      value={eventVenue}
                      onChange={(e) => setEventVenue(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                    />
                  </div>

                  {eventIsUpcoming ? (
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Registration URL</label>
                      <input
                        type="text"
                        required={eventIsUpcoming}
                        placeholder="https://forms.gle/..."
                        value={eventLink}
                        onChange={(e) => setEventLink(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                      />
                    </div>
                  ) : (
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Completed Highlight / Summary</label>
                      <input
                        type="text"
                        required={!eventIsUpcoming}
                        placeholder="e.g. 50+ participants built smart IoT nodes."
                        value={eventHighlights}
                        onChange={(e) => setEventHighlights(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                      />
                    </div>
                  )}
                </>
              )}

              {/* Conditional Form: Achievements */}
              {modalType === 'achievement' && (
                <>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Category/Tag</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Student Accomplishment"
                        value={achCategory}
                        onChange={(e) => setAchCategory(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Lucide Icon Type</label>
                      <select
                        value={achIconType}
                        onChange={(e) => setAchIconType(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', backgroundColor: '#ffffff' }}
                      >
                        <option value="trophy">Trophy (Gold)</option>
                        <option value="award">Award (Silver)</option>
                        <option value="star">Star (Orange)</option>
                        <option value="sparkles">Sparkles (Bronze)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Achievement Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. First Prize in Hackathon"
                      value={achTitle}
                      onChange={(e) => setAchTitle(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Description</label>
                    <textarea
                      required
                      rows="4"
                      placeholder="Details of the accomplishment, prize won, or recognition received..."
                      value={achDesc}
                      onChange={(e) => setAchDesc(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', resize: 'none', fontFamily: 'inherit' }}
                    />
                  </div>
                </>
              )}

              {/* Conditional Form: Execomm Members */}
              {modalType === 'member' && (
                <>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Student Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sneha R."
                        value={memberName}
                        onChange={(e) => setMemberName(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Committee Category</label>
                      <select
                        value={memberCategory}
                        onChange={(e) => setMemberCategory(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', backgroundColor: '#ffffff' }}
                      >
                        <option value="main">Main Branch SB</option>
                        <option value="sps">SPS Student Chapter</option>
                        <option value="wie">WIE Affinity Group</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Role / Designation</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Student Branch Vice Chair"
                      value={memberRole}
                      onChange={(e) => setMemberRole(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Role Description</label>
                    <textarea
                      required
                      rows="3"
                      placeholder="Detail their contributions, responsibilities, or bio..."
                      value={memberDesc}
                      onChange={(e) => setMemberDesc(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', resize: 'none', fontFamily: 'inherit' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '4px', textTransform: 'uppercase' }}>Email</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. name.ieee@kec.ac.in"
                        value={memberEmail}
                        onChange={(e) => setMemberEmail(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '4px', textTransform: 'uppercase' }}>LinkedIn URL</label>
                      <input
                        type="text"
                        required
                        placeholder="https://linkedin.com/..."
                        value={memberLinkedin}
                        onChange={(e) => setMemberLinkedin(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Conditional Form: Committees */}
              {modalType === 'committee' && (
                <>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Committee Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Technical Committee"
                        value={commName}
                        onChange={(e) => setCommName(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Volunteers Count</label>
                      <input
                        type="number"
                        required
                        value={commTeamCount}
                        onChange={(e) => setCommTeamCount(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Description / Focus Area</label>
                    <textarea
                      required
                      rows="3"
                      placeholder="Outline what this volunteer group handles..."
                      value={commDesc}
                      onChange={(e) => setCommDesc(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', resize: 'none', fontFamily: 'inherit' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '4px', textTransform: 'uppercase' }}>Committee Lead</label>
                      <input
                        type="text"
                        required
                        placeholder="Manoj Kumar K. (Final ECE)"
                        value={commLead}
                        onChange={(e) => setCommLead(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '4px', textTransform: 'uppercase' }}>Committee Co-Lead</label>
                      <input
                        type="text"
                        required
                        placeholder="Sandhiya R. (Third CSE)"
                        value={commCoLead}
                        onChange={(e) => setCommCoLead(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                      />
                    </div>
                  </div>
                </>
              )}

              {modalType === 'researchpaper' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Paper Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Smart Assistive Glove for Quadriplegic Patients"
                      value={paperTitle}
                      onChange={(e) => setPaperTitle(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Authors / Student Names</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Abhishek M., Sneha R."
                      value={paperAuthors}
                      onChange={(e) => setPaperAuthors(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Category</label>
                      <select
                        value={paperCategory}
                        onChange={(e) => setPaperCategory(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                      >
                        <option value="IEEE">IEEE</option>
                        <option value="Conference">Conference</option>
                        <option value="Journal">Journal</option>
                        <option value="Thesis">Thesis</option>
                        <option value="Workshop">Workshop</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Year</label>
                      <input
                        type="number"
                        value={paperYear}
                        onChange={(e) => setPaperYear(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Abstract / Description</label>
                    <textarea
                      required
                      rows="3"
                      placeholder="Brief summary of the research paper..."
                      value={paperDesc}
                      onChange={(e) => setPaperDesc(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', resize: 'none', fontFamily: 'inherit' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Paper File (Optional)</label>
                    <input
                      type="text"
                      placeholder="paper_filename.pdf or URL"
                      value={paperFile || ''}
                      onChange={(e) => setPaperFile(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                    />
                    <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>📎 Provide file name or download link</p>
                  </div>
                </>
              )}

              {modalType === 'news' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>News Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. IEEE KEC wins Best Branch Award"
                      value={newsTitle}
                      onChange={(e) => setNewsTitle(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>News Source / Publication</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Erode Daily, Tech Journal"
                        value={newsSource}
                        onChange={(e) => setNewsSource(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Date</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Oct 14, 2025"
                        value={newsDate}
                        onChange={(e) => setNewsDate(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>News Summary / Snippet</label>
                    <textarea
                      required
                      rows="3"
                      placeholder="Brief description of the news..."
                      value={newsSnippet}
                      onChange={(e) => setNewsSnippet(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', resize: 'none', fontFamily: 'inherit' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '10px', textTransform: 'uppercase' }}>Card Color Theme</label>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {['#f59e0b', '#8b5cf6', '#10b981', '#ef4444', '#06b6d4', '#ec4899', '#3b82f6', '#f97316'].map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewsColor(color)}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            backgroundColor: color,
                            border: newsColor === color ? '3px solid #0a385b' : '2px solid #e2e8f0',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          title={`Select color ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Modal Actions */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px', flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '8px 20px', fontSize: '13.5px', fontWeight: '700', color: '#64748b', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', fontSize: '13.5px', fontWeight: '700', color: '#ffffff', backgroundColor: '#02619a', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSS Rules */}
      <style>{`
        @keyframes modal-slide-up {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .admin-logout-btn:hover {
          background-color: #ffffff !important;
          color: #0a385b !important;
        }
        .admin-save-btn:hover, .admin-add-btn:hover {
          background-color: #0a385b !important;
          box-shadow: 0 4px 12px rgba(10,56,91,0.2) !important;
        }
        .action-btn-hover-edit:hover {
          border-color: #02619a !important;
          background-color: #f0f7ff !important;
        }
        .action-btn-hover-delete:hover {
          border-color: #ef4444 !important;
          background-color: #fef2f2 !important;
        }
      `}</style>
    </div>
  );
};

export default Admin;
