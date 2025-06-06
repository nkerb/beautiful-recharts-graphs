import React from 'react';
import GraphCard from './GraphCard';

function App() {
  return (
    <GraphCard
      data={FruitTradeDeficitMonthlyData}
      dataStyles={FruitTradeDataStyles}
      xAxisKey='month'
      yAxisLabel='Millions of USD ($)'
      height={500}
      minWidth={600}
      maxWidth={1000}
      title='US Fruit Trade Deficit'
      subtitle='By Month'
    />
  );
}

export default App;

const FruitTradeDeficitMonthlyData = [
  {
    month: '2022-01-01T00:00:00',
    exports: 1258,
    imports: -1693
  },
  {
    month: '2022-02-01T00:00:00',
    exports: 1187,
    imports: -1589
  },
  {
    month: '2022-03-01T00:00:00',
    exports: 1321,
    imports: -1754
  },
  {
    month: '2022-04-01T00:00:00',
    exports: 1405,
    imports: -1827
  },
  {
    month: '2022-05-01T00:00:00',
    exports: 1356,
    imports: -1790
  },
  {
    month: '2022-06-01T00:00:00',
    exports: 1290,
    imports: -1723
  },
  {
    month: '2022-07-01T00:00:00',
    exports: 1387,
    imports: -1856
  },
  {
    month: '2022-08-01T00:00:00',
    exports: 1456,
    imports: -1920
  },
  {
    month: '2022-09-01T00:00:00',
    exports: 1312,
    imports: -1773
  },
  {
    month: '2022-10-01T00:00:00',
    exports: 1423,
    imports: -1896
  },
  {
    month: '2022-11-01T00:00:00',
    exports: 1378,
    imports: -1840
  },
  {
    month: '2022-12-01T00:00:00',
    exports: 1267,
    imports: -1703
  }
]

const FruitTradeDataStyles = [
  {
    id: 'exports',
    displayName: 'Exports',
    fillColor: 'hsl(205, 90%, 30%)'
  },
  {
    id: 'imports',
    displayName: 'Imports',
    fillColor: 'hsl(155, 90%, 25%)'
  }
]