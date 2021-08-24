import { useEffect, useState } from "react";
import Button from "../Button/Button";
import style from './RegularCalc.module.css';
import History from "../History/History";

const buttons = [
    { name: '(', key: 'shift+57', symbol: '(' },
    { name: ')', key: 'shift+48', symbol: ')' },
    { name: 'Backspace', key: '8', symbol: '<' },
    { name: 'Escape', key: '27', symbol: 'C' },

    { name: '1', key: '49 97', symbol: '1' },
    { name: '2', key: '50 98', symbol: '2' },
    { name: '3', key: '51 99', symbol: '3' },
    { name: '+', key: 'shift+187 107', symbol: '+' },

    { name: '4', key: '52 100', symbol: '4' },
    { name: '5', key: '53 101', symbol: '5' },
    { name: '6', key: '54 102', symbol: '6' },
    { name: '-', key: '189 109', symbol: '-' },

    { name: '7', key: '55 103', symbol: '7' },
    { name: '8', key: '56 104', symbol: '8' },
    { name: '9', key: '57 105', symbol: '9' },
    { name: '*', key: 'shift+56 106', symbol: '*' },

    { name: ',', key: '188 110', symbol: '.' },
    { name: '0', key: '48 96', symbol: '0' },
    { name: '%', key: 'shift+55', symbol: '%' },
    { name: '/', key: '191 111', symbol: '/' },

    { name: 'Enter', key: '187 13', symbol: '=' },
]


