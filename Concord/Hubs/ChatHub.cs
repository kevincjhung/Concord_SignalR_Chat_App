using Microsoft.AspNetCore.SignalR;

namespace Concord.Hubs;

public class ChatHub : Hub
{
  public async Task SendMessage(string message)
    {
        // Every single time a client sends a message to the server
        // Broadcast that messsage to every single client that is listening
        await Clients.All.SendAsync("ReceiveMessage", message);
    }
  public async Task ReceiveMessage(string user, string message)
  {
    Console.WriteLine($"ChatHub.cs \n Message Received: {message}");
    await Clients.All.SendAsync("ReceiveMessage", user, message); // send message 
  }

  public async Task AddToGroup(string groupName){
    // TODO: optional Verify and authenticate the user
    
    await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
    await Clients.Group(groupName).SendAsync("ReceiveMessage", $"{Context.ConnectionId} has joined the group {groupName}.");
  }

  public async Task RemoveFromGroup(string groupName){
    // TODO: optional Verify and authenticate the user

    await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
    await Clients.Group(groupName).SendAsync("ReceiveMessage", $"{Context.ConnectionId} has left the group {groupName}.");
  }

  public override Task OnConnectedAsync()
  {
    Console.WriteLine("A Client Connected: " + Context.ConnectionId);
    return base.OnConnectedAsync();
  }

  public override Task OnDisconnectedAsync(Exception exception)
  {
    Console.WriteLine("A client disconnected: " + Context.ConnectionId);
    return base.OnDisconnectedAsync(exception);
  }
}
