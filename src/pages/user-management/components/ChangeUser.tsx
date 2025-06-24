import { Button, Modal } from 'antd';
import { useState } from 'react';
import { useMutation } from '@apollo/client';

import type { User } from '../type';
import { CHANGE_USER } from '../graphql/mutations';

interface ChangeUserProps {
  setChangeTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
}

const ChangeUser = ({ setChangeTrigger, user }: ChangeUserProps) => {
  const [open, setOpen] = useState(false);
  const [changeUser] = useMutation(CHANGE_USER);

  const [formData, setFormData] = useState({
    oldUsername: user.username,
    username: user.username,
    realname: user.realname,
    gender: user.gender,
    age: user.age,
    isEnable: user.isEnable,
  });
  const showModal = () => {
    setOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'isEnable') {
      setFormData((prev) => ({
        ...prev,
        [name]: value === 'true',
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);

    try {
      const { data } = await changeUser({
        variables: {
          changeUserInput: {
            oldUsername: formData.oldUsername,
            username: formData.username,
            realname: formData.realname,
            gender:
              formData.gender !== null ? parseInt(formData.gender.toString(), 10) : null,
            age: formData.age !== null ? parseInt(formData.age.toString(), 10) : null,
            isEnable: formData.isEnable,
          },
        },
      });
      console.log(data);

      if (data) {
        alert('修改成功！');
        setOpen(false);
        // 触发父组件重新获取用户列表
        setTimeout(() => {
          setChangeTrigger(true);
        }, 1000);
      }
    } catch (error) {
      alert('修改用户失败: ' + error);
      console.error(error);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    // 重置为原始用户信息
    setFormData({
      oldUsername: user.username,
      username: user.username,
      realname: user.realname,
      gender: user.gender,
      age: user.age,
      isEnable: user.isEnable,
    });
  };

  return (
    <div className="user-change-button">
      <Button className="use-add-button" onClick={showModal}>
        修改
      </Button>
      <Modal
        className="add-model"
        open={open}
        title="修改用户"
        onCancel={handleCancel}
        footer={null}
      >
        <div className="add-user-page">
          <form className="add-form-box" onSubmit={handleSubmit}>
            <div className="form-row">
              <label className="form-lable">
                用户名<span>:</span>
              </label>
              <input
                type="text"
                name="username"
                minLength={2}
                disabled
                value={user.username}
                autoComplete="off"
              />
            </div>
            <div className="form-row">
              <label className="form-lable">
                新用户名<span>:</span>
              </label>
              <input
                onChange={handleChange}
                type="text"
                name="username"
                value={formData.username}
                required
                placeholder="输入新的用户名"
                minLength={2}
                autoComplete="off"
              />
            </div>
            <div className="form-row">
              <label className="form-lable">
                姓名<span>:</span>
              </label>
              <input
                onChange={handleChange}
                type="text"
                name="realname"
                value={formData.realname}
                minLength={2}
                required
                placeholder="输入新的姓名"
                autoComplete="off"
              />
            </div>
            <div className="form-row">
              <label className="form-lable">
                性别<span>:</span>
              </label>
              <select onChange={handleChange} value={formData.gender ?? 0} name="gender">
                <option value="0">男</option>
                <option value="1">女</option>
              </select>
            </div>
            <div className="form-row">
              <label className="form-lable">
                年龄<span>:</span>
              </label>
              <input
                onChange={handleChange}
                type="number"
                name="age"
                value={formData.age ?? ''}
                placeholder="输入新的年龄"
                autoComplete="off"
              />
            </div>
            <div className="form-row">
              <label className="form-lable">
                是否启用<span>:</span>
              </label>
              <select
                onChange={handleChange}
                value={formData.isEnable ? 'true' : 'false'}
                name="isEnable"
              >
                <option value="false">禁止</option>
                <option value="true">启用</option>
              </select>
            </div>
            <div className="add-user-buttonbox">
              <button type="submit">确认</button>
              <button type="button" onClick={handleCancel}>
                取消
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default ChangeUser;
