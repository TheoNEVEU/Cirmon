import { useEffect, useState } from 'react';
import { useUser } from '../contexts/userContext';
import { useApiSocket } from '../contexts/ApiSocketContext';

type BadgeForm = {
  _id?: string;
  key: string;
  label: string;
  image: string;
  description?: string;
  rarity?: string;
  baseLevel?: number;
  maxLevel?: number;
};

type BadgeFormAdvanced = BadgeForm & {
  unlockConditions?: string;
  levelUpConditions?: string;
  upgradeCosts?: string;
};

export default function AdminBadges() {
  const { user } = useUser();
  const { baseUrl } = useApiSocket();

  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState<BadgeForm | null>(null);
  const [form, setForm] = useState<BadgeForm>({ key: '', label: '', image: '', description: '', rarity: 'common', baseLevel: 0, maxLevel: 5 });
  const [advancedForm, setAdvancedForm] = useState<BadgeFormAdvanced>({...form, unlockConditions: '{}', levelUpConditions: '[]', upgradeCosts: '[]' });

  useEffect(() => {
    if (!user || !user.isAdmin) return;
    fetchBadges();
  }, [user]);

  async function fetchBadges() {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${baseUrl}/admin/badges`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setBadges(data.badges || []);
      else setError(data.message || 'API error');
    } catch (e:any) {
      setError(e.message);
    }
    setLoading(false);
  }

  function startCreate() {
    setEditing(null);
    setForm({ key: '', label: '', image: '', description: '', rarity: 'common', baseLevel: 0, maxLevel: 5 });
    setAdvancedForm({ key: '', label: '', image: '', description: '', rarity: 'common', baseLevel: 0, maxLevel: 5, unlockConditions: '{}', levelUpConditions: '[]', upgradeCosts: '[]' });
  }

  function startEdit(b:any) {
    setEditing(b);
    setForm({ _id: b._id, key: b.key, label: b.label, image: b.image, description: b.description || '', rarity: b.rarity || 'common', baseLevel: b.baseLevel ?? 0, maxLevel: b.maxLevel ?? 5 });
    setAdvancedForm({
      ...form,
      _id: b._id,
      key: b.key,
      label: b.label,
      image: b.image,
      description: b.description || '',
      rarity: b.rarity || 'common',
      baseLevel: b.baseLevel ?? 0,
      maxLevel: b.maxLevel ?? 5,
      unlockConditions: JSON.stringify(b.unlockConditions || {}, null, 2),
      levelUpConditions: JSON.stringify(b.levelUpConditions || [], null, 2),
      upgradeCosts: JSON.stringify(b.upgradeCosts || [], null, 2)
    });
  }

  async function submitForm(e?: any) {
    if (e) e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) return setError('No token');
      const body = { ...form };
      // Parse JSON fields
      try {
        body.unlockConditions = advancedForm.unlockConditions ? JSON.parse(advancedForm.unlockConditions) : {};
        body.levelUpConditions = advancedForm.levelUpConditions ? JSON.parse(advancedForm.levelUpConditions) : [];
        body.upgradeCosts = advancedForm.upgradeCosts ? JSON.parse(advancedForm.upgradeCosts) : [];
      } catch (parseErr:any) {
        return setError(`JSON parse error: ${parseErr.message}`);
      }
      let res;
      if (editing && editing._id) {
        res = await fetch(`${baseUrl}/admin/badges/${editing._id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
      } else {
        res = await fetch(`${baseUrl}/admin/badges`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
      }
      const data = await res.json();
      if (!data.success) return setError(data.message || 'API error');
      await fetchBadges();
      setEditing(null);
    } catch (e:any) {
      setError(e.message);
    }
  }

  async function removeBadge(id:string) {
    if (!confirm('Supprimer ce badge ?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${baseUrl}/admin/badges/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!data.success) return setError(data.message || 'API error');
      await fetchBadges();
    } catch (e:any) { setError(e.message); }
  }

  if (!user) return <div>Accès non autorisé — connecte toi.</div>;
  if (!user.isAdmin) return <div>Accès réservé aux administrateurs.</div>;

  return (
    <div className="page-container admin-badges">
      <h2>Administration — Badges</h2>
      {loading ? <p>Chargement...</p> : (
        <>
          <button onClick={startCreate}>Créer un badge</button>
          {error && <p style={{color:'red'}}>{error}</p>}
          <div style={{display:'flex', gap:20, marginTop:12}}>
            <div style={{flex:1}}>
              <h3>Liste</h3>
              <table style={{width:'100%'}}>
                <thead><tr><th>key</th><th>label</th><th>image</th><th>rarity</th><th>actions</th></tr></thead>
                <tbody>
                  {badges.map(b => (
                    <tr key={b._id}>
                      <td>{b.key}</td>
                      <td>{b.label}</td>
                      <td>{b.image}</td>
                      <td>{b.rarity}</td>
                      <td>
                        <button onClick={() => startEdit(b)}>Éditer</button>
                        <button onClick={() => removeBadge(b._id)}>Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{width:360}}>
              <h3>{editing ? 'Éditer' : 'Créer'}</h3>
              <form onSubmit={submitForm}>
                <div><label>key<br/><input value={form.key} onChange={e => setForm({...form, key: e.target.value})} required/></label></div>
                <div><label>label<br/><input value={form.label} onChange={e => setForm({...form, label: e.target.value})} required/></label></div>
                <div><label>image<br/><input value={form.image} onChange={e => setForm({...form, image: e.target.value})} required/></label></div>
                <div><label>description<br/><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></label></div>
                <div><label>rarity<br/><input value={form.rarity} onChange={e => setForm({...form, rarity: e.target.value})} /></label></div>
                <div><label>baseLevel<br/><input type="number" value={form.baseLevel} onChange={e => setForm({...form, baseLevel: parseInt(e.target.value||"0")})} /></label></div>
                <div><label>maxLevel<br/><input type="number" value={form.maxLevel} onChange={e => setForm({...form, maxLevel: parseInt(e.target.value||"5")})} /></label></div>
                
                <hr style={{margin: '12px 0'}}/>
                <h4 style={{marginBottom: 8}}>Conditions avancées (JSON)</h4>
                
                <div><label style={{fontSize:12}}>unlockConditions<br/><textarea value={advancedForm.unlockConditions||''} onChange={e => setAdvancedForm({...advancedForm, unlockConditions: e.target.value})} style={{width:'100%', height: 70, fontFamily:'monospace', fontSize: 11, padding: 4}} placeholder='{"type": "stat", "params": {...}}'/></label></div>
                
                <div style={{marginTop:6}}><label style={{fontSize:12}}>levelUpConditions<br/><textarea value={advancedForm.levelUpConditions||''} onChange={e => setAdvancedForm({...advancedForm, levelUpConditions: e.target.value})} style={{width:'100%', height: 70, fontFamily:'monospace', fontSize: 11, padding: 4}} placeholder='[{"level": 1, "type": "...", "params": {...}}]'/></label></div>
                
                <div style={{marginTop:6}}><label style={{fontSize:12}}>upgradeCosts<br/><textarea value={advancedForm.upgradeCosts||''} onChange={e => setAdvancedForm({...advancedForm, upgradeCosts: e.target.value})} style={{width:'100%', height: 70, fontFamily:'monospace', fontSize: 11, padding: 4}} placeholder='[{"level": 1, "cost": 100, "currency": "..."}]'/></label></div>
                
                <div style={{marginTop:8}}>
                  <button type="submit">Enregistrer</button>
                  <button type="button" onClick={() => { setEditing(null); startCreate(); }}>Annuler</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
