'use strict';

// Implement the selectLastEvenNumber function that takes an array and callback,
// it should call the callback immediately with the last even number on the array


function printNumber(num) {
  console.log(num);
}

selectLastEvenNumber([2, 5, 7, 8, 9, 11], printNumber); // should print 8

function selectLastEvenNumber(array, printFunction) {
  array = array.reverse();
  array.some(function(value) {
    if (value % 2 === 0) {
      console.log(value);
      return true;
    }
  })
}