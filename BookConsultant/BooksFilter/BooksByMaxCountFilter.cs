using System.Linq;
using BookConsultant.Model;

#nullable enable

namespace BookConsultant.BooksFilter
{
    public class BooksByMaxCountFilter
    {
        public Book[] Filter(Book[] books, int? maxCount)
        {
            if (maxCount == null)
                return books;
            
            if (maxCount < 0)
                return new Book[0];

            return books.Take(maxCount.Value).ToArray();
        }
    }
}