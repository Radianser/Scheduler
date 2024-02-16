import {storage} from './js/storage.js';

class schedulerCreator extends storage {
    i = 0;

    constructor(document) {
		super(document);
	}

    //Создаем таблицу. Эта же функция вызывается при создании 'новых' недель.
    createTable(direction = null) {
        this.#createTasksCells();
        this.#createDatesCells();
        this.#createNamesCells();
        this.#fillDatesCells(direction);
        this.#fillNamesCells();
        this.#addExecutorAttributeToAllTaskCells();
        this.#addDateAttributeToAllTaskCells(this.taskCells, this.dateCells);

        this.objectives = document.querySelectorAll('.objectives');
        if (this.objectives.length == 0) {
            this.#fillBacklog();
        }

        this.#fillTasksCells();
        this.#dragDropEvents();

        this.weeks = document.querySelectorAll('.week');
        if(this.weeks.length == 0) {
            this.#addButtonsEvents();
            this.table.appendChild(this.week);
        } else {
            return this.week;
        }
    }

    //Создаем все ячейки таблицы
    #createTasksCells() {
        let week = document.createElement('div');
        week.setAttribute('class', 'week active');
        this.week = week;

        for (let i = 0; i <= this.executors.length; i++) {
            for (let j = 0; j < 8; j++) {
                let tmp = document.createElement('div');
                tmp.setAttribute('class', 'taskCells');
                this.week.appendChild(tmp);
            }
        }
        
