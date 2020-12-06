const { readLines } = require('../../utils/file-io');

const ingredients = readLines('input.txt').map(line => {
  const [, attributes] = line.match(/\w+:\s(.+)/);

  return Object.fromEntries(
    attributes.split(', ').map(attribute => attribute.split(' '))
  );
});

const score = (ingredients, amounts, attributes) =>
  attributes.reduce((score, attribute) => {
    const sum = ingredients.reduce(
      (sum, ingredient, index) => sum + amounts[index] * ingredient[attribute],
      0
    );

    return sum < 0 ? 0 : score * sum;
  },
  1
);

const findHighestScoringRecipe = (ingredients, total, requiredCalories, amount = null, amounts = []) => {
  if (amount) {
    amounts.push(amount);

    if (amounts.length + 1 === ingredients.length) {
      amounts.push(total);

      return requiredCalories && requiredCalories !== score(ingredients, amounts, ['calories'])
        ? 0 : score(ingredients, amounts, ['capacity', 'durability', 'flavor', 'texture']);
    }
  }

  let highestScore = 0;

  for (let i = 1; i < total; ++i) {
    const score = findHighestScoringRecipe(ingredients, total - i, requiredCalories, i, amounts.slice());

    if (score > highestScore) {
      highestScore = score;
    }
  }

  return highestScore;
};

const part1 = ingredients => findHighestScoringRecipe(ingredients, 100, null);
const part2 = ingredients => findHighestScoringRecipe(ingredients, 100, 500);

console.log(part1(ingredients), part2(ingredients));
