using server.enums;
using server.Models;
using System.Collections.Generic;
using System.ComponentModel;
using System;

namespace server.Helper.order
{
    public class AllOrder
    {
        public int id { get; set; }
        [DefaultValue(OrderStatus.NotConfirm)]
        public OrderStatus status { get; set; }
        public int total { get; set; }
        public string note { get; set; }
        public string address { get; set; }
        public string street { get; set; }
        public int feeShip { get; set; }
        public DateTime deliveryDate { get; set; }
        //guess
        public string guess { get; set; }
        public string phone { get; set; }
        public string email { get; set; }
        public DateTime createDate { get; set; }
        //foreign key
        public Guid? userId { get; set; }
        public AppUser user { get; set; }
        public virtual ICollection<OrderDetail> OrderDetails { get; set; }
    }
}
