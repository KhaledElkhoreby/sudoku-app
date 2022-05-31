import { Modal } from 'bootstrap';
import validation from './validation';
import {
  makeDivsFocusable,
  generateImgDivs,
  generateChoices,
  Level,
  startTimer,
  generateCollections,
} from './game';
validation;
window.addEventListener('load', () => {
  // Global Elements
  const userNameInput = document.querySelector(
    '#userNameInput'
  )! as HTMLInputElement;
  const levelInput = document.querySelector(
    '#levelInput'
  )! as HTMLSelectElement;

  const gallaryContainer = document.querySelector(
    '#gallaryContainer'
  )! as HTMLElement;

  const messageContainer = document.querySelector(
    '#messageContainer'
  )! as HTMLElement;
  const welcomeMessage = document.querySelector(
    '#welcomeMessage'
  )! as HTMLSpanElement;
  const yourLevelMessage = document.querySelector(
    '#yourLevelMessage'
  )! as HTMLSpanElement;

  const timerContainer = document.querySelector('#timer')! as HTMLSpanElement;
  const startTimerBtn = document.querySelector(
    '#startTimerBtn'
  )! as HTMLButtonElement;

  const choicesContainer = document.querySelector('#choices')! as HTMLElement;
  const gameContainer = document.querySelector(
    '#gameContainer'
  )! as HTMLElement;
  const board = document.querySelector('#board')! as HTMLElement;

  const restartBtn = document.querySelector(
    '#restartBtn'
  )! as HTMLButtonElement;

  let userName: string;
  let gameLevel: keyof Level;
  let embtyCellsCount: number;
  let timerId: number;
  let selectedCollection: string;
  const collections = ['football', 'billiard', 'flower', 'angryBirds'];

  // Todo Game Message Modal (Win)
  const gameMessageWin = document.querySelector(
    '#gameMessageWin'
  )! as HTMLElement;
  const gameMesssageWinBody = document.querySelector(
    '#gameMessageWin .modal-body'
  )! as HTMLDivElement;
  const gameMessageWinModal = new Modal(gameMessageWin);

  // Todo Game Message Modal (Lose)
  const gameMessageLose = document.querySelector(
    '#gameMessageLose'
  )! as HTMLElement;
  const gameMesssageLoseBody = document.querySelector(
    '#gameMessageLose .modal-body'
  )! as HTMLDivElement;
  const gameMessageLoseModal = new Modal(gameMessageLose);

  //! Helper Functions
  // Function for Start game
  const startGame = async () => {
    // Todo Show user infomation
    gameContainer.classList.remove('d-none');

    // Todo generate choices
    generateChoices(gameLevel, choicesContainer, selectedCollection);

    // Todo generate divs of images
    ({ embtyCellsCount } = await generateImgDivs(
      gameLevel,
      board,
      selectedCollection
    ));

    // Todo make divs focus
    makeDivsFocusable();

    // Todo focus on first div in board
    (board.children[0] as HTMLInputElement).focus();
  };

  // Funtion for change focus on certain element
  const changeFocusOnElement = (element: HTMLElement) => {
    (element as HTMLInputElement).focus();
  };

  // Function to get clone of selected img
  const getSelectChoiseImage = (index: number | string): HTMLImageElement => {
    const imageClone = (
      choicesContainer.querySelector(
        `div[data-index='${index}'] img`
      )! as HTMLImageElement
    ).cloneNode(true) as HTMLImageElement;
    return imageClone;
  };

  // Function to start and restart game
  const startOrRestart = async () => {
    clearInterval(timerId);
    await startGame();
    timerId = startTimer(
      timerContainer,
      gameLevel,
      gameMesssageLoseBody,
      gameMessageLoseModal
    );
  };
  // Todo Generate Gallary of collections
  generateCollections(gallaryContainer, collections);
  const selectCollectionBtn = document.querySelectorAll<HTMLButtonElement>(
    '.selectCollectionBtn'
  )!;
  [...selectCollectionBtn].forEach((btn) =>
    btn.addEventListener('click', function () {
      selectedCollection = this.value;
      console.log(selectedCollection);
      gallaryContainer.classList.add('d-none');
      messageContainer.classList.remove('d-none');
    })
  );

  // Todo Start Timer event handler
  startTimerBtn.addEventListener(
    'click',
    async function () {
      clearInterval(timerId);
      this.classList.add('disabled');
      await startOrRestart();
    },
    { once: true }
  );

  // Todo Restart Game event handler
  restartBtn.addEventListener('click', startOrRestart);

  // Todo Open Modal on window load
  const formModal = document.querySelector('#formModal')! as HTMLElement;
  const formModalInstance = new Modal(formModal);
  formModalInstance.show();

  // Todo submit handler
  formModal.addEventListener('submit', (event: Event) => {
    event.preventDefault();
    userName = userNameInput.value;
    gameLevel = levelInput.value as keyof Level;
    formModalInstance.hide();
    gallaryContainer.classList.remove('d-none');
    welcomeMessage.innerText = `Welcome ${userName}`;
    yourLevelMessage.innerText = `Game Level ${gameLevel.toUpperCase()}`;
  });

  // Todo handle arrow keys event for traverse focus on elements
  board.addEventListener('keydown', function (event: KeyboardEvent) {
    const currentActive = document.activeElement! as HTMLElement;
    const countElementsInRow = gameLevel === 'easy' ? 4 : 9;
    const totalCountElementsInBoard = Math.pow(countElementsInRow, 2);

    switch (event.key) {
      case 'ArrowUp':
        {
          const currentIndex = currentActive.dataset.index!;
          const nextIndex = +currentIndex - countElementsInRow;

          // on underflow will break
          if (nextIndex <= 0) break;

          const nextFocusElement = board.querySelector(
            `div[data-index='${nextIndex}']`
          )! as HTMLElement;
          changeFocusOnElement(nextFocusElement);
        }
        break;

      case 'ArrowRight':
        (currentActive.nextElementSibling as HTMLElement)?.focus();
        break;

      case 'ArrowDown':
        {
          const currentIndex = currentActive.dataset.index!;
          const nextIndex = +currentIndex + countElementsInRow;

          // on overflow will break
          if (nextIndex > totalCountElementsInBoard) break;

          const nextFocusElement = board.querySelector(
            `div[data-index='${nextIndex}']`
          )! as HTMLElement;
          changeFocusOnElement(nextFocusElement);
        }
        break;

      case 'ArrowLeft':
        (currentActive.previousElementSibling as HTMLElement)?.focus();
        break;
      default:
        // Check if keys is number and its value in the range
        if (
          !isNaN(+event.key) &&
          0 < +event.key &&
          +event.key <= countElementsInRow
        ) {
          const solutionIndex = currentActive.dataset.solutionindex;
          const choiseImage = getSelectChoiseImage(event.key);
          if (
            currentActive.childElementCount == 0 ||
            currentActive.classList.contains('wrong')
          ) {
            if (event.key === solutionIndex) {
              --embtyCellsCount;
              currentActive.classList.remove('wrong');
              currentActive.classList.add('correct');
              currentActive.replaceChildren(choiseImage);
            } else {
              currentActive.classList.add('wrong');
              currentActive.replaceChildren(choiseImage);
            }
          }
        }

        // Todo Show Win Message if embtyCellsCount === 0
        if (embtyCellsCount === 0) {
          clearInterval(timerId);
          gameMesssageWinBody.innerHTML = `
              🎉Congratulations ${userName}🎉
              <br>
              🥇Winner🥳`;
          gameMessageWinModal.show();
        }
    }
  });
});
