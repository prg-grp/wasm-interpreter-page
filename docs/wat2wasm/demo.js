/*
 * Copyright 2016 WebAssembly Community Group participants
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Split(["#top-left", "#top-right"]);

var features = {};

WabtModule().then(function(wabt) {

var kCompileMinMS = 100;
var outputShowBase16 = false;
var outputShowBase64 = false;
var outputLog;
var outputBase16;
var outputBase64;

var outputEl = document.getElementById('output');
var selectEl = document.getElementById('select');
var downloadEl = document.getElementById('download');
var downloadLink = document.getElementById('downloadLink');
var buildLogEl = document.getElementById('buildLog');
var base16El = document.getElementById('base16');
var base64El = document.getElementById('base64');
var binaryBuffer = null;
var binaryBlobUrl = null;

for (const [f, v] of Object.entries(wabt.FEATURES)) {
  var featureEl = document.getElementById(f);
  featureEl.checked = v;
  featureEl.addEventListener('change', event => {
    var feature = event.target.id;
    features[feature] = event.target.checked;
    onWatChange();
  });
}

var wrappedConsole = Object.create(console);
wrappedConsole.log = (...args) => { console.log(...args); }

var watEditor = CodeMirror((elt) => {
  document.getElementById('top-left').appendChild(elt);
}, {
  mode: 'wast',
  lineNumbers: true,
});

function debounce(f, wait) {
  var lastTime = 0;
  var timeoutId = -1;
  var wrapped = function() {
    var time = +new Date();
    if (time - lastTime < wait) {
      if (timeoutId == -1)
        timeoutId = setTimeout(wrapped, (lastTime + wait) - time);
      return;
    }
    if (timeoutId != -1)
      clearTimeout(timeoutId);
    timeoutId = -1;
    lastTime = time;
    f.apply(null, arguments);
  };
  return wrapped;
}

function compile() {
  outputLog = '';
  outputBase16 = 'Error occured, base16 output is not available';
  outputBase64 = 'Error occured, base64 output is not available';

  var binaryOutput;
  try {
    var module = wabt.parseWat('main.wast', watEditor.getValue(), features);
    module.resolveNames();
    module.validate(features);
    var binaryOutput = module.toBinary({log: true, write_debug_names:true});
    outputLog = binaryOutput.log;
    binaryBuffer = binaryOutput.buffer;
    // binaryBuffer is a Uint8Array, so we need to convert it to a string to use btoa
    // https://stackoverflow.com/questions/12710001/how-to-convert-uint8-array-to-base64-encoded-string
    outputBase16 = 
      // convert Uint8Array to hex string
      Array.from(binaryBuffer).map(b => b.toString(16).padStart(2, '0')).join(' ')
      // add a newline after 10 whitespaces
      .replace(/((?:\S+\s+){10})/g, '$1\n');
    outputBase64 = btoa(String.fromCharCode.apply(null, binaryBuffer));

    var blob = new Blob([binaryOutput.buffer]);
    if (binaryBlobUrl) {
      URL.revokeObjectURL(binaryBlobUrl);
    }
    binaryBlobUrl = URL.createObjectURL(blob);
    downloadLink.setAttribute('href', binaryBlobUrl);
    downloadEl.classList.remove('disabled');
  } catch (e) {
    outputLog += e.toString();
    downloadEl.classList.add('disabled');
  } finally {
    if (module) module.destroy();
    let visibleOutput = outputLog
    if (outputShowBase16) { visibleOutput = outputBase16; }
    if (outputShowBase64) { visibleOutput = outputBase64; }
    outputEl.textContent = visibleOutput;
  }
}

var onWatChange = debounce(compile, kCompileMinMS);

function setExample(index) {
  var example = examples[index];
  watEditor.setValue(example.contents);
  onWatChange();
}

function onSelectChanged(e) {
  setExample(this.selectedIndex);
}

function onDownloadClicked(e) {
  // See https://developer.mozilla.com/en-US/docs/Web/API/MouseEvent
  var event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  downloadLink.dispatchEvent(event);
}

function onBuildLogClicked(e) {
  outputShowBase16 = false;
  outputShowBase64 = false;
  outputEl.textContent = outputLog;
  buildLogEl.style.textDecoration = 'underline';
  base16El.style.textDecoration = 'none';
  base64El.style.textDecoration = 'none';
}

function onBase16Clicked(e) {
  outputShowBase16 = true;
  outputShowBase64 = false;
  outputEl.textContent = outputBase16;
  buildLogEl.style.textDecoration = 'none';
  base16El.style.textDecoration = 'underline';
  base64El.style.textDecoration = 'none';
}

function onBase64Clicked(e) {
  outputShowBase16 = false;
  outputShowBase64 = true;
  outputEl.textContent = outputBase64;
  buildLogEl.style.textDecoration = 'none';
  base16El.style.textDecoration = 'none';
  base64El.style.textDecoration = 'underline';
}

watEditor.on('change', onWatChange);
selectEl.addEventListener('change', onSelectChanged);
downloadEl.addEventListener('click', onDownloadClicked);
buildLogEl.addEventListener('click', onBuildLogClicked );
base16El.addEventListener('click', onBase16Clicked );
base64El.addEventListener('click', onBase64Clicked );

for (var i = 0; i < examples.length; ++i) {
  var example = examples[i];
  var option = document.createElement('option');
  option.textContent = example.name;
  selectEl.appendChild(option);
}
selectEl.selectedIndex = 0;
setExample(selectEl.selectedIndex);
});
