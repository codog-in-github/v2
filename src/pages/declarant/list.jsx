import classnames from "classnames";
import { Avatar } from "antd";
const DeclarantItem = ({ el }) => {
  const arr = el.arr || [];

  let cur = (type) => {
    return classnames(
      "rounded-full py-[2px] px-[10px]",
      el.status === 1 && arr.includes(type) && "bg-blue-500 text-white",
      el.status === 2 && arr.includes(type) && "bg-gray-700 text-white"
    );
  };
  return (
    <div className="flex justify-around bg-white text-[14px]  h-[50px] items-center even:bg-gray-100">
      <Avatar
        size={30}
        style={{ backgroundColor: "#484848", fontSize: "14px" }}
      >
        {el.name.at(0)}
      </Avatar>
      <div>{el.kou}</div>
      <div>{el.pol}</div>
      <div>{el.fan}</div>
      {el.status !== 3 && (
        <div className="w-[180px] flex justify-around bg-gray-200 rounded-lg text-[15px] ">
          <span className={cur("wei")}>未</span>
          <span className={cur("shen")}>申</span>
          <span className={cur("zhi")}>質</span>
          <span className={cur("cha")}>査</span>
          <span className={cur("xu")}>許</span>
        </div>
      )}
    </div>
  );
};

const DeclarantCard = ({ item }) => {
  const curCardId = 1;

  const data = item.data || [];
  return (
    <div className="w-[600px] flex-none mr-[50px] border  h-full">
      <div
        className={classnames(
          "text-center py-[5px] text-[18px] border-b border-indigo-300 bg-blue-200 h-[40px]",
          curCardId === item.id && "bg-blue-500 text-white"
        )}
      >
        <span>{item.date}</span>
        <span className="ml-5">
          {item.all}件/残{item.can}件
        </span>
      </div>
      <div
        className={classnames(
          "flex justify-around bg-blue-200 text-[16px] py-[8px] h-[40px]",
          curCardId === item.id && "bg-blue-500 text-white"
        )}
      >
        <div>お客様</div>
        <div>入/出口</div>
        <div>POL-POD</div>
        <div>管理番号</div>
        <div className="w-[180px] flex justify-around">
          <span>未</span>
          <span>申</span>
          <span>質</span>
          <span>査</span>
          <span>許</span>
        </div>
      </div>

      <div className="overflow-y-auto" style={{ height: "calc(100% - 80px)" }}>
        {data.map((el) => (
          <DeclarantItem key={el.id} el={el} />
        ))}
      </div>
    </div>
  );
};

const DeclarantList = () => {
  const data = [
    {
      id: 1,
      date: "2024年6月5日",
      all: 30,
      can: 15,
      data: [
        {
          id: "1-1",
          name: "春海組システム",
          kou: "出",
          pol: "KB-BK",
          fan: "2024041081K",
          arr: ["shen"],
          status: 1,
        },
        {
          id: "1-2",
          name: "宁宁宁",
          kou: "入",
          pol: "KB-BK",
          fan: "2024041081K",
          arr: ["wei", "xu"],
          status: 1,
        },
        {
          id: "1-3",
          name: "苏苏苏",
          kou: "出",
          pol: "KB-BK",
          fan: "2024041081K",
          arr: ["cha"],
          status: 2,
        },
      ],
    },
    {
      id: 2,
      date: "2024年6月4日",
      all: 30,
      can: 25,
    },
  ];

  return (
    <div className="h-full w-full">
      <div className="text-gray-400 text-[15px] h-[25px]">
        * 自社通关编号表示
      </div>

      <div
        className="bg-white px-[20px] py-[15px] overflow-x-auto  flex flex-nowrap"
        style={{ height: "calc(100% - 25px)" }}
      >
        {data.map((item) => (
          <DeclarantCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default DeclarantList;
