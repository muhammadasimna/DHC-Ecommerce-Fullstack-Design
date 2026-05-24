using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public CartController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        private int? GetCurrentUserId()
        {
            var authHeader = Request.Headers["Authorization"].ToString();
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                return null;
            }

            var tokenString = authHeader.Substring(7);
            var tokenHandler = new JwtSecurityTokenHandler();
            try
            {
                var secretKey = _configuration["Jwt:Key"] ?? "super_secret_key_12345678901234567890";
                var key = Encoding.ASCII.GetBytes(secretKey);

                tokenHandler.ValidateToken(tokenString, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var idClaim = jwtToken.Claims.FirstOrDefault(x => x.Type == "id")?.Value;
                return idClaim != null ? int.Parse(idClaim) : null;
            }
            catch
            {
                return null;
            }
        }

        // GET active cart items (not saved for later)
        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized(new { message = "Unauthorized access" });

            var cartItems = await _context.CartItems
                .Include(c => c.Product)
                .Where(c => c.UserId == userId.Value && !c.IsSavedForLater)
                .ToListAsync();

            return Ok(cartItems);
        }

        // GET saved for later items
        [HttpGet("saved")]
        public async Task<IActionResult> GetSavedForLater()
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized(new { message = "Unauthorized access" });

            var savedItems = await _context.CartItems
                .Include(c => c.Product)
                .Where(c => c.UserId == userId.Value && c.IsSavedForLater)
                .ToListAsync();

            return Ok(savedItems);
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartDto dto)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized(new { message = "Unauthorized access" });

            var product = await _context.Products.FindAsync(dto.ProductId);
            if (product == null)
            {
                return NotFound(new { message = "Product not found" });
            }

            // Check if item already exists in cart with same size and color
            var existingItem = await _context.CartItems
                .FirstOrDefaultAsync(c => c.UserId == userId.Value && c.ProductId == dto.ProductId && c.Size == dto.Size && c.Color == dto.Color && !c.IsSavedForLater);

            if (existingItem != null)
            {
                existingItem.Quantity += dto.Quantity;
            }
            else
            {
                var cartItem = new CartItem
                {
                    UserId = userId.Value,
                    ProductId = dto.ProductId,
                    Quantity = dto.Quantity,
                    Size = dto.Size,
                    Color = dto.Color,
                    IsSavedForLater = false
                };
                _context.CartItems.Add(cartItem);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Product added to cart successfully" });
        }

        [HttpPut("update-qty")]
        public async Task<IActionResult> UpdateQuantity([FromBody] UpdateQtyDto dto)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized(new { message = "Unauthorized access" });

            var cartItem = await _context.CartItems
                .FirstOrDefaultAsync(c => c.Id == dto.CartItemId && c.UserId == userId.Value);

            if (cartItem == null)
            {
                return NotFound(new { message = "Cart item not found" });
            }

            if (dto.Quantity <= 0)
            {
                _context.CartItems.Remove(cartItem);
            }
            else
            {
                cartItem.Quantity = dto.Quantity;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cart quantity updated successfully" });
        }

        // Move cart item to "saved for later"
        [HttpPut("save-for-later/{id}")]
        public async Task<IActionResult> SaveForLater(int id)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized(new { message = "Unauthorized access" });

            var cartItem = await _context.CartItems
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId.Value);

            if (cartItem == null)
            {
                return NotFound(new { message = "Cart item not found" });
            }

            cartItem.IsSavedForLater = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Item saved for later" });
        }

        // Move saved item back to cart
        [HttpPut("move-to-cart/{id}")]
        public async Task<IActionResult> MoveToCart(int id)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized(new { message = "Unauthorized access" });

            var cartItem = await _context.CartItems
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId.Value);

            if (cartItem == null)
            {
                return NotFound(new { message = "Saved item not found" });
            }

            cartItem.IsSavedForLater = false;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Item moved to cart" });
        }

        [HttpDelete("remove/{id}")]
        public async Task<IActionResult> RemoveFromCart(int id)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized(new { message = "Unauthorized access" });

            var cartItem = await _context.CartItems
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId.Value);

            if (cartItem == null)
            {
                return NotFound(new { message = "Cart item not found" });
            }

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Item removed from cart successfully" });
        }

        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized(new { message = "Unauthorized access" });

            var items = await _context.CartItems.Where(c => c.UserId == userId.Value && !c.IsSavedForLater).ToListAsync();
            _context.CartItems.RemoveRange(items);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cart cleared successfully" });
        }

        [HttpPost("save-product")]
        public async Task<IActionResult> SaveProduct([FromBody] SaveProductDto dto)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized(new { message = "Unauthorized access" });

            var product = await _context.Products.FindAsync(dto.ProductId);
            if (product == null)
            {
                return NotFound(new { message = "Product not found" });
            }

            // Check if item already exists as saved for later
            var existingItem = await _context.CartItems
                .FirstOrDefaultAsync(c => c.UserId == userId.Value && c.ProductId == dto.ProductId && c.Size == dto.Size && c.Color == dto.Color && c.IsSavedForLater);

            if (existingItem == null)
            {
                var cartItem = new CartItem
                {
                    UserId = userId.Value,
                    ProductId = dto.ProductId,
                    Quantity = 1,
                    Size = dto.Size,
                    Color = dto.Color,
                    IsSavedForLater = true
                };
                _context.CartItems.Add(cartItem);
                await _context.SaveChangesAsync();
            }

            return Ok(new { message = "Product saved for later successfully" });
        }
    }

    public class AddToCartDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public string Size { get; set; } = "medium";
        public string Color { get; set; } = "blue";
    }

    public class UpdateQtyDto
    {
        public int CartItemId { get; set; }
        public int Quantity { get; set; }
    }

    public class SaveProductDto
    {
        public int ProductId { get; set; }
        public string Size { get; set; } = "medium";
        public string Color { get; set; } = "blue";
    }
}
