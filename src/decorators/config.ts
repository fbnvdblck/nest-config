import { applyDecorators, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { CONFIG_METADATA_KEY, ConfigKey, RegisteredConfig } from '../models';

export function RootConfig(configKey: ConfigKey): ClassDecorator {
  return (configType) =>
    Reflect.defineMetadata(CONFIG_METADATA_KEY, configKey, configType);
}

export function NestedConfig(options?: NestedConfigOptions): PropertyDecorator {
  return (target, propertyKey) => {
    const configType = Reflect.getMetadata('design:type', target, propertyKey);

    applyDecorators(
      ...[
        Type(() => configType),
        IsObject(),
        ValidateNested(),
        ...(options?.optional ? [IsOptional()] : []),
      ],
    );
  };
}

export interface NestedConfigOptions {
  optional?: boolean;
}

export function ConfigRegistryModule(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...registeredConfigs: RegisteredConfig<any>[]
): ClassDecorator {
  const configFactories = registeredConfigs.map((rc) => rc.factory);
  const configServiceTypes = registeredConfigs.map((rc) => rc.serviceType);

  return applyDecorators(
    Module({
      imports: [
        NestConfigModule.forRoot({
          load: configFactories,
        }),
      ],
      providers: configServiceTypes,
      exports: configServiceTypes,
    }),
  );
}
