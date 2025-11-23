import { EducationLevel, Subject, StudyResource } from './types';

export const YEARS = {
  [EducationLevel.PRIMARY]: ['السنة الأولى', 'السنة الثانية', 'السنة الثالثة', 'السنة الرابعة', 'السنة الخامسة'],
  [EducationLevel.MIDDLE]: ['السنة الأولى متوسط', 'السنة الثانية متوسط', 'السنة الثالثة متوسط', 'السنة الرابعة متوسط (BEM)'],
  [EducationLevel.SECONDARY]: ['السنة الأولى ثانوي', 'السنة الثانية ثانوي', 'السنة الثالثة ثانوي (BAC)'],
};

export const TERMS = ['الفصل الأول', 'الفصل الثاني', 'الفصل الثالث'];

export const SUBJECTS = Object.values(Subject);

export const AVATARS = [
  'https://cdn-icons-png.flaticon.com/512/4333/4333609.png', // Boy 1
  'https://cdn-icons-png.flaticon.com/512/4140/4140048.png', // Girl 1
  'https://cdn-icons-png.flaticon.com/512/4333/4333607.png', // Boy 2
  'https://cdn-icons-png.flaticon.com/512/4140/4140037.png', // Girl 2
  'https://cdn-icons-png.flaticon.com/512/1999/1999625.png', // Smart
];

// Keywords for "Smart Search" link generation
export const ALGERIAN_SOURCES = {
  EXAMS: 'site:dzexams.com OR site:ency-education.com OR site:sujets-de-composition.com',
  YOUTUBE_CHANNELS: {
    [Subject.MATH]: 'الأستاذ نور الدين رياضيات',
    [Subject.PHYSICS]: 'الأستاذ شريفي فيزياء',
    [Subject.ARABIC]: 'الأستاذ قزوري لغة عربية',
    [Subject.ENGLISH]: 'تعلم الإنجليزية مع ناصر',
    [Subject.SCIENCE]: 'الأستاذ مصطفى بن خريف علوم',
    [Subject.ISLAMIC]: 'الأستاذ شمس الدين تربية إسلامية',
    [Subject.HISTORY_GEO]: 'الأستاذ بورنان تاريخ وجغرافيا',
    [Subject.PHILOSOPHY]: 'الأستاذ خليل سعيداني فلسفة',
    'DEFAULT': 'دروس الدعم الجزائر'
  }
};