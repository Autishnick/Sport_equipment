import PlaceList from '../components/PlaceList';

function PlacesPage({ onAddToTrip }) {
  return (
    <main className="page-content">
      <PlaceList onAddToTrip={onAddToTrip} />
    </main>
  );
}

export default PlacesPage;
