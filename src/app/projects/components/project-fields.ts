import { FeatureFilmFields } from './FeatureFilm';
import { SeriesFields } from './SeriesFields';
import { DocumentaryFields } from './DocumentaryFields';
import { CommercialFields } from './CommercialFields';
import { MusicVideoFields } from './MusicVideoFields';
import { WebSeriesFields } from './WebSeriesFields';
import { AnimationFields } from './AnimationFields';

export function getTypeSpecificFields(type: string) {
  const fields = {
    feature: FeatureFilmFields,
    series: SeriesFields,
    documentary: DocumentaryFields,
    commercial: CommercialFields,
    music_video: MusicVideoFields,
    web_series: WebSeriesFields,
    animation: AnimationFields,
  };

  return fields[type as keyof typeof fields];
}

export interface ProjectField {
    name: string;
    label: string;
    type: 'text' | 'select' | 'number' | 'date' | 'textarea';
    options?: { value: string; label: string }[];
    placeholder?: string;
    required?: boolean;
    validation?: {
      min?: number;
      max?: number;
      pattern?: string;
    };
  }
  
  export interface ProjectTypeFields {
    feature: ProjectField[];
    series: ProjectField[];
    documentary: ProjectField[];
    commercial: ProjectField[];
    music_video: ProjectField[];
    web_series: ProjectField[];
    animation: ProjectField[];
  }
  
  // Define the fields for each project type
  export const projectTypeFields: ProjectTypeFields = {
    feature: [
      {
        name: 'scriptStage',
        label: 'Script Stage',
        type: 'select',
        options: [
          { value: 'concept', label: 'Concept' },
          { value: 'treatment', label: 'Treatment' },
          { value: 'first-draft', label: 'First Draft' },
          { value: 'final-draft', label: 'Final Draft' }
        ],
        required: true
      },
      {
        name: 'genre',
        label: 'Genre',
        type: 'text',
        required: true
      },
      {
        name: 'runtime',
        label: 'Estimated Runtime (minutes)',
        type: 'number',
        validation: {
          min: 1,
          max: 999
        }
      },
      {
        name: 'targetMarket',
        label: 'Target Market',
        type: 'select',
        options: [
          { value: 'domestic', label: 'Domestic' },
          { value: 'international', label: 'International' },
          { value: 'both', label: 'Both' }
        ]
      }
    ],
    series: [
      {
        name: 'numberOfSeasons',
        label: 'Number of Seasons',
        type: 'number',
        validation: {
          min: 1
        },
        required: true
      },
      {
        name: 'episodesPerSeason',
        label: 'Episodes per Season',
        type: 'number',
        validation: {
          min: 1
        },
        required: true
      },
      {
        name: 'episodeDuration',
        label: 'Episode Duration (minutes)',
        type: 'number',
        validation: {
          min: 1,
          max: 180
        }
      },
      {
        name: 'platform',
        label: 'Target Platform',
        type: 'text'
      }
    ],
      documentary: [], // Added
      commercial: [],  // Added
      music_video: [], // Added
      web_series: [],   // Added
      animation: [],   // Added
  } as const;