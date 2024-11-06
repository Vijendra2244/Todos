//  'use strict'
// // var name = "vijendra"
// // name= 'vijendra'   in strict mode it will throw error  it's  I thihnnk a silent error  ReferenceError: name is not defined

// let values = [false, 0, -0, "", null, undefined, NaN];

// values.forEach(value => {
//   if (!value) {
//     console.log(!value)
//     console.log(`${value} is falsy`);
//   }
// });

// let valuesTruthy = [true, 1, "hello", {}, [], 42, Infinity];

// valuesTruthy.forEach(value => {
//   if (value) {
//     console.log(value)
//     console.log(`${value} is truthy`); // This will log for all truthy values
//   }
// });

// console.log(typeof NaN) // always give thew result number
// console.log(isNaN("abc"))

// function thisTesting(){
//   console.log(this)
// }
// thisTesting()

// const thistest = ()=>{
//   console.log(this)
// }

// thistest()

// const person = {
//   name: "Vijendra",
//   greet() {
//     console.log(this.name); // 'this' refers to the person object
//   }
// };

// person.greet(); // Logs "Vijendra"

// const obj = {name:"vijendra"}

// const  {name:one } = obj
// console.log(one)

// const arr = ['vij','any','nope']

// const [first,second,third,fourth='wakar'] = arr
// console.log(first,second,third,fourth)

// function restParam(...numbers){
//   console.log(numbers,"rest parameter exAMPLES")
// }

// let a = 10
// let b = 20
// let c = 40

// restParam(a,b,c)

// const val = null

// const nullis = val ?? "nothing"

// console.log(nullis)

// console.log(0) // there is nothing different between 0 or  -0 is the same as well simple math

// console.log('Start');

// setTimeout(() => {
//   console.log('Timeout callback');
// }, 0);

// Promise.resolve().then(() => {
//   console.log('Promise callback');
// });

// console.log('End');

// console.log(typeof [1,2,3] === typeof {val: 'a', val: 'b', val: 'c'},"csvs")

// setTimeout(() => {
//   let i = 0;
//   while (i < 1000000000) {
//     i++;
//   }
//   console.log('Long loop done');
// }, 0);

// console.log('Hello');

// const myPromise = () => Promise.resolve('I have resolved!');
// function firstFunction() {
//   myPromise().then(res => console.log(res,"first promise"));
//   console.log('second');
// }
// async function secondFunction() {
//   console.log(await myPromise());
//   console.log('second');
// }
// firstFunction();
// secondFunction();

// const myPromise = Promise.resolve(Promise.resolve("Promise"));

// function funcOne() {
//   setTimeout(() => console.log("Timeout 1!"), 0);
//   myPromise.then((res) => res).then((res) => console.log(`${res} 1!`));
//   console.log("Last line 1!");
// }

// async function funcTwo() {
//   const res = await myPromise;
//   console.log(`${res} 2!`);
//   setTimeout(() => console.log("Timeout 2!"), 0);
//   console.log("Last line 2!");
// }

// funcOne();
// funcTwo();

// const fetchThecountry = () => {
//   fetch(`https://restcountries.com/v3.1/name/Bharat`)
//     .then((res) => res.json())
//     .then((data) => {
//       console.log(data, "datata");
//       const contryCode = data[0].borders[0];
//       return fetch(`https://restcountries.com/v3.1/alpha/${contryCode}`);
//     })
//     .then((data) => data.json())
//     .then((response) => {
//       console.log(response);
//       if (response.message === "Page Not Found") {
//         alert("something went wrong");
//       }
//     })
//     .catch((err) => console.log(err));
// };

// const nextCountry = (contryCode) => {
//   fetch(`https://restcountries.com/v3.1/alpha/${contryCode}`)
//     .then((res) => res.json())
//     .then((data) => console.log(data));
// };

// fetchThecountry();

// function closureEx() {
//   for (var i = 0; i < 6; i++) {
//     setTimeout(() => {
//       console.log(i);
//     }, i * 1000);
//   }
// }

// closureEx();

