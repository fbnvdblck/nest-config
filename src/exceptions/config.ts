import { Config, ConfigType } from '../models/config';

export abstract class ConfigException<C extends Config> extends Error {
  constructor(
    readonly configType: ConfigType<C>,
    readonly message: string,
  ) {
    super(`[Config '${configType.name}'] ${message}`);
  }
}

export class ConfigKeyNotFoundException<
  C extends Config,
> extends ConfigException<C> {
  constructor(readonly configType: ConfigType<C>) {
    super(configType, 'Key not found');
  }
}

export class ConfigValueNotFoundException<
  C extends Config,
> extends ConfigException<C> {
  constructor(readonly configType: ConfigType<C>) {
    super(configType, 'Value not found');
  }
}

export class ConfigValidationException<
  C extends Config,
> extends ConfigException<C> {
  constructor(
    readonly configType: ConfigType<C>,
    validationMessage: string,
  ) {
    super(
      configType,
      'One or several validation errors occurred: ' + validationMessage,
    );
  }
}
