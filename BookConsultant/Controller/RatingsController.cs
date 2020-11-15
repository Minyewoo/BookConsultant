using BookConsultant.Model;
using BookConsultant.Repository;
using Microsoft.AspNetCore.Mvc;

#nullable enable

namespace BookConsultant.Controller
{
    [Controller]
    [Route("ratings")]
    public class RatingsController : ControllerBase
    {
        public RatingsController(RatingsRepository ratingsRepository)
        {
            this.ratingsRepository = ratingsRepository;
        }
        
        [HttpPost("/")]
        public IActionResult Save([FromBody] Rating? rating)
        {
            var validationError = ValidateRating(rating);
            if (validationError != null)
                return BadRequest(validationError);

            var savedRating = ratingsRepository.TrySave(rating!);
            if (savedRating == null)
                return BadRequest("Rating has not saved");

            return Ok(savedRating);
        }

        [HttpPut("/")]
        public IActionResult Update([FromBody] Rating? rating)
        {
            var validationError = ValidateRating(rating);
            if (validationError != null)
                return BadRequest(validationError);

            var updatedRating = ratingsRepository.TryUpdate(rating!);
            if (updatedRating == null)
                return BadRequest("Rating has not updated");

            return Ok(updatedRating);
        }

        [HttpDelete("/")]
        public IActionResult Remove([FromQuery(Name = "book-isbn")] string? bookIsbnNumber)
        {
            if (string.IsNullOrEmpty(bookIsbnNumber))
                return BadRequest("BookIsbnNumber is required");

            var removedRating = ratingsRepository.TryRemove(bookIsbnNumber);
            if (removedRating == null)
                return BadRequest("Tag has not removed");

            return Ok(removedRating);
        }

        [HttpGet("/")]
        public IActionResult GetAll()
        {
            return Ok(ratingsRepository.GetAll());
        }
        
        private string? ValidateRating(Rating? rating)
        {
            if (rating == null)
                return "Body is required";

            if (string.IsNullOrEmpty(rating.BookIsbnNumber))
                return "BookIsbnNumber is required";
            
            if (rating.Value < 0 || rating.Value > 100)
                return "Rating should be in [0, 100] range";

            return null;
        }

        private readonly RatingsRepository ratingsRepository;
    }
}