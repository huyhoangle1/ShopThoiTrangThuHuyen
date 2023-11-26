using Microsoft.EntityFrameworkCore;
using server.Data;
using server.enums;
using server.Helper.order;
using server.Interfaces;
using server.Models;
using server.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace server.Services
{
    public class OrderService : IOrderService
    {
        private readonly ShopDbContext _context;
        private static readonly HttpClient client = new HttpClient();
        public OrderService(ShopDbContext context)
        {
            _context = context;
        }

        public async Task<bool> QrMoMo()
        {
            
            return true;
        }

        private static String getSignature(String text, String key)
        {
            // change according to your needs, an UTF8Encoding
            // could be more suitable in certain situations
            ASCIIEncoding encoding = new ASCIIEncoding();

            Byte[] textBytes = encoding.GetBytes(text);
            Byte[] keyBytes = encoding.GetBytes(key);

            Byte[] hashBytes;

            using (HMACSHA256 hash = new HMACSHA256(keyBytes))
                hashBytes = hash.ComputeHash(textBytes);

            return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
        }

        public async Task<int> Create(OrderCreateRequest request)
        {
            var order = new Order()
            {
                address = request.address,
                street = request.street,
                createDate = DateTime.Now,
                guess = request.guess,
                phone = request.phone,
                email = request.email,
                note = request.note,
                feeShip = request.feeShip,
                deliveryDate = request.feeShip == 20000 ? DateTime.Now.AddDays(1) : DateTime.Now.AddDays(3),
                status = enums.OrderStatus.NotConfirm,
                total = request.total,
                userId = request.userId,
                OrderDetails = request.OrderDetails
            };
            _context.orders.Add(order);
            await _context.SaveChangesAsync();
            return order.id;
        }

        public async Task<bool> CheckAmount(OrderCreateRequest request)
        {
            foreach (var orderDetail in request.OrderDetails)
            {
                var product = await _context.products.FindAsync(new object[] { orderDetail.productId });

                if (product != null && orderDetail.quantity > product.amount)
                {
                    return false;
                }
            }

            return true;
        }

        public async Task<List<OrderViewModel>> GetOrderListByUserId(Guid userId)
        {
            var data = await _context.orders.Where(x => x.userId == userId && x.status != OrderStatus.Cancel)
            .Select(y => new OrderViewModel
            {
                id = y.id,
                address = y.address,
                createDate = y.createDate,
                deliveryDate = y.deliveryDate,
                email = y.email,
                guess = y.guess,
                note = y.note,
                feeShip = y.feeShip,
                OrderDetails = y.OrderDetails,
                phone = y.phone,
                status = y.status,
                street = y.street,
                total = y.total,
                user = y.user,
                 userId = y.userId.HasValue ? y.userId.Value : Guid.Empty, 
            }).ToListAsync();
            return data;
        }
    }
}
