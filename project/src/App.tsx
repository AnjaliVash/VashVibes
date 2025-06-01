import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import PeoplePage from './pages/PeoplePage';
import PersonDetailPage from './pages/PersonDetailPage';
import RelationshipsPage from './pages/RelationshipsPage';
import SearchResultsPage from './pages/SearchResultsPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/people" element={<PeoplePage />} />
              <Route path="/people/:id" element={<PersonDetailPage />} />
              <Route path="/relationships" element={<RelationshipsPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
            </Routes>
          </main>
          <footer className="bg-white border-t border-gray-200 py-6">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p>Family Faces - Remember your loved ones and their relationships</p>
            </div>
          </footer>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;