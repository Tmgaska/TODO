namespace Todo.Models;

public class TodoItem
{
    public long Id { get; set; }
    public string? Name { get; set; }

    public bool IsComplete { get; set; }

    public DateTime? DueDate { get; set; }

    public DateTime? CompletedDate { get; set; }
}
