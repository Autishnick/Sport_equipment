import { PLACE_TYPES } from '../data/places';
import './TravelList.css';

/**
 * Варіант 24: компонент списку подорожей
 * Завдання 2: компонент з props (trips)
 */
function TravelList({ trips, onRemove }) {
  if (!trips || trips.length === 0) {
    return (
      <section className="travel-list-section">
        <h2>Мої подорожі</h2>
        <p className="section-lead">Список обраних місць для відвідування.</p>
        <p className="travel-list-empty">Ви ще не додали жодного місця. Оберіть місця на сторінці «Місця для відвідування».</p>
      </section>
    );
  }

  return (
    <section className="travel-list-section">
      <h2>Мої подорожі</h2>
      <p className="section-lead">Список обраних місць для відвідування.</p>
      <ul className="travel-list">
        {trips.map((place) => (
          <li key={place.id} className="travel-list-item">
            <div className="travel-list-item-info">
              <strong>{place.title}</strong>
              <span className="travel-list-item-type">
                {PLACE_TYPES[place.type] || place.type}
              </span>
              <span className="travel-list-item-cost">{place.cost} грн</span>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-remove"
              onClick={() => onRemove(place.id)}
              aria-label={`Видалити ${place.title}`}
            >
              Видалити
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default TravelList;
