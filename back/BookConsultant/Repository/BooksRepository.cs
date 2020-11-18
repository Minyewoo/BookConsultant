using System.Linq;
using BookConsultant.Model;

#nullable enable

namespace BookConsultant.Repository
{
    public class BooksRepository
    {
        public Book? TrySave(Book book)
        {
            using var context = new ConsultantContext();
            if (context.Books.Any(x => x.IsbnNumber == book.IsbnNumber))
                return null;
            context.Books.Add(book);
            context.SaveChanges();
            return book;
        }
        
        public Book? TryUpdate(Book book)
        {
            using var context = new ConsultantContext();
            if (!context.Books.Any(x => x.IsbnNumber == book.IsbnNumber))
                return null;
            context.Books.Add(book);
            context.SaveChanges();
            return book;
        }

        public Book? TryRemove(string isbnNumber)
        {
            using var context = new ConsultantContext();
            var removingBook = context.Books.SingleOrDefault(x => x.IsbnNumber == isbnNumber);
            if (removingBook == null)
                return null;
            context.Books.Remove(removingBook);
            context.SaveChanges();
            return removingBook;
        }

        public Book[] GetAll()
        {
            using var context = new ConsultantContext();
            return context.Books.ToArray();
        }
    }
}