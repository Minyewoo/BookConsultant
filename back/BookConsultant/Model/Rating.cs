using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookConsultant.Model
{
    [Table("ratings")]
    public class Rating
    {
        [Key]
        [Column("book_isbn_number")]
        public string BookIsbnNumber { get; set; }

        [Column("rating")]
        public int Value { get; set; }
    }
}