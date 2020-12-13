using BookConsultant.BooksFilter;
using BookConsultant.Repository;
using Microsoft.AspNetCore.Mvc;

#nullable enable

namespace BookConsultant.Controller
{
    [Controller]
    [Route("consultant")]
    public class ConsultantController : ControllerBase
    {
        public ConsultantController(BooksRepository booksRepository,
                                    BooksByTagsFilter tagsFilter, 
                                    BooksByGenresFilter genresFilter, 
                                    BooksByAuthorsFilter authorsFilter, 
                                    BooksByRatingFilter ratingFilter, 
                                    BooksByMaxCountFilter maxCountFilter)
        {
            this.booksRepository = booksRepository;
            this.tagsFilter = tagsFilter;
            this.genresFilter = genresFilter;
            this.authorsFilter = authorsFilter;
            this.ratingFilter = ratingFilter;
            this.maxCountFilter = maxCountFilter;
        }

        [HttpGet]
        public IActionResult Search([FromQuery(Name = "tags")] string?[]? tags, 
                                    [FromQuery(Name = "genres")] string?[]? genres,
                                    [FromQuery(Name = "authors")] string?[]? authors,
                                    [FromQuery(Name = "min-rating")] int? minRating,
                                    [FromQuery(Name = "max-count")] int? maxCount)
        {
            var books = booksRepository.GetAll();
            
            books = authorsFilter.Filter(books, authors);
            books = genresFilter.Filter(books, genres);
            books = tagsFilter.Filter(books, tags);
            books = ratingFilter.Filter(books, minRating);
            books = maxCountFilter.Filter(books, maxCount);

            return Ok(books);
        }

        private readonly BooksRepository booksRepository;
        private readonly BooksByTagsFilter tagsFilter;
        private readonly BooksByGenresFilter genresFilter;
        private readonly BooksByAuthorsFilter authorsFilter;
        private readonly BooksByRatingFilter ratingFilter;
        private readonly BooksByMaxCountFilter maxCountFilter;
    }
}