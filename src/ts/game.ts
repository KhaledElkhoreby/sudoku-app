import { Modal } from 'bootstrap';

export const makeDivsFocusable = () => {
  const divs = document.querySelectorAll('#board div');
  for (let i = 0, len = divs.length; i < len; i++) {
    divs[i].setAttribute('tabindex', '0');
  }
};

export interface Level {
  easy: string;
  hard: string;
}

interface sudokuResponse {
  board: string;
  solution: string;
}

// todo fetch sudoku board and solution
const getSudoku = async (level: keyof Level): Promise<sudokuResponse> => {
  const response = await fetch(
    `https://sudoku-api.deta.dev/?type=${level === 'easy' ? 4 : 9}`
  );
  const data = (await response.json()) as sudokuResponse;
  return data;
};

export const generateChoices = (
  level: keyof Level,
  parentElement: HTMLElement,
  collection: string = 'football'
) => {
  parentElement.innerHTML = '';
  if (level === 'easy') {
    for (let index = 1; index <= 4; index++) {
      parentElement.innerHTML += `
      <div 
        class="img-4-4"         
        data-index="${index}">
          <img src="./images/${collection}/${index}.jpg" alt="">
          <div class="h3 mt-3 mb-1 text-center bg-danger rounded-pill">${index}</div>
      </div>`;
    }
  } else if (level === 'hard') {
    for (let index = 1; index <= 9; index++) {
      parentElement.innerHTML += `
      <div 
        class="img-9-9"        
        data-index="${index}">
          <img src="./images/${collection}/${index}.jpg" alt="">
          <div class="h3 mt-3 mb-1 text-center bg-danger rounded-pill">${index}</div>
      </div>`;
    }
  }
};

const imgDiv = (
  level: keyof Level,
  cell: string,
  index: number,
  solutionIndex: number,
  collection: string = 'football'
): string => {
  return `
    <div 
    class=${level === 'easy' ? 'img-4-4' : 'img-9-9'}        
    data-index="${++index}" data-solutionIndex="${solutionIndex}">
        ${
          cell !== '.'
            ? `<img src="./images/${collection}/${cell}.jpg" alt="">`
            : ``
        }
    </div>`;
  // }
};

export const generateImgDivs = async (
  level: keyof Level,
  parentElement: HTMLElement,
  collection: string = 'football'
) => {
  const { board, solution } = await getSudoku(level);
  console.log({ board });
  console.log({ solution });
  const solutionCells = solution.split('');
  const embtyCellsCount = board.split('').filter((el) => el === '.').length;
  console.log({ embtyCellsCount });
  parentElement.innerHTML = '';
  board.split('').forEach((cell, index) => {
    parentElement.innerHTML += imgDiv(
      level,
      cell,
      index,
      +solutionCells[index],
      collection
    );
  });

  return { embtyCellsCount };
};

export const startTimer = (
  timerContainer: HTMLElement,
  level: keyof Level,
  finishedContainer: HTMLElement,
  modal: Modal
): number => {
  const before = new Date();
  const allowedMinutes = level === 'easy' ? 2 : 1;
  const stopWhen = before.setMinutes(before.getMinutes() + allowedMinutes);
  let timerId = setInterval(() => {
    const now = new Date().getTime();

    // Find the distance between now and the stopWhen date
    const distance = stopWhen - now;
    console.log(distance);

    // Time calculatoins for minutes and seconds
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the timer container element
    if (distance > 0) timerContainer.innerHTML = `${minutes}m : ${seconds}s`;

    // If the count down is finished
    if (distance <= 0) {
      clearInterval(timerId);
      finishedContainer.innerHTML = `
        GAME OVER 😔
        </br>
        Do you want to play again?
        `;
      modal.show();
    }
  }, 1000);
  return timerId;
};

export const generateCollections = (
  constainerElemnet: HTMLElement,
  collections: string[]
) => {
  constainerElemnet.innerHTML = '';

  collections.forEach((collection) => {
    console.log({ collection });
    let images: string = '';
    for (let index = 1; index <= 4; index++) {
      images += `
      <div>
        <img src="./images/${collection}/${index}.jpg" alt="" class="w-100 h-100">
      </div>
      `;
    }

    constainerElemnet.innerHTML += `
    <div id="colection" class="d-flex flex-wrap">
      <button  type="button" class="selectCollectionBtn btn btn-lg btn-primary" value="${collection}">
        Select
      </button>
      ${images}      
    </div>
    `;
  });
};
