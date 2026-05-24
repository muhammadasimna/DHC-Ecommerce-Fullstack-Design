using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts([FromQuery] string? category)
        {
            var query = _context.Products.AsQueryable().Where(p => p.UserId == null);
            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(p => p.Category.ToLower() == category.ToLower());
            }
            return await query.ToListAsync();
        }

        [HttpGet("mine")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Product>>> GetMyProducts([FromQuery] string? category)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(new { message = "Not authenticated" });
            }

            var query = _context.Products.AsQueryable().Where(p => p.UserId == userId);
            if (!string.IsNullOrWhiteSpace(category))
            {
                var categoryText = category.Trim().ToLower();
                query = query.Where(p => p.Category.ToLower() == categoryText);
            }

            return await query.OrderByDescending(p => p.Id).ToListAsync();
        }

        [HttpGet("recommended")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Product>>> GetRecommendedProducts()
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(new { message = "Not authenticated" });
            }

            var products = await _context.Products
                .Where(p => p.UserId != null && p.UserId != userId)
                .OrderByDescending(p => p.Id)
                .Take(10)
                .ToListAsync();

            return products;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound(new { message = "Product not found" });
            }
            return product;
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Product>> CreateProduct([FromBody] ProductDto dto)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(new { message = "Not authenticated" });
            }

            var product = new Product
            {
                UserId = userId,
                Image = dto.Image,
                AdditionalImagesJson = JsonSerializer.Serialize(dto.AdditionalImages ?? new List<string>()),
                Title = dto.Title,
                Price = dto.Price,
                OldPrice = dto.OldPrice,
                Rating = dto.Rating,
                Stars = dto.Stars,
                Orders = dto.Orders,
                Category = dto.Category,
                Description = dto.Description
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<Product>> UpdateProduct(int id, [FromBody] ProductDto dto)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(new { message = "Not authenticated" });
            }

            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);
            if (product == null)
            {
                return NotFound(new { message = "Product not found or not owned by current user" });
            }

            product.Image = dto.Image;
            product.AdditionalImagesJson = JsonSerializer.Serialize(dto.AdditionalImages ?? new List<string>());
            product.Title = dto.Title;
            product.Price = dto.Price;
            product.OldPrice = dto.OldPrice;
            product.Rating = dto.Rating;
            product.Stars = dto.Stars;
            product.Orders = dto.Orders;
            product.Category = dto.Category;
            product.Description = dto.Description;

            await _context.SaveChangesAsync();
            return Ok(product);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(new { message = "Not authenticated" });
            }

            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);
            if (product == null)
            {
                return NotFound(new { message = "Product not found or not owned by current user" });
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private int? GetCurrentUserId()
        {
            var claim = User.FindFirst("id") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
            {
                return null;
            }

            return int.TryParse(claim.Value, out var userId) ? userId : null;
        }
    }

    public class ProductDto
    {
        public string Image { get; set; } = string.Empty;
        public List<string>? AdditionalImages { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? OldPrice { get; set; }
        public double Rating { get; set; }
        public double Stars { get; set; }
        public int Orders { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}
