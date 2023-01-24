
//sol1
const stringSort = (str) => {
    const results = {};

    str.split(' ').forEach(word => results[word] = [...word].reduce((prev, next) => isNaN(parseInt(next)) ? prev : prev + Number(next), 0));

    return Object.keys(results).sort((a, b) => results[a] - results[b]).join(' ');
  }

  ///sol2

  const queueTime = (arr, number) => {
    let total = 0;

    while (arr.length > 0) {
      const queue = arr.slice(0, number);
      const min = Math.min.apply(null, queue);
      total += min;
      queue.map((el, index) => {
        if (el === min) {
          arr[index] = 0;
        } else {
          arr[index] = el - min;
        }
      })
      arr = arr.filter(el => el !== 0);
    }

    return total;
  };

  //sol3

  const indexes = (arr, number) => arr.map(el => {
    if (el < number) {
      return arr.indexOf(el);
    }

    return Infinity;
  });

  const nextBigger = (n) => {
    let array = [...n.toString()].reverse();
    let results = {};

    if (!array.length) return;

    for (const index in array) {
      results = {
        ...results, [index]: {
          [Math.min.apply(null, indexes(array, array[index]))]: array.indexOf(array[index])
        }
      };
    }

    const minimumDif = Object.values(results).map(el => Object.entries(el).reduce((prev, next) => Number(next[0]) + Number(next[1]) + prev, 0));
    const indexesToChange = Object.entries(Object.values(results)[numberToChangeKey.indexOf(Math.min.apply(null, minimumDif))]);

    const copy = [...array];
    const swapFrom = indexesToChange[0][0];
    const swapTo = indexesToChange[0][1]
    copy[swapFrom] = array[swapTo]
    copy[swapTo] = array[swapFrom];
    const numberToReturn = Number(copy.reverse().join(''));
    return numberToReturn;
  }
