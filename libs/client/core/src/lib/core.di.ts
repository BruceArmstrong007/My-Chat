import { provideConfig, injectConfig } from './config/config.di';
import { Provider } from '@angular/core';
import { AppConfig } from './config/config.model';
import { injectToken, provideToken } from './utils/token.service';

export const provideCore = (config: AppConfig): Provider => [provideConfig(config), provideToken()];

export { injectConfig, injectToken };