// console.log(this.window)
// window.console.log("Hello web apis")

// window.setTimeout(() => {
//   console.log("this is the help of window object");
// }, 1000);

// console.log("start");

// setTimeout(() => {
//   console.log("set time out");
// }, 5000);

// console.log("end");

// const startData = new Date().getTime();
// let endDate = startData;
// while (endDate < startData + 10000) {
//   endDate = new Date().getTime();
// }

// console.log("while expired");

// function a(){
//   console.log("a")
// }

// function b (x){
//   return x
// }

// b(a)()

// high order method simpal exmaples
// const arr = [5, 1, 3, 2, 6];

// const doubles = arr.map((item) => item * 2);
// console.log(doubles);
// const triple = arr.map((item) => item * 3);
// console.log(triple);
// const binary = arr.map((item) => item.toString(2));
// console.log(binary);
// const odd = arr.filter((item) => item % 2 == 1);
// console.log(odd);

// const reduceE = arr.reduce((acc, curr) => acc + curr, 0);
// console.log(reduceE);

// const users = [
//   { firstName: "vijendra", lastName: "chouhan", age: 24 },
//   { firstName: "gourav", lastName: "choudhary", age: 45 },
//   { firstName: "navin", lastName: "chouhan", age: 24 },
//   { firstName: "jay", lastName: "patel", age: 80 },
// ];

// const fullName = users.map((item) => {
//   const fullNameNew = `${item.firstName} ${item.lastName}`;
//   return fullNameNew;
// });
// console.log(fullName);

// const getAge = users.reduce((acc, curr) => {
//   if (acc[curr.age]) {
//     acc[curr.age] = ++acc[curr.age];
//   } else {
//     acc[curr.age] = 1;
//   }
//   return acc
// }, {});

// console.log(getAge);

// const ageFilter = users.filter((item)=>{
//   if(item.age < 30) {
//     return item
//   }
// }).map((name)=>name.firstName)

// console.log(ageFilter)

// const myPromise = Promise.resolve(Promise.resolve('Promise'));

// function funcOne() {
//   setTimeout(() => console.log('Timeout 1!'), 0);
//   myPromise.then(res => res).then(res => console.log(`${res} 1!`));
//   console.log('Last line 1!');
// }

// async function funcTwo() {
//   const res = await myPromise;
//   console.log(`${res} 2!`)
//   setTimeout(() => console.log('Timeout 2!'), 0);
//   console.log('Last line 2!');
// }

// funcOne();
// funcTwo();

// class Car{
//   constructor(brand,modal){
//     this.brand = brand
//     this.modal = modal
//   }

//   startEnging(){
//     return `this ${this.brand} and ${this.modal} engine has started`
//   }
// }

// const carModal = new Car("Kia","2015")
// console.log(carModal)
// console.log(carModal.startEnging())

// function Car(brand,modal){
//   this.brand = brand
//   this.modal = modal
// }

// Car.prototype.startEnging = function(){
//   return `this ${this.brand} ${this.modal} has started enging`
// }

// const newModal = new Car("Alto","2001")
// console.log(newModal)
// console.log(newModal.startEnging())

// const arr = [1, 2, 3, [4, [5, [6, 7]]]];

// function flattenArray(arr) {
//   return arr.reduce(
//     (acc, curr) =>
//       Array.isArray(curr) ? acc.concat(flattenArray(curr)) : acc.concat(curr),
//     []
//   );
// }
// console.log(flattenArray(arr))

// const obj = {
//   name: "Vijendra",
//   address: {
//     city: "Delhi",
//     state: {
//       name: "Delhi",
//       code: "DL",
//     },
//   },
//   hobbies: ["coding", "reading"],
// };

// function flattenObject(obj) {
//   let result = {};
//   for (let i in obj) {
//     if (typeof obj[i] === "object" && obj[i] !== null && !Array.isArray(obj)) {
//       const nested = flattenObject(obj[i]);

//       for (let nestedKey in nested) {
//         result[i + "." + nestedKey] = nested[nestedKey];
//       }
//     } else {
//       result[i] = obj[i];
//     }
//   }
//   return result;
// }

