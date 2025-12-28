const { readLines } = require('../../utils/file-io');

const buildAllergenMap = food => {
  const map = new Map();

  food.forEach(([ingredients, allergens]) =>
    allergens.forEach(allergen =>
      map.set(allergen, new Set(
        [...(map.get(allergen) || ingredients)]
          .filter(ingredient => ingredients.has(ingredient))
      ))
    )
  );

  return map;
};

const part1 = food => {
  let allIngredients;

  for (const [, ingredients] of buildAllergenMap(food)) {
    allIngredients = new Set([...(allIngredients || []), ...ingredients]);
  }

  return food.reduce(
    (count, [ingredients]) => count + [...ingredients].reduce(
      (count, ingredient) => count + !allIngredients.has(ingredient),
      0
    ),
    0
  );
};

const part2 = food => {
  const map = buildAllergenMap(food);
  let allergenCount = map.size;

  while (allergenCount--) {
    for (const [allergen, ingredients] of map) {
      if (ingredients.size > 1) {
        continue;
      }

      const [ingredient] = [...ingredients];

      for (const [allergenInner, ingredients] of map) {
        if (allergen !== allergenInner) {
          ingredients.delete(ingredient);
        }
      }
    }
  }

  return [...map.keys()].sort().flatMap(allergen => [...map.get(allergen)]).join();
};

const food = readLines('input.txt').map(line => {
  const [, ingredients, allergens] = line.match(/(.+)\s\(contains\s(.+)\)/);

  return [new Set(ingredients.split(' ')), new Set(allergens.split(', '))];
});

console.log('Part 1:', part1(food));
console.log('Part 2:', part2(food));
