namespace Concord.Models;

public class User {
    public User(string userName, string firstName, string lastName, string email, string profilePicURL) {
        this.UserName = userName;
        this.FirstName = firstName;
        this.LastName = lastName;
        this.Email = email;
        this.ProfilePicURL = profilePicURL;
    }

    public int Id { get; set; }
    public string UserName { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string? ProfilePicURL { get; set; }
    public List<Message>? Messages { get; set; }
}
