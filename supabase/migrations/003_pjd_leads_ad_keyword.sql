-- Which Google ad keyword brought a lead (Dean, 18 Nov 2026: "I would like to know which clients came through ads").
-- The submit-lead function only ever writes a plain keyword of at most 80 characters, or nothing (adKeyword.ts); the check
-- below is the same limit, so a lead is never refused over it. Apply before deploying the submit-lead function that writes it.
alter table public.pjd_leads add column if not exists ad_keyword text
  constraint pjd_leads_ad_keyword_length check (ad_keyword is null or char_length(ad_keyword) <= 80);
