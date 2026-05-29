/// <reference types="next" />
/// <reference types="next/image-types/global" />

// Augment process.env for type safety
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_PUBLIC_API_URL: string;
    readonly NEXT_PUBLIC_SITE_URL: string;
    readonly NEXT_PUBLIC_GA_ID?: string;
    readonly NEXT_PUBLIC_ENABLE_MPESA?: string;
    readonly NEXT_PUBLIC_ENABLE_PRESCRIPTION_UPLOAD?: string;
    readonly NODE_ENV: 'development' | 'production' | 'test';
  }
}

// SVG module declarations
declare module '*.svg' {
  import type * as React from 'react';
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
