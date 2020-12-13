using BookConsultant.Model;
using BookConsultant.Repository;
using Microsoft.AspNetCore.Mvc;

#nullable enable

namespace BookConsultant.Controller
{
    [Controller]
    [Route("books")]
    public class BooksController : ControllerBase
    {
        public BooksController(BooksRepository booksRepository)
        {
            this.booksRepository = booksRepository;
        }

        [HttpPost]
        public IActionResult Save([FromBody] Book? book)
        {
            var validationError = ValidateBook(book);
            if (validationError != null)
                return BadRequest(validationError);

            var savedBook = booksRepository.TrySave(book!);
            if (savedBook == null)
                return BadRequest("Book has not saved");
            
            return Ok(savedBook);
        }
        
        [HttpPut]
        public IActionResult Update([FromBody] Book? book)
        {
            var validationError = ValidateBook(book);
            if (validationError != null)
                return BadRequest(validationError);

            var updatedBook = booksRepository.TryUpdate(book!);
            if (updatedBook == null)
                return BadRequest("Book has not updated");

            return Ok(updatedBook);
        }

        [HttpDelete]
        public IActionResult Delete([FromQuery(Name = "isbn")] string? isbn)
        {
            if (string.IsNullOrEmpty(isbn))
                return BadRequest("Isbn is required");

            var removedBook = booksRepository.TryRemove(isbn);
            if (removedBook == null)
                return BadRequest("Book has not removed");
            
            return Ok(removedBook);
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(booksRepository.GetAll());
        }

        private string? ValidateBook(Book? book)
        {
            if (book == null)
                return "Body is required";
            
            if (string.IsNullOrEmpty(book.IsbnNumber))
                return "IsbnNumber is required";

            if (string.IsNullOrEmpty(book.Name))
                return "Name is required";
            
            return null;
        }

        private readonly BooksRepository booksRepository;
    }
}