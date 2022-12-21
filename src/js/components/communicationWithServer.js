export default class CommunicationWithServer {
  getRequest(method, callback) {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          callback.renderTickets(data);
        } catch (e) {
          console.error(e);
        }
      }
    });

    xhr.open('get', `http://localhost:7070?method=${method}`);
    xhr.send();
  }

  postRequest(method, body) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (e) {
      if (xhr.readyState !== 4) {

      }
    };
    xhr.open('post', `http://localhost:7070?method=${method}`);
    console.log(body);
    xhr.send(body);
  }
}
