using KCollect.Api.Models; // Garanta que o namespace esteja correto

namespace KCollect.Api.Data;

public static class WishlistDb
{
    // Nossa "tabela" de wishlists em memória
    public static readonly List<Wishlist> Wishlists = new List<Wishlist>()
    {
        // Podemos iniciar com alguns dados de exemplo
        new Wishlist(
            Id: "wish_1",
            ArtistName: "LE SSERAFIM",
            ArtistPhotoUrl: "",
            Collections: new List<Collection>()
            {
                new Collection(
                    Id: "coll_1",
                    Name: "FEARLESS",
                    Cards: new List<Card>()
                    {
                        new Card("card_1", "", true),
                        new Card("card_2", "", false)
                    }
                )
            }
        )
    };
}