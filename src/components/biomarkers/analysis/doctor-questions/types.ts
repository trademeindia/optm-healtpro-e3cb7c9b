
export interface Question {
  text: string;
  answer?: string;
  sources?: string[];
  votes?: {
    helpful: number;
    notHelpful: number;
  };
  userVoted?: 'helpful' | 'notHelpful' | null;
  favorited?: boolean;
}
