import { useState } from 'react';
import style from './SpecialCalc.module.css';

const buttons = [
    { name: '1', key: '49 97', symbol: '1' },
    { name: '2', key: '50 98', symbol: '2' },
    { name: '3', key: '51 99', symbol: '3' },
    { name: '4', key: '52 100', symbol: '4' },
    { name: '5', key: '53 101', symbol: '5' },
    { name: '6', key: '54 102', symbol: '6' },
    { name: '7', key: '55 103', symbol: '7' },
    { name: '8', key: '56 104', symbol: '8' },
    { name: '9', key: '57 105', symbol: '9' },
    { name: '0', key: '48 96', symbol: '0' },

    { name: ',', key: '188 110', symbol: '.' },
    { name: 'Backspace', key: '8', symbol: '<' },
    { name: 'Escape', key: '27', symbol: 'C' },
]

let active = 'top';

const SpecialCalc = ({ data, calcFormula }) => {
    const [topInp, setTopInp] = useState('');
    const [bottomInp, setBottomInp] = useState('');

    const changeFocus = (status) => {
        active = status;
    }

    const changeUnits = (e) => {
        let valTop = document.getElementById('topSelect').value;
        let valBottom = document.getElementById('bottomSelect').value;
        if (e.target.id === 'topSelect') {
            setTopInp(calcFormula(bottomInp, valBottom, valTop));
        } else if (e.target.id === 'bottomSelect') {
            setBottomInp(calcFormula(topInp, valTop, valBottom));
        }
    }

    const handleChange = (e) => {
        e.preventDefault();
        let valTop = document.getElementById('topSelect').value;
        let valBottom = document.getElementById('bottomSelect').value;
        let val;
        if (e.target.value === '') {
            val = '';
        } else {
            val = Number(e.target.value);
        }
        if (e.target.id === 'bottom') {
            setBottomInp(val);
            setTopInp(calcFormula(val, valBottom, valTop));
        } else if (e.target.id === 'top') {
            setTopInp(val);
            setBottomInp(calcFormula(val, valTop, valBottom));
        }
    }

    const handleClick = (symbol) => {
        let valTop = document.getElementById('topSelect').value;
        let valBottom = document.getElementById('bottomSelect').value;
        if (active === 'bottom') {
            let res = bottomInp;
            if (symbol === '<') {
                res = (res.substr(0, res.length - 1));
            } else if (symbol === 'C') {
                res = '';
            } else {
                res = (res + symbol);
            }
            setBottomInp(res);
            setTopInp(calcFormula(res, valBottom, valTop));
        } else if (active === 'top') {
            let res = topInp;
            if (symbol === '<') {
                res = (res.substr(0, res.length - 1));
            } else if (symbol === 'C') {
                res = '';
            } else {
                res = (res + symbol);
            }
            setTopInp(res);
            setBottomInp(calcFormula(res, valTop, valBottom));
        }
    }

    return (
        <div className={style.main}>
            <div className={style.calc}>
                <div className={style.calc_inp}>
                    <div className={style.select}>
                        <select id="topSelect" onChange={changeUnits}>
                            {data.map((el, id) => {
                                return <option value={el.factor} key={'topTitle' + id}>{el.name + ' (' + el.abbr + ')'}</option>
                            })}
                        </select>
                        <div className={style.arrow}>▼</div>
                    </div>
                    <input id="top" className={style.inp} value={topInp} onFocus={() => { changeFocus('top') }} onChange={handleChange} type="number" />
                </div>
                <div className={style.calc_inp}>
                    <div className={style.select}>
                        <select id="bottomSelect" onChange={changeUnits}>
                            {data.map((el, id) => {
                                return <option value={el.factor} key={'bottomTitle' + id}>{el.name + ' (' + el.abbr + ')'}</option>
                            })}
                        </select>
                        <div className={style.arrow}>▼</div>
                    </div>
                    <input id="bottom" className={style.inp} value={bottomInp} onFocus={() => { changeFocus('bottom') }} onChange={handleChange} type="number" />
                </div>
                <div className={style.calc_keyboard}>
                    {buttons.map((button, id) => {
                        return <div key={id} className={style.key} onClick={() => { handleClick(button.symbol) }}>{button.symbol}</div>;
                    })}
                </div>
            </div>
        </div>
    )
}

export default SpecialCalc;