        this.taskCells = this.week.querySelectorAll('.week.active > .taskCells');
    }

    //Назначаем ячейки дат
    #createDatesCells() {
        this.taskCells[0].setAttribute('class', 'firstGrayCell');

        for (let i = 1; i < 8; i++) {
            this.taskCells[i].setAttribute('class', 'dateCells');
        }
        
        this.dateCells = this.week.querySelectorAll('.dateCells');
        this.taskCells = this.week.querySelectorAll('.week.active > .taskCells');
    }

    //Назначаем ячейки имен
    #createNamesCells() {
        for (let i = 0; i < this.taskCells.length; i += 8) {
            this.taskCells[i].setAttribute('class', 'namesCells');
        }
        
        this.namesCells = this.week.querySelectorAll('.namesCells');
        this.taskCells = this.week.querySelectorAll('.taskCells');
    }

    //Заполняем ячейки дат
    #fillDatesCells(direction = null) {
        let dates;

        if(direction !== null) {
            dates = this.weeks[this.i].querySelectorAll('.dateCells');
        } else {
            dates = this.dateCells;
        }

        for (let i = 0; i < dates.length; i++) {
            let date = this.#fillDate(i, dates[i].innerHTML, direction);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();

            this.dateCells[i].innerHTML = year+"-"+this.#addZero(month)+"-"+this.#addZero(day);
        }
    }

    //Функция расчета даты
    #fillDate(i, date, direction = null) {
        let step,data;

        if(direction !== null) {
            step = direction == true ? 7 : -7;
            data = new Date(date);
        } else {
            step = i;
            data = new Date();
        }

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

    //Заполняем ячейки имен
    #fillNamesCells() {
        for (let i = 0; i < this.executors.length; i++) {
            this.namesCells[i].innerHTML = this.executors[i]["surname"];
            this.namesCells[i].dataset.executor = this.executors[i]["id"];
        }
    }

    //Добавляем всем ячейкам дней атрибут executor
    #addExecutorAttributeToAllTaskCells() {
        for (let i = 0; i < this.executors.length; i++) {
            for (let j = i * 7; j < i * 7 + 7; j++) {
                this.taskCells[j].dataset.executor = this.executors[i]['id'];
            }
        }
    }

    //Функция по добавлению всем ячейкам дней атрибута даты
    #addDateAttributeToAllTaskCells(taskCells, dateCells) {
        for (let i = 0, j = 0; i < taskCells.length; i++, j++) {
            taskCells[i].dataset.day = dateCells[j].innerHTML;
            if (j == 6) {
                j = -1;
            }
        }
    }

    //Функция по добавлению задач в ячейки дней
    #fillTasksCells() {
    	for (let i = 0; i < this.tasks.length; i++) {
            for (let j = 0; j < this.taskCells.length; j++) {
                if (this.tasks[i]['executor'] != null || this.tasks[i]['executor'] != undefined) {
                    if (this.tasks[i]['executor'] == this.taskCells[j].dataset.executor && this.tasks[i]['planStartDate'] == this.taskCells[j].dataset.day) {
                        this.taskCells[j].appendChild(this.#createTaskBlock(i));
                    }	
                }
            }
        }
    }

    //Функция по добавлению задач без исполнителя в backlog
    #fillBacklog() {
    	for (let i = 0; i < this.tasks.length; i++) {
    		if (this.tasks[i]['executor'] == null || this.tasks[i]['executor'] == undefined) {
    			this.backlog.appendChild(this.#createTaskBlock(i));		
    		}
    	}
    }

    //Функция по созданию блоков задач
    #createTaskBlock(i) {
    	let div = document.createElement('div');
    	let h3 = document.createElement('h3');
    	let p = document.createElement('p');
    	div.classList.add('objectives');
    	div.title = "Срок сдачи: "+this.tasks[i]['planEndDate'];
    	div.dataset.start = this.tasks[i]['planStartDate'];
    	div.dataset.id = this.tasks[i]['id'];
    	div.dataset.executor = this.tasks[i]['executor'];
    	div.draggable = "true";
    	h3.innerHTML = this.tasks[i]['subject'];
    	p.innerHTML = this.tasks[i]['description'];
    	div.appendChild(h3);
    	div.appendChild(p);
    	return div;
    }

    //Добавляем обработчики событий на переключатели недель
    #addButtonsEvents() {
        this.next.addEventListener('click', () => {this.goForward()});
        this.prev.addEventListener('click', () => {this.goBackward()});
    }

    //Добавляем обработчики событий для эффекта перетаскивания
    #dragDropEvents() {
        this.objectives = this.week.querySelectorAll('.objectives');
        let backlogObjectives = this.backlog.querySelectorAll('.objectives');

    	this.backlog.addEventListener('dragover', (e) => {this.dragOver(e)});
    	this.backlog.addEventListener('drop', (e) => {this.dragDrop(e)});

    	for (let names of this.namesCells) {
    		names.addEventListener('drop', (e) => {this.dragDropRedirect(e)});
    		names.addEventListener('dragover', (e) => {this.dragOver(e)});
    	}
    	for (let task of this.objectives) {
    		task.addEventListener('dragstart', (e) => {this.dragStart(e)});
    		task.addEventListener('dragend', (e) => {this.dragEnd(e)});
    	}
        for (let task of backlogObjectives) {
    		task.addEventListener('dragstart', (e) => {this.dragStart(e)});
    		task.addEventListener('dragend', (e) => {this.dragEnd(e)});
    	}
    	for (let task of this.taskCells) {
    		task.addEventListener('dragover', (e) => {this.dragOver(e)});
    		task.addEventListener('dragenter', (e) => {this.dragEnter(e)});
    		task.addEventListener('dragleave', (e) => {this.dragLeave(e)});
    		task.addEventListener('drop', (e) => {this.dragDrop(e)});
    	}
    }

    dragStart(e) {
    	setTimeout(() => {
    		e.target.classList.add('hide');
    	}, 0)
    	this.temp = e.target;
    }
    dragEnd(e) {
    	e.target.classList.remove('hide');
    }
    dragOver(e) {
    	e.preventDefault();
    }
    dragEnter(e) {
    	e.target.classList.add('hovered');
    }
    dragLeave(e) {
    	e.target.classList.remove('hovered');
    }
    dragDrop(e) {
        if(e.target.closest('div#backlog')) {
            e.target.closest('div#backlog').append(this.temp);
        } else {
            e.target.closest('div.taskCells').append(this.temp);
        }
    	e.target.classList.remove('hovered');
    }

    //Функция перенаправляющая задачи в определенные ячейки в соответствии с их начальной датой (при перетаскивании на имена)
    dragDropRedirect(e) {
    	let executorNumber = e.target.dataset.executor;

    	for (let task of this.taskCells) {
    		if (task.dataset.executor == executorNumber && task.dataset.day == this.temp.dataset.start) {
    			task.append(this.temp);
    		}
    	}
    }

    //Перелистывание недели вперед
    goForward() {
        this.weeks = document.querySelectorAll('.week');
        
        if (this.weeks[this.i] == this.weeks[this.weeks.length - 1]) {
            this.weeks[this.i].setAttribute('class', 'week hide');
            let new_week = this.createTable(true);
            this.table.appendChild(new_week);
        } else {
            this.weeks[this.i].setAttribute('class', 'week hide');
            this.weeks[this.i+1].setAttribute('class', 'week active');
        }

        this.i++;
    }

    //Перелистывание недели назад
    goBackward() {
        this.weeks = document.querySelectorAll('.week');
        
        if (this.weeks[this.i] == this.weeks[0]) {
            this.weeks[this.i].setAttribute('class', 'week hide');
            let new_week = this.createTable(false);
            this.table.prepend(new_week);
            this.i = 0;
        } else {
            this.weeks[this.i].setAttribute('class', 'week hide');
            this.weeks[this.i-1].setAttribute('class', 'week active');
            this.i--;
        }
    }
}

let creator = new schedulerCreator(document);
creator.createTable();