// console.log(flattenObject(obj));

// function secondNextedObj(obj,parent="",res={},d){
//   for(let key in obj){
//     let propName = parent ? parent + d + key  :  key
//     if(typeof obj[key] == 'object' && obj[key] !== null){
//       secondNextedObj(obj[key],propName,res,d)
//     }else{
//       res[propName] = obj[key]
//     }
//   }
//   return res
// }

// console.log(secondNextedObj(obj,"",{},".")

// function Animal (name){
//   this.name = name
// }

// Animal.prototype.walk = function(){
//   return `${this.name} is walking`
// }

// function Dog(name,barkk){
//   Animal.call(this,name)
//   this.barkk = barkk

// }
// Dog.prototype = Object.create(Animal.prototype)
// // Dog.prototype.constructor = Dog
// Dog.prototype.bark = function(){
//   return `${this.name} is ${this.barkk}`
// }

// const  NewPuppy = new Dog("Monty","Barking")

// console.log(NewPuppy)
// console.log(NewPuppy.bark())
// console.log(NewPuppy.walk())

// const animal = {
//   speak(){
//     return `${this.name} is  makes a sound`
//   }
// }

// const dog  = Object.create(animal)
// dog.bark = function(){
//   return `${this.name} is barking`
// }
// dog.name = "Puppy"
// console.log(dog.speak())
// console.log(dog.bark())

// class Animal{
//    constructor(name){
//     this.name = name
//    }
//    speak(){
//     return `${this.name} is makes a sound`
//    }
// }

// class Dog extends Animal{
//   constructor(name,bark){
//     super(name)
//     this.bark = bark
//   }
//   barking(){
//    return `${this.name} is barking ${this.bark}`
//   }
// }

// const Dogggy  = new Dog("Puppy","Barking")

// console.log(Dogggy)
// console.log(Dogggy.barking())
// console.log(Dogggy.speak())

// function flattenObject (obj,parent="",de="_",res={}){
//   for(let key in obj){
//     let propNamev  = parent ? parent + de + key : key
//     if (typeof obj[key] ==='object' &&  obj[key] !== null){
//        flattenObject(obj[key],propNamev,de,res)
//     }else {
//       res[propNamev] = obj[key]
//     }
//   }
//   return res
// }
// const flatObj1 = flattenObject({ a: 1, b: { x: 2, z: { m: 5 } }, c: 3 });
// const flatObj2 = flattenObject({ b: { y: 3 }, d: 6 });

// Merging two flattened objects
// const mergedObj = { ...flatObj1, ...flatObj2 };
// const mergedObj=Object.assign({}, flatObj1, flatObj2)

// console.log(mergedObj);

// function flattenArray(arr){
//   return arr.reduce((acc,curr)=> Array.isArray(curr) ? acc.concat(flattenArray(curr)) : acc.concat(curr),[] )
// }

// const arr = [1,2,[3,4,[5,6,[7,8]]]]

// console.log(flattenArray(arr))

// class encapsulation{
//   #count =  0
//   constructor(start){
//     this.#count = start
//   }

//   increament(){
//    this.#count += 1
//   }
//   decreament(){
//     this.#count -= 1
//    }
//    getValue(){
//     return this.#count
//    }
// }

// const counter = new encapsulation(0)
// counter.increament()
// counter.increament()
// counter.increament()
// counter.increament()
// counter.decreament()
// console.log(counter.getValue())

// class paymentProcess {
//   #amount = 0
//   constructor(value){
//     this.#amount += value
//   }
//   paymenProcess(){
//     console.log("Payment is processing")
//     this.confirmPayment()
//   }
//   confirmPayment(){
//     console.log('Payement is confirmed')
//   }
//   getAmoutn(){
//     console.log(this.#amount)
//   }
// }

// const PaymentGet = new paymentProcess(1000)
// PaymentGet.paymenProcess()
// PaymentGet.getAmoutn()

