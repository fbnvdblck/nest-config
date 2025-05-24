import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import {
  ConfigValidationException,
  ConfigValueNotFoundException,
} from '../exceptions';
import { Config, ConfigType, getConfigKey } from '../models';

interface IConfigService<C extends Config> {
  get(): C | never;
  validate(): void | never;
  isValid(): boolean;
}

interface IConfigServiceType<T extends IConfigService<C>, C extends Config>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  extends Function {
  new (nestConfigService: NestConfigService): T;
}

export type ConfigServiceType<C extends Config> = IConfigServiceType<
  IConfigService<C>,
  C
>;

export function ConfigService<C extends Config>(
  configType: ConfigType<C>,
): ConfigServiceType<C> {
  @Injectable()
  class ConfigServiceImpl implements IConfigService<C>, OnModuleInit {
    constructor(private readonly nestConfigService: NestConfigService) {}

    get(): C | never {
      const config = this.nestConfigService.get<C>(getConfigKey(configType));

      if (!config) {
        throw new ConfigValueNotFoundException(configType);
      }

      return plainToInstance(configType, config);
    }

    validate(): void | never {
      const validationErrors = validateSync(this.get());

      if (validationErrors.length > 0) {
        throw new ConfigValidationException(
          configType,
          validationErrors.toString(),
        );
      }
    }

    isValid(): boolean {
      try {
        this.validate();

        return true;
      } catch {
        return false;
      }
    }

    onModuleInit = () => this.validate();
  }

  return ConfigServiceImpl;
}
