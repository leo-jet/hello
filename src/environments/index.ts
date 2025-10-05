// Environment exports
export type { Environment } from './environment.interface';
export { environment } from './environment';
export { EnvironmentService } from './environment.service';

// Re-export all environment configurations for build tools
export { environment as devEnvironment } from './environment';
export { environment as prodEnvironment } from './environment.prod';
export { environment as stagingEnvironment } from './environment.staging';
export { environment as testEnvironment } from './environment.test';
