import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api';
import AdminSidebar from '../../../components/admin/AdminSidebar/AdminSidebar';
import AdminTopbar from '../../../components/admin/AdminTopbar/AdminTopbar';
import GlobalHorizonsProfileForm from '../../../components/forms/GlobalHorizonsProfileForm';

export default function GlobalHorizonsManage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState('');
  const [exporting, setExporting] = useState('');
  const [exportError, setExportError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  const handleDelete = async (profile) => {
    if (!profile?.id || deletingId) return;
    const confirmed = window.confirm(`Are you sure you want to delete the profile for "${profile.full_name}"?`);
    if (!confirmed) return;

    setDeletingId(profile.id);
    setNotice('');
    setDeleteError('');
    try {
      await api.delete(`/api/global-horizons-srilanka/${profile.id}/`);
      setProfiles(current => current.filter(item => item.id !== profile.id));
      if (selected?.id === profile.id) {
        setSelected(null);
        setEditing(false);
      }
      setNotice(`Profile for "${profile.full_name}" deleted successfully.`);
    } catch {
      setDeleteError('Unable to delete participant profile. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const download = async (fileType) => {
    if (exporting) return;
    setExporting(fileType);
    setExportError('');
    try {
      const { data } = await api.get('/api/global-horizons-srilanka/export/', {
        params: { file_type: fileType, search: search.trim() }, responseType: 'blob',
      });
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `global-horizons-srilanka-${new Date().toISOString().slice(0, 10)}.${fileType}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setExportError('Unable to download profiles. Please try again.');
    } finally { setExporting(''); }
  };

  const load = async () => {
    setLoading(true);
    setError('');
    try { const { data } = await api.get('/api/global-horizons-srilanka/'); setProfiles(data); }
    catch { setError('Unable to load participant profiles. Please try again.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const saved = (profile) => {
    setProfiles(current => [profile, ...current.filter(item => item.id !== profile.id)]);
    setSelected(profile);
    setEditing(false);
    setNotice('Profile saved successfully.');
  };
  const query = search.trim().toLowerCase();
  const filtered = profiles.filter(profile => ['full_name', 'city', 'country', 'profession', 'organization', 'email', 'interests', 'connections_sought'].some(key => String(profile[key] || '').toLowerCase().includes(query)));

  return <div className="flex h-full overflow-hidden bg-gray-100">
    <AdminSidebar />
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <AdminTopbar />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div><h1 className="text-2xl font-bold text-slate-900">Global Horizons - Srilanka</h1><p className="mt-1 text-sm text-slate-500">Participant profiles for entrepreneur introductions in Colombo</p></div>
          <div className="flex flex-wrap gap-2">
            <Link to="/globalhorizonssrilanka" target="_blank" rel="noreferrer" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold">Open participant form</Link>
            <button onClick={() => { setSelected(null); setEditing(true); setNotice(''); setDeleteError(''); }} className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white">Add profile</button>
          </div>
        </header>
        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
          Share this participant form: <a className="break-all underline" href="/globalhorizonssrilanka" target="_blank" rel="noreferrer">{window.location.origin}/globalhorizonssrilanka</a>
        </div>
        {notice && <p role="status" className="mb-4 text-sm font-semibold text-emerald-800">{notice}</p>}
        {deleteError && <p role="alert" className="mb-4 text-sm font-semibold text-red-700">{deleteError}</p>}
        {editing ? <section className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold">{selected ? 'Edit participant profile' : 'Add participant profile'}</h2>
          <GlobalHorizonsProfileForm key={selected?.id || 'new'} initialProfile={selected} onSaved={saved} onCancel={() => setEditing(false)} />
        </section> : selected ? <section className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-wrap justify-between gap-3">
            <button onClick={() => setSelected(null)} className="text-sm font-semibold text-slate-600">← All profiles</button>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                aria-label={`Delete profile for ${selected.full_name}`}
                onClick={() => handleDelete(selected)}
                disabled={deletingId === selected.id}
                className="rounded-lg border border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
              >
                {deletingId === selected.id ? 'Deleting…' : 'Delete profile'}
              </button>
              <button onClick={() => setEditing(true)} className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white">Edit profile</button>
            </div>
          </div>
          <img src={selected.photo} alt={selected.full_name} className="mb-5 h-36 w-36 rounded-xl object-cover" />
          <h2 className="text-2xl font-bold">{selected.full_name}</h2>
          <dl className="mt-5 grid gap-5 sm:grid-cols-2">
            {[
              ['City & Country', `${selected.city}, ${selected.country}`], ['Business / Profession', selected.profession],
              ['Organization / Brand Name', selected.organization || '—'], ['Years of experience', selected.years_of_experience],
              ['Areas of interest or expertise', selected.interests], ['Website', selected.website || '—'],
              ['Email address', selected.email], ['Connections sought in Sri Lanka', selected.connections_sought],
              ['Ticket booking status', selected.ticket_status === 'booked' ? 'Booked' : 'Not Booked'],
              ...(selected.ticket_status === 'booked' ? [
                ['Arrival Date', selected.arrival_date], ['Arrival Flight No', selected.arrival_flight_no], ['Arrival Time', selected.arrival_time],
                ['Return Date', selected.return_date], ['Return Flight No', selected.return_flight_no], ['Return Time', selected.return_time],
              ] : []),
              ['Submitted', new Date(selected.created_at).toLocaleString()],
            ].map(([label, value]) => <div key={label}><dt className="text-sm font-semibold text-slate-500">{label}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-slate-900">{value}</dd></div>)}
          </dl>
        </section> : <section className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <label htmlFor="gh-search" className="text-sm font-semibold">Search profiles</label>
            <input id="gh-search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Name, company, city or expertise" className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2" />
            <button onClick={load} disabled={loading} className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-50">Refresh</button>
          </div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <button onClick={() => download('xlsx')} disabled={loading || Boolean(error) || !filtered.length || Boolean(exporting)} className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{exporting === 'xlsx' ? 'Preparing Excel…' : 'Download Excel'}</button>
            <button onClick={() => download('pdf')} disabled={loading || Boolean(error) || !filtered.length || Boolean(exporting)} className="rounded-lg border border-emerald-800 px-4 py-2 text-sm font-semibold text-emerald-800 disabled:opacity-50">{exporting === 'pdf' ? 'Preparing PDF…' : 'Download PDF'}</button>
            <span className="text-xs text-slate-500">Downloads include the profiles matching your search.</span>
          </div>
          {exportError && <p role="alert" className="mb-4 text-sm text-red-700">{exportError}</p>}
          {loading ? <p role="status" className="py-10 text-center text-slate-500">Loading profiles…</p> : error ? <p role="alert" className="py-6 text-red-700">{error}</p> : <>
            <p className="mb-3 text-sm text-slate-500">{filtered.length} of {profiles.length} participant profiles</p>
            {!filtered.length ? <p className="py-10 text-center text-slate-500">{query ? 'No profiles match your search.' : 'No profiles yet. Share the form to collect participant details.'}</p> : <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-slate-50 text-slate-600"><tr>{['Participant', 'City & Country', 'Business / Profession', 'Organization', 'Submitted', 'Action'].map(label => <th key={label} className="px-3 py-3 font-semibold">{label}</th>)}</tr></thead>
                <tbody>{filtered.map(profile => <tr key={profile.id} className="border-b last:border-0">
                  <td className="px-3 py-4"><div className="flex items-center gap-3"><img loading="lazy" src={profile.photo} alt="" className="h-10 w-10 rounded-full object-cover" /><div><p className="font-semibold">{profile.full_name}</p><p className="text-slate-500">{profile.email}</p></div></div></td>
                  <td className="px-3 py-4">{profile.city}, {profile.country}</td><td className="px-3 py-4">{profile.profession}</td><td className="px-3 py-4">{profile.organization || '—'}</td>
                  <td className="whitespace-nowrap px-3 py-4">{new Date(profile.created_at).toLocaleDateString()}</td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-3">
                      <button aria-label={`View profile for ${profile.full_name}`} onClick={() => { setSelected(profile); setNotice(''); setDeleteError(''); }} className="font-semibold text-emerald-800 underline">View profile</button>
                      <button
                        aria-label={`Delete profile for ${profile.full_name}`}
                        onClick={() => handleDelete(profile)}
                        disabled={deletingId === profile.id}
                        className="font-semibold text-rose-700 underline hover:text-rose-900 disabled:opacity-50"
                      >
                        {deletingId === profile.id ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>)}</tbody>
              </table>
            </div>}
          </>}
        </section>}
      </div>
    </div>
  </div>;
}
