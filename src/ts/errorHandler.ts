import { Modal } from 'bootstrap';

const errorModalELement = document.querySelector('#errorModal')! as HTMLElement;
const modalBody = errorModalELement.querySelector(
  '.modal-body'
)! as HTMLElement;
const reloadBtn = errorModalELement.querySelector(
  '.modal-footer button'
)! as HTMLButtonElement;
const errorModalInstance = new Modal(errorModalELement) as Modal;

reloadBtn.addEventListener('click', () => {
  window.location.reload();
});

const showErrorModalWithMessage = (message: string) => {
  modalBody.innerText = message;
  errorModalInstance.show();
};

export default showErrorModalWithMessage;
