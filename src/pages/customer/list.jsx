import { Button, Input, Row, Col, Avatar, Progress } from "antd";
import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { useState } from "react";
const { Search } = Input;

const CustomerCard = ({ item }) => {
  const handleClick = (id) => {
    console.log(id);
  };

  return (
    <div
      className="border-2  px-2 py-2 relative rounded-lg cursor-pointer hover:border-blue-500 duration-150"
      onClick={() => handleClick(item.id)}
    >
      <div className="absolute top-0 right-0 text-[12px] bg-blue-600 text-white px-[10px] py-[4px] rounded leading-none">
        情報編集
        <RightOutlined className="ml-1" />
      </div>
      <div className="font-bold">{item.title}</div>
      <div className="flex items-center justify-between">
        <div className="flex-1 flex items-center justify-center border-r border-dashed border-gray-400 ">
          <Avatar
            shape="square"
            size={50}
            style={{
              backgroundColor: "#426CF6",
            }}
          >
            <span className="text-[28px]">{item.avatar}</span>
          </Avatar>

          <div className="flex flex-col  pl-2 pr-2">
            <div>{item.person}</div>
            <div className="text-[12px] text-gray-500">{item.mobile}</div>
          </div>
        </div>

        <div className="w-[120px] pl-2 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-[12px] text-gray-500">全部案件</div>
            <div className="text-[12px] text-gray-500">進行中</div>
          </div>

          <div className="flex items-center justify-between leading-none mt-3">
            <div className="text-[22px] text-gray-700 font-bold ">
              {item.all}
            </div>
            <div className="text-[22px] text-gray-700 font-bold">{item.do}</div>
          </div>

          <Progress
            size="small"
            percent={(item.do / item.all) * 100}
            showInfo={false}
          />
        </div>
      </div>
    </div>
  );
};

const CustomerList = () => {
  const list = [
    {
      id: 1,
      title: "無錫永興貨運有限公司",
      avatar: "無",
      person: "宋琴",
      mobile: "86-15240056982",
      all: 123,
      do: 4,
    },
    {
      id: 2,
      title: "原岛 株式会社",
      avatar: "原",
      person: "孙山小小",
      mobile: "86-15240056982",
      all: 50,
      do: 40,
    },
  ];

  const [keyword, setKeyword] = useState("");

  const onSearch = (value) => {
    setKeyword(value);
  };

  const add = () => {};

  return (
    <div className="main-content">
      <div className="flex items-center justify-between">
        <div>
          <Button type="primary" icon={<PlusOutlined />} onClick={add}>
            お客様新規登録
          </Button>
        </div>
        <div>
          <Search
            placeholder="お客様"
            onSearch={onSearch}
            enterButton
            value={keyword}
          />
        </div>
      </div>

      <div className="mt-5">
        <Row gutter={[16, 16]}>
          {list.map((item, index) => (
            <Col span={6} key={index}>
              <CustomerCard item={item} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default CustomerList;
