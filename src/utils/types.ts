import { type RouterOutputs } from '~/trpc/shared';

export type List = RouterOutputs['list']['all'];
export type SingleList = RouterOutputs['list']['all'][number];
export type SingleBoard = RouterOutputs['board']['get'];
export type InfiniteBoard = RouterOutputs['board']['all']['items'][number];
export type Card = Pick<SingleList, 'cards'>['cards'];
export type SingleCard = Pick<SingleList, 'cards'>['cards'][0];

export interface PexelsResponse {
  page: number;
  per_page: number;
  photos: Photo[];
  total_results: number;
  next_page: string;
}

export interface Photo {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: Src;
  liked: boolean;
  alt: string;
}

export interface Src {
  original: string;
  large2x: string;
  large: string;
  medium: string;
  small: string;
  portrait: string;
  landscape: string;
  tiny: string;
}
