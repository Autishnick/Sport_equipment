import { PLACE_TYPES } from '../data/places';
import './PlaceCard.css';

/**
 * Варіант 24: картка місця для відвідування
 * Завдання 2: компонент з props
 */
function PlaceCard({ place, onAddToTrip }) {
  const typeLabel = PLACE_TYPES[place.type] || place.type;

  return (
    <article className="place-card">
      <div className="place-card-image">
        <img src={place.image} alt={place.title} width="400" height="300" />
        <span className="place-card-type">{typeLabel}</span>
      </div>
      <div className="place-card-body">
        <h3 className="place-card-title">{place.title}</h3>
        <p className="place-card-desc">{place.description}</p>
        <p className="place-card-cost">Від {place.cost} грн</p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => onAddToTrip(place)}
        >
          Додати до подорожі
        </button>
      </div>
    </article>
  );
}

export default PlaceCard;
