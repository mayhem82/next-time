// Entry numbers belong to the original two lists and remain stable across views.
export const meshes = [
  {
    id: 'ground',
    title: 'Ground and surface water',
    description: 'Puddles, runoff, soil, groundwater and streams.',
    selfDetection: '“Soil” covers several places and depths. Two routes that reach soil may end in different patches.'
  },
  {
    id: 'living',
    title: 'Living things',
    description: 'Water taken up, carried, or released by plants and animals.',
    selfDetection: 'Water inside a growing leaf at 18 and water on a leaf at 1–3 occupy different places. Connecting them requires another transfer.'
  },
  {
    id: 'air',
    title: 'Atmosphere',
    description: 'Evaporation, wind, condensation and falling rain.',
    selfDetection: 'The word “air” hides distance. Entry 36 specifies where a raindrop lands. Entry 35 only describes how a drop forms.'
  },
  {
    id: 'built',
    title: 'Built water collection',
    description: 'The neighboring roof, gutter, rain barrel and hose.',
    selfDetection: 'The hose reaches garden soil in entry 30. The list leaves its exact outlet and the amount delivered open.'
  }
];

function entry(id, from, to, description, ...meshes) {
  return { id, from, to, description, meshes };
}

export const entries = [
  entry(1, 'Leaf surface', 'Air', 'Leaf → air by evaporation', 'living', 'air'),
  entry(2, 'Leaf surface', 'Soil', 'Leaf → soil by dripping', 'living', 'ground'),
  entry(3, 'Leaf surface', 'Puddle', 'Leaf → puddle by dripping', 'living', 'ground'),
  entry(4, 'Puddle', 'Soil', 'Puddle → soil by soaking in', 'ground'),
  entry(5, 'Puddle', 'Downhill runoff', 'Puddle → downhill as runoff', 'ground'),
  entry(6, 'Puddle', 'Air', 'Puddle → air by evaporation', 'ground', 'air'),
  entry(7, 'Soil', 'Roots', 'Soil → roots', 'ground', 'living'),
  entry(8, 'Soil', 'Deeper underground', 'Soil → deeper underground', 'ground'),
  entry(9, 'Soil', 'Neighboring soil', 'Soil → neighboring soil by flowing sideways', 'ground'),
  entry(10, 'Soil', 'Surface', 'Soil → surface', 'ground'),
  entry(11, 'Plant', 'New growth', 'Plant → new growth', 'living'),
  entry(12, 'Plant', 'Fruit', 'Plant → fruit', 'living'),
  entry(13, 'Plant', 'Air', 'Plant → air through its leaves', 'living', 'air'),
  entry(14, 'Air', 'Leaf dew', 'Air → leaf as dew', 'air', 'living'),
  entry(15, 'Air', 'Cloud droplets', 'Air → cloud droplets by condensation', 'air'),
  entry(16, 'Air', 'Air beyond the garden', 'Air in the garden → air beyond the garden on the wind', 'air'),
  entry(17, 'Roots', 'Stem', 'Water in roots → stem through the plant’s xylem', 'living'),
  entry(18, 'Stem', 'Growing leaf', 'Water in the stem → a growing leaf', 'living'),
  entry(19, 'Stem', 'Fruit', 'Water in the stem → a developing fruit', 'living'),
  entry(20, 'Fruit', 'Bird', 'Water in the fruit → a bird that eats it', 'living'),
  entry(21, 'Puddle', 'Bird', 'Water in the puddle → the same bird when it drinks', 'ground', 'living'),
  entry(22, 'Bird', 'Air', 'Water in the bird → air in its breath', 'living', 'air'),
  entry(23, 'Bird', 'Soil', 'Water in the bird → soil in its droppings', 'living', 'ground'),
  entry(24, 'Leaf dew', 'Snail', 'Dew on a leaf → a snail that drinks it', 'living'),
  entry(25, 'Snail', 'Mucus on the leaf', 'Water in the snail → a trail of mucus on the leaf', 'living'),
  entry(26, 'Mucus on the leaf', 'Air', 'Water in the mucus → air by evaporation', 'living', 'air'),
  entry(27, 'Air beyond the garden', 'Roof dew', 'Water vapor carried beyond the garden → dew on a neighboring roof', 'air', 'built'),
  entry(28, 'Roof dew', 'Gutter', 'Dew on the roof → gutter as droplets merge and run down', 'built'),
  entry(29, 'Gutter', 'Rain barrel', 'Water in the gutter → a rain barrel', 'built'),
  entry(30, 'Rain barrel', 'Garden soil', 'Water in the rain barrel → garden soil through a hose', 'built', 'ground'),
  entry(31, 'Deeper underground', 'Groundwater', 'Water deep in the soil → groundwater by downward seepage', 'ground'),
  entry(32, 'Groundwater', 'Stream', 'Groundwater → a stream through its bed', 'ground'),
  entry(33, 'Downhill runoff', 'Stream', 'Downhill runoff → the same stream over its bank', 'ground'),
  entry(34, 'Stream', 'Floodplain soil', 'Stream water → floodplain soil when the stream overflows', 'ground'),
  entry(35, 'Cloud droplets', 'Raindrop', 'Cloud droplets → a raindrop as they collide and merge', 'air'),
  entry(36, 'Raindrop', 'Puddle', 'Raindrop → the original puddle', 'air', 'ground')
];

