import React from 'react';
import VisitPeriodPicker from './VisitPeriodPicker/VisitPeriodPicker';
import './styles/buttons.css';
import './styles/arrows.css';
import './styles/utils.css';
import './App.css';

function App() {
  const now = new Date();
  const blacklist = [new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 20)];
  const updated = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, now.getHours());
  return (
    <div className="container">
      <div className="container__item border">
        <VisitPeriodPicker price={199} averageRating={.88} numberOfRatings={1254} blacklist={blacklist} updated={updated} onSave={console.log}></VisitPeriodPicker>
      </div>
    </div>
  );
}

export default App;
