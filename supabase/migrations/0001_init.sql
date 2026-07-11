create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  name text not null,
  objective text,
  start_date date,
  end_date date,
  status text not null default 'planned'
);
alter table campaigns enable row level security;
drop policy if exists "campaigns_v1_read" on campaigns;
create policy "campaigns_v1_read" on campaigns for select using (true);
drop policy if exists "campaigns_v1_write" on campaigns;
create policy "campaigns_v1_write" on campaigns for all using (true) with check (true);

create table if not exists weekly_themes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  theme_name text not null,
  week_start date not null,
  guiding_message text,
  campaign_id uuid references campaigns(id)
);
alter table weekly_themes enable row level security;
drop policy if exists "weekly_themes_v1_read" on weekly_themes;
create policy "weekly_themes_v1_read" on weekly_themes for select using (true);
drop policy if exists "weekly_themes_v1_write" on weekly_themes;
create policy "weekly_themes_v1_write" on weekly_themes for all using (true) with check (true);

create table if not exists content_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  title text not null,
  platform text not null,
  copy_body text,
  visual_notes text,
  scheduled_date date,
  scheduled_time time,
  status text not null default 'draft',
  campaign_id uuid references campaigns(id),
  weekly_theme_id uuid references weekly_themes(id),
  assigned_to text,
  approver_notes text,
  published_url text,
  caption_draft text,
  caption_source text,
  caption_confidence numeric,
  caption_review_status text default 'unreviewed'
);
alter table content_items enable row level security;
drop policy if exists "content_items_v1_read" on content_items;
create policy "content_items_v1_read" on content_items for select using (true);
drop policy if exists "content_items_v1_write" on content_items;
create policy "content_items_v1_write" on content_items for all using (true) with check (true);

create table if not exists marketing_assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  name text not null,
  asset_type text,
  file_url text,
  campaign_id uuid references campaigns(id),
  usage_notes text,
  tags text
);
alter table marketing_assets enable row level security;
drop policy if exists "marketing_assets_v1_read" on marketing_assets;
create policy "marketing_assets_v1_read" on marketing_assets for select using (true);
drop policy if exists "marketing_assets_v1_write" on marketing_assets;
create policy "marketing_assets_v1_write" on marketing_assets for all using (true) with check (true);

create table if not exists seo_keywords (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  keyword text not null,
  category text,
  priority text default 'medium',
  target_url text,
  notes text,
  relevance_score numeric,
  relevance_source text,
  relevance_confidence numeric,
  relevance_review_status text default 'unreviewed'
);
alter table seo_keywords enable row level security;
drop policy if exists "seo_keywords_v1_read" on seo_keywords;
create policy "seo_keywords_v1_read" on seo_keywords for select using (true);
drop policy if exists "seo_keywords_v1_write" on seo_keywords;
create policy "seo_keywords_v1_write" on seo_keywords for all using (true) with check (true);

create table if not exists brand_guidelines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  section_title text not null,
  content text,
  display_order integer default 0
);
alter table brand_guidelines enable row level security;
drop policy if exists "brand_guidelines_v1_read" on brand_guidelines;
create policy "brand_guidelines_v1_read" on brand_guidelines for select using (true);
drop policy if exists "brand_guidelines_v1_write" on brand_guidelines;
create policy "brand_guidelines_v1_write" on brand_guidelines for all using (true) with check (true);

create table if not exists leads_enquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  contact_name text,
  company text,
  enquiry_type text,
  source text,
  status text default 'new',
  notes text,
  follow_up_date date
);
alter table leads_enquiries enable row level security;
drop policy if exists "leads_enquiries_v1_read" on leads_enquiries;
create policy "leads_enquiries_v1_read" on leads_enquiries for select using (true);
drop policy if exists "leads_enquiries_v1_write" on leads_enquiries;
create policy "leads_enquiries_v1_write" on leads_enquiries for all using (true) with check (true);

