export class storage {
    executors = [
        {"id":1,"surname":"Петров","firstName":"Иван"},
        {"id":2,"surname":"Иванов","firstName":"Пётр"},
        {"id":3,"surname":"Васильев","firstName":"Артём"},
        {"id":4,"surname":"Кузнецов","firstName":"Сергей"},
        {"id":5,"surname":"Некрасов","firstName":"Артём"}
    ];

    tasks = [
        {"id":"f0e0b21f-49cc-44ae-af04-ff3760c9fbdb","subject":"Анализ","description":"Анализировать всякие штуки","executor":1,"planStartDate":"","planEndDate":""},
        {"id":"55fbab6e-aa6a-441e-be13-d942be820a46","subject":"Планирование","description":"Планировать всякие штуки","executor":3,"planStartDate":"","planEndDate":""},
        {"id":"ec5f8238-1eba-4b70-adea-78a26aaa7b09","subject":"Проектирование","description":"Проектировать всякие штуки","executor":2,"planStartDate":"","planEndDate":""},
        {"id":"481f932e-40cc-42ed-b191-b5e133c614ff","subject":"Бег","description":"Бегать по всяким штукам","executor":4,"planStartDate":"","planEndDate":""},
        {"id":"781f932e-40cc-42ed-b191-b5e133c614ff","subject":"Хождение","description":"Ходить по всяким штукам","executor":3,"planStartDate":"","planEndDate":""},
        {"id":"181f932e-40cc-42ed-b191-b5e133c614ff","subject":"Разработка","description":"Разрабатывать всякие штуки","executor":1,"planStartDate":"","planEndDate":""},
        {"id":"281f932e-40cc-42ed-b191-b5e133c614ff","subject":"Чтение","description":"Читать всякие штуки без остановок на обед и ужин. Мне вообще-то нужен вот такой длинный для того чтобы затестить длинный текст.","executor":4,"planStartDate":"","planEndDate":""},
        {"id":"381f932e-40cc-42ed-b191-b5e133c614ff","subject":"Вождение","description":"Водить всякие штуки","executor":4,"planStartDate":"","planEndDate":""},
        {"id":"581f932e-40cc-42ed-b191-b5e133c614ff","subject":"Сон","description":"Спать на всяких штуках","executor":2,"planStartDate":"","planEndDate":""},
        {"id":"681f932e-40cc-42ed-b191-b5e133c614ff","subject":"Пение","description":"Петь всякие штуки","executor":5,"planStartDate":"","planEndDate":""},
        {"id":"881f932e-40cc-42ed-b191-b5e133c614ff","subject":"Покупать","description":"Покупать всякие штуки","executor":null,"planStartDate":"","planEndDate":""},
        {"id":"a3722b0d-5f72-411a-9afd-85a393fb00bc","subject":"Тестирование","description":"Тестировать всякие штуки","executor":null,"planStartDate":"","planEndDate":""}
    ];

    body;
    table;
    prev;
    next;
    backlog;

    constructor(document) {
		this.body = document.querySelector('body');
        this.table = document.querySelector('#table');
        this.prev = document.querySelector('#prev');
        this.next = document.querySelector('#next');
        this.backlog = document.querySelector('#backlog');
        this.#createDates();
	}

    //Задаем даты (для удобства)
    #createDates() {
        for (let i = 0; i < this.tasks.length; i++) {
            let start_date = this.#fillDate(i);
            let start_year = start_date.getFullYear();
            let start_month = start_date.getMonth() + 1;
            let start_day = start_date.getDate();

            this.tasks[i].planStartDate = start_year+"-"+this.#addZero(start_month)+"-"+this.#addZero(start_day);

            let end_date = this.#fillDate(i + 7);
            let end_year = end_date.getFullYear();
            let end_month = end_date.getMonth() + 1;
            let end_day = end_date.getDate();

            this.tasks[i].planEndDate = end_year+"-"+this.#addZero(end_month)+"-"+this.#addZero(end_day);
        }
    }

    //Функция расчета даты
    #fillDate(i) {
        let step = i;
        let data = new Date();

        let year = data.getFullYear();
        let month = data.getMonth();
        let day = data.getDate() + step;
        
        return new Date(year, month, day);
    }

    //Функция по добавлению нуля перед однозначными датами/месяцами
    #addZero(n) {
        if (n < 10) {
            n = "0" + n;
        }
        return n;
    }
}