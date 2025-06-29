
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FilterControls from './components/FilterControls';
import ListingGrid from './components/ListingGrid';
import ListingDetailModal from './components/ListingDetailModal';
import AddListingModal from './components/AddListingModal';
import ImportCsvModal from './components/ImportCsvModal';
import IntegrationsModal from './components/IntegrationsModal'; 
import AnalyticsModal from './components/AnalyticsModal';
import TaskManagerModal from './components/TaskManagerModal';
import AiEmailAssistantModal from './components/AiEmailAssistantModal';
import HelpModal from './components/HelpModal';
import PythonWebScraperModal from './components/PythonWebScraperModal';
import AddUrlEmbedModal from './components/AddUrlEmbedModal'; 
import AddHtmlEmbedModal from './components/AddHtmlEmbedModal'; 
import AddNotesWidgetModal from './components/AddNotesWidgetModal'; // New
import AddKeyStatsWidgetModal from './components/AddKeyStatsWidgetModal'; // New
import DashboardWidgetsSection from './components/DashboardWidgetsSection'; 
import BulkActionsBar from './components/BulkActionsBar'; 
import { Listing, ThemeColors, TwilioConfig, CustomSmtpConfig, Task, CustomWidget, CustomWidgetType, AiLeadScoreData, LeadScoreValue, AiValuationData } from './types';
import { mockListings } from './utils/mockData';
import { loadGoogleMapsScript } from './utils/mapsLoader'; 

const palettes: Record<string, ThemeColors> = {
  default: { primary: '#1D4ED8', secondary: '#9333EA', accent: '#F59E0B', neutral: '#374151', base100: '#FFFFFF', baseContent: '#1F2937' },
  emerald: { primary: '#059669', secondary: '#06B6D4', accent: '#FACC15', neutral: '#4B5563', base100: '#F9FAFB', baseContent: '#111827' },
  crimson: { primary: '#DC2626', secondary: '#F472B6', accent: '#6D28D9', neutral: '#44403C', base100: '#FEF2F2', baseContent: '#1C1917' },
  ocean: { primary: '#0E7490', secondary: '#0369A1', accent: '#38BDF8', neutral: '#475569', base100: '#F0F9FF', baseContent: '#0C4A6E' },
};
const paletteNames = Object.keys(palettes);

const LOCALSTORAGE_FAVORITE_IDS_KEY = 'expiredListingsPro_favoriteIds_v1';
const LOCALSTORAGE_LISTING_NOTES_KEY = 'expiredListingsPro_listingNotes_v1';
const LOCALSTORAGE_LISTING_TAGS_KEY = 'expiredListingsPro_listingTags_v1';
const LOCALSTORAGE_LISTING_LEAD_SCORES_KEY = 'expiredListingsPro_listingLeadScores_v1';
const LOCALSTORAGE_LISTING_AI_VALUATIONS_KEY = 'expiredListingsPro_listingAiValuations_v1'; // New key
const LOCALSTORAGE_USER_ADDED_LISTINGS_KEY = 'expiredListingsPro_userAddedListings_v1'; 
const LOCALSTORAGE_GMAIL_CONNECTED_KEY = 'expiredListingsPro_gmailConnected_v1';
const LOCALSTORAGE_TWILIO_CONFIG_KEY = 'expiredListingsPro_twilioConfig_v1';
const LOCALSTORAGE_CUSTOM_SMTP_CONFIG_KEY = 'expiredListingsPro_customSmtpConfig_v1'; 
const LOCALSTORAGE_MANYCHAT_CONNECTED_KEY = 'expiredListingsPro_manyChatConnected_v1';
const LOCALSTORAGE_VBOUT_CONNECTED_KEY = 'expiredListingsPro_vboutConnected_v1';
const LOCALSTORAGE_VBOUT_API_KEY_KEY = 'expiredListingsPro_vboutApiKey_v1';
const LOCALSTORAGE_TASKS_KEY = 'expiredListingsPro_tasks_v1'; 
const LOCALSTORAGE_CUSTOM_WIDGETS_KEY = 'expiredListingsPro_customWidgets_v2'; 

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

