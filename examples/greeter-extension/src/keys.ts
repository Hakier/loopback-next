import {BindingKey} from '@loopback/core';
import {GreeterExtensionPoint} from './greeter-extension-point';

// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/example-log-extension
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

export const GREETER_EXTENSION_POINT = BindingKey.create<GreeterExtensionPoint>(
  'greeter-extension-point',
);
