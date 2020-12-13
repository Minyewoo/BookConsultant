import React from "react";

export default class Books extends React.Component {
    state = {
        books: []
    }

    currentBook = {};

    currentBookAuthors = [];
    currentBookNames = [];
    currentBookWrittenYears = [];

    async componentDidMount() {
        let result = await fetch(`http://localhost:5000/books`);
        
        let books = await result.json();

        this.setState({
            books: books
        });
    }

    render() {
        return (
            <div>
                <div>
                    <p>
                        <label htmlFor="isbnNumber">Номер книги</label><br/>
                        <input id="isbnNumber" type="text" placeholder="123456" onChange={this.handleTextChange} />
                    </p>
                    <p>
                        <label htmlFor="name">Имя книги</label><br/>
                        <input id="name" type="text" placeholder="Война И Мир" onChange={this.handleTextChange} />
                    </p>
                    <p>
                        <label htmlFor="writtenYear">Год написания</label><br/>
                        <input id="writtenYear" type="text" placeholder="1855" onChange={this.handleIntegerNumberChange} />
                    </p>
                    <p>
                        <label htmlFor="authors">Авторы</label><br/>
                        <input id="authors" type="text" placeholder="Пушкин, Толстой" onChange={this.handleAuthorsChange} />
                    </p>
                    <p>
                        <button onClick={this.handleAddBook}>Добавить</button>
                    </p>
                </div>
                {this.state.books.map((book, bookIndex) => {
                    return (
                        <div>
                            <p>{bookIndex + 1}: {book.isbnNumber} <span bookIndex={bookIndex} onClick={this.handleRemoveBook}>X</span></p>
                            <p>{book.name}</p>
                            <p>{book.writtenYear}</p>
                            {book.authors.map((author, authorIndex) => {
                                return (
                                    <p>{author} <span bookIndex={bookIndex} authorIndex={authorIndex} onClick={this.handleRemoveAuthor}>X</span></p>
                                );
                            })}
                            <p>
                                <input bookIndex={bookIndex} id="Name" type="text" placeholder="Война И Мир" onChange={this.handleBookTextChange} />
                                <button bookIndex={bookIndex} onClick={this.handleUpdateNameBook}>Изменить имя книги</button>
                            </p>
                            <p>
                                <input bookIndex={bookIndex} id="WrittenYear" type="text" placeholder="1855" onChange={this.handleBookIntegerNumberChange} />
                                <button bookIndex={bookIndex} onClick={this.handleUpdateWrittenYearBook}>Изменить год написания книги</button>
                            </p>
                            <p>
                                <input bookIndex={bookIndex} id="Author" type="text" placeholder="Пушкин" onChange={this.handleAuthorChange} />
                                <button bookIndex={bookIndex} onClick={this.handleUpdateAuthorBook}>Добавить автора книги</button>
                            </p>
                        </div>
                    );
                })}
            </div>
        );
    }

    handleBookTextChange = e => {
        let bookIndex = parseInt(e.target.attributes.bookIndex.value);
        this.currentBookNames[bookIndex] = e.target.value;
    }

    handleBookIntegerNumberChange = e => {
        let bookIndex = parseInt(e.target.attributes.bookIndex.value);
        this.currentBookWrittenYears[bookIndex] = parseInt(e.target.value);
    }

    handleAuthorChange = e => {
        let bookIndex = parseInt(e.target.attributes.bookIndex.value);
        this.currentBookAuthors[bookIndex] = e.target.value;
    }

    handleUpdateNameBook = async e => {
        let bookIndex = parseInt(e.target.attributes.bookIndex.value);
        let bookName = this.currentBookNames[bookIndex];
        let book = this.state.books[bookIndex];
        book.name = bookName;

        let result = await fetch(`http://localhost:5000/books`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        })

        if (result.ok) {
            let updatedBook = await result.json();
            this.state.books[bookIndex] = updatedBook;
            this.setState(this.state);
        } else {
            let errorMessage = await result.text();
            alert(`${result.status}: ${errorMessage}`);
        }
    }

    handleUpdateWrittenYearBook = async e => {
        let bookIndex = parseInt(e.target.attributes.bookIndex.value);
        let writtenYear = this.currentBookWrittenYears[bookIndex];
        let book = this.state.books[bookIndex];
        book.writtenYear = writtenYear;

        let result = await fetch(`http://localhost:5000/books`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        })

        if (result.ok) {
            let updatedBook = await result.json();
            this.state.books[bookIndex] = updatedBook;
            this.setState(this.state);
        } else {
            let errorMessage = await result.text();
            alert(`${result.status}: ${errorMessage}`);
        }
    }

    handleUpdateAuthorBook = async e => {
        let bookIndex = parseInt(e.target.attributes.bookIndex.value);
        let author = this.currentBookAuthors[bookIndex];
        let book = this.state.books[bookIndex];
        book.authors.splice(0, 0, author);

        let result = await fetch(`http://localhost:5000/books`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        })

        if (result.ok) {
            let updatedBook = await result.json();
            this.state.books[bookIndex] = updatedBook;
            this.setState(this.state);
        } else {
            let errorMessage = await result.text();
            alert(`${result.status}: ${errorMessage}`);
        }
    }

    handleRemoveBook = async e => {
        let bookIndex = parseInt(e.target.attributes.bookIndex.value);

        let result = await fetch(`http://localhost:5000/books?isbn=${this.state.books[bookIndex].isbnNumber}`, {
            method: 'DELETE'
        });

        if (result.ok) {
            this.state.books.splice(bookIndex, 1);
            this.setState(this.state);
        } else {
            let errorMessage = await result.text();
            alert(`${result.status}: ${errorMessage}`);
        }
    }

    handleRemoveAuthor = async e => {
        let bookIndex = parseInt(e.target.attributes.bookIndex.value);
        let authorIndex = parseInt(e.target.attributes.authorIndex.value);
        let book = this.state.books[bookIndex];
        let removedAuthor = book.authors.splice(authorIndex, 1);

        let result = await fetch(`http://localhost:5000/books`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        })

        if (result.ok) {
            let updatedBook = await result.json();
            this.state.books[bookIndex] = updatedBook;
            this.setState(this.state);
        } else {
            let errorMessage = await result.text();
            alert(`${result.status}: ${errorMessage}`);
        }
    }

    handleTextChange = e => {
        this.currentBook[e.target.id] = e.target.value;
    }

    handleIntegerNumberChange = e => {
        this.currentBook[e.target.id] = parseInt(e.target.value);
    }

    handleAuthorsChange = e => {
        this.currentBook[e.target.id] = e.target.value.split(', ');
    }

    handleAddBook = async e => {
        let result = await fetch(`http://localhost:5000/books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                IsbnNumber: this.currentBook.isbnNumber,
                Name: this.currentBook.name,
                WrittenYear: this.currentBook.writtenYear,
                Authors: this.currentBook.authors
            })
        });

        if (result.ok) {
            let addedBook = await result.json();
            this.state.books.splice(0, 0, addedBook);
            this.setState(this.state);
        } else {
            let errorMessage = await result.text();
            alert(`${result.status}: ${errorMessage}`);
        }
    }
}