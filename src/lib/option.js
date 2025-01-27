const None = () => ({
  isNone: () => true,
  isSome: () => false,
  map: () => None(),
  chain: () => None(),
  fold: (f, g) => f(),
  toString: () => 'None',
});

const Some = (value) => ({
  isNone: () => false,
  isSome: () => true,
  map: (fn) => Some(fn(value)),
  chain: (fn) => fn(value),
  fold: (f, g) => g(value),
  toString: () => `Some(${value})`,
});

const option = {
  None,
  Some,
};

module.exports = { option };
