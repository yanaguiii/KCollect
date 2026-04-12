namespace KCollect.Api.Models;

public record Collection(string Id, string Name, List<Card> Cards);
