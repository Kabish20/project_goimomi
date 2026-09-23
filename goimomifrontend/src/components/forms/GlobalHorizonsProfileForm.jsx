import React, { useEffect, useRef, useState } from 'react';
import api from '../../api';

const fields = [
  { name: 'full_name', label: 'Full Name', maxLength: 150, autoComplete: 'name' },
  { name: 'city', label: 'City', maxLength: 100, autoComplete: 'address-level2' },
  { name: 'country', label: 'Country', maxLength: 100, autoComplete: 'country-name' },
  { name: 'profession', label: 'Business / Profession', maxLength: 255 },
  { name: 'organization', label: 'Organization / Brand Name', maxLength: 255, autoComplete: 'organization' },
  { name: 'years_of_experience', label: 'Years of experience', type: 'number', min: 0, max: 100, step: 1 },
  { name: 'interests', label: 'Areas of interest or expertise', multiline: true, maxLength: 5000 },
  { name: 'website', label: 'Website', type: 'text', inputMode: 'url', optional: true, maxLength: 500, placeholder: 'example.com or instagram.com/yourprofile', autoComplete: 'url' },
  { name: 'email', label: 'Email address', type: 'email', maxLength: 254, autoComplete: 'email' },
  { name: 'connections_sought', label: 'What kind of connection are you looking for in Sri Lanka?', multiline: true, maxLength: 5000 },
];

const flightFields = [
  { name: 'arrival_date', label: 'Arrival Date', type: 'date' },
  { name: 'arrival_flight_no', label: 'Arrival Flight No', type: 'text', maxLength: 30 },
  { name: 'arrival_time', label: 'Arrival Time', type: 'time' },
  { name: 'return_date', label: 'Return Date', type: 'date' },
  { name: 'return_flight_no', label: 'Return Flight No', type: 'text', maxLength: 30 },
  { name: 'return_time', label: 'Return Time', type: 'time' },
];

