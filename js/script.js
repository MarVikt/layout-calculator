const title = document.getElementsByTagName('h1')[0];
const buttonPlus = document.querySelector('.screen-btn');
const otherItems = document.querySelectorAll('.other-items');
const rollback = document.querySelector('.rollback input[type="range"]');
const rangeValue = document.querySelector('.rollback span.range-value');
const buttonCalculate = document.getElementById('start');
const buttonReset = document.getElementById('reset');
const fullAmount = document.getElementById('total');
const countScreens = document.getElementById('total-count');
const servicesAmount = document.getElementById('total-count-other');
const totalAmount = document.getElementById('total-full-count');
const amountWithRollback = document.getElementById('total-count-rollback');
let screens = document.querySelectorAll('.screen');

const askData = {
  screens: [], 
  services: {}, 
  rollback: 0,
  allServicePrices: 0, 
  fullPrice: 0, 
  count: 0,

  addScreenBlock: function () {
    let newScreen = screens[0].cloneNode(true);
    newScreen.querySelector('input').value = '';
    screens[screens.length - 1].after(newScreen);
    screens = document.querySelectorAll('.screen');
  },

  addScreens: function () {
    let screensRight = true;
    this.screens.length = 0;
    this.count = 0;
    screens.forEach((elem,index) => {
      let select = elem.querySelector('select');
      let numScreens = +elem.querySelector('input').value;
      if (select.selectedIndex != 0) {
        if (!(isNaN(parseInt(numScreens))) && isFinite(numScreens) && numScreens > 0) {
          this.screens.push({
            id: index,
            name: select.options[select.selectedIndex].textContent,
            amount: +numScreens * +select.value
          });
          this.count += numScreens;
        } else {
          alert('Не заполнено количество экранов');
          screensRight = false;
        }
      } else {
        alert('Не заполнен тип экранов');
        screensRight = false;
      }
    });
    return screensRight;
  },

  addServices: function () {
    this.services = {};
    otherItems.forEach((elem, index) => {
      let check = elem.querySelector('input[type=checkbox]');
      let label = elem.querySelector('label');
      let sum = elem.querySelector('input[type=text]');
      if (check.checked) {
        if (label.textContent.includes('%')) {
          this.services[label.textContent] = this.fullPrice * +sum.value / 100;
        } else {
          this.services[label.textContent] = +sum.value;
        }
      }
    });
  },

  addRollback: function (event) {
    askData.rollback = event.target.value;
    rangeValue.textContent = event.target.value + '%';
  },

  calculate: function () {
    if (askData.addScreens()) {
      askData.fullPrice = 0;
      askData.fullPrice = askData.screens.reduce((sum,item) => {
        return sum + item.amount;
      },0);
  
      fullAmount.value = askData.fullPrice;
      countScreens.value = askData.count;
  
      askData.addServices();
      askData.allServicePrices = 0;
      for (let key in askData.services) {
        askData.allServicePrices += askData.services[key];
      } 
  
      servicesAmount.value = askData.allServicePrices;
      totalAmount.value = askData.fullPrice + askData.allServicePrices;
      amountWithRollback.value = Math.round((askData.fullPrice + askData.allServicePrices) * (1 - askData.rollback / 100));

      // заблокируем все поля ввода
      askData.disabledOn();

      // заменим кнопку Рассчитать на кнопку Сброс
      buttonCalculate.style.display = 'none';
      buttonReset.style.display = 'block';
      buttonReset.addEventListener('click',askData.reset);

    }
  },

  reset: function () {
    // обнулим все переменные и поля ввода
    askData.screens = [];
    askData.services = {};
    askData.rollback = 0;
    askData.allServicePrices = 0;
    askData.fullPrice = 0;
    askData.count = 0;

    askData.addScreenBlock();
    for (let i = 0; i < screens.length - 1; i++) {
      screens[i].remove();
    }
    screens = document.querySelectorAll('.screen');

    otherItems.forEach((elem) => {
      elem.querySelector('input[type=checkbox]').checked = false;
    });

    document.querySelector('.cms input[type=checkbox]').checked = false;

    rollback.value = 0;
    rangeValue.textContent = '0%';

    fullAmount.value = 0;
    countScreens.value = 0;
    servicesAmount.value = 0;
    totalAmount.value = 0;
    amountWithRollback.value = 0;

    // разблокируем все поля ввода
    askData.disabledOff();

    // заменим кнопку Сброс на кнопку Рассчитать
    buttonReset.style.display = 'none';
    buttonCalculate.style.display = 'block';
    buttonCalculate.addEventListener('click',askData.calculate);
  },

  disabledOn: function () {
    document.querySelectorAll('select[name="views-select"]').forEach((event) => {
      event.disabled = true;
    });

    screens.forEach((elem) => {
      elem.querySelector('input').disabled = true;
    });

    buttonPlus.disabled = true;

    otherItems.forEach((elem) => {
      elem.querySelector('input[type=checkbox]').disabled = true;
    });

    document.querySelector('.cms input[type=checkbox]').disabled = true;

    rollback.disabled = true;
  },

  disabledOff: function () {
    document.querySelectorAll('select[name="views-select"]').forEach((event) => {
      event.disabled = false;
    });

    screens.forEach((elem) => {
      elem.querySelector('input').disabled = false;
    });

    buttonPlus.disabled = false;

    otherItems.forEach((elem) => {
      elem.querySelector('input[type=checkbox]').disabled = false;
    });

    document.querySelector('.cms input[type=checkbox]').disabled = false;

    rollback.disabled = false;
  },

  start: function () {
    document.title = title.textContent;

    buttonPlus.addEventListener('click',this.addScreenBlock);
    rollback.addEventListener('input',this.addRollback);
    rollback.addEventListener('change',this.addRollback);

    buttonCalculate.addEventListener('click',this.calculate);
  }

};

askData.start();
