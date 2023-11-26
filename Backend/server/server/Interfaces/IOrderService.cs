using server.Helper.order;
using server.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Interfaces
{
    public interface IOrderService
    {
        Task<int> Create(OrderCreateRequest request);
        Task<bool> QrMoMo();
        Task<List<OrderViewModel>> GetOrderListByUserId(Guid userId);
        Task<bool> CheckAmount(OrderCreateRequest request);
    }
}
