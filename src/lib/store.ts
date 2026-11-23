import { writable } from 'svelte/store';
import type { AnnotationData, InteractionMode, PersonData } from './types';

export const annotations = writable<AnnotationData[]>([]);
export const persons = writable<PersonData[]>([]);
export const carFloor = writable(1);
export const floorCount = writable(8);
export const mode = writable<InteractionMode>('navigate');
export const carTransparent = writable(false);
export const clipOn = writable(false);
export const engineInfo = writable('初始化…');
export const modelInfo = writable<{ shaft: string; car: string }>({ shaft: '', car: '' });
export const statusMsg = writable('');
