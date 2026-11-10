import React from 'react';

// POPIA s18(2)(a) wants the notice in front of people BEFORE they hand over
// their details, so this sits above every form's submit button, not only in
// the footer. Opens in a new tab so a half-filled form (two of them are
// modals) isn't lost. All forms sit on the dark background.
const PrivacyNote = ({ className = '' }) => (
  <p className={`text-white/60 text-xs leading-relaxed font-body ${className}`}>
    We use your details only to reply to you and handle your board.{' '}
    <a
      href="/privacy/"
      target="_blank"
      rel="noopener"
      className="underline text-white/80 hover:text-white transition-colors"
    >
      Privacy policy
    </a>
  </p>
);

export default PrivacyNote;
