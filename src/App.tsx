import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { Layout } from './components/layout/Layout';

// Placeholder Components
import ContentGenerator from './components/generator/ContentGenerator';
import BrandKit from './components/brand-kit/BrandKit';
import GeoOptimizer from './components/seo-optimizer/GeoOptimizer';
import Settings from './components/settings/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ContentGenerator />} />
          <Route path="brand-kit" element={<BrandKit />} />
          <Route path="geo" element={<GeoOptimizer />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
