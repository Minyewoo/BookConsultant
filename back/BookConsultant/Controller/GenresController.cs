using System.Linq;
using BookConsultant.Model;
using BookConsultant.Repository;
using Microsoft.AspNetCore.Mvc;

#nullable enable

namespace BookConsultant.Controller
{
    [Controller]
    [Route("genres")]
    public class GenresController : ControllerBase
    {
        public GenresController(GenresRepository genresRepository)
        {
            this.genresRepository = genresRepository;
        }

        [HttpPost]
        public IActionResult Save([FromBody] Genre? genre)
        {
            var validationError = ValidateGenre(genre);
            if (validationError != null)
                return BadRequest(validationError);

            var savedGenre = genresRepository.TrySave(genre!);
            if (savedGenre == null)
                return BadRequest("Genre has not saved");

            return Ok(savedGenre);
        }

        [HttpPut]
        public IActionResult Update([FromBody] Genre? genre)
        {
            var validationError = ValidateGenre(genre);
            if (validationError != null)
                return BadRequest(validationError);

            var updatedGenre = genresRepository.TryUpdate(genre!);
            if (updatedGenre == null)
                return BadRequest("Genre has not updated");

            return Ok(updatedGenre);
        }

        [HttpDelete]
        public IActionResult Remove([FromQuery(Name = "name")] string? name)
        {
            if (string.IsNullOrEmpty(name))
                return BadRequest("Name is required");

            var removedGenre = genresRepository.TryRemove(name);
            if (removedGenre == null)
                return BadRequest("Genre has not removed");

            return Ok(removedGenre);
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(genresRepository.GetAll());
        }

        private string? ValidateGenre(Genre? genre)
        {
            if (genre == null)
                return "Body is required";

            if (string.IsNullOrEmpty(genre.Name))
                return "Name is required";

            if (genre.BooksIsbnNumbers == null || !genre.BooksIsbnNumbers.Any())
                return "BooksIsbnNumbers is required";

            return null;
        }

        private readonly GenresRepository genresRepository;
    }
}