using System.Linq;
using BookConsultant.Model;

#nullable enable

namespace BookConsultant.Repository
{
    public class RatingsRepository
    {
        public Rating? TrySave(Rating rating)
        {
            using var context = new ConsultantContext();
            if (context.Ratings.Any(x => x.BookIsbnNumber == rating.BookIsbnNumber))
                return null;
            context.Ratings.Add(rating);
            context.SaveChanges();
            return rating;
        }
        
        public Rating? TryUpdate(Rating rating)
        {
            using var context = new ConsultantContext();
            var dbRating = context.Ratings.SingleOrDefault(x => x.BookIsbnNumber == rating.BookIsbnNumber);
            if (dbRating == null)
                return null;
            dbRating.Value = rating.Value;
            context.SaveChanges();
            return dbRating;
        }

        public Rating? TryRemove(string bookId)
        {
            using var context = new ConsultantContext();
            var removingRating = context.Ratings.SingleOrDefault(x => x.BookIsbnNumber == bookId);
            if (removingRating == null)
                return null;
            context.Ratings.Remove(removingRating);
            context.SaveChanges();
            return removingRating;
        }

        public Rating[] GetAll()
        {
            using var context = new ConsultantContext();
            return context.Ratings.ToArray();
        }
    }
}