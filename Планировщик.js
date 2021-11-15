let executors = [
	{"id":1,"surname":"Петров","firstName":"Иван"},
	{"id":2,"surname":"Иванов","firstName":"Пётр"},
	{"id":3,"surname":"Васильев","firstName":"Артём"},
	{"id":4,"surname":"Кузнецов","firstName":"Сергей"},
	{"id":5,"surname":"Некрасов","firstName":"Артём"}
];
let tasks = [
	{"id":"f0e0b21f-49cc-44ae-af04-ff3760c9fbdb","subject":"Анализ","description":"Анализировать всякие штуки","executor":1,"planStartDate":"2021-11-17","planEndDate":"2021-11-18"},
	{"id":"55fbab6e-aa6a-441e-be13-d942be820a46","subject":"Планирование","description":"Планировать всякие штуки","executor":1,"planStartDate":"2021-11-19","planEndDate":"2021-11-20"},
	{"id":"ec5f8238-1eba-4b70-adea-78a26aaa7b09","subject":"Проектирование","description":"Проектировать всякие штуки","executor":2,"planStartDate":"2021-11-18","planEndDate":"2021-11-19"},
	{"id":"481f932e-40cc-42ed-b191-b5e133c614ff","subject":"Бег","description":"Бегать по всяким штукам","executor":2,"planStartDate":"2021-11-20","planEndDate":"2021-11-21"},
	{"id":"781f932e-40cc-42ed-b191-b5e133c614ff","subject":"Хождение","description":"Ходить по всяким штукам","executor":3,"planStartDate":"2021-11-21","planEndDate":"2021-11-22"},
	{"id":"181f932e-40cc-42ed-b191-b5e133c614ff","subject":"Разработка","description":"Разрабатывать всякие штуки","executor":4,"planStartDate":"2021-11-17","planEndDate":"2021-11-18"},
	{"id":"281f932e-40cc-42ed-b191-b5e133c614ff","subject":"Чтение","description":"Читать всякие штуки","executor":4,"planStartDate":"2021-11-19","planEndDate":"2021-10-30"},
	{"id":"381f932e-40cc-42ed-b191-b5e133c614ff","subject":"Вождение","description":"Водить всякие штуки","executor":4,"planStartDate":"2021-11-22","planEndDate":"2021-11-23"},
	{"id":"581f932e-40cc-42ed-b191-b5e133c614ff","subject":"Сон","description":"Спать на всяких штуках","executor":5,"planStartDate":"2021-11-21","planEndDate":"2021-11-22"},
	{"id":"681f932e-40cc-42ed-b191-b5e133c614ff","subject":"Пение","description":"Петь всякие штуки","executor":5,"planStartDate":"2021-11-23","planEndDate":"2021-11-24"},
	{"id":"881f932e-40cc-42ed-b191-b5e133c614ff","subject":"Покупать","description":"Покупать всякие штуки","executor":null,"planStartDate":"2021-11-24","planEndDate":"2021-11-25"},
	{"id":"a3722b0d-5f72-411a-9afd-85a393fb00bc","subject":"Тестирование","description":"Тестировать всякие штуки","executor":null,"planStartDate":"2021-11-25","planEndDate":"2021-11-26"}
];

let body = document.querySelector('body');
let backlog = document.querySelector('#backlog');

mobileCheck();
function mobileCheck() {											//Функция проверки размера экрана (таймер для отслеживания изменений в реальном времени)
	setInterval(asd,0);
}
function asd() {
	let wrapper = document.querySelector('#wrapper');
	if (body.clientWidth <= 1024) {
		backlog.style.cssText += "display: none;";
		wrapper.style.cssText += "width: 100%;";
	}
	if (body.clientWidth > 1024) {
		backlog.style.cssText += "display: block;";
		wrapper.style.cssText += "width: 70vw;";
	}
}

let weeks = document.querySelector('.weeks');						//Создаем все ячейки таблицы
for (let i = 0; i <= executors.length; i++) {
	for (let j = 0; j < 8; j++) {
		let tmp = document.createElement('div');
		tmp.setAttribute('class', 'taskCells');
		weeks.appendChild(tmp);
	}
}

let taskCells = document.querySelectorAll('.taskCells');			//Назначаем ячейки дат
for (let i = 0; i < 8; i++) {
	taskCells[i].setAttribute('class', 'daysCells');
}

let divs = document.querySelectorAll('.weeks div');					//Назначаем ячейки имен
for (let i = 8; i < divs.length; i += 8) {
	divs[i].setAttribute('class', 'namesCells');
}

