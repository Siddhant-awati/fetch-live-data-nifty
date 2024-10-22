import { useEffect, useState } from "react";
import { constants } from './constants';

import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler, // Import Filler plugin
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

// Register the necessary plugins
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler, // Register Filler plugin
    annotationPlugin
);


const emaPeriod = 40; // You can adjust this period value

export default function NiftyPCR({ handleLatestNiftyPCR, handleLatestBankPCR, handleLatestFinPCR }) {
    const [pcrData, setPcrData] = useState([]);
    const [pcrDataBank, setPcrBankData] = useState([]);
    const [pcrDataFin, setPcrFinData] = useState([]);
    const [highestNifty, setHighestNifty] = useState(0);
    const [lowesttNifty, setlowestNifty] = useState(0);
    const [highestBank, setHighestBank] = useState(0);
    const [lowestBank, setlowestBank] = useState(0);
    const [highestFin, setHighestFin] = useState(0);
    const [lowestFin, setlowestFin] = useState(0);

    const [chartDataNifty, setChartDataNifty] = useState([]);
    const [chartDataBank, setChartDataBank] = useState([]);
    const [chartDataFin, setChartDataFin] = useState([]);

    const fetchData = async () => {
        const response = await fetch('https://nifty-api-data.onrender.com/api/nifty-pcr');
        const data = await response.json();
        const chartData = [];
        data.forEach((item, index) => {
            if (index % 3 == 0) {
                chartData.push({
                    time: item.time,
                    pcr: item.pcr
                })
            }
        })
        setChartDataNifty(chartData);

        const reverseData = data.reverse();
        setPcrData(reverseData);
        handleLatestNiftyPCR(reverseData[0].pcr);
        const uniquePcr = [];
        await reverseData.forEach((value, index) => {
            if (index % 3 === 0) {
                if (!uniquePcr.includes(value.pcr)) {
                    uniquePcr.push(value.pcr);
                }
            }
        });
        setHighestNifty(Math.max(...uniquePcr));
        setlowestNifty(Math.min(...uniquePcr));

    }
    const loadNiftyChart = () => {
        const calculateEMA = (data, period) => {
            const emaArray = [];
            const alpha = 2 / (period + 1);
            let previousEMA = data[0]; // Starting EMA is the first data point

            data.forEach((currentPrice, index) => {
                if (index === 0) {
                    emaArray.push(previousEMA); // The first EMA value is the first price
                } else {
                    const currentEMA = (currentPrice * alpha) + (previousEMA * (1 - alpha));
                    emaArray.push(currentEMA);
                    previousEMA = currentEMA;
                }
            });

            return emaArray;
        };

        const pcrData = chartDataNifty.map(item => item.pcr);
        const emaData = calculateEMA(pcrData, emaPeriod);

        const data = {
            labels: chartDataNifty.map(item => item.time),
            datasets: [
                {
                    label: 'PCR Data',
                    data: pcrData,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                },
                {
                    label: `EMA (${emaPeriod})`,
                    data: emaData,
                    borderColor: 'orange',
                    borderWidth: 1,
                    backgroundColor: 'orange',
                    fill: false,
                },
            ],
        };

        const yMin = Math.min(...data.datasets[0].data);
        const yMax = Math.max(...data.datasets[0].data);
        const yMid = (yMin + yMax) / 2;

        const options = {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                },
            },
            plugins: {
                annotation: {
                    annotations: {
                        line: {
                            type: 'line',
                            yMin: yMid,
                            yMax: yMid,
                            borderColor: 'black',
                            borderWidth: 2,
                            label: {
                                content: 'Mid Point',
                                enabled: true,
                                position: 'end',
                                color: 'red',
                            },
                        },
                    },
                },
            },
        };

        return <Line data={data} options={options} />
    }
    const fetchDataBank = async () => {
        const response = await fetch('https://nifty-api-data.onrender.com/api/bank-pcr');
        const data = await response.json();
        const chartData = [];
        data.forEach((item, index) => {
            if (index % 3 == 0) {
                chartData.push({
                    time: item.time,
                    pcr: item.pcr
                })
            }
        })
        setChartDataBank(chartData);

        const reverseData = data.reverse();
        setPcrBankData(reverseData);
        handleLatestBankPCR(reverseData[0].pcr);

        const uniquePcr = [];
        await reverseData.forEach((value, index) => {
            if (index % 3 === 0) {
                if (!uniquePcr.includes(value.pcr)) {
                    uniquePcr.push(value.pcr);
                }
            }
        });
        setHighestBank(Math.max(...uniquePcr));
        setlowestBank(Math.min(...uniquePcr));
    }
    const loadBankChart = () => {
        const calculateEMA = (data, period) => {
            const emaArray = [];
            const alpha = 2 / (period + 1);
            let previousEMA = data[0]; // Starting EMA is the first data point

            data.forEach((currentPrice, index) => {
                if (index === 0) {
                    emaArray.push(previousEMA); // The first EMA value is the first price
                } else {
                    const currentEMA = (currentPrice * alpha) + (previousEMA * (1 - alpha));
                    emaArray.push(currentEMA);
                    previousEMA = currentEMA;
                }
            });

            return emaArray;
        };

        const pcrData = chartDataBank.map(item => item.pcr);
        const emaData = calculateEMA(pcrData, emaPeriod);

        const data = {
            labels: chartDataBank.map(item => item.time),
            datasets: [
                {
                    label: 'PCR Data',
                    data: pcrData,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                },
                {
                    label: `EMA (${emaPeriod})`,
                    data: emaData,
                    borderColor: 'orange',
                    borderWidth: 1,
                    backgroundColor: 'orange',
                    fill: false,
                },
            ],
        };

        const yMin = Math.min(...data.datasets[0].data);
        const yMax = Math.max(...data.datasets[0].data);
        const yMid = (yMin + yMax) / 2;

        const options = {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                },
            },
            plugins: {
                annotation: {
                    annotations: {
                        line: {
                            type: 'line',
                            yMin: yMid,
                            yMax: yMid,
                            borderColor: 'black',
                            borderWidth: 2,
                            label: {
                                content: 'Mid Point',
                                enabled: true,
                                position: 'end',
                                color: 'red',
                            },
                        },
                    },
                },
            },
        };

        return <Line data={data} options={options} />;
    }

    const fetchDataFin = async () => {
        const response = await fetch('https://nifty-api-data.onrender.com/api/fin-pcr');
        const data = await response.json();
        const chartData = [];
        data.forEach((item, index) => {
            if (index % 3 == 0) {
                chartData.push({
                    time: item.time,
                    pcr: item.pcr
                })
            }
        })
        setChartDataFin(chartData);
        const reverseData = data.reverse();
        setPcrFinData(reverseData);
        handleLatestFinPCR(reverseData[0].pcr);

        const uniquePcr = [];
        await reverseData.forEach((value, index) => {
            if (index % 3 === 0) {
                if (!uniquePcr.includes(value.pcr)) {
                    uniquePcr.push(value.pcr);
                }
            }
        });
        setHighestFin(Math.max(...uniquePcr));
        setlowestFin(Math.min(...uniquePcr));
    }
    const loadFinChart = () => {
        const calculateEMA = (data, period) => {
            const emaArray = [];
            const alpha = 2 / (period + 1);
            let previousEMA = data[0]; // Starting EMA is the first data point

            data.forEach((currentPrice, index) => {
                if (index === 0) {
                    emaArray.push(previousEMA); // The first EMA value is the first price
                } else {
                    const currentEMA = (currentPrice * alpha) + (previousEMA * (1 - alpha));
                    emaArray.push(currentEMA);
                    previousEMA = currentEMA;
                }
            });

            return emaArray;
        };

        const pcrData = chartDataFin.map(item => item.pcr);
        const emaData = calculateEMA(pcrData, emaPeriod);

        const data = {
            labels: chartDataFin.map(item => item.time),
            datasets: [
                {
                    label: 'PCR Data',
                    data: pcrData,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                },
                {
                    label: `EMA (${emaPeriod})`,
                    data: emaData,
                    borderColor: 'orange',
                    borderWidth: 1,
                    backgroundColor: 'orange',
                    fill: false,
                },
            ],
        };

        const yMin = Math.min(...data.datasets[0].data);
        const yMax = Math.max(...data.datasets[0].data);
        const yMid = (yMin + yMax) / 2;

        const options = {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                },
            },
            plugins: {
                annotation: {
                    annotations: {
                        line: {
                            type: 'line',
                            yMin: yMid,
                            yMax: yMid,
                            borderColor: 'black',
                            borderWidth: 2,
                            label: {
                                content: 'Mid Point',
                                enabled: true,
                                position: 'end',
                                color: 'red',
                            },
                        },
                    },
                },
            },
        };
        return <Line data={data} options={options} />;
    }

    const fetchAll = async () => {
        await fetchData();
        await fetchDataBank();
        await fetchDataFin();
    }
    useEffect(() => {
        const interValConfig = setInterval(fetchAll, constants.INTERVAL_TIME);
        return () => {
            clearInterval(interValConfig);
        };
    })
    useEffect(() => {
        fetchAll();
    }, [])
    return (
        <section className="main">
            <div className="pcr-wrapper">
                <table className="table table-bordered table-sm table-pcr">
                    <thead>
                        <tr>
                            <th scope="col" className="pcr-cell">TIME</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pcrData.length > 0 && pcrData.map((item, index) => {
                            if (index % 3 === 0) {
                                return (
                                    <tr key={index}>
                                        <td className="pcr-cell">{item.time}</td>
                                    </tr>
                                )
                            }
                        })
                        }
                    </tbody>
                </table>
                <table className="table table-bordered table-sm table-pcr">
                    <thead>
                        <tr>
                            <th scope="col" className="pcr-cell">NIFTY PCR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pcrData.length > 0 && pcrData.map((item, index) => {
                            if (index % 3 === 0) {
                                const highest = (item.pcr === highestNifty) ? 'highest blink' : '';
                                const lowest = (item.pcr === lowesttNifty) ? 'lowest blink' : '';
                                return (
                                    <tr key={index} className={item.pcr >= 1 ? 'green' : 'red'}>
                                        <td className={`pcr-cell ${highest} ${lowest}`}>{item.pcr}
                                        </td>
                                    </tr>
                                )
                            }
                        })
                        }
                    </tbody>
                </table>
                <table className="table table-bordered table-sm table-pcr">
                    <thead>
                        <tr>
                            <th scope="col" className="pcr-cell">BANK PCR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pcrDataBank.length > 0 && pcrDataBank.map((item, index) => {
                            if (index % 3 === 0) {
                                const highest = (item.pcr === highestBank) ? 'highest blink' : '';
                                const lowest = (item.pcr === lowestBank) ? 'lowest blink' : '';
                                return (
                                    <tr key={index} className={item.pcr >= 1 ? 'green' : 'red'}>
                                        <td className={`pcr-cell ${highest} ${lowest}`}>{item.pcr}
                                        </td>
                                    </tr>
                                )
                            }
                        })
                        }
                    </tbody>
                </table>
                <table className="table table-bordered table-sm table-pcr">
                    <thead>
                        <tr>
                            <th scope="col" className="pcr-cell">FIN PCR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pcrDataFin.length > 0 && pcrDataFin.map((item, index) => {
                            if (index % 3 === 0) {
                                const highest = (item.pcr === highestFin) ? 'highest blink' : '';
                                const lowest = (item.pcr === lowestFin) ? 'lowest blink' : '';
                                return (
                                    <tr key={index} className={item.pcr >= 1 ? 'green' : 'red'}>
                                        <td className={`pcr-cell ${highest} ${lowest}`}>{item.pcr}
                                        </td>
                                    </tr>
                                )
                            }
                        })
                        }
                    </tbody>
                </table>
            </div>
            <div className="chart-wrapper">
                <h2 className="chart-title">NIFTY PCR Chart</h2>
                {chartDataNifty.length > 1 && loadNiftyChart()}

                <h2 className="chart-title">BANK_NIFTY PCR Chart</h2>
                {chartDataBank.length > 1 && loadBankChart()}

                <h2 className="chart-title">FIN_NIFTY PCR Chart</h2>
                {chartDataFin.length > 1 && loadFinChart()}
            </div>
        </section>
    )
}

