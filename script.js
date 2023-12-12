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
displayMovements(account1.movements);

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
  return events.reduce(function (acc, cur) {
    return acc + cur;
  }, 0);
};
labelBalance.innerHTML = displayBalance(account1.movements);

const displayInterest = function (events) {
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
    .map(deposit => (deposit * 1.2) / 100)
    .reduce((acc, int) => (int >= 1 ? acc + int : acc), 0);
  labelSumInterest.innerHTML = `${interest}€`;
};
displayInterest(account1.movements);

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
