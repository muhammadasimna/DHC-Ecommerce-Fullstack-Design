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
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=ecommerce.db"));

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
            policy.AllowAnyOrigin()
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
    context.Database.EnsureCreated();

    var hasUserIdColumn = context.Database
        .SqlQueryRaw<int>("SELECT COUNT(*) FROM pragma_table_info('Products') WHERE name = 'UserId'")
        .AsEnumerable()
        .FirstOrDefault() > 0;

    if (!hasUserIdColumn)
    {
        context.Database.ExecuteSqlRaw("ALTER TABLE Products ADD COLUMN UserId INTEGER NULL");
    }

    var hasAdditionalImagesColumn = context.Database
        .SqlQueryRaw<int>("SELECT COUNT(*) FROM pragma_table_info('Products') WHERE name = 'AdditionalImagesJson'")
        .AsEnumerable()
        .FirstOrDefault() > 0;

    if (!hasAdditionalImagesColumn)
    {
        context.Database.ExecuteSqlRaw("ALTER TABLE Products ADD COLUMN AdditionalImagesJson TEXT NOT NULL DEFAULT '[]'");
    }

    context.Database.ExecuteSqlRaw(@"
CREATE TABLE IF NOT EXISTS Orders (
    Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    UserId INTEGER NOT NULL,
    CreatedAtUtc TEXT NOT NULL,
    Subtotal TEXT NOT NULL,
    Discount TEXT NOT NULL,
    Tax TEXT NOT NULL,
    Total TEXT NOT NULL,
    Status TEXT NOT NULL,
    FOREIGN KEY(UserId) REFERENCES Users(Id) ON DELETE CASCADE
)");

    context.Database.ExecuteSqlRaw(@"
CREATE TABLE IF NOT EXISTS OrderItems (
    Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    OrderId INTEGER NOT NULL,
    ProductId INTEGER NOT NULL,
    ProductTitle TEXT NOT NULL,
    ProductImage TEXT NOT NULL,
    UnitPrice TEXT NOT NULL,
    Quantity INTEGER NOT NULL,
    Size TEXT NOT NULL,
    Color TEXT NOT NULL,
    FOREIGN KEY(OrderId) REFERENCES Orders(Id) ON DELETE CASCADE,
    FOREIGN KEY(ProductId) REFERENCES Products(Id) ON DELETE RESTRICT
)");
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// Enable CORS
app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
