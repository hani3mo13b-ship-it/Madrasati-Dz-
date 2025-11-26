export enum EducationLevel {
  PRIMARY = 'الطور الابتدائي',
  MIDDLE = 'الطور المتوسط',
  SECONDARY = 'الطور الثانوي',
}

export enum Subject {
  MATH = 'الرياضيات',
  ARABIC = 'اللغة العربية',
  FRENCH = 'اللغة الفرنسية',
  ENGLISH = 'اللغة الإنجليزية',
  PHYSICS = 'الفيزياء',
  SCIENCE = 'العلوم الطبيعية',
  ISLAMIC = 'التربية الإسلامية',
  HISTORY_GEO = 'التاريخ والجغرافيا',
  CIVICS = 'التربية المدنية',
  PHILOSOPHY = 'الفلسفة',
  ACCOUNTING = 'تسيير واقتصاد',
}

export interface UserProfile {
  name: string;
  avatarId: number; // Index of the avatar in the array
  customAvatar?: string; // Base64 string for custom uploaded image
  level: EducationLevel;
  year: string;
  hasCompletedOnboarding: boolean;
}

export interface StudyResource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'exercise';
  subject: Subject;
  year: string;
  term: string;
  source?: string; // e.g. "ency-education"
  solved: boolean;
  externalLink?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  image?: string; // base64
  isThinking?: boolean;
}