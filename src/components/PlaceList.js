import { useState } from 'react';
import { places, PLACE_TYPES } from '../data/places';
import PlaceCard from './PlaceCard';
import './PlaceList.css';

/**
 * Варіант 24: фільтрація місць за типом (пляжі, гірські курорти, міста тощо)
 * Завдання 3: керування станом (useState для фільтра)
 */
function PlaceList({ onAddToTrip }) {
  const [filterType, setFilterType] = useState('all');

  const filteredPlaces =
    filterType === 'all'
      ? places
      : places.filter((p) => p.type === filterType);

  const typeOptions = [
    { value: 'all', label: 'Усі' },
    ...Object.entries(PLACE_TYPES).map(([value, label]) => ({ value, label })),
  ];

  return (
    <section className="place-list-section">
      <h2>Місця для відвідування</h2>
      <p className="section-lead">
        Оберіть тип місця для фільтрації: пляжі, гірські курорти, міста тощо.
      </p>

      <div className="place-list-filters">
        <label htmlFor="filter-type">Тип місця:</label>
        <select
          id="filter-type"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="filter-select"
        >
          {typeOptions.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="place-list-grid">
        {filteredPlaces.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            onAddToTrip={onAddToTrip}
          />
        ))}
      </div>
      {filteredPlaces.length === 0 && (
        <p className="place-list-empty">Немає місць за обраним фільтром.</p>
      )}
    </section>
  );
}

export default PlaceList;
