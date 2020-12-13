import React from "react";

export default class Tags extends React.Component {
    state = {
        tags: []
    };

    currentTag = {
        tagName: "",
        bookIsbnNumbers: []
    }

    currentBooksNumbers = [];

    async componentDidMount() {
        let result = await fetch(`http://localhost:5000/tags`);
        
        let tags = await result.json();

        this.setState({
            tags: tags
        });
    }

    render() {
        return (
            <div>
                <div>
                    <p>
                        <label htmlFor="tagName">Имя тега</label><br/>
                        <input id="tagName" type="text" placeholder="Страшно" onChange={this.handleTagNameChange} />
                    </p>
                    <p>
                        <label htmlFor="bookIsbnNumbers">Номера книг</label><br/>
                        <input id="bookIsbnNumbers" type="text" placeholder="123, 321, 456" onChange={this.handleBooksNumbersChange} />
                    </p>
                    <p>
                        <button onClick={this.handleAddTag}>Добавить</button>
                    </p>
                </div>
                {this.state.tags.map((tag, tagIndex) => {
                    return (
                        <div>
                            <p>{tagIndex + 1}: {tag.name} <span tagIndex={tagIndex} onClick={this.handleRemoveTag}>X</span></p>
                                {tag.booksIsbnNumbers.map((bookIsbnNumber, bookIndex) => {
                                    return (
                                        <p>{bookIsbnNumber} <span tagIndex={tagIndex} bookIndex={bookIndex} onClick={this.handleRemoveBookIsbnNumber}>X</span></p>
                                    );
                                })}
                            <p>
                                <input tagIndex={tagIndex} type="text" placeholder="123321" onChange={this.handleBookNumberChange} />
                                <button tagIndex={tagIndex} onClick={this.handleAddBookNumber}>Добавить номер книги</button>
                            </p>
                            <br/>
                        </div>
                    );
                })}
            </div>
        );
    }

    handleTagNameChange = e => {
        this.currentTag[e.target.id] = e.target.value;
    }

    handleBooksNumbersChange = e => {
        this.currentTag[e.target.id] = e.target.value.split(', ');
    }

    handleAddTag = async e => {
        let result = await fetch(`http://localhost:5000/tags`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Name: this.currentTag.tagName,
                BooksIsbnNumbers: this.currentTag.bookIsbnNumbers
            })
        });

        if (result.ok) {
            let addedTag = await result.json();
            this.state.tags.splice(0, 0, addedTag);
            this.setState(this.state);
        } else {
            let errorMessage = await result.text();
            alert(`${result.status}: ${errorMessage}`);
        }
    }

    handleRemoveTag = async e => {
        let tagIndex = parseInt(e.target.attributes.tagIndex.value);

        let result = await fetch(`http://localhost:5000/tags?name=${this.state.tags[tagIndex].name}`, {
            method: 'DELETE'
        });

        if (result.ok) {
            this.state.tags.splice(tagIndex, 1);
            this.setState(this.state);
        } else {
            let errorMessage = await result.text();
            alert(`${result.status}: ${errorMessage}`);
        }
    }

    handleRemoveBookIsbnNumber = async e => {
        let tagIndex = parseInt(e.target.attributes.tagIndex.value);
        let bookIndex = parseInt(e.target.attributes.bookIndex.value);
        let tag = this.state.tags[tagIndex];
        let removedBook = tag.booksIsbnNumbers.splice(bookIndex, 1)[0];

        let result = await fetch(`http://localhost:5000/tags`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tag)
        })

        if (result.ok) {
            let updatedTag = await result.json();
            this.state.tags[tagIndex] = updatedTag;
            this.setState(this.state);
        } else {
            let errorMessage = await result.text();
            alert(`${result.status}: ${errorMessage}`);
        }
    }

    handleBookNumberChange = e => {
        let tagIndex = parseInt(e.target.attributes.tagIndex.value);
        this.currentBooksNumbers[tagIndex] = e.target.value;
    }

    handleAddBookNumber = async e => {
        let tagIndex = parseInt(e.target.attributes.tagIndex.value);
        let tag = this.state.tags[tagIndex];
        let bookNumber = this.currentBooksNumbers[tagIndex];
        tag.booksIsbnNumbers.splice(0, 0, bookNumber);

        let result = await fetch(`http://localhost:5000/tags`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tag)
        })

        if (result.ok) {
            let updatedTag = await result.json();
            this.state.tags[tagIndex] = updatedTag;
            this.setState(this.state);
        } else {
            let errorMessage = await result.text();
            alert(`${result.status}: ${errorMessage}`);
        }
    }
}