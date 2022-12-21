// TODO: write code here

import sendRequest from './components/sendRequest';
import TicketWidget from './components/ticketWidget';

const btn = document.querySelector('.header .btn');
const ticketAdd = document.querySelector('.ticket__add');
const ticketForm = ticketAdd.querySelector('.ticket__form');
const nameInput = ticketAdd.querySelector('.ticket__form .ticket__name');
const descriptionInput = ticketAdd.querySelector('.ticket__form .ticket__description');
const tickets = document.querySelector('.tickets');

let dataItem = null;

const callbackShowPoPUp = function (e) {
  e.preventDefault();
  e.stopPropagation();
  const ticketTitle = ticketAdd.querySelector('.ticket__title');
  ticketAdd.classList.add('active');
  ticketForm.classList.add('active');
  const btnCansel = ticketAdd.querySelector('.btn__cansel');
  const btnAdd = ticketAdd.querySelector('.btn__add');
  btnCansel.addEventListener('click', callbackBtnCansel);
  btnAdd.addEventListener('click', callbackBtnAdd);
  ticketTitle.textContent = 'Добавить тикет';
  if (this.closest('.tickets__item') !== null) {
    const ticketItem = this.closest('.tickets__item');
    ticketTitle.textContent = 'Изменить тикет';
    sendRequest('get', `http://localhost:7070?method=ticketById&id=${ticketItem.getAttribute('data-id')}`)
      .then((data) => {
        dataItem = data;
        nameInput.value = data.name;
        descriptionInput.value = data.description;
      });
  }
};

const callbackBtnCansel = (e) => {
  e.preventDefault();
  nameInput.value = '';
  descriptionInput.value = '';
  ticketAdd.classList.remove('active');
  ticketForm.classList.remove('active');
};

const callbackBtnAdd = (e) => {
  e.preventDefault();
  const body = new FormData();
  body.append('id', `${(dataItem === null) ? 'null' : dataItem.id}`);
  body.append('name', nameInput.value);
  body.append('description', descriptionInput.value);
  body.append('status', `${(dataItem === null) ? 'null' : ((dataItem.status === 'true') ? 'true' : 'false')}`);
  body.append('created', 'null');

  sendRequest('post', 'http://localhost:7070?method=createTicket', body)
    .then(() => {
      dataItem = null;
      ticketWidget.renderTickets();
      nameInput.value = '';
      descriptionInput.value = '';
      ticketAdd.classList.remove('active');
      ticketForm.classList.remove('active');
    });
};
const ticketWidget = new TicketWidget(tickets, callbackShowPoPUp);

ticketWidget.renderTickets();
btn.addEventListener('click', callbackShowPoPUp);
