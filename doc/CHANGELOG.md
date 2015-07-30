### 0.6.1 (2015-07-29)

* improve output file name

## 0.6.0 (2015-07-02)


#### Bug Fixes

* **package:** update aurelia tools and dts generator ([1786cd45](http://github.com/aurelia/route-recognizer/commit/1786cd45b6bc867bae053d4ad7d4da058f8777fb))
* **tests:** correct import source ([dbb913c9](http://github.com/aurelia/route-recognizer/commit/dbb913c9b326b82a47fdab6f39dfc8e6b1ab5d82))


#### Features

* **all:** working on improving d.ts generation ([60b547a8](http://github.com/aurelia/route-recognizer/commit/60b547a885dafd2932e5d25a301f14b542151606))
* **build:**
  * d.ts building from babel ([503776f6](http://github.com/aurelia/route-recognizer/commit/503776f6fd3ee970a93e558a92e956494993807e))
  * initial work on dts generation ([3af59915](http://github.com/aurelia/route-recognizer/commit/3af599153e7a5e339990ff4cbff0149efe02ff5e))


## 0.5.0 (2015-06-08)


#### Features

* **route-recognizer:** don't encode '$' in query string keys ([b7aca7fd](http://github.com/aurelia/route-recognizer/commit/b7aca7fd2a44998b1708f32807a737dbd23e0f1e))


## 0.4.0 (2015-04-30)

* **all:** update compilation process


## 0.3.0 (2015-04-09)


#### Bug Fixes

* **all:** update compiler ([6f834b02](http://github.com/aurelia/route-recognizer/commit/6f834b024305991ceb8878b76456801aacfe590a))
* **route-recognizer:**
  * ensure required route segments are specified when generating ([513aeeb7](http://github.com/aurelia/route-recognizer/commit/513aeeb73dc68370d7b6bb0db96eabb37a7b96d0))
  * allow unnamed routes to be registered ([240a9e2d](http://github.com/aurelia/route-recognizer/commit/240a9e2db07b27623cdebb64ef4a4473a7996317))
  * fix bug where array keys were not encoded in querystrings ([f5019d95](http://github.com/aurelia/route-recognizer/commit/f5019d9578bdb530def082e2960d4906e42ca784))
  * adjust querystring parsing for several edge cases ([10664338](http://github.com/aurelia/route-recognizer/commit/10664338180ec01d67ebf62f39794913762280bb))
  * require route names to be specified ([a62cd3b8](http://github.com/aurelia/route-recognizer/commit/a62cd3b854962576456db82209a1294cc77f4797))
  * fix bug preventing uri generation from working ([e04351dd](http://github.com/aurelia/route-recognizer/commit/e04351dd27fbc4e8283f3bfd97709263c60d4f1d))


#### Features

* **route-recognizer:**
  * return the registered state from add ([293d8417](http://github.com/aurelia/route-recognizer/commit/293d841797c3b36d2d32b74c2999670db0251e22))
  * automatically add unused route generation params to the query string ([c3c8a3e7](http://github.com/aurelia/route-recognizer/commit/c3c8a3e767a3ea05cf8e1ed207584f2efa6b1995), closes [#3](http://github.com/aurelia/route-recognizer/issues/3))


### 0.2.4 (2015-02-28)


#### Bug Fixes

* **package:** change jspm directories ([43b094ce](http://github.com/aurelia/route-recognizer/commit/43b094ce4343f47436bb44d72d55e0750fbd85d6))


### 0.2.3 (2015-02-28)


#### Bug Fixes

* **build:** add missing bower bump ([600b7409](http://github.com/aurelia/route-recognizer/commit/600b7409d92557444c4c855340089b8b8c39f980))


### 0.2.2 (2015-01-22)

* Update compiler.

### 0.2.1 (2015-01-12)

* Update compiled output.

## 0.2.0 (2015-01-06)


#### Features

* **build:** update compiler and switch to register module format ([8b31d638](http://github.com/aurelia/route-recognizer/commit/8b31d63808ee8cd11fea144d91ca9ec65d829f4f))
