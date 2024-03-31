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
  hideLoader();
};

const getData = async (myPath) => {
  showLoader();
  try {
    const response = await fetch(myPath);
    if (!response.ok) {
      throw new Error('Failed yo fetch data');
    }
    hideLoader();
    return await response.json();
  } catch(error) {
    console.error(`Error fetching data: $(error)`);
  } finally {
    hideLoader();
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

const myCapitalize = (myStr) => {
  return myStr[0].toUpperCase() + myStr.slice(1).toLowerCase();
};

const createRadioInput = (id, name, value, className) => {
  const input = document.createElement('input');
  input.type = 'radio';
  input.classList.add(className);
  input.id = id;
  input.name = name;
  input.value = value;
  return input;
};

const createLabel = (forId, labelText, className) => {
  const label = document.createElement('label');
  label.classList.add(className);
  label.htmlFor = forId;
  label.textContent = labelText;
  return label;
};

const renderModalPizza = ({id, images, name, price, toppings}) => {
  const modalPizzaMain = document.querySelector('.modal-pizza__main');
  modalPizzaMain.textContent = '';
  let size = Object.keys(price)[0];
  const picture = document.createElement('picture');
  const source = document.createElement('source');
  source.srcset = images[1];
  source.type = 'image/webp';
  const img = document.createElement('img');
  img.classList.add('modal-pizza__img');
  img.src = images[0];
  img.alt = name.ru;
  picture.append(source, img);
  const title = document.createElement('h2');
  title.classList.add('modal-pizza__title');
  title.textContent = myCapitalize(name.ru);
  const toppingsElement = document.createElement('p');
  toppingsElement.classList.add('modal-pizza__toppings');
  toppingsElement.textContent = myCapitalize(toppings.ru);
  const priceSizeInfo = document.createElement('p');
  priceSizeInfo.classList.add('modal-pizza__info');
  const priceElement = document.createElement('span');
  priceElement.classList.add('modal-pizza__price');
  const slashElement = document.createElement('span');
  slashElement.textContent = '/';
  const sizeElement = document.createElement('span');
  sizeElement.classList.add('modal-pizza__size');
  const updatePrice = () => {
  const selectedSizeInput = form.querySelector('input[name="size"]:checked');
  size = selectedSizeInput.value;
  priceElement.textContent = `${price[size]} ₽`;
  sizeElement.textContent = `${parseInt(size)} см`;
  };
  priceSizeInfo.append(priceElement, slashElement, sizeElement);
  const form = document.createElement('form');
  form.id = id;
  form.classList.add('modal-pizza__form');
  const groupFieldset = document.createElement('div');
  groupFieldset.classList.add('modal-pizza__group-fieldset');
  const fieldsetCrust = document.createElement('fieldset');
  fieldsetCrust.classList.add('modal-pizza__fieldset');
  const thinkInput = createRadioInput('think', 'crust', 'think', 'modal-pizza__radio');
  const thinkLabel = createLabel('think', 'Пышное тесто', 'modal-pizza__label');
  const thinInput = createRadioInput('thin', 'crust', 'thin', 'modal-pizza__radio');
  thinInput.checked = true;
  const thinLabel = createLabel('thin', 'Тонкое тесто', 'modal-pizza__label');
  fieldsetCrust.append(thinkInput, thinkLabel, thinInput, thinLabel);
  const fieldsetSize = document.createElement('fieldset');
  fieldsetSize.classList.add('modal-pizza__fieldset');
  const sizeInputs = Object.keys(price).map(size => {
    szInput = createRadioInput(size, 'size', size, 'modal-pizza__radio');
    szInput.addEventListener('change', updatePrice);
    szLabel = createLabel(size, `${parseInt(size)} см`, 'modal-pizza__label');
    fieldsetSize.append(szInput, szLabel);
  });
  fieldsetSize.children[0].checked = true;
  groupFieldset.append(fieldsetCrust, fieldsetSize);
  const formBtn = document.createElement('button');
  formBtn.classList.add('modal-pizza__add-cart');
  formBtn.textContent = "В корзину";
  form.append(groupFieldset, formBtn);
  const closeBtn = document.createElement('button');
  closeBtn.classList.add('modal__close');
  closeBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14.8333" y="4" width="0.851136" height="15.3204" transform="rotate(45 14.8333 4)" fill="#C1AB91"/>
      <rect x="4" y="4.60184" width="0.851136" height="15.3204" transform="rotate(-45 4 4.60184)" fill="#C1AB91"/>
    </svg>
  `;

  modalPizzaMain.append(picture, title, toppingsElement, priceSizeInfo, form, closeBtn);

  updatePrice();

  timerId = -1;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const product = {
      cartID: crypto.randomUUID(),
      id,
      crust: formData.get('crust'),
      size: formData.get('size'),
    };
    cartControl.addCart(product);
    formBtn.disabled = true;
    formBtn.textContent = 'Добавлено';
    timerId = setTimeout(() => {
      formBtn.disabled = false;
      formBtn.textContent = 'В корзину';
    }, 2000);
  });

  form.addEventListener('change', () => {
    clearTimeout(timerId);
    formBtn.disabled = false;
    formBtn.textContent = 'В корзину';
  });
};

const cartControl = {
  cartData: JSON.parse(localStorage.getItem('cart') || '[]'),
  addCart(product) {
    this.cartData.push(product);
    localStorage.setItem('cart', JSON.stringify(this.cartData));
  },
  removeCart(cartID) {
    this.cartData = this.cartData.filter(item => item.cartID !== cartID);
    localStorage.setItem('cart', JSON.stringify(this.cartData));
  },
  clearCart() {
    this.cartData = [];
    localStorage.setItem('cart', JSON.stringify(this.cartData));
  },
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
      async cbOpen(btnOpen) {
        const pizzaModal = await getData(
          `https://actually-glib-pet.glitch.me/api/products/${btnOpen.dataset.id}`,
        );

        console.log(pizzaModal);
        renderModalPizza(pizzaModal);

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

const scrollController = {
  scrollPosition: 0,
  disabledScroll() {
    scrollController.scrollPosition = window.scrollY;
    document.body.style.cssText = `
      overflow: hidden;
      position: fixed;
      top: -${scrollController.scrollPosition}px;
      left: 0;
      height: 100vh;
      padding-right: ${window.innerWidth - document.body.offsetWidth}px;
    `;
    document.documentElement.style.scrollBehavior = 'unset';
  },
  enabledScroll() {
    document.body.style.cssText = '';
    window.scroll({top: scrollController.scrollPosition})
    document.documentElement.style.scrollBehavior = '';
  },
}

const renderCart = () => {
  const cartListElem = document.querySelector('.modal-cart__list');
  const cartPriceElem = document.querySelectorAll('.modal-cart__price');
  const prevBtn = document.querySelector('.modal-cart__prev');
  const nextBtn = document.querySelector('.modal-cart__continue');
  const submitBtn = document.querySelector('.modal-cart__send-order');
  const cartBlockElem = document.querySelector('.modal-cart__block');
  const cartDeliveryElem = document.querySelector('.modal-cart__delivery');
  const cartForm = document.querySelector('.modal-cart__form');
  const renderCartList = async () => {
    let totalPrice = 0;
    if (cartControl.cartData.length) {
      cartListElem.textContent = '';
      nextBtn.disabled = false;
      const cardsDataPromises = cartControl.cartData.map(async (item) => await getData(`https://actually-glib-pet.glitch.me/api/products/${item.id}`,),);
      const cardsData = await Promise.all(cardsDataPromises);
      const cardsCart = cardsData.map((data, i) => {
        const item = cartControl.cartData[i];
        const cardCart = document.createElement('li');
        cardCart.classList.add('modal-cart__item');
        cardCart.innerHTML = `
          <picture>
            <source srcset="${data.images[1]}" type="image/webp">
            <img class="modal-cart__img" src="${data.images[0]}" alt="${data.name.ru}" width="63" height="63">
          </picture>
          <div class="modal-cart__content">
            <h3 class="modal-cart__title-pizza">${myCapitalize(data.name.ru)}</h3>
            <p class="modal-cart__info-pizza">
              <span class="modal-cart__price-pizza">${data.price[item.size]} ₽</span>
              <span>/</span>
              <span class="modal-cart__weight-pizza">${parseInt(item.size)} см</span>
            </p>
          </div>
          <button class="modal-cart__delete-button" data-id="${item.cartID}">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.4549 4.01401C11.3985 4.00992 11.3805 4.01242 11.3579 3.99904L11.3522 3.43064C11.2979 3.41032 11.2015 3.42189 11.1407 3.42189L8.70136 3.42086V4.01348L7.73452 4.01392L7.73349 3.00582C7.73333 2.72455 7.65345 2.33685 8.03552 2.29858L11.7298 2.30315C12.0624 2.30324 12.3344 2.23977 12.3353 2.69883L12.3345 4.01423L11.4549 4.01401Z" fill="#C1AB91"/>
              <path d="M15.3507 16.174C15.2392 16.6674 14.9551 17.2592 14.3936 17.3414C14.2455 17.363 14.0776 17.3491 13.9275 17.3492L6.00015 17.3485C5.65702 17.3475 5.40171 17.3159 5.14284 17.0553C4.5339 16.4421 4.61993 15.4641 4.61956 14.6723L4.61746 6.06336C4.59609 6.03136 4.48624 6.05367 4.44859 6.05367L3.77281 6.05352C3.38871 6.05317 3.35065 6.03086 3.34968 5.60977C3.34937 5.46586 3.30965 5.12292 3.37262 5.00142L3.39212 4.96339C3.43021 4.89298 3.48177 4.85839 3.55674 4.8362L16.0585 4.83686C16.2029 4.83683 16.3554 4.82702 16.4991 4.83989C16.7356 4.86105 16.7032 5.09483 16.7041 5.24905L16.7068 5.78127C16.7066 6.08752 16.4049 6.05405 16.1876 6.0542L15.4515 6.05336C15.4305 6.06827 15.4378 6.29108 15.4377 6.32805L15.4364 15.1909C15.4362 15.5305 15.4155 15.8385 15.3507 16.174ZM12.5871 8.00598L12.5891 14.863L13.9216 14.8637L13.9259 8.00652L12.9954 8.00552C12.8661 8.00536 12.7147 7.98989 12.5871 8.00598ZM6.12246 8.00611L6.12071 14.8636L7.45806 14.8637L7.45331 8.00689L6.12246 8.00611ZM9.34309 8.00598L9.34699 14.6687C9.34709 14.7314 9.34087 14.8014 9.35162 14.8628L10.6999 14.8599L10.7015 8.01195C10.6744 7.99998 10.6332 8.00592 10.6035 8.00592L9.34309 8.00598Z" fill="#C1AB91"/>
              </svg>
          </button>
        `;
        totalPrice += data.price[item.size];
        return cardCart;
      });
      cartListElem.append(...cardsCart);
    } else {
      cartListElem.innerHTML = '<li>Корзина пуста...</li>';
      nextBtn.disabled = true;
    }
    cartPriceElem.forEach(elem => elem.textContent = `${totalPrice} ₽`);
  };
  renderCartList();

  cartListElem.addEventListener('click', (e) => {
    const deleteButton = e.target.closest('.modal-cart__delete-button');
    if (deleteButton) {
      const cartID = deleteButton.dataset.id;
      cartControl.removeCart(cartID);
      renderCartList();
    }
  });

  nextBtn.addEventListener('click', () => {
    cartBlockElem.style.display = 'none';
    cartDeliveryElem.style.display = 'block';
  });
  prevBtn.addEventListener('click', () => {
    cartBlockElem.style.display = 'block';
    cartDeliveryElem.style.display = 'none';
  });
  cartForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(cartForm);
    const data = Object.fromEntries(formData);
    data.pizzas = cartControl.cartData;
    try {
      const response = await fetch(`https://actually-glib-pet.glitch.me/api/orders/`, {
        method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error('Failed to submit order');
      }
      const order = await response.json();
      cartControl.clearCart();
      cartForm.innerHTML = `
      <h3>Заказ оформлен, номер заказа ${order.orderId}</h3>`;
      [nextBtn, prevBtn, submitBtn].forEach((btn) => btn.disabled = true);
    } catch(err) {
      console.error(`Error submitting order: ${err}`);
    }
  });
}

const init = () => {
  toppingsToogle();
  renderToppings();
  renderPizzas();
  modalController({modal: '.modal-cart', btnOpen: '.header__cart', btnClose: '.modal__close',
  cbOpen() {
      renderCart();
    }
  });
  modalController({modal: '.modal-cart', btnOpen: '.hero__order', btnClose: '.modal__close',
  cbOpen() {
      renderCart();
    }
  });
};

init();
