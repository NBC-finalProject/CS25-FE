import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LandingPage from "./components/LandingPage";
import QuizSection from "./components/sections/QuizSection";
import TodayEmailFormSection from "./components/sections/TodayEmailFormSection";
import VerificationEmailPage from "./components/VerificationEmailPage";
import TodayQuizPage from "./components/sections/TodayQuizSection";
import SubscriptionEditSection from "./components/sections/SubscriptionEditSection";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import SubscriptionModal from "./components/common/SubscriptionModal";
import { ModalProvider } from "./contexts/ModalContext";
import ModalManager from "./components/common/ModalManager";
import "./App.css";
import ProfileSection from "./components/sections/ProfileSection";

// React Query client 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <div className="App">
          <Router>
            <Header />
            <Routes>
              <Route
                path="/"
                element={
                  <LandingPage
                    onSubscribeClick={() => setIsSubscriptionModalOpen(true)}
                  />
                }
              />
              <Route path="/todayQuiz" element={<TodayQuizPage />} />
              <Route path="/quiz" element={<QuizSection />} />
              <Route path="/mailform" element={<TodayEmailFormSection />} />
              <Route
                path="/verification-email"
                element={<VerificationEmailPage />}
              />
              <Route
                path="/subscriptions/:subscriptionId"
                element={<SubscriptionEditSection />}
              />
              <Route path="/profile" element={<ProfileSection />} />
            </Routes>
            <Footer />
            <SubscriptionModal
              isOpen={isSubscriptionModalOpen}
              onClose={() => setIsSubscriptionModalOpen(false)}
            />
            <ModalManager />
          </Router>
        </div>
      </ModalProvider>
    </QueryClientProvider>
  );
}

export default App;
