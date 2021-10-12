let executors = [
{"id":1,"username":"user1","surname":"Петров","firstName":"Иван","secondName":""},
{"id":2,"username":"user2","surname":"Иванов","firstName":"Пётр","secondName":""},
{"id":3,"username":"user3","surname":"Васильев","firstName":"Артём","secondName":""},
{"id":4,"username":"user4","surname":"Кузнецов","firstName":"Сергей","secondName":""},
{"id":5,"username":"user5","surname":"Некрасов","firstName":"Артём","secondName":""}];
let tasks = [
{"id":"f0e0b21f-49cc-44ae-af04-ff3760c9fbdb","subject":"Анализ","description":"Анализировать всякие штуки","creationAuthor":1,"executor":1,"creationDate":"2021-10-08","planStartDate":"2021-10-08","planEndDate":"2021-10-12","endDate":"2021-10-08","status":1,"order":1},
{"id":"55fbab6e-aa6a-441e-be13-d942be820a46","subject":"Планирование","description":"Планировать всякие штуки","creationAuthor":1,"executor":1,"creationDate":"2021-10-08","planStartDate":"2021-10-11","planEndDate":"2021-10-12","endDate":"2021-10-08","status":1,"order":1},
{"id":"ec5f8238-1eba-4b70-adea-78a26aaa7b09","subject":"Проектирование","description":"Проектировать всякие штуки","creationAuthor":1,"executor":2,"creationDate":"2021-10-08","planStartDate":"2021-10-12","planEndDate":"2021-10-13","endDate":"2021-10-08","status":1,"order":1},
{"id":"c81f932e-40cc-42ed-b191-b5e133c614ff","subject":"Разработка","description":"Разрабатывать всякие штуки","creationAuthor":1,"executor":3,"creationDate":"2021-10-08","planStartDate":"2021-10-12","planEndDate":"2021-10-15","endDate":"2021-10-08","status":1,"order":1},
{"id":"a3722b0d-5f72-411a-9afd-85a393fb00bc","subject":"Тестирование","description":"Тестировать всякие штуки","creationAuthor":1,"executor":null,"creationDate":"2021-10-08","planStartDate":"2021-10-14","planEndDate":"2021-10-15","endDate":"2021-10-08","status":1,"order":1}];
let body = document.querySelector('body');
let backlog = document.querySelector('#backlog');
mobileCheck();

let cells = document.querySelector('.cells');						//Создаем все ячейки таблицы
for (let i = 0; i <= executors.length; i++) {
	for (let j = 0; j < 8; j++) {
		let tmp = document.createElement('div');
		tmp.setAttribute('class', 'taskCells');
		cells.appendChild(tmp);
	}
}

let taskCells = document.querySelectorAll('.taskCells');			//Назначаем ячейки дат
for (let i = 0; i < 8; i++) {
	taskCells[i].setAttribute('class', 'daysCells');
}

let divs = document.querySelectorAll('.cells div');					//Назначаем ячейки имен
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

taskCells = document.querySelectorAll('.taskCells');				//Добавляем всем ячейкам дней атрибут executor
for (let i = 0; i < namesCells.length; i++) {
	for (let j = jValue(i); j < jValue(i)+7; j++) {
		taskCells[j].dataset.executor = executors[i]['id'];
	}
}

tagAssignment(taskCells, daysCells);								//Функция по добавлению всем ячейкам дней атрибута даты

let array = [];
for (let i = 0; i < tasks.length; i++) {
	array.push(tasks[i]);
}

