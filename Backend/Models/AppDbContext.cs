using Microsoft.EntityFrameworkCore;

namespace Backend.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Product>()
                .HasOne(p => p.User)
                .WithMany(u => u.Products)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany()
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.Items)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Product)
                .WithMany()
                .HasForeignKey(oi => oi.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            // Seed Products
            modelBuilder.Entity<Product>().HasData(
                new Product
                {
                    Id = 1,
                    Image = "/assets/Image/tech/image 33.png",
                    Title = "Regular Fit Resort Shirt - Cool tech version",
                    Price = 57.70m,
                    OldPrice = null,
                    Rating = 7.5,
                    Stars = 4,
                    Orders = 154,
                    Category = "Clothes and wear",
                    Description = "An excellent summer clothing shirt designed for hot weather, matching full-size fits and durable cotton materials."
                },
                new Product
                {
                    Id = 2,
                    Image = "/assets/Image/tech/image 23.png",
                    Title = "Water boiler black for kitchen, 1200 Watt",
                    Price = 78.99m,
                    OldPrice = 90.00m,
                    Rating = 8.5,
                    Stars = 4.5,
                    Orders = 340,
                    Category = "Home interiors",
                    Description = "High quality water boiler with fast heating speed, sleek black design, safety auto-shutdown capability."
                },
                new Product
                {
                    Id = 3,
                    Image = "/assets/Image/tech/image 32.png",
                    Title = "GoPro HERO6 4K Action Camera - Black",
                    Price = 99.50m,
                    OldPrice = 120.00m,
                    Rating = 9.3,
                    Stars = 4.8,
                    Orders = 154,
                    Category = "Computer and tech",
                    Description = "Capture stunning 4K video and 12MP photos in Single, Burst, and Time Lapse modes. Waterproof to 33ft (10m) without a housing."
                },
                new Product
                {
                    Id = 4,
                    Image = "/assets/Layout/alibaba/Image/cloth/Bitmap.png",
                    Title = "T-shirts with multiple colors, for men",
                    Price = 10.30m,
                    OldPrice = 15.00m,
                    Rating = 7.2,
                    Stars = 4,
                    Orders = 98,
                    Category = "Clothes and wear",
                    Description = "Premium multi-color cotton T-shirts. Ideal for everyday use, highly breathable fabric with custom sizes."
                },
                new Product
                {
                    Id = 5,
                    Image = "/assets/Layout/alibaba/Image/cloth/image 26.png",
                    Title = "Solid Backpack blue jeans large size",
                    Price = 78.99m,
                    OldPrice = null,
                    Rating = 7.9,
                    Stars = 4,
                    Orders = 210,
                    Category = "Clothes and wear",
                    Description = "Durable canvas backpack styled in classic denim look. Large volume fits up to 15.6 inch laptops."
                },
                new Product
                {
                    Id = 6,
                    Image = "/assets/Image/tech/8.png",
                    Title = "Smart watches silver color modern",
                    Price = 19.00m,
                    OldPrice = 25.00m,
                    Rating = 8.0,
                    Stars = 4,
                    Orders = 520,
                    Category = "Computer and tech",
                    Description = "Modern smart watch featuring real-time health monitoring, step counter, bluetooth calls, and outstanding battery life."
                }
            );
        }
    }
}
