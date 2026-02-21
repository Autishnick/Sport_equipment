import TravelList from '../components/TravelList';

function MyTripsPage({ trips, onRemoveFromTrip }) {
  return (
    <main className="page-content">
      <TravelList trips={trips} onRemove={onRemoveFromTrip} />
    </main>
  );
}

export default MyTripsPage;
