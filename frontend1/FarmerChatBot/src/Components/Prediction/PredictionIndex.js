import React from 'react';
import Navbar from '../HomePage/Navbar';
import Footer from '../HomePage/Footer';
import Prediction from './Prediction';

function PredictionIndex() {
  return (
    <div>
      <Navbar />
      <Prediction />
      <Footer />
    </div>
  );
}

export default PredictionIndex;
