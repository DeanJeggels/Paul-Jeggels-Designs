import React, { useRef } from 'react';

// Google Places address autocomplete, restricted to South Africa.
// The Maps JS (~150KB) is lazy-loaded on first focus so it never touches
// initial page load. Degrades to a plain text input when the key is missing
// or the script fails, so the form keeps working either way.
// NOTE: browser Maps keys are public by design — protection comes from the
// key's referrer restriction (pauljeggelsdesigns.co.za) in Google Cloud
// Console, which MUST stay configured. Override via VITE_GOOGLE_MAPS_KEY.
const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY || 'AIzaSyAHlxI6cdrUMAkTA7pCCRQLRPgjiAHOF1s';

let mapsPromise;
function loadMaps() {
  mapsPromise ||= new Promise((resolve, reject) => {
    if (window.google?.maps?.places) return resolve(window.google.maps);
    window.__pjdMapsReady = () => resolve(window.google.maps);
    const s = document.createElement('script');
    s.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&libraries=places&v=weekly&loading=async&callback=__pjdMapsReady`;
    s.async = true;
    s.onerror = () => reject(new Error('Google Maps failed to load'));
    document.head.appendChild(s);
  });
  return mapsPromise;
}

export default function AddressField({ value, onChange, className, placeholder = 'Start typing your address...', ariaLabel = 'Delivery address' }) {
  const inputRef = useRef(null);
  const attached = useRef(false);

  const attach = async () => {
    if (attached.current || !MAPS_KEY) return;
    attached.current = true;
    try {
      const maps = await loadMaps();
      if (maps.places?.Autocomplete && inputRef.current) {
        const ac = new maps.places.Autocomplete(inputRef.current, {
          componentRestrictions: { country: 'za' },
          fields: ['formatted_address'],
          types: ['address'],
        });
        ac.addListener('place_changed', () => {
          const place = ac.getPlace();
          if (place?.formatted_address) onChange(place.formatted_address);
        });
      }
    } catch {
      // Script blocked or failed: the field stays a normal text input.
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={attach}
      placeholder={placeholder}
      aria-label={ariaLabel}
      autoComplete="street-address"
      className={className}
    />
  );
}
