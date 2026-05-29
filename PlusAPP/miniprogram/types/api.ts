export type GameType = "quiz" | "match" | "level" | "rescue";
export type TaskType = "review" | "learn" | "quiz" | "match" | "level" | "wrongReview";
export type TaskStatus = "todo" | "doing" | "done";
export type QuestionSourceTag = "new" | "review" | "wrong";

export interface UserProfile {
  userId: string;
  nickname: string;
}

export interface TaskItem {
  id: string;
  type: TaskType;
  title: string;
  minutes: number;
  status: TaskStatus;
}

export interface DayPlan {
  day: number;
  title: string;
  targetTables: number[];
  tasks: Array<Omit<TaskItem, "status">>;
}

export interface ProgressState {
  currentDay: number;
  completedDays: number;
  continuousDays: number;
  stars: number[];
  todayMinutes: number;
  totalMinutes: number;
  todayTaskStatus: Partial<Record<TaskType, TaskStatus>>;
  masteredTables: number[];
  learningTables: number[];
  weakTables: number[];
}

export interface AppInitResponse {
  user: UserProfile;
  progress: ProgressState;
  entry: {
    hasWrongReview: boolean;
    todayTaskStatus: TaskStatus;
  };
}

export interface TodayTaskResponse {
  currentDay: number;
  dayTitle: string;
  todayProgress: number;
  todayTasks: TaskItem[];
}

export interface Question {
  id: string;
  table: number;
  multiplier: number;
  formula: string;
  answer: number;
  options: number[];
  rhymeText: string;
  difficulty: number;
  sourceTag: QuestionSourceTag;
  tags: string[];
}

export interface MatchCard {
  id: string;
  pairId: string;
  cardType: "formula" | "answer";
  content: string;
  status: "closed" | "opened" | "matched";
}

export interface VisualExample {
  formula: string;
  displayType: "dots" | "blocks" | "groups";
  expressionText: string;
}

export interface LearnContentResponse {
  day: number;
  dayTitle: string;
  targetTables: number[];
  rhymes: Question[];
  visualExample: VisualExample;
  tips: string[];
}

export interface SessionStartRequest {
  gameType: GameType;
  day: number;
  source: "daily" | "review" | "wrongbook";
}

export interface SessionStartResponse {
  sessionId: string;
  gameType: GameType;
  questions: Question[];
  cards?: MatchCard[];
}

export interface SessionAnswerRequest {
  sessionId: string;
  questionId: string;
  selectedAnswer: number;
  costMs: number;
}

export interface SessionAnswerResponse {
  correct: boolean;
  correctAnswer: number;
  rhymeText: string;
  comboCount: number;
  needExplain: boolean;
}

export interface RewardInfo {
  type: "star" | "badge" | "puzzle";
  count: number;
  title: string;
}

export interface SessionFinishResponse {
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
  elapsedSeconds: number;
  newMasteredItems: string[];
  weakItems: string[];
  reward: RewardInfo;
  nextAction: "home" | "wrongReview";
}

export interface AnswerRecord {
  questionId: string;
  selectedAnswer: number;
  correct: boolean;
  costMs: number;
}

export interface SessionRecord {
  sessionId: string;
  gameType: GameType;
  day: number;
  startedAt: string;
  finishedAt?: string;
  questions: Question[];
  answers: AnswerRecord[];
  totalQuestions: number;
  correctCount: number;
  elapsedSeconds: number;
}

export interface WrongItem {
  questionId: string;
  formula: string;
  answer: number;
  wrongCount: number;
  continuousWrongCount: number;
  lastWrongAt: string;
  mastered: boolean;
}

export interface WrongGroup {
  groupKey: string;
  groupTitle: string;
  items: WrongItem[];
}

export interface WrongbookResponse {
  totalWrongCount: number;
  todayWrongCount: number;
  priorityWrongCount: number;
  wrongGroups: WrongGroup[];
}

export interface WrongReviewStartResponse {
  sessionId: string;
  gameType: "rescue";
  wrongItems: Question[];
}

export interface ParentDashboardResponse {
  continuousDays: number;
  todayMinutes: number;
  totalMinutes: number;
  masteredTables: number[];
  learningTables: number[];
  weakTables: number[];
  topWrongItems: Array<Pick<WrongItem, "formula" | "wrongCount">>;
  tomorrowSuggestion: string;
}

export interface LoginUser {
  openid: string;
}

export interface WxLoginResponse {
  token: string;
  user: LoginUser;
  mode: "mock" | "live";
}

export interface MeResponse {
  user: LoginUser;
  loginAt: string;
  mode: "mock" | "live";
}
