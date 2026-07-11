# Intelligence Layer

## Messy Inputs
- Free-text content briefs from chat / email
- Raw social performance screenshots
- Ad-hoc keyword lists from search tools
- Verbal brand guidelines living in someone's head

## Auto-Structure Schema (example)
```json
{
  "content_item": {
    "title": "Why Authorised Matters",
    "platform": "Instagram",
    "copy_body": "Only Century Mark Pacific...",
    "campaign_id": "a100...",
    "weekly_theme_id": "b100...",
    "scheduled_date": "2025-01-14",
    "caption_draft": "Authorised. Authentic. Only from Century Mark Pacific. 🇲🇾 #Moutai #MalaysiaAuthorised",
    "caption_source": "gpt-4o",
    "caption_confidence": 0.82,
    "caption_review_status": "unreviewed"
  }
}
```

## Events to Track
- Content item created, status changed, published
- Lead enquiry logged, status updated
- Campaign start/end
- Asset uploaded
- Brand guideline edited

## Scoring Rules (rule-based v1)
- **Content consistency score:** keyword match vs brand messaging pillars (word overlap, 0–1)
- **Keyword priority:** manually set high/medium/low; AI relevance_score added later
- **Lead quality:** source × enquiry_type lookup table → numeric tier (1–3)

## What Gets Ranked
- Content items: overdue drafts ranked by days past scheduled date
- Keywords: ranked by priority then by relevance_score
- Leads: ranked by follow_up_date ascending

## v1 vs Later
| v1 (rule-based) | Later (AI-assisted) |
|---|---|
| Status-driven content pipeline | AI caption draft from brief |
| Manual keyword priority | AI relevance scoring vs SERP data |
| Manual lead status | AI lead quality classification |
| Brand consistency checklist | Auto-flag copy that breaks voice guidelines |
