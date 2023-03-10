import sendRequest from './sendRequest';
import sheckMark from '../../img/checkmark.svg';
import edit from '../../img/edit.svg';

export default class TicketWidget {
  constructor(tickets, PopUpHandler) {
    this.tickets = tickets;
    this.PopUpHandler = PopUpHandler;
  }

  renderTickets() {
    this.tickets.innerHTML = '';
    sendRequest('get', 'http://localhost:7070?method=allTickets')
      .then((data) => {
        data.forEach((element) => {
          const ticket = this.createTicket(element);
          const btnCheckMark = ticket.querySelector('.item__status');
          const btnDelete = ticket.querySelector('.item__delete');
          const btnEdit = ticket.querySelector('.img__idit');
          btnCheckMark.addEventListener('click', this.callBackCheckMark);
          btnDelete.addEventListener('click', this.callbackDeleteTicket);
          btnEdit.addEventListener('click', this.PopUpHandler);
          ticket.addEventListener('click', this.callBackTicketClick);
          this.tickets.append(ticket);
        });
      });
  }

  createTicket(ticketData) {
    const ticketItem = document.createElement('div');
    ticketItem.classList.add('tickets__item');
    ticketItem.dataset.id = ticketData.id;
    ticketItem.innerHTML = `
        <button class="circle item__status">
        <img
                src="${sheckMark}" alt="checkmark"
                class="img__status" ${this.isHidden(ticketData.status)}></button>
        <div class="item__content"><span class="content_name">${ticketData.name}</span></div>
        <span class="item__date">${ticketData.created}</span>
        <button class="circle item__edit"><img
                src="${edit}" alt="edit"
                class="img__idit"></button>
        <button class="circle item__delete">X</button>
        `;
    return ticketItem;
  }

  isHidden(value) {
    if (value === 'true') {
      return;
    }
    return 'hidden';
  }

  callBackCheckMark(e) {
    e.preventDefault();
    e.stopPropagation();
    const img = e.currentTarget.querySelector('img');
    if (img.hidden) {
      img.hidden = false;
    } else {
      img.hidden = true;
    }
    sendRequest('get', `http://localhost:7070?method=ticketById&id=${e.currentTarget.parentNode.getAttribute('data-id')}`)
      .then((data) => {
        data.status = `${!img.hidden}`;
        const formData = new FormData();
        for (const key in data) {
          formData.append(key, data[key]);
        }
        sendRequest('POST', 'http://localhost:7070?method=updateTicket', formData);
      });
  }

  callbackDeleteTicket(e) {
    e.preventDefault();
    e.stopPropagation();
    const popUp = document.createElement('div');
    const parentNode = e.currentTarget.closest('.tickets__item');
    popUp.classList.add('ticket__add', 'active');
    popUp.innerHTML = `
            <div class="ticket__form active">
            <h3 class="ticket__title">?????????????? ??????????</h3>
            <div class="ticket__wrapper">
                <p class="ticket__input-description">???? ??????????????, ?????? ???????????? ?????????????? ??????????? ?????? ???????????????? ????????????????????.</p>
            </div>
            <div class="ticket__btns">
                <button class="btn btn__cansel">????????????</button>
                <button class="btn btn__add">????</button>
            </div>

            </div>`;
    const btnCansel = popUp.querySelector('.btn__cansel');
    const btnAdd = popUp.querySelector('.btn__add');
    btnCansel.addEventListener('click', (e) => {
      e.preventDefault();
      popUp.remove();
    });
    btnAdd.addEventListener('click', (e) => {
      e.preventDefault();
      sendRequest('DELETE', `http://localhost:7070?method=deleteTicket&id=${parentNode.getAttribute('data-id')}`)
        .then((data) => {
          if (data.status === true) {
            popUp.remove();
            parentNode.remove();
          }
        });
    });
    document.body.append(popUp);
  }

  callBackTicketClick(e) {
    e.preventDefault();
    let contentdescription = e.currentTarget.querySelector('.content__description');
    console.log(contentdescription);
    if (contentdescription === null) {
      console.log(e.currentTarget.getAttribute('data-id'));
      const itemContent = e.currentTarget.querySelector('.item__content');
      sendRequest('get', `http://localhost:7070?method=ticketById&id=${e.currentTarget.getAttribute('data-id')}`)
        .then((data) => {
          contentdescription = document.createElement('span');
          contentdescription.classList.add('content__description');
          contentdescription.textContent = data.description;
          itemContent.append(contentdescription);
        });
    } else {
      contentdescription.remove();
    }
  }
}
