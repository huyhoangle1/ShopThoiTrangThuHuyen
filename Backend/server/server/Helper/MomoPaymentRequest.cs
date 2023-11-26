namespace server.Helper
{
    public class MomoPaymentRequest
    {
        public decimal Amount { get; set; }
        public string OrderId { get; set; }
        public string ReturnUrl { get; set; }
        // Thêm các thông tin khác cần thiết cho yêu cầu thanh toán
    }
}
