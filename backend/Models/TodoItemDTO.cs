namespace Todo.Models;

public class TodoItemDTO
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public bool IsComplete { get; set; }

    public string? DueDate { get; set; }
    public string? CompletedDate { get; set; }

}