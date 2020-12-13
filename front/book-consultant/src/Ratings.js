import React from "react";

export default class Ratings extends React.Component {
    state = {
        ratings: []
    };

    currentRating = {
        bookIsbnNumber : "",
        rating: 0,
    }

    currentRatings = [];

    async componentDidMount() {
        let result = await fetch(`http://localhost:5000/ratings`);
        
        let ratings = await result.json();

        this.setState({
            ratings: ratings
        });
    }

    render() {
        return (
            <div>
                <div>
                    <p>
                        <label htmlFor="bookIsbnNumber">Номер книги</label><br/>
                        <input id="bookIsbnNumber" type="text" placeholder="123532" onChange={this.handleBookNumberChange} />
                    </p>
                    <p>
                        <label htmlFor="value">Рейтинг</label><br/>
                        <input id="value" type="text" placeholder="80" onChange={this.handleRatingChange} />
                    </p>
                    <p>
                        <button onClick={this.handleAddRating}>Добавить</button>
                    </p>
                </div>
                {this.state.ratings.map((rating, ratingIndex) => {
                    return (
                        <div>
                            <p>{ratingIndex + 1}: {rating.bookIsbnNumber} <span ratingIndex={ratingIndex} onClick={this.handleRemoveRating}>X</span></p>
                            <p>{rating.value}</p>
                            <p>
                                <input ratingIndex={ratingIndex} type="text" placeholder="70" onChange={this.handleRatingItemChange} />
                                <button ratingIndex={ratingIndex} onClick={this.handleUpdateRatingItem}>Изменить рейтинг</button>
                            </p>
                            <br/>
                        </div>
                    );
                })}
            </div>
        );
    }

    handleRemoveRating = async e => {
        let ratingIndex = parseInt(e.target.attributes.ratingIndex.value);

        let result = await fetch(`http://localhost:5000/ratings?book-isbn=${this.state.ratings[ratingIndex].bookIsbnNumber}`, {
            method: 'DELETE'
        });

        if (result.ok) {
            this.state.ratings.splice(ratingIndex, 1);
            this.setState(this.state);
        } else {
            let errorMessage = await result.text();
            alert(`${result.status}: ${errorMessage}`);
        }
    }

    handleBookNumberChange = e => {
        this.currentRating[e.target.id] = e.target.value;
    }

    handleRatingChange = e => {
        this.currentRating[e.target.id] = parseInt(e.target.value);
    }

    handleAddRating = async e => {
        let result = await fetch(`http://localhost:5000/ratings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                BookIsbnNumber: this.currentRating.bookIsbnNumber,
                Value: this.currentRating.value
            })
        });

        if (result.ok) {
            let addedRating = await result.json();
            this.state.ratings.splice(0, 0, addedRating);
            this.setState(this.state);
        } else {
            let errorMessage = await result.text();
            alert(`${result.status}: ${errorMessage}`);
        }
    }

    handleRatingItemChange = e => {
        let ratingIndex = parseInt(e.target.attributes.ratingIndex.value);
        this.currentRatings[ratingIndex] = parseInt(e.target.value);
    }

    handleUpdateRatingItem = async e => {
        let ratingIndex = parseInt(e.target.attributes.ratingIndex.value);
        let rating = this.state.ratings[ratingIndex];
        rating.value = this.currentRatings[ratingIndex];

        let result = await fetch(`http://localhost:5000/ratings`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(rating)
        })

        if (result.ok) {
            let updatedRating = await result.json();
            this.state.ratings[ratingIndex] = updatedRating;
            this.setState(this.state);
        } else {
            let errorMessage = await result.text();
            alert(`${result.status}: ${errorMessage}`);
        }
    }
}