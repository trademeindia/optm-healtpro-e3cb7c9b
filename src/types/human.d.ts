
import { Result as HumanResult, BodyResult, BodyKeypoint as OriginalBodyKeypoint } from '@vladmandic/human';

// Extend Human.js types to include the properties we need
declare module '@vladmandic/human' {
  interface Result extends HumanResult {
    source?: {
      width: number;
      height: number;
    };
  }

  interface BodyKeypoint extends OriginalBodyKeypoint {
    name?: string;
    x: number;
    y: number;
  }
}