create table if not exists social_performance (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  content_item_id uuid references content_items(id),
  platform text,
  reach integer default 0,
  impressions integer default 0,
  clicks integer default 0,
  enquiries_generated integer default 0,
  recorded_date date
);
alter table social_performance enable row level security;
drop policy if exists "social_performance_v1_read" on social_performance;
create policy "social_performance_v1_read" on social_performance for select using (true);
drop policy if exists "social_performance_v1_write" on social_performance;
create policy "social_performance_v1_write" on social_performance for all using (true) with check (true);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  actor text,
  action text not null,
  object_type text,
  object_id uuid,
  old_value jsonb,
  new_value jsonb,
  risk_level text
);
alter table audit_logs enable row level security;
drop policy if exists "audit_logs_v1_read" on audit_logs;
create policy "audit_logs_v1_read" on audit_logs for select using (true);
drop policy if exists "audit_logs_v1_write" on audit_logs;
create policy "audit_logs_v1_write" on audit_logs for all using (true) with check (true);

insert into campaigns (id, name, objective, start_date, end_date, status) values
  ('a1000000-0000-0000-0000-000000000001', 'Moutai CNY Heritage Series', 'Drive gifting enquiries for CNY season', '2025-01-06', '2025-02-05', 'active'),
  ('a1000000-0000-0000-0000-000000000002', 'Corporate Gifting Q1', 'Generate B2B leads from corporate buyers', '2025-01-13', '2025-03-31', 'active'),
  ('a1000000-0000-0000-0000-000000000003', 'Authenticity & Trust Brand Push', 'Reinforce Century Mark as Malaysia authorised importer', '2025-01-06', '2025-06-30', 'planned');

insert into weekly_themes (id, theme_name, week_start, guiding_message, campaign_id) values
  ('b1000000-0000-0000-0000-000000000001', 'Authenticity You Can Trust', '2025-01-13', 'Every bottle carries the seal of the only authorised Moutai importer in Malaysia.', 'a1000000-0000-0000-0000-000000000001'),
  ('b1000000-0000-0000-0000-000000000002', 'The Art of Gifting', '2025-01-20', 'Moutai is not just a gift — it is a statement of respect and prestige.', 'a1000000-0000-0000-0000-000000000001'),
  ('b1000000-0000-0000-0000-000000000003', 'Behind the Bottle', '2025-01-27', 'A heritage of 2000 years, brought directly to Malaysia by Century Mark Pacific.', 'a1000000-0000-0000-0000-000000000003');

