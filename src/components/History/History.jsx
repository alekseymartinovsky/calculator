import style from './History.module.css';

const History = ({ history, setHistory }) => {
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

    return (
        <div className={style.main}>
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
            <div className={style.clear} onClick={clearHistory}>Очистить историю</div>
        </div>
    )
}

export default History;