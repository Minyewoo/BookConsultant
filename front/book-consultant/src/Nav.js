import React from "react";

export default class Nav extends React.Component {
    render() {
        return (
            <nav>
                <React.NavLink exact to="/">Поиск</React.NavLink>
                <React.NavLink to="/genres">Жанры</React.NavLink>
                <React.NavLink to="/books">Жанры</React.NavLink>
                <React.NavLink to="/ratings">Жанры</React.NavLink>
                <React.NavLink to="/tags">Жанры</React.NavLink>
            </nav>
        );
    }
}