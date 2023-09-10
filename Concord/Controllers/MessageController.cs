using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json.Linq;

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

        // return messages, sorted by time created, latest messages first
        return await _context.Messages.OrderByDescending(m => m.Created).ToListAsync();
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
    //     {
    //   "Text": "messaegreg",
    //   "User": {
    //     "UserId": 1,
    //     "Email": "aksdfa@ahsiud.com",
    //     "FirstName": "Bob",
    //     "LastName": "The LastName field is required.",
    //     "UserName": "The UserName field is required."
    //   },
    //   "Text": "fshdikuf",
    //   "message": "sfhdu",
    //   "Message": "shudfw"
    // }
    [HttpPost("channel/{channelId}")]
    public async Task<ActionResult<Message>> PostMessage(
        int channelId,
        [FromBody] MessageData messageData
    )
    {
        if (messageData.Text == null || !(messageData.Text is string))
        {
            // Handle the case where "Text" property is missing or not a string
            return BadRequest("The 'Text' property is missing or not a string in the JSON object.");
        }

        // Check if the "UserId" property is present in the JSON object and is an integer
        if (messageData.UserId == null || !(messageData.UserId is int))
        {
            // Handle the case where "UserId" property is missing or not an integer
            return BadRequest("The 'UserId' property is missing or not an integer in the JSON object.");
        }

        // Extract the properties from the dynamic object
        string text = messageData.Text;
        int userId = messageData.UserId;


        // Retrieve the user and create the message in a single query
        var query = _context.Users
            .Where(u => u.Id == userId)
            .Select(
                u =>
                    new
                    {
                        User = u,
                        Message = new Message(0, text, DateTime.Now, userId, 1)
                        {
                            // Set other properties like Created and ChannelId here
                            ChannelId = 1,
                            Text = text,
                            UserId = userId,
                            Created = DateTime.UtcNow
                        }
                    }
            );

        var result = await query.FirstOrDefaultAsync();

        if (result == null || result.User == null)
        {
            // Handle the case where the user with the given userId is not found.
            return BadRequest("User not found");
        }

        Message message = result.Message;

        // Set the correct ChannelId
        message.ChannelId = channelId;

        // Add the message to the context and save changes
        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        // Send a message to all clients listening to the hub
        await _hub.Clients.All.SendAsync("ReceiveMessage", message);

        return CreatedAtAction("GetMessage", new { id = message.Id }, message);
    }

    // "Message": "Le Message",
    // "Text": "Your text",
    // "UserName" : "Bob McBobFace",
    // "created": "2023-09-03T16:57:01.338Z",
    // "ChannelId": 3
    // NOTE the id in the query params is not used

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
