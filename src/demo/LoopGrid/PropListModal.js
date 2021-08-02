import * as React from 'react';
import { Modal, Form, Select } from 'antd';

export default function PropListModal(props) {
  const { label, data = [] } = props;
  // form实例应用
  const formRef = React.useRef(null);

  /**
   * 点击确认
   */
  function onConfirm() {
    formRef.current.validateFields().then((values) => {
      const propList = data.filter(item => values.propList.indexOf(item.id) > -1);
      props.onConfirm(propList);
    });
  }

  /**
   * 点击取消
   */
  function onCancel() {
    props.onCancel();
  }

  return (
    <Modal
      title="选择属性"
      visible
      onOk={onConfirm}
      onCancel={onCancel}
      maskClosable={false}
    >
      <Form ref={formRef}>
        <Form.Item
          name="propList"
          label={label}
          rules={[{
            required: true,
            message: '请选择属性'
          }]}
        >
          <Select
            mode="multiple"
            allowClear
          >
            {data.map((item) => {
              return (
                <Select.Option key={item.id}>{item.value}</Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}