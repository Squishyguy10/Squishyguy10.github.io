import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavBar } from './components/NaviBar';
import { Banner } from './components/Banner';
import { Projects } from './components/Projects';
import { Resume } from './components/Resume';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Banner />
      <Projects />
      <Resume />
    </div>
  );
}

export default App;
