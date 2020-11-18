using System;
using System.Linq;
using BookConsultant.Model;

#nullable enable

namespace BookConsultant.BooksFilter
{
    public class BooksByAuthorsFilter
    {
        public Book[] Filter(Book[] books, string?[]? authors)
        {
            if (authors == null || authors.All(string.IsNullOrEmpty))
                return books;

            authors = authors.Where(x => !string.IsNullOrEmpty(x)).ToArray();
            
            return books.Where(x => x.Authors != null)
                        .SelectMany(x => x.Authors.Select(y => (Author : y, Book: x)))
                        .SelectMany(x => authors.Select(y => (Author : y, BookAuthor : x)))
                        .Where(x => CompareAuthors(x.BookAuthor.Author, x.Author!))
                        .Select(x => x.BookAuthor.Book)
                        .GroupBy(x => x.IsbnNumber)
                        .Select(x => x.First())
                        .ToArray();
        }

        private bool CompareAuthors(string bookAuthor, string searchAuthor)
        {
            return string.Compare(bookAuthor, searchAuthor, StringComparison.InvariantCultureIgnoreCase) == 0;
        }
    }
}