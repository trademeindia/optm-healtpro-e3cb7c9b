

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
  // Add user_id for Supabase integration later when saving questions
  user_id?: string;
}

