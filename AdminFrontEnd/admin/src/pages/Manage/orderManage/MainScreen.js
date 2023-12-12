import React, { Component } from 'react';
import Header from '../../../components/common/Header';
import Sidebar from '../../../components/common/Sidebar';
import '../../../components/common/styleCommon/Content.css';
import BreadScrumb from '../../../components/breadScrumb/BreadScrumb';
import { Card, Space, Typography } from "antd";
import {
  AndroidOutlined,
  AuditOutlined,
  DollarOutlined,
  MedicineBoxOutlined,
  RadarChartOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";

export default class MainScreen extends Component {
    render() {
        return (
            <>
            <Header></Header>   
                <div className="main_container">
                    <Sidebar isActive="13"></Sidebar>
                    <div className="content">
                        <BreadScrumb title="Home"></BreadScrumb>
                        <br></br>
                        
                        <div style={{ overflow: "hidden", padding: 10 }}>
            <Typography.Title level={2}>Thống kê tổng quát</Typography.Title>
            <Space>
              <Card
                title={
                  <>
                    <Typography.Title level={4} style={{ marginTop: 20 }}>
                    </Typography.Title>
                    <Typography.Title level={5} style={{ marginBottom: 20 }}>
                      Số lượng tài khoản
                    </Typography.Title>
                  </>
                }
                extra={<UsergroupAddOutlined style={{ fontSize: 50 }} />}
                style={{
                  width: 260,
                  backgroundColor: "orange",
                }}
              ></Card>
              <Card
                title={
                  <>
                    <Typography.Title level={4} style={{ marginTop: 20 }}>
                      {/* {dataNCC.length} */}
                    </Typography.Title>
                    <Typography.Title level={5} style={{ marginBottom: 20 }}>
                      Số lượng NCC
                    </Typography.Title>
                  </>
                }
                extra={<AndroidOutlined style={{ fontSize: 50 }} />}
                style={{
                  width: 260,
                  backgroundColor: "#00C4FF",
                }}
              ></Card>
              <Card
                title={
                  <>
                    <Typography.Title level={4} style={{ marginTop: 20 }}>
                      {/* {dataHD.length} */}
                    </Typography.Title>
                    <Typography.Title level={5} style={{ marginBottom: 20 }}>
                        Số lượng đơn hàng
                    </Typography.Title>
                  </>
                }
                extra={<AuditOutlined style={{ fontSize: 50 }} />}
                style={{
                  width: 260,
                  backgroundColor: "green",
                }}
              ></Card>
              <Card
                title={
                  <>
                    <Typography.Title level={4} style={{ marginTop: 20 }}>
                    </Typography.Title>
                    <Typography.Title level={5} style={{ marginBottom: 20 }}>
                      Tổng doanh thu
                    </Typography.Title>
                  </>
                }
                extra={<DollarOutlined style={{ fontSize: 50 }} />}
                style={{
                  width: 260,
                  backgroundColor: "#FFD4B2",
                }}
              ></Card>
            </Space>
            <Space>
              <Card
                title={
                  <>
                    <Typography.Title level={4} style={{ marginTop: 20 }}>
                    </Typography.Title>
                    <Typography.Title level={5} style={{ marginBottom: 20 }}>
                      Số lượng sản phẩm
                    </Typography.Title>
                  </>
                }
                extra={<RadarChartOutlined style={{ fontSize: 50 }} />}
                style={{
                  width: 260,
                  backgroundColor: "red",
                }}
              ></Card>
              <Card
                title={
                  <>
                    <Typography.Title level={4} style={{ marginTop: 20 }}>
                      {/* {new Intl.NumberFormat("de-DE").format(totalNK)} */}
                    </Typography.Title>
                    <Typography.Title level={5} style={{ marginBottom: 20 }}>
                      Sản phẩm hết hàng
                    </Typography.Title>
                  </>
                }
                extra={<MedicineBoxOutlined style={{ fontSize: 50 }} />}
                style={{
                  width: 260,
                  backgroundColor: "purple",
                }}
              ></Card>
              <Card
                title={
                  <>
                    <Typography.Title level={4} style={{ marginTop: 20 }}>
                      {/* {new Intl.NumberFormat("de-DE").format(totalXK)} */}
                    </Typography.Title>
                    <Typography.Title level={5} style={{ marginBottom: 20 }}>
                         Tồn kho ( &gt; 500 )
                    </Typography.Title>
                  </>
                }
                extra={<MedicineBoxOutlined style={{ fontSize: 50 }} />}
                style={{
                  width: 260,
                  backgroundColor: "#FF04C2",
                }}
              ></Card>

            </Space>
          </div>
                    </div>
                </div>
            </>
            
        )
    }
}
