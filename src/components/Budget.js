import { useState } from 'react';
import './Budget.css';

/**
 * Варіант 24: компонент бюджету
 * Завдання 3: керування станом (useState для budget, total)
 */
function Budget({ trips = [] }) {
  const [budgetLimit, setBudgetLimit] = useState(5000);
  const [saved, setSaved] = useState(false);

  const totalCost = trips.reduce((sum, p) => sum + (p.cost || 0), 0);
  const remaining = budgetLimit - totalCost;
  const isOverBudget = remaining < 0;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <section className="budget-section">
      <h2>Бюджет подорожі</h2>
      <p className="section-lead">
        Вкажіть максимальний бюджет та перегляньте суму обраних місць.
      </p>

      <div className="budget-form">
        <label htmlFor="budget-limit">Максимальний бюджет, грн:</label>
        <input
          id="budget-limit"
          type="number"
          min="0"
          step="100"
          value={budgetLimit}
          onChange={(e) => setBudgetLimit(Number(e.target.value) || 0)}
          className="budget-input"
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSave}
        >
          {saved ? 'Збережено!' : 'Зберегти бюджет'}
        </button>
      </div>

      <div className="budget-summary">
        <div className="budget-row">
          <span>Орієнтовна вартість обраних місць:</span>
          <strong>{totalCost} грн</strong>
        </div>
        <div className="budget-row">
          <span>Ваш бюджет:</span>
          <strong>{budgetLimit} грн</strong>
        </div>
        <div
          className={`budget-row budget-remaining ${isOverBudget ? 'over' : ''}`}
        >
          <span>Залишок:</span>
          <strong>{remaining} грн</strong>
        </div>
        {isOverBudget && (
          <p className="budget-warning">Бюджет перевищено. Оберіть менше місць або збільште бюджет.</p>
        )}
      </div>
    </section>
  );
}

export default Budget;
