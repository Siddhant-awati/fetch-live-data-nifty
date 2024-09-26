import { useEffect, useState } from "react";
import { constants } from './constants';


export default function NiftyPCR() {
    const [pcrData, setPcrData] = useState([]);
    const [pcrDataBank, setPcrBankData] = useState([]);
    const [pcrDataFin, setPcrFinData] = useState([]);

    const fetchData = async () => {
        const response = await fetch('http://localhost:9000/api/nifty-pcr');
        const data = await response.json();
        setPcrData(data);
    }
    const fetchDataBank = async () => {
        const response = await fetch('http://localhost:9000/api/bank-pcr');
        const data = await response.json();
        setPcrBankData(data);
    }
    const fetchDataFin = async () => {
        const response = await fetch('http://localhost:9000/api/fin-pcr');
        const data = await response.json();
        setPcrFinData(data);
    }

    useEffect(() => {
        const interValConfig = setInterval(fetchData, constants.INTERVAL_TIME);
        const interValConfigBank = setInterval(fetchDataBank, constants.INTERVAL_TIME);
        const interValConfigFin = setInterval(fetchDataFin, constants.INTERVAL_TIME);
        return () => {
            clearInterval(interValConfig);
            clearInterval(interValConfigBank);
            clearInterval(interValConfigFin);
        };
    })
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

