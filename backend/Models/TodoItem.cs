namespace Todo.Models;

public class TodoItem
{
    public int Id { get; set; }
    public string? Name { get; set; }

    public bool IsComplete { get; set; }

    public DateTime? DueDate { get; set; }

    public DateTime? CompletedDate { get; set; }
}
