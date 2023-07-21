using Microsoft.EntityFrameworkCore;

namespace Concord.Models
{
    public class DatabaseContext : DbContext 
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) {}
        
        protected override void OnModelCreating(ModelBuilder modelbuilder)
        {
            modelbuilder.Entity<Channel>()
                .Property(e => e.Created)
                .HasDefaultValueSql("now()");

            modelbuilder.Entity<Message>()
                .Property(e => e.Created)
                .HasDefaultValueSql("now()");

            modelbuilder.Entity<User>()
                .Property(u => u.UserName)
                .IsRequired();
        }

        public DbSet<Channel> Channels { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
