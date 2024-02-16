import {storage} from './storage.js';
import {schedulerCreator} from './schedulerCreator.js';

export class schedulerShifter extends storage {
    i = 0;

    constructor(document) {
		super(document);
	}

    dragStart(e) {
    	setTimeout(() => {
    		e.target.classList.add('hide');
    	}, 0);
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
        this.taskCells = document.querySelectorAll('.week.active > .taskCells');
    	let executorNumber = e.target.dataset.executor;

    	for (let task of this.taskCells) {
    		if (task.dataset.executor == executorNumber && task.dataset.day == this.temp.dataset.start) {
    			task.append(this.temp);
    		}
    	}
    }

    //Перелистывание недели вперед
    goForward() {
        let creator = new schedulerCreator(document);
        this.weeks = document.querySelectorAll('.week');
        
        if (this.weeks[this.i] == this.weeks[this.weeks.length - 1]) {
            this.weeks[this.i].setAttribute('class', 'week hide');
            let new_week = creator.createTable(true, this.weeks, this.i);
            this.table.appendChild(new_week);
        } else {
            this.weeks[this.i].setAttribute('class', 'week hide');
            this.weeks[this.i+1].setAttribute('class', 'week active');
        }

        this.i++;
    }

    //Перелистывание недели назад
    goBackward() {
        let creator = new schedulerCreator(document);
        this.weeks = document.querySelectorAll('.week');
        
        if (this.weeks[this.i] == this.weeks[0]) {
            this.weeks[this.i].setAttribute('class', 'week hide');
            let new_week = creator.createTable(false, this.weeks, this.i);
            this.table.prepend(new_week);
            this.i = 0;
        } else {
            this.weeks[this.i].setAttribute('class', 'week hide');
            this.weeks[this.i-1].setAttribute('class', 'week active');
            this.i--;
        }
    }
}