let namesCells = document.querySelectorAll('.namesCells');			//Заполняем ячейки имен
for (let i = 0; i < namesCells.length; i++) {
	namesCells[i].innerHTML = executors[i]["surname"];
	namesCells[i].dataset.executor = executors[i]["id"];
}

let daysCells = document.querySelectorAll('.daysCells');			//Заполняем ячейки дат
daysCells[0].setAttribute('class', 'firstGrayCell');
daysCells = document.querySelectorAll('.daysCells');
for (let i = 0; i < daysCells.length; i++) {
	daysCells[i].innerHTML = fillDate(i);
}
function fillDate(i) {												//Функция заполнения первоначальной даты
	let data = new Date();
	let year = data.getFullYear();
	let month = data.getMonth()+1;
	let date = data.getDate()+i;
	return (year+"-"+addZero(month)+"-"+addZero(date));
}
function addZero(n) {												//Функция по добавления нуля перед однозначными датами
	if (n < 10) {
		n = "0" + n;
	}
	return n;
}

taskCells = document.querySelectorAll('.taskCells');				//Добавляем всем ячейкам дней атрибут executor
for (let i = 0; i < namesCells.length; i++) {
	for (let j = jValue(i); j < jValue(i)+7; j++) {
		taskCells[j].dataset.executor = executors[i]['id'];
	}
}
function jValue(i) {												//Вспомогательная функция
	j = i*7;
	return j;
}

tagAssignment(taskCells, daysCells);								//Функция по добавлению всем ячейкам дней атрибута даты
function tagAssignment(clonetasksweeks, clonedaysweeks) {
	for (let i = 0, j = 0; i < clonetasksweeks.length; i++, j++) {
		clonetasksweeks[i].dataset.day = clonedaysweeks[j].innerHTML;
		if (j == 6) {
			j = -1;
		}
	}
}

let array = [];
for (let i = 0; i < tasks.length; i++) {							//Создаем копию массива tasks, чтобы проводить с ним манипуляции, а именно убирать из него уже имеющиеся в таблице задачи
	array.push(tasks[i]);
}

taskCellsFilling();													//Функция по добавлению задач в ячейки дней
function taskCellsFilling() {
	if (array.length > 0) {
		divs = document.querySelectorAll('.objectives');
		for (let i = 0; i < divs.length; i++) {
			for (let j = 0; j < array.length; j++) {
				if (divs[i].dataset.id == array[j]['id']) {
					let tmp = array[0];
					array[0] = array[j];
					array[j] = tmp;
					array.shift();
				}
			}
		}
	}
	
	taskCells = document.querySelectorAll('.taskCells');
	for (let i = 0; i < array.length; i++) {
		for (let j = 0; j < taskCells.length; j++) {
			if (array[i]['executor'] != null || array[i]['executor'] != undefined) {
				if (array[i]['executor'] == taskCells[j].dataset.executor && array[i]['planStartDate'] == taskCells[j].dataset.day) {
					taskCells[j].appendChild(elementCreation(i));
				}	
			}
		}
	}
	dragDropEvents();
}

backlogFilling();													//Функция по добавлению задач в backlog
function backlogFilling() {
	taskCells = document.querySelectorAll('.taskCells');
	for (let i = 0; i < array.length; i++) {
		if (array[i]['executor'] == null || array[i]['executor'] == undefined) {
			backlog.appendChild(elementCreation(i));		
		}
	}
	dragDropEvents();
}

function elementCreation(i) {										//Функция по созданию блоков задач
	let div = document.createElement('div');
	let h3 = document.createElement('h3');
	let p = document.createElement('p');
	div.classList.add('objectives');
	div.title = "Срок сдачи: "+array[i]['planEndDate'];
	div.dataset.start = array[i]['planStartDate'];
	div.dataset.id = array[i]['id'];
	div.dataset.executor = array[i]['executor'];
	div.draggable = "true";
	h3.innerHTML = array[i]['subject'];
	p.innerHTML = array[i]['description'];
	div.appendChild(h3);
	div.appendChild(p);
	return div;
}

function dragDropEvents() {											//Функция по добавлению эффекта перетаскивания
	backlog = document.querySelector('#backlog');
	taskCells = document.querySelectorAll('.taskCells');
	objectives = document.querySelectorAll('.objectives');
	namesCells = document.querySelectorAll('.namesCells');
	let temp;

	backlog.addEventListener('dragover', dragOver);
	backlog.addEventListener('drop', dragDrop);

	for (let names of namesCells) {
		names.addEventListener('drop', dragDropRedirect);
		names.addEventListener('dragover', dragOver);
	}
	for (let task of objectives) {
		task.addEventListener('dragstart', dragStart);
		task.addEventListener('dragend', dragEnd);
	}
	for (let task of taskCells) {
		task.addEventListener('dragover', dragOver);
		task.addEventListener('dragenter', dragEnter);
		task.addEventListener('dragleave', dragLeave);
		task.addEventListener('drop', dragDrop);
	}
}

