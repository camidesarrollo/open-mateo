import './App.css';
import { DashboardPage } from './page/dashboard/DashboardPage';
import { CityProvider } from './context/CityContext';


function App() {
 

  return (
    <div className="w-full pt-16 bg-surface min-h-screen">
      <div className="flex flex-col w-full">
          <div className="w-full px-space-lg py-space-md flex flex-col gap-space-lg max-w-[1600px] mx-auto">
            <CityProvider>
              <DashboardPage />
            </CityProvider>
          </div>
          
      </div>
       
    </div>
   
  );
}

export default App;