// class poly{
//   constructor(){}
//   speak(){
//     console.log("animal is make sounds")
//   }
// }
// class dog extends  poly {
//   constructor(){
//     super()
//   }
//   speak(){
//     console.log("Dog is barking")
//   }
// }

// const anim = new poly()
// anim.speak()
// const dogN = new dog()
// dogN.speak()

// function Animal(name){
//   this.name = name
// }

// Animal.prototype.speak = function(){
//   return `${this.name} is makes a sound`
// }

// function Lion(name,roar){
//    Animal.call(this,name)
//    this.roar = roar
// }

// Lion.prototype = Object.create(Animal.prototype)

// Lion.prototype.bark = function(){
//   return `${this.name} is ${this.roar}`
// }

// const lion = new Lion("Lion","Raoring")
// console.log(lion.speak())
// console.log(lion.bark())

// class bankProcess {
//   #transaction = [200, 330, 400, 500];
//   constructor(name, AC, amount) {
//     this.name = name;
//     this.AC = AC;
//     this.amount = amount;
//   }

//   widthrawl() {
//     return this.#transaction.reduce((acc, curr) => acc + curr, 0);
//   }
// }

// const newAccount = new bankProcess("vijendra", "12243", 10000);

// console.log(newAccount.widthrawl(330));

// class cal {
//   constructor(name, age, place) {
//     this.name = name;
//     this.age = age;
//     this.place = place;
//   }
//   getname() {
//     console.log(this.name);
//     return this;
//   }
//   getAge() {
//     console.log(this.age);
//     return this;
//   }
//   getPlace() {
//     console.log(this.place);
//     return this;
//   }
// }

// const userINfo = new cal("vijendra", 24, "Indore");
// userINfo.getname().getAge().getPlace();

// const mapp = new Map()

// mapp.set("name","vijendra")

// console.log(mapp.size)

// function a(){
//   let count = 10
//   function b(){
//     console.log(count)
//   }
//   return b
// }

// a()()

// function a(gretting){
//   console.log(`${gretting}, ${this.name}`)
// }

// const person = {
//   name:"wakar"
// }

// const bindMethod = a.bind(person,["Hello"])

// bindMethod()

// function a(x){
//   return function b(y){
//     return x * y
//   }
// }

// const val1 = a(5)
// const val2 = val1(5)
// console.log(val2)

// kiss ==> keep it simple stupid

// this keyword concept

// In the  non strict mode in js one phenomina which we called a 'this subtitution'
// so in this phenomina the this keyword value is replaced by global object(window) if this keyword is null or undefined

// console.log(this)

// function x(){
//   console.log(this)
// }

// x()

// const thisArr = ()=>{
//   console.log(this)
// }
// thisArr()

// const obj = {
//   a:20,
//   x:function(){
//     console.log(this.a)
//   }
// }
// obj.x() // this keyword is referring to the global object(window) in non strict mode and obj
// {
//   function addTwoNumber(a, b) {
//     console.log("first function", a + b);
//   }
//  addTwoNumber(3, 5)
// }
// {
//   function addTwoNumber(a, b) {
//     console.log("Second function", a + b);
//   }

//   addTwoNumber(5, 6);
// }
// const addTwoNumberFirst = function (a, b) {
//   console.log("First function:", a + b);
// };

// const addTwoNumberSecond = function (a, b) {
//   console.log("Second function:", a * b); // Different functionality
// };

// addTwoNumberFirst(3, 5);  // First function: 8
// addTwoNumberSecond(3, 5); // Second function: 15

// import { sumOfTwoNum } from "./index.js";

// const result = sumOfTwoNum(4,6)
// console.log(result)

// export function mul(x,y){
//     return x+y
//   }

// function deb(func, delay) {
//   let time;
//   return function () {
//     clearInterval(time);
//     setTimeout(() => func.apply(this, arguments), delay);
//   };
// }

// function x() {
//   console.log("x is an number");
// }

// const res = deb(x, 3000);
// console.log(res, "res");
// for (let i = 0; i < 6; i++) {
//   res();
// }

// let arr  = [1,2,3,4,5]
// const obj = {...arr}
// console.log(obj)

