'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
let currentUser;

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

// This function will display every movement from the given account
const displayMovements = function (movements) {
  containerMovements.innerHTML = '';

  movements.forEach((value, i) => {
    const type = value > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } : ${type} </div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${value}€</div>
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
const displayBalance = function (events) {
  const total = events.reduce(function (acc, cur) {
    return acc + cur;
  }, 0);
  currentUser.balance = total;
  labelBalance.innerHTML = `${total}€`;
};

// Takes all movements and calc ins outs and interests displayed at the bottom
const displayInterest = function (user) {
  const events = user.movements;
  const incomes = events
    .filter(event => event > 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumIn.innerHTML = `${incomes}€`;

  const expenses = events
    .filter(event => event < 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumOut.innerHTML = `${expenses}€`;

  const interest = events
    .filter(event => event > 0)
    .map(deposit => (deposit * user.interestRate) / 100)
    .reduce((acc, int) => (int >= 1 ? acc + int : acc), 0);
  labelSumInterest.innerHTML = `${interest}€`;
};

// Login logic
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submiting/redirecting
  e.preventDefault();
  currentUser = accounts.find(acc => acc.userName === inputLoginUsername.value);

  if (currentUser?.pin === parseInt(inputLoginPin.value)) {
    containerApp.style.opacity = 0;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    const booting = () => bootDisplay(currentUser);
    setTimeout(booting, labelBalance.innerHTML === '' ? 0 : 1000);
  } else {
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
    alert('Wrong Username/Password combination.');
  }
});

// Allows logged in user to send money into another account
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  if (amount < 0 || receiverAcc === undefined)
    return alert('Transaction impossible');
  console.log(receiverAcc?.owner !== currentUser.owner);
  if (
    amount <= currentUser.balance &&
    receiverAcc?.owner !== currentUser.owner
  ) {
    currentUser.movements.push(-amount);
    receiverAcc.movements.push(amount);
    bootDisplay(currentUser);
    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur();
  }
});

const bootDisplay = function (user) {
  labelWelcome.textContent = `Welcome back ${user.owner}`;
  displayMovements(user.movements);
  displayBalance(user.movements);
  displayInterest(user);
  containerApp.style.opacity = 1;
};
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
