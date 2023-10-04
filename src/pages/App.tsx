import { HashRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';
import WebForm from './WebForm';
import HTTPForm from './HTTPForm';

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/http-form" element={<HTTPForm />} />
        <Route path="/web-form" element={<WebForm />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
