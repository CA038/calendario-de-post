export type ViewType = 'dashboard' | 'clients' | 'calendar' | 'contracts' | 'accounting' | 'settings';

export type ClientCategory = 'active' | 'social_media' | 'lead' | 'inactive';
export type PaymentStatus = 'paid' | 'pending' | 'overdue';
export type CurrencyType = 'HNL' | 'USD';
export type PostContentType = 'post' | 'reel' | 'story';
export type PostStatusType = 'idea' | 'design' | 'ready' | 'published';

export interface Client {
  id: number | string;
  name: string;
  brandName?: string;
  category: ClientCategory;
  email?: string;
  phone?: string;
  secondaryPhone?: string;
  websiteUrl?: string;
  notes?: string;
  brandColor: string;
  logoText: string;
  logoUrl?: string;
  planName: string;
  monthlyPostsLimit: number;
  monthlyReelsLimit: number;
  storiesCount: number;
  currency: CurrencyType;
  monthlyPrice: number;
  billingDay: number;
  isActive: boolean;
  accessToken?: string;
  createdAt: string;
}

export interface Contract {
  id: number | string;
  clientId?: number | string | null;
  clientName: string;
  brandName?: string;
  planName: string;
  postsCount: number;
  reelsCount: number;
  storiesCount: number;
  currency: CurrencyType;
  price: number;
  startDate?: string;
  duration: string;
  firstMonthTerms: string;
  recurringDay: string;
  revisions: string;
  customNotes?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Payment {
  id: number | string;
  receiptFolio: string;
  clientId?: number | string | null;
  clientName: string;
  brandName?: string;
  month: number;
  year: number;
  paidDate: string;
  currency: CurrencyType;
  amount: number;
  method: string;
  status: PaymentStatus;
  reference?: string;
  description?: string;
  createdAt: string;
}

export interface CalendarPost {
  id: number | string;
  clientId?: number | string | null;
  clientName: string;
  brandColor: string;
  title: string;
  postType: PostContentType;
  status: PostStatusType;
  scheduledDate: string; // YYYY-MM-DD
  notes?: string;
  createdAt?: string;
}

export interface AccountingSummary {
  month: number;
  year: number;
  totalProjected: number;
  totalCollected: number;
  pendingAmount: number;
  totalClientsActive: number;
  payments: Payment[];
}

export interface DeliverablePlan {
  id: string;
  name: string;
  price: number;
  posts: number;
  reels: number;
  stories: number;
  currency: CurrencyType;
  badge?: string;
  popular?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}
