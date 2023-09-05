namespace Concord.Models;
public class MessageAttachment
{
  // custom initializer

  public MessageAttachment(string fileName, int messageId) {
      FileName = fileName;
      MessageId = messageId;
  }  

  // one message can have many attachments, an attachment can only belong to one message
  public int Id { get; set; }
  public string FileName { get; set; }
  public string? FileURL { get; set; }
  public string? FileType { get; set; }
  public int MessageId { get; set; }
  public Message? Message { get; set; }
}
