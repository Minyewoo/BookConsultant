using BookConsultant.Model;
using Microsoft.EntityFrameworkCore;

namespace BookConsultant.Repository
{
    public class ConsultantContext : DbContext
    {
        public DbSet<Book> Books { get; set; }
        public DbSet<Genre> Genres { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<Rating> Ratings { get; set; }

        public ConsultantContext() 
        {
            Database.EnsureCreated();
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=book_consultant;Username=postgres;Password=password");
        }
    }
}