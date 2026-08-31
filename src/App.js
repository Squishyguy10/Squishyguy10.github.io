import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavBar } from './components/NaviBar';
import { Banner } from './components/Banner';
import { Projects } from './components/Projects';
import { Sandbox } from './components/Sandbox';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Banner />
      <Projects />
      <Sandbox />
    </div>
  );
}

export default App;
