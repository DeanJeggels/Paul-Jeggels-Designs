import React, { useId, useRef, useState } from 'react';
import { COMMON_COUNTRIES, OTHER_COUNTRIES } from '../data/countries';

// libphonenumber's "max" metadata is the only build that actually validates.
// The default export and /min are the same bundle, and for South Africa /min
// accepts every correctly-lengthed number including unallocated prefixes, so
// it would pass exactly the broken numbers this field exists to catch.
// ~57kB gzipped, so it is dynamically imported on first focus and never
// touches the initial bundle. Same approach as AddressField.
let libPromise;
function loadLib() {
  libPromise ||= Promise.all([
    import('libphonenumber-js/max'),
    import('libphonenumber-js/examples.mobile.json'),
  ])
    .then(([lib, examples]) => ({ lib, examples: examples.default || examples }))
    .catch(() => {
      // Clear the memo so a later focus retries. Caching the failure would
      // disable validation for the rest of the session after one dropped
      // request.
      libPromise = undefined;
      return null;
    });
  return libPromise;
}

const DEFAULT_COUNTRY = 'ZA';

// libphonenumber catches truncated South African landlines and 06x/07x
// mobiles on its own, but NOT the 08x mobile range: its ZA pattern covers
// variable-length service numbers, so 082 960 935 (a digit short) parses as a
// perfectly "valid" MOBILE. Personal numbers are always 9 national digits, so
// those two types get an explicit length rule.
//
// Service ranges are left to the library, because they legitimately run to 10
// digits (0861 123 4567 is a real UAN). Forcing 9 here would reject numbers
// customers actually have, and a rejected real number costs more than an
// accepted bad one.
const STRICT_NINE = new Set(['MOBILE', 'FIXED_LINE', 'FIXED_LINE_OR_MOBILE']);

function lengthAllowed(parsed) {
  if (parsed.country !== 'ZA') return true;
  const length = String(parsed.nationalNumber).length;
  return STRICT_NINE.has(parsed.getType()) ? length === 9 : length === 9 || length === 10;
}

// Obvious junk people put in an optional field. Cheap to catch before parsing.
const JUNK = /^(n\/?a|none|nil|no|-+|\.+|0+)$/i;

/**
 * Evaluate a national number against a country.
 * Returns { valid, e164, national, country }. When the library is unavailable
 * the input is accepted rather than blocked: losing a real lead to a failed
 * script load is worse than letting one bad number through.
 */
function evaluate(bundle, iso, raw) {
  const text = (raw || '').trim();
  if (!text) return { valid: true, e164: '', national: '', country: iso };
  if (JUNK.test(text)) return { valid: false, e164: '', national: text, country: iso };
  if (!bundle) return { valid: true, e164: text, national: text, country: iso };

  const { parsePhoneNumberFromString } = bundle.lib;
  // A pasted "+27 82 ..." carries its own country, so honour it and let the
  // select follow. Otherwise the digits are national to the chosen country.
  const parsed = text.startsWith('+')
    ? parsePhoneNumberFromString(text)
    : parsePhoneNumberFromString(text, iso);

  if (!parsed || !parsed.isValid() || !lengthAllowed(parsed)) {
    return { valid: false, e164: '', national: text, country: parsed?.country || iso };
  }
  return {
    valid: true,
    e164: parsed.number,
    national: parsed.formatNational(),
    intl: parsed.formatInternational(),
    country: parsed.country || iso,
  };
}

function exampleFor(bundle, iso) {
  if (!bundle) return '';
  try {
    return bundle.lib.getExampleNumber(iso, bundle.examples)?.formatNational() || '';
  } catch {
    return '';
  }
}

/**
 * Phone input split into a country <select> and a national number <input>.
 *
 * Native select on purpose: it gets keyboard support, type-ahead, the OS
 * picker on mobile and correct screen reader behaviour for free, where a
 * custom combobox would put all of that at risk.
 *
 * onChange(value, meta) fires with the E.164 string once valid (empty while
 * invalid or blank) and meta.valid so the parent can block submission.
 */
