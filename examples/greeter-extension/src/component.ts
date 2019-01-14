// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/example-greeter-extension
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {createBindingFromClass} from '@loopback/context';
import {Component} from '@loopback/core';
import {GreeterExtensionPoint} from './greeter-extension-point';
import {ChineseGreeter} from './greeters/greeter-cn';
import {EnglishGreeter} from './greeters/greeter-en';
import {GREETER_EXTENSION_POINT} from './keys';

/**
 * Define a component to register the greeter extension point and built-in
 * extensions
 */
export class GreeterComponent implements Component {
  bindings = [
    createBindingFromClass(GreeterExtensionPoint, {
      key: GREETER_EXTENSION_POINT,
    }),
    createBindingFromClass(EnglishGreeter),
    createBindingFromClass(ChineseGreeter),
  ];
}
