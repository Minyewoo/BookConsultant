using System.Linq;
using BookConsultant.Model;
using BookConsultant.Repository;
using Microsoft.AspNetCore.Mvc;

#nullable enable

namespace BookConsultant.Controller
{
    [Controller]
    [Route("tags")]
    public class TagsController : ControllerBase
    {
        public TagsController(TagsRepository tagsRepository)
        {
            this.tagsRepository = tagsRepository;
        }
        
        [HttpPost("/")]
        public IActionResult Save([FromBody] Tag? tag)
        {
            var validationError = ValidateTag(tag);
            if (validationError != null)
                return BadRequest(validationError);

            var savedTag = tagsRepository.TrySave(tag!);
            if (savedTag == null)
                return BadRequest("Tag has not saved");

            return Ok(savedTag);
        }

        [HttpPut("/")]
        public IActionResult Update([FromBody] Tag? tag)
        {
            var validationError = ValidateTag(tag);
            if (validationError != null)
                return BadRequest(validationError);

            var updatedTag = tagsRepository.TryUpdate(tag!);
            if (updatedTag == null)
                return BadRequest("Tag has not updated");

            return Ok(updatedTag);
        }

        [HttpDelete("/")]
        public IActionResult Remove([FromQuery(Name = "name")] string? name)
        {
            if (string.IsNullOrEmpty(name))
                return BadRequest("Name is required");

            var removedTag = tagsRepository.TryRemove(name);
            if (removedTag == null)
                return BadRequest("Tag has not removed");

            return Ok(removedTag);
        }

        [HttpGet("/")]
        public IActionResult GetAll()
        {
            return Ok(tagsRepository.GetAll());
        }
        
        private string? ValidateTag(Tag? tag)
        {
            if (tag == null)
                return "Body is required";

            if (string.IsNullOrEmpty(tag.Name))
                return "Name is required";

            if (tag.BooksIsbnNumbers == null || !tag.BooksIsbnNumbers.Any())
                return "BooksIsbnNumbers is required";

            return null;
        }

        private readonly TagsRepository tagsRepository;
    }
}