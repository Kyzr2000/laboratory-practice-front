import { useState } from 'react';
import { Button, DatePicker, Form, Input, message, Modal, Space } from 'antd';
import { SettingFilled, SwapRightOutlined } from '@ant-design/icons';
import moment from 'moment';

import { useMutation } from '@apollo/client';

import AddressSelector from './AddressSelector';
import { UPDATE_EXPERIENCE } from '../graphql/experienceGql';
import type { Experience } from '../type';

interface EditExperienceModalProps {
  experience: Experience;
  refreshData: () => void;
}

const EditExperienceModal = ({ experience, refreshData }: EditExperienceModalProps) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [updateExperience] = useMutation(UPDATE_EXPERIENCE);
  const { user, ...data } = experience;

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const { address, startDate, endDate, ...restValues } = values;
      const [province, city, district] = address || [];
      console.log(startDate, endDate);

      const input = {
        id: experience.id,
        name: restValues.name,
        province,
        city,
        district,
        detailAddress: restValues.detailAddress,
        startDate: startDate ? startDate.format('YYYY-MM-DD') : null,
        endDate: endDate ? endDate.format('YYYY-MM-DD') : null,
      };

      await updateExperience({
        variables: {
          input,
          userId: parseInt(user.id, 10),
        },
      });

      message.success('经历更新成功');
      refreshData();
      setVisible(false);
    } catch (error) {
      console.error('更新失败:', error);
      message.error('提交失败，请检查表单');
    }
  };

  const showModal = () => {
    const initialValues = {
      ...data,
      username: user.username,
      address: [data.province, data.city, data.district],
      // 确保日期值有效
      startDate: data.startDate ? moment(data.startDate) : null,
      endDate: data.endDate ? moment(data.endDate) : null,
    };

    form.setFieldsValue(initialValues);
    setVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  return (
    <>
      <Button
        type="link"
        className="row-button"
        onClick={showModal}
        icon={<SettingFilled />}
        style={{ color: '#1890ff' }}
      >
        编辑
      </Button>

      <Modal
        title="编辑经历"
        open={visible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        destroyOnHidden
        footer={[
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmit}
            style={{ background: '#1890ff', borderColor: '#1890ff' }}
          >
            确定
          </Button>,
        ]}
      >
        <Form form={form} autoComplete="off" layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item
            name="name"
            label="经历名称"
            rules={[
              {
                required: true,
                min: 2,
                message: '请输入至少2个字符的经历名称',
              },
            ]}
          >
            <Input placeholder="请输入经历名称" />
          </Form.Item>

          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" disabled />
          </Form.Item>

          <Form.Item
            name="address"
            label="省市区"
            rules={[{ required: true, message: '请选择省市区' }]}
          >
            <AddressSelector />
          </Form.Item>

          <Form.Item
            name="detailAddress"
            label="详细地址"
            rules={[{ required: true, message: '请输入详细地址' }]}
          >
            <Input placeholder="请输入详细地址" />
          </Form.Item>
          <Space size="middle">
            <Form.Item
              name="startDate"
              label="开始时间"
              rules={[
                {
                  required: true,
                  message: '请选择开始时间',
                },
              ]}
            >
              <DatePicker
                style={{ width: '210px' }}
                placeholder="开始时间"
                // disabled
                getPopupContainer={(trigger) => trigger.parentElement!}
              />
            </Form.Item>
            <span style={{ width: '20px', display: 'inline-block' }}>
              <SwapRightOutlined />
            </span>
            <Form.Item name="endDate" label="结束时间">
              <DatePicker
                style={{ width: '210px' }}
                placeholder="结束时间（可选）"
                format="YYYY-MM-DD"
                getPopupContainer={(trigger) => trigger.parentElement!}
              />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </>
  );
};

export default EditExperienceModal;
