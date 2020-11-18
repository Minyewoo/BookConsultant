using System.Linq;
using BookConsultant.Model;
using BookConsultant.Repository;

#nullable enable

namespace BookConsultant.BooksFilter
{
    public class BooksByRatingFilter
    {
        public BooksByRatingFilter(RatingsRepository ratingsRepository)
        {
            this.ratingsRepository = ratingsRepository;
        }
        
        public Book[] Filter(Book[] books, int? minRating)
        {
            if (minRating == null)
                return books;

            var booksDictionary = books.ToDictionary(x => x.IsbnNumber);
            
            return ratingsRepository.GetAll()
                                    .Where(x => x.Value >= minRating)
                                    .Select(x => x.BookIsbnNumber)
                                    .Where(booksDictionary.ContainsKey)
                                    .Select(x => booksDictionary[x])
                                    .ToArray();
        }

        private readonly RatingsRepository ratingsRepository;
    }
}