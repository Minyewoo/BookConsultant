using System.Linq;
using BookConsultant.Model;

#nullable enable

namespace BookConsultant.Repository
{
    public class TagsRepository
    {
        public Tag? TrySave(Tag tag)
        {
            tag.Name = tag.Name.ToLowerInvariant();
            using var context = new ConsultantContext();
            if (context.Tags.Any(x => x.Name == tag.Name))
                return null;
            context.Tags.Add(tag);
            context.SaveChanges();
            return tag;
        }
        
        public Tag? TryUpdate(Tag tag)
        {
            tag.Name = tag.Name.ToLowerInvariant();
            using var context = new ConsultantContext();
            var dbTag = context.Tags.SingleOrDefault(x => x.Name == tag.Name);
            if (dbTag == null)
                return null;
            dbTag.BooksIsbnNumbers = tag.BooksIsbnNumbers;
            context.SaveChanges();
            return dbTag;
        }

        public Tag? TryRemove(string name)
        {
            name = name.ToLowerInvariant();
            using var context = new ConsultantContext();
            var removingTag = context.Tags.SingleOrDefault(x => x.Name == name);
            if (removingTag == null)
                return null;
            context.Tags.Remove(removingTag);
            context.SaveChanges();
            return removingTag;
        }

        public Tag[] GetAll()
        {
            using var context = new ConsultantContext();
            return context.Tags.ToArray();
        }
    }
}