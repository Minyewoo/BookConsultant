using System.Linq;
using BookConsultant.Model;

#nullable enable

namespace BookConsultant.Repository
{
    public class GenresRepository
    {
        public Genre? TrySave(Genre genre)
        {
            genre.Name = genre.Name.ToLowerInvariant();
            using var context = new ConsultantContext();
            if (context.Genres.Any(x => x.Name == genre.Name))
                return null;
            context.Genres.Add(genre);
            context.SaveChanges();
            return genre;
        }
        
        public Genre? TryUpdate(Genre genre)
        {
            genre.Name = genre.Name.ToLowerInvariant();
            using var context = new ConsultantContext();
            var dbGenre = context.Genres.SingleOrDefault(x => x.Name == genre.Name);
            if (dbGenre == null)
                return null;
            dbGenre.BooksIsbnNumbers = genre.BooksIsbnNumbers;
            context.SaveChanges();
            return dbGenre;
        }

        public Genre? TryRemove(string name)
        {
            name = name.ToLowerInvariant();
            using var context = new ConsultantContext();
            var removingGenre = context.Genres.SingleOrDefault(x => x.Name == name);
            if (removingGenre == null)
                return null;
            context.Genres.Remove(removingGenre);
            context.SaveChanges();
            return removingGenre;
        }

        public Genre[] GetAll()
        {
            using var context = new ConsultantContext();
            return context.Genres.ToArray();
        }
    }
}