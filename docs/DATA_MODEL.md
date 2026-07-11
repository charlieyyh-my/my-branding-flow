# Data Model

## campaigns
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | owner at lock-down |
| name | text | |
| objective | text | |
| start_date | date | |
| end_date | date | |
| status | text | planned / active / completed |
| created_at | timestamptz | |

## weekly_themes
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| theme_name | text | |
| week_start | date | Monday of the week |
| guiding_message | text | |
| campaign_id | uuid FK → campaigns | |

## content_items
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| title | text | |
| platform | text | Instagram / LinkedIn / Facebook / WhatsApp / Website |
| copy_body | text | |
| visual_notes | text | |
| scheduled_date | date | |
| scheduled_time | time | |
| status | text | draft / in_review / approved / published |
| campaign_id | uuid FK → campaigns | |
| weekly_theme_id | uuid FK → weekly_themes | |
| assigned_to | text | |
| approver_notes | text | |
| published_url | text | |
| caption_draft | text | **AI field** |
| caption_source | text | e.g. "gpt-4o" |
| caption_confidence | numeric | 0–1 |
| caption_review_status | text | unreviewed / accepted / rejected |

## marketing_assets
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| name | text | |
| asset_type | text | image / video / document |
| file_url | text | |
| campaign_id | uuid FK → campaigns nullable | |
| usage_notes | text | |
| tags | text | |

## seo_keywords
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| keyword | text | |
| category | text | |
| priority | text | high / medium / low |
| target_url | text | |
| notes | text | |
| relevance_score | numeric | **AI field** |
| relevance_source | text | |
| relevance_confidence | numeric | |
| relevance_review_status | text | unreviewed / accepted / rejected |

## brand_guidelines
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| section_title | text | |
| content | text | rich text / markdown |
| display_order | integer | |

## leads_enquiries
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| contact_name | text | |
| company | text | |
| enquiry_type | text | |
| source | text | |
| status | text | new / in_progress / closed_won / closed_lost |
| notes | text | |
| follow_up_date | date | |

## social_performance
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| content_item_id | uuid FK → content_items | |
| platform | text | |
| reach | integer | |
| impressions | integer | |
| clicks | integer | |
| enquiries_generated | integer | |
| recorded_date | date | |

## audit_logs
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| actor | text | email or name |
| action | text | e.g. status_changed |
| object_type | text | |
| object_id | uuid | |
| old_value | jsonb | |
| new_value | jsonb | |
| risk_level | text | low / medium / high / critical |

## RLS
All tables: v1 open read + write policies (any visitor). Replaced with `auth.uid() = user_id` + role checks at lock-down sprint.
