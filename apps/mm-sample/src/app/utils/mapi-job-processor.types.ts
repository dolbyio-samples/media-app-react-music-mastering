export interface RequestParams {
  endpoint: string;
  server?: string;
  body?: MasteringPreviewBody | MasteringBody;
}

export interface RequestCallbacks {
  onResponse?: Function;
  onProgress?: Function;
  onError?: Function;
}

/**
 * Music Mastering API Types
 */
export interface MasteringPreviewBody {
  inputs: MasteringInput[];
  outputs: MasteringOutput[];
}

export interface MasteringBody {
  inputs: MasteringInput[];
  outputs: MasteringOutput[];
}

export interface MasteringInput {
  source: string;
  metadata?: { genre?: string; tags?: string[] };
  segment?: { start: number; duration: number };
}

export interface MasteringOutput {
  destination: string;
  master?: {
    dynamic_eq?: { enable: boolean; preset?: string };
    loudness?: { enable: boolean; target_level?: number };
    stereo_image?: { enable: boolean };
  };
}
