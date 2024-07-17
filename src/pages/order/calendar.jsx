import { useState } from "react";
import { Select, Radio, Avatar } from "antd";

const CalendarItem = ({ item }) => {
  return (
    <div className="flex-1 border-r border-gray-500 text-[15px] first:border-l">
      <div className="text-center text-gray-600 text-[16px] mb-1">
        {item.title}
      </div>
      <div className="text-center text-gray-600  mb-2">{item.date}</div>
      {item.children.map((el, index) => (
        <div
          className="flex items-center justify-around odd:bg-gray-100 text-gray-700"
          key={index}
        >
          <Avatar size={26} style={{ backgroundColor: "#313131" }}>
            {el.avatar}
          </Avatar>
          <div>{el.ben}本</div>
          <div className="flex flex-col">
            <span>{el.name1}</span>
            <span>{el.name2}</span>
          </div>
          <div className="flex flex-col">
            <span>{el.name3}</span>
            <span>{el.name4}</span>
          </div>
          {el.type !== "" && (
            <Avatar size={26} style={{ backgroundColor: "#FD7556" }}>
              {el.type}
            </Avatar>
          )}
        </div>
      ))}
    </div>
  );
};
const OrderCalendar = () => {
  const options = [
    { label: "前周", value: 1 },
    { label: "本周", value: 2 },
    { label: "后周", value: 3 },
  ];
  const selectArr = [
    { value: "test1", label: "测试1" },
    { value: "test2", label: "测试2" },
  ];
  const weeks = [
    {
      id: 1,
      title: "日",
      date: "6-2",
      children: [
        {
          avatar: "原",
          type: "通",
          ben: 6,
          name1: "CNSZP",
          name2: "LLLTKY2",
          name3: "JPTYO",
          name4: "4520257",
        },
        {
          avatar: "京",
          type: "請",
          ben: 1,
          name1: "CNSZP",
          name2: "LLLTKY2",
          name3: "JPTYO",
          name4: "4520257",
        },
      ],
    },
    {
      id: 2,
      title: "月",
      date: "6-3",
      children: [],
    },
    {
      id: 3,
      title: "火",
      date: "6-4",
      children: [],
    },
    {
      id: 4,
      title: "水",
      date: "6-5",
      children: [],
    },
    {
      id: 5,
      title: "木",
      date: "6-6",
      children: [],
    },
  ];
  const [parmas, setParmas] = useState({
    weak: 1,
    type: null,
  });

  const updateForm = (newData) => {
    setParmas({ ...parmas, ...newData });
  };

  return (
    <div className="main-content">
      <div className="flex justify-end relative">
        <div className="absolute left-0 right-0 m-auto w-[100px] text-center text-gray-700 text-[22px] font-bold">
          2024-06
        </div>
        <div>
          <Select
            className="mr-4"
            options={selectArr}
            placeholder="POL"
            style={{ width: 160 }}
            value={parmas.type}
            onChange={(val) => updateForm({ type: val })}
          />

          <Radio.Group
            options={options}
            onChange={({ target: { value } }) => updateForm({ weak: value })}
            value={parmas.weak}
            optionType="button"
            buttonStyle="solid"
          />
        </div>
      </div>

      <div className="flex mt-4" style={{ height: "calc(100% - 32px)" }}>
        {weeks.map((item) => (
          <CalendarItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};
export default OrderCalendar;
