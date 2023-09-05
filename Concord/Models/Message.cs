namespace Concord.Models;
public class Message
{
  // custom initializer
  public Message(int id, string text, string userName, DateTime created) {
    Id = id;
    Text = text;
    UserName = userName;
    Created = created;
  }

  public int Id { get; set; }
  public string Text { get; set; }
  public string UserName { get; set; }
  public DateTime Created { get; set; }
  public int ChannelId { get; set; }
  public Channel? Channel { get; set; }
  public ICollection<MessageAttachment>? Attachments { get; set; }
}

/**
  in this relationship, messages can belong to a channel.
  Channel needs to be nullable
  because it is a foreign key.
  you need to be able to work with the messages directly without channel object joined
*/