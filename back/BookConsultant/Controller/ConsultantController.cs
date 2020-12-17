using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Xml.Serialization;
using BookConsultant.BooksFilter;
using BookConsultant.Model;
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
            var books = booksRepository.GetAll()
                .Select(x =>
                {
                    var filteredBook = JsonSerializer.Deserialize<FilteredBook>(JsonSerializer.Serialize(x));
                    filteredBook.Filters = new List<string>();
                    return filteredBook;
                })
                .ToArray();

            var filteredBooksByFilters = new List<FilteredBook[]>
            {
                authorsFilter.Filter(books, authors),
                genresFilter.Filter(books, genres),
                tagsFilter.Filter(books, tags),
                ratingFilter.Filter(books, minRating)
            }.SelectMany(x => x).Where(x => x.Filters.Count > 0).ToArray();

            filteredBooksByFilters = filteredBooksByFilters.GroupBy(x => x.IsbnNumber)
                .Select(x =>
                {
                    var filters = x.SelectMany(z => z.Filters).Distinct().ToList();
                    var filteredBook = x.First();
                    filteredBook.Filters = filters;
                    return filteredBook;
                }).ToArray();

            filteredBooksByFilters = maxCountFilter.Filter(filteredBooksByFilters, maxCount);

            return Ok(filteredBooksByFilters);
        }

        private readonly BooksRepository booksRepository;
        private readonly BooksByTagsFilter tagsFilter;
        private readonly BooksByGenresFilter genresFilter;
        private readonly BooksByAuthorsFilter authorsFilter;
        private readonly BooksByRatingFilter ratingFilter;
        private readonly BooksByMaxCountFilter maxCountFilter;
    }
}