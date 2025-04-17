import { Bar, BarChart, Label, Legend, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts';
import styled from "styled-components";

const CardContainer = styled.div`
  border: 2px solid gray;
  background-color: white;
  width: min-content;
  padding: 10px;
  margin: 20px;
`;

const GraphCard = ({ data, height, width, xAxisKey, yAxisLabel }) => {
  return (
    <CardContainer>
      <BarChart
        width={width}
        height={height}
        data={data}
        margin={{ left: 10 }}
        stackOffset='sign'
      >
        <XAxis dataKey={xAxisKey} />
        <YAxis type='number'>
          <Label
            angle={-90}
            position='left'
            style={{ textAnchor: 'middle' }}
          >
            {yAxisLabel}
          </Label>
        </YAxis>
        <Tooltip />
        <Legend />
        <ReferenceLine y={0} stroke='gray' />
        <Bar dataKey='exports' name='Exports' fill='blue' stackId={0} />
        <Bar dataKey='imports' name='Imports' fill='green' stackId={0} />
      </BarChart>
    </CardContainer>
  );
}

export default GraphCard;