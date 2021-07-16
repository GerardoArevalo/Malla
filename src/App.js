import React from 'react';
import { Redirect, Switch, Route, BrowserRouter } from 'react-router-dom';
import Home from './views/Home.js';
import EditStructure from './views/EditStructure.js';
import Structure from './views/Structure.js';
import Grades from './views/Grades.js';
import NotFoundPage from './views/NotFoundPage.js';

function App() {
  return (
    <div>

      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/structure/:id" component={Structure} />
          <Route path="/structure/:id/edit" component={EditStructure} />
          <Route path="/structure/:id/grades" component={Grades} />
          <Route path="/404" component={NotFoundPage} />
          <Redirect to="/404" />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
