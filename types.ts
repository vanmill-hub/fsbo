
export interface Listing {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lotSize: string; // e.g., "0.25 acres" or "5,000 sqft"
  propertyType: 'Single Family' | 'Condo' | 'Townhouse' | 'Multi-Family' | 'Land';
  /** For Expired: Days on market before expiring. For FSBO: Current days on market. For Pre-foreclosure: Time since notice or similar. */
  daysOnMarketPreviously: number; 
  originalListDate: string;
  /** For Expired: Date listing expired. For FSBO: Date FSBO was listed/observed. For Pre-foreclosure: Key date like auction date. */
  expirationDate: string; 
  previousAgentName: string; // Empty or N/A for FSBO/Pre-foreclosure
  previousAgentBrokerage: string; // Empty or N/A for FSBO/Pre-foreclosure
  listingDescription: string;
  imageUrl: string;
  leadType: 'Expired' | 'FSBO' | 'Pre-foreclosure'; // Added Pre-foreclosure
  yearBuilt: number;
  notes?: string; // For user's private notes
  isFavorite?: boolean; // For marking as favorite
  homeownerEmail?: string; // New: For Gmail integration
  homeownerPhone?: string; // New: For Twilio integration
  tags?: string[]; // Added for listing tags
  aiLeadScore?: LeadScoreValue; // New: AI-powered lead score
  aiLeadScoreReason?: string; // New: Reason for the AI lead score
  aiEstimatedValue?: number; // New: AI-powered property valuation
  aiValuationReasoning?: string; // New: Reason for AI valuation
}

export type LeadScoreValue = 'Hot' | 'Warm' | 'Cold';

export interface AiLeadScoreData {
  score: LeadScoreValue | string; // Allow string for initial parsing
  reason: string;
}

export interface AiValuationData {
  estimatedValue: number | string; // Allow string for initial parsing
  reasoning: string;
}

export enum AiContentType {
  SUMMARY = 'summary',
  EMAIL = 'email',
  CALL_SCRIPT = 'call_script',
  SUGGEST_TAGS = 'suggest_tags', // New AI feature: Suggest tags for a listing
  LEAD_SCORING = 'lead_scoring', // New AI feature: Score leads
  PROPERTY_VALUATION = 'property_valuation', // New AI feature: Estimate property value
  // For AI Email Assistant
  DRAFT_EMAIL = 'draft_email',
  ADJUST_TONE = 'adjust_tone',
  SUMMARIZE_TEXT = 'summarize_text',
  TRANSLATE_TEXT = 'translate_text',
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  base100: string; // background
  baseContent: string; // text
}

export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
}

export type CustomSmtpEncryption = 'none' | 'ssl_tls' | 'starttls';

export interface CustomSmtpConfig {
  host: string;
  port: number;
  username: string;
  password?: string; // Optional, as some servers might not require auth or use other methods
  encryption: CustomSmtpEncryption;
  senderEmail: string; // Email address to send from
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO string date, e.g., "2024-12-31"
  isCompleted: boolean;
  associatedListingId?: string; // ID of the Listing it's related to
  createdAt: string; // ISO string timestamp
}

// Types for AI Email Assistant
export type EmailPurpose = 
  | 'initial_contact' // Generic initial contact, will be adapted for Expired/FSBO/Pre-foreclosure by AI service
  | 'initial_contact_fsbo' // Specific purpose for FSBO initial contact
  | 'initial_contact_expired' // Specific purpose for Expired initial contact
  | 'initial_contact_preforeclosure' // Specific purpose for Pre-foreclosure initial contact
  | 'follow_up_no_response' 
  | 'price_discussion' 
  | 'showing_request' 
  | 're_engagement'
  | 'general_update' 
  | 'custom_prompt';

export type EmailTone = 
  | 'professional' 
  | 'friendly' 
  | 'empathetic' 
  | 'urgent' 
  | 'persuasive'
  | 'concise';

export interface AiEmailAssistantRequest {
  listing?: Listing | null;
  purpose?: EmailPurpose;
  recipientName?: string;
  customPoints?: string;
  tone?: EmailTone;
  currentSubject?: string; // For tone adjustment/translation
  currentBody: string; // Text to work on (e.g. for tone adjustment, summarization, translation)
  targetLanguage?: string; // For translation
  customPrompt?: string; // For custom purpose
}

// New types for Dashboard Custom Widgets
export enum CustomWidgetType {
  URL = 'url',
  HTML = 'html',
  NOTES = 'notes', // New
  KEY_STATS = 'key_stats', // New
}

export type KeyStatOptionValue =
  | 'totalListings'
  | 'totalValue'
  | 'avgPrice'
  | 'expiredCount'
  | 'fsboCount'
  | 'preForeclosureCount'
  | 'hotLeadsCount'
  | 'warmLeadsCount'
  | 'coldLeadsCount'
  | 'favoritesCount'
  | 'activeTasksCount'
  | 'completedTasksCount';

export interface CustomWidget {
  id: string;
  type: CustomWidgetType;
  title: string;
  content: string | string[]; // Updated: string for URL, HTML, NOTES; string[] of KeyStatOptionValue for KEY_STATS
  width?: string; // e.g., '100%', '500px'
  height?: string; // e.g., '400px'
  createdAt: string; // ISO string timestamp
}