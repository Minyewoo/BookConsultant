import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Consultant from './Consultant';
import {Route, BrowserRouter as Router, NavLink, Switch} from 'react-router-dom';
import Genres from './Genres';
import Tags from './Tags';
import Ratings from './Ratings';
import Books from './Books';

ReactDOM.render(
    <Router>
      <div>
        <nav>
          <NavLink exact to="/">Консультант</NavLink>
          <NavLink to="/genres">Жанры</NavLink>
          <NavLink to="/books">Книги</NavLink>
          <NavLink to="/ratings">Рейтинги </NavLink>
          <NavLink to="/tags">Теги</NavLink>
        </nav>
        <Switch>
          <Route exact path="/" component={Consultant} />
          <Route path="/genres" component={Genres} />
          <Route path="/tags" component={Tags} />
          <Route path="/ratings" component={Ratings} />
          <Route path="/books" component={Books} />
        </Switch>
      </div>
    </Router>,
  document.getElementById('root')
);