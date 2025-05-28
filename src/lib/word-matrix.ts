export const WORD_MATRIX = [
  ['sake', 'safe', 'save', 'same', 'sane', 'sale'],
  ['bat', 'ban', 'back', 'bath', 'bass', 'bad'],
  ['page', 'pale', 'pace', 'pave', 'pay', 'pane'],
  ['rave', 'raze', 'race', 'ray', 'rate', 'rake'],
  ['sold', 'gold', 'hold', 'cold', 'fold', 'told'],
  ['ten', 'then', 'den', 'men', 'hen', 'pen'],
  ['seep', 'seem', 'sin', 'seek', 'seed', 'seen'],
  ['meat', 'beat', 'heat', 'neat', 'seat', 'feat'],
  ['teach', 'team', 'tease', 'teak', 'teal', 'tear'],
  ['sing', 'sick', 'sin', 'sill', 'sip', 'sit'],
  ['late', 'lane', 'lay', 'lame', 'lace', 'lake'],
  ['kith', 'kiss', 'kid', 'kill', 'kit', 'king'],
  ['pun', 'putt', 'pup', 'pub', 'pug', 'puff'],
  ['just', 'gust', 'dust', 'bust', 'must', 'rust'],
  ['jig', 'pig', 'big', 'fig', 'rig', 'wig'],
  ['pill', 'pin', 'pip', 'pit', 'pig', 'pick'],
  ['duck', 'dug', 'dull', 'dun', 'dub', 'dud'],
  ['top', 'mop', 'pop', 'shop', 'cop', 'hop'],
  ['map', 'mass', 'math', 'mad', 'man', 'mat'],
  ['cut', 'cud', 'cuff', 'cuss', 'cup', 'cub'],
  ['bun', 'buck', 'but', 'bug', 'buff', 'bus'],
  ['kit', 'wit', 'fit', 'hit', 'sit', 'bit'],
  ['fame', 'tame', 'came', 'game', 'name', 'same'],
  ['way', 'day', 'say', 'lay', 'may', 'pay'],
  ['bean', 'bead', 'beat', 'beak', 'beam', 'beach'],
  ['came', 'cave', 'cane', 'case', 'cake', 'cape'],
  ['will', 'fill', 'kill', 'bill', 'till', 'hill'],
  ['nest', 'best', 'west', 'rest', 'test', 'vest'],
  ['book', 'hook', 'shook', 'look', 'cook', 'took'],
  ['dig', 'till', 'did', 'din', 'dim', 'dip'],
  ['rent', 'dent', 'went', 'sent', 'tent', 'bent'],
  ['kick', 'wick', 'sick', 'tick', 'pick', 'lick'],
  ['hot', 'lot', 'not', 'tot', 'pot', 'got'],
  ['gale', 'sale', 'tale', 'pale', 'bale', 'male'],
  ['peace', 'peat', 'peak', 'peach', 'peal', 'peas'],
  ['sun', 'bun', 'gun', 'run', 'fun', 'nun'],
  ['hear', 'heat', 'heal', 'heap', 'heave', 'heath'],
  ['sip', 'hip', 'tip', 'lip', 'dip', 'rip'],
  ['sad', 'sap', 'sag', 'sat', 'sack', 'sass'],
  ['fill', 'fib', 'fin', 'fit', 'fizz', 'fig'],
  ['tab', 'tack', 'tam', 'tap', 'tang', 'tan'],
  ['led', 'fed', 'red', 'wed', 'bed', 'shed'],
  ['hark', 'park', 'mark', 'bark', 'lark', 'dark'],
  ['peel', 'keel', 'feel', 'eel', 'heel', 'reel'],
  ['raw', 'thaw', 'law', 'saw', 'jaw', 'paw'],
  ['pin', 'din', 'tin', 'fin', 'win', 'sin'],
  ['foil', 'toil', 'boil', 'soil', 'oil', 'coil'],
  ['pass', 'path', 'pang', 'pan', 'pad', 'pat'],
  ['sud', 'stud', 'sub', 'sun', 'sum', 'sup'],
  ['rang', 'sang', 'gang', 'hang', 'bang', 'fang']
];

export function generateShuffledWords(count: number | string): string[] {
  let allWords: string[] = [];
  WORD_MATRIX.forEach(group => {
    allWords = allWords.concat(group);
  });
  
  // Shuffle array using Fisher-Yates algorithm
  for (let i = allWords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allWords[i], allWords[j]] = [allWords[j], allWords[i]];
  }
  
  if (count === 'all') {
    return allWords;
  }
  
  const numCount = typeof count === 'string' ? parseInt(count) : count;
  return allWords.slice(0, numCount);
}

export function findRhymeGroup(word: string): string[] {
  return WORD_MATRIX.find(group => group.includes(word)) || [];
}
