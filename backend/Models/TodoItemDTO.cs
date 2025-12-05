namespace Todo.Models;

public class TodoItemDTO
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public bool IsComplete { get; set; }

    public string? DueDate { get; set; }
    public string? CompletedDate { get; set; }

}
public class TodoItemCreateDTO
{
    public string Name { get; set; } = null!;
    public bool IsComplete { get; set; } = false;
    public DateTime? DueDate { get; set; }
}

public class TodoItemUpdateDTO
{
    public string Name { get; set; } = null!;
    public bool IsComplete { get; set; }
    public DateTime? DueDate { get; set; }
}