const App: React.FC = () => {
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [leadTypeFilter, setLeadTypeFilter] = useState('all'); 
  const [sortBy, setSortBy] = useState('expirationDate_desc');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  const [isAddListingModalOpen, setIsAddListingModalOpen] = useState(false); 
  const [isImportCsvModalOpen, setIsImportCsvModalOpen] = useState(false);
  const [isIntegrationsModalOpen, setIsIntegrationsModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false); 
  const [isTaskManagerModalOpen, setIsTaskManagerModalOpen] = useState(false); 
  const [taskManagerContext, setTaskManagerContext] = useState<{listingId?: string | null, taskTitle?: string}>({});
  const [isAiEmailAssistantModalOpen, setIsAiEmailAssistantModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isPythonWebScraperModalOpen, setIsPythonWebScraperModalOpen] = useState(false);

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currentPaletteIndex, setCurrentPaletteIndex] = useState(0);

  const [tasks, setTasks] = useState<Task[]>([]); 

  const [isGmailConnected, setIsGmailConnected] = useState(false);
  const [twilioConfig, setTwilioConfig] = useState<TwilioConfig | null>(null);
  const [customSmtpConfig, setCustomSmtpConfig] = useState<CustomSmtpConfig | null>(null); 
  const [isManyChatConnected, setIsManyChatConnected] = useState(false); 
  const [isVboutConnected, setIsVboutConnected] = useState(false);
  const [vboutApiKey, setVboutApiKey] = useState<string | null>(null);

  const [isMapsApiLoaded, setIsMapsApiLoaded] = useState(false); 

  const [customWidgets, setCustomWidgets] = useState<CustomWidget[]>([]);
  const [isAddUrlEmbedModalOpen, setIsAddUrlEmbedModalOpen] = useState(false);
  const [isAddHtmlEmbedModalOpen, setIsAddHtmlEmbedModalOpen] = useState(false);
  const [isAddNotesWidgetModalOpen, setIsAddNotesWidgetModalOpen] = useState(false); 
  const [isAddKeyStatsWidgetModalOpen, setIsAddKeyStatsWidgetModalOpen] = useState(false); 
  const [editingWidget, setEditingWidget] = useState<CustomWidget | null>(null);

  const [selectedListingIds, setSelectedListingIds] = useState<string[]>([]);


  useEffect(() => {
    try {
      const storedWidgets = localStorage.getItem(LOCALSTORAGE_CUSTOM_WIDGETS_KEY);
      if (storedWidgets) {
        setCustomWidgets(JSON.parse(storedWidgets));
      }
    } catch (error) {
      console.error("Error loading custom widgets from localStorage:", error);
    }
  }, []);

  const saveCustomWidgetsToLocalStorage = (widgets: CustomWidget[]) => {
    try {
      localStorage.setItem(LOCALSTORAGE_CUSTOM_WIDGETS_KEY, JSON.stringify(widgets));
    } catch (error) {
      console.error("Error saving custom widgets to localStorage:", error);
    }
  };

  const handleAddCustomWidget = (widgetData: Omit<CustomWidget, 'id' | 'createdAt'>) => {
    const newWidget: CustomWidget = {
      ...widgetData,
      id: `widget_${Date.now().toString()}`,
      createdAt: new Date().toISOString(),
    };
    const updatedWidgets = [...customWidgets, newWidget];
    setCustomWidgets(updatedWidgets);
    saveCustomWidgetsToLocalStorage(updatedWidgets);
    if (widgetData.type === CustomWidgetType.URL) setIsAddUrlEmbedModalOpen(false);
    if (widgetData.type === CustomWidgetType.HTML) setIsAddHtmlEmbedModalOpen(false);
    if (widgetData.type === CustomWidgetType.NOTES) setIsAddNotesWidgetModalOpen(false); 
    if (widgetData.type === CustomWidgetType.KEY_STATS) setIsAddKeyStatsWidgetModalOpen(false); 
  };

  const handleUpdateCustomWidget = (widgetData: CustomWidget) => {
    const updatedWidgets = customWidgets.map(w => w.id === widgetData.id ? widgetData : w);
    setCustomWidgets(updatedWidgets);
    saveCustomWidgetsToLocalStorage(updatedWidgets);
    setEditingWidget(null);
    if (widgetData.type === CustomWidgetType.URL) setIsAddUrlEmbedModalOpen(false);
    if (widgetData.type === CustomWidgetType.HTML) setIsAddHtmlEmbedModalOpen(false);
    if (widgetData.type === CustomWidgetType.NOTES) setIsAddNotesWidgetModalOpen(false); 
    if (widgetData.type === CustomWidgetType.KEY_STATS) setIsAddKeyStatsWidgetModalOpen(false); 
  };

  const handleDeleteCustomWidget = (widgetId: string) => {
    if (window.confirm("Are you sure you want to delete this widget?")) {
      const updatedWidgets = customWidgets.filter(w => w.id !== widgetId);
      setCustomWidgets(updatedWidgets);
      saveCustomWidgetsToLocalStorage(updatedWidgets);
    }
  };
  
  const handleOpenAddUrlEmbedModal = () => { setEditingWidget(null); setIsAddUrlEmbedModalOpen(true); };
  const handleCloseAddUrlEmbedModal = () => { setEditingWidget(null); setIsAddUrlEmbedModalOpen(false); };
  
  const handleOpenAddHtmlEmbedModal = () => { setEditingWidget(null); setIsAddHtmlEmbedModalOpen(true); };
  const handleCloseAddHtmlEmbedModal = () => { setEditingWidget(null); setIsAddHtmlEmbedModalOpen(false); };

  const handleOpenAddNotesWidgetModal = () => { setEditingWidget(null); setIsAddNotesWidgetModalOpen(true); }; 
  const handleCloseAddNotesWidgetModal = () => { setEditingWidget(null); setIsAddNotesWidgetModalOpen(false); }; 

  const handleOpenAddKeyStatsWidgetModal = () => { setEditingWidget(null); setIsAddKeyStatsWidgetModalOpen(true); }; 
  const handleCloseAddKeyStatsWidgetModal = () => { setEditingWidget(null); setIsAddKeyStatsWidgetModalOpen(false); }; 


  const handleOpenEditWidgetModal = (widget: CustomWidget) => {
    setEditingWidget(widget);
    if (widget.type === CustomWidgetType.URL) setIsAddUrlEmbedModalOpen(true);
    else if (widget.type === CustomWidgetType.HTML) setIsAddHtmlEmbedModalOpen(true);
    else if (widget.type === CustomWidgetType.NOTES) setIsAddNotesWidgetModalOpen(true); 
    else if (widget.type === CustomWidgetType.KEY_STATS) setIsAddKeyStatsWidgetModalOpen(true); 
  };


  useEffect(() => {
    if (GOOGLE_MAPS_API_KEY) {
      loadGoogleMapsScript(GOOGLE_MAPS_API_KEY)
        .then(() => {
          setIsMapsApiLoaded(true);
        })
        .catch(error => {
          console.error('Failed to load Google Maps API:', error);
          setIsMapsApiLoaded(false); 
        });
    } else {
      setIsMapsApiLoaded(false);
    }
  }, []);


  const applyTheme = useCallback(() => {
    const root = document.documentElement;
    const palette = palettes[paletteNames[currentPaletteIndex]];

    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.setProperty('--color-primary', palette.primary); 
      root.style.setProperty('--color-secondary', palette.secondary);
      root.style.setProperty('--color-accent', palette.accent);
      root.style.setProperty('--color-neutral', '#A1A1AA'); 
      root.style.setProperty('--color-base-100', '#1F2937'); 
      root.style.setProperty('--color-base-content', '#F3F4F6');
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--color-primary', palette.primary);
      root.style.setProperty('--color-secondary', palette.secondary);
      root.style.setProperty('--color-accent', palette.accent);
      root.style.setProperty('--color-neutral', palette.neutral);
      root.style.setProperty('--color-base-100', palette.base100);
      root.style.setProperty('--color-base-content', palette.baseContent);
    }
  }, [theme, currentPaletteIndex]);

  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const toggleColorPalette = () => {
    setCurrentPaletteIndex(prevIndex => (prevIndex + 1) % paletteNames.length);
  };

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedGmailStatus = localStorage.getItem(LOCALSTORAGE_GMAIL_CONNECTED_KEY);
      if (storedGmailStatus) setIsGmailConnected(JSON.parse(storedGmailStatus));
      
      const storedTwilioConfig = localStorage.getItem(LOCALSTORAGE_TWILIO_CONFIG_KEY);
      if (storedTwilioConfig) setTwilioConfig(JSON.parse(storedTwilioConfig));

      const storedSmtpConfig = localStorage.getItem(LOCALSTORAGE_CUSTOM_SMTP_CONFIG_KEY); 
      if (storedSmtpConfig) setCustomSmtpConfig(JSON.parse(storedSmtpConfig));

      const storedManyChatStatus = localStorage.getItem(LOCALSTORAGE_MANYCHAT_CONNECTED_KEY); 
      if (storedManyChatStatus) setIsManyChatConnected(JSON.parse(storedManyChatStatus));

      const storedVboutStatus = localStorage.getItem(LOCALSTORAGE_VBOUT_CONNECTED_KEY);
      if (storedVboutStatus) setIsVboutConnected(JSON.parse(storedVboutStatus));
      const storedVboutApiKey = localStorage.getItem(LOCALSTORAGE_VBOUT_API_KEY_KEY);
      if (storedVboutApiKey) setVboutApiKey(storedVboutApiKey);

      const storedTasksString = localStorage.getItem(LOCALSTORAGE_TASKS_KEY);
      if (storedTasksString) {
        setTasks(JSON.parse(storedTasksString));
      }

    } catch (error) {
        console.error("Error loading integration/task settings from localStorage:", error);
    }

    setTimeout(() => { 
      let combinedListingsFromSources: Listing[] = [...mockListings];

      try {
        const storedUserAddedListingsString = localStorage.getItem(LOCALSTORAGE_USER_ADDED_LISTINGS_KEY);
        if (storedUserAddedListingsString) {
          const userAddedListings: Listing[] = JSON.parse(storedUserAddedListingsString);
          const userAddedIds = new Set(userAddedListings.map(ul => ul.id)); 
          combinedListingsFromSources = [...userAddedListings, ...mockListings.filter(ml => !userAddedIds.has(ml.id))];
        }
      } catch (error) {
        console.error("Error loading user-added listings from localStorage:", error);
      }
      
      const baseListingsWithDefaults: Listing[] = combinedListingsFromSources.map(l => {
        let validatedScore: Listing['aiLeadScore'] = undefined;
        if (l.aiLeadScore) {
            if (['Hot', 'Warm', 'Cold'].includes(l.aiLeadScore)) {
                validatedScore = l.aiLeadScore as LeadScoreValue;
            }
        }
        return {
          ...l, 
          leadType: l.leadType || 'Expired', 
          isFavorite: !!l.isFavorite, 
          notes: l.notes || '',
          tags: l.tags || [], 
          homeownerEmail: l.homeownerEmail || undefined,
          homeownerPhone: l.homeownerPhone || undefined,
          aiLeadScore: validatedScore,
          aiLeadScoreReason: validatedScore ? l.aiLeadScoreReason || undefined : undefined,
          aiEstimatedValue: l.aiEstimatedValue !== undefined ? Number(l.aiEstimatedValue) : undefined, // Initialize new AI value fields
          aiValuationReasoning: l.aiValuationReasoning || undefined,
        };
      });

      let finalProcessedListings: Listing[] = baseListingsWithDefaults;
      try {
        const storedFavoriteIdsString = localStorage.getItem(LOCALSTORAGE_FAVORITE_IDS_KEY);
        const storedNotesString = localStorage.getItem(LOCALSTORAGE_LISTING_NOTES_KEY);
        const storedTagsString = localStorage.getItem(LOCALSTORAGE_LISTING_TAGS_KEY); 
        const storedLeadScoresString = localStorage.getItem(LOCALSTORAGE_LISTING_LEAD_SCORES_KEY);
        const storedAiValuationsString = localStorage.getItem(LOCALSTORAGE_LISTING_AI_VALUATIONS_KEY); // Load AI valuations

        const favoriteIds: string[] = storedFavoriteIdsString ? JSON.parse(storedFavoriteIdsString) : [];
        const notes: Record<string, string> = storedNotesString ? JSON.parse(storedNotesString) : {};
        const tags: Record<string, string[]> = storedTagsString ? JSON.parse(storedTagsString) : {}; 
        const leadScoresFromStorage: Record<string, AiLeadScoreData> = storedLeadScoresString ? JSON.parse(storedLeadScoresString) : {};
        const aiValuationsFromStorage: Record<string, AiValuationData> = storedAiValuationsString ? JSON.parse(storedAiValuationsString) : {}; // Parse valuations
        
        finalProcessedListings = baseListingsWithDefaults.map(listing => {
          const storedScoreData = leadScoresFromStorage[listing.id];
          const storedValuationData = aiValuationsFromStorage[listing.id]; // Get stored valuation
          
          let effectiveAiLeadScore: Listing['aiLeadScore'] = listing.aiLeadScore;
          let effectiveAiLeadScoreReason: Listing['aiLeadScoreReason'] = listing.aiLeadScoreReason;

          if (storedScoreData && storedScoreData.score != null) {
            if (typeof storedScoreData.score === 'string' && ['Hot', 'Warm', 'Cold'].includes(storedScoreData.score)) {
              effectiveAiLeadScore = storedScoreData.score as LeadScoreValue;
              effectiveAiLeadScoreReason = storedScoreData.reason;
            }
          }
          
          let effectiveAiEstimatedValue: Listing['aiEstimatedValue'] = listing.aiEstimatedValue;
          let effectiveAiValuationReasoning: Listing['aiValuationReasoning'] = listing.aiValuationReasoning;

          if (storedValuationData && storedValuationData.estimatedValue != null) { // Check stored valuation
            effectiveAiEstimatedValue = Number(storedValuationData.estimatedValue);
            effectiveAiValuationReasoning = storedValuationData.reasoning;
          }

          return {
            ...listing,
            isFavorite: favoriteIds.includes(listing.id) || listing.isFavorite, 
            notes: notes[listing.id] || listing.notes, 
            tags: tags[listing.id] || listing.tags || [], 
            aiLeadScore: effectiveAiLeadScore,
            aiLeadScoreReason: effectiveAiLeadScoreReason,
            aiEstimatedValue: effectiveAiEstimatedValue, // Apply stored/default valuation
            aiValuationReasoning: effectiveAiValuationReasoning,
          };
        });

      } catch (error) {
        console.error("Error loading listing enhancements from localStorage:", error);
      }
      
      setAllListings(finalProcessedListings);
      setIsLoading(false);
    }, 1000); 
  }, []);

  const handleOpenTaskManagerModal = useCallback((listingId?: string | null, taskTitle?: string) => {
    setTaskManagerContext({listingId: listingId || null, taskTitle: taskTitle || undefined});
    setIsTaskManagerModalOpen(true);
  }, []);

  const handleCloseTaskManagerModal = useCallback(() => {
    setIsTaskManagerModalOpen(false);
    setTaskManagerContext({});
  }, []);

  const handleAddTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'isCompleted'>) => {
    setTasks(prevTasks => {
      const newTask: Task = {
        ...taskData,
        id: `task_${Date.now().toString()}`,
        createdAt: new Date().toISOString(),
        isCompleted: false,
      };
      const updatedTasks = [newTask, ...prevTasks];
      try {
        localStorage.setItem(LOCALSTORAGE_TASKS_KEY, JSON.stringify(updatedTasks));
      } catch (error) {
        console.error("Error saving tasks to localStorage:", error);
      }
      return updatedTasks;
    });
  }, []);

  const handleUpdateTask = useCallback((taskId: string, taskUpdateData: Partial<Omit<Task, 'id' | 'createdAt' | 'isCompleted'>>) => {
    setTasks(prevTasks => {
        const updatedTasks = prevTasks.map(task =>
            task.id === taskId ? { ...task, ...taskUpdateData } : task
        );
        try {
            localStorage.setItem(LOCALSTORAGE_TASKS_KEY, JSON.stringify(updatedTasks));
        } catch (error) {
            console.error("Error saving updated tasks to localStorage:", error);
        }
        return updatedTasks;
    });
  }, []);


  const handleToggleTaskComplete = useCallback((taskId: string) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      );
      try {
        localStorage.setItem(LOCALSTORAGE_TASKS_KEY, JSON.stringify(updatedTasks));
      } catch (error) {
        console.error("Error saving tasks to localStorage:", error);
      }
      return updatedTasks;
    });
  }, []);

  const handleDeleteTask = useCallback((taskId: string) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.filter(task => task.id !== taskId);
      try {
        localStorage.setItem(LOCALSTORAGE_TASKS_KEY, JSON.stringify(updatedTasks));
      } catch (error) {
        console.error("Error saving tasks to localStorage:", error);
      }
      return updatedTasks;
    });
  }, []);


  const handleSelectListing = (listing: Listing) => {
    setSelectedListing(listing); 
  };

  const handleCloseListingDetailModal = () => {
    setSelectedListing(null);
  };
  
  const handleOpenAddListingModal = () => setIsAddListingModalOpen(true);
  const handleCloseAddListingModal = () => setIsAddListingModalOpen(false);

  const handleOpenImportCsvModal = () => setIsImportCsvModalOpen(true);
  const handleCloseImportCsvModal = () => setIsImportCsvModalOpen(false);

  const handleOpenIntegrationsModal = () => setIsIntegrationsModalOpen(true);
  const handleCloseIntegrationsModal = () => setIsIntegrationsModalOpen(false);
  
  const handleOpenAnalyticsModal = () => setIsAnalyticsModalOpen(true); 
  const handleCloseAnalyticsModal = () => setIsAnalyticsModalOpen(false); 

  const handleOpenAiEmailAssistantModal = () => setIsAiEmailAssistantModalOpen(true); 
  const handleCloseAiEmailAssistantModal = () => setIsAiEmailAssistantModalOpen(false); 

  const handleOpenHelpModal = () => setIsHelpModalOpen(true); 
  const handleCloseHelpModal = () => setIsHelpModalOpen(false); 

  const handleOpenPythonWebScraperModal = () => setIsPythonWebScraperModalOpen(true);
  const handleClosePythonWebScraperModal = () => setIsPythonWebScraperModalOpen(false);


  const handleConnectGmailSimulated = useCallback(() => {
    setIsGmailConnected(true);
    localStorage.setItem(LOCALSTORAGE_GMAIL_CONNECTED_KEY, JSON.stringify(true));
  }, []);

  const handleDisconnectGmailSimulated = useCallback(() => {
    setIsGmailConnected(false);
    localStorage.removeItem(LOCALSTORAGE_GMAIL_CONNECTED_KEY);
  }, []);

  const handleSaveTwilioConfigSimulated = useCallback((config: TwilioConfig) => {
    setTwilioConfig(config);
    localStorage.setItem(LOCALSTORAGE_TWILIO_CONFIG_KEY, JSON.stringify(config));
  }, []);
  
  const handleClearTwilioConfigSimulated = useCallback(() => {
    setTwilioConfig(null);
    localStorage.removeItem(LOCALSTORAGE_TWILIO_CONFIG_KEY);
  }, []);

  const handleSaveCustomSmtpConfig = useCallback((config: CustomSmtpConfig) => {
    setCustomSmtpConfig(config);
    localStorage.setItem(LOCALSTORAGE_CUSTOM_SMTP_CONFIG_KEY, JSON.stringify(config));
  }, []);

  const handleClearCustomSmtpConfig = useCallback(() => {
    setCustomSmtpConfig(null);
    localStorage.removeItem(LOCALSTORAGE_CUSTOM_SMTP_CONFIG_KEY);
  }, []);

  const handleConnectManyChatSimulated = useCallback(() => {
    setIsManyChatConnected(true);
    localStorage.setItem(LOCALSTORAGE_MANYCHAT_CONNECTED_KEY, JSON.stringify(true));
  }, []);

  const handleDisconnectManyChatSimulated = useCallback(() => {
    setIsManyChatConnected(false);
    localStorage.removeItem(LOCALSTORAGE_MANYCHAT_CONNECTED_KEY);
  }, []);

  const handleConnectVboutSimulated = useCallback((apiKey: string) => {
    setVboutApiKey(apiKey);
    setIsVboutConnected(true);
    localStorage.setItem(LOCALSTORAGE_VBOUT_API_KEY_KEY, apiKey);
    localStorage.setItem(LOCALSTORAGE_VBOUT_CONNECTED_KEY, JSON.stringify(true));
  }, []);

  const handleDisconnectVboutSimulated = useCallback(() => {
    setVboutApiKey(null);
    setIsVboutConnected(false);
    localStorage.removeItem(LOCALSTORAGE_VBOUT_API_KEY_KEY);
    localStorage.removeItem(LOCALSTORAGE_VBOUT_CONNECTED_KEY);
  }, []);


  const handleAddNewListing = useCallback((listingData: Omit<Listing, 'id' | 'isFavorite' | 'notes' | 'tags' | 'aiLeadScore' | 'aiLeadScoreReason' | 'aiEstimatedValue' | 'aiValuationReasoning'>) => {
    const newListing: Listing = {
      ...listingData, 
      id: `user_${Date.now().toString()}`, 
      isFavorite: false,
      notes: '',
      tags: [], 
      price: Number(listingData.price) || 0,
      bedrooms: Number(listingData.bedrooms) || 0,
      bathrooms: Number(listingData.bathrooms) || 0,
      sqft: Number(listingData.sqft) || 0,
      daysOnMarketPreviously: Number(listingData.daysOnMarketPreviously) || 0,
      yearBuilt: Number(listingData.yearBuilt) || new Date().getFullYear(),
      homeownerEmail: listingData.homeownerEmail || undefined,
      homeownerPhone: listingData.homeownerPhone || undefined,
      imageUrl: listingData.imageUrl || `https://picsum.photos/seed/new${Date.now()}/600/400`,
      originalListDate: listingData.originalListDate || new Date().toISOString().split('T')[0], 
      expirationDate: listingData.expirationDate || new Date().toISOString().split('T')[0], 
      aiLeadScore: undefined,
      aiLeadScoreReason: undefined,
      aiEstimatedValue: undefined, // Initialize new AI fields
      aiValuationReasoning: undefined,
    };

    setAllListings(prevListings => {
      const updatedListings = [newListing, ...prevListings]; 
      
      try {
        const storedUserAddedListingsString = localStorage.getItem(LOCALSTORAGE_USER_ADDED_LISTINGS_KEY);
        const existingUserListings: Listing[] = storedUserAddedListingsString ? JSON.parse(storedUserAddedListingsString) : [];
        localStorage.setItem(LOCALSTORAGE_USER_ADDED_LISTINGS_KEY, JSON.stringify([newListing, ...existingUserListings]));
      } catch (error) {
        console.error("Error saving new listing to localStorage:", error);
      }
      return updatedListings;
    });
    handleCloseAddListingModal();
  }, []);

  const handleImportListingsFromCsv = useCallback((importedRawListings: Array<Omit<Listing, 'id' | 'isFavorite' | 'notes' | 'tags' | 'aiLeadScore' | 'aiLeadScoreReason' | 'aiEstimatedValue' | 'aiValuationReasoning'>>) => {
    const newListings: Listing[] = importedRawListings.map((listingData, index) => ({
      ...listingData,
      id: `csv_${Date.now().toString()}_${index}`,
      leadType: listingData.leadType || 'Expired', 
      isFavorite: false,
      notes: '',
      tags: [], 
      price: Number(listingData.price) || 0,
      bedrooms: Number(listingData.bedrooms) || 0,
      bathrooms: Number(listingData.bathrooms) || 0,
      sqft: Number(listingData.sqft) || 0,
      daysOnMarketPreviously: Number(listingData.daysOnMarketPreviously) || 0,
      yearBuilt: Number(listingData.yearBuilt) || new Date().getFullYear(),
      homeownerEmail: listingData.homeownerEmail || undefined,
      homeownerPhone: listingData.homeownerPhone || undefined,
      imageUrl: listingData.imageUrl || `https://picsum.photos/seed/csv${Date.now() + index}/600/400`,
      originalListDate: listingData.originalListDate || new Date().toISOString().split('T')[0],
      expirationDate: listingData.expirationDate || new Date().toISOString().split('T')[0],
      aiLeadScore: undefined,
      aiLeadScoreReason: undefined,
      aiEstimatedValue: undefined, // Initialize new AI fields
      aiValuationReasoning: undefined,
    }));

    if (newListings.length > 0) {
        setAllListings(prevListings => {
            const updatedListings = [...newListings, ...prevListings];
            try {
                const storedUserAddedListingsString = localStorage.getItem(LOCALSTORAGE_USER_ADDED_LISTINGS_KEY);
                const existingUserListings: Listing[] = storedUserAddedListingsString ? JSON.parse(storedUserAddedListingsString) : [];
                localStorage.setItem(LOCALSTORAGE_USER_ADDED_LISTINGS_KEY, JSON.stringify([...newListings, ...existingUserListings]));
            } catch (error) {
                console.error("Error saving imported listings to localStorage:", error);
            }
            return updatedListings;
        });
    }
    handleCloseImportCsvModal();
  }, []);


  const handleToggleFavorite = useCallback((listingId: string) => {
    let updatedListingsState: Listing[] = [];
    setAllListings(prevListings => {
      updatedListingsState = prevListings.map(l =>
        l.id === listingId ? { ...l, isFavorite: !l.isFavorite } : l
      );
      
      const favoriteIds = updatedListingsState.filter(l => l.isFavorite).map(l => l.id);
      try {
        localStorage.setItem(LOCALSTORAGE_FAVORITE_IDS_KEY, JSON.stringify(favoriteIds));
      } catch (error) {
        console.error("Error saving favorite IDs to localStorage:", error);
      }
      return updatedListingsState;
    });

    if (selectedListing && selectedListing.id === listingId) {
        setSelectedListing(prev => prev ? {...prev, isFavorite: !prev.isFavorite} : null);
    }
  }, [selectedListing]);

  const handleUpdateListingNotes = useCallback((listingId: string, notes: string) => {
    let updatedListingsState: Listing[] = [];
    setAllListings(prevListings => {
      updatedListingsState = prevListings.map(l =>
        l.id === listingId ? { ...l, notes } : l
      );

      const notesToStore: Record<string, string> = {};
      updatedListingsState.forEach(l => {
        if (l.notes && l.notes.trim() !== '') {
          notesToStore[l.id] = l.notes;
        }
      });
      try {
        localStorage.setItem(LOCALSTORAGE_LISTING_NOTES_KEY, JSON.stringify(notesToStore));
      } catch (error) {
        console.error("Error saving notes to localStorage:", error);
      }
      return updatedListingsState;
    });

     if (selectedListing && selectedListing.id === listingId) {
        setSelectedListing(prev => prev ? {...prev, notes} : null);
    }
  }, [selectedListing]);
  
  const handleUpdateListingTags = useCallback((listingId: string, newTags: string[]) => {
    let updatedListingsState: Listing[] = [];
    setAllListings(prevListings => {
      updatedListingsState = prevListings.map(l =>
        l.id === listingId ? { ...l, tags: newTags } : l
      );

      const tagsToStore: Record<string, string[]> = {};
      updatedListingsState.forEach(l => {
        if (l.tags && l.tags.length > 0) {
          tagsToStore[l.id] = l.tags;
        }
      });
      try {
        localStorage.setItem(LOCALSTORAGE_LISTING_TAGS_KEY, JSON.stringify(tagsToStore));
      } catch (error) {
        console.error("Error saving tags to localStorage:", error);
      }
      return updatedListingsState;
    });

     if (selectedListing && selectedListing.id === listingId) {
        setSelectedListing(prev => prev ? {...prev, tags: newTags} : null);
    }
  }, [selectedListing]);

  const handleUpdateLeadScore = useCallback((listingId: string, scoreData: AiLeadScoreData) => {
    let updatedListingsState: Listing[] = [];
    setAllListings(prevListings => {
      updatedListingsState = prevListings.map(l =>
        l.id === listingId ? { ...l, aiLeadScore: scoreData.score as Listing['aiLeadScore'], aiLeadScoreReason: scoreData.reason } : l
      );

      const scoresToStore: Record<string, AiLeadScoreData> = {};
      updatedListingsState.forEach(l => {
        if (l.aiLeadScore && l.aiLeadScoreReason) {
          scoresToStore[l.id] = { score: l.aiLeadScore, reason: l.aiLeadScoreReason };
        }
      });
      try {
        localStorage.setItem(LOCALSTORAGE_LISTING_LEAD_SCORES_KEY, JSON.stringify(scoresToStore));
      } catch (error) {
        console.error("Error saving lead scores to localStorage:", error);
      }
      return updatedListingsState;
    });

    if (selectedListing && selectedListing.id === listingId) {
      setSelectedListing(prev => prev ? { ...prev, aiLeadScore: scoreData.score as Listing['aiLeadScore'], aiLeadScoreReason: scoreData.reason } : null);
    }
  }, [selectedListing]);

  const handleUpdateAiValuation = useCallback((listingId: string, valuationData: AiValuationData) => {
    let updatedListingsState: Listing[] = [];
    setAllListings(prevListings => {
      updatedListingsState = prevListings.map(l =>
        l.id === listingId ? { ...l, aiEstimatedValue: Number(valuationData.estimatedValue), aiValuationReasoning: valuationData.reasoning } : l
      );

      const valuationsToStore: Record<string, AiValuationData> = {};
      updatedListingsState.forEach(l => {
        if (l.aiEstimatedValue !== undefined && l.aiValuationReasoning) {
          valuationsToStore[l.id] = { estimatedValue: l.aiEstimatedValue, reasoning: l.aiValuationReasoning };
        }
      });
      try {
        localStorage.setItem(LOCALSTORAGE_LISTING_AI_VALUATIONS_KEY, JSON.stringify(valuationsToStore));
      } catch (error) {
        console.error("Error saving AI valuations to localStorage:", error);
      }
      return updatedListingsState;
    });

    if (selectedListing && selectedListing.id === listingId) {
      setSelectedListing(prev => prev ? { ...prev, aiEstimatedValue: Number(valuationData.estimatedValue), aiValuationReasoning: valuationData.reasoning } : null);
    }
  }, [selectedListing]);


  const handleDeleteListing = useCallback((listingId: string) => {
    if (selectedListing && selectedListing.id === listingId) {
      handleCloseListingDetailModal();
    }

    setAllListings(prevListings => prevListings.filter(l => l.id !== listingId));
    
    setTasks(prevTasks => {
        const updatedTasks = prevTasks.filter(task => task.associatedListingId !== listingId);
        try {
            localStorage.setItem(LOCALSTORAGE_TASKS_KEY, JSON.stringify(updatedTasks));
        } catch (error) {
            console.error("Error saving tasks to localStorage after deleting associated listing:", error);
        }
        return updatedTasks;
    });


    try {
      const storedUserAddedListingsString = localStorage.getItem(LOCALSTORAGE_USER_ADDED_LISTINGS_KEY);
      if (storedUserAddedListingsString) {
        const existingUserListings: Listing[] = JSON.parse(storedUserAddedListingsString);
        const updatedUserListings = existingUserListings.filter(l => l.id !== listingId);
        localStorage.setItem(LOCALSTORAGE_USER_ADDED_LISTINGS_KEY, JSON.stringify(updatedUserListings));
      }

      const storedFavoriteIdsString = localStorage.getItem(LOCALSTORAGE_FAVORITE_IDS_KEY);
      if (storedFavoriteIdsString) {
        const favoriteIds: string[] = JSON.parse(storedFavoriteIdsString);
        const updatedFavoriteIds = favoriteIds.filter(id => id !== listingId);
        localStorage.setItem(LOCALSTORAGE_FAVORITE_IDS_KEY, JSON.stringify(updatedFavoriteIds));
      }

      const storedNotesString = localStorage.getItem(LOCALSTORAGE_LISTING_NOTES_KEY);
      if (storedNotesString) {
        const notes: Record<string, string> = JSON.parse(storedNotesString);
        if (notes[listingId]) {
          delete notes[listingId];
          localStorage.setItem(LOCALSTORAGE_LISTING_NOTES_KEY, JSON.stringify(notes));
        }
      }
      
      const storedTagsString = localStorage.getItem(LOCALSTORAGE_LISTING_TAGS_KEY);
      if (storedTagsString) {
        const tags: Record<string, string[]> = JSON.parse(storedTagsString);
        if (tags[listingId]) {
          delete tags[listingId];
          localStorage.setItem(LOCALSTORAGE_LISTING_TAGS_KEY, JSON.stringify(tags));
        }
      }
      
      const storedLeadScoresString = localStorage.getItem(LOCALSTORAGE_LISTING_LEAD_SCORES_KEY);
      if (storedLeadScoresString) {
        const leadScores: Record<string, AiLeadScoreData> = JSON.parse(storedLeadScoresString);
        if (leadScores[listingId]) {
          delete leadScores[listingId];
          localStorage.setItem(LOCALSTORAGE_LISTING_LEAD_SCORES_KEY, JSON.stringify(leadScores));
        }
      }
      
      const storedAiValuationsString = localStorage.getItem(LOCALSTORAGE_LISTING_AI_VALUATIONS_KEY);
      if (storedAiValuationsString) {
        const valuations: Record<string, AiValuationData> = JSON.parse(storedAiValuationsString);
        if (valuations[listingId]) {
          delete valuations[listingId];
          localStorage.setItem(LOCALSTORAGE_LISTING_AI_VALUATIONS_KEY, JSON.stringify(valuations));
        }
      }

    } catch (error) {
      console.error("Error deleting listing from localStorage:", error);
    }
    setSelectedListingIds(prev => prev.filter(id => id !== listingId));
  }, [selectedListing]);

  const filteredAndSortedListings = useMemo(() => {
    let result = allListings.filter(listing => {
      if (showFavoritesOnly && !listing.isFavorite) {
        return false;
      }
      const searchTermLower = searchTerm.toLowerCase();
      const searchMatch = (
        listing.address.toLowerCase().includes(searchTermLower) ||
        listing.city.toLowerCase().includes(searchTermLower) ||
        listing.zip.toLowerCase().includes(searchTermLower) ||
        listing.propertyType.toLowerCase().includes(searchTermLower) ||
        listing.leadType.toLowerCase().includes(searchTermLower) || 
        (listing.homeownerEmail && listing.homeownerEmail.toLowerCase().includes(searchTermLower)) ||
        (listing.homeownerPhone && listing.homeownerPhone.toLowerCase().includes(searchTermLower))
      );

      const filterTagsArray = tagFilter.toLowerCase().split(',').map(t => t.trim()).filter(t => t); 
      const tagMatch = filterTagsArray.length === 0 || (listing.tags && filterTagsArray.some(ft => listing.tags!.some(lt => lt.toLowerCase().includes(ft)))); 
      
      const leadTypeMatch = leadTypeFilter === 'all' || listing.leadType.toLowerCase() === leadTypeFilter;

      return searchMatch && leadTypeMatch && tagMatch; 
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'dom_asc':
          return a.daysOnMarketPreviously - b.daysOnMarketPreviously;
        case 'dom_desc':
          return b.daysOnMarketPreviously - a.daysOnMarketPreviously;
        case 'expirationDate_asc': 
          return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
        case 'expirationDate_desc': 
          return new Date(b.expirationDate).getTime() - new Date(a.expirationDate).getTime();
        default:
          const scoreOrder = { 'Hot': 1, 'Warm': 2, 'Cold': 3 };
          const scoreA = a.aiLeadScore ? scoreOrder[a.aiLeadScore] : 4;
          const scoreB = b.aiLeadScore ? scoreOrder[b.aiLeadScore] : 4;
          if (scoreA !== scoreB) {
            return scoreA - scoreB;
          }
          return new Date(b.expirationDate).getTime() - new Date(a.expirationDate).getTime();
      }
    });

    return result;
  }, [allListings, searchTerm, leadTypeFilter, sortBy, showFavoritesOnly, tagFilter]); 

  const handleToggleSelectListing = useCallback((listingId: string) => {
    setSelectedListingIds(prevSelectedIds => {
      if (prevSelectedIds.includes(listingId)) {
        return prevSelectedIds.filter(id => id !== listingId);
      } else {
        return [...prevSelectedIds, listingId];
      }
    });
  }, []);

  const handleToggleSelectAllVisible = useCallback(() => {
    const visibleListingIds = filteredAndSortedListings.map(l => l.id);
    if (selectedListingIds.length === visibleListingIds.length && visibleListingIds.every(id => selectedListingIds.includes(id))) {
      setSelectedListingIds([]);
    } else {
      setSelectedListingIds(visibleListingIds);
    }
  }, [filteredAndSortedListings, selectedListingIds]);

  const handleClearSelection = useCallback(() => {
    setSelectedListingIds([]);
  }, []);

  const handleBulkMarkAsFavorite = useCallback((isFavorite: boolean) => {
    const updatedListings = allListings.map(listing => {
      if (selectedListingIds.includes(listing.id)) {
        return { ...listing, isFavorite };
      }
      return listing;
    });
    setAllListings(updatedListings);

    const favoriteIds = updatedListings.filter(l => l.isFavorite).map(l => l.id);
    localStorage.setItem(LOCALSTORAGE_FAVORITE_IDS_KEY, JSON.stringify(favoriteIds));
    
    if (selectedListing && selectedListingIds.includes(selectedListing.id)) {
      setSelectedListing(prev => prev ? { ...prev, isFavorite } : null);
    }
    handleClearSelection();
  }, [allListings, selectedListingIds, selectedListing, handleClearSelection]);

  const handleBulkAddTags = useCallback(() => {
    const tagsToAddStr = prompt("Enter tags to add (comma-separated):");
    if (tagsToAddStr) {
      const tagsToAdd = tagsToAddStr.split(',').map(tag => tag.trim()).filter(tag => tag);
      if (tagsToAdd.length > 0) {
        const updatedListings = allListings.map(listing => {
          if (selectedListingIds.includes(listing.id)) {
            const newTags = [...(listing.tags || [])];
            tagsToAdd.forEach(tag => {
              if (!newTags.map(t => t.toLowerCase()).includes(tag.toLowerCase())) {
                newTags.push(tag);
              }
            });
            return { ...listing, tags: newTags };
          }
          return listing;
        });
        setAllListings(updatedListings);

        const tagsToStore: Record<string, string[]> = {};
        updatedListings.forEach(l => {
          if (l.tags && l.tags.length > 0) tagsToStore[l.id] = l.tags;
        });
        localStorage.setItem(LOCALSTORAGE_LISTING_TAGS_KEY, JSON.stringify(tagsToStore));
        
        if (selectedListing && selectedListingIds.includes(selectedListing.id)) {
            const updatedSelectedListing = updatedListings.find(l => l.id === selectedListing.id);
            if (updatedSelectedListing) setSelectedListing(updatedSelectedListing);
        }
        handleClearSelection();
      }
    }
  }, [allListings, selectedListingIds, selectedListing, handleClearSelection]);

  const handleBulkDelete = useCallback(() => {
    if (window.confirm(`Are you sure you want to delete ${selectedListingIds.length} listing(s)? This action cannot be undone.`)) {
      const newListings = allListings.filter(l => !selectedListingIds.includes(l.id));
      setAllListings(newListings);

      const newTasks = tasks.filter(task => !selectedListingIds.includes(task.associatedListingId || ''));
      setTasks(newTasks);
      localStorage.setItem(LOCALSTORAGE_TASKS_KEY, JSON.stringify(newTasks));

      try {
        const storedUserAddedListingsString = localStorage.getItem(LOCALSTORAGE_USER_ADDED_LISTINGS_KEY);
        if (storedUserAddedListingsString) {
          const existingUserListings: Listing[] = JSON.parse(storedUserAddedListingsString);
          localStorage.setItem(LOCALSTORAGE_USER_ADDED_LISTINGS_KEY, JSON.stringify(existingUserListings.filter(l => !selectedListingIds.includes(l.id))));
        }
        const storedFavoriteIdsString = localStorage.getItem(LOCALSTORAGE_FAVORITE_IDS_KEY);
        if (storedFavoriteIdsString) {
          const favoriteIds: string[] = JSON.parse(storedFavoriteIdsString);
          localStorage.setItem(LOCALSTORAGE_FAVORITE_IDS_KEY, JSON.stringify(favoriteIds.filter(id => !selectedListingIds.includes(id))));
        }
        const storedNotesString = localStorage.getItem(LOCALSTORAGE_LISTING_NOTES_KEY);
        if (storedNotesString) {
            const notes: Record<string, string> = JSON.parse(storedNotesString);
            selectedListingIds.forEach(id => delete notes[id]);
            localStorage.setItem(LOCALSTORAGE_LISTING_NOTES_KEY, JSON.stringify(notes));
        }
        const storedTagsString = localStorage.getItem(LOCALSTORAGE_LISTING_TAGS_KEY);
        if (storedTagsString) {
            const tags: Record<string, string[]> = JSON.parse(storedTagsString);
            selectedListingIds.forEach(id => delete tags[id]);
            localStorage.setItem(LOCALSTORAGE_LISTING_TAGS_KEY, JSON.stringify(tags));
        }
        const storedLeadScoresString = localStorage.getItem(LOCALSTORAGE_LISTING_LEAD_SCORES_KEY);
        if (storedLeadScoresString) {
            const leadScores: Record<string, AiLeadScoreData> = JSON.parse(storedLeadScoresString);
            selectedListingIds.forEach(id => delete leadScores[id]);
            localStorage.setItem(LOCALSTORAGE_LISTING_LEAD_SCORES_KEY, JSON.stringify(leadScores));
        }
        const storedAiValuationsString = localStorage.getItem(LOCALSTORAGE_LISTING_AI_VALUATIONS_KEY);
        if (storedAiValuationsString) {
            const valuations: Record<string, AiValuationData> = JSON.parse(storedAiValuationsString);
            selectedListingIds.forEach(id => delete valuations[id]);
            localStorage.setItem(LOCALSTORAGE_LISTING_AI_VALUATIONS_KEY, JSON.stringify(valuations));
        }


      } catch (error) {
        console.error("Error during bulk delete from localStorage:", error);
      }
      
      if (selectedListing && selectedListingIds.includes(selectedListing.id)) {
        handleCloseListingDetailModal();
      }
      handleClearSelection();
    }
  }, [allListings, selectedListingIds, tasks, selectedListing, handleClearSelection]);

  return (
    <div className={`min-h-screen flex flex-col bg-base-100 text-base-content transition-colors duration-300`}>
      <Navbar 
        theme={theme} 
        onToggleTheme={toggleTheme} 
        onToggleColorPalette={toggleColorPalette} 
        onOpenAddListingModal={handleOpenAddListingModal}
        onOpenImportCsvModal={handleOpenImportCsvModal}
        onOpenIntegrationsModal={handleOpenIntegrationsModal} 
        onOpenAnalyticsModal={handleOpenAnalyticsModal} 
        onOpenTaskManagerModal={() => handleOpenTaskManagerModal(null)}
        onOpenAiEmailAssistantModal={handleOpenAiEmailAssistantModal} 
        onOpenHelpModal={handleOpenHelpModal}
        onOpenPythonWebScraperModal={handleOpenPythonWebScraperModal}
        onOpenAddUrlEmbedModal={handleOpenAddUrlEmbedModal} 
        onOpenAddHtmlEmbedModal={handleOpenAddHtmlEmbedModal}
        onOpenAddNotesWidgetModal={handleOpenAddNotesWidgetModal} 
        onOpenAddKeyStatsWidgetModal={handleOpenAddKeyStatsWidgetModal} 
      />
      <Hero />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {selectedListingIds.length > 0 && (
          <BulkActionsBar
            selectedCount={selectedListingIds.length}
            totalVisibleCount={filteredAndSortedListings.length}
            onSelectAll={handleToggleSelectAllVisible}
            onClearSelection={handleClearSelection}
            onMarkFavorite={() => handleBulkMarkAsFavorite(true)}
            onMarkUnfavorite={() => handleBulkMarkAsFavorite(false)}
            onAddTags={handleBulkAddTags}
            onDelete={handleBulkDelete}
            allVisibleSelected={
              filteredAndSortedListings.length > 0 &&
              selectedListingIds.length === filteredAndSortedListings.length &&
              filteredAndSortedListings.every(l => selectedListingIds.includes(l.id))
            }
             someVisibleSelected={
                selectedListingIds.length > 0 && selectedListingIds.length < filteredAndSortedListings.length
            }
          />
        )}
        <FilterControls
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          tagFilter={tagFilter} 
          onTagFilterChange={setTagFilter} 
          leadTypeFilter={leadTypeFilter}
          onLeadTypeFilterChange={setLeadTypeFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          showFavoritesOnly={showFavoritesOnly}
          onShowFavoritesOnlyChange={setShowFavoritesOnly}
        />
        <ListingGrid
          listings={filteredAndSortedListings}
          selectedListingIds={selectedListingIds}
          onSelectListing={handleSelectListing}
          onToggleFavorite={handleToggleFavorite}
          onDeleteListing={handleDeleteListing}
          onToggleSelectListing={handleToggleSelectListing}
          isLoading={isLoading && allListings.length === 0} 
        />
      </main>
      
      <DashboardWidgetsSection 
          widgets={customWidgets}
          allListings={allListings} 
          tasks={tasks} 
          onEditWidget={handleOpenEditWidgetModal}
          onDeleteWidget={handleDeleteCustomWidget}
          onOpenAddUrlEmbedModal={handleOpenAddUrlEmbedModal}
          onOpenAddHtmlEmbedModal={handleOpenAddHtmlEmbedModal}
          onOpenAddNotesWidgetModal={handleOpenAddNotesWidgetModal}
          onOpenAddKeyStatsWidgetModal={handleOpenAddKeyStatsWidgetModal}
      />

      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          onClose={handleCloseListingDetailModal}
          onToggleFavorite={handleToggleFavorite}
          onUpdateNotes={handleUpdateListingNotes}
          onUpdateTags={handleUpdateListingTags} 
          onDeleteListing={handleDeleteListing}
          onUpdateLeadScore={handleUpdateLeadScore}
          onUpdateAiValuation={handleUpdateAiValuation} // Pass new handler
          isGmailConnected={isGmailConnected} 
          isTwilioConfigured={!!twilioConfig}
          onOpenTaskManagerModal={handleOpenTaskManagerModal} 
          mapsApiKey={GOOGLE_MAPS_API_KEY} 
          isMapsApiLoaded={isMapsApiLoaded} 
        />
      )}

      {isAddListingModalOpen && ( 
        <AddListingModal 
          onClose={handleCloseAddListingModal}
          onSubmit={handleAddNewListing}
        />
      )}

      {isImportCsvModalOpen && (
        <ImportCsvModal
          isOpen={isImportCsvModalOpen}
          onClose={handleCloseImportCsvModal}
          onImport={handleImportListingsFromCsv}
        />
      )}

      {isIntegrationsModalOpen && (
        <IntegrationsModal
          isOpen={isIntegrationsModalOpen}
          onClose={handleCloseIntegrationsModal}
          gmailConnected={isGmailConnected}
          onConnectGmail={handleConnectGmailSimulated}
          onDisconnectGmail={handleDisconnectGmailSimulated}
          twilioConfig={twilioConfig}
          onSaveTwilio={handleSaveTwilioConfigSimulated}
          onClearTwilio={handleClearTwilioConfigSimulated}
          customSmtpConfig={customSmtpConfig} 
          onSaveCustomSmtp={handleSaveCustomSmtpConfig} 
          onClearCustomSmtp={handleClearCustomSmtpConfig} 
          manyChatConnected={isManyChatConnected} 
          onConnectManyChat={handleConnectManyChatSimulated} 
          onDisconnectManyChat={handleDisconnectManyChatSimulated}
          vboutConnected={isVboutConnected}
          vboutApiKey={vboutApiKey}
          onConnectVbout={handleConnectVboutSimulated}
          onDisconnectVbout={handleDisconnectVboutSimulated}
        />
      )}

      {isAnalyticsModalOpen && ( 
        <AnalyticsModal
          isOpen={isAnalyticsModalOpen}
          onClose={handleCloseAnalyticsModal}
          listings={allListings}
          gmailConnected={isGmailConnected}
          twilioConfigured={!!twilioConfig}
          customSmtpConfigured={!!customSmtpConfig} 
          manyChatConnected={isManyChatConnected}
          vboutConnected={isVboutConnected}
        />
      )}

      {isTaskManagerModalOpen && (
        <TaskManagerModal
          isOpen={isTaskManagerModalOpen}
          onClose={handleCloseTaskManagerModal}
          tasks={tasks}
          listings={allListings} 
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onToggleComplete={handleToggleTaskComplete}
          onDeleteTask={handleDeleteTask}
          contextListingId={taskManagerContext.listingId}
          initialTaskTitle={taskManagerContext.taskTitle}
        />
      )}

      {isAiEmailAssistantModalOpen && (
        <AiEmailAssistantModal
          isOpen={isAiEmailAssistantModalOpen}
          onClose={handleCloseAiEmailAssistantModal}
          listings={allListings}
          selectedListingContext={selectedListing} 
          onOpenTaskManagerModal={handleOpenTaskManagerModal}
          isGmailConnected={isGmailConnected}
          isCustomSmtpConfigured={!!customSmtpConfig} 
        />
      )}

      {isHelpModalOpen && ( 
        <HelpModal
          isOpen={isHelpModalOpen}
          onClose={handleCloseHelpModal}
        />
      )}

      {isPythonWebScraperModalOpen && ( 
        <PythonWebScraperModal
          isOpen={isPythonWebScraperModalOpen}
          onClose={handleClosePythonWebScraperModal}
        />
      )}

      {isAddUrlEmbedModalOpen && (
        <AddUrlEmbedModal
          isOpen={isAddUrlEmbedModalOpen}
          onClose={handleCloseAddUrlEmbedModal}
          onSave={editingWidget ? handleUpdateCustomWidget : handleAddCustomWidget}
          existingWidget={editingWidget?.type === CustomWidgetType.URL ? editingWidget : null}
        />
      )}

      {isAddHtmlEmbedModalOpen && (
        <AddHtmlEmbedModal
          isOpen={isAddHtmlEmbedModalOpen}
          onClose={handleCloseAddHtmlEmbedModal}
          onSave={editingWidget ? handleUpdateCustomWidget : handleAddCustomWidget}
          existingWidget={editingWidget?.type === CustomWidgetType.HTML ? editingWidget : null}
        />
      )}

      {isAddNotesWidgetModalOpen && ( 
        <AddNotesWidgetModal
          isOpen={isAddNotesWidgetModalOpen}
          onClose={handleCloseAddNotesWidgetModal}
          onSave={editingWidget ? handleUpdateCustomWidget : handleAddCustomWidget}
          existingWidget={editingWidget?.type === CustomWidgetType.NOTES ? editingWidget : null}
        />
      )}

      {isAddKeyStatsWidgetModalOpen && ( 
        <AddKeyStatsWidgetModal
          isOpen={isAddKeyStatsWidgetModalOpen}
          onClose={handleCloseAddKeyStatsWidgetModal}
          onSave={editingWidget ? handleUpdateCustomWidget : handleAddCustomWidget}
          existingWidget={editingWidget?.type === CustomWidgetType.KEY_STATS ? editingWidget : null}
        />
      )}

      <footer className="bg-neutral text-neutral-content py-6 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Expired Listings Pro. AI-Powered Real Estate Solutions.</p>
        <p>Powered by Google Gemini & Google Maps</p>
      </footer>
    </div>
  );
};

export default App;