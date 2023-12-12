using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1.Ocsp;
using server.Helper;
using server.Helper.statistics;
using server.Interfaces;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatisticsController : ControllerBase
    {
        private readonly IStatisticsService _statisticsService;
        public StatisticsController(IStatisticsService statisticsService)
        {
            _statisticsService = statisticsService;
        }
        [HttpPost]
        public IActionResult RevenueStatistics(RevenueStatisticsRequest request)
        {
            var data = _statisticsService.RevenueStatistics(request);
            return Ok(data);
        }

        [HttpPost("GenerateListProduct")]
        public IActionResult GenerateListProduct(ProductStatisticSearchRequest request)
        {
            try
            {
                // Tạo Stream để lưu trữ dữ liệu Excel được tạo ra từ phương thức GenerateListProduct
                MemoryStream stream = new MemoryStream();

                // Gọi phương thức GenerateListProduct từ _statisticsService và nhận kết quả Stream trả về
                var generatedExcel = _statisticsService.GenerateListProduct(request, null);

                // Kiểm tra xem có dữ liệu Excel được tạo thành công không

                stream.Position = 0;

                // Trả về dữ liệu Excel
                return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "GeneratedProductList.xlsx");

            }
            catch (Exception ex)
            {
                // Xử lý lỗi và trả về thông báo lỗi
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPost("total-Product-Price")]
        public async Task<IActionResult> TotalProductInOrder(int productId)
        {
            var total = await  _statisticsService.TotalProductPrice(productId);
            return Ok(total);

        }

        [HttpGet("GetListOrder")]
        public async Task<IActionResult> GetListAllOrder()
        {
            var data = await _statisticsService.ListAllOrders();
            return Ok(data);
        }

        [HttpPost("ProductStatistics")]
        public IActionResult ProductStatistics(ProductStatisticsRequest request)
        {
            var data = _statisticsService.ProductStatistics(request);
            return Ok(data);
        }
        [HttpGet("StatusOrderStatistics")]
        public IActionResult StatusOrderStatistics()
        {
            return Ok(_statisticsService.StatusOrderStatistics());

        }
        [HttpPost("GetListProductStatistic")]
        public IActionResult GetListProductStatistic(ProductStatisticSearchRequest request)
        {
            var data = _statisticsService.GetListProduct(request);
            return Ok(data);
        }
        [HttpPost("GetListProductOrderStatistic")]
        public IActionResult GetListProductOrderStatistic(ProductStatisticSearchRequest request)
        {
            var data = _statisticsService.GetListProductOrder(request);
            return Ok(data);
        }

    }
}