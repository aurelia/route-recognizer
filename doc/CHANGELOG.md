<a name="1.3.1"></a>
## [1.3.1](https://github.com/aurelia/route-recognizer/compare/1.3.0...1.3.1) (2018-11-20)



<a name="1.3.0"></a>
# [1.3.0](https://github.com/aurelia/route-recognizer/compare/1.2.0...1.3.0) (2018-11-20)


### Features

* **route-recognizer:** Support generating a route by route config in addition to name ([ba9eb61](https://github.com/aurelia/route-recognizer/commit/ba9eb61))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/aurelia/route-recognizer/compare/1.1.1...1.2.0) (2018-06-14)


### Bug Fixes

* Require leading slashes to optional segments ([27f72a5](https://github.com/aurelia/route-recognizer/commit/27f72a5))



<a name="1.1.1"></a>
## [1.1.1](https://github.com/aurelia/route-recognizer/compare/1.1.0...1.1.1) (2017-10-01)

### Bug Fixes

* Improve TypeScript types
* Remove unnecessary return statement

<a name="1.1.0"></a>
# [1.1.0](https://github.com/aurelia/route-recognizer/compare/1.0.0...v1.1.0) (2016-09-22)

#### Features

* Support Optional Parameters with :paramName?

<a name="1.0.0"></a>
# [1.0.0](https://github.com/aurelia/route-recognizer/compare/1.0.0-rc.1.0.1...v1.0.0) (2016-07-27)


### Bug Fixes

* **route-recognizer:** use href for generation only when specified ([97b377b](https://github.com/aurelia/route-recognizer/commit/97b377b)), closes [#24](https://github.com/aurelia/route-recognizer/issues/24)



<a name="1.0.0-rc.1.0.1"></a>
# [1.0.0-rc.1.0.1](https://github.com/aurelia/route-recognizer/compare/1.0.0-rc.1.0.0...v1.0.0-rc.1.0.1) (2016-07-12)


### Bug Fixes

* **route-recognizer:** respect explicit href during generation ([335f2a7](https://github.com/aurelia/route-recognizer/commit/335f2a7))



<a name="1.0.0-rc.1.0.0"></a>
# [1.0.0-rc.1.0.0](https://github.com/aurelia/route-recognizer/compare/1.0.0-beta.2.0.1...v1.0.0-rc.1.0.0) (2016-06-22)



### 1.0.0-beta.1.2.1 (2016-05-10)


#### Bug Fixes

* **route-recognizer:** route recognizer is case insensitive by default ([d89cde4c](http://github.com/aurelia/route-recognizer/commit/d89cde4c8abd104f8c8dcbdc4aed799be3b78555))


### 1.0.0-beta.1.2.0 (2016-03-22)

* Update to Babel 6

### 1.0.0-beta.1.1.3 (2016-03-02)


#### Bug Fixes

* **for-of:** remove for of loop ([adc9e312](http://github.com/aurelia/route-recognizer/commit/adc9e3122a7499cdde71206ef45026dd14129cbf))


### 1.0.0-beta.1.1.2 (2016-03-01)


#### Bug Fixes

* **all:** remove core-js dependency ([7f97b087](http://github.com/aurelia/route-recognizer/commit/7f97b08711f0b89e86b9a09d399f6e026685c200))
* **bower:** remove core-js ([12879fa7](http://github.com/aurelia/route-recognizer/commit/12879fa754cc0b0503e066b84bc234b9ab9863cb))


#### Features

* **route-recognizer:** Support multiple names per route ([6b5637d2](http://github.com/aurelia/route-recognizer/commit/6b5637d296af90127dd293d975592c7e62182a2f))


### 1.0.0-beta.1.1.1 (2016-02-08)


### 1.0.0-beta.1.1.0 (2016-01-29)


#### Features

* **all:** update jspm meta; core-js; aurelia deps ([59b29532](http://github.com/aurelia/route-recognizer/commit/59b295320c66d2757cbeda708f09e2c49940214f))


### 1.0.0-beta.1 (2015-11-16)


## 0.9.0 (2015-11-10)


## 0.8.0 (2015-10-13)


#### Bug Fixes

* **all:** update compiler ([6f834b02](http://github.com/aurelia/route-recognizer/commit/6f834b024305991ceb8878b76456801aacfe590a))
* **build:**
  * update linting, testing and tools ([f49bf0d3](http://github.com/aurelia/route-recognizer/commit/f49bf0d3db3bb453807b60f4eb1c673dec945a16))
  * add missing bower bump ([600b7409](http://github.com/aurelia/route-recognizer/commit/600b7409d92557444c4c855340089b8b8c39f980))
* **package:**
  * update aurelia tools and dts generator ([1786cd45](http://github.com/aurelia/route-recognizer/commit/1786cd45b6bc867bae053d4ad7d4da058f8777fb))
  * change jspm directories ([43b094ce](http://github.com/aurelia/route-recognizer/commit/43b094ce4343f47436bb44d72d55e0750fbd85d6))
* **route-recognizer:**
  * Use correct import for core-js We were previously using `import core from core-j ([d37d1687](http://github.com/aurelia/route-recognizer/commit/d37d1687f7e4109e4175505ceaae8bccc356257c))
  * ensure required route segments are specified when generating ([513aeeb7](http://github.com/aurelia/route-recognizer/commit/513aeeb73dc68370d7b6bb0db96eabb37a7b96d0))
  * allow unnamed routes to be registered ([240a9e2d](http://github.com/aurelia/route-recognizer/commit/240a9e2db07b27623cdebb64ef4a4473a7996317))
  * fix bug where array keys were not encoded in querystrings ([f5019d95](http://github.com/aurelia/route-recognizer/commit/f5019d9578bdb530def082e2960d4906e42ca784))
  * adjust querystring parsing for several edge cases ([10664338](http://github.com/aurelia/route-recognizer/commit/10664338180ec01d67ebf62f39794913762280bb))
  * require route names to be specified ([a62cd3b8](http://github.com/aurelia/route-recognizer/commit/a62cd3b854962576456db82209a1294cc77f4797))
  * fix bug preventing uri generation from working ([e04351dd](http://github.com/aurelia/route-recognizer/commit/e04351dd27fbc4e8283f3bfd97709263c60d4f1d))
* **tests:** correct import source ([dbb913c9](http://github.com/aurelia/route-recognizer/commit/dbb913c9b326b82a47fdab6f39dfc8e6b1ab5d82))


#### Features

* **all:**
  * more type info ([e11312e3](http://github.com/aurelia/route-recognizer/commit/e11312e3ed7325a4ef4b9dd56fc9353d3adb610c))
  * working on improving d.ts generation ([60b547a8](http://github.com/aurelia/route-recognizer/commit/60b547a885dafd2932e5d25a301f14b542151606))
* **build:**
  * d.ts building from babel ([503776f6](http://github.com/aurelia/route-recognizer/commit/503776f6fd3ee970a93e558a92e956494993807e))
  * initial work on dts generation ([3af59915](http://github.com/aurelia/route-recognizer/commit/3af599153e7a5e339990ff4cbff0149efe02ff5e))
  * update compiler and switch to register module format ([8b31d638](http://github.com/aurelia/route-recognizer/commit/8b31d63808ee8cd11fea144d91ca9ec65d829f4f))
* **docs:** generate api.json from .d.ts file ([e5441c97](http://github.com/aurelia/route-recognizer/commit/e5441c970d741edd42322c70a3abb2d514c69fa4))
* **route-recognizer:**
  * use query string helpers from aurelia-path ([a96f5a0f](http://github.com/aurelia/route-recognizer/commit/a96f5a0f01cf64182ec09da1d064b67245ae59bf))
  * don't encode '$' in query string keys ([b7aca7fd](http://github.com/aurelia/route-recognizer/commit/b7aca7fd2a44998b1708f32807a737dbd23e0f1e))
  * return the registered state from add ([293d8417](http://github.com/aurelia/route-recognizer/commit/293d841797c3b36d2d32b74c2999670db0251e22))
  * automatically add unused route generation params to the query string ([c3c8a3e7](http://github.com/aurelia/route-recognizer/commit/c3c8a3e767a3ea05cf8e1ed207584f2efa6b1995), closes [#3](http://github.com/aurelia/route-recognizer/issues/3))


## 0.7.0 (2015-09-04)


#### Bug Fixes

* **build:** update linting, testing and tools ([f49bf0d3](http://github.com/aurelia/route-recognizer/commit/f49bf0d3db3bb453807b60f4eb1c673dec945a16))


#### Features

* **docs:** generate api.json from .d.ts file ([e5441c97](http://github.com/aurelia/route-recognizer/commit/e5441c970d741edd42322c70a3abb2d514c69fa4))
* **route-recognizer:** use query string helpers from aurelia-path ([a96f5a0f](http://github.com/aurelia/route-recognizer/commit/a96f5a0f01cf64182ec09da1d064b67245ae59bf))


### 0.6.2 (2015-08-14)


#### Bug Fixes

* **route-recognizer:** Use correct import for core-js We were previously using `import core from core-j ([d37d1687](http://github.com/aurelia/route-recognizer/commit/d37d1687f7e4109e4175505ceaae8bccc356257c))


#### Features

* **all:** more type info ([e11312e3](http://github.com/aurelia/route-recognizer/commit/e11312e3ed7325a4ef4b9dd56fc9353d3adb610c))


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
