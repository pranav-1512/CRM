import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import  "antd/dist/reset.css"
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import LoadingWrapper from './Pages/User/Loader/LoadingWrapper';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <LoadingWrapper>
      <App />
    </LoadingWrapper>
    </BrowserRouter>
  </React.StrictMode>
);
