import { useEffect } from 'react';
import style from './Button.module.css';

const Button = ({button, example, changeInput, id}) =>{
    const handleClick = (e) => {
        changeInput(button.symbol, example);
   }

    return(
        <div id={'key_' + id} className={style.button} onClick={handleClick} ><p>{button.symbol}</p></div>
    )
}

export default Button;