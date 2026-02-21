import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Equipment from './pages/Equipment';
import Rentals from './pages/Rentals';
import Payment from './pages/Payment';
import Feedback from './pages/Feedback';
import './App.css';

/**
 * Лабораторна №3 + №4, Варіант 23: платформа оренди спортивного обладнання.
 * №4: автентифікація (Firebase Auth), оренди тільки для авторизованих, Firestore для обладнання та оренд.
 */
function App() {
  const [rentals, setRentals] = useState([]);

  const handleRent = (item) => {
    setRentals((prev) => {
      if (prev.some((r) => r.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const handleRemoveRental = (id) => {
    setRentals((prev) => prev.filter((r) => r.id !== id));
  };

  const handlePaymentSuccess = () => {
    setRentals([]);
  };

  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="app">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/equipment" element={<Equipment onRent={handleRent} />} />
            <Route
              path="/rentals"
              element={
                <ProtectedRoute>
                  <Rentals rentals={rentals} onRemove={handleRemoveRental} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <Payment
                    rentals={rentals}
                    onRemove={handleRemoveRental}
                    onPaymentSuccess={handlePaymentSuccess}
                  />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
