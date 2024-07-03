import { Input, Button, message, Form } from "antd";
import { useNavigate } from "react-router-dom";
import { useForm } from "antd/es/form/Form";
import { gql, useMutation } from "@apollo/client";
import "./css/register.scss";

interface RegisterFormValues {
  username: string;
  password: string;
  confirmPassword: string;
}

const REGISTER_MUTATION = gql`
  mutation Register(
    $username: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      username: $username
      password: $password
      confirmPassword: $confirmPassword
    ) {
      res
      message
    }
  }
`;

const Register = () => {
  const [form] = useForm();
  const navigate = useNavigate();

  const [register, { data }] = useMutation(REGISTER_MUTATION, {
    onCompleted: () => {
      console.log(data);
      if (data.register.res === "success") {
        message.success("注册成功，将要跳转到登录页面");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        message.error(data.register.message);
      }
    },
  });

  const onFinish = (values: RegisterFormValues) => {
    console.log("Success:", values);
    let { username, password, confirmPassword } = values;
    username = username.trim();
    password = password.trim();
    confirmPassword = confirmPassword.trim();
    register({
      variables: {
        username,
        password,
        confirmPassword,
      },
    });
  };

  return (
    <div className="clearfix">
      <div className="register-card">
        <div className="register-title" style={{ marginBottom: "20px" }}>
          注册
        </div>

        <Form
          className="form-box"
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[
              {
                validator(_, value) {
                  const trimmedValue = value ? value.trim() : "";
                  if (trimmedValue.length === 0) {
                    return Promise.reject(new Error("Required"));
                  }
                  if (trimmedValue.length > 8) {
                    return Promise.reject(
                      new Error("The length cannot exceed 8！")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              className="input-bar"
              type="text"
              placeholder="请输入输入用户名"
            ></Input>
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                transform: (value) => value.trim(),
                required: true,
                message:
                  "最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符",
                pattern:
                  /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?. ]).*$/,
              },
            ]}
          >
            <Input.Password
              className="input-bar"
              type="password"
              placeholder="请输入密码"
            ></Input.Password>
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            rules={[
              {
                validator: async (_, value) => {
                  const confirmPassword = value ? value.trim() : "";
                  let password = await form.getFieldValue("password");
                  password = password ? password.trim() : "";
                  if (confirmPassword && confirmPassword !== password) {
                    return Promise.reject("两次输入的密码不一致");
                  }
                },
              },
            ]}
          >
            <Input.Password
              className="input-bar"
              type="password"
              placeholder="请再次输出密码"
            ></Input.Password>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              span: 16,
            }}
          >
            <Button htmlType="submit" className="register-button">
              注&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;册
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default Register;
