const title = document.getElementsByTagName('h1')[0];
// const buttons = document.getElementsByClassName('handler_btn');
const buttonPlus = document.querySelector('.screen-btn');
const otherItems = document.querySelectorAll('.other-items');
// const otherPercent = document.querySelectorAll('.other-items.percent');
// const otherNumber = document.querySelectorAll('.other-items.number');
const rollback = document.querySelector('.rollback input[type="range"]');
const rangeValue = document.querySelector('.rollback span.range-value');
// const totalInputs = document.getElementsByClassName('total-input');
const buttonCalculate = document.getElementById('start');
const fullAmount = document.getElementById('total');
const countScreens = document.getElementById('total-count');
const servicesAmount = document.getElementById('total-count-other');
const totalAmount = document.getElementById('total-full-count');
const amountWithRollback = document.getElementById('total-count-rollback');
let screens = document.querySelectorAll('.screen');

const askData = {
  title: '',
  screens: [], 
  services: {}, 
  rollback: 0,
  allServicePrices: 0, 
  fullPrice: 0, 
  count: 0,

  getTitle: function (str) {
    str = str.trim().toLowerCase();
    return str[0].toUpperCase() + str.substring(1);
  },

  addScreenBlock: function () {
    let newScreen = screens[0].cloneNode(true);
    newScreen.querySelector('input').value = '';
    screens[screens.length - 1].after(newScreen);
    screens = document.querySelectorAll('.screen');
  },

  addScreens: function () {
    askData.screens.length = 0;
    askData.count = 0;
    screens.forEach(function (elem,index) {
      let select = elem.querySelector('select');
      let numScreens = +elem.querySelector('input').value;
      if (select.selectedIndex != 0) {
        if (!(isNaN(parseInt(numScreens))) && isFinite(numScreens) && numScreens > 0) {
          askData.screens.push({
            id: index,
            name: select.options[select.selectedIndex].textContent,
            amount: +numScreens * +select.value
          });
          askData.count += numScreens;
        } else {
          alert('Не заполнено количество экранов');
        }
      } else {
        alert('Не заполнен тип экранов');
      }
    });
  },

  addServices: function () {
    askData.services = {};
    otherItems.forEach(function (elem, index) {
      let check = elem.querySelector('input[type=checkbox]');
      let label = elem.querySelector('label');
      let sum = elem.querySelector('input[type=text]');
      if (check.checked) {
        if (label.textContent.includes('%')) {
          askData.services[label.textContent] = +fullAmount.value * +sum.value / 100;
        } else {
          askData.services[label.textContent] = +sum.value;
        }
      }
    });
  },

  addRollback: function (event) {
    askData.rollback = event.target.value;
    rangeValue.textContent = event.target.value;
  },

  calculate: function () {
    askData.addScreens();
    askData.fullPrice = 0;
    askData.fullPrice = askData.screens.reduce(function(sum,item) {
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

    // console.log(askData);

  },

  start: function () {
    askData.title = askData.getTitle(title.textContent);

    buttonPlus.addEventListener('click',askData.addScreenBlock);
    rollback.addEventListener('input',askData.addRollback);
    rollback.addEventListener('change',askData.addRollback);

    buttonCalculate.addEventListener('click',askData.calculate);
  }

};

askData.start();
