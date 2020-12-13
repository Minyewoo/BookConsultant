import React from "react";

export default class Genres extends React.Component {
    state = {
        genres: []
    };

    currentGenre = {
        genreName: "",
        bookIsbnNumbers: []
    }

    currentBooksNumbers = [];

    async componentDidMount() {
        let result = await fetch(`http://localhost:5000/genres`);
        
        let genres = await result.json();

        this.setState({
            genres: genres
        });
    }

    render() {
        return (
            <div>
                <div>
                    <p>
                        <label htmlFor="genreName">Имя жанра</label><br/>
                        <input id="genreName" type="text" placeholder="Сказки" onChange={this.handleGenreNameChange} />
                    </p>
                    <p>
                        <label htmlFor="bookIsbnNumbers">Номера книг</label><br/>
                        <input id="bookIsbnNumbers" type="text" placeholder="123, 321, 456" onChange={this.handleBooksNumbersChange} />
                    </p>
                    <p>
                        <button onClick={this.handleAddGenre}>Добавить</button>
                    </p>
                </div>
                {this.state.genres.map((genre, genreIndex) => {
                    return (
                        <div>
                            <p>{genreIndex + 1}: {genre.name} <span genreIndex={genreIndex} onClick={this.handleRemoveGenre}>X</span></p>
                                {genre.booksIsbnNumbers.map((bookIsbnNumber, bookIndex) => {
                                    return (
                                        <p>{bookIsbnNumber} <span genreIndex={genreIndex} bookIndex={bookIndex} onClick={this.handleRemoveBookIsbnNumber}>X</span></p>
                                    );
                                })}
                            <p>
                                <input genreIndex={genreIndex} type="text" placeholder="123321" onChange={this.handleBookNumberChange} />
                                <button genreIndex={genreIndex} onClick={this.handleAddBookNumber}>Добавить номер книги</button>
                            </p>
                            <br/>
                        </div>
                    );
                })}
            </div>
        );
    }

    handleGenreNameChange = e => {
        this.currentGenre[e.target.id] = e.target.value;
    }

    handleBooksNumbersChange = e => {
        this.currentGenre[e.target.id] = e.target.value.split(', ');
    }

    handleAddGenre = async e => {
        let result = await fetch(`http://localhost:5000/genres`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Name: this.currentGenre.genreName,
                BooksIsbnNumbers: this.currentGenre.bookIsbnNumbers
            })
        });

        if (result.ok) {
            let addedGenre = await result.json();
            this.state.genres.splice(0, 0, addedGenre);
            this.setState(this.state);
        } else {
            let errorMessage = await result.text();
            alert(`${result.status}: ${errorMessage}`);
        }
    }

    handleRemoveGenre = async e => {
        let genreIndex = parseInt(e.target.attributes.genreIndex.value);

        let result = await fetch(`http://localhost:5000/genres?name=${this.state.genres[genreIndex].name}`, {
            method: 'DELETE'
        });

        if (result.ok) {
            this.state.genres.splice(genreIndex, 1);
            this.setState(this.state);
        } else {
            let errorMessage = await result.text();
            alert(`${result.status}: ${errorMessage}`);
        }
    }

    handleRemoveBookIsbnNumber = async e => {
        let genreIndex = parseInt(e.target.attributes.genreIndex.value);
        let bookIndex = parseInt(e.target.attributes.bookIndex.value);
        let genre = this.state.genres[genreIndex];
        let removedBook = genre.booksIsbnNumbers.splice(bookIndex, 1)[0];

        let result = await fetch(`http://localhost:5000/genres`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(genre)
        })

        if (result.ok) {
            let updatedGenre = await result.json();
            this.state.genres[genreIndex] = updatedGenre;
            this.setState(this.state);
        } else {
            let errorMessage = await result.text();
            alert(`${result.status}: ${errorMessage}`);
        }
    }

    handleBookNumberChange = e => {
        let genreIndex = parseInt(e.target.attributes.genreIndex.value);
        this.currentBooksNumbers[genreIndex] =  e.target.value;
    }

    handleAddBookNumber = async e => {
        let genreIndex = parseInt(e.target.attributes.genreIndex.value);
        let genre = this.state.genres[genreIndex];
        let bookNumber = this.currentBooksNumbers[genreIndex];
        genre.booksIsbnNumbers.splice(0, 0, bookNumber);

        let result = await fetch(`http://localhost:5000/genres`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(genre)
        })

        if (result.ok) {
            let updatedGenre = await result.json();
            this.state.genres[genreIndex] = updatedGenre;
            this.setState(this.state);
        } else {
            let errorMessage = await result.text();
            alert(`${result.status}: ${errorMessage}`);
        }
    }
}