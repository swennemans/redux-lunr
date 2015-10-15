import lunr from 'lunr';

onmessage = function(event) {

  const {options: {index}, _toIndex} = JSON.parse(event.data);

  /* Dynamically create lunr.js index */
  let idx = lunr(function() {
    Object.keys(index).forEach((key) => {
      if (key === 'ref') {
        console.log('key is', index[key]);
        this.ref(index[key])
      } else {
        this.field(key, index[key])
      }
    })
  });

  /* index passed docs */
  _toIndex.forEach(function(doc) {
    idx.add(doc)
  });

  /* Return created index */
  self.postMessage(JSON.stringify(idx.toJSON()))
};