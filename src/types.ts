/**
 * Socratic Science Tutor - Core Types
 * Grounded in Chi & Wylie (2014) ICAP Framework
 */

export interface CausalLink {
  id: string;
  order: number;
  label: string;
  description: string;
  isFulfilled: boolean;
  hint: string;
}

export interface ScienceActivity {
  id: string;
  title: string;
  gradeLevel: string;
  topic: string;
  curriculumStandard: string;
  scenario: string;
  initialPrompt: string;
  causalChain: CausalLink[];
  commonMisconceptions: {
    description: string;
    triggers: string[];
    remediationPrompt: string;
  }[];
  transferPrompt: {
    title: string;
    scenario: string;
    prompt: string;
    targetMechanism: string;
  };
}

export type LearnerStatus =
  | 'idle'
  | 'listening'
  | 'evaluating'
  | 'feedback'
  | 'mastered';

export type TurnStatus =
  | 'off_task'
  | 'empty_or_gibberish'
  | 'misconception'
  | 'partial_progress'
  | 'complete_mastery';

export interface TurnEvaluation {
  status: TurnStatus;
  detectedMisconception?: string;
  identifiedLinks: string[];
  missingLinks: string[];
  feedbackSpeech: string;
  socraticScaffold: string;
  encouragement: string;
  isComplete: boolean;
  icapLevel: 'Passive' | 'Active' | 'Constructive' | 'Interactive';
}

export interface DialogueTurn {
  id: string;
  speaker: 'tutor' | 'learner';
  text: string;
  audioPlayed?: boolean;
  timestamp: number;
  evaluation?: TurnEvaluation;
}

export interface SpeechSettings {
  isMuted: boolean;
  rate: number;
  pitch: number;
  selectedVoiceURI: string | null;
}
