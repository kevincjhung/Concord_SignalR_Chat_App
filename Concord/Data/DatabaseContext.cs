using Microsoft.EntityFrameworkCore;

namespace Concord.Models
{
  public class DatabaseContext : DbContext
  {
    public DatabaseContext(DbContextOptions<DatabaseContext> options)
      : base(options) { }
    protected override void OnModelCreating(ModelBuilder modelbuilder)
    {

      // optional one to many relationship between Channel and Messages. Channel does not have to have messages, messages have to belong to a channel
      modelbuilder.Entity<Channel>()
        .HasMany(c => c.Messages) // Channel can have many Messages
        .WithOne(m => m.Channel) // Message belongs to one Channel
        .HasForeignKey(m => m.ChannelId); // Foreign key property in Message

      // Channel Created Time defaults to now
      modelbuilder.Entity<Channel>()
				.Property(e => e.Created)
				.HasDefaultValueSql("now()");

      // optional one to many relationship between Message and MessageAttachments. One message does not have to have attachments, attachments have to belong to a message
      modelbuilder.Entity<Message>()
        .HasMany(m => m.Attachments) // Message can have many Attachments
        .WithOne(a => a.Message) // Attachment belongs to one Message
        .HasForeignKey(a => a.MessageId); // Foreign key property in Attachment
      
      // Message CreatedAt defaults to now
			modelbuilder.Entity<Message>()
				.Property(e => e.Created)
				.HasDefaultValueSql("now()");
    
      // optional one to many relationship between User and Messages. Users do not have to have messages, messages have to belong to a user
      modelbuilder.Entity<User>()
        .HasMany(u => u.Messages) // User can have many Messages
        .WithOne(m => m.User) // Message belongs to one User
        .HasForeignKey(m => m.UserId); // Foreign key property in Message
      
      modelbuilder.Entity<User>()
        .HasMany(u => u.Channels) // User can have many Channels
        .WithMany(c => c.Users) // Channel can have many Users
        .UsingEntity<Dictionary<string, object>>(
          "UserChannel",
          u => u.HasOne<Channel>().WithMany().HasForeignKey("ChannelId"),
          c => c.HasOne<User>().WithMany().HasForeignKey("UserId")
        );
      }

    public DbSet<Channel> Channels { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<MessageAttachment> MessageAttachments { get; set; }
	}
}
