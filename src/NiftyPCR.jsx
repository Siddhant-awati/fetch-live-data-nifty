import { useEffect, useState } from "react";
import { constants } from './constants';


export default function NiftyPCR() {
    const [pcrData, setPcrData] = useState([]);
    const [pcrDataBank, setPcrBankData] = useState([]);
    const [pcrDataFin, setPcrFinData] = useState([]);
    const [highestNifty, setHighestNifty] = useState(0);
    const [lowesttNifty, setlowestNifty] = useState(0);
    const [highestBank, setHighestBank] = useState(0);
    const [lowestBank, setlowestBank] = useState(0);
    const [highestFin, setHighestFin] = useState(0);
    const [lowestFin, setlowestFin] = useState(0);

    const fetchData = async () => {
        const response = await fetch('https://nifty-api-data.onrender.com/api/nifty-pcr');
        const data = await response.json();
        setPcrData(data);
        const uniquePcr = [];
        await data.forEach(value => {
            if (!uniquePcr.includes(value.pcr)) {
                uniquePcr.push(value.pcr);
            }
        });
        setHighestNifty(Math.max(...uniquePcr));
        setlowestNifty(Math.min(...uniquePcr));
    }
    const fetchDataBank = async () => {
        const response = await fetch('https://nifty-api-data.onrender.com/api/bank-pcr');
        const data = await response.json();
        setPcrBankData(data);
        const uniquePcr = [];
        await data.forEach(value => {
            if (!uniquePcr.includes(value.pcr)) {
                uniquePcr.push(value.pcr);
            }
        });
        setHighestBank(Math.max(...uniquePcr));
    }
    const fetchDataFin = async () => {
        const response = await fetch('https://nifty-api-data.onrender.com/api/fin-pcr');
        const data = await response.json();
        setPcrFinData(data);
        const uniquePcr = [];
        await data.forEach(value => {
            if (!uniquePcr.includes(value.pcr)) {
                uniquePcr.push(value.pcr);
            }
        });
        setHighestFin(Math.max(...uniquePcr));
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
                            const highest = (item.pcr === highestNifty) ? 'highest' : '';
                            const lowest = (item.pcr === lowesttNifty) ? 'lowest' : '';
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
                            return (
                                <tr key={index} className={item.pcr >= 1 ? 'green' : 'red'}>
                                    <td className="pcr-cell">{item.pcr}</td>
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
                            return (
                                <tr key={index} className={item.pcr >= 1 ? 'green' : 'red'}>
                                    <td className="pcr-cell">{item.pcr}</td>
                                </tr>
                            )
                        }
                    })
                    }
                </tbody>
            </table>
        </div>
    )
}
