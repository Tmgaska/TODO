using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Todo.Models;

namespace Todo.Controllers;

[Route("api/TodoItems")]
[ApiController]
public class TodoController : ControllerBase//TodoController は、ASP.NET Core で Web API を作る
{
    private readonly TodoContext _context;

    public TodoController(TodoContext context)
    {
        _context = context;
        Console.WriteLine("TodoController initialized");//受け取った context を _context にコピーして保存
    }
    //end points
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoItemDTO>>> GetTodoItems()
    {
        Console.WriteLine("GET /api/Todo called");
        var todoItems = await _context.TodoItems.ToListAsync();
        var todoDtos = todoItems.Select(ItemToDTO);
        Console.WriteLine($"Returning {todoDtos.Count()} DTOs");
        return Ok(todoDtos);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TodoItemDTO>> PutTodoItem(long id, TodoItem todoItem)
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
        catch (DbUpdateConcurrencyException)//two users try to update the same database row
        {
            if (!TodoItemExists(id))
            {
                Console.WriteLine($"TodoItem {id} does not exist during update");
                return NotFound();//TodoItem が 存在しない場合
            }
            throw;
        }

        return Ok(ItemToDTO(existingTodo));
    }

    [HttpPost]
    public async Task<ActionResult<TodoItem>> PostTodoItem(TodoItem todoItem)//フロントエンドから送られてくる Todo データ
    {
        Console.WriteLine($"POST /api/Todo called with Name={todoItem.Name}");
        if (todoItem.IsComplete)
        {
            todoItem.CompletedDate = DateTime.Now;
        }
        _context.TodoItems.Add(todoItem);
        await _context.SaveChangesAsync();

        Console.WriteLine($"TodoItem {todoItem.Id} created");

        return todoItem;
        
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
    //helper methods
    private static TodoItemDTO ItemToDTO(TodoItem todoItem) =>
        new()
        {
            Id = todoItem.Id,
            Name = todoItem.Name,
            IsComplete = todoItem.IsComplete,
            DueDate = todoItem.DueDate?.ToString("yyyy-MM-dd"),//DueDate が null なら null
            CompletedDate = todoItem.CompletedDate?.ToString("yyyy-MM-dd")//完了していない Todo は null
        };
}
