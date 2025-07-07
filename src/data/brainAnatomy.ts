// Brain anatomy data based on NINDS brain basics
export interface BrainRegion {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  position: [number, number, number];
  color: string;  
  functions: string[];
  clinicalRelevance: string;
  surgicalConsiderations: string;
  shape: 'ellipsoid' | 'irregular' | 'elongated';
  size: [number, number, number]; // width, height, depth
}

export const BRAIN_REGIONS: BrainRegion[] = [
  {
    id: 'frontal-lobe',
    name: 'Frontal Lobe',
    shortDescription: 'Planning, reasoning, and motor control',
    fullDescription: 'The frontal lobes lie directly behind the forehead. When you plan a schedule, imagine the future, or use reasoned arguments, these two lobes do much of the work. They act as short-term storage sites, allowing one idea to be kept in mind while other ideas are considered.',
    position: [-0.5, 1.2, 1.0],
    color: '#FF8C42', // Orange matching uploaded brain image
    functions: [
      'Executive functions',
      'Planning and decision making',
      'Working memory',
      'Personality and behavior',
      'Motor control (motor cortex)'
    ],
    clinicalRelevance: 'Damage can affect personality, judgment, and movement control',
    surgicalConsiderations: 'Critical for preserving motor function and personality',
    shape: 'ellipsoid',
    size: [2.2, 1.8, 1.6]
  },
  {
    id: 'parietal-lobe',
    name: 'Parietal Lobe',
    shortDescription: 'Sensory processing and spatial awareness',
    fullDescription: 'When you enjoy a good meal—the taste, smell, and texture of the food—the parietal lobes are at work. The parietal lobes also support reading and arithmetic. The somatosensory cortex receives information about temperature, taste, touch, and movement.',
    position: [0.5, 1.2, 1.0],
    color: '#4CAF50', // Green matching uploaded brain image
    functions: [
      'Sensory integration',
      'Spatial processing',
      'Reading and arithmetic',
      'Body awareness',
      'Temperature and touch sensation'
    ],
    clinicalRelevance: 'Damage affects sensory perception and spatial awareness',
    surgicalConsiderations: 'Preserve sensory pathways and language areas',
    shape: 'irregular',
    size: [1.8, 1.5, 1.4]
  },
  {
    id: 'temporal-lobe',
    name: 'Temporal Lobe',
    shortDescription: 'Memory, hearing, and language',
    fullDescription: 'The temporal lobes lie in front of the visual areas and nest under the parietal and frontal lobes. Whether you appreciate symphonies or rock music, your brain responds through the activity of these lobes. They play a crucial role in forming and retrieving memories.',
    position: [-1.5, 0.5, 0.2],
    color: '#9C27B0', // Purple matching uploaded brain image
    functions: [
      'Auditory processing',
      'Memory formation and retrieval',
      'Language comprehension',
      'Musical processing',
      'Emotional memories'
    ],
    clinicalRelevance: 'Critical for memory and language function',
    surgicalConsiderations: 'Preserve hippocampus and language areas (Wernicke\'s area)',
    shape: 'elongated',
    size: [1.6, 1.2, 2.0]
  },
  {
    id: 'occipital-lobe',
    name: 'Occipital Lobe',
    shortDescription: 'Visual processing center',
    fullDescription: 'Two areas at the back of the brain process images from the eyes and link that information with images stored in memory. The occipital lobes are essential for vision. Damage to the occipital lobes can cause blindness.',
    position: [0, 0.8, -1.8],
    color: '#E91E63', // Pink/Magenta matching uploaded brain image
    functions: [
      'Visual processing',
      'Image recognition',
      'Visual memory integration',
      'Color perception',
      'Motion detection'
    ],
    clinicalRelevance: 'Damage can cause various forms of blindness',
    surgicalConsiderations: 'Preserve visual cortex and pathways',
    shape: 'irregular',
    size: [1.8, 1.4, 1.0]
  },
  {
    id: 'cerebellum',
    name: 'Cerebellum',
    shortDescription: 'Balance, coordination, and motor learning',
    fullDescription: 'The cerebellum coordinates movement and is involved in learned movements. When you play the piano or hit a tennis ball, you are activating the cerebellum. It\'s essential for balance and fine motor control.',
    position: [0, -1.0, -1.2],
    color: '#FFC107', // Yellow matching uploaded brain image
    functions: [
      'Motor coordination',
      'Balance and posture',
      'Motor learning',
      'Fine motor control',
      'Cognitive functions'
    ],
    clinicalRelevance: 'Damage causes ataxia (coordination problems)',
    surgicalConsiderations: 'Critical for post-operative mobility and coordination',
    shape: 'irregular',
    size: [2.0, 1.0, 1.2]
  },
  {
    id: 'brainstem',
    name: 'Brainstem',
    shortDescription: 'Vital functions and consciousness',
    fullDescription: 'The brainstem controls the body\'s vital functions such as respiration and heart rate. The uppermost part controls some reflex actions and is part of the circuit involved in eye movements and other voluntary movements.',
    position: [0, -0.5, 0.0],
    color: '#90A4AE', // Light gray matching uploaded brain image
    functions: [
      'Breathing control',
      'Heart rate regulation',
      'Blood pressure control',
      'Sleep/wake cycles',
      'Reflex actions'
    ],
    clinicalRelevance: 'Damage can be life-threatening',
    surgicalConsiderations: 'Extremely delicate - affects vital functions',
    shape: 'elongated',
    size: [0.8, 1.8, 1.0]
  }
];

// Educational content for tooltips and information panels
export const BRAIN_FACTS = {
  overview: "The brain is the most complex part of the human body. This three-pound organ is the seat of intelligence, interpreter of the senses, initiator of body movement, and controller of behavior.",
  structure: "The brain can be divided into three basic units: the forebrain, the midbrain, and the hindbrain.",
  cortex: "The cerebral cortex is a vital layer of tissue the thickness of a stack of two or three dimes. Most of the actual information processing in the brain takes place in the cerebral cortex.",
  hemispheres: "The cerebrum is split into two halves (hemispheres) by a deep fissure. Nearly all signals from the brain to the body cross over, so the right hemisphere controls the left side of the body and vice versa."
};

// Surgical landmarks and approaches
export const SURGICAL_LANDMARKS = [
  {
    region: 'frontal-lobe',
    approaches: ['Pterional', 'Bifrontal', 'Supraorbital'],
    landmarks: ['Sylvian fissure', 'Frontal horn', 'Motor strip']
  },
  {
    region: 'temporal-lobe', 
    approaches: ['Pterional', 'Subtemporal', 'Transsylvian'],
    landmarks: ['Sylvian fissure', 'Temporal horn', 'Hippocampus']
  },
  {
    region: 'parietal-lobe',
    approaches: ['Interhemispheric', 'Posterior parietal'],
    landmarks: ['Central sulcus', 'Postcentral gyrus', 'Angular gyrus']
  },
  {
    region: 'occipital-lobe',
    approaches: ['Occipital interhemispheric', 'Supracerebellar'],
    landmarks: ['Calcarine fissure', 'Visual cortex', 'Occipital horn']
  },
  {
    region: 'cerebellum',
    approaches: ['Suboccipital', 'Retrosigmoid', 'Supracerebellar'],
    landmarks: ['Fourth ventricle', 'Cerebellar peduncles', 'Vermis']
  },
  {
    region: 'brainstem',
    approaches: ['Transpetrosal', 'Retrosigmoid', 'Orbitozygomatic'],
    landmarks: ['Fourth ventricle', 'Cranial nerve nuclei', 'Aqueduct']
  }
];