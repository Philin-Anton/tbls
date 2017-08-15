function findValue( obj, key ){
    const value = eval(`obj.${key}`);
    return obj && value || null;
}

function comparator(a, b, key, flag) {
  b = findValue(b, key);
  a = findValue(a, key);

  if (typeof a === 'number' && ( typeof b === 'undefined' || typeof b === 'number')) {
    return flag ? b > a : a < b;
  }

  if (typeof a === 'boolean' && ( typeof b === 'undefined' || typeof b === 'boolean')) {
    return flag ? b > a : a < b;
  }

  const ax = [];
  const bx = [];

  if (Array.isArray(a)) {
    if (!(a && a[0]) || !(b && b[0])) {
      return flag ? b.length - a.length : a.length - b.length;
    }
    if (typeof a[0] === 'number' || typeof b[0] === 'number') {
      return flag ? b.length - a.length : a.length - b.length;
    }
    if (typeof a[0] === 'object' || typeof b[0] === 'object') {
      return flag ? b.length - a.length : a.length - b.length;
    }
    if (typeof a === 'string' && typeof b === 'string') {
      a[0].replace(/(\d+)|(\D+)/g, (_, $1, $2) => {
        ax.push([$1 || Infinity, $2 || '']);
      });
      b[0].replace(/(\d+)|(\D+)/g, (_, $1, $2) => {
        bx.push([$1 || Infinity, $2 || '']);
      });
    }
  }

  if (typeof a === 'string' && typeof b === 'string') {
    if (new Date(a).isValid() && new Date(b).isValid()) {
        let aT, bT;
        aT = new Date().valueOf();
        bT = new Date().valueOf();
        return flag ? aT - bT : bT - aT;
    }
    a.replace(/(\d+)|(\D+)/g, (_, $1, $2) => {
      ax.push([$1 || Infinity, $2 || '']);
    });
    b.replace(/(\d+)|(\D+)/g, (_, $1, $2) => {
      bx.push([$1 || Infinity, $2 || '']);
    });
  }

  while (ax.length && bx.length) {
    const an = ax.shift();
    const bn = bx.shift();
    const nn = an[0] - bn[0] || an[1].localeCompare(bn[1]);
    if (nn) return nn;
  }

  return ax.length - bx.length;
}

export default comparator