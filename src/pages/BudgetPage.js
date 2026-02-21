import Budget from '../components/Budget';

function BudgetPage({ trips }) {
  return (
    <main className="page-content">
      <Budget trips={trips} />
    </main>
  );
}

export default BudgetPage;