// const btn = document.getElementById("btn");

// // throttle function as of now

// function throttle(func, delay) {
//   let lastCall = 0;
//   return function (...arg) {
//     console.log(arg, "arg");
//     let now = new Date().getTime();
//     if (now - lastCall < delay) return;
//     lastCall = now;
//     return func(...arg);
//   };
// }

// function handleClick() {
//   console.log("button is clicked");
// }
// const throttleClick = throttle(handleClick, 2000);

// const object1 = {
//     a: 10,
//     b: 20,
//     c: function () {
//     console.log(this.a + this.b);
//     },
// };

//     const func = object1.c.bind(object1)
//     func(); // This will result in an error or unexpected behavior

// (function fnA(a) {
//   return (function fnB(b) {
//     console.log(a);
//   })(1);
// })(0);

// function func(params) {
//   console.log("clg1");
//   return function () {
//     console.log("clg2");
//     params();
//     return function () {
//       console.log("clg4");
//       return "clg5";
//     };
//   };
// }

// func(function () {
//   console.log("clg3");
// })()();

// var arr = [1, 2, 3, 4, 5];
// var newArr = arr.forEach(function (element) {
//   return element * 6;
// });
// console.log(newArr);

// var arr = [0, 0, 0, 0];
// console.log(
//   arr.filter(function (el) {
//     return el;
//   })
// );
// var num=10;
// var num = 20;
// console.log(num);

// let num1=20;
// // let num1=30;
// console.log(num1);

// var arr = [1, 2, 3, 4, 5];
// var newarr = [];

// for (var i = 0; i < arr.length; i++) {
// newarr.push(arr[i]);
// if (i === 1) {
// break;
// }
// }

// console.log(newarr);

// let count = 0;
// const data = {
//   a: [1, 2, 3],
//   b: [4, 5, 6],
//   c: [7, 8, 9],
// };

// function increment() {
//   const [arr1, arr2, arr3] = Object.values(data);
//  setInterval(() => {
//     console.log(arr1[count], arr2[count], arr3[count]);
//     count++;

//   }, 1000);
// }

// increment();

// let a = 1;
// function foo() {
//   console.log(a);
//   var a = 2;
//   function bar() {
//     console.log(a);
//     var a = 3;
//     console.log(a);
//   }
//   bar();
// }
// foo();
// console.log(a);

// let x = 0;
// function increment() {
//   let x = 0;
//   x++;
//   return function() {
//     x++;
//     console.log(x);
//   };
// }
// const inc = increment();
// inc();
// inc();

// console.log(x);

// if (true) {
// console.log(y);
// var x = 5;
// let y = 10;
// }

// console.log(x)
// function a (){
//     var x = 10
//     console.log(x)
// }

// a()

// const promise1 = Promise.resolve('First')
// const promise2 = Promise.resolve('Second')
// const promise3 = Promise.reject('Third')
// const promise4 = Promise.resolve('Fourth')

// const runPromises = async () => {
// const res1 = await Promise.all([promise1, promise2])
// const res2  = await Promise.all([promise3, promise4])
// return [res1, res2]
// }

// runPromises()
// .then(res => console.log(res))
// .catch(err => console.log(err))

// function compareMembers(person1, person2 = person) {
//   if (person1 !== person2) {
//     console.log("Not the same!");
//   } else {
//     console.log("They are the same!");
//   }
// }

// const person = { name: "Lydia" };

// compareMembers(person);

// const myPromise = () => Promise.resolve('I have resolved!');
// function firstFunction() {
//   myPromise().then(res => console.log(res+"first"));
//   console.log('first');
// }
// async function secondFunction() {
//   console.log(await myPromise());
//   console.log('second');
// }
// firstFunction();
// secondFunction();
// function giveLydiaPizza() {
//   return "Here is pizza!";
// }

// const giveLydiaChocolate = () =>
//   "Here's chocolate... now go hit the gym already.";

// console.log(giveLydiaPizza.prototype);
// console.log(giveLydiaChocolate.prototype);

