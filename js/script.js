const toppingsToogle = () => {
  const toppingsButton = document.querySelector('.toppings__button');
  const toppingsList = document.querySelector('.toppings__list');

  toppingsButton.addEventListener('click', () => {
    if (!toppingsList.classList.contains('toppings__list_show')) {
      toppingsList.classList.add('toppings__list_show');
      toppingsButton.classList.add('toppings__button_active');
      toppingsList.style.maxHeight = toppingsList.scrollHeight + "px";
    } else {
      toppingsButton.classList.remove('toppings__button_active');
      toppingsList.style.maxHeight = 0;
      setTimeout(() => {
        toppingsList.classList.remove('toppings__list_show');
      }, 300);
    }
  });
};

const modalController = ({modal, btnOpen, btnClose, cbOpen = () => {}}) => {
  const modalBtnElems = document.querySelectorAll(btnOpen);
  const modalElem = document.querySelector(modal);
  modalElem.style.cssText = `
    display: flex;
    visibility: hidden;
    opacity: 0;
    transition: opacity 300ms ease-in-out;
  `;

  const closeModal = event => {
    const target = event.target;
    if (target === modalElem || target.closest(btnClose) || event.code === 'Escape') {
      modalElem.style.opacity = 0;
      setTimeout(() => {
        modalElem.style.visibility = 'hidden';
      }, 300);

      window.removeEventListener('keydown', closeModal);
    }
  };

  const openModal = (e) => {
    cbOpen(e.target);
    modalElem.style.visibility = 'visible';
    modalElem.style.opacity = 1;
    window.addEventListener('keydown', closeModal);
  };

  modalBtnElems.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  modalElem.addEventListener('click', closeModal);
};


const btnResetFiltr = document.createElement('button');
btnResetFiltr.classList.add("pizza__reset-toppings");
btnResetFiltr.textContent = "Сбросить фильтр";
btnResetFiltr.type = 'reset';
btnResetFiltr.setAttribute('form', 'toppings');


const getPizzas = async (toppings) => {
  showLoader();
  try {
    const response = await fetch(`https://actually-glib-pet.glitch.me/api/products${ toppings ? `?toppings=${toppings}` : ''}`);
    if (!response.ok) {
      throw new Error('Failed yo fetch pizza products');
    }
    return await response.json();
  } catch(error) {
    console.error(`Error fetching pizza products: $(error)`);
  }
};

const getToppings = async () => {
  showLoader();
  try {
    const response = await fetch("https://actually-glib-pet.glitch.me/api/toppings");
    if (!response.ok) {
      throw new Error('Failed yo fetch pizza products');
    }
    return await response.json();
  } catch(error) {
    console.error(`Error fetching pizza products: $(error)`);
  }
};

const createCard = (data) => {
  const card = document.createElement('article');
  card.classList.add('pizza__card');
  card.innerHTML = `
    <picture>
      <source srcset="${data.images[1]}" type="image/webp">
      <img class="card__img" src="${data.images[0]}" alt="${data.name.ru}">
    </picture>
    <div class="card__content">
      <h3 class="card__title">${data.name['ru'][0].toUpperCase()}${data.name['ru'].slice(1).toLowerCase()}</h3>
      <p class="card__info">
        <span class="card__price">${data.price['30cm']} ₽</span>
        <span>/</span>
        <span class="card__weight">30 см</span>
      </p>
      <button class="card__btn" data-id="${data.id}">Выбрать</button>
    </div>
  `;

  return card;
};

const renderPizzas = async (toppings) => {
  const pizzas = await getPizzas(toppings);
  const pizzaList = document.querySelector('.pizza__list');
  const pizzaTitle = document.querySelector('.pizza__title');

  pizzaList.textContent = '';

  if (pizzas.length > 0) {
    pizzaTitle.textContent = "Пицца";
    btnResetFiltr.remove();
    const items = pizzas.map((data) => {
      const item = document.createElement('li');
      item.classList.add('pizza__item');
      const card = createCard(data);
      item.append(card);
      return item;
    });

    pizzaList.append(...items);
    modalController({modal: '.modal-pizza', btnOpen: '.card__btn', btnClose: '.modal__close',
      cbOpen(btnOpen) {

      }});
  } else {
    pizzaTitle.textContent = "Такой пиццы у нас нет:(";
    pizzaTitle.after(btnResetFiltr);
  }
  hideLoader();
};

btnResetFiltr.addEventListener('click', () => {
  renderPizzas();
  document.querySelector('.toppings__reset').remove();
  renderToppings();
  document.querySelector('.toppings__form').reset();
});

const renderToppings = async () => {
  const { en: enToppings, ru: ruToppings } = await getToppings();
  const toppingsList = document.querySelector('.toppings__list');
  toppingsList.textContent = "";
  const items = enToppings.map((enName, i) => {
    const item = document.createElement('li');
    item.classList.add('toppings__item');
    item.innerHTML = `
    <input class="toppings__checkbox" type="checkbox" name="topping" id="${enName}" value="${enName}">
    <label class="toppings__label" for="${enName}">${ruToppings[i][0].toUpperCase()}${ruToppings[i].slice(1).toLowerCase()}</label>
    `;
    return item;
  });

  toppingsList.append(...items);

  const itemReset = document.createElement('li');
  itemReset.classList.add('toppings__item');
  const btnReset = document.createElement('button');
  btnReset.classList.add('toppings__reset');
  btnReset.textContent = "Сбросить";
  btnReset.type = "reset";
  itemReset.append(btnReset);

  const toppingsForm = document.querySelector('.toppings__form');
  toppingsForm.addEventListener('change', (event) => {
    const formData = new FormData(toppingsForm);

    const checkedToppings = [];
    for (const [name, value] of formData.entries()) {
      checkedToppings.push(value);
    };
    renderPizzas(checkedToppings);
    if (checkedToppings.length > 0) {
      toppingsList.append(itemReset);
    } else {
      itemReset.remove();
    }

    renderPizzas(checkedToppings);
  });

  btnReset.addEventListener('click', () => {
    itemReset.remove();
    toppingsForm.reset();
    renderPizzas();
  });
};

const loader = document.createElement('div');
loader.classList.add('loader');

const loaderSpinner = document.createElement('div');
loaderSpinner.classList.add('loader__spinner');

loader.append(loaderSpinner);

const showLoader = () => {
  document.body.append(loader);
}

const hideLoader = () => {
  loader.remove();
}

const init = () => {
  toppingsToogle();
  renderToppings();
  renderPizzas();
};

init();
