namespace Backend.Models
{
    public class CartItem
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public int ProductId { get; set; }
        public Product? Product { get; set; }
        public int Quantity { get; set; }
        public string Size { get; set; } = "medium";
        public string Color { get; set; } = "blue";
        public bool IsSavedForLater { get; set; } = false;
    }
}
