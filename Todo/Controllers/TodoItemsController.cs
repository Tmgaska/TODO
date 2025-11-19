using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

namespace TodoApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TodoItemsController : ControllerBase
{
    private readonly TodoContext _context;

    public TodoItemsController(TodoContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoItemDTO>>> GetTodoItems()
    {
        var todoItems = await _context.TodoItems.ToListAsync(); 
        var todoDtos = todoItems.Select(ItemToDTO);    
        return Ok(todoDtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TodoItemDTO>> GetTodoItem(long id)
    {
        var todoItem = await _context.TodoItems.FindAsync(id);
        if (todoItem == null) return NotFound();

        return ItemToDTO(todoItem);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutTodoItem(long id, TodoItem todoItem)
    {
        if (id != todoItem.Id) return BadRequest();

        var existingTodo = await _context.TodoItems.FindAsync(id);
        if (existingTodo == null) return NotFound();

        existingTodo.Name = todoItem.Name;
        existingTodo.IsComplete = todoItem.IsComplete;
        existingTodo.DueDate = todoItem.DueDate;
        existingTodo.CompletedDate = todoItem.IsComplete ? DateTime.Now : null;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!TodoItemExists(id)) return NotFound();
            throw;
        }

        return NoContent();
    }

    [HttpPost]
    public async Task<ActionResult<TodoItem>> PostTodoItem(TodoItem todoItem)
    {
        if (todoItem.IsComplete)
        {
            todoItem.CompletedDate = DateTime.Now;
        }

        _context.TodoItems.Add(todoItem);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTodoItem), new { id = todoItem.Id }, todoItem);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTodoItem(long id)
    {
        var todoItem = await _context.TodoItems.FindAsync(id);
        if (todoItem == null) return NotFound();

        _context.TodoItems.Remove(todoItem);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool TodoItemExists(long id) =>
        _context.TodoItems.Any(e => e.Id == id);

    private static TodoItemDTO ItemToDTO(TodoItem todoItem) =>
        new TodoItemDTO
        {
            Id = todoItem.Id,
            Name = todoItem.Name,
            IsComplete = todoItem.IsComplete,
            DueDate = todoItem.DueDate?.ToString("yyyy-MM-dd"),
            CompletedDate = todoItem.CompletedDate?.ToString("yyyy-MM-dd")
        };
}
