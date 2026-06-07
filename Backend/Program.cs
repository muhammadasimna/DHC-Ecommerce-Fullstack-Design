using System.Text;
using Backend.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure SQLite Database
//builder.Services.AddDbContext<AppDbContext>(options =>
//    options.UseSqlite("Data Source=ecommerce.db"));

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer("Server=db55091.public.databaseasp.net;Database=db55091;User Id=db55091;Password=Mx7?g5%X#T9n;Encrypt=True;TrustServerCertificate=True;MultipleActiveResultSets=True;",
        sqlServerOptions => sqlServerOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null)));


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// Configure JWT Authentication
var secretKey = builder.Configuration["Jwt:Key"] ?? "super_secret_key_12345678901234567890";
var key = Encoding.ASCII.GetBytes(secretKey);

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero
    };
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.WithOrigins(
                      "https://dhc-ecommerce-fullstack.netlify.app",
                      "http://localhost:5173",
                      "http://localhost:5174"
                  )
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

builder.Services.AddOpenApi();

var app = builder.Build();

// Ensure Database is Created
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.Migrate();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable CORS (must be before any other middleware that might reject/redirect requests)
app.UseCors("AllowAll");

// Note: HTTPS redirection removed - runasp.net handles HTTPS at the reverse proxy level.
// Adding UseHttpsRedirection here breaks CORS preflight requests on HTTP endpoints.


app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
