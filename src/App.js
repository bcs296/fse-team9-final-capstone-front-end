import { NewsReader } from './components/NewsReader';
import './App.css';

function App() {

  return (
    <div className="fullApp">
      <header>
        <p>News Reader App</p>
      </header>
      <div class="display">
        <NewsReader />
      </div>
    </div>
  );
}

export default App;