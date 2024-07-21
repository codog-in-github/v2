import { Row, Col, Button, Form, Input, Radio } from "antd";
import { FlagFilled, SwapRightOutlined } from "@ant-design/icons";

const StaffRules = () => {
  const list = [
    {
      name: "车公司&船公司",
      go: "KOBE",
      to: "BANGKOK",
    },
    {
      name: "车公司&船公司",
      go: "KOBE",
      to: "BANGKOK",
    },
    {
      name: "车公司&船公司",
      go: "KOBE",
      to: "BANGKOK",
    },
    {
      name: "车公司&船公司",
      go: "KOBE",
      to: "BANGKOK",
    },
    {
      name: "车公司&船公司",
      go: "KOBE",
      to: "BANGKOK",
    },
  ];

  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <div className="staff-content">
      <div className="text-[24px] text-gray-700">よくあるパターン</div>

      <div className="mt-4">
        <Row gutter={[16, 16]}>
          {list.map((item, index) => (
            <Col span={4} key={index} className="mb-1">
              <div className="drop-shadow bg-white rounded-md overflow-hidden">
                <div className="bg-blue-600 text-white p-[5px]">
                  <FlagFilled className="mr-2" />
                  {item.name}
                </div>
                <div className="px-[5px] py-[10px] flex justify-around">
                  <span>{item.go}</span>
                  <SwapRightOutlined className="text-blue-600 text-[24px]" />
                  <span>{item.to}</span>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      <div className="text-[24px] text-gray-700 mt-5">完全新規</div>

      <div className="mt-1 bg-white rounded drop-shadow py-4 px-3">
        <Form
          form={form}
          name="basic"
          labelAlign="left"
          labelCol={{
            span: 2,
          }}
          wrapperCol={{
            span: 20,
          }}
          onFinish={onFinish}
        >
          <Form.Item label="TYPE" name="TYPE">
            <Radio.Group className="staff-radio">
              <Radio value="1"> 通 </Radio>
              <Radio value="2"> 通+BK+運 </Radio>
              <Radio value="3"> BK </Radio>
              <Radio value="4"> 通+BK </Radio>
              <Radio value="5"> 通+運 </Radio>
              <Radio value="6"> BK+運 </Radio>
              <Radio value="7"> BK+運 </Radio>
              <Radio value="8">
                <Input
                  size="small"
                  className="w-[100px] text-[12px]"
                  placeholder="请自定义状态"
                />
              </Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="REMARK" name="REMARK">
            <Input.TextArea
              showCount
              placeholder="突然要求新增一个集装箱，出口"
              className="h-[120px] bg-gray-200"
            />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              span: 24,
            }}
          >
            <div className="flex justify-center">
              <Button className="mx-2" htmlType="button" onClick={onReset}>
                CLEAR
              </Button>
              <Button className="mx-2" type="primary" htmlType="submit">
                新規登録
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default StaffRules;