export default function GlobalHorizonsProfileForm({ initialProfile, onSaved, onCancel }) {
  const [ticketStatus, setTicketStatus] = useState(initialProfile?.ticket_status || '');
  const [flights, setFlights] = useState(() => Object.fromEntries(flightFields.map(({ name }) => [name, initialProfile?.[name] ?? ''])));
  const [values, setValues] = useState(() => Object.fromEntries(fields.map(({ name }) => [name, initialProfile?.[name] ?? ''])));
  const [photo, setPhoto] = useState(null);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(initialProfile?.logo || '');
  const [preview, setPreview] = useState(initialProfile?.photo || '');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const submitting = useRef(false);
  const errorSummary = useRef(null);

  useEffect(() => {
    if (!photo) { setPreview(initialProfile?.photo || ''); return; }
    const url = URL.createObjectURL(photo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo, initialProfile?.photo]);

  useEffect(() => {
    if (!logo) { setLogoPreview(initialProfile?.logo || ''); return; }
    const url = URL.createObjectURL(logo);
    setLogoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [logo, initialProfile?.logo]);

  const chooseLogo = (event) => {
    const file = event.target.files?.[0];
    setLogo(null);
    setErrors(current => { const next = { ...current }; delete next.logo; return next; });
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      event.target.value = '';
      setErrors(current => ({ ...current, logo: 'Please choose a JPEG, PNG or WebP logo up to 5 MB.' }));
      return;
    }
    setLogo(file);
  };

  useEffect(() => {
    if (Object.keys(errors).length) errorSummary.current?.focus();
  }, [errors]);

  const choosePhoto = (event) => {
    const file = event.target.files?.[0];
    setPhoto(null);
    setErrors(current => { const next = { ...current }; delete next.photo; return next; });
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      event.target.value = '';
      setErrors({ photo: 'Please choose a JPEG, PNG or WebP photo smaller than 5 MB.' });
      return;
    }
    setPhoto(file);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setSaving(true);
    setErrors({});
    const payload = new FormData();
    fields.forEach(({ name }) => payload.append(name, String(values[name]).trim()));
    payload.append('ticket_status', ticketStatus);
    if (ticketStatus === 'booked') flightFields.forEach(({ name }) => payload.append(name, String(flights[name]).trim()));
    if (photo) payload.append('photo', photo);
    if (logo) payload.append('logo', logo);
    try {
      const response = initialProfile?.id
        ? await api.patch(`/api/global-horizons-srilanka/${initialProfile.id}/`, payload)
        : await api.post('/api/global-horizons-srilanka/', payload);
      onSaved(response.data);
    } catch (error) {
      const data = error.response?.data;
      setErrors(data && typeof data === 'object' ? data : { detail: 'Unable to save your profile. Please try again. Your details are still here.' });
    } finally {
      submitting.current = false;
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <p className="text-sm text-slate-500">Fields marked * are required.</p>
      {Object.keys(errors).length > 0 && <div ref={errorSummary} tabIndex={-1} role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        <p className="font-semibold">Please check your profile</p>
        <ul className="mt-2 list-disc pl-5">{Object.entries(errors).map(([key, value]) => <li key={key}>{[...fields, ...flightFields].find(field => field.name === key)?.label || (key === 'photo' ? 'Photo' : 'Submission')}: {Array.isArray(value) ? value.join(' ') : String(value)}</li>)}</ul>
      </div>}
      <fieldset disabled={saving} className="grid gap-3 sm:grid-cols-2 disabled:opacity-70">
        {fields.map(({ name, label, multiline, optional, ...inputProps }) => {
          const Control = multiline ? 'textarea' : 'input';
          return <div key={name} className={multiline ? 'sm:col-span-2' : ''}>
            <label htmlFor={`gh-${name}`} className="mb-1 block text-sm font-semibold text-slate-700">{label}{optional ? ' (optional)' : ' *'}</label>
            <Control {...inputProps} id={`gh-${name}`} name={name} required={!optional} rows={multiline ? 2 : undefined}
              value={values[name]} onChange={event => setValues({ ...values, [name]: event.target.value })}
              aria-invalid={Boolean(errors[name])} aria-describedby={[name === 'website' ? 'gh-website-help' : '', errors[name] ? `gh-error-${name}` : ''].filter(Boolean).join(' ') || undefined}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base sm:text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" />
            {name === 'website' && <p id="gh-website-help" className="mt-1 text-xs text-slate-500">Website, LinkedIn, Instagram, Facebook, YouTube or another web link. You can leave out https://.</p>}
            {errors[name] && <p id={`gh-error-${name}`} className="mt-1 text-sm text-red-700">{String(errors[name])}</p>}
          </div>;
        })}
        <fieldset className="min-w-0 rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 sm:col-span-2">
          <legend className="px-2 text-sm font-semibold text-slate-700">Ticket booking status *</legend>
          <div className="flex flex-wrap gap-3">
            {[['booked', 'Booked'], ['not_booked', 'Not Booked']].map(([value, label]) => <label key={value} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${ticketStatus === value ? 'border-emerald-700 bg-emerald-100 text-emerald-950' : 'border-slate-300 bg-white text-slate-700'}`}>
              <input type="radio" name="ticket_status" required value={value} checked={ticketStatus === value} onChange={() => { setTicketStatus(value); setErrors({}); }} />{label}
            </label>)}
          </div>
          {ticketStatus === 'booked' && <div className="mt-3">
            <p className="mb-3 text-xs leading-5 text-slate-600">Enter your arrival in Sri Lanka and return flight details. Use the local times shown on your tickets.</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {flightFields.map(({ name, label, ...props }) => <div key={name} className="min-w-0">
                <label htmlFor={`gh-${name}`} className="mb-1 block text-sm font-semibold text-slate-700">{label} *</label>
                <input {...props} id={`gh-${name}`} name={name} required value={flights[name]} min={name === 'return_date' ? flights.arrival_date || undefined : undefined}
                  onChange={event => setFlights({ ...flights, [name]: event.target.value })} aria-invalid={Boolean(errors[name])}
                  aria-describedby={errors[name] ? `gh-error-${name}` : undefined}
                  className="w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-base sm:text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" />
                {errors[name] && <p id={`gh-error-${name}`} className="mt-1 text-sm text-red-700">{String(errors[name])}</p>}
              </div>)}
            </div>
          </div>}
        </fieldset>
        <div className="rounded-xl border border-dashed border-emerald-300 bg-emerald-50/50 p-3 sm:col-span-2">
          <label htmlFor="gh-logo" className="mb-1 block text-sm font-semibold text-slate-700">Upload Organization / Brand Logo (optional)</label>
          <p id="gh-logo-help" className="mb-2 text-xs leading-5 text-slate-500">JPEG, PNG or WebP, up to 5 MB.{initialProfile?.logo ? ' Choose a file only to replace the existing logo.' : ''}</p>
          <input id="gh-logo" name="logo" type="file" accept="image/jpeg,image/png,image/webp"
            onChange={chooseLogo} aria-invalid={Boolean(errors.logo)} aria-describedby={`gh-logo-help${errors.logo ? ' gh-error-logo' : ''}`} className="block w-full text-sm" />
          {errors.logo && <p id="gh-error-logo" className="mt-1 text-sm text-red-700">{String(errors.logo)}</p>}
          {logoPreview && <img src={logoPreview} alt="Organization logo preview" className="mt-3 h-20 w-32 rounded-lg bg-white p-2 object-contain" />}
        </div>
        <div className="rounded-xl border border-dashed border-emerald-300 bg-emerald-50/50 p-3 sm:col-span-2">
          <label htmlFor="gh-photo" className="mb-1 block text-sm font-semibold text-slate-700">Upload Photo *</label>
          <p id="gh-photo-help" className="mb-2 text-xs leading-5 text-slate-500">JPEG, PNG or WebP, up to 5 MB.{initialProfile?.photo ? ' Choose a file only to replace the existing photo.' : ''}</p>
          <input id="gh-photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" required={!initialProfile?.photo}
            onChange={choosePhoto} aria-invalid={Boolean(errors.photo)} aria-describedby="gh-photo-help" className="block w-full text-sm" />
          {preview && <img src={preview} alt="Participant photo preview" className="mt-3 h-16 w-16 rounded-lg object-cover" />}
        </div>
      </fieldset>
      <p className="text-xs leading-5 text-slate-500">These details will help the Global Horizons team arrange thoughtful introductions with Tamil entrepreneurs in Colombo. After submission, your attending poster and profile booklet will be prepared automatically with your photo and logo.</p>
      <div className="flex flex-wrap gap-3">
        <button disabled={saving} type="submit" className="rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900 disabled:opacity-60">{saving ? 'Saving profile…' : initialProfile?.id ? 'Save changes' : 'Submit profile'}</button>
        {onCancel && <button disabled={saving} type="button" onClick={onCancel} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold">Cancel</button>}
      </div>
    </form>
  );
}
