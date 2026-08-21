const negativeWordWeights: Record<string, number> = {
  annoying: 1,
  awful: 3,
  bad: 1,
  broken: 2,
  cancelled: 1,
  canceled: 1,
  disaster: 3,
  disasters: 3,
  difficult: 1,
  dreadful: 3,
  exhausted: 2,
  expensive: 1,
  failed: 2,
  failure: 2,
  grim: 2,
  hate: 3,
  hated: 3,
  horrible: 3,
  horrendous: 3,
  ill: 2,
  late: 1,
  lost: 2,
  miserable: 2,
  nightmare: 3,
  pain: 2,
  painful: 2,
  ruined: 2,
  rubbish: 1,
  sick: 2,
  stressed: 2,
  stressful: 2,
  terrible: 3,
  tired: 1,
  useless: 2,
  worst: 3,
};

export const maximumWordingPoints = 12;

export function negativeWordScore(text: string) {
  const words = text.toLocaleLowerCase("en").match(/[a-z]+(?:'[a-z]+)?/g) ?? [];
  const score = words.reduce(
    (total, word) => total + (negativeWordWeights[word] ?? 0),
    0,
  );

  return Math.min(score, maximumWordingPoints);
}