export const findings = [
  {
    id: 1,
    title: 'Two ways in, two ways out',
    description: 'A bird can drink puddle water directly or eat fruit supplied by that puddle through soil, roots and stem. Either arrival can continue into breath or droppings.',
    significance: 'Two arrivals and two departures make four distinct routes through the bird. The list gives no share for any route.',
    meshes: ['ground', 'living', 'air'],
    entries: [4, 7, 17, 19, 20, 21, 22, 23],
    routes: [
      { label: 'Drink → breath', entries: [21, 22] },
      { label: 'Drink → droppings', entries: [21, 23] },
      { label: 'Fruit → breath', entries: [4, 7, 17, 19, 20, 22] },
      { label: 'Fruit → droppings', entries: [4, 7, 17, 19, 20, 23] }
    ]
  },
  {
    id: 2,
    title: 'One exit feeds a return loop',
    description: 'Droppings can put water into soil where roots take it up. The stem carries it to fruit. A bird eating the fruit completes a return to the bird category.',
    significance: 'A route can make any number of passes around this loop in the model. Every return also offers an exit through breath. The identity of a particular bird or drop remains open.',
    meshes: ['living', 'ground', 'air'],
    entries: [23, 7, 17, 19, 20, 22],
    routes: [
      { label: 'Bird → soil → fruit → bird', entries: [23, 7, 17, 19, 20] },
      { label: 'Leave through breath after one return', entries: [23, 7, 17, 19, 20, 22] }
    ]
  },
  {
    id: 3,
    title: 'Two histories reach the same stream',
    description: 'Runoff can reach a stream across its bank. Water from the same puddle can also soak in, seep downward and enter the stream through its bed.',
    significance: 'Both branches can continue into floodplain soil. Water found downstream is consistent with either upstream history.',
    meshes: ['ground'],
    entries: [4, 5, 8, 31, 32, 33, 34],
    routes: [
      { label: 'Across the surface', entries: [5, 33, 34] },
      { label: 'Under the ground', entries: [4, 8, 31, 32, 34] }
    ]
  },
  {
    id: 4,
    title: 'Water can leave the garden and return without rain',
    description: 'Wind carries vapor beyond the garden. A neighboring roof collects dew, a gutter feeds a barrel, and a hose can deliver that water to garden soil.',
    significance: 'The boundary is crossed outward in air and inward through built collection. Counting departures alone would miss the return.',
    meshes: ['ground', 'air', 'built'],
    entries: [6, 16, 27, 28, 29, 30],
    routes: [
      { label: 'Puddle → air → roof → garden soil', entries: [6, 16, 27, 28, 29, 30] }
    ]
  },
  {
    id: 5,
    title: 'A closer description can overlap an earlier one',
    description: 'Entry 12 describes plant water reaching fruit. Entry 19 names the stem and specifies a developing fruit. A growing leaf at 18 is likewise one example of the new growth at 11.',
    significance: 'The total of 36 counts written descriptions. Adding the broad account and the finer one as independent physical transfers can count the same water twice.',
    meshes: ['living'],
    entries: [11, 12, 18, 19],
    routes: [
      { label: 'Compare descriptions of fruit', entries: [12, 19] },
      { label: 'Compare descriptions of growth', entries: [11, 18] }
    ]
  }
];

export const handlingRules = [
  { title: 'Keep the earlier list', description: 'Give each addition its own number. Earlier references should still lead to the same description.' },
  { title: 'Work both ways', description: 'At a shared point, trace every listed way in and out. Follow returns, crossings and places where routes meet again.' },
  { title: 'Check what changed', description: 'Does the addition introduce a transfer, reveal a relationship among existing transfers, or describe a known transfer more precisely? One addition can do several of these.' },
  { title: 'Name the missing observation', description: 'For a claim about change, say which quantity would have to be measured and compared through time.' }
];

export const trajectory = {
  indicators: ['Puddle storage', 'Soil moisture', 'Streamflow'],
  direction: 'Indeterminate',
  summary: 'The two lists record growth in the description. The garden has no time series here. The direction of each physical indicator, their convergence or divergence, and an overall trajectory remain unresolved.'
};
