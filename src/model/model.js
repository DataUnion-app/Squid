/*

Copyright (c) 2018 - 2021 Michael Mayer <hello@photoprism.org>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

    PhotoPrism® is a registered trademark of Michael Mayer.  You may use it as required
    to describe our software, run your own server, for educational purposes, but not for
    offering commercial goods, products, or services without prior written permission.
    In other words, please ask.

Feel free to send an e-mail to hello@photoprism.org if you have questions,
want to support our work, or just want to say hello.

Additional information can be found in our Developer Guide:
https://docs.photoprism.org/developer-guide/

*/

export class Model {
  constructor(values) {
    this.__originalValues = {};

    if (values) {
      this.setValues(values);
    } else {
      this.setValues(this.getDefaults());
    }
  }

  setValues(values, scalarOnly) {
    if (!values) return;

    for (let key in values) {
      if (values.hasOwnProperty(key) && key !== "__originalValues") {
        this[key] = values[key];

        if (typeof values[key] !== "object") {
          this.__originalValues[key] = values[key];
        } else if (!scalarOnly) {
          this.__originalValues[key] = JSON.parse(JSON.stringify(values[key]));
        }
      }
    }

    return this;
  }

  getValues(changed) {
    const result = {};
    const defaults = this.getDefaults();

    for (let key in this.__originalValues) {
      if (this.__originalValues.hasOwnProperty(key) && key !== "__originalValues") {
        let val;
        if (defaults.hasOwnProperty(key)) {
          switch (typeof defaults[key]) {
            case "string":
              if (this[key] === null || this[key] === undefined) {
                val = "";
              } else {
                val = this[key];
              }
              break;
            case "bigint":
            case "number":
              val = parseFloat(this[key]);
              break;
            case "boolean":
              val = !!this[key];
              break;
            default:
              val = this[key];
          }
        } else {
          val = this[key];
        }

        if (!changed || JSON.stringify(val) !== JSON.stringify(this.__originalValues[key])) {
          result[key] = val;
        }
      }
    }

    return result;
  }

  wasChanged() {
    const changed = this.getValues(true);

    if (!changed) {
      return false;
    }

    return !(changed.constructor === Object && Object.keys(changed).length === 0);
  }

  getDefaults() {
    return {};
  }
}

export default Model;