function dragStart() {
	setTimeout(() => {
		this.classList.add('hide');
	}, 0)
	temp = this;
}
function dragEnd() {
	this.classList.remove('hide');
}
function dragOver(event) {
	event.preventDefault();
}
function dragEnter() {
	this.classList.add('hovered');
}
function dragLeave() {
	this.classList.remove('hovered');
}
function dragDrop() {
	this.append(temp);
	this.classList.remove('hovered');
}
function dragDropRedirect() {											//Функция перенаправляющая задачи в определенные ячейки в соответствии с их начальной датой (при перетаскивании на имена)
	let executorNumber = this.dataset.executor;
	for (let task of taskCells) {
		if (task.dataset.executor == executorNumber && task.dataset.day == temp.dataset.start) {
			task.append(temp);
		}
	}
}

let next = document.querySelector('#next');
let prev = document.querySelector('#prev');
let table = document.querySelector('#table');

let startDateForward = Number(daysCells[daysCells.length - 1].innerHTML.slice(-2))+1;		//Стартовая дата для последующих недель
let startDateBackward = Number(daysCells[0].innerHTML.slice(-2))-7;							//Стартовая дата для предыдущих недель

next.addEventListener('click', goingForward);
prev.addEventListener('click', goingBackward);

let k = 0;
function goingForward() {																	//Функция переключения недель вперед
	weeks = document.querySelectorAll('.weeks');
	if (weeks[k] == weeks[weeks.length - 1]) {
		weeks[k].setAttribute('class', 'weeks hide');
		let clone = weeks[k].cloneNode(true);
		clone.setAttribute('class', 'weeks active');
		
		let clonedaysweeks = clone.querySelectorAll('.daysCells');
		let clonetasksweeks = clone.querySelectorAll('.taskCells');
		
		for (let days of clonedaysweeks) {
			days.innerHTML = "";
		}
		for (let tasks of clonetasksweeks) {
			tasks.innerHTML = "";
		}
		
		for (let i = 0; i <  clonedaysweeks.length; i++) {
			clonedaysweeks[i].innerHTML = forwardBackwardDates(i, startDateForward);
		}
		startDateForward = startDateForward + 7;
		tagAssignment(clonetasksweeks, clonedaysweeks);
		table.appendChild(clone);
		k++;
		dragDropEvents();
	} else {
		weeks[k].setAttribute('class', 'weeks hide');
		weeks[k+1].setAttribute('class', 'weeks active');
		k++;
	}
	taskCellsFilling();
}

function goingBackward() {																	//Функция переключения недель назад
	weeks = document.querySelectorAll('.weeks');
	if (weeks[k] == weeks[0]) {
		weeks[k].setAttribute('class', 'weeks hide');
		let clone = weeks[k].cloneNode(true);
		clone.setAttribute('class', 'weeks active');
		
		let clonedaysweeks = clone.querySelectorAll('.daysCells');
		let clonetasksweeks = clone.querySelectorAll('.taskCells');
		
		for (let days of clonedaysweeks) {
			days.innerHTML = "";
		}
		for (let tasks of clonetasksweeks) {
			tasks.innerHTML = "";
		}
		
		for (let i = 0; i <  clonedaysweeks.length; i++) {
			clonedaysweeks[i].innerHTML = forwardBackwardDates(i, startDateBackward);
		}
		startDateBackward = startDateBackward - 7;
		tagAssignment(clonetasksweeks, clonedaysweeks);
		table.prepend(clone);
		k = 0;
		dragDropEvents();
	} else {
		weeks[k].setAttribute('class', 'weeks hide');
		weeks[k-1].setAttribute('class', 'weeks active');
		k--;
	}
	taskCellsFilling();
}

let actualMonth = Number(daysCells[0].innerHTML.substr(5, 2)) - 1;
let actualYear = Number(daysCells[0].innerHTML.substr(0, 4));
function forwardBackwardDates(i, startdate) {												//Функция заполнения дат (два объекта потому что при смене месяцев посреди недели [внутри цикла] js некорректно отображал дату)
	let data1 = new Date(actualYear, actualMonth, startdate);								//Например, можно было получить 33 ноября
	let year = data1.getFullYear();
	let month = data1.getMonth();
	let date = data1.getDate() + i;
	let data2 = new Date(year, month, date);
	let year2 = data2.getFullYear();
	let month2 = data2.getMonth();
	let date2 = data2.getDate();
	return year2+"-"+addZero(month2+1)+"-"+addZero(date2);
}
