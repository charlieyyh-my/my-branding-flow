// Domain types for BrandOS — mirror docs/DATA_MODEL.md

export type ContentStatus = "draft" | "in_review" | "approved" | "published";
export const CONTENT_STATUSES: ContentStatus[] = [
  "draft",
  "in_review",
  "approved",
  "published",
];

export const PLATFORMS = [
  "Instagram",
  "LinkedIn",
  "Facebook",
  "WhatsApp",
  "Website",
] as const;
export type Platform = (typeof PLATFORMS)[number];

export type CampaignStatus = "planned" | "active" | "completed";
export const CAMPAIGN_STATUSES: CampaignStatus[] = [
  "planned",
  "active",
  "completed",
];

export type LeadStatus =
  | "new"
  | "in_progress"
  | "closed_won"
  | "closed_lost";
export const LEAD_STATUSES: LeadStatus[] = [
  "new",
  "in_progress",
  "closed_won",
  "closed_lost",
];

export type Priority = "high" | "medium" | "low";
export const PRIORITIES: Priority[] = ["high", "medium", "low"];

export interface Campaign {
  id: string;
  user_id: string | null;
  created_at: string;
  name: string;
  objective: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
}

export interface WeeklyTheme {
  id: string;
  user_id: string | null;
  created_at: string;
  theme_name: string;
  week_start: string;
  guiding_message: string | null;
  campaign_id: string | null;
}

export interface ContentItem {
  id: string;
  user_id: string | null;
  created_at: string;
  title: string;
  platform: string;
  copy_body: string | null;
  visual_notes: string | null;
  scheduled_date: string | null;
  scheduled_time: string | null;
  status: string;
  campaign_id: string | null;
  weekly_theme_id: string | null;
  assigned_to: string | null;
  approver_notes: string | null;
  published_url: string | null;
  caption_draft: string | null;
  caption_source: string | null;
  caption_confidence: number | null;
  caption_review_status: string | null;
}

export interface MarketingAsset {
  id: string;
  user_id: string | null;
  created_at: string;
  name: string;
  asset_type: string | null;
  file_url: string | null;
  campaign_id: string | null;
  usage_notes: string | null;
  tags: string | null;
}

export interface SeoKeyword {
  id: string;
  user_id: string | null;
  created_at: string;
  keyword: string;
  category: string | null;
  priority: string | null;
  target_url: string | null;
  notes: string | null;
  relevance_score: number | null;
  relevance_source: string | null;
  relevance_confidence: number | null;
  relevance_review_status: string | null;
}

export interface BrandGuideline {
  id: string;
  user_id: string | null;
  created_at: string;
  section_title: string;
  content: string | null;
  display_order: number | null;
}

export interface LeadEnquiry {
  id: string;
  user_id: string | null;
  created_at: string;
  contact_name: string | null;
  company: string | null;
  enquiry_type: string | null;
  source: string | null;
  status: string;
  notes: string | null;
  follow_up_date: string | null;
}

export interface SocialPerformance {
  id: string;
  user_id: string | null;
  created_at: string;
  content_item_id: string | null;
  platform: string | null;
  reach: number | null;
  impressions: number | null;
  clicks: number | null;
  enquiries_generated: number | null;
  recorded_date: string | null;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  created_at: string;
  actor: string | null;
  action: string;
  object_type: string | null;
  object_id: string | null;
  old_value: unknown;
  new_value: unknown;
  risk_level: string | null;
}
