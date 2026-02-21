import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getEquipmentFromFirestore, seedEquipment } from '../services/firestore';
import { equipment as localEquipment, SPORT_TYPES } from '../data/equipment';
import EquipmentCard from '../components/EquipmentCard';
import './Equipment.css';

/**
 * Лабораторна №4: обладнання з Firestore; орендувати можуть лише авторизовані.
 */
function Equipment({ onRent }) {
  const { user } = useAuth();
  const [sportFilter, setSportFilter] = useState('all');
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seedLoading, setSeedLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const list = await getEquipmentFromFirestore();
        if (!cancelled) {
          setEquipmentList(list.length ? list : localEquipment);
          setLoadError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setEquipmentList(localEquipment);
          setLoadError(err.message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const handleSeed = async () => {
    setSeedLoading(true);
    try {
      await seedEquipment(localEquipment);
      const list = await getEquipmentFromFirestore();
      setEquipmentList(list);
    } catch (err) {
      console.error(err);
    } finally {
      setSeedLoading(false);
    }
  };

  const filteredEquipment = useMemo(() => {
    if (sportFilter === 'all') return equipmentList;
    return equipmentList.filter((item) => item.sportType === sportFilter);
  }, [equipmentList, sportFilter]);

  const sportOptions = [
    { value: 'all', label: 'Усі види спорту' },
    ...Object.entries(SPORT_TYPES).map(([value, label]) => ({ value, label })),
  ];

  if (loading) {
    return (
      <main className="page-content equipment-page">
        <div className="equipment-page-inner">
          <p className="equipment-loading">Завантаження обладнання...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page-content equipment-page">
      <div className="equipment-page-inner">
        <h1 className="page-title">Обладнання для оренди</h1>
        <p className="page-lead">
          Оберіть тип спорту для фільтрації. Додавати до кошика можуть лише авторизовані користувачі.
        </p>
        {loadError && (
          <p className="equipment-fallback">
            Дані з Firebase недоступні, показано локальний список. {loadError}
          </p>
        )}
        {equipmentList.length === 0 && (
          <div className="equipment-seed">
            <p>У базі ще немає обладнання.</p>
            <button type="button" className="btn btn-primary" onClick={handleSeed} disabled={seedLoading}>
              {seedLoading ? 'Завантаження...' : 'Завантажити приклад обладнання в Firestore'}
            </button>
          </div>
        )}

        <div className="equipment-filter">
          <label htmlFor="sport-filter" className="equipment-filter-label">
            Фільтр за типом спорту:
          </label>
          <select
            id="sport-filter"
            className="equipment-filter-select"
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
          >
            {sportOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {!user && (
          <p className="equipment-login-hint">
            <strong>Увійдіть</strong>, щоб додавати обладнання до кошика та оформлювати оренду.
          </p>
        )}

        <div className="equipment-grid">
          {filteredEquipment.map((item) => (
            <EquipmentCard
              key={item.id}
              item={item}
              onRent={user ? onRent : null}
            />
          ))}
        </div>

        {filteredEquipment.length === 0 && equipmentList.length > 0 && (
          <p className="equipment-empty">Немає обладнання для обраного типу спорту.</p>
        )}
      </div>
    </main>
  );
}

export default Equipment;
