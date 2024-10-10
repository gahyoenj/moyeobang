import React from 'react';
import {PieChart, Pie, Cell, Tooltip, PieLabelRenderProps} from 'recharts';
import {css} from '@emotion/react';
import {colors} from '@/styles/colors';
import {getCategoryImageAndColor} from '@/util/chartCategoryList';

const chartContainerStyle = css`
  width: 100%;
  height: 100%; /* Adjust container height */
`;

const pieStyle = css`
  margin-top: 10px;
`;

interface PieChartProps {
  consumptionByCategory: {
    categoryName: string;
    proportion: string;
    balance: number;
  }[];
}

export function PieChartComponent({consumptionByCategory}: PieChartProps) {
  // console.log(consumptionByCategory);

  const data = consumptionByCategory.map(category => ({
    name: category.categoryName,
    value:
      typeof category.proportion === 'string'
        ? parseFloat(category.proportion)
        : category.proportion, // 문자열일 경우에만 parseFloat 적용
  }));

  // console.log(data);

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: PieLabelRenderProps) => {
    // cx, cy, midAngle, innerRadius, outerRadius가 undefined일 수 있으므로 기본값 설정
    const validCx = typeof cx === 'number' ? cx : 0;
    const validCy = typeof cy === 'number' ? cy : 0;
    const validMidAngle = typeof midAngle === 'number' ? midAngle : 0;
    const validInnerRadius = typeof innerRadius === 'number' ? innerRadius : 0;
    const validOuterRadius = typeof outerRadius === 'number' ? outerRadius : 0;

    const radius =
      validInnerRadius + (validOuterRadius - validInnerRadius) * 0.6;
    const x = validCx + radius * Math.cos(-validMidAngle * (Math.PI / 180));
    const y = validCy + radius * Math.sin(-validMidAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor="middle"
        dominantBaseline="central"
        style={{fontSize: '10px', fontFamily: 'semibold'}}
      >
        <tspan x={x} dy="0">
          {data[index!].name}
        </tspan>
        <tspan x={x} dy="12">
          {`${(percent! * 100).toFixed(0)}%`}
        </tspan>
      </text>
    );
  };

  return (
    <div css={chartContainerStyle}>
      <div css={pieStyle}>
        <PieChart width={150} height={150}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={70}
            fill="#8884d8"
            labelLine={false} // 기본 라벨 선을 없앰
            label={renderCustomizedLabel} // 커스텀 라벨 함수
            stroke="none" // 경계선 없애기
            cornerRadius={0} // 모서리 둥글지 않게 설정
          >
            {data.map((entry, index) => {
              const {color} = getCategoryImageAndColor(entry.name); // 카테고리별 색상 가져오기
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
}
