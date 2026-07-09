import { useState, useEffect } from 'react';
import { Lock, Unlock, LogOut, Check, Trash2, Edit3, Plus, Image as ImageIcon, BarChart3, Database, X, Calendar, Award, Users, Target, Settings, Link as LinkIcon, AlertCircle, FileText, Compass, Layers, Save, RefreshCw, MessageSquare, ArrowUp, ArrowDown, Flame } from 'lucide-react';
import { API, authFetch, settingsService, galleryService, achievementsService, societiesService, teamService, committeesService, eventService, researchService, newsService, videoService, formTemplateService, documentService } from '../services/api';
import { apsData } from '../data/aps';
import { computerSocietyData } from '../data/computerSociety';
import { wieData } from '../data/wie';
import { rasData } from '../data/ras';
import { pesData } from '../data/pes';
import { comsocData } from '../data/comsoc';
import { defaultSyncFiles, WORD_MIME } from '../data/defaultDocuments';


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
  const [activeTab, setActiveTab] = useState('stats'); // 'stats' | 'events' | 'achievements' | 'execomm' | 'committees' | 'gallery' | 'researchpapers' | 'news' | 'branches' | 'highlighted_events'
  
  // Highlighted Events State Hooks
  const [highlightDescription, setHighlightDescription] = useState('');
  const [highlightImage, setHighlightImage] = useState(null);
  const [highlightTheme, setHighlightTheme] = useState('Purple');
  const [isEventHighlighted, setIsEventHighlighted] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [editingHighlightEventId, setEditingHighlightEventId] = useState(null);

  // Execomm Society Branches Management States
  const [selectedBranchKey, setSelectedBranchKey] = useState('ap-s');
  const [branchData, setBranchData] = useState(null);
  const [branchSubTab, setBranchSubTab] = useState('general'); // 'general' | 'about' | 'faculty-leadership' | 'rosters' | 'gallery-contact'
  const [branchSaved, setBranchSaved] = useState(false);

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
  const [accessPin, setAccessPin] = useState('');
  const [isPinEnabled, setIsPinEnabled] = useState(true);

  // New Media Content States
  const [aboutImage, setAboutImage] = useState('/assets/kec_itpark.jpg');
  const [keystonesVideoUrl, setKeystonesVideoUrl] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ');
  const [heroImages, setHeroImages] = useState([]);
  const [newHeroImageUrl, setNewHeroImageUrl] = useState('');

  // Impact Statistics States
  const [impactStats, setImpactStats] = useState([]);
  const [editingImpactId, setEditingImpactId] = useState(null);
  const [impactValueInput, setImpactValueInput] = useState('');
  const [impactLabelInput, setImpactLabelInput] = useState('');
  const [newImpactValue, setNewImpactValue] = useState('');
  const [newImpactLabel, setNewImpactLabel] = useState('');

  // Testimonials States
  const [testimonials, setTestimonials] = useState([]);
  const [editingTestimonialId, setEditingTestimonialId] = useState(null);
  const [testimonialTextInput, setTestimonialTextInput] = useState('');
  const [testimonialAuthorInput, setTestimonialAuthorInput] = useState('');
  const [testimonialRoleInput, setTestimonialRoleInput] = useState('');
  const [newTestimonialText, setNewTestimonialText] = useState('');
  const [newTestimonialAuthor, setNewTestimonialAuthor] = useState('');
  const [newTestimonialRole, setNewTestimonialRole] = useState('');

  // Documents States
  const [driveFolderUrl, setDriveFolderUrl] = useState('https://drive.google.com/drive/folders/1mdrfLwOWprcKEB5PbK6BhWgv1MrrSE-m');
  const [documents, setDocuments] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [isLinkValid, setIsLinkValid] = useState(null);

  // Inline Edit Document
  const [editingDocId, setEditingDocId] = useState(null);
  const [docTitleInput, setDocTitleInput] = useState('');
  const [docCategoryInput, setDocCategoryInput] = useState('');
  const [docDescInput, setDocDescInput] = useState('');
  const [docConfidentialInput, setDocConfidentialInput] = useState(false);

  // Media Videos States
  const [mediaVideos, setMediaVideos] = useState([]);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoDesc, setNewVideoDesc] = useState('');
  const [editingVideoIndex, setEditingVideoIndex] = useState(null);
  const [videoTitleInput, setVideoTitleInput] = useState('');
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [videoDescInput, setVideoDescInput] = useState('');

  // Gallery CRUD State
  const [galleryItems, setGalleryItems] = useState([]);

  // Events CRUD State
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  // Achievements CRUD State
  const [achievements, setAchievements] = useState([]);

  // Execomm CRUD State
  // Execomm CRUD State
  const [societies, setSocieties] = useState([]);
  const [students, setStudents] = useState([]);
  const [execommSubTab, setExecommSubTab] = useState('faculties'); // 'faculties' | 'students'

  // Modal Form Inputs: Societies (Faculties)
  const [societyName, setSocietyName] = useState('');
  const [fac1Name, setFac1Name] = useState('');
  const [fac1Position, setFac1Position] = useState('');
  const [fac1Phone, setFac1Phone] = useState('');
  const [fac2Name, setFac2Name] = useState('');
  const [fac2Position, setFac2Position] = useState('');
  const [fac2Phone, setFac2Phone] = useState('');

  // Modal Form Inputs: Students
  const [studentName, setStudentName] = useState('');
  const [studentDept, setStudentDept] = useState('');
  const [studentYear, setStudentYear] = useState('');
  const [studentIeeeNumber, setStudentIeeeNumber] = useState('');
  const [studentPosition, setStudentPosition] = useState('');
  const [studentSociety, setStudentSociety] = useState('IEEE KEC SB');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentLinkedin, setStudentLinkedin] = useState('');
  const [fac1Image, setFac1Image] = useState('');
  const [fac2Image, setFac2Image] = useState('');
  const [studentImage, setStudentImage] = useState('');

  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editingFacultyId, setEditingFacultyId] = useState(null);
  const [facultyName, setFacultyName] = useState('');
  const [facultyPosition, setFacultyPosition] = useState('');
  const [facultyPhone, setFacultyPhone] = useState('');
  const [facultyEmail, setFacultyEmail] = useState('');
  const [facultyLinkedin, setFacultyLinkedin] = useState('');
  const [facultyImage, setFacultyImage] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [editingGalleryId, setEditingGalleryId] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);
  const [editingAchievementId, setEditingAchievementId] = useState(null);
  const [editingCommitteeId, setEditingCommitteeId] = useState(null);

  const [committees, setCommittees] = useState([]);

  // Custom Page States
  const [aboutKecSb, setAboutKecSb] = useState(null);
  const [, setAboutText] = useState('');
  const [, setHeroVideoUrl] = useState('');
  const [, setEventsPhilosophy] = useState('');
  const [contactPage, setContactPage] = useState(null);
  const [eventsStats, setEventsStats] = useState([]);
  const [eventPhilosophy, setEventPhilosophy] = useState(null);
  const [achievementsStats, setAchievementsStats] = useState([]);
  const [successStories, setSuccessStories] = useState([]);
  const [committeesPhilosophy, setCommitteesPhilosophy] = useState(null);
  const [committeesCta, setCommitteesCta] = useState(null);
  const [aboutSaved, setAboutSaved] = useState(false);
  const [contactSaved, setContactSaved] = useState(false);

  // Request Forms Management States
  const [requestForms, setRequestForms] = useState([]);
  const [editingFormId, setEditingFormId] = useState(null);
  const [formNameInput, setFormNameInput] = useState('');
  const [formSlugInput, setFormSlugInput] = useState('');
  const [formUrlInput, setFormUrlInput] = useState('');
  const [formDescInput, setFormDescInput] = useState('');
  const [formActiveInput, setFormActiveInput] = useState(true);
  const [formConfidentialInput, setFormConfidentialInput] = useState(false);
  const [formCategoryInput, setFormCategoryInput] = useState('Membership');
  const [formDisplayOrderInput, setFormDisplayOrderInput] = useState(1);
  const [previewFormUrl, setPreviewFormUrl] = useState('');
  const [requestFormsSubTab, setRequestFormsSubTab] = useState('templates'); // 'templates' | 'submissions'
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);

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
  const [eventShowNewBadge, setEventShowNewBadge] = useState(false);

  // Modal Form Inputs: Achievements
  const [achTitle, setAchTitle] = useState('');
  const [achCategory, setAchCategory] = useState('');
  const [achDesc, setAchDesc] = useState('');
  const [achIconType, setAchIconType] = useState('trophy');



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
  const [newsCoverType, setNewsCoverType] = useState('color'); // 'color' | 'image'

  // News CRUD State
  const [newsItems, setNewsItems] = useState([]);

  // Predefined defaults
  const defaultAdmins = [
    { email: 'sakthipranavs.24cse@kongu.edu', password: '123456' },
    { email: 'ieee@kongu.edu', password: 'admin123' }
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoggedIn(true);
    }

    // Load Overview/Stats & Site Content Values
    setMemberCount('45');
    setEventsCount('75+');
    setAwardsCount('18+');
    setPapersCount('15');
    setMission(defaultMission);
    setVision(defaultVision);
    setAccessPin('1234');
    setIsPinEnabled(false);

    setTickerNoticesText(defaultTicker.join('\n'));
    // Load Gallery and Videos are now handled entirely by the API fetch

    // Load Events from API
    const fetchEvents = async () => {
      try {
        const data = await eventService.getAll();
        const formattedData = data.map(evt => ({ ...evt, id: evt._id }));
        
        const upcoming = formattedData.filter(evt => evt.isUpcoming);
        const past = formattedData.filter(evt => !evt.isUpcoming);
        
        setUpcomingEvents(upcoming);
        setPastEvents(past);
      } catch (err) {
        console.error("Events fetch error:", err);
      }
    };
    
    // Load Gallery from API
    const fetchGallery = async () => {
      try {
        const data = await galleryService.getAll();
        const formattedData = data.map(g => ({
          id: g._id,
          title: g.title,
          cat: g.category,
          text: g.description,
          images: g.images || []
        }));
        setGalleryItems(formattedData);
      } catch (err) {
        console.error("Gallery fetch error:", err);
      }
    };
    
    if (isLoggedIn) {
      fetchEvents();
      fetchGallery();
      
      const loadAllData = async () => {
        try {
          const [
            achievementsRes,
            committeesRes,
            researchRes,
            newsRes,
            videosRes,
            societiesRes,
            studentsRes,
            formsRes,
            documentsRes
          ] = await Promise.all([
            achievementsService.getAll().catch(() => []),
            committeesService.getAll().catch(() => []),
            researchService.getAll().catch(() => []),
            newsService.getAll().catch(() => []),
            videoService.getAll().catch(() => []),
            societiesService.getAll().catch(() => []),
            teamService.getAll().catch(() => []), // Assuming team is for students
            formTemplateService.getAll().catch(() => []),
            documentService.getAll().catch(() => [])
          ]);

          setAchievements(achievementsRes);
          setCommittees(committeesRes);
          setResearchPapers(researchRes);
          setNewsItems(newsRes);
          setMediaVideos(videosRes);
          setSocieties(societiesRes);
          setStudents(studentsRes);
          setRequestForms(formsRes);
          setDocuments(documentsRes);
        } catch (e) { console.error("Error loading module data:", e); }
      };
      
      loadAllData();
      
      // Still load true settings
      const loadSettings = async () => {
        try {
          const settings = await settingsService.getAll();
          const settingsMap = {};
          if (Array.isArray(settings)) {
            settings.forEach(s => settingsMap[s.key] = s.value);
          }
          // Apply individual settings
          if (settingsMap['ieee_about_text']) setAboutText(settingsMap['ieee_about_text']);
          if (settingsMap['ieee_mission']) setMission(settingsMap['ieee_mission']);
          if (settingsMap['ieee_vision']) setVision(settingsMap['ieee_vision']);
          if (settingsMap['ieee_hero_images']) setHeroImages(settingsMap['ieee_hero_images']);
          if (settingsMap['ieee_keystones_video_url_v2']) setHeroVideoUrl(settingsMap['ieee_keystones_video_url_v2']);
          if (settingsMap['ieee_about_image']) setAboutImage(settingsMap['ieee_about_image']);
          if (settingsMap['ieee_events_stats_v1']) setEventsStats(settingsMap['ieee_events_stats_v1']);
          if (settingsMap['ieee_events_philosophy_v1']) setEventsPhilosophy(settingsMap['ieee_events_philosophy_v1']);
          if (settingsMap['ieee_impact_stats']) setImpactStats(settingsMap['ieee_impact_stats']);
          if (settingsMap['ieee_testimonials']) setTestimonials(settingsMap['ieee_testimonials']);
        } catch (e) { console.error("Error loading settings:", e); }
      };
      loadSettings();
    }
  }, []);

  // Load current branch details on selected branch key changes
  useEffect(() => {
    const key = selectedBranchKey;
    const stored = null;
    if (stored) {
      try {
        setBranchData(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Revert to import falls
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (key === 'ap-s') setBranchData(JSON.parse(JSON.stringify(apsData)));
      else if (key === 'computer-society') setBranchData(JSON.parse(JSON.stringify(computerSocietyData)));
      else if (key === 'wie') setBranchData(JSON.parse(JSON.stringify(wieData)));
      else if (key === 'ras') setBranchData(JSON.parse(JSON.stringify(rasData)));
      else if (key === 'pes') setBranchData(JSON.parse(JSON.stringify(pesData)));
      else if (key === 'comsoc') setBranchData(JSON.parse(JSON.stringify(comsocData)));
    }
    setBranchSaved(false);
  }, [selectedBranchKey]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      const response = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setIsLoggedIn(true);
        sessionStorage.setItem('ieee_admin_session', 'active');
        localStorage.setItem('ieee_admin_token', data.token);
        setLoginError('');
      } else {
        setLoginError(data.message || 'Invalid Email or Password');
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Failed to connect to backend server.");
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
    const storedAdmins = JSON.parse('[]');
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
    settingsService.set('ieee_registered_admins', JSON.stringify(updatedAdmins));

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

  const handleAddNewFormClick = () => {
    setEditingFormId('new');
    setFormNameInput('');
    setFormSlugInput('');
    setFormUrlInput('');
    setFormDescInput('');
    setFormActiveInput(true);
    setFormConfidentialInput(false);
    setFormCategoryInput('Membership');
    setFormDisplayOrderInput(requestForms.length + 1);
    setPreviewFormUrl('');
  };

  const handleEditFormClick = (form) => {
    setEditingFormId(form.id);
    setFormNameInput(form.form_name);
    setFormSlugInput(form.route_slug);
    setFormUrlInput(form.google_form_url || '');
    setFormDescInput(form.description || '');
    setFormActiveInput(form.is_active);
    setFormConfidentialInput(form.is_confidential || false);
    setFormCategoryInput(form.category || 'Membership');
    setFormDisplayOrderInput(form.display_order !== undefined ? form.display_order : 1);
    setPreviewFormUrl(form.google_form_url || '');
  };

  const handleSaveRequestForm = (e) => {
    e.preventDefault();
    if (!formNameInput.trim() || !formSlugInput.trim()) return;

    // Simple auto-conversion for docs.google.com/forms viewform URLs
    let sanitizedUrl = formUrlInput.trim();
    if (sanitizedUrl && sanitizedUrl.includes('docs.google.com/forms') && !sanitizedUrl.includes('embedded=true')) {
      const viewformIndex = sanitizedUrl.indexOf('/viewform');
      if (viewformIndex !== -1) {
        sanitizedUrl = sanitizedUrl.substring(0, viewformIndex + 9);
      }
      sanitizedUrl += '?embedded=true';
    }

    let updatedForms;
    const cleanSlug = formSlugInput.toLowerCase().replace(/[^a-z0-9_-]/g, '-');

    if (editingFormId === 'new') {
      const newId = Math.max(0, ...requestForms.map(f => typeof f.id === 'number' ? f.id : 0)) + 1;
      const newForm = {
        id: newId,
        form_name: formNameInput.trim(),
        route_slug: cleanSlug,
        google_form_url: sanitizedUrl,
        description: formDescInput.trim(),
        category: formCategoryInput,
        display_order: Number(formDisplayOrderInput),
        is_active: formActiveInput,
        is_confidential: formConfidentialInput,
        updated_at: new Date().toLocaleDateString(),
        updated_by: email || "Admin"
      };
      updatedForms = [...requestForms, newForm];
    } else {
      updatedForms = requestForms.map(form => 
        form.id === editingFormId 
          ? { 
              ...form, 
              form_name: formNameInput.trim(), 
              route_slug: cleanSlug, 
              google_form_url: sanitizedUrl, 
              description: formDescInput.trim(),
              category: formCategoryInput,
              display_order: Number(formDisplayOrderInput),
              is_active: formActiveInput,
              is_confidential: formConfidentialInput,
              updated_at: new Date().toLocaleDateString(),
              updated_by: email || "Admin"
            }
          : form
      );
    }

    setRequestForms(updatedForms);
    settingsService.set('ieee_request_forms', JSON.stringify(updatedForms));
    setEditingFormId(null);
    setPreviewFormUrl('');
  };

  const handleDeleteRequestForm = (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this request form template?")) return;
    const updated = requestForms.filter(form => form.id !== id);
    setRequestForms(updated);
    settingsService.set('ieee_request_forms', JSON.stringify(updated));
  };

  const handleDeleteSubmission = (id) => {
    if (!window.confirm("Are you sure you want to delete this submission?")) return;
    const updated = submissions.filter(s => s.id !== id);
    setSubmissions(updated);
    settingsService.set('ieee_form_submissions', JSON.stringify(updated));
  };

  // Stats & Site Settings Save
  const handleSaveStats = (e) => {
    e.preventDefault();
    settingsService.set('ieee_member_count', memberCount);
    settingsService.set('ieee_events_count', eventsCount);
    settingsService.set('ieee_awards_count', awardsCount);
    settingsService.set('ieee_papers_count', papersCount);
    settingsService.set('ieee_mission', mission);
    settingsService.set('ieee_vision', vision);
    settingsService.set('ieee_access_pin', accessPin);
    settingsService.set('ieee_pin_enabled', isPinEnabled);
    settingsService.set('ieee_about_image', aboutImage);
    settingsService.set('ieee_keystones_video_url_v2', keystonesVideoUrl);
    settingsService.set('ieee_hero_images', JSON.stringify(heroImages));

    // Convert ticker notices from lines to string array
    const tickerArray = tickerNoticesText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    settingsService.set('ieee_ticker_notices', JSON.stringify(tickerArray));

    setStatsSaved(true);
    setTimeout(() => setStatsSaved(false), 3000);
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

  const handleNewsImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      setNewsImage(compressed);
    } catch (err) {
      console.error("Error compressing news image:", err);
    }
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
      setEventLink('https://forms.gle/KEC-IEEE-Events-Registration');
      setEventHighlights('');
      setEventShowNewBadge(false);
      setIsEventHighlighted(false);
      setHighlightDescription('');
      setHighlightImage(null);
      setHighlightTheme('Purple');
    } else if (type === 'achievement') {
      setAchTitle('');
      setAchCategory('');
      setAchDesc('');
      setAchIconType('trophy');
    } else if (type === 'society') {
      setSocietyName('');
      setFac1Name('');
      setFac1Position('');
      setFac1Phone('');
      setFac1Image('');
      setFac2Name('');
      setFac2Position('');
      setFac2Phone('');
      setFac2Image('');
    } else if (type === 'student') {
      setStudentName('');
      setStudentDept('');
      setStudentYear('III');
      setStudentIeeeNumber('');
      setStudentPosition('Member');
      setStudentSociety('IEEE KEC SB');
      setStudentImage('');
      setStudentEmail('');
      setStudentPhone('');
      setStudentLinkedin('');
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
      setNewsCoverType('color');
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
      setEventShowNewBadge(item.showNewBadge || false);
      setIsEventHighlighted(item.isHighlighted || false);
      setHighlightDescription(item.highlightDescription || item.desc || '');
      setHighlightImage(item.highlightImage || null);
      setHighlightTheme(item.highlightTheme || 'Purple');
    } else if (type === 'achievement') {
      setAchTitle(item.title);
      setAchCategory(item.category);
      setAchDesc(item.desc);
      setAchIconType(item.iconType);
    } else if (type === 'society') {
      setSocietyName(item.name || '');
      setFac1Name(item.faculty1?.name || '');
      setFac1Position(item.faculty1?.position || '');
      setFac1Phone(item.faculty1?.phone || '');
      setFac1Image(item.faculty1?.image || '');
      setFac2Name(item.faculty2?.name || '');
      setFac2Position(item.faculty2?.position || '');
      setFac2Phone(item.faculty2?.phone || '');
      setFac2Image(item.faculty2?.image || '');
    } else if (type === 'student') {
      setStudentName(item.name || '');
      setStudentDept(item.department || '');
      setStudentYear(item.yearOfStudy || '');
      setStudentIeeeNumber(item.ieeeNumber || '');
      setStudentPosition(item.position || '');
      setStudentSociety(item.society || 'IEEE KEC SB');
      setStudentImage(item.image || '');
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
      setNewsImage(item.image || null);
      setNewsCoverType(item.image ? 'image' : 'color');
    }
    setIsModalOpen(true);
  };

  // Generic Delete Actions
  const handleDeleteItem = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type} item?`)) return;

    if (type === 'gallery') {
      try {
        await galleryService.delete(id);
        const updated = galleryItems.filter(item => item.id !== id);
        setGalleryItems(updated);
      } catch (err) {
        console.error('Error deleting gallery item:', err);
        alert('Error deleting gallery item: ' + err.message);
      }
    } else if (type === 'event') {
      const deleteEvent = async () => {
        try {
          await eventService.delete(id);
          
          const updatedUpcoming = upcomingEvents.filter(item => item.id !== id);
          const updatedPast = pastEvents.filter(item => item.id !== id);
          setUpcomingEvents(updatedUpcoming);
          setPastEvents(updatedPast);
        } catch (err) {
          console.error('Error deleting event:', err);
          alert('Error deleting event: ' + err.message);
        }
      };
      deleteEvent();
    } else if (type === 'achievement') {
      try {
        await achievementsService.delete(id);
        setAchievements(achievements.filter(item => item.id !== id));
      } catch (err) { console.error(err); }
    } else if (type === 'society') {
      try {
        await societiesService.delete(id);
        setSocieties(societies.filter(item => item.id !== id));
      } catch (err) { console.error(err); }
    } else if (type === 'student') {
      try {
        await teamService.delete(id);
        setStudents(students.filter(item => item.id !== id));
      } catch (err) { console.error(err); }
    } else if (type === 'committee') {
      try {
        await committeesService.delete(id);
        setCommittees(committees.filter(item => item.id !== id));
      } catch (err) { console.error(err); }
    } else if (type === 'researchpaper') {
      try {
        await researchService.delete(id);
        setResearchPapers(researchPapers.filter(item => item.id !== id));
        const currentCount = parseInt(papersCount) || 0;
        const newCount = Math.max(currentCount - 1, 0);
        setPapersCount(newCount.toString());
        settingsService.set('ieee_papers_count', newCount.toString());
      } catch (err) { console.error(err); }
    } else if (type === 'news') {
      try {
        await newsService.delete(id);
        setNewsItems(newsItems.filter(item => item.id !== id));
      } catch (err) { console.error(err); }
    }
  };

  // Generic Save Logic
  const handleSaveItem = async (e) => {
    e.preventDefault();

    if (modalType === 'gallery') {
      if (!formTitle.trim() || !formText.trim()) return;
      const saveGallery = async () => {
        try {
          const payload = {
            title: formTitle,
            category: formCat,
            description: formText,
            images: formImages
          };
          let savedGallery;
          if (modalMode === 'add') {
            savedGallery = await galleryService.create(payload);
          } else {
            savedGallery = await galleryService.update(currentItemId, payload);
          }
          // Transform backend response to frontend format
          const formattedItem = {
            id: savedGallery._id,
            title: savedGallery.title,
            cat: savedGallery.category,
            text: savedGallery.description,
            images: savedGallery.images || []
          };
          
          if (modalMode === 'add') {
            setGalleryItems(prev => [...prev, formattedItem]);
          } else {
            setGalleryItems(prev => prev.map(item => item.id === currentItemId ? formattedItem : item));
          }
          setIsModalOpen(false);
        } catch (err) {
          console.error('Error saving gallery item:', err);
          alert('Error saving gallery item: ' + err.message);
          throw err;
        }
      };
      
      try {
        await saveGallery();
      } catch (err) {
        console.error(err);
        return;
      }    } else if (modalType === 'event') {
      if (!eventTitle.trim() || !eventDesc.trim() || !eventDate.trim() || !eventVenue.trim()) return;

      const newEventData = {
        title: eventTitle,
        desc: eventDesc,
        date: eventDate,
        time: eventTime,
        venue: eventVenue,
        tag: eventTag,
        link: eventLink,
        highlights: eventHighlights,
        isHighlighted: isEventHighlighted,
        highlightOrder: isEventHighlighted ? pastEvents.find(e => e.id === currentItemId)?.highlightOrder || (pastEvents.filter(e => e.isHighlighted).length + 1) : 0,
        highlightDescription: highlightDescription || eventDesc,
        highlightImage: highlightImage,
        highlightTheme: highlightTheme,
        isUpcoming: eventIsUpcoming
      };

      const saveEvent = async () => {
        try {
          let url = `${API}/events`;
          let method = 'POST';

          if (modalMode === 'edit') {
            url = `${API}/events/${currentItemId}`;
            method = 'PUT';
          }

          const response = await authFetch(url, {
            method,
            body: JSON.stringify(newEventData)
          });

          if (!response.ok) throw new Error('Failed to save event');
          
          const savedEvent = await response.json();
          savedEvent.id = savedEvent._id; 

          if (modalMode === 'edit') {
            setUpcomingEvents(prev => prev.filter(e => e.id !== currentItemId));
            setPastEvents(prev => prev.filter(e => e.id !== currentItemId));
          }

          if (savedEvent.isUpcoming) {
            setUpcomingEvents(prev => [...prev, savedEvent]);
          } else {
            setPastEvents(prev => [...prev, savedEvent]);
          }
          setIsModalOpen(false);
        } catch (err) {
          console.error(err);
          alert('Error saving event: ' + err.message);
          return;
        }
      };
      saveEvent();

    } else if (modalType === 'achievement') {
      if (!achTitle.trim() || !achCategory.trim() || !achDesc.trim()) return;
      const payload = { title: achTitle, category: achCategory, desc: achDesc, iconType: achIconType };
      try {
        if (modalMode === 'add') {
          payload.id = achievements.length > 0 ? Math.max(...achievements.map(i => i.id)) + 1 : 1;
          const saved = await achievementsService.create(payload);
          setAchievements([...achievements, saved]);
        } else {
          const saved = await achievementsService.update(currentItemId, payload);
          setAchievements(achievements.map(item => item.id === currentItemId ? saved : item));
        }
      } catch (e) { console.error(e); }

    } else if (modalType === 'society') {
      if (!societyName.trim()) return;
      const payload = {
        name: societyName,
        faculty1: { name: fac1Name, position: fac1Position, phone: fac1Phone, image: fac1Image },
        faculty2: { name: fac2Name, position: fac2Position, phone: fac2Phone, image: fac2Image }
      };
      try {
        if (modalMode === 'add') {
          payload.id = societies.length > 0 ? Math.max(...societies.map(i => i.id)) + 1 : 1;
          const saved = await societiesService.create(payload);
          setSocieties([...societies, saved]);
        } else {
          const saved = await societiesService.update(currentItemId, payload);
          setSocieties(societies.map(item => item.id === currentItemId ? saved : item));
        }
      } catch (e) { console.error(e); }

    } else if (modalType === 'student') {
      if (!studentName.trim() || !studentDept.trim() || !studentYear.trim() || !studentIeeeNumber.trim() || !studentPosition.trim()) return;
      const payload = {
        name: studentName, department: studentDept, yearOfStudy: studentYear,
        ieeeNumber: studentIeeeNumber, position: studentPosition, society: studentSociety,
        image: studentImage, email: studentEmail, phone: studentPhone, linkedin: studentLinkedin
      };
      try {
        if (modalMode === 'add') {
          payload.id = students.length > 0 ? Math.max(...students.map(i => i.id)) + 1 : 1;
          const saved = await teamService.create(payload);
          setStudents([...students, saved]);
        } else {
          const saved = await teamService.update(currentItemId, payload);
          setStudents(students.map(item => item.id === currentItemId ? saved : item));
        }
      } catch (e) { console.error(e); }

    } else if (modalType === 'committee') {
      if (!commName.trim() || !commDesc.trim() || !commLead.trim() || !commCoLead.trim()) return;
      const payload = {
        name: commName, desc: commDesc, lead: commLead, coLead: commCoLead, teamCount: parseInt(commTeamCount) || 10
      };
      try {
        if (modalMode === 'add') {
          payload.id = committees.length > 0 ? Math.max(...committees.map(i => i.id)) + 1 : 1;
          const saved = await committeesService.create(payload);
          setCommittees([...committees, saved]);
        } else {
          const saved = await committeesService.update(currentItemId, payload);
          setCommittees(committees.map(item => item.id === currentItemId ? saved : item));
        }
      } catch (e) { console.error(e); }

    } else if (modalType === 'researchpaper') {
      if (!paperTitle.trim() || !paperAuthors.trim() || !paperDesc.trim()) return;
      const payload = {
        title: paperTitle, authors: paperAuthors, category: paperCategory, desc: paperDesc, year: paperYear, fileUrl: paperFile || `paper_${Date.now()}.pdf`
      };
      try {
        if (modalMode === 'add') {
          payload.id = researchPapers.length > 0 ? Math.max(...researchPapers.map(i => i.id)) + 1 : 1;
          const saved = await researchService.create(payload);
          setResearchPapers([...researchPapers, saved]);
          const newCount = (parseInt(papersCount) || 0) + 1;
          setPapersCount(newCount.toString());
          settingsService.set('ieee_papers_count', newCount.toString());
        } else {
          const saved = await researchService.update(currentItemId, payload);
          setResearchPapers(researchPapers.map(item => item.id === currentItemId ? saved : item));
        }
      } catch (e) { console.error(e); }
    } else if (modalType === 'news') {
      if (!newsTitle.trim() || !newsSource.trim() || !newsDate.trim() || !newsSnippet.trim()) return;
      const payload = {
        title: newsTitle, source: newsSource, date: newsDate, snippet: newsSnippet, color: newsColor, image: newsCoverType === 'image' ? newsImage : null
      };
      try {
        if (modalMode === 'add') {
          payload.id = newsItems.length > 0 ? Math.max(...newsItems.map(i => i.id)) + 1 : 1;
          const saved = await newsService.create(payload);
          setNewsItems([...newsItems, saved]);
        } else {
          const saved = await newsService.update(currentItemId, payload);
          setNewsItems(newsItems.map(item => item.id === currentItemId ? saved : item));
        }
      } catch (e) { console.error(e); }
    }

    setIsModalOpen(false);
  };


  const startInlineEditFaculty = (fac) => {
    setFacultyName(fac.name || '');
    setFacultyPosition(fac.position || '');
    setFacultyPhone(fac.phone || '');
    setFacultyEmail(fac.email || '');
    setFacultyLinkedin(fac.linkedin || '');
    setFacultyImage(fac.image || '');
    setEditingFacultyId(fac.id);
  };

  const saveInlineFaculty = async (id) => {
    const [socId, facNum] = id.split('_').map(Number);
    try {
      const currentItem = societies.find(s => s.id === socId);
      const updatedFaculty = {
        name: facultyName,
        position: facultyPosition,
        phone: facultyPhone,
        email: facultyEmail,
        linkedin: facultyLinkedin,
        image: facultyImage
      };
      const payload = {
        ...currentItem,
        [facNum === 1 ? 'faculty1' : 'faculty2']: updatedFaculty
      };
      const saved = await societiesService.update(socId, payload);
      setSocieties(prev => prev.map(item => item.id === socId ? { ...item, ...saved } : item));
    } catch (err) { console.error('Error updating faculty inline', err); }
    setEditingFacultyId(null);
  };

  const deleteFaculty = async (id) => {
    if (!window.confirm("Are you sure you want to clear/delete this faculty advisor's details?")) return;
    const [socId, facNum] = id.split('_').map(Number);
    try {
      const currentItem = societies.find(s => s.id === socId);
      const emptyFaculty = { name: '', position: '', phone: '', email: '', linkedin: '', image: '' };
      const payload = {
        ...currentItem,
        [facNum === 1 ? 'faculty1' : 'faculty2']: emptyFaculty
      };
      const saved = await societiesService.update(socId, payload);
      setSocieties(prev => prev.map(item => item.id === socId ? { ...item, ...saved } : item));
    } catch (err) { console.error('Error deleting faculty', err); }
  };

  const startInlineEditStudent = (item) => {
    setStudentName(item.name || '');
    setStudentDept(item.department || '');
    setStudentYear(item.yearOfStudy || '');
    setStudentIeeeNumber(item.ieeeNumber || '');
    setStudentPosition(item.position || '');
    setStudentSociety(item.society || 'IEEE KEC SB');
    setStudentImage(item.image || '');
    setStudentEmail(item.email || '');
    setStudentPhone(item.phone || '');
    setStudentLinkedin(item.linkedin || '');
    setEditingStudentId(item.id);
  };

  const saveInlineStudent = async (id) => {
    if (!studentName.trim() || !studentDept.trim() || !studentYear.trim() || !studentIeeeNumber.trim() || !studentPosition.trim()) return;
    try {
      const payload = {
        name: studentName,
        department: studentDept,
        yearOfStudy: studentYear,
        ieeeNumber: studentIeeeNumber,
        position: studentPosition,
        society: studentSociety,
        image: studentImage,
        email: studentEmail,
        phone: studentPhone,
        linkedin: studentLinkedin
      };
      const saved = await teamService.update(id, payload);
      setStudents(prev => prev.map(item => item.id === id ? { ...item, ...saved } : item));
    } catch (err) { console.error('Error updating student inline', err); }
    setEditingStudentId(null);
  };

  const startInlineEditGallery = (item) => {
    setFormTitle(item.title);
    setFormCat(item.cat);
    setFormText(item.text);
    setFormImages(item.images || []);
    setEditingGalleryId(item.id);
  };

  const saveInlineGallery = async (id) => {
    if (!formTitle.trim() || !formText.trim()) return;
    const payload = { title: formTitle, category: formCat, description: formText, images: formImages };
    try {
      const saved = await galleryService.update(id, payload);
      const updated = galleryItems.map(item =>
        item.id === id
          ? { ...item, title: saved.title, cat: saved.category, text: saved.description, images: saved.images || [] }
          : item
      );
      setGalleryItems(updated);
      setEditingGalleryId(null);
    } catch (err) { console.error(err); }
  };

  const startInlineEditEvent = (item, isUpcoming) => {
    setEventTitle(item.title);
    setEventDesc(item.desc);
    setEventDate(item.date);
    setEventTime(item.time || '');
    setEventVenue(item.venue);
    setEventTag(item.tag);
    setEventIsUpcoming(isUpcoming);
    setEventLink(item.link || '');
    setEventHighlights(item.highlights || '');
    setEditingEventId(item.id);
  };

  const saveInlineEvent = (id) => {
    if (!eventTitle.trim() || !eventDesc.trim() || !eventDate.trim() || !eventVenue.trim()) return;
    
    const saveEvent = async () => {
      try {
        const updateData = eventIsUpcoming 
          ? { title: eventTitle, desc: eventDesc, date: eventDate, time: eventTime, venue: eventVenue, tag: eventTag, link: eventLink, isUpcoming: true }
          : { title: eventTitle, desc: eventDesc, date: eventDate, time: eventTime, venue: eventVenue, tag: eventTag, highlights: eventHighlights, isUpcoming: false };
          
        const response = await authFetch(`${API}/events/${id}`, {
          method: 'PUT',
          body: JSON.stringify(updateData)
        });
        
        if (!response.ok) throw new Error('Failed to update event inline');
        const savedEvent = await response.json();
        savedEvent.id = savedEvent._id;
        
        if (eventIsUpcoming) {
          const updated = upcomingEvents.map(item => item.id === id ? { ...item, ...savedEvent } : item);
          setUpcomingEvents(updated);
        } else {
          const updated = pastEvents.map(item => item.id === id ? { ...item, ...savedEvent } : item);
          setPastEvents(updated);
        }
      } catch (err) {
        console.error(err);
        alert('Error updating event: ' + err.message);
      }
      setEditingEventId(null);
    };
    saveEvent();
  };

  const startInlineEditAchievement = (item) => {
    setAchTitle(item.title);
    setAchCategory(item.category);
    setAchDesc(item.desc);
    setAchIconType(item.iconType);
    setEditingAchievementId(item.id);
  };

  const saveInlineAchievement = async (id) => {
    if (!achTitle.trim() || !achDesc.trim()) return;
    try {
      const payload = { title: achTitle, category: achCategory, description: achDesc, iconType: achIconType };
      const saved = await achievementsService.update(id, payload);
      const updated = achievements.map(item => item.id === id ? { ...item, ...saved, desc: saved.description } : item);
      setAchievements(updated);
    } catch (err) { console.error('Error updating achievement inline', err); }
    setEditingAchievementId(null);
  };

  const startInlineEditCommittee = (item) => {
    setCommName(item.name);
    setCommDesc(item.desc);
    setCommLead(item.lead);
    setCommCoLead(item.coLead);
    setCommTeamCount(item.teamCount);
    setEditingCommitteeId(item.id);
  };

  const saveInlineCommittee = async (id) => {
    if (!commName.trim() || !commDesc.trim() || !commLead.trim()) return;
    try {
      const payload = { name: commName, description: commDesc, lead: commLead, coLead: commCoLead, teamCount: commTeamCount };
      const saved = await committeesService.update(id, payload);
      setCommittees(prev => prev.map(item => item.id === id ? { ...item, ...saved, desc: saved.description } : item));
    } catch (err) { console.error('Error updating committee inline', err); }
    setEditingCommitteeId(null);
  };


  // Helper functions for Impact Stats
  const startInlineEditImpact = (item) => {
    setImpactValueInput(item.value || '');
    setImpactLabelInput(item.label || '');
    setEditingImpactId(item.id);
  };

  const saveInlineImpact = (id) => {
    if (!impactValueInput.trim() || !impactLabelInput.trim()) return;
    const updated = impactStats.map(item =>
      item.id === id
        ? { ...item, value: impactValueInput, label: impactLabelInput }
        : item
    );
    setImpactStats(updated);
    settingsService.set('ieee_impact_stats', JSON.stringify(updated));
    setEditingImpactId(null);
  };

  const handleDeleteImpact = (id) => {
    if (!window.confirm("Are you sure you want to delete this statistic?")) return;
    const updated = impactStats.filter(item => item.id !== id);
    setImpactStats(updated);
    settingsService.set('ieee_impact_stats', JSON.stringify(updated));
  };

  const handleAddImpact = (e) => {
    e.preventDefault();
    if (!newImpactValue.trim() || !newImpactLabel.trim()) return;
    const newItem = {
      id: impactStats.length > 0 ? Math.max(...impactStats.map(i => i.id)) + 1 : 1,
      value: newImpactValue.trim(),
      label: newImpactLabel.trim()
    };
    const updated = [...impactStats, newItem];
    setImpactStats(updated);
    settingsService.set('ieee_impact_stats', JSON.stringify(updated));
    setNewImpactValue('');
    setNewImpactLabel('');
  };

  const handleMoveImpactUp = (index) => {
    if (index === 0) return;
    const updated = [...impactStats];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setImpactStats(updated);
    settingsService.set('ieee_impact_stats', JSON.stringify(updated));
  };

  const handleMoveImpactDown = (index) => {
    if (index === impactStats.length - 1) return;
    const updated = [...impactStats];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setImpactStats(updated);
    settingsService.set('ieee_impact_stats', JSON.stringify(updated));
  };

  // Helper functions for Testimonials
  const startInlineEditTestimonial = (item) => {
    setTestimonialTextInput(item.text || '');
    setTestimonialAuthorInput(item.author || '');
    setTestimonialRoleInput(item.role || '');
    setEditingTestimonialId(item.id);
  };

  const saveInlineTestimonial = (id) => {
    if (!testimonialTextInput.trim() || !testimonialAuthorInput.trim() || !testimonialRoleInput.trim()) return;
    const updated = testimonials.map(item =>
      item.id === id
        ? { ...item, text: testimonialTextInput, author: testimonialAuthorInput, role: testimonialRoleInput }
        : item
    );
    setTestimonials(updated);
    settingsService.set('ieee_testimonials', JSON.stringify(updated));
    setEditingTestimonialId(null);
  };

  const handleDeleteTestimonial = (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    const updated = testimonials.filter(item => item.id !== id);
    setTestimonials(updated);
    settingsService.set('ieee_testimonials', JSON.stringify(updated));
  };

  const handleAddTestimonial = (e) => {
    e.preventDefault();
    if (!newTestimonialText.trim() || !newTestimonialAuthor.trim() || !newTestimonialRole.trim()) return;
    const newItem = {
      id: testimonials.length > 0 ? Math.max(...testimonials.map(i => i.id)) + 1 : 1,
      text: newTestimonialText.trim(),
      author: newTestimonialAuthor.trim(),
      role: newTestimonialRole.trim()
    };
    const updated = [...testimonials, newItem];
    setTestimonials(updated);
    settingsService.set('ieee_testimonials', JSON.stringify(updated));
    setNewTestimonialText('');
    setNewTestimonialAuthor('');
    setNewTestimonialRole('');
  };

  // Helper functions for Documents Repository
  const getFolderId = (url) => {
    if (!url) return null;
    const match = url.match(/folders\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const handleSaveDriveUrl = (e) => {
    e.preventDefault();
    if (!driveFolderUrl.trim()) return;
    settingsService.set('ieee_drive_folder_url', driveFolderUrl.trim());
    setSyncMessage('Drive folder link saved successfully!');
    setTimeout(() => setSyncMessage(''), 3000);
  };

  const handleValidateLink = () => {
    setValidationMessage('');
    setIsLinkValid(null);
    
    const folderId = getFolderId(driveFolderUrl);
    if (folderId) {
      setIsLinkValid(true);
      setValidationMessage(`Success: Google Drive folder link is valid (Folder ID: ${folderId}).`);
    } else {
      setIsLinkValid(false);
      setValidationMessage('Error: Invalid Google Drive folder link. Must be in the format: https://drive.google.com/drive/folders/FOLDER_ID');
    }
  };



  const generateMockFiles = (folderId) => {
    return [
      {
        id: `doc_1_${folderId}`,
        name: `Synced_Document_1_${folderId}.docx`,
        title: `Synced Document 1 (${folderId})`,
        mimeType: WORD_MIME,
        size: '1.5 MB',
        uploadDate: new Date().toISOString().split('T')[0],
        category: 'Others',
        description: `Synced from folder ${folderId}`,
        isVisible: true,
        isFeatured: false,
        featuredOrder: 99
      },
      {
        id: `doc_2_${folderId}`,
        name: `Resource_Guide_${folderId}.docx`,
        title: `Resource Guide (${folderId})`,
        mimeType: WORD_MIME,
        size: '2.1 MB',
        uploadDate: new Date().toISOString().split('T')[0],
        category: 'Membership Documents',
        description: `Synced guide for folder ${folderId}`,
        isVisible: true,
        isFeatured: false,
        featuredOrder: 99
      },
      {
        id: `doc_3_${folderId}`,
        name: `Event_Template_${folderId}.docx`,
        title: `Event Template (${folderId})`,
        mimeType: WORD_MIME,
        size: '800 KB',
        uploadDate: new Date().toISOString().split('T')[0],
        category: 'Event Resources',
        description: `Event template from folder ${folderId}`,
        isVisible: true,
        isFeatured: false,
        featuredOrder: 99
      }
    ];
  };

  const handleSyncDocuments = () => {
    setIsSyncing(true);
    setSyncMessage('');
    
    setTimeout(() => {
      const folderId = getFolderId(driveFolderUrl);
      if (!folderId) {
        setSyncMessage('Error: Invalid Google Drive folder link. Please validate link.');
        setIsSyncing(false);
        return;
      }
      
      let sourceFiles;
      if (folderId === '1mdrfLwOWprcKEB5PbK6BhWgv1MrrSE-m') {
        sourceFiles = defaultSyncFiles;
      } else {
        sourceFiles = generateMockFiles(folderId);
      }
      
      // Load current documents from localStorage
      const currentDocs = JSON.parse('[]');
      
      // Merge logic: preserve category, description, isVisible, isFeatured, featuredOrder if file exists
      const updatedDocs = sourceFiles.map(syncedFile => {
        const existing = currentDocs.find(d => d.id === syncedFile.id);
        if (existing) {
          return {
            ...syncedFile,
            category: existing.category !== undefined ? existing.category : syncedFile.category,
            description: existing.description !== undefined ? existing.description : syncedFile.description,
            isVisible: existing.isVisible !== undefined ? existing.isVisible : syncedFile.isVisible,
            isFeatured: existing.isFeatured !== undefined ? existing.isFeatured : syncedFile.isFeatured,
            featuredOrder: existing.featuredOrder !== undefined ? existing.featuredOrder : syncedFile.featuredOrder,
            title: existing.title !== undefined ? existing.title : syncedFile.title,
            is_confidential: existing.is_confidential !== undefined ? existing.is_confidential : syncedFile.is_confidential
          };
        }
        return syncedFile;
      });
      
      setDocuments(updatedDocs);
      settingsService.set('ieee_documents', JSON.stringify(updatedDocs));
      setIsSyncing(false);
      setSyncMessage(`Successfully synchronized ${updatedDocs.length} documents from Google Drive!`);
    }, 1200);
  };

  const startInlineEditDoc = (doc) => {
    setDocTitleInput(doc.title || '');
    setDocCategoryInput(doc.category || 'Others');
    setDocDescInput(doc.description || '');
    setDocConfidentialInput(doc.is_confidential || false);
    setEditingDocId(doc.id);
  };

  const saveInlineDoc = async (id) => {
    if (!docTitleInput.trim()) return;
    const updated = documents.map(d => 
      d.id === id 
        ? { ...d, title: docTitleInput.trim(), category: docCategoryInput, description: docDescInput.trim(), is_confidential: docConfidentialInput } 
        : d
    );
    setDocuments(updated);
    settingsService.set('ieee_documents', JSON.stringify(updated));
    setEditingDocId(null);
  };

  const toggleDocVisibility = async (id) => {
    const updated = documents.map(d => 
      d.id === id ? { ...d, isVisible: !d.isVisible } : d
    );
    setDocuments(updated);
    settingsService.set('ieee_documents', JSON.stringify(updated));
  };

  const toggleDocFeatured = async (id) => {
    const updated = documents.map(d => {
      if (d.id === id) {
        const isFeaturedNow = !d.isFeatured;
        let order = d.featuredOrder;
        if (isFeaturedNow) {
          const featured = documents.filter(x => x.isFeatured);
          const maxOrder = featured.length > 0 ? Math.max(...featured.map(x => x.featuredOrder || 0)) : 0;
          order = maxOrder + 1;
        }
        return { ...d, isFeatured: isFeaturedNow, featuredOrder: order };
      }
      return d;
    });
    setDocuments(updated);
    settingsService.set('ieee_documents', JSON.stringify(updated));
  };

  const moveDocFeatured = async (id, direction) => {
    const featured = documents.filter(d => d.isFeatured).sort((a, b) => a.featuredOrder - b.featuredOrder);
    const index = featured.findIndex(d => d.id === id);
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= featured.length) return;
    
    // Swap orders
    const temp = featured[index].featuredOrder;
    featured[index].featuredOrder = featured[newIndex].featuredOrder;
    featured[newIndex].featuredOrder = temp;
    
    const updated = documents.map(d => {
      const match = featured.find(f => f.id === d.id);
      return match ? { ...d, featuredOrder: match.featuredOrder } : d;
    });
    
    setDocuments(updated);
    settingsService.set('ieee_documents', JSON.stringify(updated));
  };

  const toggleAllConfidentialDocs = async (makeConfidential) => {
    if (documents.length === 0) {
      alert("No documents in the repository. Connect a Google Drive folder and click 'Sync Documents' to populate first.");
      return;
    }
    const updated = documents.map(d => ({ ...d, is_confidential: makeConfidential }));
    setDocuments(updated);
    settingsService.set('ieee_documents', JSON.stringify(updated));
    setSyncMessage(`Successfully marked all ${updated.length} documents as ${makeConfidential ? 'confidential' : 'not confidential'}!`);
    setTimeout(() => setSyncMessage(''), 4000);
  };

  // Helper functions for Media Videos
  const handleAddVideo = async (e) => {
    e.preventDefault();
    if (!newVideoTitle.trim() || !newVideoUrl.trim() || !newVideoDesc.trim()) return;
    const payload = {
      id: mediaVideos.length > 0 ? Math.max(...mediaVideos.map(i => i.id || 0)) + 1 : 1,
      title: newVideoTitle.trim(),
      url: newVideoUrl.trim(),
      description: newVideoDesc.trim() // API uses 'description' while frontend uses 'desc'
    };
    try {
      const saved = await videoService.create(payload);
      // Map 'description' back to 'desc' for frontend consistency if needed
      setMediaVideos([...mediaVideos, { ...saved, desc: saved.description }]);
      setNewVideoTitle('');
      setNewVideoUrl('');
      setNewVideoDesc('');
    } catch (err) { console.error(err); }
  };

  const startInlineEditVideo = (index, item) => {
    setVideoTitleInput(item.title || '');
    setVideoUrlInput(item.url || '');
    setVideoDescInput(item.desc || '');
    setEditingVideoIndex(index);
  };

  const saveInlineVideo = async (index) => {
    if (!videoTitleInput.trim() || !videoUrlInput.trim() || !videoDescInput.trim()) return;
    const currentItem = mediaVideos[index];
    const payload = {
      title: videoTitleInput.trim(),
      url: videoUrlInput.trim(),
      description: videoDescInput.trim()
    };
    try {
      const saved = await videoService.update(currentItem.id, payload);
      const updated = mediaVideos.map((item, idx) =>
        idx === index ? { ...saved, desc: saved.description } : item
      );
      setMediaVideos(updated);
      setEditingVideoIndex(null);
    } catch (err) { console.error(err); }
  };

  const handleDeleteVideo = async (index) => {
    if (!window.confirm("Are you sure you want to delete this video highlight?")) return;
    const currentItem = mediaVideos[index];
    try {
      await videoService.delete(currentItem.id);
      setMediaVideos(mediaVideos.filter((_, idx) => idx !== index));
    } catch (err) { console.error(err); }
  };


  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '85vh',
        background: 'radial-gradient(circle at 10% 20%, rgba(var(--secondary-rgb), 0.08) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(6, 182, 212, 0.08) 0%, transparent 40%), var(--bg-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        fontFamily: 'var(--font-sans)'
      }}>
        <div className="card animate-fade-in" style={{
          maxWidth: '440px',
          width: '100%',
          padding: '40px 36px',
          boxShadow: 'var(--shadow-premium)',
          backgroundColor: 'var(--bg-card)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid var(--border-subtle)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle glow border effect inside */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'var(--gradient-cyber)'
          }} />

          {/* Navigation Toggle for Login/Register */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '20px', 
            marginBottom: '32px', 
            borderBottom: '1px solid var(--border-subtle)', 
            paddingBottom: '12px' 
          }}>
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
                color: !isRegistering ? 'var(--secondary)' : 'var(--text-muted)',
                cursor: 'pointer',
                borderBottom: !isRegistering ? '3px solid var(--secondary)' : '3px solid transparent',
                paddingBottom: '9px',
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
                color: isRegistering ? 'var(--secondary)' : 'var(--text-muted)',
                cursor: 'pointer',
                borderBottom: isRegistering ? '3px solid var(--secondary)' : '3px solid transparent',
                paddingBottom: '9px',
                transition: 'all 0.2s ease'
              }}
            >
              Register
            </button>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--gradient-cyber)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: 'var(--shadow-glow-cyan)'
            }}>
              <Lock size={26} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px', letterSpacing: '-0.5px' }}>
              {isRegistering ? 'Register Admin' : 'Admin Login'}
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
              {isRegistering ? 'Create a new admin credential' : 'Authorize to manage branch portal database'}
            </p>
          </div>

          {/* Error & Success Messages */}
          {!isRegistering && loginError && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              color: '#dc2626',
              borderRadius: '10px',
              fontSize: '13.5px',
              fontWeight: '600',
              marginBottom: '20px',
              border: '1px solid rgba(220, 38, 38, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} /> {loginError}
            </div>
          )}

          {isRegistering && regError && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              color: '#dc2626',
              borderRadius: '10px',
              fontSize: '13.5px',
              fontWeight: '600',
              marginBottom: '20px',
              border: '1px solid rgba(220, 38, 38, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} /> {regError}
            </div>
          )}

          {isRegistering && regSuccess && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: 'rgba(21, 128, 61, 0.08)',
              color: '#15803d',
              borderRadius: '10px',
              fontSize: '13.5px',
              fontWeight: '600',
              marginBottom: '20px',
              border: '1px solid rgba(21, 128, 61, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Check size={16} /> {regSuccess}
            </div>
          )}

          {/* Conditional Form Render */}
          {!isRegistering ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--primary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.75px' }}>Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@kongu.edu"
                  className="admin-input"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    color: 'var(--text-dark)'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--primary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.75px' }}>Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="admin-input"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    color: 'var(--text-dark)'
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  background: 'var(--gradient-cyber)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '14px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  marginTop: '10px',
                  boxShadow: 'var(--shadow-md)'
                }}
                className="admin-login-btn"
              >
                Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--primary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.75px' }}>Email Address</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="e.g. name@kongu.edu"
                  className="admin-input"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    color: 'var(--text-dark)'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--primary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.75px' }}>Password</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="admin-input"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    color: 'var(--text-dark)'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--primary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.75px' }}>Confirm Password</label>
                <input
                  type="password"
                  required
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="admin-input"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    color: 'var(--text-dark)'
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  background: 'var(--gradient-cyber)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '14px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  marginTop: '10px',
                  boxShadow: 'var(--shadow-md)'
                }}
                className="admin-login-btn"
              >
                Register Admin
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  const toggleHighlightStatus = (item) => {
    let updated;
    if (item.isHighlighted) {
      // Remove from highlights
      updated = pastEvents.map(evt => {
        if (evt.id === item.id) {
          return { ...evt, isHighlighted: false, highlightOrder: undefined };
        }
        return evt;
      });
      // Recalculate orders for remaining highlighted events
      const highlighted = updated.filter(e => e.isHighlighted).sort((a, b) => a.highlightOrder - b.highlightOrder);
      highlighted.forEach((e, idx) => {
        e.highlightOrder = idx + 1;
      });
    } else {
      // Add to highlights
      const currentCount = pastEvents.filter(e => e.isHighlighted).length;
      if (currentCount >= 5) {
        alert("A maximum of 5 highlighted events is allowed. Please remove another event from highlights first.");
        return;
      }
      updated = pastEvents.map(evt => {
        if (evt.id === item.id) {
          return {
            ...evt,
            isHighlighted: true,
            highlightOrder: currentCount + 1,
            highlightDescription: evt.highlightDescription || evt.desc || '',
            highlightTheme: evt.highlightTheme || 'Purple',
            highlightImage: evt.highlightImage || null
          };
        }
        return evt;
      });
    }
    setPastEvents(updated);
    settingsService.set('ieee_events_past', JSON.stringify(updated));
  };

  const moveHighlightItemManual = (index, direction) => {
    const highlighted = pastEvents.filter(e => e.isHighlighted).sort((a, b) => a.highlightOrder - b.highlightOrder);
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= highlighted.length) return;
    
    // Swap orders
    const temp = highlighted[index].highlightOrder;
    highlighted[index].highlightOrder = highlighted[newIndex].highlightOrder;
    highlighted[newIndex].highlightOrder = temp;
    
    // Update pastEvents list
    const updated = pastEvents.map(evt => {
      const hlMatch = highlighted.find(h => h.id === evt.id);
      if (hlMatch) {
        return { ...evt, highlightOrder: hlMatch.highlightOrder };
      }
      return evt;
    });
    
    setPastEvents(updated);
    settingsService.set('ieee_events_past', JSON.stringify(updated));
  };

  const saveHighlightDetails = (id, desc, theme, img) => {
    const updated = pastEvents.map(evt => {
      if (evt.id === id) {
        return {
          ...evt,
          highlightDescription: desc,
          highlightTheme: theme,
          highlightImage: img
        };
      }
      return evt;
    });
    setPastEvents(updated);
    settingsService.set('ieee_events_past', JSON.stringify(updated));
    setEditingHighlightEventId(null);
  };

  const handleDragStartHighlight = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
    setDraggedIndex(index);
  };

  const handleDragOverHighlight = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const highlighted = pastEvents.filter(evt => evt.isHighlighted).sort((a, b) => a.highlightOrder - b.highlightOrder);
    const draggedItem = highlighted[draggedIndex];
    
    // Reorder
    const temp = [...highlighted];
    temp.splice(draggedIndex, 1);
    temp.splice(index, 0, draggedItem);
    
    // Update indices
    temp.forEach((item, idx) => {
      item.highlightOrder = idx + 1;
    });
    
    setDraggedIndex(index);
    
    // Merge back
    const updated = pastEvents.map(evt => {
      const hlMatch = temp.find(h => h.id === evt.id);
      if (hlMatch) {
        return { ...evt, highlightOrder: hlMatch.highlightOrder };
      }
      return evt;
    });
    
    setPastEvents(updated);
    settingsService.set('ieee_events_past', JSON.stringify(updated));
  };

  const handleDragEndHighlight = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="admin-dashboard-container" style={{ backgroundColor: 'var(--bg-light)', minHeight: '85vh', paddingBottom: '80px', fontFamily: 'var(--font-sans)' }}>
      {/* Header Panel */}
      <div style={{
        background: 'var(--gradient-primary)',
        color: '#ffffff',
        padding: '40px 0',
        marginBottom: '40px',
        boxShadow: 'var(--shadow-md)',
        position: 'relative'
      }}>
        {/* Neon cyan bottom border line */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'var(--gradient-cyber)'
        }} />
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '32px', color: '#ffffff', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px', letterSpacing: '-0.75px' }}>
              <Database size={32} style={{ color: 'var(--accent-cyan)' }} /> Admin Dashboard
            </h1>
            <p style={{ fontSize: '14.5px', color: 'rgba(255, 255, 255, 0.75)', marginTop: '6px' }}>Welcome! You have full authority to modify the student branch website's database.</p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              padding: '10px 24px',
              borderRadius: '30px',
              fontSize: '13.5px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(4px)'
            }}
            className="admin-logout-btn"
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </div>

      <div className="container">
        {/* Tab Selection */}
        {(() => {
          const categories = [
            {
              id: 'config',
              label: 'Site & Stats',
              icon: <Settings size={16} />,
              items: [
                { id: 'stats', label: 'Stats & Site Info', icon: <Settings size={14} /> },
                { id: 'impact_stats', label: 'Impact Numbers', icon: <BarChart3 size={14} /> },
                { id: 'contact_page', label: 'Contact & FAQ Page', icon: <MessageSquare size={14} /> }
              ]
            },
            {
              id: 'roster',
              label: 'Rosters',
              icon: <Users size={16} />,
              items: [
                { id: 'execomm', label: 'Execomm SB Leaders', icon: <Users size={14} /> },
                { id: 'branches', label: 'ExeComm Branches', icon: <Layers size={14} /> },
                { id: 'committees', label: 'Committees', icon: <Target size={14} /> }
              ]
            },
            {
              id: 'events_media',
              label: 'Events & Media',
              icon: <Calendar size={16} />,
              items: [
                { id: 'events', label: 'Events List', icon: <Calendar size={14} /> },
                { id: 'highlighted_events', label: 'Highlighted Events', icon: <Flame size={14} /> },
                { id: 'gallery', label: 'Photo Gallery', icon: <ImageIcon size={14} /> },
                { id: 'achievements', label: 'Achievements', icon: <Award size={14} /> }
              ]
            },
            {
              id: 'pages',
              label: 'Pages Content',
              icon: <Compass size={16} />,
              items: [
                { id: 'about_kec_sb', label: 'About KEC SB Page', icon: <Compass size={14} /> },
                { id: 'testimonials', label: 'Testimonials', icon: <MessageSquare size={14} /> }
              ]
            },
            {
              id: 'resources',
              label: 'Resources & Forms',
              icon: <FileText size={16} />,
              items: [
                { id: 'news', label: 'News Clippings', icon: <FileText size={14} /> },
                { id: 'researchpapers', label: 'Research Papers & Projects', icon: <FileText size={14} /> },
                { id: 'documents', label: 'Documents Repository', icon: <FileText size={14} /> },
                { id: 'request_forms', label: 'Request Forms', icon: <LinkIcon size={14} /> }
              ]
            }
          ];

          return (
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'flex',
                backgroundColor: '#0a385b',
                borderRadius: '12px',
                padding: '6px 12px',
                gap: '8px',
                flexWrap: 'wrap',
                alignItems: 'center',
                boxShadow: '0 4px 20px rgba(10,56,91,0.15)',
                position: 'relative',
                zIndex: 100,
                marginBottom: '16px'
              }}>
                {categories.map((cat) => {
                  const isCatActive = cat.items.some(item => item.id === activeTab);
                  const isOpen = activeDropdown === cat.id;

                  return (
                    <div 
                      key={cat.id} 
                      style={{ position: 'relative' }}
                      onMouseEnter={() => setActiveDropdown(cat.id)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <button
                        onClick={() => setActiveDropdown(isOpen ? null : cat.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 18px',
                          fontSize: '14px',
                          fontWeight: '700',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          backgroundColor: isCatActive ? '#02619a' : 'transparent',
                          color: '#ffffff',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {cat.icon}
                        {cat.label}
                        <span style={{ fontSize: '10px', marginLeft: '4px', opacity: 0.7 }}>▼</span>
                      </button>

                      {/* Dropdown Menu */}
                      {isOpen && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          paddingTop: '8px', // Creates the visual gap without breaking the hover box
                          minWidth: '240px',
                          zIndex: 101
                        }}>
                          <div style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '6px',
                            gap: '4px'
                          }}>
                            {cat.items.map((item) => {
                              const isActive = activeTab === item.id;
                              return (
                                <button
                                  key={item.id}
                                  onClick={() => {
                                    setActiveTab(item.id);
                                    setActiveDropdown(null);
                                  }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '8px 14px',
                                    fontSize: '13.5px',
                                    fontWeight: '600',
                                    textAlign: 'left',
                                    borderRadius: '6px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    backgroundColor: isActive ? '#eff6ff' : 'transparent',
                                    color: isActive ? '#0a385b' : '#334155',
                                    transition: 'all 0.15s ease',
                                    width: '100%'
                                  }}
                                >
                                  <span style={{ color: isActive ? '#02619a' : '#64748b', display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                                  {item.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Breadcrumb banner */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: '#64748b',
                fontWeight: '600',
                backgroundColor: '#f8fafc',
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <span>Admin Dashboard</span>
                <span>/</span>
                <span style={{ color: '#0a385b' }}>
                  {categories.find(c => c.items.some(i => i.id === activeTab))?.label || 'General'}
                </span>
                <span>/</span>
                <span style={{ color: '#02619a', fontWeight: '700' }}>
                  {categories.flatMap(c => c.items).find(i => i.id === activeTab)?.label || activeTab}
                </span>
              </div>
            </div>
          );
        })()}

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
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#0a385b', marginBottom: '6px' }}>Research Papers & Projects Count</label>
                  <input
                    type="text"
                    required
                    value={papersCount}
                    onChange={(e) => setPapersCount(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                <div style={{ marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                  <h3 style={{ fontSize: '16px', color: '#0a385b', fontWeight: '750', marginBottom: '16px' }}>About & Keystones Media</h3>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#0a385b', marginBottom: '6px' }}>About Section Illustration Image</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                      {aboutImage ? (
                        <img src={aboutImage} alt="About preview" style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                      ) : (
                        <div style={{ width: '80px', height: '50px', backgroundColor: '#e2e8f0', borderRadius: '4px' }}></div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            try {
                              const base64 = await compressImage(file);
                              setAboutImage(base64);
                            } catch (err) {
                              console.error(err);
                            }
                          }
                        }}
                        style={{ fontSize: '11px', width: 'auto' }}
                      />
                    </div>
                    <input
                      type="text"
                      value={aboutImage}
                      onChange={(e) => setAboutImage(e.target.value)}
                      placeholder="Or enter image URL"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#0a385b', marginBottom: '6px' }}>Operational Keystones YouTube Video Embed URL</label>
                    <input
                      type="text"
                      required
                      value={keystonesVideoUrl}
                      onChange={(e) => setKeystonesVideoUrl(e.target.value)}
                      placeholder="e.g. https://www.youtube.com/embed/S_T1VwN7Gic"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                    />
                    <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>💡 Embed URLs must be in the format: <code>https://www.youtube.com/embed/VIDEO_ID</code></p>
                  </div>
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

                <div style={{ marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                  <h3 style={{ fontSize: '16px', color: '#0a385b', fontWeight: '750', marginBottom: '16px' }}>Hero Carousel Images</h3>
                  
                  <div style={{ display: 'flex', flextype: 'column', gap: '8px', marginBottom: '16px', flexDirection: 'column' }}>
                    {heroImages.map((img, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#f8fafc' }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <img src={img} alt={`Hero ${index}`} style={{ width: '50px', height: '30px', objectFit: 'cover', borderRadius: '4px' }} />
                          <span style={{ fontSize: '11px', color: '#64748b', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{img.startsWith('data:') ? 'Custom Uploaded Image' : img}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setHeroImages(heroImages.filter((_, idx) => idx !== index))}
                          style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                          title="Remove image"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    {heroImages.length === 0 && (
                      <p style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic' }}>No hero images configured.</p>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b' }}>Add Hero Carousel Image</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        value={newHeroImageUrl}
                        onChange={(e) => setNewHeroImageUrl(e.target.value)}
                        placeholder="Paste image URL here"
                        style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newHeroImageUrl.trim()) {
                            setHeroImages([...heroImages, newHeroImageUrl.trim()]);
                            setNewHeroImageUrl('');
                          }
                        }}
                        style={{ padding: '8px 14px', backgroundColor: '#02619a', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        Add URL
                      </button>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'space-between' }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            try {
                              const base64 = await compressImage(file);
                              setHeroImages([...heroImages, base64]);
                            } catch (err) {
                              console.error(err);
                            }
                          }
                        }}
                        style={{ fontSize: '11px', width: 'auto' }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm("Reset hero images to default values?")) {
                            setHeroImages(['/assets/kec_gate.jpg', '/assets/kec_itpark.jpg', '/assets/kec_admin.jpg']);
                          }
                        }}
                        style={{ padding: '6px 12px', backgroundColor: '#64748b', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        Reset Defaults
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', gridColumn: 'span 2' }}>
                <h3 style={{ fontSize: '16px', color: '#0a385b', fontWeight: '750', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Confidential Settings</h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="isPinEnabledInput"
                    checked={isPinEnabled}
                    onChange={(e) => setIsPinEnabled(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <label htmlFor="isPinEnabledInput" style={{ fontSize: '14px', fontWeight: '700', color: '#475569', cursor: 'pointer' }}>
                    Require PIN for confidential items (Global Toggle)
                  </label>
                </div>

                <div style={{ width: '50%' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#0a385b', marginBottom: '6px' }}>Shared Access PIN (For confidential documents and forms)</label>
                  <input
                    type="password"
                    required
                    value={accessPin}
                    onChange={(e) => setAccessPin(e.target.value)}
                    disabled={!isPinEnabled}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', backgroundColor: isPinEnabled ? '#ffffff' : '#f1f5f9' }}
                  />
                  <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Distribute this PIN to users who are allowed to access confidential items.</p>
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
          <div className="animate-fade-in card" style={{ padding: '36px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
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
                    {galleryItems.map((item, idx) => {
                      const isEditing = editingGalleryId === item.id;
                      return (
                        <tr key={item.id} style={{ borderBottom: idx < galleryItems.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                          {isEditing ? (
                            <>
                              <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                                <select
                                  value={formCat}
                                  onChange={(e) => setFormCat(e.target.value)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', backgroundColor: '#ffffff' }}
                                >
                                  <option value="Workshop">Workshop</option>
                                  <option value="Exhibition">Exhibition</option>
                                  <option value="Seminar">Seminar</option>
                                  <option value="Hands-on">Hands-on</option>
                                  <option value="Hackathon">Hackathon</option>
                                  <option value="Meeting">Meeting</option>
                                  <option value="Campus Life">Campus Life</option>
                                  <option value="Events">Events</option>
                                  <option value="Academic">Academic</option>
                                  <option value="Engagement">Engagement</option>
                                  <option value="Living">Living</option>
                                  <option value="Services">Services</option>
                                  <option value="Infrastructure">Infrastructure</option>
                                  <option value="Innovation">Innovation</option>
                                  <option value="Environment">Environment</option>
                                  <option value="KEC">KEC</option>
                                </select>
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                                <input
                                  type="text"
                                  value={formTitle}
                                  onChange={(e) => setFormTitle(e.target.value)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }}
                                />
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                                <textarea
                                  value={formText}
                                  onChange={(e) => setFormText(e.target.value)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', fontFamily: 'inherit', resize: 'vertical' }}
                                  rows="3"
                                />
                                <div style={{ marginTop: '8px' }}>
                                  <label style={{ fontSize: '11px', fontWeight: '700', display: 'block', marginBottom: '4px', color: '#0a385b' }}>Upload Images:</label>
                                  <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImagesUpload}
                                    style={{ fontSize: '11px', width: '100%' }}
                                  />
                                  {formImages.length > 0 && (
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                                      {formImages.map((img, i) => (
                                        <div key={i} style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                                          <img src={img} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                          <button
                                            type="button"
                                            onClick={() => removeFormImage(i)}
                                            style={{ position: 'absolute', top: '1px', right: '1px', backgroundColor: 'rgba(239, 68, 68, 0.9)', color: '#ffffff', border: 'none', borderRadius: '50%', width: '12px', height: '12px', fontSize: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'middle', textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                  <button
                                    onClick={() => saveInlineGallery(item.id)}
                                    style={{ backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingGalleryId(null)}
                                    style={{ backgroundColor: '#64748b', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                                <span style={{ padding: '4px 10px', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '4px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
                                  {item.cat}
                                </span>
                              </td>
                              <td style={{ padding: '16px 20px', fontWeight: '600', color: '#0a385b', verticalAlign: 'top', minWidth: '180px' }}>
                                {item.title}
                              </td>
                              <td style={{ padding: '16px 20px', color: '#64748b', verticalAlign: 'top', minWidth: '240px' }}>
                                <div>{item.text}</div>
                                {item.images && item.images.length > 0 && (
                                  <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                                    {item.images.map((img, i) => (
                                      <img key={i} src={img} alt="Thumb" style={{ width: '30px', height: '30px', borderRadius: '4px', objectFit: 'cover' }} />
                                    ))}
                                  </div>
                                )}
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'top', textAlign: 'center', width: '130px' }}>
                                <div style={{ display: 'inline-flex', gap: '8px' }}>
                                  <button
                                    onClick={() => startInlineEditGallery(item)}
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
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ margin: '36px 0', borderTop: '1px solid #cbd5e1' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '20px', color: '#0a385b', fontWeight: '800' }}>Manage Video Highlights & Memories</h2>
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>Configure video highlights displayed on the Media page (Total: {mediaVideos.length})</p>
              </div>
            </div>

            {/* Inline Add Video Form */}
            <form onSubmit={handleAddVideo} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 300px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px' }}>Video Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., GreenTech Hackathon Pitch Finalists"
                    value={newVideoTitle}
                    onChange={(e) => setNewVideoTitle(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
                <div style={{ flex: '1 1 300px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px' }}>YouTube Embed URL</label>
                  <input
                    type="url"
                    required
                    placeholder="e.g., https://www.youtube.com/embed/..."
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px' }}>Description</label>
                <textarea
                  required
                  rows="2"
                  placeholder="Enter video description..."
                  value={newVideoDesc}
                  onChange={(e) => setNewVideoDesc(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                <button
                  type="submit"
                  style={{ backgroundColor: '#02619a', color: '#ffffff', border: 'none', borderRadius: '30px', padding: '10px 20px', fontSize: '13.5px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(2,97,154,0.2)' }}
                >
                  <Plus size={16} /> Add Video
                </button>
              </div>
            </form>

            {/* Video List Table */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '25%' }}>Title</th>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '30%' }}>Embed URL</th>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '30%' }}>Description</th>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', textAlign: 'center', width: '15%' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mediaVideos.length > 0 ? (
                      mediaVideos.map((video, idx) => {
                        const isEditing = editingVideoIndex === idx;
                        return (
                          <tr key={idx} style={{ borderBottom: idx < mediaVideos.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                            {isEditing ? (
                              <>
                                <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                                  <input
                                    type="text"
                                    value={videoTitleInput}
                                    onChange={(e) => setVideoTitleInput(e.target.value)}
                                    style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }}
                                  />
                                </td>
                                <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                                  <input
                                    type="url"
                                    value={videoUrlInput}
                                    onChange={(e) => setVideoUrlInput(e.target.value)}
                                    style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }}
                                  />
                                </td>
                                <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                                  <textarea
                                    value={videoDescInput}
                                    onChange={(e) => setVideoDescInput(e.target.value)}
                                    style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', fontFamily: 'inherit', resize: 'vertical' }}
                                    rows="2"
                                  />
                                </td>
                                <td style={{ padding: '16px 20px', verticalAlign: 'middle', textAlign: 'center' }}>
                                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                    <button
                                      onClick={() => saveInlineVideo(idx)}
                                      style={{ backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingVideoIndex(null)}
                                      style={{ backgroundColor: '#64748b', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </td>
                              </>
                            ) : (
                              <>
                                <td style={{ padding: '16px 20px', fontWeight: '600', color: '#0a385b', verticalAlign: 'top' }}>
                                  {video.title}
                                </td>
                                <td style={{ padding: '16px 20px', color: '#64748b', verticalAlign: 'top', fontSize: '13px', wordBreak: 'break-all' }}>
                                  {video.url}
                                </td>
                                <td style={{ padding: '16px 20px', color: '#64748b', verticalAlign: 'top', fontSize: '13.5px' }}>
                                  {video.desc}
                                </td>
                                <td style={{ padding: '16px 20px', verticalAlign: 'top', textAlign: 'center' }}>
                                  <div style={{ display: 'inline-flex', gap: '8px' }}>
                                    <button
                                      onClick={() => startInlineEditVideo(idx, video)}
                                      style={{ color: '#02619a', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '4px', padding: '6px', cursor: 'pointer' }}
                                    >
                                      <Edit3 size={15} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteVideo(idx)}
                                      style={{ color: '#ef4444', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '4px', padding: '6px', cursor: 'pointer' }}
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                          No video highlights configured.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Tab 3: Events CRUD Operations */}
        {activeTab === 'events' && (
          <div className="animate-fade-in card" style={{ padding: '36px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
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

            {/* Scale Stats & Philosophy Editor */}
            <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                <h3 style={{ fontSize: '15px', color: '#0a385b', fontWeight: '800', margin: 0 }}>Events Philosophy & Statistics</h3>
                <button
                  type="button"
                  onClick={() => {
                    settingsService.set('ieee_events_stats_v1', JSON.stringify(eventsStats));
                    settingsService.set('ieee_events_philosophy_v1', JSON.stringify(eventPhilosophy));
                    alert("Events stats & philosophy saved successfully!");
                  }}
                  style={{ padding: '6px 14px', fontSize: '12px', fontWeight: '750', cursor: 'pointer', border: 'none', borderRadius: '4px', backgroundColor: '#e0f2fe', color: '#0369a1' }}
                >
                  Save Stats & Philosophy
                </button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {eventsStats.map((stat, idx) => (
                  <div key={idx} style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Stat Label:</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        const newStats = [...eventsStats];
                        newStats[idx].label = e.target.value;
                        setEventsStats(newStats);
                      }}
                      style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', marginBottom: '8px' }}
                    />
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Count (e.g. 80+):</label>
                    <input
                      type="text"
                      value={stat.count}
                      onChange={(e) => {
                        const newStats = [...eventsStats];
                        newStats[idx].count = e.target.value;
                        setEventsStats(newStats);
                      }}
                      style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                ))}
              </div>
 
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Philosophy Title:</label>
                  <input
                    type="text"
                    value={eventPhilosophy?.title || ''}
                    onChange={(e) => setEventPhilosophy({ ...eventPhilosophy, title: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Philosophy Description:</label>
                  <textarea
                    rows="2"
                    value={eventPhilosophy?.description || ''}
                    onChange={(e) => setEventPhilosophy({ ...eventPhilosophy, description: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontFamily: 'inherit' }}
                  />
                </div>
              </div>
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
                    {upcomingEvents.map((item) => {
                      const isEditing = editingEventId === item.id && eventIsUpcoming === true;
                      return (
                        <tr key={`upcoming-${item.id}`} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          {isEditing ? (
                            <>
                              <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                                <span style={{ padding: '4px 10px', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '20px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>
                                  Upcoming
                                </span>
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                                <select
                                  value={eventTag}
                                  onChange={(e) => setEventTag(e.target.value)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', backgroundColor: '#ffffff' }}
                                >
                                  <option value="Workshop">Workshop</option>
                                  <option value="Exhibition">Exhibition</option>
                                  <option value="Seminar">Seminar</option>
                                  <option value="Hands-on">Hands-on</option>
                                  <option value="Hackathon">Hackathon</option>
                                  <option value="Meeting">Meeting</option>
                                </select>
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                                <input
                                  type="text"
                                  value={eventTitle}
                                  onChange={(e) => setEventTitle(e.target.value)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', marginBottom: '6px' }}
                                  placeholder="Title"
                                />
                                <textarea
                                  value={eventDesc}
                                  onChange={(e) => setEventDesc(e.target.value)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', fontFamily: 'inherit', resize: 'vertical' }}
                                  rows="2"
                                  placeholder="Description"
                                />
                                <input
                                  type="text"
                                  value={eventLink}
                                  onChange={(e) => setEventLink(e.target.value)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', marginTop: '6px' }}
                                  placeholder="Registration Link"
                                />
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                                <input
                                  type="text"
                                  value={eventDate}
                                  onChange={(e) => setEventDate(e.target.value)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', marginBottom: '6px' }}
                                  placeholder="Date (e.g. June 12, 2026)"
                                />
                                <input
                                  type="text"
                                  value={eventTime}
                                  onChange={(e) => setEventTime(e.target.value)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', marginBottom: '6px' }}
                                  placeholder="Time (e.g. 09:00 AM - 04:30 PM)"
                                />
                                <input
                                  type="text"
                                  value={eventVenue}
                                  onChange={(e) => setEventVenue(e.target.value)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }}
                                  placeholder="Venue"
                                />
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'middle', textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                  <button
                                    onClick={() => saveInlineEvent(item.id)}
                                    style={{ backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingEventId(null)}
                                    style={{ backgroundColor: '#64748b', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
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
                                    onClick={() => startInlineEditEvent(item, true)}
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
                            </>
                          )}
                        </tr>
                      );
                    })}

                    {/* Render Past Events */}
                    {pastEvents.map((item, idx) => {
                      const isEditing = editingEventId === item.id && eventIsUpcoming === false;
                      return (
                        <tr key={`past-${item.id}`} style={{ borderBottom: idx < pastEvents.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                          {isEditing ? (
                            <>
                              <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                                <span style={{ padding: '4px 10px', backgroundColor: '#f1f5f9', color: '#64748b', borderRadius: '20px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>
                                  Completed
                                </span>
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                                <select
                                  value={eventTag}
                                  onChange={(e) => setEventTag(e.target.value)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', backgroundColor: '#ffffff' }}
                                >
                                  <option value="Workshop">Workshop</option>
                                  <option value="Exhibition">Exhibition</option>
                                  <option value="Seminar">Seminar</option>
                                  <option value="Hands-on">Hands-on</option>
                                  <option value="Hackathon">Hackathon</option>
                                  <option value="Meeting">Meeting</option>
                                </select>
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                                <input
                                  type="text"
                                  value={eventTitle}
                                  onChange={(e) => setEventTitle(e.target.value)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', marginBottom: '6px' }}
                                  placeholder="Title"
                                />
                                <textarea
                                  value={eventDesc}
                                  onChange={(e) => setEventDesc(e.target.value)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', fontFamily: 'inherit', resize: 'vertical' }}
                                  rows="2"
                                  placeholder="Description"
                                />
                                <input
                                  type="text"
                                  value={eventHighlights}
                                  onChange={(e) => setEventHighlights(e.target.value)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', marginTop: '6px' }}
                                  placeholder="Key Highlights"
                                />
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                                <input
                                  type="text"
                                  value={eventDate}
                                  onChange={(e) => setEventDate(e.target.value)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', marginBottom: '6px' }}
                                  placeholder="Date (e.g. June 12, 2026)"
                                />
                                <input
                                  type="text"
                                  value={eventTime}
                                  onChange={(e) => setEventTime(e.target.value)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', marginBottom: '6px' }}
                                  placeholder="Time (e.g. 09:00 AM - 04:30 PM)"
                                />
                                <input
                                  type="text"
                                  value={eventVenue}
                                  onChange={(e) => setEventVenue(e.target.value)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }}
                                  placeholder="Venue"
                                />
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'middle', textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                  <button
                                    onClick={() => saveInlineEvent(item.id)}
                                    style={{ backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingEventId(null)}
                                    style={{ backgroundColor: '#64748b', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
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
                                    onClick={() => startInlineEditEvent(item, false)}
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
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Highlighted Events Management */}
        {activeTab === 'highlighted_events' && (
          <div className="animate-fade-in card" style={{ padding: '36px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '20px', color: '#0a385b', fontWeight: '800' }}>Configure Homepage Featured Highlights</h2>
              <p style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>
                Select up to 5 completed past events to showcase in the interactive sliding carousel on the website. Reorder them using drag-and-drop or the manual order controls.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px' }} className="flex-responsive">
              
              {/* Left Column: Drag & Drop Reordering and Details Editing */}
              <div>
                <h3 style={{ fontSize: '15px', color: '#0a385b', fontWeight: '750', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Flame size={18} color="var(--secondary)" /> Featured Highlights Carousel Order ({pastEvents.filter(e => e.isHighlighted).length}/5)
                </h3>

                {pastEvents.filter(e => e.isHighlighted).length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1.5px dashed #cbd5e1', color: '#64748b' }}>
                    <p style={{ fontWeight: '600', fontSize: '14px' }}>No events featured in highlights yet.</p>
                    <p style={{ fontSize: '12.5px', marginTop: '4px' }}>Select events from the Completed Events Roster on the right to build your carousel.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {pastEvents
                      .filter(e => e.isHighlighted)
                      .sort((a, b) => a.highlightOrder - b.highlightOrder)
                      .map((item, idx, arr) => {
                        const isEditingDetails = editingHighlightEventId === item.id;
                        return (
                          <div
                            key={item.id}
                            draggable={!isEditingDetails}
                            onDragStart={(e) => handleDragStartHighlight(e, idx)}
                            onDragOver={(e) => handleDragOverHighlight(e, idx)}
                            onDragEnd={handleDragEndHighlight}
                            style={{
                              border: '1.5px solid var(--border-subtle)',
                              borderRadius: '12px',
                              backgroundColor: draggedIndex === idx ? '#f1f5f9' : '#ffffff',
                              opacity: draggedIndex === idx ? 0.5 : 1,
                              padding: '16px',
                              boxShadow: 'var(--shadow-sm)',
                              transition: 'all 0.2s ease',
                              cursor: isEditingDetails ? 'default' : 'grab'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                              
                              {/* Drag handle & Order info */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {!isEditingDetails && (
                                  <div style={{ color: '#94a3b8', fontSize: '18px', fontWeight: 'bold', userSelect: 'none' }} title="Drag to reorder">
                                    ⋮⋮
                                  </div>
                                )}
                                <span style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '50%',
                                  backgroundColor: 'rgba(var(--secondary-rgb), 0.08)',
                                  color: 'var(--secondary)',
                                  fontWeight: '800',
                                  fontSize: '13px'
                                }}>
                                  {idx + 1}
                                </span>
                                <div>
                                  <h4 style={{ fontSize: '14px', fontWeight: '750', color: '#0f172a', margin: '0' }}>{item.title}</h4>
                                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '11px', padding: '2px 8px', backgroundColor: '#e2e8f0', color: '#475569', borderRadius: '4px', fontWeight: '600' }}>
                                      {item.tag}
                                    </span>
                                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                                      📅 {item.date}
                                    </span>
                                    <span style={{ fontSize: '11px', color: 'var(--secondary)', fontWeight: '700' }}>
                                      🎨 {item.highlightImage ? 'Custom Cover Image' : `Theme: ${item.highlightTheme || 'Purple'}`}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Manual Reordering & Action Buttons */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {/* Up / Down Reordering Buttons */}
                                {!isEditingDetails && (
                                  <div style={{ display: 'flex', gap: '4px' }}>
                                    <button
                                      disabled={idx === 0}
                                      onClick={() => moveHighlightItemManual(idx, 'up')}
                                      style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.3 : 1, display: 'flex', alignItems: 'center' }}
                                      title="Move Up"
                                    >
                                      <ArrowUp size={14} />
                                    </button>
                                    <button
                                      disabled={idx === arr.length - 1}
                                      onClick={() => moveHighlightItemManual(idx, 'down')}
                                      style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', cursor: idx === arr.length - 1 ? 'not-allowed' : 'pointer', opacity: idx === arr.length - 1 ? 0.3 : 1, display: 'flex', alignItems: 'center' }}
                                      title="Move Down"
                                    >
                                      <ArrowDown size={14} />
                                    </button>
                                  </div>
                                )}

                                {/* Configure Detail Form Toggle */}
                                <button
                                  onClick={() => {
                                    if (isEditingDetails) {
                                      setEditingHighlightEventId(null);
                                    } else {
                                      setEditingHighlightEventId(item.id);
                                      setHighlightDescription(item.highlightDescription || item.desc || '');
                                      setHighlightTheme(item.highlightTheme || 'Purple');
                                      setHighlightImage(item.highlightImage || null);
                                    }
                                  }}
                                  style={{
                                    padding: '6px 12px',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    borderRadius: '6px',
                                    border: '1px solid var(--border-subtle)',
                                    backgroundColor: isEditingDetails ? 'var(--primary)' : '#ffffff',
                                    color: isEditingDetails ? '#ffffff' : 'var(--primary)',
                                    cursor: 'pointer'
                                  }}
                                >
                                  {isEditingDetails ? 'Close Edit' : 'Edit Details'}
                                </button>

                                {/* Remove Button */}
                                <button
                                  onClick={() => toggleHighlightStatus(item)}
                                  style={{
                                    padding: '6px 12px',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    borderRadius: '6px',
                                    border: '1px solid #fee2e2',
                                    backgroundColor: '#fef2f2',
                                    color: '#ef4444',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>

                            {/* Details Editor Form */}
                            {isEditingDetails && (
                              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', gap: '14px' }} className="animate-fade-in">
                                <div>
                                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '750', color: '#0a385b', marginBottom: '4px', textTransform: 'uppercase' }}>Highlight Card Extended Description</label>
                                  <textarea
                                    rows="2"
                                    value={highlightDescription}
                                    onChange={(e) => setHighlightDescription(e.target.value)}
                                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', fontFamily: 'inherit', resize: 'none' }}
                                    placeholder="Write a highlight-specific snippet..."
                                  />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                  <div>
                                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '750', color: '#0a385b', marginBottom: '4px', textTransform: 'uppercase' }}>Theme Selection (No-Image Fallback)</label>
                                    <select
                                      value={highlightTheme}
                                      onChange={(e) => setHighlightTheme(e.target.value)}
                                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', backgroundColor: '#ffffff' }}
                                    >
                                      <option value="IEEE Blue">IEEE Blue</option>
                                      <option value="Purple">Purple</option>
                                      <option value="Cyan">Cyan</option>
                                      <option value="Green">Green</option>
                                      <option value="Teal">Teal</option>
                                    </select>
                                  </div>

                                  <div>
                                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '750', color: '#0a385b', marginBottom: '4px', textTransform: 'uppercase' }}>Cover Image Upload</label>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                          try {
                                            const imgBase64 = await compressImage(file);
                                            setHighlightImage(imgBase64);
                                          } catch (err) {
                                            console.error("Compression error:", err);
                                          }
                                        }
                                      }}
                                      style={{ fontSize: '11.5px' }}
                                    />
                                  </div>
                                </div>

                                {/* Image Preview Container */}
                                {highlightImage && (
                                  <div style={{ position: 'relative', width: '120px', height: '80px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1', marginTop: '4px' }}>
                                    <img src={highlightImage} alt="Highlight Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <button
                                      type="button"
                                      onClick={() => setHighlightImage(null)}
                                      style={{ position: 'absolute', top: '4px', right: '4px', backgroundColor: 'rgba(239, 68, 68, 0.9)', color: '#ffffff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                                      title="Remove cover photo"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                )}

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                                  <button
                                    onClick={() => setEditingHighlightEventId(null)}
                                    style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', cursor: 'pointer', fontWeight: '600' }}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => saveHighlightDetails(item.id, highlightDescription, highlightTheme, highlightImage)}
                                    style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '4px', border: 'none', backgroundColor: '#10b981', color: '#ffffff', cursor: 'pointer', fontWeight: '700' }}
                                  >
                                    Save Changes
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Right Column: Historical Completed Events Roster */}
              <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '24px' }}>
                <h3 style={{ fontSize: '15px', color: '#0a385b', fontWeight: '750', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Database size={18} color="var(--primary)" /> Completed Past Events Roster
                </h3>

                {pastEvents.length === 0 ? (
                  <p style={{ color: '#64748b', fontSize: '13px', fontStyle: 'italic' }}>No completed events available in records.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '550px', overflowY: 'auto', paddingRight: '8px' }}>
                    {pastEvents.map(item => {
                      const isHighlighted = item.isHighlighted;
                      const activeHighlightCount = pastEvents.filter(e => e.isHighlighted).length;
                      const isLimitReached = activeHighlightCount >= 5;

                      return (
                        <div
                          key={item.id}
                          style={{
                            padding: '12px',
                            borderRadius: '8px',
                            border: isHighlighted ? '1.5px solid rgba(16, 185, 129, 0.4)' : '1px solid #cbd5e1',
                            backgroundColor: isHighlighted ? 'rgba(16, 185, 129, 0.03)' : '#ffffff',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <span style={{ fontSize: '10px', padding: '1px 6px', backgroundColor: '#e2e8f0', color: '#475569', borderRadius: '3px', fontWeight: '700', textTransform: 'uppercase', marginRight: '6px' }}>
                              {item.tag}
                            </span>
                            <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', display: 'inline', margin: 0 }}>
                              {item.title}
                            </h4>
                            <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0 0' }}>
                              📅 {item.date}
                            </p>
                          </div>

                          <div>
                            {isHighlighted ? (
                              <button
                                onClick={() => toggleHighlightStatus(item)}
                                style={{
                                  padding: '5px 10px',
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  borderRadius: '4px',
                                  border: 'none',
                                  backgroundColor: '#fee2e2',
                                  color: '#ef4444',
                                  cursor: 'pointer'
                                }}
                                title="Remove from featured highlights carousel"
                              >
                                Remove
                              </button>
                            ) : (
                              <button
                                disabled={isLimitReached}
                                onClick={() => toggleHighlightStatus(item)}
                                style={{
                                  padding: '5px 10px',
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  borderRadius: '4px',
                                  border: isLimitReached ? '1px solid #cbd5e1' : '1px solid var(--secondary)',
                                  backgroundColor: isLimitReached ? '#f1f5f9' : '#ffffff',
                                  color: isLimitReached ? '#94a3b8' : 'var(--secondary)',
                                  cursor: isLimitReached ? 'not-allowed' : 'pointer'
                                }}
                                title={isLimitReached ? "Highlight limit of 5 events reached" : "Feature in highlights carousel"}
                              >
                                + Feature
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Achievements CRUD Operations */}
        {activeTab === 'achievements' && (
          <div className="animate-fade-in card" style={{ padding: '36px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
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

            {/* Achievements Stats & Success Stories Editor */}
            <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                <h3 style={{ fontSize: '15px', color: '#0a385b', fontWeight: '800', margin: 0 }}>Achievements Statistics & Success Stories</h3>
                <button
                  type="button"
                  onClick={() => {
                    settingsService.set('ieee_achievements_stats_v1', JSON.stringify(achievementsStats));
                    settingsService.set('ieee_success_stories_v1', JSON.stringify(successStories));
                    alert("Achievements stats & success stories saved successfully!");
                  }}
                  style={{ padding: '6px 14px', fontSize: '12px', fontWeight: '750', cursor: 'pointer', border: 'none', borderRadius: '4px', backgroundColor: '#e0f2fe', color: '#0369a1' }}
                >
                  Save Stats & Stories
                </button>
              </div>

              {/* Stats Counters */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {achievementsStats.map((stat, idx) => (
                  <div key={idx} style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Stat Label:</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        const newStats = [...achievementsStats];
                        newStats[idx].label = e.target.value;
                        setAchievementsStats(newStats);
                      }}
                      style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', marginBottom: '8px' }}
                    />
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Count (e.g. 15+):</label>
                    <input
                      type="text"
                      value={stat.count}
                      onChange={(e) => {
                        const newStats = [...achievementsStats];
                        newStats[idx].count = e.target.value;
                        setAchievementsStats(newStats);
                      }}
                      style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                ))}
              </div>

              {/* Success Stories */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Breakthrough Success Stories</label>
                  <button
                    type="button"
                    onClick={() => {
                      const stories = [...successStories];
                      stories.push({ title: 'New Breakthrough Story', category: 'Innovation Highlight', story: '', media: '' });
                      setSuccessStories(stories);
                    }}
                    style={{ padding: '4px 10px', fontSize: '11.5px', fontWeight: '700', cursor: 'pointer', border: 'none', borderRadius: '4px', backgroundColor: '#e2fbe8', color: '#15803d' }}
                  >
                    + Add Success Story
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {successStories.map((story, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '12px', backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1', position: 'relative' }}>
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '8px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Story Title:</label>
                            <input
                              type="text"
                              value={story.title}
                              onChange={(e) => {
                                const stories = [...successStories];
                                stories[idx].title = e.target.value;
                                setSuccessStories(stories);
                              }}
                              style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Category Tag:</label>
                            <input
                              type="text"
                              value={story.category}
                              onChange={(e) => {
                                const stories = [...successStories];
                                stories[idx].category = e.target.value;
                                setSuccessStories(stories);
                              }}
                              style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            />
                          </div>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Detailed Story / Quote:</label>
                          <textarea
                            rows="3"
                            value={story.story}
                            onChange={(e) => {
                              const stories = [...successStories];
                              stories[idx].story = e.target.value;
                              setSuccessStories(stories);
                            }}
                            style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Press Media Mention (e.g. Daily Express, April 2025):</label>
                          <input
                            type="text"
                            value={story.media || ''}
                            onChange={(e) => {
                              const stories = [...successStories];
                              stories[idx].media = e.target.value;
                              setSuccessStories(stories);
                            }}
                            style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const stories = successStories.filter((_, i) => i !== idx);
                          setSuccessStories(stories);
                        }}
                        style={{ alignSelf: 'start', padding: '8px', border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#fee2e2', color: '#ef4444' }}
                        title="Delete Story"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
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
                    {achievements.map((item, idx) => {
                      const isEditing = editingAchievementId === item.id;
                      return (
                        <tr key={item.id} style={{ borderBottom: idx < achievements.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                          {isEditing ? (
                            <>
                              <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                                <select
                                  value={achIconType}
                                  onChange={(e) => setAchIconType(e.target.value)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', backgroundColor: '#ffffff' }}
                                >
                                  <option value="Trophy">Trophy</option>
                                  <option value="Award">Award</option>
                                  <option value="Star">Star</option>
                                  <option value="TrendingUp">TrendingUp</option>
                                </select>
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                                <input
                                  type="text"
                                  value={achCategory}
                                  onChange={(e) => setAchCategory(e.target.value)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }}
                                />
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                                <input
                                  type="text"
                                  value={achTitle}
                                  onChange={(e) => setAchTitle(e.target.value)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }}
                                />
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                                <textarea
                                  value={achDesc}
                                  onChange={(e) => setAchDesc(e.target.value)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', fontFamily: 'inherit', resize: 'vertical' }}
                                  rows="2"
                                />
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'middle', textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                  <button
                                    onClick={() => saveInlineAchievement(item.id)}
                                    style={{ backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingAchievementId(null)}
                                    style={{ backgroundColor: '#64748b', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
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
                                    onClick={() => startInlineEditAchievement(item)}
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
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Execomm (Societies & Students Management) */}
        {activeTab === 'execomm' && (
          <div className="animate-fade-in card" style={{ padding: '36px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '20px', color: '#0a385b', fontWeight: '800', margin: 0 }}>Manage ExeComm Committee Members & Faculty Roster</h2>
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>Configure general student branch faculty advisors and student representatives.</p>
              </div>
            </div>
            {/* Sub-tab selection */}
            <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <button
                onClick={() => setExecommSubTab('faculties')}
                style={{
                  padding: '8px 16px',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: execommSubTab === 'faculties' ? '#0a385b' : '#f1f5f9',
                  color: execommSubTab === 'faculties' ? '#ffffff' : '#475569',
                  transition: 'all 0.2s ease'
                }}
              >
                Faculties (Societies)
              </button>
              <button
                onClick={() => setExecommSubTab('students')}
                style={{
                  padding: '8px 16px',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: execommSubTab === 'students' ? '#0a385b' : '#f1f5f9',
                  color: execommSubTab === 'students' ? '#ffffff' : '#475569',
                  transition: 'all 0.2s ease'
                }}
              >
                Students
              </button>
            </div>

            {execommSubTab === 'faculties' && (() => {
              const flatFaculties = societies.flatMap(item => [
                {
                  id: `${item.id}_1`,
                  societyId: item.id,
                  societyName: item.name,
                  index: 1,
                  name: item.faculty1?.name || '',
                  position: item.faculty1?.position || '',
                  phone: item.faculty1?.phone || '',
                  email: item.faculty1?.email || '',
                  linkedin: item.faculty1?.linkedin || '',
                  image: item.faculty1?.image || ''
                },
                {
                  id: `${item.id}_2`,
                  societyId: item.id,
                  societyName: item.name,
                  index: 2,
                  name: item.faculty2?.name || '',
                  position: item.faculty2?.position || '',
                  phone: item.faculty2?.phone || '',
                  email: item.faculty2?.email || '',
                  linkedin: item.faculty2?.linkedin || '',
                  image: item.faculty2?.image || ''
                }
              ]);

              return (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <h2 style={{ fontSize: '18px', color: '#0a385b', fontWeight: '800' }}>Manage Faculty Records</h2>
                      <p style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>List of society faculty advisors and coordinators (Total: {flatFaculties.length})</p>
                    </div>
                    <button
                      onClick={() => openAddModal('society')}
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
                      <Plus size={14} /> Add Society
                    </button>
                  </div>

                  <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px', tableLayout: 'auto', minWidth: '1300px' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                            <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '10%' }}>Profile Picture</th>
                            <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '16%' }}>Name</th>
                            <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '16%' }}>Position</th>
                            <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '13%' }}>Phone</th>
                            <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '15%' }}>Email</th>
                            <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '15%' }}>LinkedIn</th>
                            <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '15%' }}>Society</th>
                            <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', textAlign: 'center', width: '10%' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {flatFaculties.map((item, idx) => {
                            const isEditing = editingFacultyId === item.id;
                            return (
                              <tr key={item.id} style={{ borderBottom: idx < flatFaculties.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                                {isEditing ? (
                                  <>
                                    <td style={{ padding: '16px 20px', verticalAlign: 'middle', width: '10%' }}>
                                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                        {facultyImage ? (
                                          <img src={facultyImage} alt="Faculty Preview" style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
                                        ) : (
                                          <div style={{ width: '36px', height: '36px', borderRadius: '6px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e40af', fontSize: '11px', fontWeight: 'bold' }}>?</div>
                                        )}
                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                              try {
                                                const base64 = await compressImage(file);
                                                setFacultyImage(base64);
                                              } catch (err) {
                                                console.error(err);
                                              }
                                            }
                                          }}
                                          style={{ fontSize: '11px', width: '105px' }}
                                        />
                                      </div>
                                    </td>
                                    <td style={{ padding: '16px 20px', verticalAlign: 'middle', width: '16%' }}>
                                      <input
                                        type="text"
                                        value={facultyName}
                                        onChange={(e) => setFacultyName(e.target.value)}
                                        style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }}
                                      />
                                    </td>
                                    <td style={{ padding: '16px 20px', verticalAlign: 'middle', width: '16%' }}>
                                      <input
                                        type="text"
                                        value={facultyPosition}
                                        onChange={(e) => setFacultyPosition(e.target.value)}
                                        style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }}
                                      />
                                    </td>
                                    <td style={{ padding: '16px 20px', verticalAlign: 'middle', width: '13%' }}>
                                      <input
                                        type="text"
                                        value={facultyPhone}
                                        onChange={(e) => setFacultyPhone(e.target.value)}
                                        style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }}
                                      />
                                    </td>
                                    <td style={{ padding: '16px 20px', verticalAlign: 'middle', width: '15%' }}>
                                      <input
                                        type="text"
                                        value={facultyEmail}
                                        onChange={(e) => setFacultyEmail(e.target.value)}
                                        style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }}
                                      />
                                    </td>
                                    <td style={{ padding: '16px 20px', verticalAlign: 'middle', width: '15%' }}>
                                      <input
                                        type="text"
                                        value={facultyLinkedin}
                                        onChange={(e) => setFacultyLinkedin(e.target.value)}
                                        style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }}
                                      />
                                    </td>
                                    <td style={{ padding: '16px 20px', verticalAlign: 'middle', width: '15%' }}>
                                      <span style={{
                                        padding: '4px 10px',
                                        backgroundColor: '#f1f5f9',
                                        color: '#475569',
                                        borderRadius: '4px',
                                        fontSize: '11px',
                                        fontWeight: '800'
                                      }}>
                                        {item.societyName}
                                      </span>
                                    </td>
                                    <td style={{ padding: '16px 20px', verticalAlign: 'middle', textAlign: 'center', width: '10%' }}>
                                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                                        <button
                                          onClick={() => saveInlineFaculty(item.id)}
                                          style={{ backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                        >
                                          Save
                                        </button>
                                        <button
                                          onClick={() => setEditingFacultyId(null)}
                                          style={{ backgroundColor: '#64748b', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td style={{ padding: '16px 20px', verticalAlign: 'middle', textAlign: 'center', width: '10%' }}>
                                      {item.image ? (
                                        <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover', margin: '0 auto' }} />
                                      ) : (
                                        <div style={{ width: '40px', height: '40px', borderRadius: '6px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e40af', fontWeight: 'bold', fontSize: '14px', margin: '0 auto' }}>
                                          {item.name ? item.name.charAt(0) : '?'}
                                        </div>
                                      )}
                                    </td>
                                    <td style={{ padding: '16px 20px', fontWeight: '600', color: '#0a385b', verticalAlign: 'middle', width: '16%' }}>
                                      {item.name || <em style={{ color: '#cbd5e1' }}>Empty</em>}
                                    </td>
                                    <td style={{ padding: '16px 20px', color: '#475569', verticalAlign: 'middle', width: '16%' }}>
                                      {item.position || <em style={{ color: '#cbd5e1' }}>Empty</em>}
                                    </td>
                                    <td style={{ padding: '16px 20px', color: '#475569', verticalAlign: 'middle', width: '13%' }}>
                                      {item.phone || <em style={{ color: '#cbd5e1' }}>Empty</em>}
                                    </td>
                                    <td style={{ padding: '16px 20px', color: '#475569', verticalAlign: 'middle', width: '15%', wordBreak: 'break-all' }}>
                                      {item.email || <em style={{ color: '#cbd5e1' }}>Empty</em>}
                                    </td>
                                    <td style={{ padding: '16px 20px', color: '#475569', verticalAlign: 'middle', width: '15%', wordBreak: 'break-all' }}>
                                      {item.linkedin ? (
                                        <a href={item.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#02619a', textDecoration: 'underline' }}>Link</a>
                                      ) : (
                                        <em style={{ color: '#cbd5e1' }}>Empty</em>
                                      )}
                                    </td>
                                    <td style={{ padding: '16px 20px', verticalAlign: 'middle', width: '15%' }}>
                                      <span style={{
                                        padding: '4px 10px',
                                        backgroundColor: '#eff6ff',
                                        color: '#1e40af',
                                        borderRadius: '4px',
                                        fontSize: '11px',
                                        fontWeight: '800'
                                      }}>
                                        {item.societyName}
                                      </span>
                                    </td>
                                    <td style={{ padding: '16px 20px', verticalAlign: 'middle', textAlign: 'center', width: '10%' }}>
                                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                                        <button
                                          onClick={() => startInlineEditFaculty(item)}
                                          style={{ color: '#02619a', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '4px', padding: '6px', cursor: 'pointer' }}
                                          className="action-btn-hover-edit"
                                        >
                                          <Edit3 size={15} />
                                        </button>
                                        <button
                                          onClick={() => deleteFaculty(item.id)}
                                          style={{ color: '#ef4444', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '4px', padding: '6px', cursor: 'pointer' }}
                                          className="action-btn-hover-delete"
                                        >
                                          <Trash2 size={15} />
                                        </button>
                                      </div>
                                    </td>
                                  </>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })()}

            {execommSubTab === 'students' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <h2 style={{ fontSize: '18px', color: '#0a385b', fontWeight: '800' }}>Manage Student Records</h2>
                    <p style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>List of student members and officers (Total: {students.length})</p>
                  </div>
                  <button
                    onClick={() => openAddModal('student')}
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
                    <Plus size={14} /> Add Student Record
                  </button>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px', tableLayout: 'auto', minWidth: '1300px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                          <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '10%' }}>Profile Picture</th>
                          <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '15%' }}>Name</th>
                          <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '15%' }}>Department</th>
                          <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', textAlign: 'center', width: '10%' }}>Year of Study</th>
                          <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '15%' }}>IEEE Membership Number</th>
                          <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '13%' }}>Position</th>
                          <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '12%' }}>Society</th>
                          <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '15%' }}>Email</th>
                          <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '12%' }}>Phone</th>
                          <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '12%' }}>LinkedIn</th>
                          <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', textAlign: 'center', width: '10%' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((item, idx) => {
                          const isEditing = editingStudentId === item.id;
                          return (
                            <tr key={item.id} style={{ borderBottom: idx < students.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                              {isEditing ? (
                                <>
                                  <td style={{ padding: '16px 20px', verticalAlign: 'middle', width: '10%' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                      {studentImage ? (
                                        <img src={studentImage} alt="Student Preview" style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
                                      ) : (
                                        <div style={{ width: '36px', height: '36px', borderRadius: '6px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e40af', fontSize: '11px', fontWeight: 'bold' }}>?</div>
                                      )}
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                          const file = e.target.files[0];
                                          if (file) {
                                            try {
                                              const base64 = await compressImage(file);
                                              setStudentImage(base64);
                                            } catch (err) {
                                              console.error(err);
                                            }
                                          }
                                        }}
                                        style={{ fontSize: '11px', width: '105px' }}
                                      />
                                    </div>
                                  </td>
                                  <td style={{ padding: '16px 20px', verticalAlign: 'middle', width: '15%' }}>
                                    <input
                                      type="text"
                                      value={studentName}
                                      onChange={(e) => setStudentName(e.target.value)}
                                      style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }}
                                    />
                                  </td>
                                  <td style={{ padding: '16px 20px', verticalAlign: 'middle', width: '15%' }}>
                                    <input
                                      type="text"
                                      value={studentDept}
                                      onChange={(e) => setStudentDept(e.target.value)}
                                      style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }}
                                    />
                                  </td>
                                  <td style={{ padding: '16px 20px', verticalAlign: 'middle', textAlign: 'center', width: '10%' }}>
                                    <select
                                      value={studentYear}
                                      onChange={(e) => setStudentYear(e.target.value)}
                                      style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', backgroundColor: '#ffffff' }}
                                    >
                                      <option value="I">I</option>
                                      <option value="II">II</option>
                                      <option value="III">III</option>
                                      <option value="IV">IV</option>
                                    </select>
                                  </td>
                                  <td style={{ padding: '16px 20px', verticalAlign: 'middle', width: '15%' }}>
                                    <input
                                      type="text"
                                      value={studentIeeeNumber}
                                      onChange={(e) => setStudentIeeeNumber(e.target.value)}
                                      style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }}
                                    />
                                  </td>
                                  <td style={{ padding: '16px 20px', verticalAlign: 'middle', width: '13%' }}>
                                    <input
                                      type="text"
                                      value={studentPosition}
                                      onChange={(e) => setStudentPosition(e.target.value)}
                                      style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }}
                                    />
                                  </td>
                                  <td style={{ padding: '16px 20px', verticalAlign: 'middle', width: '12%' }}>
                                    <select
                                      value={studentSociety}
                                      onChange={(e) => setStudentSociety(e.target.value)}
                                      style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', backgroundColor: '#ffffff' }}
                                    >
                                      <option value="IEEE KEC SB">IEEE KEC SB</option>
                                      {societies.map((s) => (
                                        <option key={s.id} value={s.name}>{s.name}</option>
                                      ))}
                                    </select>
                                  </td>
                                  <td style={{ padding: '16px 20px', verticalAlign: 'middle', width: '15%' }}>
                                    <input type="text" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }} />
                                  </td>
                                  <td style={{ padding: '16px 20px', verticalAlign: 'middle', width: '12%' }}>
                                    <input type="text" value={studentPhone} onChange={(e) => setStudentPhone(e.target.value)} style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }} />
                                  </td>
                                  <td style={{ padding: '16px 20px', verticalAlign: 'middle', width: '12%' }}>
                                    <input type="text" value={studentLinkedin} onChange={(e) => setStudentLinkedin(e.target.value)} style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }} />
                                  </td>
                                  <td style={{ padding: '16px 20px', verticalAlign: 'middle', textAlign: 'center', width: '10%' }}>
                                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                                      <button
                                        onClick={() => saveInlineStudent(item.id)}
                                        style={{ backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={() => setEditingStudentId(null)}
                                        style={{ backgroundColor: '#64748b', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td style={{ padding: '16px 20px', verticalAlign: 'middle', textAlign: 'center', width: '10%' }}>
                                    {item.image ? (
                                      <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover', margin: '0 auto' }} />
                                    ) : (
                                      <div style={{ width: '40px', height: '40px', borderRadius: '6px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e40af', fontWeight: 'bold', fontSize: '14px', margin: '0 auto' }}>
                                        {item.name ? item.name.charAt(0) : '?'}
                                      </div>
                                    )}
                                  </td>
                                  <td style={{ padding: '16px 20px', fontWeight: '600', color: '#0a385b', verticalAlign: 'middle', width: '15%' }}>
                                    {item.name}
                                  </td>
                                  <td style={{ padding: '16px 20px', color: '#475569', verticalAlign: 'middle', width: '15%' }}>
                                    {item.department}
                                  </td>
                                  <td style={{ padding: '16px 20px', color: '#475569', verticalAlign: 'middle', textAlign: 'center', width: '10%' }}>
                                    {item.yearOfStudy}
                                  </td>
                                  <td style={{ padding: '16px 20px', color: '#475569', verticalAlign: 'middle', width: '15%' }}>
                                    {item.ieeeNumber}
                                  </td>
                                  <td style={{ padding: '16px 20px', color: '#02619a', fontWeight: '600', verticalAlign: 'middle', width: '13%' }}>
                                    {item.position}
                                  </td>
                                  <td style={{ padding: '16px 20px', verticalAlign: 'middle', width: '12%' }}>
                                    <span style={{
                                      padding: '4px 10px',
                                      backgroundColor: '#eff6ff',
                                      color: '#1e40af',
                                      borderRadius: '4px',
                                      fontSize: '11px',
                                      fontWeight: '800'
                                    }}>
                                      {item.society}
                                    </span>
                                  </td>
                                  <td style={{ padding: '16px 20px', color: '#475569', verticalAlign: 'middle', width: '15%', wordBreak: 'break-all' }}>
                                    {item.email || <em style={{ color: '#cbd5e1' }}>Empty</em>}
                                  </td>
                                  <td style={{ padding: '16px 20px', color: '#475569', verticalAlign: 'middle', width: '12%' }}>
                                    {item.phone || <em style={{ color: '#cbd5e1' }}>Empty</em>}
                                  </td>
                                  <td style={{ padding: '16px 20px', color: '#475569', verticalAlign: 'middle', width: '12%' }}>
                                    {item.linkedin ? <a href={item.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#02619a', textDecoration: 'underline' }}>Link</a> : <em style={{ color: '#cbd5e1' }}>Empty</em>}
                                  </td>
                                  <td style={{ padding: '16px 20px', verticalAlign: 'middle', textAlign: 'center', width: '10%' }}>
                                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                                      <button
                                        onClick={() => startInlineEditStudent(item)}
                                        style={{ color: '#02619a', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '4px', padding: '6px', cursor: 'pointer' }}
                                        className="action-btn-hover-edit"
                                      >
                                        <Edit3 size={15} />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteItem('student', item.id)}
                                        style={{ color: '#ef4444', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '4px', padding: '6px', cursor: 'pointer' }}
                                        className="action-btn-hover-delete"
                                      >
                                        <Trash2 size={15} />
                                      </button>
                                    </div>
                                  </td>
                                </>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Execomm Society Branches Management */}
        {activeTab === 'branches' && branchData && (
          <div className="animate-fade-in card" style={{ padding: '36px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '20px', color: '#0a385b', fontWeight: '800' }}>Manage ExeComm Branches & Society Pages</h2>
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>Edit custom content, stats, coordinates, and rosters for all six IEEE societies.</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    settingsService.set(`ieee_society_data_${selectedBranchKey}_v5`, JSON.stringify(branchData));
                    setBranchSaved(true);
                    setTimeout(() => setBranchSaved(false), 3000);
                  }}
                  style={{
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '30px',
                    padding: '10px 20px',
                    fontSize: '13.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(16,185,129,0.2)'
                  }}
                >
                  <Save size={15} /> Save Branch Details
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to revert all changes for this branch to default settings? This cannot be undone.")) {
                      localStorage.removeItem(`ieee_society_data_${selectedBranchKey}_v5`);
                      const key = selectedBranchKey;
                      if (key === 'ap-s') setBranchData(JSON.parse(JSON.stringify(apsData)));
                      else if (key === 'computer-society') setBranchData(JSON.parse(JSON.stringify(computerSocietyData)));
                      else if (key === 'wie') setBranchData(JSON.parse(JSON.stringify(wieData)));
                      else if (key === 'ras') setBranchData(JSON.parse(JSON.stringify(rasData)));
                      else if (key === 'pes') setBranchData(JSON.parse(JSON.stringify(pesData)));
                      else if (key === 'comsoc') setBranchData(JSON.parse(JSON.stringify(comsocData)));
                      setBranchSaved(true);
                      setTimeout(() => setBranchSaved(false), 2000);
                    }
                  }}
                  style={{
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '30px',
                    padding: '10px 20px',
                    fontSize: '13.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(239,68,68,0.2)'
                  }}
                >
                  <RefreshCw size={15} /> Reset to Defaults
                </button>
              </div>
            </div>

            {branchSaved && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#dcfce7',
                color: '#15803d',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '24px',
                border: '1px solid #bbf7d0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Check size={16} /> Changes successfully saved for {branchData.name}!
              </div>
            )}

            {/* Branch Selector Dropdown & Grid */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '13.5px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>Select Branch to Manage:</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { key: 'ap-s', name: 'APS (Antennas & Propagation)', color: '#000000' },
                  { key: 'computer-society', name: 'Computer Society', color: '#eab308' },
                  { key: 'wie', name: 'Women in Engineering', color: '#8e24aa' },
                  { key: 'ras', name: 'Robotics & Automation', color: '#dc2626' },
                  { key: 'pes', name: 'Power & Energy', color: '#15803d' },
                  { key: 'comsoc', name: 'Communications Society', color: '#0a385b' }
                ].map(branch => (
                  <button
                    key={branch.key}
                    onClick={() => setSelectedBranchKey(branch.key)}
                    style={{
                      padding: '10px 18px',
                      fontSize: '13px',
                      fontWeight: '700',
                      borderRadius: '8px',
                      border: selectedBranchKey === branch.key ? `2px solid ${branch.color}` : '1px solid #cbd5e1',
                      cursor: 'pointer',
                      backgroundColor: selectedBranchKey === branch.key ? `${branch.color}15` : '#f8fafc',
                      color: selectedBranchKey === branch.key ? branch.color : '#475569',
                      transition: 'all 0.2s ease',
                      boxShadow: selectedBranchKey === branch.key ? '0 4px 10px rgba(0,0,0,0.05)' : 'none'
                    }}
                  >
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: branch.color, marginRight: '8px' }}></span>
                    {branch.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-Tabs Selector */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
              {[
                { id: 'general', label: 'General & Colors' },
                { id: 'about', label: 'About & Stats' },
                { id: 'faculty-leadership', label: 'Faculty & Leaders' },
                { id: 'rosters', label: 'Rosters & Members' },
                { id: 'gallery-contact', label: 'Gallery & Contact' },
                { id: 'milestones', label: 'Milestones & Achievements' }
              ].map(subTab => (
                <button
                  key={subTab.id}
                  onClick={() => setBranchSubTab(subTab.id)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: '700',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    backgroundColor: branchSubTab === subTab.id ? '#0a385b' : '#f1f5f9',
                    color: branchSubTab === subTab.id ? '#ffffff' : '#475569',
                    transition: 'all 0.2s'
                  }}
                >
                  {subTab.label}
                </button>
              ))}
            </div>

            {/* Sub-Tab 1: General Settings */}
            {branchSubTab === 'general' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Society Full Name:</label>
                    <input
                      type="text"
                      value={branchData.name || ''}
                      onChange={(e) => setBranchData({ ...branchData, name: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Motto / Slogan:</label>
                    <input
                      type="text"
                      value={branchData.motto || ''}
                      onChange={(e) => setBranchData({ ...branchData, motto: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Brief Description:</label>
                  <textarea
                    rows="3"
                    value={branchData.description || ''}
                    onChange={(e) => setBranchData({ ...branchData, description: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Primary Theme Color (HEX):</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="color"
                        value={branchData.theme?.primary || '#00629B'}
                        onChange={(e) => setBranchData({
                          ...branchData,
                          theme: { ...branchData.theme, primary: e.target.value }
                        })}
                        style={{ width: '42px', height: '42px', padding: '0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        value={branchData.theme?.primary || ''}
                        onChange={(e) => setBranchData({
                          ...branchData,
                          theme: { ...branchData.theme, primary: e.target.value }
                        })}
                        style={{ flexGrow: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Secondary Theme Color (HEX):</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="color"
                        value={branchData.theme?.secondary || '#ffffff'}
                        onChange={(e) => setBranchData({
                          ...branchData,
                          theme: { ...branchData.theme, secondary: e.target.value }
                        })}
                        style={{ width: '42px', height: '42px', padding: '0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        value={branchData.theme?.secondary || ''}
                        onChange={(e) => setBranchData({
                          ...branchData,
                          theme: { ...branchData.theme, secondary: e.target.value }
                        })}
                        style={{ flexGrow: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Badge Background Color (HEX):</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="color"
                        value={branchData.theme?.badgeBg || branchData.theme?.secondary || '#ffffff'}
                        onChange={(e) => setBranchData({
                          ...branchData,
                          theme: { ...branchData.theme, badgeBg: e.target.value }
                        })}
                        style={{ width: '42px', height: '42px', padding: '0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        value={branchData.theme?.badgeBg || ''}
                        placeholder={branchData.theme?.secondary || '#ffffff'}
                        onChange={(e) => setBranchData({
                          ...branchData,
                          theme: { ...branchData.theme, badgeBg: e.target.value }
                        })}
                        style={{ flexGrow: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Badge Text Color (HEX):</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="color"
                        value={branchData.theme?.badgeText || '#ffffff'}
                        onChange={(e) => setBranchData({
                          ...branchData,
                          theme: { ...branchData.theme, badgeText: e.target.value }
                        })}
                        style={{ width: '42px', height: '42px', padding: '0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        value={branchData.theme?.badgeText || ''}
                        placeholder="#ffffff"
                        onChange={(e) => setBranchData({
                          ...branchData,
                          theme: { ...branchData.theme, badgeText: e.target.value }
                        })}
                        style={{ flexGrow: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Stats Box Background (HEX):</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="color"
                        value={branchData.theme?.statsBg || '#f8fafc'}
                        onChange={(e) => setBranchData({
                          ...branchData,
                          theme: { ...branchData.theme, statsBg: e.target.value }
                        })}
                        style={{ width: '42px', height: '42px', padding: '0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        value={branchData.theme?.statsBg || ''}
                        placeholder="e.g. #f1f5f9"
                        onChange={(e) => setBranchData({
                          ...branchData,
                          theme: { ...branchData.theme, statsBg: e.target.value }
                        })}
                        style={{ flexGrow: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Hero Image URL:</label>
                    <input
                      type="text"
                      value={branchData.heroImage || ''}
                      onChange={(e) => setBranchData({ ...branchData, heroImage: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Hero Video URL (Vimeo/CDN looped mp4):</label>
                    <input
                      type="text"
                      value={branchData.heroVideo || ''}
                      onChange={(e) => setBranchData({ ...branchData, heroVideo: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab 2: About & Stats */}
            {branchSubTab === 'about' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Detailed Overview Field */}
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>About the Society (Detailed Multi-Paragraph Overview):</label>
                  <textarea
                    rows="6"
                    value={branchData.about?.overview || ''}
                    onChange={(e) => setBranchData({
                      ...branchData,
                      about: { ...branchData.about, overview: e.target.value }
                    })}
                    placeholder="Provide a detailed overview of the society branch. Use double line breaks (Enter key twice) to start new paragraphs."
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.5', fontSize: '13.5px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Mission Statement:</label>
                    <textarea
                      rows="3"
                      value={branchData.about?.mission || ''}
                      onChange={(e) => setBranchData({
                        ...branchData,
                        about: { ...branchData.about, mission: e.target.value }
                      })}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Vision Statement:</label>
                    <textarea
                      rows="3"
                      value={branchData.about?.vision || ''}
                      onChange={(e) => setBranchData({
                        ...branchData,
                        about: { ...branchData.about, vision: e.target.value }
                      })}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                    />
                  </div>
                </div>

                {/* Objectives Checklist Manager */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Key Objectives:</label>
                    <button
                      onClick={() => {
                        const objectives = branchData.about?.objectives ? [...branchData.about.objectives] : [];
                        objectives.push("New objective statement...");
                        setBranchData({
                          ...branchData,
                          about: { ...branchData.about, objectives }
                        });
                      }}
                      style={{ padding: '4px 10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', border: 'none', borderRadius: '4px', backgroundColor: '#e0f2fe', color: '#0369a1' }}
                    >
                      + Add Objective
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {branchData.about?.objectives && branchData.about.objectives.map((obj, index) => (
                      <div key={index} style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          value={obj || ''}
                          onChange={(e) => {
                            const objectives = [...branchData.about.objectives];
                            objectives[index] = e.target.value;
                            setBranchData({
                              ...branchData,
                              about: { ...branchData.about, objectives }
                            });
                          }}
                          style={{ flexGrow: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13.5px' }}
                        />
                        <button
                          onClick={() => {
                            const objectives = branchData.about.objectives.filter((_, i) => i !== index);
                            setBranchData({
                              ...branchData,
                              about: { ...branchData.about, objectives }
                            });
                          }}
                          style={{ padding: '8px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#fee2e2', color: '#ef4444' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Statistics Counter Fields */}
                <div>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: '800', color: '#0a385b', borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginBottom: '12px' }}>Statistics Counters</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Members Count:</label>
                      <input
                        type="text"
                        value={branchData.statistics?.members || ''}
                        onChange={(e) => setBranchData({
                          ...branchData,
                          statistics: { ...branchData.statistics, members: e.target.value }
                        })}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Events Count:</label>
                      <input
                        type="text"
                        value={branchData.statistics?.events || ''}
                        onChange={(e) => setBranchData({
                          ...branchData,
                          statistics: { ...branchData.statistics, events: e.target.value }
                        })}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Awards Count:</label>
                      <input
                        type="text"
                        value={branchData.statistics?.awards || ''}
                        onChange={(e) => setBranchData({
                          ...branchData,
                          statistics: { ...branchData.statistics, awards: e.target.value }
                        })}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Projects Count:</label>
                      <input
                        type="text"
                        value={branchData.statistics?.projects || ''}
                        onChange={(e) => setBranchData({
                          ...branchData,
                          statistics: { ...branchData.statistics, projects: e.target.value }
                        })}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Flagship Initiatives Section */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px', marginTop: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '14.5px', fontWeight: '800', color: '#0a385b', margin: 0 }}>
                      Manage Flagship Initiatives ({branchData.initiatives ? branchData.initiatives.length : 0} items)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const initiatives = branchData.initiatives ? [...branchData.initiatives] : [];
                        initiatives.push({ title: 'New Initiative', description: '', icon: 'Cpu', tag: '' });
                        setBranchData({ ...branchData, initiatives });
                      }}
                      style={{ padding: '6px 12px', fontSize: '12.2px', fontWeight: '700', cursor: 'pointer', border: 'none', borderRadius: '4px', backgroundColor: '#e2fbe8', color: '#15803d' }}
                    >
                      + Add Initiative
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {branchData.initiatives && branchData.initiatives.map((initiative, idx) => (
                      <div key={idx} style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <h4 style={{ fontSize: '13.5px', color: '#0a385b', fontWeight: '800', margin: 0 }}>Initiative #{idx + 1}</h4>
                          <button
                            type="button"
                            onClick={() => {
                              const initiatives = branchData.initiatives.filter((_, i) => i !== idx);
                              setBranchData({ ...branchData, initiatives });
                            }}
                            style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}
                            title="Delete Initiative"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Title:</label>
                            <input
                              type="text"
                              value={initiative.title || ''}
                              onChange={(e) => {
                                const initiatives = [...branchData.initiatives];
                                initiatives[idx].title = e.target.value;
                                setBranchData({ ...branchData, initiatives });
                              }}
                              style={{ width: '100%', padding: '8px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Icon:</label>
                            <select
                              value={initiative.icon || 'Cpu'}
                              onChange={(e) => {
                                const initiatives = [...branchData.initiatives];
                                initiatives[idx].icon = e.target.value;
                                setBranchData({ ...branchData, initiatives });
                              }}
                              style={{ width: '100%', padding: '8px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff' }}
                            >
                              {['Cpu', 'Network', 'Zap', 'Heart', 'Code', 'Globe', 'Award', 'Users'].map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Tag (e.g. Skill Dev):</label>
                            <input
                              type="text"
                              value={initiative.tag || ''}
                              onChange={(e) => {
                                const initiatives = [...branchData.initiatives];
                                initiatives[idx].tag = e.target.value;
                                setBranchData({ ...branchData, initiatives });
                              }}
                              style={{ width: '100%', padding: '8px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            />
                          </div>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Description:</label>
                          <textarea
                            rows="2"
                            value={initiative.description || ''}
                            onChange={(e) => {
                              const initiatives = [...branchData.initiatives];
                              initiatives[idx].description = e.target.value;
                              setBranchData({ ...branchData, initiatives });
                            }}
                            style={{ width: '100%', padding: '8px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', resize: 'vertical', fontFamily: 'inherit' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Advisor & Coordinator Messages */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px', marginTop: '10px' }}>
                  <label style={{ display: 'block', fontSize: '14.5px', fontWeight: '800', color: '#0a385b', marginBottom: '12px' }}>Leadership Messages</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Faculty Advisor Message:</label>
                      <textarea
                        rows="4"
                        value={branchData.advisorMessage || ''}
                        onChange={(e) => setBranchData({ ...branchData, advisorMessage: e.target.value })}
                        placeholder="Message from Faculty Advisor..."
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical', fontFamily: 'inherit', fontSize: '13px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Student Coordinator Message:</label>
                      <textarea
                        rows="4"
                        value={branchData.coordinatorMessage || ''}
                        onChange={(e) => setBranchData({ ...branchData, coordinatorMessage: e.target.value })}
                        placeholder="Message from Student Coordinator..."
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical', fontFamily: 'inherit', fontSize: '13px' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Benefits of Joining */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px', marginTop: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '14.5px', fontWeight: '800', color: '#0a385b', margin: 0 }}>Society Benefits</label>
                    <button
                      type="button"
                      onClick={() => {
                        const benefits = branchData.benefits ? [...branchData.benefits] : [];
                        benefits.push("New benefit item...");
                        setBranchData({ ...branchData, benefits });
                      }}
                      style={{ padding: '4px 10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', border: 'none', borderRadius: '4px', backgroundColor: '#e0f2fe', color: '#0369a1' }}
                    >
                      + Add Benefit
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {branchData.benefits && branchData.benefits.map((benefit, index) => (
                      <div key={index} style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          value={benefit || ''}
                          onChange={(e) => {
                            const benefits = [...branchData.benefits];
                            benefits[index] = e.target.value;
                            setBranchData({ ...branchData, benefits });
                          }}
                          style={{ flexGrow: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const benefits = branchData.benefits.filter((_, i) => i !== index);
                            setBranchData({ ...branchData, benefits });
                          }}
                          style={{ padding: '8px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#fee2e2', color: '#ef4444' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Signature Events */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px', marginTop: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '14.5px', fontWeight: '800', color: '#0a385b', margin: 0 }}>Signature Events & Flagship Activities</label>
                    <button
                      type="button"
                      onClick={() => {
                        const signatureEvents = branchData.signatureEvents ? [...branchData.signatureEvents] : [];
                        signatureEvents.push({ icon: '🚀', title: 'New Signature Event', description: '' });
                        setBranchData({ ...branchData, signatureEvents });
                      }}
                      style={{ padding: '6px 12px', fontSize: '12.2px', fontWeight: '700', cursor: 'pointer', border: 'none', borderRadius: '4px', backgroundColor: '#e2fbe8', color: '#15803d' }}
                    >
                      + Add Signature Event
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {branchData.signatureEvents && branchData.signatureEvents.map((evt, idx) => (
                      <div key={idx} style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <h4 style={{ fontSize: '13px', color: '#0a385b', fontWeight: '800', margin: 0 }}>Signature Event #{idx + 1}</h4>
                          <button
                            type="button"
                            onClick={() => {
                              const signatureEvents = branchData.signatureEvents.filter((_, i) => i !== idx);
                              setBranchData({ ...branchData, signatureEvents });
                            }}
                            style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}
                            title="Delete Signature Event"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '12px', marginBottom: '12px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Icon (Emoji):</label>
                            <input
                              type="text"
                              value={evt.icon || '🚀'}
                              onChange={(e) => {
                                const signatureEvents = [...branchData.signatureEvents];
                                signatureEvents[idx].icon = e.target.value;
                                setBranchData({ ...branchData, signatureEvents });
                              }}
                              style={{ width: '100%', padding: '8px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Title:</label>
                            <input
                              type="text"
                              value={evt.title || ''}
                              onChange={(e) => {
                                const signatureEvents = [...branchData.signatureEvents];
                                signatureEvents[idx].title = e.target.value;
                                setBranchData({ ...branchData, signatureEvents });
                              }}
                              style={{ width: '100%', padding: '8px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            />
                          </div>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Description:</label>
                          <textarea
                            rows="2"
                            value={evt.description || ''}
                            onChange={(e) => {
                              const signatureEvents = [...branchData.signatureEvents];
                              signatureEvents[idx].description = e.target.value;
                              setBranchData({ ...branchData, signatureEvents });
                            }}
                            style={{ width: '100%', padding: '8px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', resize: 'vertical', fontFamily: 'inherit' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Sub-Tab 3: Faculty & Leaders */}
            {branchSubTab === 'faculty-leadership' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                
                {/* Faculty Advisor Section */}
                <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '15px', color: '#0a385b', fontWeight: '800', marginBottom: '16px' }}>Faculty In-Charge Details</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                      {branchData.facultyIncharge?.photo ? (
                        <img src={branchData.facultyIncharge.photo} alt="Faculty Incharge" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #cbd5e1' }} />
                      ) : (
                        <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>No Photo</div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            try {
                              const base64 = await compressImage(file);
                              setBranchData({
                                ...branchData,
                                facultyIncharge: { ...branchData.facultyIncharge, photo: base64 }
                              });
                            } catch (err) {
                              console.error(err);
                            }
                          }
                        }}
                        style={{ fontSize: '11px', width: '150px' }}
                      />
                      <input
                        type="text"
                        placeholder="Or paste photo URL..."
                        value={branchData.facultyIncharge?.photo || ''}
                        onChange={(e) => setBranchData({
                          ...branchData,
                          facultyIncharge: { ...branchData.facultyIncharge, photo: e.target.value }
                        })}
                        style={{ width: '100%', padding: '6px', fontSize: '11px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Name:</label>
                        <input
                          type="text"
                          value={branchData.facultyIncharge?.name || ''}
                          onChange={(e) => setBranchData({
                            ...branchData,
                            facultyIncharge: { ...branchData.facultyIncharge, name: e.target.value }
                          })}
                          style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Position:</label>
                        <input
                          type="text"
                          value={branchData.facultyIncharge?.position || ''}
                          onChange={(e) => setBranchData({
                            ...branchData,
                            facultyIncharge: { ...branchData.facultyIncharge, position: e.target.value }
                          })}
                          style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Department:</label>
                        <input
                          type="text"
                          value={branchData.facultyIncharge?.department || ''}
                          onChange={(e) => setBranchData({
                            ...branchData,
                            facultyIncharge: { ...branchData.facultyIncharge, department: e.target.value }
                          })}
                          style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Phone Number:</label>
                        <input
                          type="text"
                          value={branchData.facultyIncharge?.phone || ''}
                          onChange={(e) => setBranchData({
                            ...branchData,
                            facultyIncharge: { ...branchData.facultyIncharge, phone: e.target.value }
                          })}
                          style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Email Address:</label>
                        <input
                          type="email"
                          value={branchData.facultyIncharge?.email || ''}
                          onChange={(e) => setBranchData({
                            ...branchData,
                            facultyIncharge: { ...branchData.facultyIncharge, email: e.target.value }
                          })}
                          style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Leadership (Chairman & Vice Chairman) Section */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  
                  {/* Chairman Card */}
                  <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '14.5px', color: '#0a385b', fontWeight: '800', marginBottom: '16px' }}>Chairman Profile</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {branchData.chairman?.photo ? (
                          <img src={branchData.chairman.photo} alt="Chairman" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '60px', height: '60px', borderRadius: '8px', backgroundColor: '#cbd5e1' }} />
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (file) {
                                try {
                                  const base64 = await compressImage(file);
                                  setBranchData({
                                    ...branchData,
                                    chairman: { ...branchData.chairman, photo: base64 }
                                  });
                                } catch (err) {
                                  console.error(err);
                                }
                              }
                            }}
                            style={{ fontSize: '10px', width: '140px' }}
                          />
                          <input
                            type="text"
                            placeholder="Photo URL"
                            value={branchData.chairman?.photo || ''}
                            onChange={(e) => setBranchData({
                              ...branchData,
                              chairman: { ...branchData.chairman, photo: e.target.value }
                            })}
                            style={{ width: '140px', padding: '4px', fontSize: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input
                          type="text"
                          placeholder="Name"
                          value={branchData.chairman?.name || ''}
                          onChange={(e) => setBranchData({
                            ...branchData,
                            chairman: { ...branchData.chairman, name: e.target.value }
                          })}
                          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                        />
                        <input
                          type="text"
                          placeholder="Position"
                          value={branchData.chairman?.position || ''}
                          onChange={(e) => setBranchData({
                            ...branchData,
                            chairman: { ...branchData.chairman, position: e.target.value }
                          })}
                          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                        />
                        <input
                          type="text"
                          placeholder="Year (e.g. IV Year)"
                          value={branchData.chairman?.year || ''}
                          onChange={(e) => setBranchData({
                            ...branchData,
                            chairman: { ...branchData.chairman, year: e.target.value }
                          })}
                          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                        />
                        <input
                          type="text"
                          placeholder="Department"
                          value={branchData.chairman?.department || ''}
                          onChange={(e) => setBranchData({
                            ...branchData,
                            chairman: { ...branchData.chairman, department: e.target.value }
                          })}
                          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vice Chairman Card */}
                  <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '14.5px', color: '#0a385b', fontWeight: '800', marginBottom: '16px' }}>Vice Chairman Profile</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {branchData.viceChairman?.photo ? (
                          <img src={branchData.viceChairman.photo} alt="Vice Chairman" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '60px', height: '60px', borderRadius: '8px', backgroundColor: '#cbd5e1' }} />
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (file) {
                                try {
                                  const base64 = await compressImage(file);
                                  setBranchData({
                                    ...branchData,
                                    viceChairman: { ...branchData.viceChairman, photo: base64 }
                                  });
                                } catch (err) {
                                  console.error(err);
                                }
                              }
                            }}
                            style={{ fontSize: '10px', width: '140px' }}
                          />
                          <input
                            type="text"
                            placeholder="Photo URL"
                            value={branchData.viceChairman?.photo || ''}
                            onChange={(e) => setBranchData({
                              ...branchData,
                              viceChairman: { ...branchData.viceChairman, photo: e.target.value }
                            })}
                            style={{ width: '140px', padding: '4px', fontSize: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input
                          type="text"
                          placeholder="Name"
                          value={branchData.viceChairman?.name || ''}
                          onChange={(e) => setBranchData({
                            ...branchData,
                            viceChairman: { ...branchData.viceChairman, name: e.target.value }
                          })}
                          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                        />
                        <input
                          type="text"
                          placeholder="Position"
                          value={branchData.viceChairman?.position || ''}
                          onChange={(e) => setBranchData({
                            ...branchData,
                            viceChairman: { ...branchData.viceChairman, position: e.target.value }
                          })}
                          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                        />
                        <input
                          type="text"
                          placeholder="Year (e.g. IV Year)"
                          value={branchData.viceChairman?.year || ''}
                          onChange={(e) => setBranchData({
                            ...branchData,
                            viceChairman: { ...branchData.viceChairman, year: e.target.value }
                          })}
                          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                        />
                        <input
                          type="text"
                          placeholder="Department"
                          value={branchData.viceChairman?.department || ''}
                          onChange={(e) => setBranchData({
                            ...branchData,
                            viceChairman: { ...branchData.viceChairman, department: e.target.value }
                          })}
                          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Sub-Tab 4: Rosters & Members */}
            {branchSubTab === 'rosters' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                
                {/* Office Bearers List */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '15px', color: '#0a385b', fontWeight: '800', margin: 0 }}>Office Bearers List</h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          const colName = window.prompt("Enter new column name for Office Bearers:");
                          if (colName && colName.trim()) {
                            const customCols = branchData.officeBearersCustomCols ? [...branchData.officeBearersCustomCols] : [];
                            if (customCols.includes(colName.trim())) {
                              alert("Column already exists!");
                              return;
                            }
                            customCols.push(colName.trim());
                            setBranchData({ ...branchData, officeBearersCustomCols: customCols });
                          }
                        }}
                        style={{ padding: '6px 12px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#ffffff', color: '#475569' }}
                      >
                        + Add Column
                      </button>
                      <button
                        onClick={() => {
                          const officeBearers = branchData.officeBearers ? [...branchData.officeBearers] : [];
                          officeBearers.unshift({
                            name: "New Roster...",
                            position: "Secretary",
                            year: "III Year",
                            department: "ECE Department",
                            photo: "https://i.pravatar.cc/300?img=15",
                            ieeeMembershipNo: "",
                            customFields: {}
                          });
                          setBranchData({ ...branchData, officeBearers });
                        }}
                        style={{ padding: '6px 12px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', border: 'none', borderRadius: '4px', backgroundColor: '#e2fbe8', color: '#15803d' }}
                      >
                        + Add Office Bearer
                      </button>
                    </div>
                  </div>

                  <div style={{ maxHeight: '420px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                          <th style={{ padding: '12px', fontWeight: '700', color: '#0a385b' }}>Photo</th>
                          <th style={{ padding: '12px', fontWeight: '700', color: '#0a385b' }}>Name</th>
                          <th style={{ padding: '12px', fontWeight: '700', color: '#0a385b' }}>Position</th>
                          <th style={{ padding: '12px', fontWeight: '700', color: '#0a385b' }}>Year</th>
                          <th style={{ padding: '12px', fontWeight: '700', color: '#0a385b' }}>Department</th>
                          <th style={{ padding: '12px', fontWeight: '700', color: '#0a385b' }}>IEEE No</th>
                          {branchData.officeBearersCustomCols && branchData.officeBearersCustomCols.map((col, cIdx) => (
                            <th key={cIdx} style={{ padding: '12px', fontWeight: '700', color: '#0a385b' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {col}
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete the column "${col}"?`)) {
                                      const customCols = branchData.officeBearersCustomCols.filter(c => c !== col);
                                      const officeBearers = branchData.officeBearers.map(item => {
                                        const cleaned = { ...item };
                                        if (cleaned.customFields) {
                                          delete cleaned.customFields[col];
                                        }
                                        return cleaned;
                                      });
                                      setBranchData({ ...branchData, officeBearersCustomCols: customCols, officeBearers });
                                    }
                                  }}
                                  style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}
                                  title="Delete Column"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            </th>
                          ))}
                          <th style={{ padding: '12px', fontWeight: '700', color: '#0a385b', textAlign: 'center' }}>Remove</th>
                        </tr>
                      </thead>
                      <tbody>
                        {branchData.officeBearers && branchData.officeBearers.map((ob, index) => (
                          <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '8px 12px' }}>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <img src={ob.photo} alt={ob.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                        try {
                                          const base64 = await compressImage(file);
                                          const officeBearers = [...branchData.officeBearers];
                                          officeBearers[index].photo = base64;
                                          setBranchData({ ...branchData, officeBearers });
                                        } catch (err) {
                                          console.error(err);
                                        }
                                      }
                                    }}
                                    style={{ fontSize: '9px', width: '80px' }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '8px 12px' }}>
                              <input
                                type="text"
                                value={ob.name || ''}
                                onChange={(e) => {
                                  const officeBearers = [...branchData.officeBearers];
                                  officeBearers[index].name = e.target.value;
                                  setBranchData({ ...branchData, officeBearers });
                                }}
                                style={{ width: '90%', padding: '6px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                              />
                            </td>
                            <td style={{ padding: '8px 12px' }}>
                              <input
                                type="text"
                                value={ob.position || ''}
                                onChange={(e) => {
                                  const officeBearers = [...branchData.officeBearers];
                                  officeBearers[index].position = e.target.value;
                                  setBranchData({ ...branchData, officeBearers });
                                }}
                                style={{ width: '90%', padding: '6px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                              />
                            </td>
                            <td style={{ padding: '8px 12px' }}>
                              <input
                                type="text"
                                value={ob.year || ''}
                                onChange={(e) => {
                                  const officeBearers = [...branchData.officeBearers];
                                  officeBearers[index].year = e.target.value;
                                  setBranchData({ ...branchData, officeBearers });
                                }}
                                style={{ width: '80px', padding: '6px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                              />
                            </td>
                            <td style={{ padding: '8px 12px' }}>
                              <input
                                type="text"
                                value={ob.department || ''}
                                onChange={(e) => {
                                  const officeBearers = [...branchData.officeBearers];
                                  officeBearers[index].department = e.target.value;
                                  setBranchData({ ...branchData, officeBearers });
                                }}
                                style={{ width: '90%', padding: '6px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                              />
                            </td>
                            <td style={{ padding: '8px 12px' }}>
                              <input
                                type="text"
                                placeholder="IEEE Membership No"
                                value={ob.ieeeMembershipNo || ''}
                                onChange={(e) => {
                                  const officeBearers = [...branchData.officeBearers];
                                  officeBearers[index].ieeeMembershipNo = e.target.value;
                                  setBranchData({ ...branchData, officeBearers });
                                }}
                                style={{ width: '120px', padding: '6px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                              />
                            </td>
                            {branchData.officeBearersCustomCols && branchData.officeBearersCustomCols.map((col, cIdx) => (
                              <td key={cIdx} style={{ padding: '8px 12px' }}>
                                <input
                                  type="text"
                                  placeholder={col}
                                  value={(ob.customFields && ob.customFields[col]) || ''}
                                  onChange={(e) => {
                                    const officeBearers = [...branchData.officeBearers];
                                    if (!officeBearers[index].customFields) {
                                      officeBearers[index].customFields = {};
                                    }
                                    officeBearers[index].customFields[col] = e.target.value;
                                    setBranchData({ ...branchData, officeBearers });
                                  }}
                                  style={{ width: '90%', padding: '6px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                                />
                              </td>
                            ))}
                            <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                              <button
                                onClick={() => {
                                  const officeBearers = branchData.officeBearers.filter((_, i) => i !== index);
                                  setBranchData({ ...branchData, officeBearers });
                                }}
                                style={{ border: 'none', borderRadius: '4px', padding: '6px 8px', cursor: 'pointer', backgroundColor: '#fee2e2', color: '#ef4444' }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Committee Members List */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '15px', color: '#0a385b', fontWeight: '800', margin: 0 }}>Committee Members List</h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          const colName = window.prompt("Enter new column name for Committee Members:");
                          if (colName && colName.trim()) {
                            const customCols = branchData.membersCustomCols ? [...branchData.membersCustomCols] : [];
                            if (customCols.includes(colName.trim())) {
                              alert("Column already exists!");
                              return;
                            }
                            customCols.push(colName.trim());
                            setBranchData({ ...branchData, membersCustomCols: customCols });
                          }
                        }}
                        style={{ padding: '6px 12px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#ffffff', color: '#475569' }}
                      >
                        + Add Column
                      </button>
                      <button
                        onClick={() => {
                          const members = branchData.members ? [...branchData.members] : [];
                          members.unshift({
                            name: "New Member...",
                            year: "II Year",
                            department: "ECE Department",
                            photo: "https://i.pravatar.cc/300?img=22",
                            socials: { linkedin: "#", instagram: "#", facebook: "#" },
                            ieeeMembershipNo: "",
                            customFields: {}
                          });
                          setBranchData({ ...branchData, members });
                        }}
                        style={{ padding: '6px 12px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', border: 'none', borderRadius: '4px', backgroundColor: '#e2fbe8', color: '#15803d' }}
                      >
                        + Add Committee Member
                      </button>
                    </div>
                  </div>

                  <div style={{ maxHeight: '420px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                          <th style={{ padding: '12px', fontWeight: '700', color: '#0a385b' }}>Photo</th>
                          <th style={{ padding: '12px', fontWeight: '700', color: '#0a385b' }}>Name</th>
                          <th style={{ padding: '12px', fontWeight: '700', color: '#0a385b' }}>Year</th>
                          <th style={{ padding: '12px', fontWeight: '700', color: '#0a385b' }}>Department</th>
                          <th style={{ padding: '12px', fontWeight: '700', color: '#0a385b' }}>IEEE No</th>
                          {branchData.membersCustomCols && branchData.membersCustomCols.map((col, cIdx) => (
                            <th key={cIdx} style={{ padding: '12px', fontWeight: '700', color: '#0a385b' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {col}
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete the column "${col}"?`)) {
                                      const customCols = branchData.membersCustomCols.filter(c => c !== col);
                                      const members = branchData.members.map(item => {
                                        const cleaned = { ...item };
                                        if (cleaned.customFields) {
                                          delete cleaned.customFields[col];
                                        }
                                        return cleaned;
                                      });
                                      setBranchData({ ...branchData, membersCustomCols: customCols, members });
                                    }
                                  }}
                                  style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}
                                  title="Delete Column"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            </th>
                          ))}
                          <th style={{ padding: '12px', fontWeight: '700', color: '#0a385b' }}>Social Profiles (LN / IG / FB)</th>
                          <th style={{ padding: '12px', fontWeight: '700', color: '#0a385b', textAlign: 'center' }}>Remove</th>
                        </tr>
                      </thead>
                      <tbody>
                        {branchData.members && branchData.members.map((mem, index) => (
                          <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '8px 12px' }}>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <img src={mem.photo} alt={mem.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                      try {
                                        const base64 = await compressImage(file);
                                        const members = [...branchData.members];
                                        members[index].photo = base64;
                                        setBranchData({ ...branchData, members });
                                      } catch (err) {
                                        console.error(err);
                                      }
                                    }
                                  }}
                                  style={{ fontSize: '9px', width: '80px' }}
                                />
                              </div>
                            </td>
                            <td style={{ padding: '8px 12px' }}>
                              <input
                                type="text"
                                value={mem.name || ''}
                                onChange={(e) => {
                                  const members = [...branchData.members];
                                  members[index].name = e.target.value;
                                  setBranchData({ ...branchData, members });
                                }}
                                style={{ width: '90%', padding: '6px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                              />
                            </td>
                            <td style={{ padding: '8px 12px' }}>
                              <input
                                type="text"
                                value={mem.year || ''}
                                onChange={(e) => {
                                  const members = [...branchData.members];
                                  members[index].year = e.target.value;
                                  setBranchData({ ...branchData, members });
                                }}
                                style={{ width: '80px', padding: '6px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                              />
                            </td>
                            <td style={{ padding: '8px 12px' }}>
                              <input
                                type="text"
                                value={mem.department || ''}
                                onChange={(e) => {
                                  const members = [...branchData.members];
                                  members[index].department = e.target.value;
                                  setBranchData({ ...branchData, members });
                                }}
                                style={{ width: '90%', padding: '6px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                              />
                            </td>
                            <td style={{ padding: '8px 12px' }}>
                              <input
                                type="text"
                                placeholder="IEEE Membership No"
                                value={mem.ieeeMembershipNo || ''}
                                onChange={(e) => {
                                  const members = [...branchData.members];
                                  members[index].ieeeMembershipNo = e.target.value;
                                  setBranchData({ ...branchData, members });
                                }}
                                style={{ width: '120px', padding: '6px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                              />
                            </td>
                            {branchData.membersCustomCols && branchData.membersCustomCols.map((col, cIdx) => (
                              <td key={cIdx} style={{ padding: '8px 12px' }}>
                                <input
                                  type="text"
                                  placeholder={col}
                                  value={(mem.customFields && mem.customFields[col]) || ''}
                                  onChange={(e) => {
                                    const members = [...branchData.members];
                                    if (!members[index].customFields) {
                                      members[index].customFields = {};
                                    }
                                    members[index].customFields[col] = e.target.value;
                                    setBranchData({ ...branchData, members });
                                  }}
                                  style={{ width: '90%', padding: '6px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                                />
                              </td>
                            ))}
                            <td style={{ padding: '8px 12px' }}>
                              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                <input
                                  type="text"
                                  placeholder="LinkedIn"
                                  value={mem.socials?.linkedin || ''}
                                  onChange={(e) => {
                                    const members = [...branchData.members];
                                    members[index].socials = { ...members[index].socials, linkedin: e.target.value };
                                    setBranchData({ ...branchData, members });
                                  }}
                                  style={{ width: '90px', padding: '4px', fontSize: '11px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                                />
                                <input
                                  type="text"
                                  placeholder="Instagram"
                                  value={mem.socials?.instagram || ''}
                                  onChange={(e) => {
                                    const members = [...branchData.members];
                                    members[index].socials = { ...members[index].socials, instagram: e.target.value };
                                    setBranchData({ ...branchData, members });
                                  }}
                                  style={{ width: '90px', padding: '4px', fontSize: '11px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                                />
                                <input
                                  type="text"
                                  placeholder="Facebook"
                                  value={mem.socials?.facebook || ''}
                                  onChange={(e) => {
                                    const members = [...branchData.members];
                                    members[index].socials = { ...members[index].socials, facebook: e.target.value };
                                    setBranchData({ ...branchData, members });
                                  }}
                                  style={{ width: '90px', padding: '4px', fontSize: '11px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                                />
                              </div>
                            </td>
                            <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                              <button
                                onClick={() => {
                                  const members = branchData.members.filter((_, i) => i !== index);
                                  setBranchData({ ...branchData, members });
                                }}
                                style={{ border: 'none', borderRadius: '4px', padding: '6px 8px', cursor: 'pointer', backgroundColor: '#fee2e2', color: '#ef4444' }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* Sub-Tab 5: Gallery & Contact */}
            {branchSubTab === 'gallery-contact' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                
                {/* Masonry Gallery Manager */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h3 style={{ fontSize: '15px', color: '#0a385b', fontWeight: '800', margin: 0 }}>
                      Edit Gallery Photos ({branchData.gallery ? branchData.gallery.length : 0} items)
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        const gallery = branchData.gallery ? [...branchData.gallery] : [];
                        gallery.push({ url: '', caption: 'New Gallery Photo' });
                        setBranchData({ ...branchData, gallery });
                      }}
                      style={{
                        backgroundColor: '#02619a',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '12.5px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 5px rgba(2,97,154,0.2)'
                      }}
                    >
                      <Plus size={14} /> Add Gallery Photo
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {branchData.gallery && branchData.gallery.map((img, idx) => (
                      <div key={idx} style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ width: '80px', height: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#cbd5e1', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                          {img.url ? (
                            <img src={img.url} alt={`Gallery ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: '11px', color: '#475569' }}>No Image</span>
                          )}
                        </div>
                        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  try {
                                    const base64 = await compressImage(file);
                                    const gallery = [...branchData.gallery];
                                    gallery[idx].url = base64;
                                    setBranchData({ ...branchData, gallery });
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }
                              }}
                              style={{ fontSize: '10px', width: '130px' }}
                            />
                            <input
                              type="text"
                              placeholder="Photo URL"
                              value={img.url || ''}
                              onChange={(e) => {
                                const gallery = [...branchData.gallery];
                                gallery[idx].url = e.target.value;
                                setBranchData({ ...branchData, gallery });
                              }}
                              style={{ flexGrow: 1, padding: '4px 6px', fontSize: '11px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="Caption / Description"
                            value={img.caption || ''}
                            onChange={(e) => {
                              const gallery = [...branchData.gallery];
                              gallery[idx].caption = e.target.value;
                              setBranchData({ ...branchData, gallery });
                            }}
                            style={{ padding: '6px 10px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const gallery = branchData.gallery.filter((_, i) => i !== idx);
                            setBranchData({ ...branchData, gallery });
                          }}
                          style={{
                            padding: '8px',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            backgroundColor: '#fee2e2',
                            color: '#ef4444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                          title="Delete Photo"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Coordinates */}
                <div>
                  <h3 style={{ fontSize: '15px', color: '#0a385b', fontWeight: '800', borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginBottom: '14px' }}>Contact Coordinates & Social Portals</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Email Address:</label>
                      <input
                        type="email"
                        value={branchData.contact?.email || ''}
                        onChange={(e) => setBranchData({
                          ...branchData,
                          contact: { ...branchData.contact, email: e.target.value }
                        })}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Phone Number:</label>
                      <input
                        type="text"
                        value={branchData.contact?.phone || ''}
                        onChange={(e) => setBranchData({
                          ...branchData,
                          contact: { ...branchData.contact, phone: e.target.value }
                        })}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Physical Office Location:</label>
                    <input
                      type="text"
                      value={branchData.contact?.location || ''}
                      onChange={(e) => setBranchData({
                        ...branchData,
                        contact: { ...branchData.contact, location: e.target.value }
                      })}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>LinkedIn:</label>
                      <input
                        type="text"
                        value={branchData.contact?.socials?.linkedin || ''}
                        onChange={(e) => setBranchData({
                          ...branchData,
                          contact: {
                            ...branchData.contact,
                            socials: { ...branchData.contact.socials, linkedin: e.target.value }
                          }
                        })}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Instagram:</label>
                      <input
                        type="text"
                        value={branchData.contact?.socials?.instagram || ''}
                        onChange={(e) => setBranchData({
                          ...branchData,
                          contact: {
                            ...branchData.contact,
                            socials: { ...branchData.contact.socials, instagram: e.target.value }
                          }
                        })}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Facebook:</label>
                      <input
                        type="text"
                        value={branchData.contact?.socials?.facebook || ''}
                        onChange={(e) => setBranchData({
                          ...branchData,
                          contact: {
                            ...branchData.contact,
                            socials: { ...branchData.contact.socials, facebook: e.target.value }
                          }
                        })}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Official Website:</label>
                      <input
                        type="text"
                        value={branchData.contact?.socials?.website || ''}
                        onChange={(e) => setBranchData({
                          ...branchData,
                          contact: {
                            ...branchData.contact,
                            socials: { ...branchData.contact.socials, website: e.target.value }
                          }
                        })}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Sub-Tab 6: Milestones & Achievements */}
            {branchSubTab === 'milestones' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h3 style={{ fontSize: '15px', color: '#0a385b', fontWeight: '800', margin: 0 }}>
                      Edit Milestones & Achievements ({branchData.milestones ? branchData.milestones.length : 0} items)
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        const milestones = branchData.milestones ? [...branchData.milestones] : [];
                        milestones.push({ title: 'New Milestone', date: '2026', description: 'Describe the milestone achievement here.', image: '' });
                        setBranchData({ ...branchData, milestones });
                      }}
                      style={{
                        backgroundColor: '#02619a',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '12.5px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 5px rgba(2,97,154,0.2)'
                      }}
                    >
                      <Plus size={14} /> Add Milestone
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                    {branchData.milestones && branchData.milestones.map((ms, idx) => (
                      <div key={idx} style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        <div style={{ width: '100px', height: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#cbd5e1', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                          {ms.image ? (
                            <img src={ms.image} alt={`Milestone ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: '11px', color: '#475569' }}>No Image</span>
                          )}
                        </div>
                        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '11px', fontWeight: '750', color: '#475569', marginBottom: '4px' }}>Milestone Title:</label>
                              <input
                                type="text"
                                placeholder="Milestone Title"
                                value={ms.title || ''}
                                onChange={(e) => {
                                  const milestones = [...branchData.milestones];
                                  milestones[idx].title = e.target.value;
                                  setBranchData({ ...branchData, milestones });
                                }}
                                style={{ width: '100%', padding: '6px 10px', fontSize: '13px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '11px', fontWeight: '750', color: '#475569', marginBottom: '4px' }}>Date / Year:</label>
                              <input
                                type="text"
                                placeholder="Date / Year (e.g. 2026)"
                                value={ms.date || ''}
                                onChange={(e) => {
                                  const milestones = [...branchData.milestones];
                                  milestones[idx].date = e.target.value;
                                  setBranchData({ ...branchData, milestones });
                                }}
                                style={{ width: '100%', padding: '6px 10px', fontSize: '13px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                              />
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '11px', fontWeight: '750', color: '#475569', marginBottom: '4px' }}>Upload Cover Image:</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    try {
                                      const base64 = await compressImage(file);
                                      const milestones = [...branchData.milestones];
                                      milestones[idx].image = base64;
                                      setBranchData({ ...branchData, milestones });
                                    } catch (err) {
                                      console.error(err);
                                    }
                                  }
                                }}
                                style={{ fontSize: '11px', width: '100%' }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '11px', fontWeight: '750', color: '#475569', marginBottom: '4px' }}>Or Paste Image URL:</label>
                              <input
                                type="text"
                                placeholder="Image URL"
                                value={ms.image || ''}
                                onChange={(e) => {
                                  const milestones = [...branchData.milestones];
                                  milestones[idx].image = e.target.value;
                                  setBranchData({ ...branchData, milestones });
                                }}
                                style={{ width: '100%', padding: '6px 10px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                              />
                            </div>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '750', color: '#475569', marginBottom: '4px' }}>Description:</label>
                            <textarea
                              rows="2"
                              placeholder="Description of the milestone..."
                              value={ms.description || ''}
                              onChange={(e) => {
                                const milestones = [...branchData.milestones];
                                milestones[idx].description = e.target.value;
                                setBranchData({ ...branchData, milestones });
                              }}
                              style={{ width: '100%', padding: '8px 10px', fontSize: '13px', borderRadius: '4px', border: '1px solid #cbd5e1', resize: 'vertical' }}
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const milestones = branchData.milestones.filter((_, i) => i !== idx);
                            setBranchData({ ...branchData, milestones });
                          }}
                          style={{
                            padding: '8px',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            backgroundColor: '#fee2e2',
                            color: '#ef4444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            flexShrink: 0
                          }}
                          title="Delete Milestone"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 6: Operational Committees */}
        {activeTab === 'committees' && (
          <div className="animate-fade-in card" style={{ padding: '36px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
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

            {/* Committees Philosophy & CTA Editor */}
            <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                <h3 style={{ fontSize: '15px', color: '#0a385b', fontWeight: '800', margin: 0 }}>Committees Volunteer Philosophy & Recruitment CTA</h3>
                <button
                  type="button"
                  onClick={() => {
                    settingsService.set('ieee_committees_philosophy_v1', JSON.stringify(committeesPhilosophy));
                    settingsService.set('ieee_committees_cta_v1', JSON.stringify(committeesCta));
                    alert("Committees philosophy & CTA saved successfully!");
                  }}
                  style={{ padding: '6px 14px', fontSize: '12px', fontWeight: '750', cursor: 'pointer', border: 'none', borderRadius: '4px', backgroundColor: '#e0f2fe', color: '#0369a1' }}
                >
                  Save Philosophy & CTA
                </button>
              </div>

              {/* Philosophy block */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Philosophy Title:</label>
                  <input
                    type="text"
                    value={committeesPhilosophy?.title || ''}
                    onChange={(e) => setCommitteesPhilosophy({ ...committeesPhilosophy, title: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Philosophy Text:</label>
                  <textarea
                    rows="2"
                    value={committeesPhilosophy?.text || ''}
                    onChange={(e) => setCommitteesPhilosophy({ ...committeesPhilosophy, text: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontFamily: 'inherit' }}
                  />
                </div>
              </div>

              {/* CTA block */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <h4 style={{ fontSize: '13.5px', color: '#0a385b', fontWeight: '800', margin: '0 0 12px 0' }}>Recruitment Call-To-Action</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>CTA Title:</label>
                    <input
                      type="text"
                      value={committeesCta?.title || ''}
                      onChange={(e) => setCommitteesCta({ ...committeesCta, title: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>CTA Text:</label>
                    <textarea
                      rows="2"
                      value={committeesCta?.text || ''}
                      onChange={(e) => setCommitteesCta({ ...committeesCta, text: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontFamily: 'inherit' }}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Btn 1 Text:</label>
                    <input
                      type="text"
                      value={committeesCta?.btnText || ''}
                      onChange={(e) => setCommitteesCta({ ...committeesCta, btnText: e.target.value })}
                      style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Btn 1 Link:</label>
                    <input
                      type="text"
                      value={committeesCta?.btnLink || ''}
                      onChange={(e) => setCommitteesCta({ ...committeesCta, btnLink: e.target.value })}
                      style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Btn 2 Text:</label>
                    <input
                      type="text"
                      value={committeesCta?.btnMailText || ''}
                      onChange={(e) => setCommitteesCta({ ...committeesCta, btnMailText: e.target.value })}
                      style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Btn 2 Link:</label>
                    <input
                      type="text"
                      value={committeesCta?.btnMailLink || ''}
                      onChange={(e) => setCommitteesCta({ ...committeesCta, btnMailLink: e.target.value })}
                      style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>
              </div>
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
                    {committees.map((item, idx) => {
                      const isEditing = editingCommitteeId === item.id;
                      return (
                        <tr key={item.id} style={{ borderBottom: idx < committees.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                          {isEditing ? (
                            <>
                              <td style={{ padding: '16px 20px', verticalAlign: 'top', minWidth: '180px' }}>
                                <input
                                  type="text"
                                  value={commName}
                                  onChange={(e) => setCommName(e.target.value)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', marginBottom: '6px' }}
                                  placeholder="Name"
                                />
                                <textarea
                                  value={commDesc}
                                  onChange={(e) => setCommDesc(e.target.value)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', fontFamily: 'inherit', resize: 'vertical' }}
                                  rows="2"
                                  placeholder="Description"
                                />
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                                <input
                                  type="text"
                                  value={commLead}
                                  onChange={(e) => setCommLead(e.target.value)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }}
                                  placeholder="Lead"
                                />
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                                <input
                                  type="text"
                                  value={commCoLead}
                                  onChange={(e) => setCommCoLead(e.target.value)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }}
                                  placeholder="Co-Lead"
                                />
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'top', textAlign: 'center' }}>
                                <input
                                  type="number"
                                  value={commTeamCount}
                                  onChange={(e) => setCommTeamCount(e.target.value)}
                                  style={{ width: '80px', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', textAlign: 'center' }}
                                  placeholder="Volunteers"
                                />
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'middle', textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                  <button
                                    onClick={() => saveInlineCommittee(item.id)}
                                    style={{ backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingCommitteeId(null)}
                                    style={{ backgroundColor: '#64748b', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td style={{ padding: '16px 20px', fontWeight: '600', color: '#0a385b', verticalAlign: 'middle', minWidth: '180px' }}>
                                <div>{item.name}</div>
                                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'normal', marginTop: '4px' }}>{item.desc}</div>
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
                                    onClick={() => startInlineEditCommittee(item)}
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
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: News Clippings Management */}
        {activeTab === 'news' && (
          <div className="animate-fade-in card" style={{ padding: '36px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
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
                  <div style={{ height: '100px', background: news.image ? 'none' : `linear-gradient(135deg, ${news.color} 0%, ${news.color}dd 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                    {news.image ? (
                      <img src={news.image} alt={news.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <>
                        <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.15)', position: 'absolute', right: '-15px', top: '-15px' }} />
                        <FileText size={40} color="#ffffff" style={{ opacity: 0.9 }} />
                      </>
                    )}
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
          <div className="animate-fade-in card" style={{ padding: '36px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '20px', color: '#0a385b', fontWeight: '800' }}>Research Papers & Projects Repository</h2>
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
                <p style={{ fontSize: '15px', fontWeight: '600' }}>No research papers or projects added yet</p>
                <p style={{ fontSize: '13px', marginTop: '8px' }}>Click "Add Item" to submit student research work or projects</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 8: Impact Stats Panel */}
        {activeTab === 'impact_stats' && (
          <div className="animate-fade-in card" style={{ padding: '36px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '20px', color: '#0a385b', fontWeight: '800' }}>Manage Our Impact in Numbers</h2>
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>Add, edit, reorder, or delete the statistics displayed on the homepage.</p>
              </div>
            </div>

            {/* Inline Add Form */}
            <form onSubmit={handleAddImpact} style={{ display: 'flex', gap: '12px', marginBottom: '24px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '150px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px' }}>Stat Value (e.g., 45+)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 500+"
                  value={newImpactValue}
                  onChange={(e) => setNewImpactValue(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                />
              </div>
              <div style={{ flex: 2, minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px' }}>Stat Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Active Volunteers"
                  value={newImpactLabel}
                  onChange={(e) => setNewImpactLabel(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                />
              </div>
              <button
                type="submit"
                style={{ padding: '8px 20px', backgroundColor: '#02619a', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', height: '38px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={16} /> Add Stat
              </button>
            </form>

            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '80px', textAlign: 'center' }}>Order</th>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '150px' }}>Value</th>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b' }}>Label</th>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', textAlign: 'center', width: '180px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {impactStats.map((item, idx) => {
                      const isEditing = editingImpactId === item.id;
                      return (
                        <tr key={item.id} style={{ borderBottom: idx < impactStats.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                          <td style={{ padding: '16px 20px', textAlign: 'center', verticalAlign: 'middle' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveImpactUp(idx)}
                                style={{ border: 'none', background: 'transparent', color: idx === 0 ? '#cbd5e1' : '#02619a', cursor: idx === 0 ? 'not-allowed' : 'pointer', padding: '2px' }}
                              >
                                <ArrowUp size={16} />
                              </button>
                              <button
                                type="button"
                                disabled={idx === impactStats.length - 1}
                                onClick={() => handleMoveImpactDown(idx)}
                                style={{ border: 'none', background: 'transparent', color: idx === impactStats.length - 1 ? '#cbd5e1' : '#02619a', cursor: idx === impactStats.length - 1 ? 'not-allowed' : 'pointer', padding: '2px' }}
                              >
                                <ArrowDown size={16} />
                              </button>
                            </div>
                          </td>
                          {isEditing ? (
                            <>
                              <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                                <input
                                  type="text"
                                  value={impactValueInput}
                                  onChange={(e) => setImpactValueInput(e.target.value)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                                />
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                                <input
                                  type="text"
                                  value={impactLabelInput}
                                  onChange={(e) => setImpactLabelInput(e.target.value)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                                />
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'middle', textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                  <button
                                    onClick={() => saveInlineImpact(item.id)}
                                    style={{ backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingImpactId(null)}
                                    style={{ backgroundColor: '#64748b', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td style={{ padding: '16px 20px', verticalAlign: 'middle', fontWeight: '700', color: 'var(--secondary)' }}>
                                {item.value}
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'middle', color: '#0a385b', fontWeight: '600' }}>
                                {item.label}
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'middle', textAlign: 'center' }}>
                                <div style={{ display: 'inline-flex', gap: '8px' }}>
                                  <button
                                    onClick={() => startInlineEditImpact(item)}
                                    style={{ color: '#02619a', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '4px', padding: '6px', cursor: 'pointer' }}
                                    className="action-btn-hover-edit"
                                  >
                                    <Edit3 size={15} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteImpact(item.id)}
                                    style={{ color: '#ef4444', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '4px', padding: '6px', cursor: 'pointer' }}
                                    className="action-btn-hover-delete"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            {impactStats.length === 0 && (
              <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', marginTop: '16px' }}>No impact stats configured.</p>
            )}
          </div>
        )}

        {/* Tab 9: Testimonials Panel */}
        {activeTab === 'testimonials' && (
          <div className="animate-fade-in card" style={{ padding: '36px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '20px', color: '#0a385b', fontWeight: '800' }}>Manage Member Testimonials</h2>
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>Configure reviews and testimonials shown on the member slider.</p>
              </div>
            </div>

            {/* Inline Add Form */}
            <form onSubmit={handleAddTestimonial} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px' }}>Testimonial Quote</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Enter the testimonial quote here..."
                  value={newTestimonialText}
                  onChange={(e) => setNewTestimonialText(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px' }}>Author Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Rajesh Kumar"
                    value={newTestimonialAuthor}
                    onChange={(e) => setNewTestimonialAuthor(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px' }}>Role / Designation</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., IEEE Student Chair"
                    value={newTestimonialRole}
                    onChange={(e) => setNewTestimonialRole(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', backgroundColor: '#02619a', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={16} /> Add Testimonial
                </button>
              </div>
            </form>

            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '45%' }}>Quote Text</th>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '20%' }}>Author</th>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '20%' }}>Role</th>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', textAlign: 'center', width: '15%' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testimonials.map((item, idx) => {
                      const isEditing = editingTestimonialId === item.id;
                      return (
                        <tr key={item.id} style={{ borderBottom: idx < testimonials.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                          {isEditing ? (
                            <>
                              <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                                <textarea
                                  value={testimonialTextInput}
                                  onChange={(e) => setTestimonialTextInput(e.target.value)}
                                  rows="2"
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px', resize: 'vertical', fontFamily: 'inherit' }}
                                />
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                                <input
                                  type="text"
                                  value={testimonialAuthorInput}
                                  onChange={(e) => setTestimonialAuthorInput(e.target.value)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                                />
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                                <input
                                  type="text"
                                  value={testimonialRoleInput}
                                  onChange={(e) => setTestimonialRoleInput(e.target.value)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                                />
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'middle', textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                  <button
                                    onClick={() => saveInlineTestimonial(item.id)}
                                    style={{ backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingTestimonialId(null)}
                                    style={{ backgroundColor: '#64748b', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td style={{ padding: '16px 20px', verticalAlign: 'middle', color: '#475569', fontSize: '13px', lineHeight: '1.4' }}>
                                "{item.text}"
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'middle', fontWeight: '700', color: '#0a385b' }}>
                                {item.author}
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'middle', color: 'var(--secondary)', fontWeight: '600' }}>
                                {item.role}
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'middle', textAlign: 'center' }}>
                                <div style={{ display: 'inline-flex', gap: '8px' }}>
                                  <button
                                    onClick={() => startInlineEditTestimonial(item)}
                                    style={{ color: '#02619a', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '4px', padding: '6px', cursor: 'pointer' }}
                                    className="action-btn-hover-edit"
                                  >
                                    <Edit3 size={15} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTestimonial(item.id)}
                                    style={{ color: '#ef4444', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '4px', padding: '6px', cursor: 'pointer' }}
                                    className="action-btn-hover-delete"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            {testimonials.length === 0 && (
              <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', marginTop: '16px' }}>No testimonials configured.</p>
            )}
          </div>
        )}

        {/* Tab 10: Documents Repository Panel */}
        {activeTab === 'documents' && (
          <div className="animate-fade-in card" style={{ padding: '36px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '20px', color: '#0a385b', fontWeight: '800' }}>Manage Documents Repository</h2>
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>Configure the Google Drive connected folder, sync files, and customize details like featured sorting, visibility, and categories.</p>
              </div>
            </div>

            {/* Google Drive Configuration Card */}
            <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '16px', color: '#0a385b', fontWeight: '750', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings size={18} /> Google Drive Settings
              </h3>
              
              <form onSubmit={handleSaveDriveUrl} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#0a385b', marginBottom: '8px' }}>Connected Google Drive Folder Link</label>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      required
                      placeholder="e.g., https://drive.google.com/drive/folders/1mdrfLwOWprcKEB5PbK6BhWgv1MrrSE-m"
                      value={driveFolderUrl}
                      onChange={(e) => setDriveFolderUrl(e.target.value)}
                      style={{ flex: 1, minWidth: '300px', padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="submit"
                        style={{ padding: '10px 20px', backgroundColor: '#02619a', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                      >
                        Save Link
                      </button>
                      <button
                        type="button"
                        onClick={handleValidateLink}
                        style={{ padding: '10px 20px', backgroundColor: '#64748b', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                      >
                        Validate Link
                      </button>
                      <button
                        type="button"
                        disabled={isSyncing}
                        onClick={handleSyncDocuments}
                        style={{
                          padding: '10px 20px',
                          backgroundColor: '#10b981',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          opacity: isSyncing ? 0.7 : 1
                        }}
                      >
                        <RefreshCw size={14} className={isSyncing ? 'spin-anim' : ''} /> {isSyncing ? 'Syncing...' : 'Sync Documents'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Validation Status message */}
              {validationMessage && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px 16px',
                  backgroundColor: isLinkValid ? '#f0fdf4' : '#fef2f2',
                  color: isLinkValid ? '#15803d' : '#b91c1c',
                  border: `1px solid ${isLinkValid ? '#bbf7d0' : '#fca5a5'}`,
                  borderRadius: '8px',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {isLinkValid ? <Check size={16} /> : <AlertCircle size={16} />}
                  {validationMessage}
                </div>
              )}

              {/* Sync message */}
              {syncMessage && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px 16px',
                  backgroundColor: syncMessage.startsWith('Error') ? '#fef2f2' : '#f0fdf4',
                  color: syncMessage.startsWith('Error') ? '#b91c1c' : '#15803d',
                  border: `1px solid ${syncMessage.startsWith('Error') ? '#fca5a5' : '#bbf7d0'}`,
                  borderRadius: '8px',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {syncMessage.startsWith('Error') ? <AlertCircle size={16} /> : <Check size={16} />}
                  {syncMessage}
                </div>
              )}
            </div>

            {/* Documents List Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', color: '#0a385b', fontWeight: '750', margin: 0 }}>Documents List</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => toggleAllConfidentialDocs(true)}
                  style={{ padding: '6px 12px', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Lock size={12} /> Mark All Confidential
                </button>
                <button
                  type="button"
                  onClick={() => toggleAllConfidentialDocs(false)}
                  style={{ padding: '6px 12px', backgroundColor: '#64748b', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Unlock size={12} /> Unmark All
                </button>
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '25%' }}>Document Info</th>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '15%' }}>Category</th>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '25%' }}>Description</th>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', textAlign: 'center', width: '10%' }}>Visibility</th>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', textAlign: 'center', width: '10%' }}>Featured</th>
                      <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', textAlign: 'center', width: '15%' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((item, idx) => {
                      const isEditing = editingDocId === item.id;
                      const featuredList = documents.filter(d => d.isFeatured).sort((a, b) => a.featuredOrder - b.featuredOrder);
                      const featuredIdx = featuredList.findIndex(f => f.id === item.id);
                      
                      return (
                        <tr key={item.id} style={{ borderBottom: idx < documents.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                          {isEditing ? (
                            <>
                              {/* Edit Mode */}
                              <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                                <input
                                  type="text"
                                  value={docTitleInput}
                                  onChange={(e) => setDocTitleInput(e.target.value)}
                                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', marginBottom: '6px', outline: 'none' }}
                                  placeholder="Document Title"
                                />
                                <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>File: {item.name}</span>
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                                <select
                                  value={docCategoryInput}
                                  onChange={(e) => setDocCategoryInput(e.target.value)}
                                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', backgroundColor: '#ffffff' }}
                                >
                                  <option value="IEEE Forms">IEEE Forms</option>
                                  <option value="Membership Documents">Membership Documents</option>
                                  <option value="Event Resources">Event Resources</option>
                                  <option value="Workshop Materials">Workshop Materials</option>
                                  <option value="Reports">Reports</option>
                                  <option value="Certificates">Certificates</option>
                                  <option value="Others">Others</option>
                                </select>
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'top' }} colSpan={3}>
                                <textarea
                                  value={docDescInput}
                                  onChange={(e) => setDocDescInput(e.target.value)}
                                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', marginBottom: '8px' }}
                                  rows="2"
                                  placeholder="Optional description"
                                />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <input
                                    type="checkbox"
                                    id={`confidential-doc-${item.id}`}
                                    checked={docConfidentialInput}
                                    onChange={(e) => setDocConfidentialInput(e.target.checked)}
                                    style={{ cursor: 'pointer' }}
                                  />
                                  <label htmlFor={`confidential-doc-${item.id}`} style={{ fontSize: '12px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}>
                                    Requires Access PIN (Confidential)
                                  </label>
                                </div>
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'middle', textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                  <button
                                    onClick={() => saveInlineDoc(item.id)}
                                    style={{ backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingDocId(null)}
                                    style={{ backgroundColor: '#64748b', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              {/* Display Mode */}
                              <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                                <div style={{ fontWeight: '700', color: '#0a385b', fontSize: '14.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  {item.title}
                                  {item.is_confidential && <Lock size={14} color="#ef4444" />}
                                </div>
                                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', wordBreak: 'break-all' }}>{item.name}</div>
                                <div style={{ display: 'flex', gap: '8px', marginTop: '6px', alignItems: 'center' }}>
                                  <span style={{ fontSize: '10px', backgroundColor: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', color: '#475569', fontWeight: '600' }}>{item.size}</span>
                                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>Synced: {item.uploadDate}</span>
                                </div>
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                                <span style={{
                                  fontSize: '11.5px',
                                  fontWeight: '700',
                                  padding: '4px 10px',
                                  borderRadius: '20px',
                                  color: '#0369a1',
                                  backgroundColor: '#f0f9ff',
                                  border: '1px solid #bae6fd',
                                  display: 'inline-block'
                                }}>
                                  {item.category}
                                </span>
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'middle', color: '#475569', fontSize: '13px', lineHeight: '1.4' }}>
                                {item.description || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No description</span>}
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'middle', textAlign: 'center' }}>
                                <button
                                  type="button"
                                  onClick={() => toggleDocVisibility(item.id)}
                                  style={{
                                    border: 'none',
                                    borderRadius: '20px',
                                    padding: '4px 12px',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    backgroundColor: item.isVisible ? '#dcfce7' : '#f3f4f6',
                                    color: item.isVisible ? '#15803d' : '#4b5563'
                                  }}
                                >
                                  {item.isVisible ? 'Show' : 'Hide'}
                                </button>
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'middle', textAlign: 'center' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                  <input
                                    type="checkbox"
                                    checked={item.isFeatured || false}
                                    onChange={() => toggleDocFeatured(item.id)}
                                    style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                                  />
                                  {item.isFeatured && (
                                    <div style={{ display: 'flex', gap: '2px' }}>
                                      <button
                                        disabled={featuredIdx === 0}
                                        onClick={() => moveDocFeatured(item.id, 'up')}
                                        style={{ border: 'none', background: 'transparent', padding: '2px', cursor: featuredIdx === 0 ? 'default' : 'pointer', color: featuredIdx === 0 ? '#cbd5e1' : '#02619a' }}
                                        title="Move featured order up"
                                      >
                                        <ArrowUp size={14} />
                                      </button>
                                      <button
                                        disabled={featuredIdx === featuredList.length - 1}
                                        onClick={() => moveDocFeatured(item.id, 'down')}
                                        style={{ border: 'none', background: 'transparent', padding: '2px', cursor: featuredIdx === featuredList.length - 1 ? 'default' : 'pointer', color: featuredIdx === featuredList.length - 1 ? '#cbd5e1' : '#02619a' }}
                                        title="Move featured order down"
                                      >
                                        <ArrowDown size={14} />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td style={{ padding: '16px 20px', verticalAlign: 'middle', textAlign: 'center' }}>
                                <button
                                  onClick={() => startInlineEditDoc(item)}
                                  style={{ color: '#02619a', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '4px', padding: '6px', cursor: 'pointer' }}
                                  className="action-btn-hover-edit"
                                  title="Edit document properties"
                                >
                                  <Edit3 size={15} />
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            {documents.length === 0 && (
              <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', marginTop: '24px', fontStyle: 'italic' }}>
                No documents synced yet. Connect a Google Drive folder and click "Sync Documents" above.
              </p>
            )}
          </div>
        )}

        {/* Tab: About KEC SB Page Editor */}
        {activeTab === 'about_kec_sb' && aboutKecSb && (
          <div className="animate-fade-in card" style={{ padding: '36px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '20px', color: '#0a385b', fontWeight: '800' }}>Manage About KEC SB Page</h2>
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>Customize the Who We Are introductions, Glance Statistics counters, Journey Milestones, Impact Cards, and recruitment CTA banners.</p>
              </div>
              <button
                onClick={() => {
                  settingsService.set('ieee_about_kec_sb_v1', JSON.stringify(aboutKecSb));
                  setAboutSaved(true);
                  setTimeout(() => setAboutSaved(false), 3000);
                }}
                style={{
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '30px',
                  padding: '10px 22px',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(16,185,129,0.25)'
                }}
              >
                <Save size={15} /> Save Page Content
              </button>
            </div>

            {aboutSaved && (
              <div style={{ padding: '12px 16px', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '8px', fontSize: '14px', fontWeight: '600', marginBottom: '24px', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={16} /> About Page settings saved successfully!
              </div>
            )}

            {/* Who We Are Sub-block */}
            <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', color: '#0a385b', fontWeight: '800', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Who We Are Overview</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Section Title:</label>
                  <input
                    type="text"
                    value={aboutKecSb.whoWeAre.title}
                    onChange={(e) => setAboutKecSb({
                      ...aboutKecSb,
                      whoWeAre: { ...aboutKecSb.whoWeAre, title: e.target.value }
                    })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Primary Introduction Text:</label>
                  <textarea
                    rows="4"
                    value={aboutKecSb.whoWeAre.intro}
                    onChange={(e) => setAboutKecSb({
                      ...aboutKecSb,
                      whoWeAre: { ...aboutKecSb.whoWeAre, intro: e.target.value }
                    })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontFamily: 'inherit' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Secondary Introduction Text:</label>
                  <textarea
                    rows="3"
                    value={aboutKecSb.whoWeAre.introSecondary}
                    onChange={(e) => setAboutKecSb({
                      ...aboutKecSb,
                      whoWeAre: { ...aboutKecSb.whoWeAre, introSecondary: e.target.value }
                    })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontFamily: 'inherit' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Mission statement:</label>
                    <textarea
                      rows="3"
                      value={aboutKecSb.whoWeAre.mission}
                      onChange={(e) => setAboutKecSb({
                        ...aboutKecSb,
                        whoWeAre: { ...aboutKecSb.whoWeAre, mission: e.target.value }
                      })}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontFamily: 'inherit' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Vision statement:</label>
                    <textarea
                      rows="3"
                      value={aboutKecSb.whoWeAre.vision}
                      onChange={(e) => setAboutKecSb({
                        ...aboutKecSb,
                        whoWeAre: { ...aboutKecSb.whoWeAre, vision: e.target.value }
                      })}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontFamily: 'inherit' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Glance Statistics */}
            <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', color: '#0a385b', fontWeight: '800', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>At a Glance Statistics</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                {aboutKecSb.stats.map((stat, idx) => (
                  <div key={idx} style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Label:</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        const stats = [...aboutKecSb.stats];
                        stats[idx].label = e.target.value;
                        setAboutKecSb({ ...aboutKecSb, stats });
                      }}
                      style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', marginBottom: '8px' }}
                    />
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Value (e.g. 120+):</label>
                    <input
                      type="text"
                      value={stat.count}
                      onChange={(e) => {
                        const stats = [...aboutKecSb.stats];
                        stats[idx].count = e.target.value;
                        setAboutKecSb({ ...aboutKecSb, stats });
                      }}
                      style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Journey Timeline */}
            <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                <h3 style={{ fontSize: '16px', color: '#0a385b', fontWeight: '800', margin: 0 }}>Journey Timeline Milestones</h3>
                <button
                  onClick={() => {
                    const timeline = [...aboutKecSb.timeline];
                    timeline.push({ year: '2026', title: 'New Milestone', desc: '' });
                    setAboutKecSb({ ...aboutKecSb, timeline });
                  }}
                  style={{ padding: '4px 10px', fontSize: '11.5px', fontWeight: '700', cursor: 'pointer', border: 'none', borderRadius: '4px', backgroundColor: '#e2fbe8', color: '#15803d' }}
                >
                  + Add Milestone
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {aboutKecSb.timeline.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '12px', backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1', position: 'relative' }}>
                    <div style={{ width: '80px', flexShrink: 0 }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Year:</label>
                      <input
                        type="text"
                        value={item.year}
                        onChange={(e) => {
                          const timeline = [...aboutKecSb.timeline];
                          timeline[idx].year = e.target.value;
                          setAboutKecSb({ ...aboutKecSb, timeline });
                        }}
                        style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Milestone Title:</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const timeline = [...aboutKecSb.timeline];
                          timeline[idx].title = e.target.value;
                          setAboutKecSb({ ...aboutKecSb, timeline });
                        }}
                        style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', marginBottom: '8px' }}
                      />
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Description:</label>
                      <textarea
                        rows="2"
                        value={item.desc}
                        onChange={(e) => {
                          const timeline = [...aboutKecSb.timeline];
                          timeline[idx].desc = e.target.value;
                          setAboutKecSb({ ...aboutKecSb, timeline });
                        }}
                        style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                      />
                    </div>
                    <button
                      onClick={() => {
                        const timeline = aboutKecSb.timeline.filter((_, i) => i !== idx);
                        setAboutKecSb({ ...aboutKecSb, timeline });
                      }}
                      style={{ alignSelf: 'start', padding: '8px', border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#fee2e2', color: '#ef4444' }}
                      title="Delete Milestone"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Areas */}
            <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', color: '#0a385b', fontWeight: '800', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Branch Impact Cards</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {aboutKecSb.impact.map((imp, idx) => (
                  <div key={idx} style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', marginBottom: '8px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Title:</label>
                        <input
                          type="text"
                          value={imp.title}
                          onChange={(e) => {
                            const impact = [...aboutKecSb.impact];
                            impact[idx].title = e.target.value;
                            setAboutKecSb({ ...aboutKecSb, impact });
                          }}
                          style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Icon:</label>
                        <select
                          value={imp.icon || 'Cpu'}
                          onChange={(e) => {
                            const impact = [...aboutKecSb.impact];
                            impact[idx].icon = e.target.value;
                            setAboutKecSb({ ...aboutKecSb, impact });
                          }}
                          style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff' }}
                        >
                          {['Cpu', 'Target', 'Heart', 'Users', 'BookOpen', 'Globe', 'Award'].map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Description:</label>
                    <textarea
                      rows="2"
                      value={imp.desc}
                      onChange={(e) => {
                        const impact = [...aboutKecSb.impact];
                        impact[idx].desc = e.target.value;
                        setAboutKecSb({ ...aboutKecSb, impact });
                      }}
                      style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', resize: 'vertical', fontFamily: 'inherit' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Why Join IEEE Benefits */}
            <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', color: '#0a385b', fontWeight: '800', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Why Join IEEE Perks</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {aboutKecSb.whyJoin.map((item, idx) => (
                  <div key={idx} style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Perk Title:</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const whyJoin = [...aboutKecSb.whyJoin];
                        whyJoin[idx].title = e.target.value;
                        setAboutKecSb({ ...aboutKecSb, whyJoin });
                      }}
                      style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', marginBottom: '8px' }}
                    />
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Description:</label>
                    <textarea
                      rows="2"
                      value={item.desc}
                      onChange={(e) => {
                        const whyJoin = [...aboutKecSb.whyJoin];
                        whyJoin[idx].desc = e.target.value;
                        setAboutKecSb({ ...aboutKecSb, whyJoin });
                      }}
                      style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', resize: 'vertical', fontFamily: 'inherit' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Banner */}
            <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
              <h3 style={{ fontSize: '16px', color: '#0a385b', fontWeight: '800', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Registration CTA Banner</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>CTA Banner Title:</label>
                  <input
                    type="text"
                    value={aboutKecSb.cta.title}
                    onChange={(e) => setAboutKecSb({
                      ...aboutKecSb,
                      cta: { ...aboutKecSb.cta, title: e.target.value }
                    })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>CTA Banner Text:</label>
                  <textarea
                    rows="3"
                    value={aboutKecSb.cta.text}
                    onChange={(e) => setAboutKecSb({
                      ...aboutKecSb,
                      cta: { ...aboutKecSb.cta, text: e.target.value }
                    })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontFamily: 'inherit' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Button 1 Label:</label>
                    <input
                      type="text"
                      value={aboutKecSb.cta.btn1Text}
                      onChange={(e) => setAboutKecSb({
                        ...aboutKecSb,
                        cta: { ...aboutKecSb.cta, btn1Text: e.target.value }
                      })}
                      style={{ width: '100%', padding: '8px', fontSize: '12.5px', borderRadius: '4px', border: '1px solid #cbd5e1', marginBottom: '8px' }}
                    />
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Button 1 Link:</label>
                    <input
                      type="text"
                      value={aboutKecSb.cta.btn1Link}
                      onChange={(e) => setAboutKecSb({
                        ...aboutKecSb,
                        cta: { ...aboutKecSb.cta, btn1Link: e.target.value }
                      })}
                      style={{ width: '100%', padding: '8px', fontSize: '12.5px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Button 2 Label:</label>
                    <input
                      type="text"
                      value={aboutKecSb.cta.btn2Text}
                      onChange={(e) => setAboutKecSb({
                        ...aboutKecSb,
                        cta: { ...aboutKecSb.cta, btn2Text: e.target.value }
                      })}
                      style={{ width: '100%', padding: '8px', fontSize: '12.5px', borderRadius: '4px', border: '1px solid #cbd5e1', marginBottom: '8px' }}
                    />
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Button 2 Link:</label>
                    <input
                      type="text"
                      value={aboutKecSb.cta.btn2Link}
                      onChange={(e) => setAboutKecSb({
                        ...aboutKecSb,
                        cta: { ...aboutKecSb.cta, btn2Link: e.target.value }
                      })}
                      style={{ width: '100%', padding: '8px', fontSize: '12.5px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Contact & FAQ Page Editor */}
        {activeTab === 'contact_page' && contactPage && (
          <div className="animate-fade-in card" style={{ padding: '36px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '20px', color: '#0a385b', fontWeight: '800' }}>Manage Contact & FAQ Page</h2>
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>Edit office timing schedules, update social media link integrations, and compile accordion-style Frequently Asked Questions.</p>
              </div>
              <button
                onClick={() => {
                  settingsService.set('ieee_contact_page_v1', JSON.stringify(contactPage));
                  setContactSaved(true);
                  setTimeout(() => setContactSaved(false), 3000);
                }}
                style={{
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '30px',
                  padding: '10px 22px',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(16,185,129,0.25)'
                }}
              >
                <Save size={15} /> Save Contact Details
              </button>
            </div>

            {contactSaved && (
              <div style={{ padding: '12px 16px', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '8px', fontSize: '14px', fontWeight: '600', marginBottom: '24px', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={16} /> Contact & FAQ page settings saved!
              </div>
            )}

            {/* Office Hours Details */}
            <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', color: '#0a385b', fontWeight: '800', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Office Hours Coordinates</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Office Timings Schedule:</label>
                  <input
                    type="text"
                    value={contactPage.officeHours.timings}
                    onChange={(e) => setContactPage({
                      ...contactPage,
                      officeHours: { ...contactPage.officeHours, timings: e.target.value }
                    })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Office Venue / Room:</label>
                  <input
                    type="text"
                    value={contactPage.officeHours.venue}
                    onChange={(e) => setContactPage({
                      ...contactPage,
                      officeHours: { ...contactPage.officeHours, venue: e.target.value }
                    })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Available Advisors / Coordinators:</label>
                  <input
                    type="text"
                    value={contactPage.officeHours.coordinator}
                    onChange={(e) => setContactPage({
                      ...contactPage,
                      officeHours: { ...contactPage.officeHours, coordinator: e.target.value }
                    })}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>
            </div>

            {/* Social Media Connections */}
            <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', color: '#0a385b', fontWeight: '800', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Social Media Channel Integrations</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {Object.keys(contactPage.socials).map((key) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px', textTransform: 'capitalize' }}>{key} Profile URL:</label>
                    <input
                      type="text"
                      value={contactPage.socials[key]}
                      onChange={(e) => {
                        const socials = { ...contactPage.socials, [key]: e.target.value };
                        setContactPage({ ...contactPage, socials });
                      }}
                      placeholder={`https://${key}.com/...`}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs Accordion Manager */}
            <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                <h3 style={{ fontSize: '16px', color: '#0a385b', fontWeight: '800', margin: 0 }}>Frequently Asked Questions</h3>
                <button
                  onClick={() => {
                    const faqs = [...contactPage.faqs];
                    faqs.push({ q: 'New question?', a: 'Response answer...' });
                    setContactPage({ ...contactPage, faqs });
                  }}
                  style={{ padding: '4px 10px', fontSize: '11.5px', fontWeight: '700', cursor: 'pointer', border: 'none', borderRadius: '4px', backgroundColor: '#e2fbe8', color: '#15803d' }}
                >
                  + Add FAQ Accordion Item
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {contactPage.faqs.map((faq, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '12px', backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1', position: 'relative' }}>
                    <div style={{ flexGrow: 1 }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Question:</label>
                      <input
                        type="text"
                        value={faq.q}
                        onChange={(e) => {
                          const faqs = [...contactPage.faqs];
                          faqs[idx].q = e.target.value;
                          setContactPage({ ...contactPage, faqs });
                        }}
                        style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', marginBottom: '8px', fontWeight: '600' }}
                      />
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Answer:</label>
                      <textarea
                        rows="3"
                        value={faq.a}
                        onChange={(e) => {
                          const faqs = [...contactPage.faqs];
                          faqs[idx].a = e.target.value;
                          setContactPage({ ...contactPage, faqs });
                        }}
                        style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                      />
                    </div>
                    <button
                      onClick={() => {
                        const faqs = contactPage.faqs.filter((_, i) => i !== idx);
                        setContactPage({ ...contactPage, faqs });
                      }}
                      style={{ alignSelf: 'start', padding: '8px', border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#fee2e2', color: '#ef4444' }}
                      title="Delete FAQ"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'request_forms' && (
          <div className="animate-fade-in card" style={{ padding: '36px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '20px', color: '#0a385b', fontWeight: '800', margin: 0 }}>Request Forms & Embeds</h2>
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '2px', margin: 0 }}>
                  Manage the Google Forms embedded on the website. Toggle their visibility in the navigation bar and update URLs instantly.
                </p>
              </div>
            </div>

            {/* Sub-tabs for Requests */}
            <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '24px' }}>
              <button
                type="button"
                onClick={() => setRequestFormsSubTab('templates')}
                style={{
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: requestFormsSubTab === 'templates' ? 'rgba(var(--secondary-rgb), 0.08)' : 'transparent',
                  color: requestFormsSubTab === 'templates' ? 'var(--secondary)' : 'var(--text-muted)'
                }}
              >
                Form Templates
              </button>
              <button
                type="button"
                onClick={() => {
                  setRequestFormsSubTab('submissions');
                  const stored = null /* migrated to API */;
                  if (stored) setSubmissions(JSON.parse(stored));
                }}
                style={{
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: requestFormsSubTab === 'submissions' ? 'rgba(var(--secondary-rgb), 0.08)' : 'transparent',
                  color: requestFormsSubTab === 'submissions' ? 'var(--secondary)' : 'var(--text-muted)'
                }}
              >
                Form Submissions ({submissions.length})
              </button>
            </div>

            {requestFormsSubTab === 'templates' && (
              <>
                {/* Add New Form Button Row - when NOT editing/adding */}
                {!editingFormId && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                    <button
                      type="button"
                      onClick={handleAddNewFormClick}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: 'var(--primary)',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: 'var(--shadow-glow)'
                      }}
                      className="admin-add-btn"
                    >
                      <Plus size={14} /> Add New Request Form
                    </button>
                  </div>
                )}

                {/* Editing/Adding Form Card - visible when editingFormId is set */}
                {editingFormId ? (
                  <form onSubmit={handleSaveRequestForm} className="card" style={{ padding: '24px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '16px', color: '#0a385b', fontWeight: '800', marginBottom: '16px', borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
                      {editingFormId === 'new' ? 'Add New Request Form' : `Edit Form: ${formNameInput}`}
                    </h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px' }}>Form Name</label>
                        <input
                          type="text"
                          required
                          value={formNameInput}
                          onChange={(e) => setFormNameInput(e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px' }}>Route Slug (slug used in URL)</label>
                        <input
                          type="text"
                          required
                          value={formSlugInput}
                          onChange={(e) => setFormSlugInput(e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                          placeholder="e.g. event-pre-proposal"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px' }}>Category</label>
                        <select
                          value={formCategoryInput}
                          onChange={(e) => setFormCategoryInput(e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', backgroundColor: '#ffffff', cursor: 'pointer' }}
                        >
                          <option value="Membership">Membership</option>
                          <option value="Finance">Finance</option>
                          <option value="Event Management">Event Management</option>
                          <option value="Administration">Administration</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px' }}>Display Order</label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={formDisplayOrderInput}
                          onChange={(e) => setFormDisplayOrderInput(e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px' }}>Google Form URL (Publish/Viewform Link - Optional if onscreen form)</label>
                      <input
                        type="text"
                        value={formUrlInput}
                        onChange={(e) => {
                          setFormUrlInput(e.target.value);
                          setPreviewFormUrl(e.target.value);
                        }}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                        placeholder="https://docs.google.com/forms/d/e/.../viewform?embedded=true"
                      />
                      {formUrlInput && formUrlInput.includes('forms.gle') && (
                        <p style={{ fontSize: '11px', color: '#b45309', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          ⚠️ <strong>Note:</strong> Short URLs (forms.gle) might be blocked from embedding in iframes due to security redirect headers. It is highly recommended to use the full <code>docs.google.com/forms</code> link.
                        </p>
                      )}
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '750', color: '#0a385b', marginBottom: '6px' }}>Form Purpose / Description</label>
                      <textarea
                        rows="2"
                        value={formDescInput}
                        onChange={(e) => setFormDescInput(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', resize: 'vertical' }}
                        placeholder="Describe what this form is for..."
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <input
                        type="checkbox"
                        id="formActiveInput"
                        checked={formActiveInput}
                        onChange={(e) => setFormActiveInput(e.target.checked)}
                        style={{ cursor: 'pointer' }}
                      />
                      <label htmlFor="formActiveInput" style={{ fontSize: '13px', fontWeight: '700', color: '#475569', cursor: 'pointer' }}>
                        Active (Show in Request Forms listing page)
                      </label>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                      <input
                        type="checkbox"
                        id="formConfidentialInput"
                        checked={formConfidentialInput}
                        onChange={(e) => setFormConfidentialInput(e.target.checked)}
                        style={{ cursor: 'pointer' }}
                      />
                      <label htmlFor="formConfidentialInput" style={{ fontSize: '13px', fontWeight: '700', color: '#475569', cursor: 'pointer' }}>
                        Mark as Confidential (Requires Access PIN)
                      </label>
                    </div>

                    {/* Live Preview Section */}
                    {previewFormUrl && (
                      <div style={{ marginBottom: '20px', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                        <div style={{ backgroundColor: '#f1f5f9', padding: '8px 16px', fontSize: '12px', color: '#475569', fontWeight: '700', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                          <span>Live Preview (Form Iframe Container)</span>
                          <span>{formUrlInput.includes('forms.gle') ? '❌ Short URL preview disabled' : '✅ Load preview'}</span>
                        </div>
                        {!formUrlInput.includes('forms.gle') ? (
                          <iframe
                            src={formUrlInput.includes('embedded=true') ? formUrlInput : `${formUrlInput}${formUrlInput.includes('?') ? '&' : '?'}embedded=true`}
                            width="100%"
                            height="300"
                            style={{ border: 'none', display: 'block', backgroundColor: '#ffffff' }}
                            title="Form Preview"
                          />
                        ) : (
                          <div style={{ padding: '30px', textAlign: 'center', color: '#b45309', fontSize: '13px', backgroundColor: '#fef3c7' }}>
                            Iframe previews for <code>forms.gle</code> short URLs are restricted by browser policies. Save this form to verify loading in public routes.
                          </div>
                        )}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => { setEditingFormId(null); setPreviewFormUrl(''); }}
                        style={{ padding: '8px 18px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '20px', fontSize: '12.5px', fontWeight: 'bold', color: '#475569', cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        style={{ padding: '8px 18px', backgroundColor: '#02619a', border: 'none', borderRadius: '20px', fontSize: '12.5px', fontWeight: 'bold', color: '#ffffff', cursor: 'pointer' }}
                      >
                        {editingFormId === 'new' ? 'Add Form' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                ) : null}

                {/* List Table */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                          <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b' }}>Form Name</th>
                          <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b' }}>Route Slug</th>
                          <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b' }}>Category</th>
                          <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', textAlign: 'center', width: '80px' }}>Order</th>
                          <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b' }}>Description</th>
                          <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', width: '90px', textAlign: 'center' }}>Status</th>
                          <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', textAlign: 'center', width: '220px' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requestForms.length > 0 ? (
                          [...requestForms]
                            .sort((a, b) => (a.display_order !== undefined ? Number(a.display_order) : 999) - (b.display_order !== undefined ? Number(b.display_order) : 999))
                            .map(form => (
                              <tr key={form.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '16px 20px', fontWeight: '600' }}>{form.form_name}</td>
                                <td style={{ padding: '16px 20px', color: '#02619a', fontFamily: 'monospace', fontSize: '12.5px' }}>
                                  /request/{form.route_slug}
                                </td>
                                <td style={{ padding: '16px 20px', color: '#475569', fontSize: '13px', fontWeight: '500' }}>{form.category || 'Membership'}</td>
                                <td style={{ padding: '16px 20px', color: '#475569', fontSize: '13px', textAlign: 'center' }}>{form.display_order !== undefined ? form.display_order : 1}</td>
                                <td style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px' }}>{form.description}</td>
                                <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                                  <span style={{
                                    display: 'inline-block',
                                    padding: '3px 8px',
                                    borderRadius: '12px',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    backgroundColor: form.is_active ? '#dcfce7' : '#fee2e2',
                                    color: form.is_active ? '#15803d' : '#b91c1c'
                                  }}>
                                    {form.is_active ? 'Active' : 'Inactive'}
                                  </span>
                                </td>
                                <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                    <button
                                      onClick={() => handleEditFormClick(form)}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        padding: '6px 12px',
                                        border: '1px solid #cbd5e1',
                                        borderRadius: '6px',
                                        backgroundColor: '#ffffff',
                                        color: 'var(--secondary)',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                      }}
                                      className="action-btn-hover-edit"
                                    >
                                      <Edit3 size={12} /> Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteRequestForm(form.id)}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        padding: '6px 12px',
                                        border: '1px solid #fee2e2',
                                        borderRadius: '6px',
                                        backgroundColor: '#fef2f2',
                                        color: '#ef4444',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      <Trash2 size={12} /> Delete
                                    </button>
                                    <a
                                      href={`/request/${form.route_slug}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        padding: '6px 12px',
                                        border: '1px solid #cbd5e1',
                                        borderRadius: '6px',
                                        backgroundColor: '#ffffff',
                                        color: '#475569',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        textDecoration: 'none',
                                        cursor: 'pointer'
                                      }}
                                      className="action-btn-hover-edit"
                                    >
                                      Preview
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                              No request forms configured.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {requestFormsSubTab === 'submissions' && (
              <>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                          <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b' }}>Ref Number</th>
                          <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b' }}>Form Type</th>
                          <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b' }}>Title / Event</th>
                          <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b' }}>Submitted By</th>
                          <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b' }}>Submitted At</th>
                          <th style={{ padding: '16px 20px', fontWeight: '700', color: '#0a385b', textAlign: 'center', width: '200px' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {submissions.length > 0 ? (
                          submissions.map((sub, idx) => (
                            <tr key={sub.id} style={{ borderBottom: idx < submissions.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                              <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--secondary)', fontFamily: 'monospace' }}>
                                {sub.refNum || 'N/A'}
                              </td>
                              <td style={{ padding: '16px 20px', fontWeight: '600' }}>{sub.form_name}</td>
                              <td style={{ padding: '16px 20px', color: '#334155' }}>
                                {sub.form_slug === 'membership'
                                   ? `${sub.data?.name || 'N/A'} (${sub.data?.rollNumber || 'N/A'})`
                                   : (sub.form_slug === 'event-pre-proposal' ? sub.data?.title : sub.data?.eventName)}
                              </td>
                              <td style={{ padding: '16px 20px', fontSize: '13px' }}>
                                <div style={{ fontWeight: '600' }}>
                                  {sub.form_slug === 'membership' ? sub.data?.name : sub.data?.coordinatorName}
                                </div>
                                <div style={{ color: '#64748b' }}>
                                  {sub.form_slug === 'membership' ? sub.data?.collegeEmail : sub.data?.coordinatorEmail}
                                </div>
                              </td>
                              <td style={{ padding: '16px 20px', color: '#64748b', fontSize: '13px' }}>
                                {new Date(sub.submitted_at).toLocaleString()}
                              </td>
                              <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                  <button
                                    onClick={() => {
                                      setSelectedSubmission(sub);
                                      setIsSubModalOpen(true);
                                    }}
                                    style={{
                                      padding: '6px 12px',
                                      border: '1px solid #cbd5e1',
                                      borderRadius: '6px',
                                      backgroundColor: '#ffffff',
                                      color: 'var(--secondary)',
                                      fontSize: '12px',
                                      fontWeight: '600',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    View Details
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSubmission(sub.id)}
                                    style={{
                                      padding: '6px 12px',
                                      border: '1px solid #fee2e2',
                                      borderRadius: '6px',
                                      backgroundColor: '#fef2f2',
                                      color: '#ef4444',
                                      fontSize: '12px',
                                      fontWeight: '600',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8', fontStyle: 'italic' }}>
                              No onscreen submissions recorded yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Submission Detail Modal */}
                {isSubModalOpen && selectedSubmission && (
                  <div 
                    style={{
                      position: 'fixed',
                      top: 0, left: 0, right: 0, bottom: 0,
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      backdropFilter: 'blur(8px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 99999,
                      padding: '20px'
                    }}
                    onClick={() => setIsSubModalOpen(false)}
                  >
                    <div 
                      style={{
                        maxWidth: '650px',
                        width: '100%',
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        boxShadow: 'var(--shadow-premium)',
                        border: '1px solid var(--border-subtle)',
                        overflow: 'hidden',
                        maxHeight: '90vh',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div style={{
                        padding: '20px 24px',
                        background: 'var(--gradient-primary)',
                        color: '#ffffff',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#ffffff' }}>
                          Submission Details: {selectedSubmission.refNum}
                        </h3>
                        <button
                          onClick={() => setIsSubModalOpen(false)}
                          style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', display: 'flex' }}
                        >
                          ✕
                        </button>
                      </div>

                      <div style={{ padding: '24px', overflowY: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14.5px', textAlign: 'left' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                          <span style={{ fontWeight: '750', color: 'var(--secondary)' }}>Form Type:</span>
                          <span style={{ fontWeight: '600' }}>{selectedSubmission.form_name}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                          <span style={{ fontWeight: '750', color: 'var(--secondary)' }}>Submitted At:</span>
                          <span>{new Date(selectedSubmission.submitted_at).toLocaleString()}</span>
                        </div>

                        <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#0a385b', marginTop: '12px', marginBottom: '4px', textTransform: 'uppercase' }}>Collected Data:</h4>
                        
                        {selectedSubmission.form_slug === 'event-pre-proposal' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Event Title:</span>
                              <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{selectedSubmission.data?.title}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Society (Chapter):</span>
                              <span>{selectedSubmission.data?.society}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Event Type:</span>
                              <span>{selectedSubmission.data?.eventType || 'N/A'}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Category:</span>
                              <span>{selectedSubmission.data?.eventCategory || 'N/A'}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Mode:</span>
                              <span>{selectedSubmission.data?.eventMode || 'N/A'}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Scope:</span>
                              <span>{selectedSubmission.data?.eventScope || 'N/A'}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Coordinator:</span>
                              <span>{selectedSubmission.data?.coordinatorName} ({selectedSubmission.data?.coordinatorPhone})</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Coordinator Email:</span>
                              <span>{selectedSubmission.data?.coordinatorEmail}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Acknowledge Email:</span>
                              <span>{selectedSubmission.data?.mailForAcknowledge || 'N/A'}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Proposed Dates:</span>
                              <span>{selectedSubmission.data?.eventStartDate || selectedSubmission.data?.eventDate || 'N/A'} to {selectedSubmission.data?.eventEndDate || 'N/A'}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Venue:</span>
                              <span>{selectedSubmission.data?.venue}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Expected Crowd:</span>
                              <span>{selectedSubmission.data?.participantCount || 'N/A'}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Estimated Budget:</span>
                              <span style={{ fontWeight: '700', color: '#16a34a' }}>INR {selectedSubmission.data?.budget}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Contact Phone:</span>
                              <span>{selectedSubmission.data?.contactPersonPhone || 'N/A'}</span>
                            </div>
 
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Guest Speakers Details:</span>
                              <span style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px' }}>
                                {selectedSubmission.data?.speakerDetails || 'No speaker details provided.'}
                              </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Description & Syllabus:</span>
                              <span style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px' }}>
                                {selectedSubmission.data?.description}
                              </span>
                            </div>
                          </div>
                        ) : selectedSubmission.form_slug === 'bill-settlement' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Event Name:</span>
                              <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{selectedSubmission.data?.eventName}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Organizer (Society):</span>
                              <span>{selectedSubmission.data?.organizer || selectedSubmission.data?.society || 'N/A'}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Event Type:</span>
                              <span>{selectedSubmission.data?.eventType || 'N/A'}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Category:</span>
                              <span>{selectedSubmission.data?.eventCategory || 'N/A'}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Mode:</span>
                              <span>{selectedSubmission.data?.eventMode || 'N/A'}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Scope:</span>
                              <span>{selectedSubmission.data?.eventScope || 'N/A'}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Coordinator:</span>
                              <span>{selectedSubmission.data?.coordinatorName} ({selectedSubmission.data?.coordinatorPhone})</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Coordinator Email:</span>
                              <span>{selectedSubmission.data?.coordinatorEmail}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Acknowledge Email:</span>
                              <span>{selectedSubmission.data?.mailForAcknowledge || 'N/A'}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Event Dates:</span>
                              <span>{selectedSubmission.data?.eventStartDate} to {selectedSubmission.data?.eventEndDate}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Venue:</span>
                              <span>{selectedSubmission.data?.venue || 'N/A'}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Total Attendees:</span>
                              <span>{selectedSubmission.data?.actualParticipants}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Total Expenses:</span>
                              <span style={{ fontWeight: '700', color: '#dc2626' }}>INR {selectedSubmission.data?.totalExpenses || selectedSubmission.data?.expenses}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Contact Phone:</span>
                              <span>{selectedSubmission.data?.contactPersonPhone || 'N/A'}</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Bank Account Details:</span>
                              <span style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px', fontFamily: 'monospace' }}>
                                {selectedSubmission.data?.bankDetails}
                              </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Settlement Remarks:</span>
                              <span style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px' }}>
                                {selectedSubmission.data?.remarks || 'No remarks provided.'}
                              </span>
                            </div>
                            {selectedSubmission.data?.voucherUrl && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <span style={{ fontWeight: '700', color: '#475569' }}>Uploaded Voucher/Invoice:</span>
                                <div>
                                  <a
                                    href={selectedSubmission.data.voucherUrl}
                                    download={selectedSubmission.data.voucherName || 'voucher'}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '8px',
                                      padding: '8px 16px',
                                      backgroundColor: 'rgba(var(--secondary-rgb), 0.05)',
                                      border: '1px solid var(--border-subtle)',
                                      borderRadius: '8px',
                                      color: 'var(--secondary)',
                                      fontWeight: '600',
                                      textDecoration: 'none',
                                      fontSize: '13px',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    <FileText size={16} /> Download {selectedSubmission.data.voucherName || 'Attachment'}
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : selectedSubmission.form_slug === 'membership' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Student Name:</span>
                              <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{selectedSubmission.data?.name}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Roll Number:</span>
                              <span style={{ fontWeight: '600' }}>{selectedSubmission.data?.rollNumber}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Year:</span>
                              <span>{selectedSubmission.data?.year}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Department:</span>
                              <span>
                                {selectedSubmission.data?.department === 'Other' 
                                  ? `Other (${selectedSubmission.data?.customDepartment || 'N/A'})` 
                                  : (selectedSubmission.data?.department || 'N/A')}
                              </span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>College Email:</span>
                              <span>{selectedSubmission.data?.collegeEmail}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Personal Email:</span>
                              <span>{selectedSubmission.data?.personalEmail}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Contact Number:</span>
                              <span>{selectedSubmission.data?.contactNumber}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Transaction ID:</span>
                              <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>{selectedSubmission.data?.transactionId}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>Payment Status:</span>
                              <span style={{ 
                                fontWeight: '700', 
                                color: selectedSubmission.data?.paymentStatus === 'Paid' ? '#16a34a' : '#dc2626',
                                backgroundColor: selectedSubmission.data?.paymentStatus === 'Paid' ? '#f0fdf4' : '#fef2f2',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                width: 'fit-content'
                              }}>
                                {selectedSubmission.data?.paymentStatus}
                              </span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                              <span style={{ fontWeight: '700', color: '#475569' }}>IEEE Membership:</span>
                              <span>{selectedSubmission.data?.membershipType}</span>
                            </div>
                            
                            {selectedSubmission.data?.paymentScreenshotUrl && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                                <span style={{ fontWeight: '700', color: '#475569' }}>Uploaded Payment Screenshot:</span>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  <div>
                                    <a
                                      href={selectedSubmission.data.paymentScreenshotUrl}
                                      download={selectedSubmission.data.paymentScreenshotName || 'payment_screenshot'}
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 16px',
                                        backgroundColor: 'rgba(var(--secondary-rgb), 0.05)',
                                        border: '1px solid var(--border-subtle)',
                                        borderRadius: '8px',
                                        color: 'var(--secondary)',
                                        fontWeight: '600',
                                        textDecoration: 'none',
                                        fontSize: '13px',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      <FileText size={16} /> Download {selectedSubmission.data.paymentScreenshotName || 'Screenshot'}
                                    </a>
                                  </div>
                                  {selectedSubmission.data.paymentScreenshotUrl.startsWith('data:image/') && (
                                    <div style={{ marginTop: '8px' }}>
                                      <img 
                                        src={selectedSubmission.data.paymentScreenshotUrl} 
                                        alt="Payment Screenshot Preview" 
                                        style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #cbd5e1' }} 
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {Object.entries(selectedSubmission.data || {}).map(([key, val]) => (
                              <div key={key} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px' }}>
                                <span style={{ fontWeight: '700', color: '#475569', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}:</span>
                                <span>{typeof val === 'string' ? val : JSON.stringify(val)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div style={{
                        padding: '16px 24px',
                        borderTop: '1px solid #e2e8f0',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        backgroundColor: '#f8fafc'
                      }}>
                        <button
                          onClick={() => setIsSubModalOpen(false)}
                          style={{
                            padding: '8px 20px',
                            backgroundColor: 'var(--secondary)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '20px',
                            fontWeight: '700',
                            fontSize: '13px',
                            cursor: 'pointer',
                            boxShadow: 'var(--shadow-glow)'
                          }}
                        >
                          Close Details
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* CRUD Add/Edit Overlay Modal */}
      {isModalOpen && (
        <div 
          className="modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div 
            className="card modal-card"
            style={{
              maxWidth: '560px',
              width: '100%',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '20px',
              boxShadow: 'var(--shadow-premium)',
              overflow: 'hidden',
              border: '1px solid var(--border-subtle)',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              animation: 'modal-slide-up 0.25s ease-out'
            }}
          >
            {/* Modal Header */}
            <div 
              className="modal-header"
              style={{
                padding: '20px 24px',
                background: 'var(--gradient-primary)',
                color: '#ffffff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0
              }}
            >
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="checkbox"
                          id="eventShowNewBadge"
                          checked={eventShowNewBadge}
                          onChange={(e) => setEventShowNewBadge(e.target.checked)}
                          style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                        <label htmlFor="eventShowNewBadge" style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', cursor: 'pointer', userSelect: 'none' }}>
                          Highlight with "NEW" Badge / Sticker
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                        <input
                          type="checkbox"
                          id="isEventHighlighted"
                          checked={isEventHighlighted}
                          onChange={(e) => setIsEventHighlighted(e.target.checked)}
                          style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                        <label htmlFor="isEventHighlighted" style={{ fontSize: '13px', fontWeight: '700', color: '#0a385b', cursor: 'pointer', userSelect: 'none' }}>
                          Feature in Event Highlights Carousel (Max 5)
                        </label>
                      </div>

                      {isEventHighlighted && (
                        <div style={{ padding: '16px', border: '1.5px solid var(--border-subtle)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#ffffff' }} className="animate-fade-in">
                          <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Highlight Description</label>
                            <textarea
                              rows="3"
                              placeholder="Write a custom description specifically for the highlight card..."
                              value={highlightDescription}
                              onChange={(e) => setHighlightDescription(e.target.value)}
                              style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', resize: 'none', fontFamily: 'inherit' }}
                            />
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Card Header Cover Image</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    try {
                                      const compressed = await compressImage(file);
                                      setHighlightImage(compressed);
                                    } catch (err) {
                                      console.error("Compression error:", err);
                                    }
                                  }
                                }}
                                style={{ fontSize: '12px' }}
                              />
                              <p style={{ fontSize: '10.5px', color: '#64748b', marginTop: '4px' }}>Recommended size: 800x600px. Upload overrides gradient theme.</p>
                            </div>
                            
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Fallback Gradient Theme</label>
                              <select
                                value={highlightTheme}
                                onChange={(e) => setHighlightTheme(e.target.value)}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', backgroundColor: '#ffffff' }}
                              >
                                <option value="IEEE Blue">IEEE Blue</option>
                                <option value="Purple">Purple</option>
                                <option value="Cyan">Cyan</option>
                                <option value="Green">Green</option>
                                <option value="Teal">Teal</option>
                              </select>
                            </div>
                          </div>

                          {highlightImage && (
                            <div style={{ position: 'relative', width: '120px', height: '90px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1', marginTop: '8px' }}>
                              <img src={highlightImage} alt="Highlight Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <button
                                type="button"
                                onClick={() => setHighlightImage(null)}
                                style={{ position: 'absolute', top: '4px', right: '4px', backgroundColor: 'rgba(239, 68, 68, 0.9)', color: '#ffffff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                                title="Remove Cover Image"
                              >
                                ✕
                              </button>
                            </div>
                          )}
                        </div>
                      )}
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

              {/* Conditional Form: Societies (Faculties) */}
              {modalType === 'society' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '4px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Society Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Computer Society (CS Society)"
                      value={societyName}
                      onChange={(e) => setSocietyName(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                    />
                  </div>

                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', backgroundColor: '#f8fafc' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#0a385b', marginTop: 0, marginBottom: '10px', textTransform: 'uppercase' }}>Faculty In-Charge 1</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input
                        type="text"
                        required
                        placeholder="Name"
                        value={fac1Name}
                        onChange={(e) => setFac1Name(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13.5px' }}
                      />
                      <input
                        type="text"
                        required
                        placeholder="Position (e.g. Society Chairman)"
                        value={fac1Position}
                        onChange={(e) => setFac1Position(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13.5px' }}
                      />
                      <input
                        type="text"
                        required
                        placeholder="Phone Number"
                        value={fac1Phone}
                        onChange={(e) => setFac1Phone(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13.5px' }}
                      />
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Profile Image</label>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          {fac1Image && <img src={fac1Image} alt="Fac 1 Preview" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (file) {
                                try {
                                  const base64 = await compressImage(file);
                                  setFac1Image(base64);
                                } catch (err) {
                                  console.error("Compression error:", err);
                                }
                              }
                            }}
                            style={{ fontSize: '12px' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', backgroundColor: '#f8fafc' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#0a385b', marginTop: 0, marginBottom: '10px', textTransform: 'uppercase' }}>Faculty In-Charge 2</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input
                        type="text"
                        required
                        placeholder="Name"
                        value={fac2Name}
                        onChange={(e) => setFac2Name(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13.5px' }}
                      />
                      <input
                        type="text"
                        required
                        placeholder="Position (e.g. Society Vice Chairman)"
                        value={fac2Position}
                        onChange={(e) => setFac2Position(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13.5px' }}
                      />
                      <input
                        type="text"
                        required
                        placeholder="Phone Number"
                        value={fac2Phone}
                        onChange={(e) => setFac2Phone(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13.5px' }}
                      />
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Profile Image</label>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          {fac2Image && <img src={fac2Image} alt="Fac 2 Preview" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (file) {
                                try {
                                  const base64 = await compressImage(file);
                                  setFac2Image(base64);
                                } catch (err) {
                                  console.error("Compression error:", err);
                                }
                              }
                            }}
                            style={{ fontSize: '12px' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Conditional Form: Students */}
              {modalType === 'student' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sneha R."
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Department</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Computer Science"
                        value={studentDept}
                        onChange={(e) => setStudentDept(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Year of Study</label>
                      <select
                        value={studentYear}
                        onChange={(e) => setStudentYear(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', backgroundColor: '#ffffff' }}
                      >
                        <option value="">Select Year</option>
                        <option value="I">I</option>
                        <option value="II">II</option>
                        <option value="III">III</option>
                        <option value="IV">IV</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>IEEE Membership Number</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 92837482"
                        value={studentIeeeNumber}
                        onChange={(e) => setStudentIeeeNumber(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Position</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Chairman, Society Chairman..."
                        value={studentPosition}
                        onChange={(e) => setStudentPosition(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Email</label>
                      <input type="email" placeholder="e.g. student@kongu.edu" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Phone</label>
                      <input type="text" placeholder="e.g. +91 9876543210" value={studentPhone} onChange={(e) => setStudentPhone(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }} />
                    </div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>LinkedIn Profile</label>
                    <input type="url" placeholder="e.g. https://linkedin.com/in/username" value={studentLinkedin} onChange={(e) => setStudentLinkedin(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Society</label>
                    <select
                      value={studentSociety}
                      onChange={(e) => setStudentSociety(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', backgroundColor: '#ffffff' }}
                    >
                      <option value="IEEE KEC SB">IEEE KEC SB</option>
                      {societies.map((s) => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '6px', textTransform: 'uppercase' }}>Profile Image</label>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      {studentImage && <img src={studentImage} alt="Student Preview" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            try {
                              const base64 = await compressImage(file);
                              setStudentImage(base64);
                            } catch (err) {
                              console.error("Compression error:", err);
                            }
                          }
                        }}
                        style={{ width: '100%', fontSize: '13px' }}
                      />
                    </div>
                  </div>
                </div>
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
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0a385b', marginBottom: '8px', textTransform: 'uppercase' }}>Cover Image Options</label>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: '600', color: '#475569' }}>
                        <input
                          type="radio"
                          name="newsCoverStyle"
                          checked={newsCoverType === 'color'}
                          onChange={() => setNewsCoverType('color')}
                        />
                        Use Color Theme
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: '600', color: '#475569' }}>
                        <input
                          type="radio"
                          name="newsCoverStyle"
                          checked={newsCoverType === 'image'}
                          onChange={() => setNewsCoverType('image')}
                        />
                        Upload Custom Image
                      </label>
                    </div>

                    {newsCoverType === 'color' ? (
                      <div>
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
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleNewsImageUpload}
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', backgroundColor: '#ffffff' }}
                        />
                        {newsImage && (
                          <div style={{ position: 'relative', width: '150px', height: '90px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1', marginTop: '4px' }}>
                            <img src={newsImage} alt="News Cover Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button
                              type="button"
                              onClick={() => setNewsImage(null)}
                              style={{ position: 'absolute', top: '4px', right: '4px', backgroundColor: 'rgba(239, 68, 68, 0.9)', color: '#ffffff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Modal Actions */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px', flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '10px 22px', fontSize: '13.5px', fontWeight: '700', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)', backgroundColor: 'transparent', borderRadius: '30px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 22px', fontSize: '13.5px', fontWeight: '700', color: '#ffffff', backgroundColor: 'var(--secondary)', border: 'none', borderRadius: '30px', cursor: 'pointer' }}
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modal-slide-up {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-anim {
          animation: spin 1.5s linear infinite;
        }
        /* Dashboard Container & Grid card adjustments */
        .admin-dashboard-container {
          color: var(--text-dark) !important;
        }
        /* Override primary text colors */
        .admin-dashboard-container h2, 
        .admin-dashboard-container h3, 
        .admin-dashboard-container h4, 
        .admin-dashboard-container label, 
        .admin-dashboard-container th,
        .admin-dashboard-container td strong {
          color: var(--primary) !important;
        }
        /* Style card containers to look premium and glassmorphic */
        .admin-dashboard-container .card {
          background-color: var(--bg-card) !important;
          backdrop-filter: blur(16px) !important;
          border: 1px solid var(--border-subtle) !important;
          box-shadow: var(--shadow-md) !important;
          border-radius: 16px !important;
          transition: all 0.3s ease !important;
        }
        .admin-dashboard-container .card:hover {
          box-shadow: var(--shadow-lg) !important;
          border-color: rgba(var(--secondary-rgb), 0.25) !important;
        }
        /* Input, Textarea, Select style overrides */
        .admin-dashboard-container input,
        .admin-dashboard-container select,
        .admin-dashboard-container textarea {
          border: 1px solid var(--border-subtle) !important;
          background-color: rgba(255, 255, 255, 0.75) !important;
          border-radius: 10px !important;
          color: var(--text-dark) !important;
          padding: 11px 15px !important;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
          font-family: var(--font-sans) !important;
        }
        .admin-dashboard-container input:focus,
        .admin-dashboard-container select:focus,
        .admin-dashboard-container textarea:focus {
          border-color: var(--secondary) !important;
          background-color: #ffffff !important;
          box-shadow: 0 0 0 4px rgba(var(--secondary-rgb), 0.12) !important;
          outline: none !important;
        }
        /* Buttons layout overrides */
        .admin-dashboard-container button {
          font-family: var(--font-sans) !important;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        /* Specific action buttons */
        .admin-save-btn, .admin-add-btn, .admin-login-btn, button[type="submit"] {
          background: var(--gradient-primary) !important;
          color: #ffffff !important;
          border-radius: 30px !important;
          font-weight: 700 !important;
          padding: 10px 24px !important;
          box-shadow: var(--shadow-sm) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        .admin-save-btn:hover, .admin-add-btn:hover, .admin-login-btn:hover, button[type="submit"]:hover {
          background: var(--gradient-cyber) !important;
          transform: translateY(-1.5px) !important;
          box-shadow: var(--shadow-glow) !important;
        }
        /* Logout hover */
        .admin-logout-btn:hover {
          background-color: #ffffff !important;
          color: var(--primary) !important;
          border-color: #ffffff !important;
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3) !important;
        }
        /* Edit & Delete hover overrides */
        .action-btn-hover-edit {
          color: var(--secondary) !important;
          border: 1px solid var(--border-subtle) !important;
          border-radius: 8px !important;
          padding: 7px !important;
          transition: all 0.2s ease !important;
        }
        .action-btn-hover-edit:hover {
          background-color: var(--accent-light) !important;
          border-color: var(--secondary) !important;
          color: var(--secondary) !important;
          transform: scale(1.05) !important;
        }
        .action-btn-hover-delete {
          color: #ef4444 !important;
          border: 1px solid var(--border-subtle) !important;
          border-radius: 8px !important;
          padding: 7px !important;
          transition: all 0.2s ease !important;
        }
        .action-btn-hover-delete:hover {
          background-color: #fef2f2 !important;
          border-color: #fca5a5 !important;
          color: #ef4444 !important;
          transform: scale(1.05) !important;
        }
        /* Tables style overrides */
        .admin-dashboard-container table {
          border-collapse: collapse !important;
          width: 100% !important;
        }
        .admin-dashboard-container thead tr {
          background-color: rgba(var(--secondary-rgb), 0.04) !important;
          border-bottom: 2px solid var(--border-subtle) !important;
        }
        .admin-dashboard-container th {
          padding: 16px 20px !important;
          font-weight: 700 !important;
          font-size: 13.5px !important;
          letter-spacing: 0.5px !important;
          text-transform: uppercase !important;
          color: var(--primary) !important;
        }
        .admin-dashboard-container tbody tr {
          border-bottom: 1px solid rgba(var(--secondary-rgb), 0.08) !important;
          transition: background-color 0.2s ease !important;
        }
        .admin-dashboard-container tbody tr:hover {
          background-color: rgba(var(--secondary-rgb), 0.015) !important;
        }
        .admin-dashboard-container td {
          padding: 16px 20px !important;
          color: var(--text-muted) !important;
          font-size: 14px !important;
        }
        /* Tab buttons */
        .tab-btn:hover:not(.active-tab) {
          background-color: rgba(var(--secondary-rgb), 0.08) !important;
          color: var(--secondary) !important;
          border-color: var(--border-subtle) !important;
        }
        /* Overlay Modals */
        .modal-overlay {
          backdrop-filter: blur(8px) !important;
          background-color: rgba(15, 23, 42, 0.6) !important;
        }
        .modal-card {
          border-radius: 20px !important;
          box-shadow: var(--shadow-premium) !important;
          border: 1px solid var(--border-subtle) !important;
        }
        .modal-header {
          background: var(--gradient-primary) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default Admin;