taskCellsFilling();													//Функция по добавлению задач в ячейки дней
function taskCellsFilling() {
	if (array.length > 0) {
		divs = document.querySelectorAll('.taskStyle');
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
	div.classList.add('taskStyle');
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

dragDropEvents();													//Функция по добавлению эффекта перетаскивания
function dragDropEvents() {
	backlog = document.querySelector('#backlog');
	taskCells = document.querySelectorAll('.taskCells');
	taskStyle = document.querySelectorAll('.taskStyle');
	namesCells = document.querySelectorAll('.namesCells');
	let temp;

	backlog.addEventListener('dragover', dragOver);
	backlog.addEventListener('drop', dragDrop);

	for (let names of namesCells) {
		names.addEventListener('drop', dragDropRedirect);
		names.addEventListener('dragover', dragOver);
	}
	for (let task of taskStyle) {
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
function dragDropRedirect() {											//Функция перенаправляющая задачи при перетаскивании на имена
	let executorNumber = this.dataset.executor;
	for (let task of taskCells) {
		if (task.dataset.executor == executorNumber && task.dataset.day == temp.dataset.start) {
			task.append(temp);
		}
	}
}

function mobileCheck() {												//Функция проверки размера экрана (таймер для отслеживания изменений в реальном времени)
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
function fillDate(i) {													//Функция заполнения первоначальной даты
	let data = new Date();
	let year = data.getFullYear();
	let month = data.getMonth()+1;
	let date = data.getDate()+i;
	return (year+"-"+addZero(month)+"-"+addZero(date));
}
function forwardBackwardDates(i, startdate) {							//Функция заполнения дат (два объекта потому что при смене месяцев посреди недели [внутри цикла] js некорректно отображал дату)
	let data1 = new Date(2021, 09, startdate);							//Например, можно было получить 33 ноября
	let year = data1.getFullYear();
	let month = data1.getMonth();
	let date = data1.getDate() + i;
	let data2 = new Date(year, month, date);
	let year2 = data2.getFullYear();
	let month2 = data2.getMonth();
	let date2 = data2.getDate();
	return year2+"-"+addZero(month2+1)+"-"+addZero(date2);
}
function addZero(n) {													//Функция по добавления нуля перед однозначными датами
	if (n < 10) {
		n = "0" + n;
	}
	return n;
}
function jValue(i) {													//Вспомогательная функция
	j = i*7;
	return j;
}
function tagAssignment(clonetaskscells, clonedayscells) {				//Функция по добавлению всем новым ячейкам дней атрибута даты
	for (let i = 0, j = 0; i < clonetaskscells.length; i++, j++) {
		clonetaskscells[i].dataset.day = clonedayscells[j].innerHTML;
		if (j == 6) {
			j = -1;
		}
	}
}

let next = document.querySelector('#next');
let prev = document.querySelector('#prev');
let slider_track = document.querySelector('#slider_track');
let startDateForward = Number(daysCells[daysCells.length - 1].innerHTML.slice(-2))+1;		//Стартовая дата для последующих недель
let startDateBackward = Number(daysCells[0].innerHTML.slice(-2))-7;							//Стартовая дата для предыдущих недель

next.addEventListener('click', goingForward);
prev.addEventListener('click', goingBackward);

let k = 0;
function goingForward() {																	//Функция переключения недель вперед
	cells = document.querySelectorAll('.cells');
	if (cells[k] == cells[cells.length - 1]) {
		cells[k].setAttribute('class', 'cells hide');
		let clone = cells[k].cloneNode(true);
		clone.setAttribute('class', 'cells active');
		
		let clonedayscells = clone.querySelectorAll('.daysCells');
		let clonetaskscells = clone.querySelectorAll('.taskCells');
		
		for (let days of clonedayscells) {
			days.innerHTML = "";
		}
		for (let tasks of clonetaskscells) {
			tasks.innerHTML = "";
		}
		
		for (let i = 0; i <  clonedayscells.length; i++) {
			clonedayscells[i].innerHTML = forwardBackwardDates(i, startDateForward);
		}
		startDateForward = startDateForward + 7;
		tagAssignment(clonetaskscells, clonedayscells);
		slider_track.appendChild(clone);
		k++;
		dragDropEvents();
	} else {
		cells[k].setAttribute('class', 'cells hide');
		cells[k+1].setAttribute('class', 'cells active');
		k++;
	}
	taskCellsFilling();
}

function goingBackward() {																	//Функция переключения дней назад
	cells = document.querySelectorAll('.cells');
	if (cells[k] == cells[0]) {
		cells[k].setAttribute('class', 'cells hide');
		let clone = cells[k].cloneNode(true);
		clone.setAttribute('class', 'cells active');
		
		let clonedayscells = clone.querySelectorAll('.daysCells');
		let clonetaskscells = clone.querySelectorAll('.taskCells');
		
		for (let days of clonedayscells) {
			days.innerHTML = "";
		}
		for (let tasks of clonetaskscells) {
			tasks.innerHTML = "";
		}
		
		for (let i = 0; i <  clonedayscells.length; i++) {
			clonedayscells[i].innerHTML = forwardBackwardDates(i, startDateBackward);
		}
		startDateBackward = startDateBackward - 7;
		tagAssignment(clonetaskscells, clonedayscells);
		slider_track.prepend(clone);
		k = 0;
		dragDropEvents();
	} else {
		cells[k].setAttribute('class', 'cells hide');
		cells[k-1].setAttribute('class', 'cells active');
		k--;
	}
	taskCellsFilling();
}