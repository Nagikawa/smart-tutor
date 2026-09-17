import { ScienceActivity } from '../types';

export const primaryActivity: ScienceActivity = {
  id: 'evaporative_cooling',
  title: 'Evaporative Cooling: The Sweating Mystery',
  gradeLevel: 'Middle School (Grades 6–8 / Ages 11–14)',
  topic: 'Thermal Energy, States of Matter, and Homeostasis',
  curriculumStandard: 'NGSS MS-PS1-4 (Thermal Energy in Phase Changes) & MS-LS1-3 (Body Systems & Thermoregulation)',
  scenario:
    'You just sprinted across the soccer field on a warm afternoon. Your forehead is covered in sweat beads, and as the breeze hits, your skin starts feeling noticeably cooler.',
  initialPrompt:
    'Why does sweating actually cool your body down? In your own words, explain the step-by-step physical process of how that moisture lowers your skin temperature.',
  causalChain: [
    {
      id: 'heat_trigger',
      order: 1,
      label: '1. Thermal Trigger',
      description: 'Body temperature rises from exercise or environment; sweat glands secrete moisture onto skin.',
      isFulfilled: false,
      hint: 'What caused the water to appear on your skin in the first place?'
    },
    {
      id: 'sweat_layer',
      order: 2,
      label: '2. Surface Liquid Layer',
      description: 'A thin layer of water-based sweat coats the warm skin cells.',
      isFulfilled: false,
      hint: 'Where is the sweat sitting relative to your body heat?'
    },
    {
      id: 'phase_change',
      order: 3,
      label: '3. Evaporative Phase Change',
      description: 'Thermal energy transfers into the water molecules, causing the fastest/hottest molecules to evaporate from liquid into gas/vapor.',
      isFulfilled: false,
      hint: 'Crucial step: What happens to the water droplets when they disappear into the air? What energy does that require?'
    },
    {
      id: 'heat_removal',
      order: 4,
      label: '4. Kinetic Energy Loss',
      description: 'Because the highest kinetic energy molecules escape into vapor, the average kinetic energy (temperature) of the remaining skin drops.',
      isFulfilled: false,
      hint: 'When those energetic molecules leave into the air, what happens to the heat left behind on your skin?'
    }
  ],
  commonMisconceptions: [
    {
      description: 'Sweat is naturally cold liquid pumped from veins like refrigerated water.',
      triggers: ['cold water', 'refrigerator', 'cold inside', 'ice in veins', 'cold liquid from blood'],
      remediationPrompt:
        'Remember that our internal body temperature is warm—around 37°C (98.6°F)—so sweat is actually warm when it comes out! Where does the chill come from once it hits the outside air?'
    },
    {
      description: 'Sweat opens pores so cool outdoor air blows inside the body.',
      triggers: ['blows inside', 'wind enters pores', 'holes let cold air in', 'pores open like doors'],
      remediationPrompt:
        'Pores release sweat droplets outward, but air doesn’t enter through them! Focus on what happens to the liquid water on your skin surface.'
    },
    {
      description: 'Water naturally attracts coldness or repels heat magically without state change.',
      triggers: ['water is cold', 'attracts cold', 'magic cooling', 'just cold'],
      remediationPrompt:
        'Think about water on a hot stove or on your hand: what physical change does liquid water undergo when heat is added to it?'
    }
  ],
  transferPrompt: {
    title: 'Far-Transfer Challenge: Canine Panting',
    scenario: 'Dogs do not have sweat glands across their hairy bodies like humans do. Instead, when a dog gets overheated after running, it hangs its wet tongue out and pants rapidly.',
    prompt: 'Using the exact same scientific principle of evaporative cooling you just mastered, explain why panting with a wet tongue cools a dog down!',
    targetMechanism: 'Moisture on the warm tongue and respiratory tract absorbs thermal energy and evaporates into the moving air stream, carrying heat away from blood vessels in the mouth.'
  }
};
