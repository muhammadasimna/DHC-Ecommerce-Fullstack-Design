using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public OrdersController(AppDbContext context, IConfiguration configuration)
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

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout()
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized(new { message = "Unauthorized access" });

            var cartItems = await _context.CartItems
                .Include(c => c.Product)
                .Where(c => c.UserId == userId.Value && !c.IsSavedForLater)
                .ToListAsync();

            if (cartItems.Count == 0)
            {
                return BadRequest(new { message = "Cart is empty" });
            }

            var subtotal = cartItems.Sum(i => (i.Product?.Price ?? 0m) * i.Quantity);
            var discount = subtotal > 100m ? 10m : 0m;
            var tax = subtotal * 0.05m;
            var total = subtotal - discount + tax;

            var order = new Order
            {
                UserId = userId.Value,
                Subtotal = subtotal,
                Discount = discount,
                Tax = tax,
                Total = total,
                Status = "Placed",
                CreatedAtUtc = DateTime.UtcNow
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            var orderItems = cartItems.Select(c => new OrderItem
            {
                OrderId = order.Id,
                ProductId = c.ProductId,
                ProductTitle = c.Product?.Title ?? "Product",
                ProductImage = c.Product?.Image ?? string.Empty,
                UnitPrice = c.Product?.Price ?? 0m,
                Quantity = c.Quantity,
                Size = c.Size,
                Color = c.Color
            }).ToList();

            _context.OrderItems.AddRange(orderItems);
            _context.CartItems.RemoveRange(cartItems);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Order placed successfully", orderId = order.Id });
        }

        [HttpGet]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized(new { message = "Unauthorized access" });

            var orders = await _context.Orders
                .Where(o => o.UserId == userId.Value)
                .OrderByDescending(o => o.CreatedAtUtc)
                .Select(o => new
                {
                    o.Id,
                    o.CreatedAtUtc,
                    o.Subtotal,
                    o.Discount,
                    o.Tax,
                    o.Total,
                    o.Status,
                    Items = o.Items.Select(i => new
                    {
                        i.Id,
                        i.ProductId,
                        i.ProductTitle,
                        i.ProductImage,
                        i.UnitPrice,
                        i.Quantity,
                        i.Size,
                        i.Color
                    }).ToList()
                })
                .ToListAsync();

            return Ok(orders);
        }
    }
}
