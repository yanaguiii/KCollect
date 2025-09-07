var builder = WebApplication.CreateBuilder(args);

// --- SERVIÇOS ---

// 1. Adiciona os serviços necessários para os Controllers funcionarem.
builder.Services.AddControllers();

// Adiciona a configuração do CORS que você já tinha.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173") 
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// --- MIDDLEWARE ---

app.UseCors("AllowReactApp");

// 2. Mapeia todos os endpoints que estão definidos nas suas classes de Controller.
app.MapControllers();

app.Run();