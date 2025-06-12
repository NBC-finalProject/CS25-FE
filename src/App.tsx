import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import QuizSection from './components/sections/QuizSection';
import TodayEmailFormSection from './components/sections/TodayEmailFormSection';
import SubscriptionPage from './components/SubscriptionPage';
import VerificationEmailPage from './components/VerificationEmailPage';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import SubscriptionModal from './components/common/SubscriptionModal';
import LoginForm from './components/common/LoginForm';
import Modal from './components/common/Modal';
import './App.css';

function App() {
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="App">
      <Router>
        <Header onLoginClick={() => setIsLoginModalOpen(true)} />
        <Routes>
          <Route path="/" element={<LandingPage onSubscribeClick={() => setIsSubscriptionModalOpen(true)} />} />
          <Route path="/quiz" element={<QuizSection />} />
          <Route path="/mailform" element={<TodayEmailFormSection />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/verification-email" element={<VerificationEmailPage />} />
        </Routes>
        <Footer />
        <SubscriptionModal 
          isOpen={isSubscriptionModalOpen} 
          onClose={() => setIsSubscriptionModalOpen(false)} 
        />
        <Modal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          title="로그인"
        >
          <LoginForm />
        </Modal>
      </Router>
    </div>
  );
}

export default App;
