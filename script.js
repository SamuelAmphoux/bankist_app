'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-12-20T17:01:17.194Z',
    '2023-12-23T23:36:17.929Z',
    '2023-12-25T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

const accounts = [account1, account2];
let currentUser;
let sortingStatus = 0;

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

document.querySelectorAll('input').forEach(el => (el.value = ''));

const formatMovementDate = function (date) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  return new Intl.DateTimeFormat(currentUser.locale).format(date);
};

const bootDisplay = function (user) {
  labelWelcome.textContent = `Welcome back ${user.owner}`;
  const now = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  };
  labelDate.textContent = new Intl.DateTimeFormat(user.locale, options).format(
    now
  );
  displayMovements(user);
  displayBalance(user);
  displayInterest(user);
  containerApp.style.opacity = 1;
};

const disconnect = () => {
  containerApp.style.opacity = 0;
  labelWelcome.textContent = 'Log in to get started';
};

// This function will display every movement from the given account
const displayMovements = function (user) {
  containerMovements.innerHTML = '';

  let movementsArr = user.movements.map((value, i) => ({
    value,
    date: new Date(user.movementsDates[i]),
  }));
  if (sortingStatus === 1) {
    movementsArr.sort((a, b) => a.value - b.value);
  } else if (sortingStatus === 2) {
    movementsArr.sort((a, b) => b.value - a.value);
  }

  movementsArr.forEach((movement, i) => {
    const type = movement.value > 0 ? 'deposit' : 'withdrawal';
    const displayDate = formatMovementDate(new Date(movement.date));

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } : ${type} </div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${Number.parseFloat(
          movement.value
        ).toFixed(2)}€</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Takes multiple strings and return one string made of all first letters
const computeUsername = function (fullName) {
  return fullName
    .toLowerCase()
    .split(' ')
    .map(str => str.at(0))
    .join('');
};

// Takes an array of strings and creates a property with initials to corresponding object
const createUsernames = function (namesArr) {
  namesArr.forEach(account => {
    account.userName = computeUsername(account.owner);
  });
};
createUsernames(accounts);

// Add all deposits and withdrawals events to display balance
const displayBalance = function (user) {
  const total = user.movements.reduce(function (acc, cur) {
    return acc + cur;
  }, 0);
  user.balance = total;
  labelBalance.innerHTML = `${Number.parseFloat(total).toFixed(2)}€`;
};

// Takes all movements and calc ins outs and interests displayed at the bottom
const displayInterest = function (user) {
  const events = user.movements;
  const incomes = events
    .filter(event => event > 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumIn.innerHTML = `${Number.parseFloat(incomes).toFixed(2)}€`;

  const expenses = events
    .filter(event => event < 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumOut.innerHTML = `${Number.parseFloat(expenses).toFixed(2)}€`;

  const interest = events
    .filter(event => event > 0)
    .map(deposit => (deposit * user.interestRate) / 100)
    .reduce((acc, int) => (int >= 1 ? acc + int : acc), 0);
  labelSumInterest.innerHTML = `${Number.parseFloat(interest).toFixed(2)}€`;
};

// Login logic
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submiting/redirecting
  e.preventDefault();
  currentUser = accounts.find(acc => acc.userName === inputLoginUsername.value);

  if (currentUser?.pin === Number.parseInt(inputLoginPin.value)) {
    containerApp.style.opacity = 0;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    const booting = () => bootDisplay(currentUser);
    setTimeout(booting, labelBalance.innerHTML === '' ? 0 : 1000);
  } else {
    disconnect();
    alert('Wrong Username/Password combination.');
  }
});

// Allows logged in user to send money into another account
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  if (amount < 0 || receiverAcc === undefined)
    return alert('Transaction impossible');
  if (
    amount <= currentUser.balance &&
    receiverAcc?.owner !== currentUser.owner
  ) {
    currentUser.movements.push(-amount);
    currentUser.movementsDates.push(new Date().toISOString());
    receiverAcc.movements.push(amount);
    receiverAcc.movementsDates.push(new Date().toISOString());
    bootDisplay(currentUser);
    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur();
  }
});

// Allow user to request loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputLoanAmount.value;

  if (amount > 0 && currentUser.movements.some(mov => mov >= amount * 0.1)) {
    currentUser.movements.push(amount);
    currentUser.movementsDates.push(new Date().toISOString());
    bootDisplay(currentUser);
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
  }
});

// Allows the user to delete their account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentUser.userName &&
    +inputClosePin.value === currentUser.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentUser.userName
    );
    accounts.splice(index, 1);
    disconnect();
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

// Allows user to sort the movements of their account
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  // Increments sortingStatus by 1 and then takes the remainder when divided by 3, effectively cycling between 0, 1, and 2
  sortingStatus = (sortingStatus + 1) % 3;
  displayMovements(currentUser);
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

currentUser = account1;
bootDisplay(account1);
