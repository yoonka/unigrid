/*
Copyright (c) 2018, Grzegorz Junka
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

// *** Data iterators ***

export const isIterable = (obj) => {
  // checks for null and undefined
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
}

export const getIterator = (pData, pSelect) => {
  function addIterable(obj) {
    return {[Symbol.iterator]: () => obj};
  }

  function makeAllIterator(data) {
    let nextIndex = 0;
    const obj = {
      next: function() {
        return nextIndex < data.length ?
          {value: data[nextIndex++], done: false} : {done: true};
      }
    }
    return addIterable(obj);
  }

  function mkIterator(data, how, test) {
    const nTest = test || function() {return true;};
    let delivered = false;
    const obj = {
      next: function() {
        if (!delivered && nTest(data)) {
          delivered = true;
          return {value: how(data), done: false};
        }
        return {done: true};
      }
    }
    return addIterable(obj);
  }

  function makeFirstIterator(data) {
    return mkIterator(data, (d) => d[Symbol.iterator]().next().value);
  }

  function makeIteratorForItem(item) {
    return mkIterator(item, (i) => i);
  }

  function makeNumberIterator(data, select) {
    const test = (d) => select >=0 && select < d.length;
    return mkIterator(data, (d) => d[select], test);
  }

  function makeStringIterator(data, select) {
    if (select === 'all') {
      if (isIterable(data)) {
        return data;
      } else {
        return makeAllIterator(data);
      }
    } else if (select === 'first') {
      if (isIterable(data)) {
        return makeFirstIterator(data);
      } else {
        return makeIteratorForItem(data);
      }
    }
  }

  switch (typeof(pSelect)) {
  case 'number': return makeNumberIterator(pData, pSelect);
  case 'string': return makeStringIterator(pData, pSelect);
  }
  return undefined;
};
