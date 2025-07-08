import { BrowserRouter, Routes, Route } from 'react-router-dom'
import routes from './router';
import Navbar from './Navbar';

function renderRoutes(routes) {
  return routes.map(({ path, element, children }, index) => (
    <Route key={index} path={path} element={element}>
      {children && renderRoutes(children)}
    </Route>
  ));
}

function App() {
  return (
    <>
        <Navbar />
        <Routes>
        {renderRoutes(routes)}
        </Routes>
    </>
  );
}
export default App