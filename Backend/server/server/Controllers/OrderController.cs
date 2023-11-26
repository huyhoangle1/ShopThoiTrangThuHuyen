using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using MoMo;
using Newtonsoft.Json.Linq;
using Org.BouncyCastle.Asn1.Ocsp;
using server.Helper.order;
using server.Hubs;
using server.Interfaces;
using server.Services;
using server.ViewModel;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        public readonly IOrderService _orderService;
        private readonly IHubContext<ChatHub> _hubContext;
        public readonly IProductService _productService;
        private static readonly HttpClient client = new HttpClient();

        private Guid adminId = new Guid("4557893f-1f56-4b6f-bb3b-caefd62c8c49");
        public OrderController(IOrderService orderService, [NotNull]IHubContext<ChatHub> hubContext, IProductService productService)
        {
            _orderService = orderService;
            _hubContext = hubContext;
            _productService = productService;
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

        [HttpPost("qrmomo")]
        public async Task<IActionResult> QrMomo([FromBody] OrderCreateRequest request)
        {
            //request params need to request to MoMo system
            string endpoint = "https://test-payment.momo.vn/gw_payment/transactionProcessor";
            string partnerCode = "MOMOOJOI20210710";
            string accessKey = "iPXneGmrJH0G8FOP";
            string serectkey = "sFcbSGRSJjwGxwhhcEktCHWYUuTuPNDB";
            string orderInfo = request?.note;
            string returnUrl = "http://localhost:44394/";
            string notifyurl = "http://localhost:44394/"; 

            string amount = (request.total).ToString();
            string orderid = DateTime.Now.Ticks.ToString(); //mã đơn hàng
            string requestId = DateTime.Now.Ticks.ToString();
            string extraData = "";

            //Before sign HMAC SHA256 signature
            string rawHash = "partnerCode=" +
                partnerCode + "&accessKey=" +
                accessKey + "&requestId=" +
                requestId + "&amount=" +
                amount + "&orderId=" +
                orderid + "&orderInfo=" +
                orderInfo + "&returnUrl=" +
                returnUrl + "&notifyUrl=" +
                notifyurl + "&extraData=" +
                extraData;

            MoMoSecurity crypto = new MoMoSecurity();
            //sign signature SHA256
            string signature = crypto.signSHA256(rawHash, serectkey);

            //build body json request
            JObject message = new JObject
            {
                { "partnerCode", partnerCode },
                { "accessKey", accessKey },
                { "requestId", requestId },
                { "amount", amount },
                { "orderId", orderid },
                { "orderInfo", orderInfo },
                { "returnUrl", returnUrl },
                { "notifyUrl", notifyurl },
                { "extraData", extraData },
                { "requestType", "captureMoMoWallet" },
                { "signature", signature }

            };

            string responseFromMomo = PaymentRequest.sendPaymentRequest(endpoint, message.ToString());

            JObject jmessage = JObject.Parse(responseFromMomo);

            return Ok(jmessage.GetValue("payUrl").ToString());
        }

        [HttpPost]
        public async Task<IActionResult> create([FromBody]OrderCreateRequest request)
        {
            var a = await _orderService.CheckAmount(request);
            if (!a)
            {
                return BadRequest("Số lượng sản phẩm không đủ vui lòng nhập lại số lượng !!!");
            }
            var orderId = await _orderService.Create(request);
            if (orderId == 0)
            {
                return BadRequest("Đặt hàng thất bại!");
            }
            
            var notify = new NotifyViewModel()
            {
                notify = $"Có khách vừa mới đặt hàng!",
                link = "/admin/order-manage/order-not-confirm",
                //senderId = request.userId.HasValue ? request.userId.Value ? null,
                receiverId = adminId,
                isViewed = false,
                status = enums.NotifyStatus.order,
            };
            await _hubContext.Clients.All.SendAsync("ReceiveNotify", notify);
            return Ok("Đặt hàng thành công! Admin sẽ thông báo đến bạn thông qua số điện thoại hoặc gmail! Trân trọng!");
        }
        [HttpGet("GetOrderListByUserId/{userId}")]
        public async Task<IActionResult> GetOrderListByUserId(Guid userId)
        {
            var list = await _orderService.GetOrderListByUserId(userId);
            return Ok(list);
        }
    }
}