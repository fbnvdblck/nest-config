import { Type } from '@nestjs/common';
import { ConfigFactoryKeyHost, registerAs } from '@nestjs/config';
import { ConfigKeyNotFoundException } from '../exceptions/config';
import { OmitFunctionProperties } from '../types/function';
import { ConfigServiceType } from '../services';

export const CONFIG_METADATA_KEY = 'config:key';

export abstract class Config {
  toString(): string {
    return JSON.stringify(this);
  }
}

export type ConfigKey = string;

export type ConfigType<C extends Config> = Type<C>;

export type ConfigData<C extends Config> = Readonly<OmitFunctionProperties<C>>;

export type ConfigValue<C extends Config> = () => Readonly<C>;

export type InitialConfigValue<C extends Config> = () => ConfigData<C>;

export type ConfigFactory<C extends Config> = InitialConfigValue<C> &
  ConfigFactoryKeyHost<ConfigData<C>>;

export function getConfigKey<C extends Config>(
  configType: ConfigType<C>,
): ConfigKey | never {
  const configKey = Reflect.getMetadata(CONFIG_METADATA_KEY, configType);

  if (!configKey) {
    throw new ConfigKeyNotFoundException(configType);
  }

  return configKey;
}

export function register<C extends Config>(
  configType: ConfigType<C>,
  configServiceType: ConfigServiceType<C>,
  initialConfigValue: InitialConfigValue<C>,
): RegisteredConfig<C> {
  return new RegisteredConfig(
    registerAs(getConfigKey(configType), initialConfigValue),
    configServiceType,
  );
}

export class RegisteredConfig<C extends Config> {
  constructor(
    readonly factory: ConfigFactory<C>,
    readonly serviceType: ConfigServiceType<C>,
  ) {}
}
