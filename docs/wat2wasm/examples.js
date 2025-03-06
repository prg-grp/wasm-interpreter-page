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

var examples = [
  {
    name: 'main',
    contents:
`(module
  (func (export "main") (result i32)
    ;; Instruction ;; Stack ;; Explanation
    i32.const 1    ;; [1]   ;; push an i32 with value 1
    return
  ))
`,
  },
  {
    name: 'I32Add',
    contents:
`(module
  (func (export "main") (result i32)
    ;; Instruction ;; Stack ;; Explanation
    i32.const 1    ;; [1]   ;; push an i32 with value 1
    i32.const 2    ;; [2 1] ;; push an i32 with value 2
    i32.add        ;; [3]   ;; pop y:i32 and x:i32; push x + y
    return
  ))
`,
  },
  {
    name: 'I32Sub',
    contents:
`(module
  (func (export "main") (result i32)
    ;; Instruction ;; Stack ;; Explanation
    i32.const 1    ;; [1]   ;; push an i32 with value 1
    i32.const 2    ;; [2 1] ;; push an i32 with value 2
    i32.sub        ;; [-1]  ;; pop y:i32 and x:i32; push x - y
    return
  ))
`,
  },
  {
    name: 'I32Mod',
    contents:
`(module
  (func (export "main") (result i32)
    ;; Instruction ;; Stack ;; Explanation
    i32.const 9    ;; [9]   ;; push an i32 with value 9
    i32.const 5    ;; [5 9] ;; push an i32 with value 5
    i32.mod        ;; [4]   ;; pop y:i32 and x:i32; push x % y
    i32.const 3    ;; [3 4] ;; push an i32 with value 3
    i32.mod        ;; [1]   ;; pop y:i32 and x:i32; push x % y
    return
  ))
`,
  },
  {
    name: 'I32ModBy0',
    contents:
`(module
  (func (export "main") (result i32)
    ;; Instruction ;; Stack ;; Explanation
    i32.const 9    ;; [9]   ;; push an i32 with value 9
    i32.const 0    ;; [0 9] ;; push an i32 with value 0
    i32.mod        ;; X     ;; error: divide by zero
    return
  ))
`,
  },
  {
    name: 'I32Pow',
    contents:
`(module
  (func (export "main") (result i32)
    ;; Instruction ;; Stack ;; Explanation
    i32.const 3    ;; [3]   ;; push an i32 with value 3
    i32.const 2    ;; [2 3] ;; push an i32 with value 2
    i32.pow        ;; [9]   ;; pop y:i32 and x:i32; push x^y
    return
  ))
`,
  },
  {
    name: 'I32PowBy0',
    contents:
`(module
  (func (export "main") (result i32)
    ;; Instruction ;; Stack ;; Explanation
    i32.const 3    ;; [3]   ;; push an i32 with value 3
    i32.const 0    ;; [0 3] ;; push an i32 with value 0
    i32.pow        ;; [1]   ;; pop y:i32 and x:i32; push x^y
    return
  ))
`,
  },
  {
    name: 'Copy',
    contents:
`(module
  (func (export "main") (result i32)
    ;; Instruction ;; Stack ;; Explanation
    i32.const 3    ;; [3]   ;; push an i32 with value 3
    copy           ;; [3 3] ;; duplicate the top of the stack
    i32.add        ;; [6]   ;; pop y:i32 and x:i32; push x + y
    copy           ;; [6 6] ;; duplicate the top of the stack
    i32.add        ;; [12]  ;; pop y:i32 and x:i32; push x + y
    return
  ))
`,
  },
  {
    name: 'LoopN',
    contents:
`(module
  (func (export "main") (result i32)
    ;; Instruction ;; Stack       ;; Explanation
    i32.const 1    ;; [1]         ;; push an i32 with value 1
    i32.const 2    ;; [2 1]       ;; push an i32 with value 2
    i32.const 3    ;; [3 2 1]     ;; push an i32 with value 3
    i32.const 4    ;; [4 3 2 1]   ;; push an i32 with value 4
    i32.const 3    ;; [3 4 3 2 1] ;; push an i32 with value 3
    loopn          ;; [4 3 2 1]   ;; pop x:i32; execute the following instruction x times
    i32.add        ;; [10]        
    return
  ))
`,
  },
  {
    name: 'FunMacro',
    contents:
`(module
  (func (export "main") (result i32)
    ;; Instruction ;; Stack       ;; Explanation
    i32.const 0    ;; [0]         ;; push an i32 with value 0
    beginfm        ;; []          ;; pop x:i32; create a new global FunMacro x
    copy           ;; []          ;; 
    i32.add        ;; []          ;; 
    endfm          ;; []          ;; end of body of FunMacro x

    i32.const 2    ;; [2]         ;; push an i32 with value 2
    i32.const 0    ;; [0 2]       ;; push an i32 with value 0
    callfm         ;; [4]         ;; pop x:i32; execute body of FunMacro x
    i32.const 0    ;; [0 4]       ;; push an i32 with value 0
    callfm         ;; [8]         ;; pop x:i32; execute body of FunMacro x
    i32.const 0    ;; [0 8]       ;; push an i32 with value 0
    callfm         ;; [16]        ;; pop x:i32; execute body of FunMacro x
    return
  ))
`,
  },
];