export default function PhoneField({
  onChange,
  className = '',
  selectClassName = '',
  wrapperClassName = '',
  label = 'Phone Number',
  hideLabel = false,
  labelClassName = 'block text-white/70 text-xs font-bold tracking-widest uppercase mb-2 font-body',
  defaultCountry = DEFAULT_COUNTRY,
}) {
  const uid = useId();
  const numberId = `phone-${uid}`;
  const countryId = `phone-country-${uid}`;
  const hintId = `phone-hint-${uid}`;
  const errorId = `phone-error-${uid}`;

  const [country, setCountry] = useState(defaultCountry);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [example, setExample] = useState('');
  // Read-back of the number we actually resolved. A visitor who leaves the
  // country on the South Africa default and types their own national number
  // can land on a number that is valid but not theirs: an Australian 0412 345
  // 678 parses as a perfectly good ZA +27412345678. Nothing errors, because
  // nothing is wrong with it. Showing the resolved country back is what makes
  // that visible.
  const [resolved, setResolved] = useState(null);
  const bundleRef = useRef(null);
  const erroredOnce = useRef(false);
  // warm() resolves long after the render that started it, so it cannot read
  // country/text from that closure.
  const countryRef = useRef(defaultCountry);
  const textRef = useRef('');

  const nameOf = (iso) =>
    [...COMMON_COUNTRIES, ...OTHER_COUNTRIES].find(([c]) => c === iso)?.[2] || iso;

  const publish = (result) => {
    setResolved(result.valid && result.e164 && result.intl
      ? { intl: result.intl, country: nameOf(result.country) }
      : null);
    onChange?.(result.valid ? result.e164 : '', { valid: result.valid, country: result.country });
  };

  const messageFor = (iso) => {
    const ex = exampleFor(bundleRef.current, iso);
    const name = nameOf(iso);
    return ex
      ? `That number does not look right for ${name}. Try the format ${ex}.`
      : `That number does not look right for ${name}. Check the digits and try again.`;
  };

  // Pull the library in on first focus, then refresh the format hint.
  const warm = async () => {
    if (bundleRef.current) return;
    const bundle = await loadLib();
    if (!bundle) return;
    bundleRef.current = bundle;
    const iso = countryRef.current;
    setExample(exampleFor(bundle, iso));
    // Anything typed while the metadata was still downloading was accepted
    // unchecked. Re-check it now, or a fast typist on a slow connection skips
    // validation entirely and an unreachable number goes straight through.
    if (textRef.current) {
      const result = evaluate(bundle, iso, textRef.current);
      if (!result.valid) erroredOnce.current = true;
      setError(result.valid ? '' : messageFor(iso));
      publish(result);
    }
  };

  const runValidation = (iso, value) => {
    const result = evaluate(bundleRef.current, iso, value);
    if (result.valid) {
      setError('');
      // Tidy the display once, on blur, so the caret never jumps mid-typing.
      if (result.national && result.national !== value) {
        setText(result.national);
        textRef.current = result.national;
      }
      if (result.country && result.country !== iso) {
        setCountry(result.country);
        countryRef.current = result.country;
        setExample(exampleFor(bundleRef.current, result.country));
      }
    } else {
      erroredOnce.current = true;
      setError(messageFor(iso));
    }
    publish(result);
    return result;
  };

  const handleInput = (e) => {
    const next = e.target.value;
    setText(next);
    textRef.current = next;
    warm();
    // Reward early, punish late: only re-check while an error is on screen,
    // so the message clears the moment it is fixed.
    if (erroredOnce.current) {
      const result = evaluate(bundleRef.current, country, next);
      setError(result.valid ? '' : messageFor(country));
      publish(result);
    } else {
      publish(evaluate(bundleRef.current, country, next));
    }
  };

  const handleCountry = (e) => {
    const iso = e.target.value;
    setCountry(iso);
    countryRef.current = iso;
    setExample(exampleFor(bundleRef.current, iso));
    const result = evaluate(bundleRef.current, iso, text);
    if (erroredOnce.current) setError(result.valid ? '' : messageFor(iso));
    publish(result);
  };

  const hint = resolved
    ? `Reading this as ${resolved.intl} (${resolved.country}). Change the country if that is wrong.`
    : example
      ? `Format: ${example}`
      : 'Include your area or mobile code.';

  return (
    <div className={wrapperClassName}>
      <label htmlFor={numberId} className={hideLabel ? 'sr-only' : labelClassName}>
        {label}
      </label>

      {/* Sizing lives on the wrappers. Callers pass class strings that already
          contain w-full, so putting w-[42%] on the select itself would leave two
          competing width utilities whose winner depends on CSS source order. */}
      <div className="flex gap-2">
        <div className="w-[42%] sm:w-[38%] shrink-0">
        <select
          id={countryId}
          aria-label="Country calling code"
          autoComplete="tel-country-code"
          value={country}
          onChange={handleCountry}
          onFocus={warm}
          className={`${selectClassName} w-full`}
        >
          <optgroup label="Common">
            {COMMON_COUNTRIES.map(([iso, dial, name]) => (
              <option key={iso} value={iso}>{`${name} (+${dial})`}</option>
            ))}
          </optgroup>
          <optgroup label="All countries">
            {OTHER_COUNTRIES.map(([iso, dial, name]) => (
              <option key={iso} value={iso}>{`${name} (+${dial})`}</option>
            ))}
          </optgroup>
        </select>
        </div>

        <div className="flex-1 min-w-0">
        <input
          id={numberId}
          type="tel"
          autoComplete="tel-national"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
          maxLength={24}
          placeholder={example || '82 960 9353'}
          value={text}
          onChange={handleInput}
          onFocus={warm}
          onBlur={() => runValidation(country, text)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') runValidation(countryRef.current, textRef.current);
          }}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={`${hintId} ${errorId}`}
          className={`${className} w-full`}
        />
        </div>
      </div>

      <p id={hintId} className={`text-xs mt-2 font-body ${resolved ? 'text-pjd-teal' : 'text-white/60'}`}>
        {hint}
      </p>
      {/* Always mounted. A live region added only on first failure never
          announces, because it did not exist when its content changed. */}
      <p id={errorId} aria-live="polite" className="text-red-400 text-xs mt-1 font-body empty:mt-0">
        {error}
      </p>
    </div>
  );
}
