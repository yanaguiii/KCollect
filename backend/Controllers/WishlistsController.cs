using KCollect.Api.Data;
using KCollect.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace KCollect.Api.Controllers;

// [ApiController] habilita comportamentos padrão de API, como validação automática.
[ApiController]
// [Route("api/[controller]")] define a URL base para todos os endpoints nesta classe.
// "[controller]" é um token especial que é substituído pelo nome da classe sem o sufixo "Controller".
// Ou seja, a URL base será "/api/wishlists".
[Route("api/[controller]")]
public class WishlistsController : ControllerBase // Controllers de API herdam de ControllerBase
{
    // GET /api/wishlists
    [HttpGet]
    public IActionResult GetWishlists()
    {
        // Ok() cria uma resposta HTTP 200 OK com os dados no corpo.
        return Ok(WishlistDb.Wishlists);
    }

    // GET /api/wishlists/{id}
    // O "{id}" na rota corresponde ao parâmetro "string id" do método.
    [HttpGet("{id}")]
    public IActionResult GetWishlistById(string id)
    {
        var wishlist = WishlistDb.Wishlists.FirstOrDefault(w => w.Id == id);
        if (wishlist is null)
        {
            // NotFound() cria uma resposta HTTP 404 Not Found.
            return NotFound();
        }
        return Ok(wishlist);
    }

    // POST /api/wishlists
    [HttpPost]
    public IActionResult CreateWishlist([FromBody] Wishlist wishlist)
    {
        WishlistDb.Wishlists.Add(wishlist);
        // Created() cria uma resposta HTTP 201 Created.
        return Created($"/api/wishlists/{wishlist.Id}", wishlist);
    }

    // PUT /api/wishlists/{id}
    [HttpPut("{id}")]
    public IActionResult UpdateWishlist(string id, [FromBody] Wishlist updatedWishlist)
    {
        var wishlist = WishlistDb.Wishlists.FirstOrDefault(w => w.Id == id);
        if (wishlist is null)
        {
            return NotFound();
        }

        var index = WishlistDb.Wishlists.IndexOf(wishlist);
        WishlistDb.Wishlists[index] = updatedWishlist;
        
        // Retorna a lista atualizada para fins de debug, ou poderia retornar Ok(updatedWishlist)
        return Ok(WishlistDb.Wishlists);
    }

    // DELETE /api/wishlists/{id}
    [HttpDelete("{id}")]
    public IActionResult DeleteWishlist(string id)
    {
        var wishlist = WishlistDb.Wishlists.FirstOrDefault(w => w.Id == id);
        if (wishlist is null)
        {
            return NotFound();
        }
        WishlistDb.Wishlists.Remove(wishlist);
        // NoContent() cria uma resposta HTTP 204 No Content, o padrão para DELETE.
        return NoContent();
    }
    
    // --- Endpoints Aninhados ---

    // POST /api/wishlists/{wishlistId}/collections
    [HttpPost("{wishlistId}/collections")]
    public IActionResult AddCollection(string wishlistId, [FromBody] Collection collection)
    {
        var wishlist = WishlistDb.Wishlists.FirstOrDefault(w => w.Id == wishlistId);
        if (wishlist is null) return NotFound("Wishlist não encontrada.");
        
        wishlist.Collections.Add(collection);
        return Created($"/api/wishlists/{wishlistId}/collections/{collection.Id}", collection);
    }

    // PUT /api/wishlists/{wishlistId}/collections/{collectionId}
    [HttpPut("{wishlistId}/collections/{collectionId}")]
    public IActionResult UpdateCollection(string wishlistId, string collectionId, [FromBody] Collection updatedCollection)
    {
        var wishlist = WishlistDb.Wishlists.FirstOrDefault(w => w.Id == wishlistId);
        if (wishlist is null) return NotFound("Wishlist não encontrada.");

        var collectionToUpdate = wishlist.Collections.FirstOrDefault(c => c.Id == collectionId);
        if (collectionToUpdate is null) return NotFound("Coleção não encontrada.");

        var index = wishlist.Collections.IndexOf(collectionToUpdate);
        wishlist.Collections[index] = updatedCollection;

        return Ok(updatedCollection);
    }

    // DELETE /api/wishlists/{wishlistId}/collections/{collectionId}
    [HttpDelete("{wishlistId}/collections/{collectionId}")]
    public IActionResult DeleteCollection(string wishlistId, string collectionId)
    {
        var wishlist = WishlistDb.Wishlists.FirstOrDefault(w => w.Id == wishlistId);
        if (wishlist is null) return NotFound("Wishlist não encontrada.");

        var collection = wishlist.Collections.FirstOrDefault(c => c.Id == collectionId);
        if (collection is null) return NotFound("Coleção não encontrada.");

        wishlist.Collections.Remove(collection);
        return NoContent();
    }
    
    // POST /api/wishlists/{wishlistId}/collections/{collectionId}/cards
    [HttpPost("{wishlistId}/collections/{collectionId}/cards")]
    public IActionResult AddCard(string wishlistId, string collectionId, [FromBody] Card card)
    {
        var wishlist = WishlistDb.Wishlists.FirstOrDefault(w => w.Id == wishlistId);
        if (wishlist is null) return NotFound("Wishlist não encontrada.");

        var collection = wishlist.Collections.FirstOrDefault(c => c.Id == collectionId);
        if (collection is null) return NotFound("Coleção não encontrada.");

        collection.Cards.Add(card);
        return Created($"/api/wishlists/{wishlistId}/collections/{collectionId}/cards/{card.Id}", card);
    }
}