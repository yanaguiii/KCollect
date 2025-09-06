using KCollect.Api.Data;
using KCollect.Api.Models;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// --- CONFIGURAÇÃO DO CORS (MUITO IMPORTANTE!) ---
// Isso permite que seu app React (ex: localhost:3000) converse com a API .NET
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Coloque a URL do seu app React
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("AllowReactApp"); // Habilita a política de CORS

// --- ENDPOINTS DA API ---

// GET /api/wishlists -> Retorna todas as wishlists
app.MapGet("/api/wishlists", () => WishlistDb.Wishlists);

// GET /api/wishlists/{id} -> Retorna uma wishlist específica
app.MapGet("/api/wishlists/{id}", (string id) =>
{
    var wishlist = WishlistDb.Wishlists.FirstOrDefault(w => w.Id == id);
    return wishlist is not null ? Results.Ok(wishlist) : Results.NotFound();
});

// POST /api/wishlists -> Cria uma nova wishlist
// [FromBody] diz para o .NET pegar os dados do corpo da requisição
app.MapPost("/api/wishlists", ([FromBody] Wishlist wishlist) =>
{
    WishlistDb.Wishlists.Add(wishlist);
    return Results.Created($"/api/wishlists/{wishlist.Id}", wishlist);
});

// DELETE /api/wishlists/{id} -> Deleta uma wishlist
app.MapDelete("/api/wishlists/{id}", (string id) =>
{
    var wishlist = WishlistDb.Wishlists.FirstOrDefault(w => w.Id == id);
    if (wishlist is null)
    {
        return Results.NotFound();
    }
    WishlistDb.Wishlists.Remove(wishlist);
    return Results.NoContent();
});

// Para rodar a API, use o comando 'dotnet run' no terminal
app.Run();