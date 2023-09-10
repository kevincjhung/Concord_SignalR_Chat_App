using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Concord.Models;

namespace Concord.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageAttachmentsController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public MessageAttachmentsController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/MessageAttachments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageAttachment>>> GetMessageAttachments()
        {
            return await _context.MessageAttachments.ToListAsync();
        }

        // GET: api/MessageAttachments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MessageAttachment>> GetMessageAttachment(int id)
        {
            var messageAttachment = await _context.MessageAttachments.FindAsync(id);

            if (messageAttachment == null)
            {
                return NotFound();
            }

            return messageAttachment;
        }

        // POST: api/MessageAttachments
        [HttpPost]
        public async Task<ActionResult<MessageAttachment>> PostMessageAttachment(MessageAttachment messageAttachment)
        {
            _context.MessageAttachments.Add(messageAttachment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMessageAttachment", new { id = messageAttachment.Id }, messageAttachment);
        }

        // PUT: api/MessageAttachments/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMessageAttachment(int id, MessageAttachment messageAttachment)
        {
            if (id != messageAttachment.Id)
            {
                return BadRequest();
            }

            _context.Entry(messageAttachment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MessageAttachmentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/MessageAttachments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMessageAttachment(int id)
        {
            var messageAttachment = await _context.MessageAttachments.FindAsync(id);
            if (messageAttachment == null)
            {
                return NotFound();
            }

            _context.MessageAttachments.Remove(messageAttachment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MessageAttachmentExists(int id)
        {
            return _context.MessageAttachments.Any(e => e.Id == id);
        }
    }
}
