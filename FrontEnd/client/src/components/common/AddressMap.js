import React from 'react';
import { Row, Col } from 'antd';

const AddressMap = () => {
    const iframeStyle = {
        border: '0',
    };

    return (
        <Row>
            <Col lg={{ span: 24 }}>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3743.818865571477!2d106.28434002482884!3d20.224846664904824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31360ecd5227b2b1%3A0x95f3f4875c629b67!2zWMOzbSAxMSwgSOG6o2kgVHJ1bmcsIEjhuqNpIEjhuq11LCBOYW0gxJDhu4tuaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1698245571265!5m2!1svi!2s"
                    width="400"
                    height="300"
                    style={iframeStyle} 
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </Col>
        </Row>
    );
};

export { AddressMap };
