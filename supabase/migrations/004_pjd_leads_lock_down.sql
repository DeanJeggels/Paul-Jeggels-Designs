-- Only the submit-lead function writes enquiries, and only Paul's email shows them (review of PR #3, 18 Nov 2026).
--
-- Before this, three policies left the table open to anyone holding a key for this shared project:
--   anon_insert_leads  anyone with the public key could insert rows directly, skipping submit-lead's checks;
--   auth_select_leads  any signed-in user of ANY app on this project could read every lead (names, emails, phones);
--   auth_update_leads  ... and change them.
-- Nothing reads or writes pjd_leads except submit-lead, which uses the service role and bypasses row level security, so
-- dropping the policies and the table grants leaves enquiries working and closes the rest. RLS stays on.
drop policy if exists anon_insert_leads on public.pjd_leads;
drop policy if exists auth_select_leads on public.pjd_leads;
drop policy if exists auth_update_leads on public.pjd_leads;
revoke all on table public.pjd_leads from anon, authenticated;