// const box = { x: 10, y: 20 };

// Object.freeze(box);

// const shape = box;
// shape.x = 100;

// console.log(shape);

// async function getData() {
//   return await Promise.resolve("I made it!");
// }

// const data = getData();
// console.log(data);
// (() => {
//   let x = (y = 10);
// })();

// console.log(typeof x);
// console.log(typeof y);

// let c = { greeting: 'Hey!' };
// let d;

// d = c;
// c.greeting = 'Hello';
// console.log(d.greeting)

// function bark() {
// console.log('Woof!');
// }

// bark.animal = 'dog';

// console.log(bark.animal)

// class Chameleon {
//   static colorChange(newColor) {
//     this.newColor = newColor;
//     return this.newColor;
//   }

//   constructor({ newColor = "green" } = {}) {
//     this.newColor = newColor;
//   }
// }

// const freddie = new Chameleon({ newColor: "purple" });
// console.log(freddie.colorChange("orange"));
// function sayHi() {
//   console.log(name);
//   console.log(age);
//   var name = "Lydia";
//   let age = 21;
// }

// sayHi();
// let arr = [1,2,3]
// for (let i = 0; i < arr.length; i++) {
//   const x = arr[i];
//   setTimeout(function () {
//     console.log(x);
//   }, i * 1000);
// }

// function outer() {
//     function inner() {
//     console.log(x);
//     }
//     let x = 10;
//     inner();
//     console.log(x);
//     if (true) {
//     let x = 5;
//     console.log(x);
//     }
//     console.log(x);
//     }
//     outer();

// var obj1 = {
//   address: "Mumbai,India",
//   getAddress: function () {
//     console.log(this.address);
//   },
// };

// var getAddress = obj1.getAddress;
// var obj2 = { name: "akshay" };
// obj2.getAddress();

// let x = 5;

// function foo() {
//   console.log(x);
// }

// foo();

// let x = 10;

// function throttle(func, delay) {
//   let last;
//   return function (...arg) {
//     let now = new Date().getTime();
//     console.log(now);
//     if (now - last < delay) return;
//     last = now;
//     return func(...arg);
//   };
// }

// const throttling = throttle(handleClick, 2000);
// function handleClick() {
//   console.log("button is clicked");
// }

// function debounce(func,delay){
//   let timer;
//   return function(...arg){
//     clearTimeout(timer)
//     timer = setTimeout(()=>func(...arg),delay)
//   }
// }
// function handleClick() {
//   console.log("button is clicked");
// }

// const debounceNew = debounce(handleClick,500)
// document.getElementById("btn").addEventListener("click", debounceNew);

// this is the error propagation but it's wrong only need to work on that
// function anything() {
//   try {
//     throw new Error("This error handle in next");
//   } catch (error) {
//     console.log("error", error);

//   }
// }

// try {
//   const data = anything();
//   console.log(data);
// } catch (error) {
//   console.log(error, "error in the try catch block");
// }

// function add(a){
//   return function(b){
//     return a + b
//   }
// }

// const x = add(3)(5)
// console.log(x)

// const obj = {
//   name:"vijendra",
// }

// console.log(obj)

// console.log(x)

// const num= 40
// console.log(num.toUpperCase())

// function memoi(){
//   let store = {}
//   return function(num){
//     if (num in store){
//       console.log('value come from store',store[num])
//       return store[num]
//     }else {
//       let result = num + 2
//       console.log(result)
//       store[num] = result
//       console.log('value come from new',result)
//       return result
//     }
//   }
// }

// const m =memoi()
// console.log(m)
// const n  = m(4)
// const h  = m(4)

// function* a(){
//   yield 1
//   yield 2
//   yield 3
// }

//  const res = a()
//  console.log(res.next())
//  console.log(res.next())
//  console.log(res.next())

// const obj = new WeakMap()
// const obj1= {
//   name:"vije"
// }
// obj.set(obj1,"new")

// console.log(obj)

// (() => {
//   let x, y;
//   try {
//     throw new Error();
//   } catch (x) {
//     (x = 1), (y = 2);
//     console.log(x);
//   }
//   console.log(x);
//   console.log(y);
// })();

