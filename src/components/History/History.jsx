import style from './History.module.css';


let classNames = require('classnames/bind')
let cx = classNames.bind(style);

const History = ({ history, setHistory, view, setView }) => {
    const clearHistory = () => {
        let openRequest = indexedDB.open('aaa', 3);

        openRequest.onupgradeneeded = function () {
            // срабатывает, если на клиенте нет базы данных
            let db = openRequest.result;
            if (!db.objectStoreNames.contains('books')) {
                db.createObjectStore('books', { keyPath: 'id', autoIncrement: true });
            }
        };

        openRequest.onsuccess = function () {
            let db = openRequest.result;
            let transaction = db.transaction("books", 'readwrite');
            let books = transaction.objectStore("books");
            books.clear();
            setHistory([]);
        }
    }

    let classMain = cx({ main: true }, { hiddenEl: view })

    const toggleView = () => {
        setView(view);
    }

    return (
        <div className={classMain}>
            <div className={style.history}>
                {history.length > 0
                    ? history.map((note, id) => {
                        return (
                            <div key={id} className={style.note}>
                                <div className={style.note_container}>
                                    <p className={style.note_prompt}>{note.body + note.res}</p>
                                    <p className={style.note_body}>{note.body}</p>
                                </div>
                                <p className={style.note_res}>{note.res}</p>
                            </div>
                        )
                    })
                    : <div className={style.history_empty}>История пуста</div>
                }
            </div>
            <div className={style.history_buttons}>
                <div className={style.history_buttons_clear} onClick={clearHistory}>Очистить историю</div>
                <div className={style.history_buttons_back} onClick={toggleView}>Назад</div>
            </div>
        </div>
    )
}

export default History;