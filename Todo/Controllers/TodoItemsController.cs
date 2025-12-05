using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Todo.Models;

namespace Todo.Controllers;

[Route("api/TodoItems")]
[ApiController]
public class TodoController : ControllerBase
{
    private readonly TodoContext _context;

    // Constructor
    public TodoController(TodoContext context)
    {
        _context = context;
        Console.WriteLine("TodoController initialized");
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        Console.WriteLine("GET /api/Todo called");
        var todos = _context.TodoItems.ToList();
        Console.WriteLine($"Returning {todos.Count} todos");
        return Ok(todos);
    }

    [HttpGet("all")]
    public async Task<ActionResult<IEnumerable<TodoItemDTO>>> GetTodoItems()
    {
        Console.WriteLine("GET /api/Todo/all called");
        var todoItems = await _context.TodoItems.ToListAsync();
        var todoDtos = todoItems.Select(ItemToDTO);
        Console.WriteLine($"Returning {todoDtos.Count()} DTOs");
        return Ok(todoDtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TodoItemDTO>> GetTodoItem(long id)
    {
        Console.WriteLine($"GET /api/Todo/{id} called");
        var todoItem = await _context.TodoItems.FindAsync(id);
        if (todoItem == null)
        {
            Console.WriteLine($"TodoItem {id} not found");
            return NotFound();
        }

        Console.WriteLine($"Returning TodoItem {id}");
        return ItemToDTO(todoItem);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutTodoItem(long id, TodoItem todoItem)
    {
        Console.WriteLine($"PUT /api/Todo/{id} called with Name={todoItem.Name}, IsComplete={todoItem.IsComplete}");
        if (id != todoItem.Id)
        {
            Console.WriteLine("Id mismatch");
            return BadRequest();
        }

        var existingTodo = await _context.TodoItems.FindAsync(id);
        if (existingTodo == null)
        {
            Console.WriteLine($"TodoItem {id} not found");
            return NotFound();
        }

        existingTodo.Name = todoItem.Name;
        existingTodo.IsComplete = todoItem.IsComplete;
        existingTodo.DueDate = todoItem.DueDate;
        existingTodo.CompletedDate = todoItem.IsComplete ? DateTime.Now : null;

        try
        {
            await _context.SaveChangesAsync();
            Console.WriteLine($"TodoItem {id} updated successfully");
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!TodoItemExists(id))
            {
                Console.WriteLine($"TodoItem {id} does not exist during update");
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    [HttpPost]
    public async Task<ActionResult<TodoItem>> PostTodoItem(TodoItem todoItem)
    {
        Console.WriteLine($"POST /api/Todo called with Name={todoItem.Name}");
        if (todoItem.IsComplete)
        {
            todoItem.CompletedDate = DateTime.Now;
        }

        _context.TodoItems.Add(todoItem);
        await _context.SaveChangesAsync();

        Console.WriteLine($"TodoItem {todoItem.Id} created");

        return CreatedAtAction(
            nameof(GetTodoItem),
            new { id = todoItem.Id },
            ItemToDTO(todoItem)
        );
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTodoItem(long id)
    {
        Console.WriteLine($"DELETE /api/Todo/{id} called");
        var todoItem = await _context.TodoItems.FindAsync(id);
        if (todoItem == null)
        {
            Console.WriteLine($"TodoItem {id} not found");
            return NotFound();
        }

        _context.TodoItems.Remove(todoItem);
        await _context.SaveChangesAsync();

        Console.WriteLine($"TodoItem {id} deleted");
        return NoContent();
    }

    private bool TodoItemExists(long id) =>
        _context.TodoItems.Any(e => e.Id == id);

    private static TodoItemDTO ItemToDTO(TodoItem todoItem) =>
        new()
        {
            Id = todoItem.Id,
            Name = todoItem.Name,
            IsComplete = todoItem.IsComplete,
            DueDate = todoItem.DueDate?.ToString("yyyy-MM-dd"),
            CompletedDate = todoItem.CompletedDate?.ToString("yyyy-MM-dd")
        };
}
