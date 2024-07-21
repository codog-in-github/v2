import { Row, Col, Avatar } from "antd";

const StaffShip = () => {
  const list = [
    {
      name: "地中海航运公司",
      url: "www.dizhonghai.cn",
    },
    {
      name: "地中海航运公司",
      url: "www.dizhonghai.cn",
    },
    {
      name: "地中海航运公司",
      url: "www.dizhonghai.cn",
    },
    {
      name: "地中海航运公司",
      url: "www.dizhonghai.cn",
    },
    {
      name: "地中海航运公司",
      url: "www.dizhonghai.cn",
    },
  ];

  return (
    <div className="staff-content">
      <div className="text-[24px] text-gray-700">船スケジュール </div>

      <div className="mt-4">
        <Row gutter={[16, 16]}>
          {list.map((item, index) => (
            <Col span={4} key={index} className="mb-1">
              <div className="border-t-4 cursor-pointer border-blue-700 px-[5px] py-[10px] bg-white rounded drop-shadow hover:border-x hover:border-b">
                <div className="flex items-center">
                  <Avatar
                    size={26}
                    style={{ backgroundColor: "#3b82f6", fontSize: "14px" }}
                  >
                    {item.name.at(0)}
                  </Avatar>
                  <div className="ml-1">{item.name}</div>
                </div>

                <div className="text-[12px] text-blue-500 text-right">
                  {item.url}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default StaffShip;
