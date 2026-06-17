import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { getUserProfile, getUserSettings, getUserStats } from '../services/userService.js';
import '../styles/dashboard.css';

function Dashboard() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const loadDashboard = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    setLoading(true);
    setError(false);

    try {
      const [profileData, statsData, settingsData] = await Promise.all([
        getUserProfile(user.id),
        getUserStats(user.id),
        getUserSettings(user.id)
      ]);

      setProfile(profileData);
      setStats(statsData);
      setSettings(settingsData);
    } catch (_error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
  }

  if (loading) {
    return <main className="page-center">Carregando...</main>;
  }

  if (error) {
    return (
      <main className="dashboard-page">
        <section className="dashboard-shell error-shell">
          <h1>AimBlitz</h1>
          <p>Erro ao carregar perfil. Tente novamente.</p>
          <button type="button" onClick={loadDashboard}>
            Tentar novamente
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-shell">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-kicker">AimBlitz</p>
            <h1>{profile?.username}</h1>
            <p>{profile?.email}</p>
          </div>
          <button type="button" onClick={handleLogout} disabled={loggingOut}>
            {loggingOut ? 'Saindo...' : 'Logout'}
          </button>
        </header>

        <div className="stats-grid">
          <article className="stat-card">
            <span>XP</span>
            <strong>{stats?.xp}</strong>
          </article>
          <article className="stat-card">
            <span>Total XP</span>
            <strong>{stats?.total_xp}</strong>
          </article>
          <article className="stat-card">
            <span>Level</span>
            <strong>{stats?.level}</strong>
          </article>
          <article className="stat-card">
            <span>Streak</span>
            <strong>{stats?.streak}</strong>
          </article>
        </div>

        <footer className="dashboard-footer">
          <span>Tema</span>
          <strong>{settings?.theme}</strong>
        </footer>
      </section>
    </main>
  );
}

export default Dashboard;
