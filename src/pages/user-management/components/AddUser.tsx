import { Button, Modal } from 'antd';
import { useState } from 'react';
import { useMutation } from '@apollo/client';

import type { AddInput } from '../type';
import { ADD_USER } from '../graphql/mutations';

interface AddUserProps {
  setAddTrigger: React.Dispatch<React.SetStateAction<boolean>>;
}
const AddUser = ({ setAddTrigger }: AddUserProps) => {
  const [open, setOpen] = useState(false);
  const [addUser] = useMutation(ADD_USER);
  const [localAddInput, setLocalAddInput] = useState<AddInput>({
    username: '',
    password: '',
    realname: '',
    gender: null,
    age: null,
    isEnable: false,
  });

  const showModal = () => {
    setOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'isEnable') {
      setLocalAddInput((prev) => ({
        ...prev,
        [name]: value === 'true', // 转换为布尔类型
      }));
    } else {
      setLocalAddInput((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(localAddInput);

    try {
      const { data } = await addUser({
        variables: {
          addUserInput: {
            username: localAddInput.username,
            password: localAddInput.password,
            realname: localAddInput.realname,
            // 确保转换为整数
            gender:
              localAddInput.gender !== null
                ? parseInt(localAddInput.gender.toString(), 10)
                : null,
            age:
              localAddInput.age !== null
                ? parseInt(localAddInput.age.toString(), 10)
                : null,
          },
        },
      });

      // 只有在没有错误且返回的数据有效时才执行后续操作

      if (data) {
        alert(`用户${localAddInput.username}添加成功！`);
        setOpen(false); // 关闭模态框
        setTimeout(() => {
          setAddTrigger(true);
        }, 1000);

        setLocalAddInput({
          username: '',
          password: '',
          realname: '',
          gender: null,
          age: null,
          isEnable: false,
        });
      }
    } catch (e) {
      alert('Failed to add user: ' + e); // 显示错误消息
      console.log(e);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <div>
      <Button className="use-add-button" onClick={showModal}>
        新增用户
      </Button>
      <Modal
        className="add-model"
        open={open}
        title="新增用户"
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
                onChange={handleChange}
                type="text"
                name="username"
                value={localAddInput.username}
                required
                placeholder="输入您的用户名"
                minLength={2}
                autoComplete="off"
              />
            </div>
            <div className="form-row">
              <label className="form-lable">
                密码<span>:</span>
              </label>
              <input
                onChange={handleChange}
                type="password"
                name="password"
                required
                value={localAddInput.password}
                minLength={6}
                placeholder="请输入密码"
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
                value={localAddInput.realname}
                minLength={2}
                required
                placeholder="输入您的姓名"
                autoComplete="off"
              />
            </div>
            <div className="form-row">
              <label className="form-lable">
                性别<span>:</span>
              </label>
              <select
                onChange={handleChange}
                id="gender"
                value={localAddInput.gender ?? 0}
                name="gender"
              >
                <option value="0" defaultChecked>
                  男
                </option>
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
                value={localAddInput.age ?? ''}
                id="add-input"
                placeholder="输入您的年龄"
                autoComplete="off"
              />
            </div>
            <div className="form-row">
              <label className="form-lable">
                是否启用<span>:</span>
              </label>
              <select
                onChange={handleChange}
                value={localAddInput.isEnable ? 'true' : 'false'}
                name="isEnable"
              >
                <option value="false" defaultChecked>
                  禁止
                </option>
                <option value="true">启用</option>
              </select>
            </div>
            <div className="add-user-buttonbox">
              <button>确认</button>
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

export default AddUser;
