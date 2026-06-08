export interface ProjectItem {
  id: string;
  titleEn: string;
  titleZh: string;
  categoryEn: string;
  categoryZh: string;
  year: string;
  roleEn: string;
  roleZh: string;
  summaryEn: string;
  summaryZh: string;
  detailsEn: string;
  detailsZh: string;
  paperGrammage: string; // tactile note, e.g. "300g Warm Cotton Paper"
  colorHex: string;
  technicalCoordinations: string[]; // blueprint technical coordinates e.g. ["X:144, Y:782", "Z:03"]
  featuresEn: string[];
  featuresZh: string[];
}

export interface PaperElement {
  id: string;
  labelEn: string;
  labelZh: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number; // custom degree for overlapping papers
  elevation: number; // 1, 2, 3 layers of hard paper dropshadow
  color: string;
  type: string; // e.g. "header", "hero-img", "body-text", "circular-tag", "grid-card"
}

export interface CritiqueResult {
  score: number;
  conceptAnalysis: string;
  recommendations: string[];
  creativeKeywords: string[];
  tactileTip: string;
}

export interface LocaleContent {
  logoTitle: string;
  subtitle: string;
  introText: string;
  viewDetails: string;
  close: string;
  // Sections
  workTitle: string;
  aboutTitle: string;
  labTitle: string;
  aiTitle: string;
  // Subsections and info
  paperGrammageLabel: string;
  roleLabel: string;
  gridCoordsLabel: string;
  specsTitle: string;
  // Lab
  playgroundTitle: string;
  playgroundIntro: string;
  elementSelector: string;
  addCard: string;
  resetLayout: string;
  customizingElement: string;
  width: string;
  height: string;
  rotate: string;
  elevation: string;
  coordsFeedback: string;
  // AI
  aiInputPlaceholder: string;
  critiqueHeading: string;
  critiqueIntro: string;
  getCritiqueBtn: string;
  scoreCard: string;
  keywordsCard: string;
  analysisTab: string;
  recsTab: string;
  tactileTab: string;
  // About
  aboutIntro: string;
  aboutBody1: string;
  aboutBody2: string;
  skillsLabel: string;
  experienceLabel: string;
}
