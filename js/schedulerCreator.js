import {storage} from './storage.js';
import {schedulerShifter} from './schedulerShifter.js';

let shifter = new schedulerShifter(document);

export class schedulerCreator extends storage {
    constructor(document) {
		super(document);
	}

    //Создаем таблицу. Эта же функция вызывается при создании 'новых' недель.
    createTable(direction = null, weeks = null, counter = null) {
        this.createTaskCells();
        this.createDateCells();
        this.createNameCells();
        this.fillDateCells(direction, weeks, counter);
        this.fillNameCells();
        this.addExecutorAttributeToAllTaskCells();
        this.addDateAttributeToAllTaskCells(this.taskCells, this.dateCells);

        this.objectives = document.querySelectorAll('.objectives');
        if (this.objectives.length == 0) {
            this.fillBacklog();
        }

        this.fillTaskCells();
        this.dragDropEvents();

        this.weeks = document.querySelectorAll('.week');
        if(this.weeks.length == 0) {
            this.addButtonEvents();
            this.table.appendChild(this.week);
        } else {
            return this.week;
        }
    }

    //Создаем все ячейки таблицы
    createTaskCells() {
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
    createDateCells() {
        this.taskCells[0].setAttribute('class', 'firstGrayCell');

        for (let i = 1; i < 8; i++) {
            this.taskCells[i].setAttribute('class', 'dateCells');
        }
        
        this.dateCells = this.week.querySelectorAll('.dateCells');
        this.taskCells = this.week.querySelectorAll('.week.active > .taskCells');
    }

    //Назначаем ячейки имен
    createNameCells() {
        for (let i = 0; i < this.taskCells.length; i += 8) {
            this.taskCells[i].setAttribute('class', 'namesCells');
        }
        
        this.namesCells = this.week.querySelectorAll('.namesCells');
        this.taskCells = this.week.querySelectorAll('.taskCells');
    }

    //Заполняем ячейки дат
    fillDateCells(direction = null, weeks = null, counter = null) {
        let dates;

        if(direction !== null) {
            dates = weeks[counter].querySelectorAll('.dateCells');
        } else {
            dates = this.dateCells;
        }

        for (let i = 0; i < dates.length; i++) {
            let date = this.fillDate(i, dates[i].innerHTML, direction);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();

            this.dateCells[i].innerHTML = year+"-"+this.addZero(month)+"-"+this.addZero(day);
        }
    }

    //Функция расчета даты
    fillDate(i, date, direction = null) {
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
    addZero(n) {
        if (n < 10) {
            n = "0" + n;
        }
        return n;
    }

    //Заполняем ячейки имен
    fillNameCells() {
        for (let i = 0; i < this.executors.length; i++) {
            this.namesCells[i].innerHTML = this.executors[i]["surname"];
            this.namesCells[i].dataset.executor = this.executors[i]["id"];
        }
    }

    //Добавляем всем ячейкам дней атрибут executor
    addExecutorAttributeToAllTaskCells() {
        for (let i = 0; i < this.executors.length; i++) {
            for (let j = i * 7; j < i * 7 + 7; j++) {
                this.taskCells[j].dataset.executor = this.executors[i]['id'];
            }
        }
    }

    //Функция по добавлению всем ячейкам дней атрибута даты
    addDateAttributeToAllTaskCells(taskCells, dateCells) {
        for (let i = 0, j = 0; i < taskCells.length; i++, j++) {
            taskCells[i].dataset.day = dateCells[j].innerHTML;
            if (j == 6) {
                j = -1;
            }
        }
    }

    //Функция по расставлению задач в ячейки дней
    fillTaskCells() {
    	for (let i = 0; i < this.tasks.length; i++) {
            for (let j = 0; j < this.taskCells.length; j++) {
                if (this.tasks[i]['executor'] != null || this.tasks[i]['executor'] != undefined) {
                    if (this.tasks[i]['executor'] == this.taskCells[j].dataset.executor && this.tasks[i]['planStartDate'] == this.taskCells[j].dataset.day) {
                        this.taskCells[j].appendChild(this.createTaskBlock(i));
                    }	
                }
            }
        }
    }

    //Функция по добавлению задач без исполнителя в backlog
    fillBacklog() {
    	for (let i = 0; i < this.tasks.length; i++) {
    		if (this.tasks[i]['executor'] == null || this.tasks[i]['executor'] == undefined) {
    			this.backlog.appendChild(this.createTaskBlock(i));		
    		}
    	}
    }

    //Функция по созданию блоков задач
    createTaskBlock(i) {
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
    addButtonEvents() {
        this.next.addEventListener('click', () => {shifter.goForward()});
        this.prev.addEventListener('click', () => {shifter.goBackward()});
    }

    //Добавляем обработчики событий для эффекта перетаскивания
    dragDropEvents() {
        this.objectives = this.week.querySelectorAll('.objectives');
        let backlogObjectives = this.backlog.querySelectorAll('.objectives');

    	this.backlog.addEventListener('dragover', (e) => {shifter.dragOver(e)});
    	this.backlog.addEventListener('drop', (e) => {shifter.dragDrop(e)});

    	for (let names of this.namesCells) {
    		names.addEventListener('drop', (e) => {shifter.dragDropRedirect(e)});
    		names.addEventListener('dragover', (e) => {shifter.dragOver(e)});
    	}
    	for (let task of this.objectives) {
    		task.addEventListener('dragstart', (e) => {shifter.dragStart(e)});
    		task.addEventListener('dragend', (e) => {shifter.dragEnd(e)});
    	}
        for (let task of backlogObjectives) {
    		task.addEventListener('dragstart', (e) => {shifter.dragStart(e)});
    		task.addEventListener('dragend', (e) => {shifter.dragEnd(e)});
    	}
    	for (let task of this.taskCells) {
    		task.addEventListener('dragover', (e) => {shifter.dragOver(e)});
    		task.addEventListener('dragenter', (e) => {shifter.dragEnter(e)});
    		task.addEventListener('dragleave', (e) => {shifter.dragLeave(e)});
    		task.addEventListener('drop', (e) => {shifter.dragDrop(e)});
    	}
    }
}