insert into content_items (id, title, platform, copy_body, scheduled_date, status, campaign_id, weekly_theme_id, assigned_to) values
  ('c1000000-0000-0000-0000-000000000001', 'Why Authorised Matters — Instagram Carousel', 'Instagram', 'Only Century Mark Pacific is the authorised Moutai importer in Malaysia. Here is why that matters for every bottle you buy.', '2025-01-14', 'approved', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'Sarah Lim'),
  ('c1000000-0000-0000-0000-000000000002', 'CNY Corporate Gift Guide — LinkedIn Post', 'LinkedIn', 'Planning your CNY corporate gifts? Moutai Feitian sets a new standard for business relationships. Enquire now.', '2025-01-15', 'in_review', 'a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'Jason Tan'),
  ('c1000000-0000-0000-0000-000000000003', 'The Moutai Story — Facebook Video Caption', 'Facebook', '2000 years of baijiu heritage. One authorised home in Malaysia. Discover the story behind every bottle of Moutai.', '2025-01-16', 'draft', 'a1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000003', 'Wei Chen'),
  ('c1000000-0000-0000-0000-000000000004', 'Gifting Ritual Reel — Instagram Reel', 'Instagram', 'The perfect gift needs no explanation. Moutai says everything.', '2025-01-17', 'draft', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', 'Sarah Lim'),
  ('c1000000-0000-0000-0000-000000000005', 'Authorised Importer Badge — WhatsApp Broadcast', 'WhatsApp', 'Only Century Mark Pacific holds the official Moutai import licence in Malaysia. Share this with confidence.', '2025-01-18', 'published', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'Jason Tan');

insert into marketing_assets (id, name, asset_type, file_url, campaign_id, usage_notes) values
  ('d1000000-0000-0000-0000-000000000001', 'Moutai CNY Red Banner 1080x1080', 'image', 'https://placehold.co/1080x1080?text=Moutai+CNY+Banner', 'a1000000-0000-0000-0000-000000000001', 'Use for Instagram feed and Facebook posts only'),
  ('d1000000-0000-0000-0000-000000000002', 'Century Mark Logo Pack (White + Gold)', 'image', 'https://placehold.co/800x400?text=Logo+Pack', null, 'Official logo — do not stretch or recolour'),
  ('d1000000-0000-0000-0000-000000000003', 'Corporate Gift Set Product Shoot', 'image', 'https://placehold.co/1200x800?text=Gift+Set+Shoot', 'a1000000-0000-0000-0000-000000000002', 'Cleared for all platforms Q1 2025');

insert into seo_keywords (id, keyword, category, priority, target_url, notes) values
  ('e1000000-0000-0000-0000-000000000001', 'authorised Moutai importer Malaysia', 'brand authority', 'high', 'https://centurymarkpacific.com', 'Core differentiator — use in all meta descriptions'),
  ('e1000000-0000-0000-0000-000000000002', 'Moutai Malaysia price', 'product discovery', 'high', 'https://centurymarkpacific.com/shop', 'High search volume — include in product page copy'),
  ('e1000000-0000-0000-0000-000000000003', 'Chinese baijiu corporate gift Malaysia', 'lead generation', 'medium', 'https://centurymarkpacific.com/corporate', 'Target B2B segment in LinkedIn copy'),
  ('e1000000-0000-0000-0000-000000000004', 'buy genuine Moutai online Malaysia', 'trust/authenticity', 'high', 'https://centurymarkpacific.com', 'AI search answer-box opportunity');

insert into brand_guidelines (id, section_title, content, display_order) values
  ('f1000000-0000-0000-0000-000000000001', 'Brand Voice', 'Authoritative, warm, and trustworthy. Never casual or salesy. Speak as a knowledgeable custodian of heritage, not a vendor.', 1),
  ('f1000000-0000-0000-0000-000000000002', 'Messaging Pillars', '1. Only authorised Moutai importer in Malaysia. 2. 2000 years of baijiu heritage. 3. Trusted by corporate Malaysia. 4. Authenticity guaranteed.', 2),
  ('f1000000-0000-0000-0000-000000000003', 'Colour Palette', 'Primary: Deep Red #8B0000, Gold #C9A84C. Secondary: Ivory #F5F0E8. Never use off-brand colours in official posts.', 3),
  ('f1000000-0000-0000-0000-000000000004', 'Logo Rules', 'Always use approved logo files from the asset library. Minimum clear space: 20px. Never place on busy backgrounds without a white/dark overlay.', 4);

insert into leads_enquiries (id, contact_name, company, enquiry_type, source, status, notes, follow_up_date) values
  ('g1000000-0000-0000-0000-000000000001', 'David Khor', 'Petronas Dagangan', 'Corporate gifting — CNY', 'LinkedIn DM', 'new', 'Interested in 50-unit Feitian gift sets for CNY', '2025-01-16'),
  ('g1000000-0000-0000-0000-000000000002', 'Michelle Yeoh', 'CIMB Bank', 'Bulk purchase enquiry', 'Website contact form', 'in_progress', 'Needs quotation for 100 bottles across 3 variants', '2025-01-17'),
  ('g1000000-0000-0000-0000-000000000003', 'Raymond Lim', 'Self', 'Retail purchase', 'Instagram DM', 'closed_won', 'Purchased 2 bottles of Moutai 1935', null);