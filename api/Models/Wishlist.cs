namespace KCollect.Api.Models;

public record Wishlist(string Id, string ArtistName, string ArtistPhotoUrl, List<Collection> Collections);
