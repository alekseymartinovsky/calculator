import Header from "./components/Header/Header";
import RegularCalc from "./components/RegularCalc/RegularCalc";
import SpecialCalc from "./components/SpecialCalc/SpecialCalc";
import { Switch, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import style from './App.module.css';
import { useState } from 'react';


const regularFormula = (val, val1, val2) => {
  if(val === ''){
    return '';
  }
  let res = Number(val) * val1 / val2;
  res = Math.round((res * 100000)) / 100000;
  return res.toString();
}

const temperatureFormula = (val, val1, val2) => {
  let res = val;
  if(val === ''){
    return '';
  }
  switch (val1) {
    case 'cel':
      break;
    case 'kel':
      res = val - 273.15;
      break;
    case 'far':
      res = (val - 32) * 5 /9;
      break;
  }
  switch (val2) {
    case 'cel':
      break;
    case 'kel':
      res = res + 273.15;  
      break;
    case 'far':
      res = res * 9 / 5 + 32;
      break; 
  }
  res = Math.round(res*10000000) / 10000000;
  return res.toString();
}

const squares = [ //относительно квадратных метров
  {name: 'миллиметры', factor: 0.000001, abbr: 'мм²'},
  {name: 'сантиметры', factor: 0.0001, abbr: 'см²'},
  {name: 'дециметры', factor: 0.01, abbr: 'дм²'},
  {name: 'метры', factor: 1, abbr: 'м²'},
  {name: 'ары', factor: 100, abbr: 'а'},
  {name: 'гектары', factor: 10000, abbr: 'га'},
  {name: 'клилометры', factor: 1000000, abbr: 'км²'},
]

const long = [ //относительно метров
  {name: 'миллиметры', factor: 0.001, abbr: 'мм'},
  {name: 'сантиметры', factor: 0.01, abbr: 'см'},
  {name: 'дециметры', factor: 0.1, abbr: 'дм'},
  {name: 'метры', factor: 1, abbr: 'м'},
  {name: 'километры', factor: 1000, abbr: 'км'},
  {name: 'дюймы', factor: 0.0254, abbr: 'in'},
  {name: 'фут', factor: 0.3048, abbr: "ft"},
  {name: 'ярды', factor: 0.9144, abbr: "yd"},
  {name: 'мили', factor: 1609.34, abbr: "mi"},
  {name: 'морские мили', factor: 1852, abbr: "NM"},
]

const temperature = [
  {name: 'Градусы Цельсия', factor: 'cel', abbr: 'С'},
  {name: 'Градусы Фаренгейта', factor: 'far', abbr: 'F'},
  {name: 'Кельвина', factor: 'kel', abbr: 'K'},
]

const volume = [ //перевод к метрам кубическим
  {name: 'Английские галлоны', factor: 0.00454609, abbr: 'gal'},
  {name: 'Американские галлоны', factor: 0.00378541, abbr: 'gal'},
  {name: 'Литры', factor: 0.001, abbr: 'л'},
  {name: 'Миллилитры', factor: 0.000001, abbr: 'мл'},
  {name: 'Сантиметры кубические', factor: 0.000001, abbr: 'см³'},
  {name: 'Дециметры кубические', factor: 0.001, abbr: 'дм³'},
  {name: 'Метры кубические', factor: 1, abbr: 'м³'},
  {name: 'Кубические дюймы', factor: 0.0000163871, abbr: 'in³'},
  {name: 'Кубические футы', factor: 0.0283168, abbr: 'ft³'},
]

const weight = [ //относсительно килограмм
  {name: 'Тонны', factor: 1000, abbr: 'т'},
  {name: 'Английские тонны', factor: 1016.05, abbr: 't'},
  {name: 'Американские тонны', factor: 907.1875, abbr: 't'},
  {name: 'Фунты', factor: 0.4536, abbr: 'lb'},
  {name: 'Унции', factor: 0.02835, abbr: 'oz'},
  {name: 'Килограммы', factor: 1, abbr: 'кг'},
  {name: 'Граммы', factor: 0.001, abbr: 'г'},
]

const data = [ //относительно байтов
  {name: 'Биты', factor: 0.125, abbr: 'bit'},
  {name: 'Байты', factor: 1, abbr: 'B'},
  {name: 'Килобайты', factor: 1000, abbr: 'KB'},
  {name: 'Мегабайты', factor: 1000000, abbr: 'MB'},
  {name: 'Гигабайты', factor: 1000000000, abbr: 'GB'},
  {name: 'Терабайты', factor: 1000000000000, abbr: 'TB'},
]

const speed = [ //относительно километров в час
  {name: 'Метры в секунду', factor: 3.6, abbr: 'м/с'},
  {name: 'Метры в час', factor: 0.001, abbr: 'м/ч'},
  {name: 'Километры в секунду', factor: 3600, abbr: 'км/с'},
  {name: 'Километры в час', factor: 1, abbr: 'км/ч'},
  {name: 'Дюймы в секунду', factor: 0.09144, abbr: 'in/s'},
  {name: 'Дюймы в час', factor: 0.0000254, abbr: 'in/h'},
  {name: 'Футы в секунду', factor: 1.09728, abbr: 'ft/s'},
  {name: 'Футы в час', factor: 0.0003048, abbr: 'ft/h'},
  {name: 'Мили в секунду', factor: 5793.6384, abbr: 'mi/s'},
  {name: 'Мили в час', factor: 1.609344, abbr: 'mi/h'},
  {name: 'Узлы', factor: 1.852, abbr: 'kn'},
]

const time = [ //относительно минут
  {name: 'Миллисекнуды', factor: 0.0000166667, abbr: 'мс'},
  {name: 'Секунды', factor: 0.0166666666667, abbr: 'с'},
  {name: 'Минуты', factor: 1, abbr: 'мин'},
  {name: 'Часы', factor: 60, abbr: 'ч'},
  {name: 'Дни', factor: 1440, abbr: 'д'},
  {name: 'недели', factor: 10080, abbr: 'нед'},
]

function App() {

  const [viewMenu, setViewMenu] = useState(true);

  const toggleMenu = () => {
    setViewMenu(!viewMenu);
  }
  return (
    <div>
      <BrowserRouter basename="/calculator">
      <Route>
      <div onClick={toggleMenu} className={style.menu}>Меню</div>
      <Header viewMenu={viewMenu} toggleMenu={toggleMenu}/>
      <Switch>
        <Route exact path={'/'} render={() => <RegularCalc />} />
        <Route path={"/square"} render={() => <SpecialCalc data={squares} calcFormula={regularFormula}/>} />
        <Route path={"/long"} render={() => <SpecialCalc data={long} calcFormula={regularFormula}/>} />
        <Route path={"/temperature"} render={() => <SpecialCalc data={temperature} calcFormula={temperatureFormula}/>} />
        <Route path={"/volume"} render={() => <SpecialCalc data={volume} calcFormula={regularFormula}/>} />
        <Route path={"/weight"} render={() => <SpecialCalc data={weight} calcFormula={regularFormula}/>} />
        <Route path={"/data"} render={() => <SpecialCalc data={data} calcFormula={regularFormula}/>} />
        <Route path={"/speed"} render={() => <SpecialCalc data={speed} calcFormula={regularFormula}/>} />
        <Route path={"/time"} render={() => <SpecialCalc data={time} calcFormula={regularFormula}/>} />
      </Switch>
      </Route>
      </BrowserRouter>
    </div>
  );
}

export default App;
