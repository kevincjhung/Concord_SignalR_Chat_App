using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;

using Concord.Models;
using Concord.Hubs;

namespace Concord.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MessageController : ControllerBase
{
    // so you can access the hub from the controller
    private readonly DatabaseContext _context;
    private readonly IHubContext<ChatHub> _hub;

    // private readonly IHubContext<ChatHub> _hubContext; // this is the chat hub


    public MessageController(DatabaseContext context, IHubContext<ChatHub> hub) // pass the chatHub in the constructor
    {
        _context = context;
        _hub = hub;
    }

    // GET: api/Message
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Message>>> GetMessages()
    {
        // If there aren't any messages, return not found
        if (_context.Messages == null)
        {
            return NotFound();
        }

        return await _context.Messages.ToListAsync();
    }

    // Get a message with a certain message id
    // GET: api/Message/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Message>> GetMessage(int id)
    {
        var message = await _context.Messages.FindAsync(id);

        if (message == null)
        {
            return NotFound();
        }

        return message;
    }

    // GET: api/Message/channel/1
    [HttpGet("channel/{channelId}")]
    public async Task<ActionResult<IEnumerable<Message>>> GetMessagesByChannel(int channelId)
    {
        var messages = await _context.Messages.Where(m => m.ChannelId == channelId).ToListAsync();
        Console.WriteLine("GET: api/Message/channel/1    called");

        if (messages == null)
        {
            return NotFound();
        }

        return messages;
    }
    

    // POST: api/Message/channel/{channelId}
    [HttpPost("channel/{channelId}")]
    public async Task<ActionResult<Message>> PostMessage(int channelId, Message message)
    {
        message.ChannelId = channelId;
        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        // Send a message to all clients listening to the hub
        await _hub.Clients.All.SendAsync("ReceiveMessage", message);

        return CreatedAtAction("GetMessage", new { id = message.Id }, message);
    }
    
     
    /*  Move to MessageController.cs
    POST: api/Channels/5/Messages
    [HttpPost("{channelId}/Messages")] 
    public async Task<Message> PostChannelMessage(int channelId, Message Message)
    {   
        Console.WriteLine($"ChannelsController.cs ");
        Console.WriteLine($"Channel id is: {channelId}, Message: {Message.Text}");

        Message.ChannelId = channelId;
        _context.Messages.Add(Message); // create new message in database
        await _context.SaveChangesAsync(); // save changes to database

        // Broadcast to all SignalR clients
        await _hub.Clients.Group(channelId.ToString()).SendAsync("ReceiveMessage", Message);
  
        return Message;
    }
    */

    // PUT api/Message/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutMessage(int id, Message message)
    {
        if (id != message.Id)
        {
            return BadRequest();
        }

        try
        {
            _context.Messages.Update(message);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!MessageExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        /*
            DbContext is informed the entity has been modified
            needs to be updated in the database. Next time _context.SaveChanges()
            is called, the changes to the entity will be saved to the database.
        */
        _context.Entry(message).State = EntityState.Modified;

        return NoContent();
    }

    // DELETE api/Message/5
    [HttpDelete("{id}")]
    public async Task<ActionResult<Message>> DeleteMessage(int id)
    {
        if (_context.Messages == null)
        {
            return NotFound();
        }

        var message = await _context.Messages.FindAsync(id);
        if (message == null)
        {
            return NotFound();
        }

        _context.Messages.Remove(message);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE all messages in a channel
    // DELETE api/Message/channel/1
    [HttpDelete("channel/{channelId}")]
    public async Task<ActionResult<Message>> DeleteMessagesByChannel(int channelId)
    {
        if (_context.Messages == null)
        {
            return NotFound();
        }

        var messages = await _context.Messages.Where(m => m.ChannelId == channelId).ToListAsync();
        if (messages == null)
        {
            return NotFound();
        }

        _context.Messages.RemoveRange(messages);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool MessageExists(int id)
    {
        // takes an Id as argument and checks if a message with that Id exists
        return _context.Messages.Any(e => e.Id == id);
    }
}
