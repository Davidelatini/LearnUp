import { useEffect, useState } from 'react';

const SERVER = 'http://localhost:3001';

export default function useSystemStats(intervalMs = 60000) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchStats = () =>
      fetch(`${SERVER}/stats`)
        .then((response) => response.json())
        .then((data) => {
          if (!cancelled) setStats(data);
        })
        .catch(() => {});

    fetchStats();
    const id = window.setInterval(fetchStats, intervalMs);

    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [intervalMs]);

  return stats;
}
