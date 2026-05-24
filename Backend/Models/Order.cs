namespace Backend.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
        public decimal Subtotal { get; set; }
        public decimal Discount { get; set; }
        public decimal Tax { get; set; }
        public decimal Total { get; set; }
        public string Status { get; set; } = "Placed";
        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    }
}
