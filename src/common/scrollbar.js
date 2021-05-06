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

let hidePending = 0;
let hideDefault = document.body.classList.contains("hide-scrollbar");

const Scrollbar = {
  html: function () {
    return document.getElementsByTagName("html")[0];
  },
  body: function () {
    return document.body;
  },
  update: function () {
    const htmlEl = this.html();
    const bodyEl = this.body();

    if (!htmlEl || !bodyEl) {
      return;
    }

    if (this.hidden()) {
      htmlEl.setAttribute("class", "overflow-y-hidden");
      bodyEl.classList.add("hide-scrollbar");
    } else {
      htmlEl.removeAttribute("class");
      bodyEl.classList.remove("hide-scrollbar");
    }
  },
  show: function () {
    if (hidePending > 0) {
      hidePending--;
    }

    this.update();
  },
  hide: function () {
    hidePending++;

    this.update();
  },
  hidden: function () {
    return hidePending > 0 || hideDefault;
  },
};

Scrollbar.update();

export default Scrollbar;
