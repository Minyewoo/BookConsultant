using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookConsultant.Model
{
    [Table("books")]
    public class Book
    {
        [Key]
        [Column("isbn_number")]
        public string IsbnNumber { get; set; }
        
        [Column("name")]
        public string Name { get; set; }
        
        [Column("written_year")]
        public int? WrittenYear { get; set; }
        
        [Column("authors")]
        public string[] Authors { get; set; }
    }
}