using Microsoft.EntityFrameworkCore;

namespace Concord.Models
{
  public class DatabaseContext : DbContext
  {
    public DatabaseContext(DbContextOptions<DatabaseContext> options)
      : base(options) { }
    protected override void OnModelCreating(ModelBuilder modelbuilder)
    {
      modelbuilder.Entity<Channel>()
				.Property(e => e.Created)
				.HasDefaultValueSql("now()");
      
			modelbuilder.Entity<Message>()
				.Property(e => e.Created)
				.HasDefaultValueSql("now()");
    
      modelbuilder
        .Entity<User>()
        .HasMany(u => u.Messages) // User can have many Messages
        .WithOne(m => m.User) // Message belongs to one User
        .HasForeignKey(m => m.UserId); // Foreign key property in Message
      
			modelbuilder
        .Entity<Message>()
        .HasMany(m => m.Attachments) // Message can have many Attachments
        .WithOne(a => a.Message) // Attachment belongs to one Message
        .HasForeignKey(a => a.MessageId); // Foreign key property in Attachment

      modelbuilder
        .Entity<MessageAttachment>()
        .HasOne(a => a.Message) // MessageAttachment belongs to one Message
        .WithMany(m => m.Attachments) // Message can have many Attachments
        .HasForeignKey(a => a.MessageId) // Foreign key property in Attachment
        .OnDelete(DeleteBehavior.Cascade);
      }

    public DbSet<Channel> Channels { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<MessageAttachment> MessageAttachments { get; set; }
	}
}
