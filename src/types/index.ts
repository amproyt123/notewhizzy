
export interface VideoDetails {
  id: string;
  title: string;
  thumbnailUrl: string;
  channelTitle: string;
  duration?: string;
}

export interface SummaryRequest {
  videoUrl: string;
  detailLevel: 'concise' | 'detailed' | 'comprehensive';
}

export interface SummaryResponse {
  videoDetails: VideoDetails;
  summary: string;
  keyPoints: string[];
  notes: string;
  timestamp: number;
}

export enum ProcessingStatus {
  IDLE = 'idle',
  VALIDATING = 'validating',
  EXTRACTING = 'extracting',
  ANALYZING = 'analyzing',
  SUMMARIZING = 'summarizing',
  FORMATTING = 'formatting',
  COMPLETED = 'completed',
  ERROR = 'error'
}
