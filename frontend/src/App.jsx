import { Routes, Route } from 'react-router-dom'
import  AuthApp  from './Apps/AuthApp'
import  VisitorApp  from './Apps/VisitorApp'
import AdminApp from './Apps/AdminApp'
import ResidentApp from './Apps/ResidentApp'

import React, { useEffect } from 'react';
import { useListingStore } from './store/listing';


function App() {

  const initializeSocketListeners = useListingStore(
    (state) => state.initializeSocketListeners
  );

  useEffect(() => {
    initializeSocketListeners();
  }, [initializeSocketListeners]);

  return (
      <Routes>
        <Route path="/auth/*" element={<AuthApp />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/resident/*" element={<ResidentApp />} />
        <Route path="/*" element={<VisitorApp />} />
      </Routes>
  )
}

export default App