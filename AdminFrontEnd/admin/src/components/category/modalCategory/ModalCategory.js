import React, { Component } from 'react';
import { Modal, Input, Button, message } from 'antd';


export default class ModalCategory extends Component {
    handleCancel() {
        this.props.onCancel(false)
    }
    handleSubmit(e) {
        e.preventDefault();
        const { data } = this.props;
        const generalityName = e.target.generalityName.value;
        const name = e.target.name.value;
    
        if (!generalityName || !name) {
            message.error('Vui lòng nhập đủ thông tin');
        //    this.handleCancel(false); 
            return;
        }
    
        this.props.onSubmitForm({ id: data.id, name: generalityName, generalityName: name });
    }
    
    handleChangeInput(e) {
        this.props.onChangeInput(e)
    }
    render() {
        const { data , visible } = this.props;
        console.log(this);
        return (
            <Modal

                title={data.id ? "Cập nhập danh mục" : "Thêm danh mục"}
                visible={visible}
                onCancel={this.handleCancel.bind(this)}
                footer={null}
            >
                <div>
                    <form onSubmit={(e) => this.handleSubmit(e)}>
                        <Input allowClear size="large" type="text" name="generalityName" onChange={(e) => this.handleChangeInput(e)}
                            value={data.generalityName} placeholder="Tên chung (Quần áo, ...)"
                        >
                        </Input>
                        <br />
                        <br />
                        <Input allowClear size="large" type="text" name="name" onChange={(e) => this.handleChangeInput(e)}
                            value={data.name} placeholder="Tên chi tiết (Áo sơ mi, Quần Jeans,...)"
                        >
                        </Input>
                        <br />
                        <br />
                        <div style={{ textAlign: 'end'}}>
                            <Button htmlType="submit" type="primary">Submit</Button>
                        </div>
                        
                    </form>
                </div>
            </Modal>
        )
    }
}
