namespace Backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Location { get; set; } = "Global";
        public bool IsVerified { get; set; } = true;
        public string ShippingPolicy { get; set; } = "Worldwide shipping";
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
