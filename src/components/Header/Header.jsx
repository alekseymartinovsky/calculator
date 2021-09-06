import style from './Header.module.css';
import { NavLink } from 'react-router-dom';
import cross from '../../icons/cross.png';

let classNames = require('classnames/bind')
let cx = classNames.bind(style);

const Header = ({viewMenu, toggleMenu}) => {
    let menuStyle = cx({header: true}, {hiddenMenu: viewMenu});
    
    return(
        <div className={menuStyle} >
            <div onClick={toggleMenu}><img className={style.cross} src={cross} alt="" /></div>
            <div className={style.header_block} ><NavLink exact to={"/"} activeClassName={style.selected}>Цифры</NavLink></div>
            <div className={style.header_block} ><NavLink exact to={"/square"} activeClassName={style.selected}>Площадь</NavLink></div>
            <div className={style.header_block} ><NavLink exact to={"/long"} activeClassName={style.selected}>Длинна</NavLink></div>
            <div className={style.header_block} ><NavLink exact to={"/temperature"} activeClassName={style.selected}>Температура</NavLink></div>
            <div className={style.header_block} ><NavLink exact to={"/volume"} activeClassName={style.selected}>Объем</NavLink></div>
            <div className={style.header_block} ><NavLink exact to={"/weight"} activeClassName={style.selected}>Масса</NavLink></div>
            <div className={style.header_block} ><NavLink exact to={"/data"} activeClassName={style.selected}>Данные</NavLink></div>
            <div className={style.header_block} ><NavLink exact to={"/speed"} activeClassName={style.selected}>Скорость</NavLink></div>
            <div className={style.header_block} ><NavLink exact to={"/time"}activeClassName={style.selected}>Время</NavLink></div> 
        </div>
    )
}

export default Header;