const RegularCalc = () => {
    const [example, setExample] = useState('');
    const [result, setResult] = useState('');

    const [history, setHistory] = useState([]);

    const saveResult = (result, example) => {
        let item = {
            body: example,
            res: result
        }

        let openRequest = indexedDB.open('aaa', 3);
        openRequest.onupgradeneeded = function () {
            // срабатывает, если на клиенте нет базы данных
            let db = openRequest.result;
            if (!db.objectStoreNames.contains('books')) {
                let objectStore = db.createObjectStore('books', { keyPath: 'id', autoIncrement: true });
                objectStore.add(item);

                //objectStore.createIndex('res', 'res', { unique: false });
                //objectStore.createIndex('body', 'body', { unique: false });
            }
        };

        openRequest.onerror = function () {
            console.error("Error", openRequest.error);
        };

        openRequest.onsuccess = function () {
            let db = openRequest.result;
            // продолжить работу с базой данных, используя объект db
            let k = db.transaction('books', 'readwrite');
            let r = k.objectStore('books');
            let res = r.add(item);

            res.onsuccess = function () { // (4)
                setHistory([...history, item]);
            };

            res.onerror = function () {
                console.log("Ошибка", res.error);
            };
        };
    }

    const changeInput = (symbol, example) => {
        setResult('');
        const operations = ['+', '-', '*', '/'];
        const numeric = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
        let lastSymbol = example.substr(-1);

        switch (true) {
            case symbol === 'C' || symbol === 'Escape':
                setExample('');
                break;
            case symbol === '<' || symbol === 'Backspace':
                setExample(example.substr(0, example.length - 1));
                break;
            case symbol === '=' || symbol === 'Enter':
                calculate(example);
                break;
            case operations.includes(symbol):
                if (numeric.includes(lastSymbol) || lastSymbol === '(' || lastSymbol === ')') {
                    setExample(example + symbol);
                } else if (example.length > 0) {
                    let temp = example.substr(0, example.length - 1) + symbol;
                    setExample(temp);
                }
                break;
            case symbol === '%':
                if (numeric.includes(lastSymbol)) {
                    setExample(example + symbol)
                }
                break;
            case symbol === '(':
                if (!numeric.includes(lastSymbol)) {
                    setExample(example + symbol);
                }
                break;
            case symbol === ')':
                let num = 0;
                for (let i = 0; i < example.length; i++) {
                    if (example[i] === '(') {
                        num++;
                    }
                    if (example[i] === ')') {
                        num--;
                    }
                }
                if (num > 0 && (numeric.includes(lastSymbol) || lastSymbol === ')')) {
                    setExample(example + symbol);
                }
                break;
            case symbol === '.':
                if (numeric.includes(lastSymbol)) {
                    let i = example.length - 1;
                    while ((i >= 0) && (example[i].match(/[0-9]/))) {
                        i--;
                    }
                    if (example[i] !== '.') {
                        setExample(example + symbol);
                    }
                }
                break;
            case numeric.includes(symbol):
                setExample(example + symbol);
                break;
            default:
                break;
        }

    }

    const calculate = (example) => {
        //закрываем все открытые скобки, чтобы избежать ошибок
        let bracket = example.split('(').length - example.split(')').length;
        for (let i = 0; i < bracket; i++) {
            example += ')';
        }

        const priority = {
            '*': 2,
            '/': 2,
            '+': 1,
            '-': 1,
            '%': 1,
            '=': -1,
            '(': 0
        }
        const signsPerform = {
            '*': (a, b) => a * b,
            '/': (a, b) => a / b,
            '+': (a, b) => a + b,
            '-': (a, b) => a - b,
            '%': (a, b) => a * b / 100,
        }
        const signs = ['+', '-', '*', '/', '='];
        let number = [];
        let operations = [];
        example += '=';
        let arr = example.split('');
        let temp = '';
        for (let i = 0; i < arr.length; i++) {
            let sign = arr[i];
            if (signs.includes(sign)) {
                if (temp !== '') {
                    number.push(Number(temp));
                }
                if (sign === '-' && temp === '') {
                    temp = '-';
                } else {
                    temp = '';
                    while ((priority[sign] <= priority[operations[operations.length - 1]]) && operations.length > 0) {
                        let [y, x] = [number.pop(), number.pop()];
                        number.push(signsPerform[operations.pop()](x, y));
                    }
                    operations.push(sign);
                }
            } else {
                switch (sign) {
                    case '(':
                        operations.push(sign);
                        break;
                    case ')':
                        if (temp !== '') {
                            number.push(Number(temp));
                            temp = '';
                        }
                        while (operations[operations.length - 1] !== '(' && operations.length > 0) {
                            let x, y;
                            [y, x] = [number.pop(), number.pop()];
                            number.push(signsPerform[operations.pop()](x, y));
                        }
                        operations.pop();
                        break;
                    case '%':
                        if (temp !== '') {
                            number.push(Number(temp));
                            temp = '';
                        }
                        let x = number.pop();
                        number.push(number[number.length - 1] * x / 100);
                        break;
                    default:
                        temp += sign;
                        break;
                }
            }
        }
        if (number.length === 1 && !(isNaN(number[0]))) {
            setResult(Math.round(number[0] * 100000) / 100000);
            saveResult(Math.round(number[0] * 100000) / 100000, example);
        } else {
            setResult('Некорректное выражение');
        }
    }

    useEffect(() => {
        const keydown =  (e) => {
            e.preventDefault();
            let key = e.key;
            if(e.key === '='){
                key = 'Enter';
            }
            buttons.forEach((button, id) => {
                if(button.name === key){
                    document.getElementById('key_' + id).classList.add(style.press);
                }
            })
        }

        const keyup = (e) => {
            e.preventDefault();
            let key = e.key;
            if(e.key === '='){
                key = 'Enter';
            }
            buttons.forEach((button, id) => {
                if(button.name === key){
                    document.getElementById('key_' + id).classList.remove(style.press);
                }
            })
        }

        document.addEventListener('keydown', keydown, false);
        document.addEventListener('keyup', keyup, false);

        return () => {
            document.removeEventListener('keydown', keydown, false);
            document.removeEventListener('keyup', keyup, false);
        }
    }, []);

    useEffect(() => {
        const handleKey = (e) => {
            e.preventDefault();
            buttons.forEach((el) => {
                if (el.name === e.key || e.key === '=') {
                    changeInput(e.key, example);
                }
            })
        }

        document.addEventListener('keyup', handleKey, false);

        return () => {
            document.removeEventListener('keyup', handleKey, false);
        }

    }, [example])

    useEffect(() => {
        let openRequest = indexedDB.open('aaa', 3);

        openRequest.onupgradeneeded = function () {
            // срабатывает, если на клиенте нет базы данных
            let db = openRequest.result;
            if (!db.objectStoreNames.contains('books')) {
                db.createObjectStore('books', { keyPath: 'id', autoIncrement: true });

                //objectStore.createIndex('res', 'res', { unique: false });
                //objectStore.createIndex('body', 'body', { unique: false });
            }
        };

        openRequest.onsuccess = function () {
            let db = openRequest.result;
            let transaction = db.transaction("books");
            let books = transaction.objectStore("books");

            let request = books.openCursor();
            let temp = [];

            request.onsuccess = function () {
                let cursor = request.result;
                if (cursor) {
                    let value = cursor.value; // объект книги
                    temp.push(value);
                    cursor.continue();
                } else {
                    setHistory(temp);
                }
            };
        }
    }, [])

    return (
        <div className={style.main}>
            <div className={style.calc} >
                <div className={style.calc_div_inp}>
                    <div className={style.calc_inp} >{example}</div>
                    <div className={style.calc_res}><p className={style.calc_res_p}>{result}</p></div>
                </div>
                <div className={style.calc_line}>
                    {
                        buttons.map((button, id) => {
                            return <Button key={'button_' + button.symbol}
                                button={button} example={example} setExample={setExample} calculate={calculate}
                                changeInput={changeInput} id={id}
                            />
                        })
                    }
                </div>
            </div>
            <History history={history} setHistory={setHistory} />
        </div>

    )
}

export default RegularCalc;