// let x = 0;
// function increment() {
//   let x = 0;
//   x++;
//   return function () {
//     x++;
//     console.log(x);
//   };
// }
// const inc = increment();
// inc();
// inc();

// var arr=[1,2,3,4,5];
// var newArr=arr.forEach(function(element){
// return element*6;
// })
// console.log(newArr);

// var arr = [0, 0, 0, 0];
// console.log(
// arr.filter(function (el) {
// return el;
// })
// );

// (() => {
//   let x = y = 10;
// })();

// console.log(typeof x);
// console.log(typeof y);
// const randomValue = 21;

// function getInfo() {
// console.log(typeof randomValue);
// const randomValue = 'Lydia Hallie';
// }

// getInfo();

// class Counter {
// #number = 10

// increment() {
// this.#number++
// }

// getNum() {
// return this.#number
// }
// }

// const counter = new Counter()
// counter.increment()

// // console.log(counter.#number)

// let x = 0;
// function increment() {
//   x++;
//   console.log(x);
//   if (x < 3) {
//     let x = 0;
//     increment();
//   }
// }
// increment();

// console.log(global)
// // console.log(this)

// console.log(globalThis)

// console.log(NaN === NaN);
// console.log([1, 2] + [3, 4]);
// console.log(10 + "10");
// console.log(10 - "10");
// console.log(1 < 2 < 3);
//  console.log(3 > 2 > 1);
//  console.log(0.1 + 0.2 === 0.3);
//  let number = 0;
// console.log(number++);
// console.log(++number);
// console.log(number);

// console.log('I want pizza'[0]);
// const sum = eval('10*10+5');
// console.log(sum)
// console.log(true || 1 || 0 || false && true && 1)
// let newList = [1, 2, 3].push(4);

// console.log(newList.push(5));

// const [x, ...y, z] = [1, 2, 3, 4];
// console.log(x, y, z);

// const numbers = new Set([1, 1, 2, 3, 4]);
// console.log(numbers);

// const browser = new Set("Firefox");
// console.log(browser);

// let arr = [1, 2, 3];
// let str = "1,2,3";

// console.log(arr === str);
// let arr = [1, 2, 3];
// let str = "1,2,3";

// console.log(arr == str);

// const USER = { age: 30 };
// USER.age = 25;
// console.log(USER.age);

// const { a: x = 10, b: y = 20 } = { a: 30 };

// console.log(x);
// console.log(y);

// async function func() {
//   return 10;
// }
// console.log(func());

// function sum(num1, num2 = num1) {
//   console.log(num1 + num2);
// }

// sum(10);
// let a = 3;
// let b = new Number(3);
// let c = 3;

// console.log(a == b);
// console.log(a === b);
// console.log(b === c);

// function sayHi() {
//   console.log(a);
//   console.log(b);
//   var a = 4;
//   let b = 21;
// }

// sayHi();
// function addToList(item, list) {
//     return list.push(item);
//   }

//   const result = addToList('apple', ['banana']);
//   console.log(result);
//   const set = new Set([1, 1, 2, 3, 4]);

// console.log(set);

// const colorConfig = {
//     red: true,
//     blue: false,
//     green: true,
//     black: true,
//     yellow: false,
//   };

//   const colors = ['pink', 'red', 'blue'];

//   console.log(colorConfig.colors[1]);

//   class Person {
//     constructor() {
//       this.name = 'Lydia';
//     }
//   }

//   Person = class AnotherPerson {
//     constructor() {
//       this.name = 'Sarah';
//     }
//   };

//   const member = new Person();
//   console.log(member.name);

//   let newList = [1, 2, 3].push(4);

// console.log(newList.push(5));
// console.log(process.env)

// console.log( 12 | 10 )
// console.log( 22 | 10 )
// // console.log(12 ^ 12)
// console.log(12 <<  2)

// if (12 & (11 == 0)) {
//   console.log(true);
// } else {
//   console.log(false);
// }
