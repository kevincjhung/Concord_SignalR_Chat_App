using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;

using Concord.Models;
using Concord.Hubs;

namespace Concord.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChannelsController : ControllerBase
{
    // so you can access the hub from the controller
    private readonly DatabaseContext _context;
    private readonly IHubContext<ChatHub> _hub;
    // private readonly IHubContext<ChatHub> _hubContext; // this is the chat hub
    

    public ChannelsController(DatabaseContext context, IHubContext<ChatHub> hub)  // pass the chatHub in the constructor
    {
        _context = context;
        _hub = hub;
    }

    // GET: api/Channels
    [HttpGet] 
    public async Task<ActionResult<IEnumerable<Channel>>> GetChannels()
    {
        return await _context.Channels.ToListAsync();
    }

 
    // GET: api/Channels/5
    [HttpGet("{id}")] 
    public async Task<ActionResult<Channel>> GetChannel(int id)
    {
        var Channel = await _context.Channels.FindAsync(id);

        if (Channel == null)
        {
            return NotFound();
        }

        return Channel;
    }

    // POST: api/Channels
    [HttpPost] 
      public async Task<ActionResult<Channel>> PostChannel(Channel channel)
    {
        _context.Channels.Add(channel);
        await _context.SaveChangesAsync();

        // Send a message to all clients listening to the hub
        await _hub.Clients.All.SendAsync("ReceiveMessage", channel);

        return CreatedAtAction("GetChannel", new { id = channel.Id }, channel);
    }
    
    
    // PUT: api/Channels/5
    [HttpPut("{id}")] 
    public async Task<IActionResult> PutChannel(int id, Channel Channel)
    {
        if (id != Channel.Id)
        {
            return BadRequest();
        }

        _context.Entry(Channel).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }


    // DELETE: api/Channels/5
    [HttpDelete("{id}")] 
    public async Task<IActionResult> DeleteChannel(int id)
    {
        var Channel = await _context.Channels.FindAsync(id);
        if (Channel == null)
        {
            return NotFound();
        }

        _context.Channels.Remove(Channel);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}