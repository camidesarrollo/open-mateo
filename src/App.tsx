import { useEffect, useMemo, useState } from 'react';
import './App.css';
import type { Temperatures } from './types/temperatures.types';
import type { ArchiveTemperatures } from './types/archiveTemperatures.types';
import type { WeatherDay } from './types/weather';
import { addDays, hoyISO, getOffsetLabel } from './helper/time';
import { computeAnomalies } from './utils/anomalies';
import { normalizeData } from './helper/normalizcionDatos';
import { DayCapsule } from './page/dashboard/componet/DayCapsule';
import { DashboardPage } from './page/dashboard/DashboardPage';


function App() {
 

  return (
    <div className="w-full pt-16 bg-surface min-h-screen">
      <div className="flex flex-col w-full">
          <div className="w-full px-space-lg py-space-md flex flex-col gap-space-lg max-w-[1600px] mx-auto">
            <DashboardPage />
          </div>
          
      </div>
       
    </div>
   
  );
}

export default App;