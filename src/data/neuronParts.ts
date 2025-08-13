export interface NeuronPart {
  id: string;
  name: string;
  image: string;
  targetId: string;
}

export const NEURON_PARTS: NeuronPart[] = [
  {
    id: 'part-1',
    name: 'Dendrites',
    image: '/placeholder.svg',
    targetId: 'drop-dendrites',
  },
  {
    id: 'part-2',
    name: 'Soma (Cell Body)',
    image: '/placeholder.svg',
    targetId: 'drop-soma',
  },
  {
    id: 'part-3',
    name: 'Nucleus',
    image: '/placeholder.svg',
    targetId: 'drop-nucleus',
  },
  {
    id: 'part-4',
    name: 'Axon',
    image: '/placeholder.svg',
    targetId: 'drop-axon',
  },
  {
    id: 'part-5',
    name: 'Myelin Sheath',
    image: '/placeholder.svg',
    targetId: 'drop-myelin',
  },
  {
    id: 'part-6',
    name: 'Axon Terminal',
    image: '/placeholder.svg',
    targetId: 'drop-terminal',
  },
];

export interface DropZone {
  id: string;
  name: string;
  position: { top: string; left: string };
  size: { width: string; height: string };
}

export const NEURON_DROP_ZONES: DropZone[] = [
    { id: 'drop-dendrites', name: 'Dendrites', position: { top: '10%', left: '50%' }, size: { width: '30%', height: '20%' } },
    { id: 'drop-soma', name: 'Soma', position: { top: '30%', left: '45%' }, size: { width: '20%', height: '20%' } },
    { id: 'drop-nucleus', name: 'Nucleus', position: { top: '35%', left: '50%' }, size: { width: '10%', height: '10%' } },
    { id: 'drop-axon', name: 'Axon', position: { top: '50%', left: '20%' }, size: { width: '60%', height: '10%' } },
    { id: 'drop-myelin', name: 'Myelin Sheath', position: { top: '50%', left: '25%' }, size: { width: '50%', height: '10%' } },
    { id: 'drop-terminal', name: 'Axon Terminal', position: { top: '60%', left: '15%' }, size: { width: '20%', height: '15%' } },
];
