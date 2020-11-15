using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookConsultant.Model
{
    [Table("genres")]
    public class Genre
    {
        [Key]
        [Column("name")]
        public string Name { get; set; }
        
        [Column("books_isbn_numbers")]
        public string[] BooksIsbnNumbers { get; set; }
    }
}