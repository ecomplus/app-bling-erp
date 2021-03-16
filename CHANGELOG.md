# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.3.9](https://github.com/ecomplus/application-starter/compare/v1.3.8...v1.3.9) (2021-03-16)


### Bug Fixes

* **export-order:** prevent recreating "removed" bling orders automatically ([b9419b1](https://github.com/ecomplus/application-starter/commit/b9419b1937391824993bea3f76a9d692bdae8068))

### [1.3.8](https://github.com/ecomplus/application-starter/compare/v1.3.7...v1.3.8) (2021-03-08)


### Bug Fixes

* **deps:** update all non-major dependencies ([#12](https://github.com/ecomplus/application-starter/issues/12)) ([6d791b8](https://github.com/ecomplus/application-starter/commit/6d791b865ffc4f8b254a47e1d160ac3a5d0f2e64))
* **export-order:** limit Bling product `item.codigo` to 40 chars ([#22](https://github.com/ecomplus/application-starter/issues/22)) ([416c4c4](https://github.com/ecomplus/application-starter/commit/416c4c432b3763b6aec20ed6ddd8430763160d11))
* **export-product:** check Bling product `produtoLoja` to update price ([c382d90](https://github.com/ecomplus/application-starter/commit/c382d90b05c8caf04338444124cb0997397ae937))
* **import-product:** bling product field `descricaoCurta` may be null, prevent type error ([#19](https://github.com/ecomplus/application-starter/issues/19)) ([2caea15](https://github.com/ecomplus/application-starter/commit/2caea1573a1e12e177cbe04ffc3f7a769de5b07d))

### [1.3.7](https://github.com/ecomplus/application-starter/compare/v1.3.6...v1.3.7) (2021-02-16)


### Bug Fixes

* **bling-client:** better debugging bling error responses (err stack msg) ([95b454c](https://github.com/ecomplus/application-starter/commit/95b454ca27457e62dbcf658a4bfb57510b685de5))
* **deps:** update all non-major dependencies ([#10](https://github.com/ecomplus/application-starter/issues/10)) ([3d091b0](https://github.com/ecomplus/application-starter/commit/3d091b0ea778b6ca10b2307d26ed105c7288f8d8))
* **import-product:** limit `short_description` string length ([#9](https://github.com/ecomplus/application-starter/issues/9)) ([0e239be](https://github.com/ecomplus/application-starter/commit/0e239becc75d431e8830651116c6dd7d733623cc))

### [1.3.6](https://github.com/ecomplus/application-starter/compare/v1.3.5...v1.3.6) (2021-02-03)


### Bug Fixes

* **import-all-product:** skip importing variations as products ([1450574](https://github.com/ecomplus/application-starter/commit/14505746a13ec1996842ccbc12e2c1cc62228ae0))

### [1.3.5](https://github.com/ecomplus/application-starter/compare/v1.3.4...v1.3.5) (2021-02-03)


### Bug Fixes

* **import-product:** fix pushing new variations to imported product on parse ([9b54cd7](https://github.com/ecomplus/application-starter/commit/9b54cd76af8c1dda377e85a00a08760cd2a7040f))

### [1.3.4](https://github.com/ecomplus/application-starter/compare/v1.3.3...v1.3.4) (2021-02-03)


### Bug Fixes

* **import-product:** ensure description fields as string on parse ([eeb9912](https://github.com/ecomplus/application-starter/commit/eeb99126bfd567bee44083218c3117d2c2bfbc7a))

### [1.3.3](https://github.com/ecomplus/application-starter/compare/v1.3.2...v1.3.3) (2021-02-03)


### Bug Fixes

* **import-all-products:** prevent adding empty sku ([b640202](https://github.com/ecomplus/application-starter/commit/b6402021fdc8da336ef53cbe763d468b1758f4b3))
* **import-all-products:** prevent sending response twice ([c223202](https://github.com/ecomplus/application-starter/commit/c2232026fee2ecfb473bbc9ff127b78cec2f18e6))

### [1.3.2](https://github.com/ecomplus/application-starter/compare/v1.3.1...v1.3.2) (2021-02-03)


### Bug Fixes

* **import-all-products:** endpoint with 'get' method ([f1823c4](https://github.com/ecomplus/application-starter/commit/f1823c47dd4d2a8190e92dc3a3014bfea5ee2e20))

### [1.3.1](https://github.com/ecomplus/application-starter/compare/v1.3.0...v1.3.1) (2021-02-03)


### Bug Fixes

* **export-order:** ensure exiting job when order not found and can't create new one ([b97de40](https://github.com/ecomplus/application-starter/commit/b97de406db7a9e0a876558d76ed9baf0bffd4c2f))

## [1.3.0](https://github.com/ecomplus/application-starter/compare/v1.2.7...v1.3.0) (2021-02-03)


### Features

* **admin-settings:** add 'random_order_number' config option ([a117635](https://github.com/ecomplus/application-starter/commit/a1176357947219e25883fc79659b42e9ea718525))
* **import-all-products:** endpoint to mannually trigger import all from bling ([04445bf](https://github.com/ecomplus/application-starter/commit/04445bf8225fb312b68b224ea67a16c31dd18eee))


### Bug Fixes

* **clear-order-states:** add delay for firestore delete operations ([5825218](https://github.com/ecomplus/application-starter/commit/582521867c2eac644738aa8ad7b62076ff07e286))
* **clear-order-states:** add delay for firestore operations ([0730d1c](https://github.com/ecomplus/application-starter/commit/0730d1cbe67cdc6c035608f392ba1e40e7b892de))
* **clear-order-states:** prevent firestore DEADLINE_EXCEEDED error ([057c486](https://github.com/ecomplus/application-starter/commit/057c4862222eaa3d3a844e722a4cfa750aef1a51))
* **clear-order-states:** try to prevent `Cannot read property '_settings' of undefined` error ([6ba39a7](https://github.com/ecomplus/application-starter/commit/6ba39a79d73f22a521d0485782a2110a1f58b23c))
* **export-order:** user original order number by default when not already used ([b379efe](https://github.com/ecomplus/application-starter/commit/b379efe2196cfab6668f5986bd42ba6d88576195))
* **functions:** must fix additional scheduled function name ([e277f92](https://github.com/ecomplus/application-starter/commit/e277f92e8a20ad8572f13159e695298b7054af4a))
* **import-all-products:** fix require paths ([ad2f2c3](https://github.com/ecomplus/application-starter/commit/ad2f2c35d897c17b7b542eb450dfa62959296bac))
* **import-product:** ensure uploaded image has extension on filename ([1a1f5f7](https://github.com/ecomplus/application-starter/commit/1a1f5f707fc620b09abec6ca7b87ebecaf2b88b4))
* **import-product:** ensure uploaded image has extension on filename ([8f2ff1a](https://github.com/ecomplus/application-starter/commit/8f2ff1ab663ce8f929a2244d668486322e71b180))
* **import-product:** ensure uploaded pictures has 'normal' thumb size ([809db6e](https://github.com/ecomplus/application-starter/commit/809db6e90258f53222e55270409634d6f12d204e))
* **order-states:** clear documents older than 1 day ([03a0d6b](https://github.com/ecomplus/application-starter/commit/03a0d6b9e678ff2e6c5ff8505d60a5944cf40cf8))

### [1.2.7](https://github.com/ecomplus/application-starter/compare/v1.2.6...v1.2.7) (2021-02-02)


### Bug Fixes

* **deps:** update @ecomplus/application-sdk to v1.14.2 ([9dfc68e](https://github.com/ecomplus/application-starter/commit/9dfc68ebbf56d5f53f23ba7d34f3962ec4bc1488))
* **deps:** update/ddp all non-major dependencies ([565bbed](https://github.com/ecomplus/application-starter/commit/565bbedc0dd081a86d4db185da3789edadf26d8e))

### [1.2.6](https://github.com/ecomplus/application-starter/compare/v1.2.5...v1.2.6) (2021-01-21)


### Bug Fixes

* **export-order:** bling order number must be unique (multi store not respected here) ([c7aa153](https://github.com/ecomplus/application-starter/commit/c7aa153e6eaffa4e98b49ebe85b01e74ac6f2258))

### [1.2.5](https://github.com/ecomplus/application-starter/compare/v1.2.4...v1.2.5) (2021-01-13)


### Bug Fixes

* **response:** prevent resending response on header sent ([04d4270](https://github.com/ecomplus/application-starter/commit/04d42704608e3ce4410774e7e0fbdca5f7f68d27))
* **server:** try to force urlencoded parse (any mime) for bling callback endpoint ([e786d52](https://github.com/ecomplus/application-starter/commit/e786d520f4fa3fb422bb4afa5bef3e598deb9e88))
* **server:** try to force urlencoded parse (any mime) for bling callback endpoint ([80f4fd1](https://github.com/ecomplus/application-starter/commit/80f4fd1da5697c7b60e391284120fcc646df7c2e))
* **server:** try to force urlencoded parse (any mime) for bling callback endpoint ([c3fe55b](https://github.com/ecomplus/application-starter/commit/c3fe55b08f8568aa44f18c7fc281ae917b4e5393))

### [1.2.4](https://github.com/ecomplus/application-starter/compare/v1.2.3...v1.2.4) (2021-01-12)


### Bug Fixes

* **import-product:** must set 'imagem' param to bling get request ([#8](https://github.com/ecomplus/application-starter/issues/8)) ([5f5f64f](https://github.com/ecomplus/application-starter/commit/5f5f64fc628badc4960e2cd9f8d5521e1bb49d0c))

### [1.2.3](https://github.com/ecomplus/application-starter/compare/v1.2.2...v1.2.3) (2021-01-11)


### Bug Fixes

* **product-parse:** better handling bling description fields (bad names :neutral_face:) ([b7dfe7b](https://github.com/ecomplus/application-starter/commit/b7dfe7b2fe47bd86e0f1bb3dd34d4e98b6a2356f))

### [1.2.2](https://github.com/ecomplus/application-starter/compare/v1.2.1...v1.2.2) (2021-01-11)


### Bug Fixes

* **import-product:** prevent calling `product.variations` with undefined product ([0555980](https://github.com/ecomplus/application-starter/commit/05559803b2d8008c7d55f1b13fe1d62e4188778b))

### [1.2.1](https://github.com/ecomplus/application-starter/compare/v1.2.0...v1.2.1) (2021-01-07)


### Bug Fixes

* **import-order:** syntax fix while handling response from bling invoice ([855527b](https://github.com/ecomplus/application-starter/commit/855527b52e59686a4aae77d935818f5a78e13988))

## [1.2.0](https://github.com/ecomplus/application-starter/compare/v1.1.6...v1.2.0) (2021-01-07)


### Features

* **import-order:** also read invoice link and try key from bling invoices endpoint ([8429f8b](https://github.com/ecomplus/application-starter/commit/8429f8b9a1a0ffa786007b40988a21679faada4c))

### [1.1.6](https://github.com/ecomplus/application-starter/compare/v1.1.5...v1.1.6) (2020-12-21)


### Bug Fixes

* **import-order:** try to fix bling invoices requests (remove white space) ([f22f23a](https://github.com/ecomplus/application-starter/commit/f22f23ae457d023b7b185973fbd0856547c5edfa))

### [1.1.5](https://github.com/ecomplus/application-starter/compare/v1.1.4...v1.1.5) (2020-12-21)


### Bug Fixes

* **import-order:** prevent erro with not found bling invoices ([c9c040c](https://github.com/ecomplus/application-starter/commit/c9c040c984c7d54ab873c56af001cfe54e8dec80))

### [1.1.4](https://github.com/ecomplus/application-starter/compare/v1.1.3...v1.1.4) (2020-12-21)


### Bug Fixes

* **bling-callback:** prevent unhandled promise rejection ([c440a34](https://github.com/ecomplus/application-starter/commit/c440a34e4185311b463452dbdd1bec3bb102142e))
* **import-order:** ignore order when when bling 'codigo loja' doesn't match ([412210e](https://github.com/ecomplus/application-starter/commit/412210e338072ea0b8b51662d7ac96ce3f9e8676))
* **import-product:** check all stock updates, delete old ones ([4bc7289](https://github.com/ecomplus/application-starter/commit/4bc72894a3af420c2e2df539666c80357de1629e))

### [1.1.3](https://github.com/ecomplus/application-starter/compare/v1.1.2...v1.1.3) (2020-12-10)


### Bug Fixes

* **export-product:** fix parsing variations with more than one attribute (git title) ([da5ca64](https://github.com/ecomplus/application-starter/commit/da5ca6447f133acccd2a7c10d37c88110f2977f6))

### [1.1.2](https://github.com/ecomplus/application-starter/compare/v1.1.1...v1.1.2) (2020-12-10)


### Bug Fixes

* **import-order:** also check tracking code from 'codigosRastreamento' (not documented) and invoices ([d3a8f58](https://github.com/ecomplus/application-starter/commit/d3a8f583ee4a7a2748e1070ad6691c201a00a025))
* **parse-status:** edit status maps ([8f5aa42](https://github.com/ecomplus/application-starter/commit/8f5aa42ec8c4752d9fe8079ec180cef617eda0f4))

### [1.1.1](https://github.com/ecomplus/application-starter/compare/v1.1.0...v1.1.1) (2020-12-08)


### Bug Fixes

* **bling-callback:** ignore stock callbakc when import disabled or export enabled ([94f3eaf](https://github.com/ecomplus/application-starter/commit/94f3eaf31fa27fca46d7a28056bf7f032ed8d7d5))

## [1.1.0](https://github.com/ecomplus/application-starter/compare/v1.0.0...v1.1.0) (2020-12-07)


### Features

* **export-order:** add/check new 'approved_orders_only' config option ([fd1fbf8](https://github.com/ecomplus/application-starter/commit/fd1fbf86faef1b8fbe512748f65640419eb3bc99))


### Bug Fixes

* **export-order:** better handling bling status ([#1](https://github.com/ecomplus/application-starter/issues/1)) ([a198328](https://github.com/ecomplus/application-starter/commit/a198328cddc28a481cc900a25e32ad23028fbc6a))

## 1.0.0 (2020-12-03)


### Features

* **auth-callback:** add procedure trigger for app "self" ([3bc0b3c](https://github.com/ecomplus/application-starter/commit/3bc0b3ced76caad1e0cc4c238fed14e61fc527f3))
* **bling-callback:** authenticating and receiving bling callbacks ([7111611](https://github.com/ecomplus/application-starter/commit/7111611ec1256d2d2fc8196c90faedf081e49fb6))
* **bling-callback:** handling order update callbacks ([1f64127](https://github.com/ecomplus/application-starter/commit/1f64127123765baab55d844d2bd73baabeafda66))
* **bling-callback:** properly handling stock callback and update ([92bca97](https://github.com/ecomplus/application-starter/commit/92bca97de645ce52a634b3ff1aa3da2cb7171d36))
* **bling-client:** setup simple bling api client constructor ([f9c94ec](https://github.com/ecomplus/application-starter/commit/f9c94ec9984fdfc693733cab2d0ebd6787edf321))
* **config:** setup initial app config for erp common flux ([14acb42](https://github.com/ecomplus/application-starter/commit/14acb42501da8a5784f115dcc6e4b1dc384db6dc))
* **export-order:** parsing and creating/updating orders on bling ([0bdacc3](https://github.com/ecomplus/application-starter/commit/0bdacc30501ac982c3a64d12d3985c3132870e4d))
* **export-product:** handling product export/update from ecomplus to bling ([c1a9187](https://github.com/ecomplus/application-starter/commit/c1a9187ef53d61b7a83379d504af3e655fec2069))
* **import-order:** update status, tracking code and invoices from bling ([77c79b5](https://github.com/ecomplus/application-starter/commit/77c79b589e76be054b0f2ed665ed19b48f91266d))
* **import-product:** handling product import to create/update on ecomplus from bling ([492605e](https://github.com/ecomplus/application-starter/commit/492605ed9089d7007b83b1d80d71129e18df87fc))
* **queues:** schedule active check idle queues from store api (fallback) ([89e35ac](https://github.com/ecomplus/application-starter/commit/89e35ac57f64eaa39ff8750da29ce91becadffee))
* **store-api:** abstraction lib to update app data ([76fe0c0](https://github.com/ecomplus/application-starter/commit/76fe0c05e72faaabe6af976f8b434bceea702a3b))
* **webhook:** webhook route handling importation/exportation queues ([a039067](https://github.com/ecomplus/application-starter/commit/a039067889c77d97a4a6cbf930bc09c2810e9602))


### Bug Fixes

* **admin-settings:** edit bling order data additional config fields ([5c84b0c](https://github.com/ecomplus/application-starter/commit/5c84b0c691deb46ea3cd8af4fdbba06043d83042))
* **bling-callback:** fix parsing json string data ([1c4ca22](https://github.com/ecomplus/application-starter/commit/1c4ca227449d303f853b2d304cfc545833af5118))
* **bling-callback:** receive post request instead of get ([77a5df3](https://github.com/ecomplus/application-starter/commit/77a5df317ab2e4b8c8e27e44e9f932c24833d683))
* **bling-client:** fix handling bling api errors and status ([417a4a6](https://github.com/ecomplus/application-starter/commit/417a4a69e78f17d3ccb129c07cbd9fc74101fc3f))
* **bling-client:** must have post method, abstracting response data ([faef7f4](https://github.com/ecomplus/application-starter/commit/faef7f483f61c1200c3ba64ebd58def853219254))
* **bling-client:** post with application/x-www-form-urlencoded ([f07c4ff](https://github.com/ecomplus/application-starter/commit/f07c4ff3f324ab39c15d1ff1ced0766216b9b007))
* **bling-client:** post with application/x-www-form-urlencoded (fix qs) ([3070c46](https://github.com/ecomplus/application-starter/commit/3070c46287539b5cd57e6dc6a152f4065c638089))
* **bling-client:** treat common bling api error codes ([e32010a](https://github.com/ecomplus/application-starter/commit/e32010a07370a660bf74b87b2af688e9fa9bada3))
* **config:** add bling store setting and fix procedure triggers ([a1c26bd](https://github.com/ecomplus/application-starter/commit/a1c26bd2ad40693490c47e703887c9ba1acfb459))
* **deps:** add form-data to direct dependencies ([85c286e](https://github.com/ecomplus/application-starter/commit/85c286ecef2f8a723fab1e7e025039302313fdc4))
* **deps:** add js2xmlparser to direct function deps ([54a4f26](https://github.com/ecomplus/application-starter/commit/54a4f264186199a54a6b15a7fa1aec2ca8cc173e))
* **ecom-config:** add (back) 'update_product' to admin settings ([5c01e02](https://github.com/ecomplus/application-starter/commit/5c01e020cda17e9791d2a050965ea863bf24f9e9))
* **export-order:** check bling 'situacoes' and thow error if invalid ([e420f8e](https://github.com/ecomplus/application-starter/commit/e420f8e660ea1504b1581ee7a85ef68858b7abde))
* **export-order:** don't send buyer id (prevent error with repeated customer) ([0ea3f6a](https://github.com/ecomplus/application-starter/commit/0ea3f6a23f699a5e334d74e30d9daf570b96bd49))
* **export-order:** fix handling bling not found responses ([0e38e85](https://github.com/ecomplus/application-starter/commit/0e38e85ba65f2074ec160db895981af3a2003de8))
* **export-order:** fix handling response data from bling api ([dd369e2](https://github.com/ecomplus/application-starter/commit/dd369e29996641faff9ae80813fa23010db62bb0))
* **export-order:** fix matching existent bling order by number ([f98f78e](https://github.com/ecomplus/application-starter/commit/f98f78e857295a76b61ca0e7b0a24870a0a4f4de))
* **export-order:** fix order parser to bling xml ([be16439](https://github.com/ecomplus/application-starter/commit/be1643946f542ff5c901091010030e5ce5188cd8))
* **export-order:** fix parsing bling order status ('situacao') ([831548d](https://github.com/ecomplus/application-starter/commit/831548d82afb29ad925c9c9faa2fcb2eafbc97de))
* **export-order:** fix updating bling order status ([a9ba2fb](https://github.com/ecomplus/application-starter/commit/a9ba2fb2434d31bca3075819bf6c2ae97497929e))
* **export-order:** fix updating bling order status ('situacao' object) ([d31effc](https://github.com/ecomplus/application-starter/commit/d31effc9cac2b574349a50d7a4c5c9423ec7275d))
* **export-order:** minor order parser fixes (address and carrier) ([c15c34b](https://github.com/ecomplus/application-starter/commit/c15c34b9a149d20d5365cbb71c3b9feaba8ed489))
* **export-order:** use order amount total instead of transaction amount to set 'parcelas' ([3b5af42](https://github.com/ecomplus/application-starter/commit/3b5af42ac755f7521551c3147ea2644ce1a66e61))
* **export-product:** always set price/stock with manual exportation ([f52abd2](https://github.com/ecomplus/application-starter/commit/f52abd2ada69ec598c5506ecbd8e1d79319bf3f2))
* **export-product:** fix handling automatic price/stock update events ([3d92c0c](https://github.com/ecomplus/application-starter/commit/3d92c0c1ba2ee01e86212c0cfb76d8df22a9755b))
* **export-product:** fix handling multiproduct (variations) to bling store ([2bf008d](https://github.com/ecomplus/application-starter/commit/2bf008d6da1a0a21e0e74ed98d323be607a61dcc))
* **export-product:** fix handling multiproduct (variations) to bling store ([838b4fe](https://github.com/ecomplus/application-starter/commit/838b4fee94693cbd2c19b144fced6a1d49535f8b))
* **export-product:** prevent error with unexpected bling api response ([6b23287](https://github.com/ecomplus/application-starter/commit/6b232871298b9166a051faf0288507e65ff64ee1))
* **export-product:** properly linking product variations after main product ([a69f7ee](https://github.com/ecomplus/application-starter/commit/a69f7ee22e35a482f48debc98c4fff078d138d7f))
* **import-product:** minor fix parsing variation grids and options ([3bf7166](https://github.com/ecomplus/application-starter/commit/3bf716624331b7ae4e94433cc9e9f6458acdf8d8))
* **imports:** fix imported lib file paths ([577018b](https://github.com/ecomplus/application-starter/commit/577018b45950d9171cf28b2830bf8393668fcaf6))
* **parse-product:** always set bling product 'descricaoCurta' ([c7df407](https://github.com/ecomplus/application-starter/commit/c7df407e0783750005659d86ca27139e04334dd3))
* **parse-product:** always set bling product domensions (zero) ([bad85c2](https://github.com/ecomplus/application-starter/commit/bad85c2e4649979451d8be716b5a62cfa5d89519))
* **parse-product:** array fixes for properly xml parse ([8c5fd24](https://github.com/ecomplus/application-starter/commit/8c5fd24f124c5f4a733d5c9b272cf84ee9a4e10c))
* **parse-product:** fix composing arrays for xml parse ([7c9d06c](https://github.com/ecomplus/application-starter/commit/7c9d06c8f57c4257d775b02336a88ee0b21b06de))
* **parse-product:** send text only body as 'descricaoComplementar' ([960c935](https://github.com/ecomplus/application-starter/commit/960c93561ccab5a93891e957a2d06706e15ebb55))
* **parse-product:** set main product stock only if no variations ([201436e](https://github.com/ecomplus/application-starter/commit/201436ef8d6f0334187d5b7ab40bcc2939f889da))
* **post-job-hander:** do not stringify request data (xml, not json :disapointed:) ([9936921](https://github.com/ecomplus/application-starter/commit/993692123a068af0311a4cf9e6928f4e5347fbb5))
* **product-to-bling:** send html body when no text only format ([2c66e72](https://github.com/ecomplus/application-starter/commit/2c66e7292552c0ef1a1542b282bd0bb916792776))
* **webhook:** properly checking update price/quantity options ([8ea8a52](https://github.com/ecomplus/application-starter/commit/8ea8a52b9aac73a527e10791c4b44c26e585689f))

## [1.0.0-starter.16](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.15...v1.0.0-starter.16) (2020-11-05)


### Bug Fixes

* **deps:** add @google-cloud/firestore v4 as direct dep ([e79b789](https://github.com/ecomplus/application-starter/commit/e79b7899b26e900cccc06e71393838ecce3d2133))
* **deps:** update all non-major dependencies ([#38](https://github.com/ecomplus/application-starter/issues/38)) ([37a3346](https://github.com/ecomplus/application-starter/commit/37a3346de56e7c2d17ab84e732c2211d4683be6d))
* **deps:** update all non-major dependencies ([#41](https://github.com/ecomplus/application-starter/issues/41)) ([77b78ef](https://github.com/ecomplus/application-starter/commit/77b78efbc64bfa32719bcd79ba4ed8da2dc57582))
* **deps:** update all non-major dependencies ([#48](https://github.com/ecomplus/application-starter/issues/48)) ([c0042d8](https://github.com/ecomplus/application-starter/commit/c0042d85f06315ffac6157f485a25fe1e0a13a01))
* **deps:** update all non-major dependencies ([#49](https://github.com/ecomplus/application-starter/issues/49)) ([dc4d847](https://github.com/ecomplus/application-starter/commit/dc4d8477f05d3d4d9b83da21d42c5e394e931c82))
* **deps:** update dependency firebase-admin to ^9.2.0 ([#47](https://github.com/ecomplus/application-starter/issues/47)) ([156714a](https://github.com/ecomplus/application-starter/commit/156714a9f3c0e71f28466efdb850874eaec283b6))
* **refresh-tokens:** add scheduled cloud function to run update ([d338924](https://github.com/ecomplus/application-starter/commit/d33892474a8c0c07bab14791cf9c4417baca00d1))

## [1.0.0-starter.15](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.14...v1.0.0-starter.15) (2020-07-26)


### Bug Fixes

* **deps:** bump @ecomplus/application-sdk@firestore ([fe4fe46](https://github.com/ecomplus/application-starter/commit/fe4fe46c2c4e1dfd21790f8c03a84245cb8fc8f3))
* **deps:** update all non-major dependencies ([#36](https://github.com/ecomplus/application-starter/issues/36)) ([b14f2e9](https://github.com/ecomplus/application-starter/commit/b14f2e9cb56d5b18500b678b074dbdbe099b041a))
* **deps:** update dependency firebase-admin to v9 ([#37](https://github.com/ecomplus/application-starter/issues/37)) ([204df95](https://github.com/ecomplus/application-starter/commit/204df95c37d24c455951081f9186178222097778))

## [1.0.0-starter.14](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.13...v1.0.0-starter.14) (2020-06-30)


### Bug Fixes

* **auth-callback:** check `row.setted_up` in place of 'settep_up' ([e2a73ca](https://github.com/ecomplus/application-starter/commit/e2a73ca029868d9c899d4a1c0d982f1c1ed5829f))
* **deps:** update all non-major dependencies ([#31](https://github.com/ecomplus/application-starter/issues/31)) ([702bee9](https://github.com/ecomplus/application-starter/commit/702bee9a31370579dd7718b5722180e5bb8996e8))
* **deps:** update dependency firebase-functions to ^3.7.0 ([#30](https://github.com/ecomplus/application-starter/issues/30)) ([0f459a3](https://github.com/ecomplus/application-starter/commit/0f459a3ab9fe21f8dc9e9bdfce33c0b6d43e3622))
* **deps:** update dependency firebase-tools to ^8.4.2 ([#29](https://github.com/ecomplus/application-starter/issues/29)) ([cf7e61e](https://github.com/ecomplus/application-starter/commit/cf7e61ef50aa976f33725d855ba19d06a7522fd4))
* **pkg:** update deps, start using node 10 ([172ed7f](https://github.com/ecomplus/application-starter/commit/172ed7f223cd23b9874c5d6209928b7d620b0cf6))

## [1.0.0-starter.13](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.12...v1.0.0-starter.13) (2020-06-03)


### Bug Fixes

* **deps:** update @ecomplus/application-sdk to v1.13.0 ([b424410](https://github.com/ecomplus/application-starter/commit/b42441089e7020774c9586ed176e691ef4c755be))
* **refresh-tokens:** force appSdk update tokens task ([139a350](https://github.com/ecomplus/application-starter/commit/139a350c230fa36c37ab83e2debfe979d831cb08))

## [1.0.0-starter.12](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.11...v1.0.0-starter.12) (2020-05-29)


### Bug Fixes

* **deps:** replace @ecomplus/application-sdk to firestore version ([3d2ee85](https://github.com/ecomplus/application-starter/commit/3d2ee85feb2edab77950e5c266514152fbc9674d))
* **deps:** update all non-major dependencies ([#21](https://github.com/ecomplus/application-starter/issues/21)) ([7a370da](https://github.com/ecomplus/application-starter/commit/7a370da11dfd098c0a90da05d39fc62f9264fd63))
* **deps:** update all non-major dependencies ([#26](https://github.com/ecomplus/application-starter/issues/26)) ([e37e0e8](https://github.com/ecomplus/application-starter/commit/e37e0e8151768d79e81f4184ab937ddf9d775a4f))
* **deps:** update dependency uglify-js to ^3.9.2 ([#20](https://github.com/ecomplus/application-starter/issues/20)) ([adccf0a](https://github.com/ecomplus/application-starter/commit/adccf0a2fed37f2ccce57ded20d25af85407ac8a))

## [1.0.0-starter.11](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.10...v1.0.0-starter.11) (2020-04-27)


### Bug Fixes

* **deps:** update @ecomplus/application-sdk to v1.11.13 ([70584c2](https://github.com/ecomplus/application-starter/commit/70584c245e97a1b539a3df3f74109f20d9a1fa3c))
* **setup:** ensure enable token updates by default ([67aea0e](https://github.com/ecomplus/application-starter/commit/67aea0eb363be3cc535a0f0f4d1b5b682958f243))

## [1.0.0-starter.10](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.9...v1.0.0-starter.10) (2020-04-27)


### Bug Fixes

* **deps:** update @ecomplus/application-sdk to v1.11.11 ([b8217d0](https://github.com/ecomplus/application-starter/commit/b8217d03fe92b5c233615a0b6b4c01d7bad676c2))
* **deps:** update all non-major dependencies ([#19](https://github.com/ecomplus/application-starter/issues/19)) ([a99797a](https://github.com/ecomplus/application-starter/commit/a99797a129d6e2383ef5ef69c06afacd13cccfb0))
* **setup:** do not disable updates on refresh-tokens route ([b983a45](https://github.com/ecomplus/application-starter/commit/b983a45ada5575ee6435f7b3016ef35c28355762))

## [1.0.0-starter.9](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.8...v1.0.0-starter.9) (2020-04-21)


### Bug Fixes

* **deps:** update @ecomplus/application-sdk to v1.11.10 ([8da579c](https://github.com/ecomplus/application-starter/commit/8da579c19c6530e8cc9fd338a07aece1fccc64ff))

## [1.0.0-starter.8](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.7...v1.0.0-starter.8) (2020-04-18)


### Bug Fixes

* **deps:** update all non-major dependencies ([#17](https://github.com/ecomplus/application-starter/issues/17)) ([785064e](https://github.com/ecomplus/application-starter/commit/785064ef5bf06db7c084f9b17b37a6077645735b))

## [1.0.0-starter.7](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.6...v1.0.0-starter.7) (2020-04-07)

## [1.0.0-starter.6](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.5...v1.0.0-starter.6) (2020-04-06)


### Bug Fixes

* **deps:** update all non-major dependencies ([#10](https://github.com/ecomplus/application-starter/issues/10)) ([b3c65e5](https://github.com/ecomplus/application-starter/commit/b3c65e5c7eb89a4825eb47c852ce65293d172314))
* **deps:** update all non-major dependencies ([#13](https://github.com/ecomplus/application-starter/issues/13)) ([33ff19b](https://github.com/ecomplus/application-starter/commit/33ff19bbdad1f34b6d1c255089dc0a0e4092b955))
* **deps:** update all non-major dependencies ([#8](https://github.com/ecomplus/application-starter/issues/8)) ([feba5b9](https://github.com/ecomplus/application-starter/commit/feba5b9cdc54e8304beff2b12658a6343ef37569))
* **deps:** update dependency firebase-functions to ^3.6.0 ([#15](https://github.com/ecomplus/application-starter/issues/15)) ([5f7f0a2](https://github.com/ecomplus/application-starter/commit/5f7f0a2bf5c744000996e2a0b78690b363462ee7))
* **deps:** update dependency firebase-tools to ^7.16.1 ([#14](https://github.com/ecomplus/application-starter/issues/14)) ([b8e4798](https://github.com/ecomplus/application-starter/commit/b8e479851bd02bf5929a7df8a71a761f1c1c1654))
* **deps:** update dependency firebase-tools to v8 ([#16](https://github.com/ecomplus/application-starter/issues/16)) ([b72560e](https://github.com/ecomplus/application-starter/commit/b72560e4fc86496499d553e47094ace25436272b))
* **ecom-modules:** fix parsing mod names to filenames and vice versa ([99c185a](https://github.com/ecomplus/application-starter/commit/99c185afebeae77deb61537ed9de1c77132c16ce))

## [1.0.0-starter.5](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.4...v1.0.0-starter.5) (2020-03-05)


### Features

* **market-publication:** handle full featured app publication to Market ([28379dc](https://github.com/ecomplus/application-starter/commit/28379dc3c4784e757c8f25e5d737f6143682b0db))
* **static:** handle static with server app files from public folder ([827d000](https://github.com/ecomplus/application-starter/commit/827d00079b0dc169b2eef31b8e0ac73c596307a8))

## [1.0.0-starter.4](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.3...v1.0.0-starter.4) (2020-02-21)


### Features

* **calculate-shipping:** basic setup for calculate shipping module ([db77595](https://github.com/ecomplus/application-starter/commit/db7759514bb25d151dd4508fb96b84c52b3e94ba))


### Bug Fixes

* **home:** fix replace accets regex exps to generate slug from title ([198cc0b](https://github.com/ecomplus/application-starter/commit/198cc0b911d4874d96f3cd5254d30cab5fe89765))
* **home:** gen slug from pkg name or app title if not set or default ([25c20bf](https://github.com/ecomplus/application-starter/commit/25c20bfade65a86e4f4b1026ef59a5694a022a74))

## [1.0.0-starter.3](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.2...v1.0.0-starter.3) (2020-02-21)

## [1.0.0-starter.2](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.1...v1.0.0-starter.2) (2020-02-21)


### Bug Fixes

* **config:** stop reading app from functions config ([7b9aab7](https://github.com/ecomplus/application-starter/commit/7b9aab727fefe8a5b84695e90a0d68e02b8c3f62))

## [1.0.0-starter.1](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.0...v1.0.0-starter.1) (2020-02-20)


### Features

* **get-auth:** endpoint to return auth id and token for external usage ([40a8ae2](https://github.com/ecomplus/application-starter/commit/40a8ae2e895d6e32c7032ca500040ec82c80dc5d))
* **server:** also supporting passing Store Id from query ([111f3a7](https://github.com/ecomplus/application-starter/commit/111f3a716fbfd2e155e3fb24242bddcae7cb065c))


### Bug Fixes

* **server:** remove 'routes' path when setting filename for routes ([119524c](https://github.com/ecomplus/application-starter/commit/119524c523a11364ed912769637a6f8e479af5f1))

## [1.0.0-starter.0](https://github.com/ecomplus/application-starter/compare/v0.1.1...v1.0.0-starter.0) (2020-02-18)


### Features

* **router:** recursive read routes dir to auto setup server routes ([ff2b456](https://github.com/ecomplus/application-starter/commit/ff2b45604723a8146c9481ea36a9400da5ccc2bc))


### Bug Fixes

* **home:** fix semver on for app.version (remove version tag if any) ([ad36461](https://github.com/ecomplus/application-starter/commit/ad364614a7f5599850ad39e00a94d310742e8f80))
* **middlewares:** update route files exports (named exports by methods) ([6a22e67](https://github.com/ecomplus/application-starter/commit/6a22e67135bc6110e6da6b4ab25f67ad8d77f597))

### [0.1.1](https://github.com/ecomplus/application-starter/compare/v0.1.0...v0.1.1) (2020-02-18)


### Features

* **env:** get 'pkg' from functions config ([bf45ec3](https://github.com/ecomplus/application-starter/commit/bf45ec33a2147d5be91fdc4955bd6cfa1b0867e2))
* **home:** set version and slug from root package, fix with uris ([d4b61fa](https://github.com/ecomplus/application-starter/commit/d4b61fab427aefdb2ac485d90eb1abe15d6aafc6))


### Bug Fixes

* **env:** firebase doesnt uppercase config ([502185e](https://github.com/ecomplus/application-starter/commit/502185ed30f346d8db77b849d6ba0eb48cb777cb))
* **require:** update @ecomplus/application-sdk dependency name ([d4174ac](https://github.com/ecomplus/application-starter/commit/d4174ac5425b85590db0e92d4b1d69a8567a6c55))

## [0.1.0](https://github.com/ecomplus/application-starter/compare/v0.0.4...v0.1.0) (2020-02-17)

### [0.0.4](https://github.com/ecomclub/firebase-app-boilerplate/compare/v0.0.3...v0.0.4) (2020-02-16)


### Bug Fixes

* **server:** update routes names (refresh-tokens) ([79a2910](https://github.com/ecomclub/firebase-app-boilerplate/commit/79a2910817cf4193b40e02b2b1e6b920e7fefb2d))

### [0.0.3](https://github.com/ecomclub/express-app-boilerplate/compare/v0.0.2...v0.0.3) (2020-02-15)


### Features

* **server:** start reading env options, handle operator token ([ce107b7](https://github.com/ecomclub/express-app-boilerplate/commit/ce107b74cde375e875a85cc3ba0cc6a73740785d))
* **update-tokens:** adding route to start update tokens service (no content) ([20c62ec](https://github.com/ecomclub/express-app-boilerplate/commit/20c62ec6800fc326b89e8cf54b2916f56e5910e4))


### Bug Fixes

* **auth-callback:** fix handling docRef (desn't need to get by id again) ([629ca5a](https://github.com/ecomclub/express-app-boilerplate/commit/629ca5ab9849e3822cc190f423da5bf2e0c4daab))
* **auth-callback:** save procedures if not new, check and set 'settep_up' ([#3](https://github.com/ecomclub/express-app-boilerplate/issues/3)) ([4a01f86](https://github.com/ecomclub/express-app-boilerplate/commit/4a01f86c37e09cd7c0363f6fbc80de6eeef3ba20))
* **ECOM_AUTH_UPDATE_INTERVAL:** disable set interval (no daemons on cloud functions) ([2aa2442](https://github.com/ecomclub/express-app-boilerplate/commit/2aa2442061f0308be9eb9430552fa04ad148788c))
* **env:** fixed to get appInfor variable ([e9b1a3c](https://github.com/ecomclub/express-app-boilerplate/commit/e9b1a3ce0d17ee74a5eada70589340fd5a70e786))
* **env:** fixed to get appInfor variable ([22687e2](https://github.com/ecomclub/express-app-boilerplate/commit/22687e25f611d49f8c01494af114e0289cec251e))
* **middleware:** check standard http headers for client ip ([5045113](https://github.com/ecomclub/express-app-boilerplate/commit/504511329afe9277d540f0f542a316d04634ce9e))

### 0.0.2 (2020-02-11)


### Bug Fixes

* **lib:** remove unecessary/incorrect requires with new deps ([69f2b77](https://github.com/ecomclub/express-app-boilerplate/commit/69f2b77))
* **routes:** fix handling appSdk (param) ([0cf2dde](https://github.com/ecomclub/express-app-boilerplate/commit/0cf2dde))
* **setup:** added initializeApp() to firebase admin ([e941e59](https://github.com/ecomclub/express-app-boilerplate/commit/e941e59))
* **setup:** manually setup ecomplus-app-sdk with firestore ([64e49f8](https://github.com/ecomclub/express-app-boilerplate/commit/64e49f8))
* **setup:** manually setup ecomplus-app-sdk with firestore ([c718bd0](https://github.com/ecomclub/express-app-boilerplate/commit/c718bd0))
* **setup:** manually setup ecomplus-app-sdk with firestore ([33909bf](https://github.com/ecomclub/express-app-boilerplate/commit/33909bf)), closes [/github.com/ecomclub/ecomplus-app-sdk/blob/master/main.js#L45](https://github.com/ecomclub//github.com/ecomclub/ecomplus-app-sdk/blob/master/main.js/issues/L45)
* **startup:** setup routes after appSdk ready, add home route ([d182555](https://github.com/ecomclub/express-app-boilerplate/commit/d182555))


### Features

* **firestore-app-boilerplate:** Initial commit ([c9963f0](https://github.com/ecomclub/express-app-boilerplate/commit/c9963f0))
* **firestore-app-boilerplate:** Initial commit ([be493ea](https://github.com/ecomclub/express-app-boilerplate/commit/be493ea))
* **firestore-support:** minor changes ([3718cba](https://github.com/ecomclub/express-app-boilerplate/commit/3718cba))
* **firestore-support:** refactoring to  use saveProcedures function ([62971ef](https://github.com/ecomclub/express-app-boilerplate/commit/62971ef))
* **firestore-support:** removed sqlite error clausule ([2d47996](https://github.com/ecomclub/express-app-boilerplate/commit/2d47996))
* **routes:** add home route (app json) ([42a3f2b](https://github.com/ecomclub/express-app-boilerplate/commit/42a3f2b))

# [LEGACY] Express App Boilerplate

### [0.1.1](https://github.com/ecomclub/express-app-boilerplate/compare/v0.1.0...v0.1.1) (2019-07-31)


### Bug Fixes

* **procedures:** fix checking for procedures array to run configureSetup ([1371cdc](https://github.com/ecomclub/express-app-boilerplate/commit/1371cdc))

## [0.1.0](https://github.com/ecomclub/express-app-boilerplate/compare/v0.0.2...v0.1.0) (2019-07-31)

### 0.0.2 (2019-07-31)


### Bug Fixes

* chain promise catch on lib getConfig ([281abf9](https://github.com/ecomclub/express-app-boilerplate/commit/281abf9))
* fix mergin hidden data to config ([8b64d58](https://github.com/ecomclub/express-app-boilerplate/commit/8b64d58))
* fix path to require 'get-config' from lib ([11425b0](https://github.com/ecomclub/express-app-boilerplate/commit/11425b0))
* get storeId from header and set on req object ([a3bebaa](https://github.com/ecomclub/express-app-boilerplate/commit/a3bebaa))
* handle error on get config instead of directly debug ([f182589](https://github.com/ecomclub/express-app-boilerplate/commit/f182589))
* routes common fixes ([2758a57](https://github.com/ecomclub/express-app-boilerplate/commit/2758a57))
* using req.url (from http module) instead of req.baseUrl ([d9057ca](https://github.com/ecomclub/express-app-boilerplate/commit/d9057ca))


### Features

* authentication callback ([8f18892](https://github.com/ecomclub/express-app-boilerplate/commit/8f18892))
* conventional store api error handling ([bcde87e](https://github.com/ecomclub/express-app-boilerplate/commit/bcde87e))
* function to get app config from data and hidden data ([ba470f5](https://github.com/ecomclub/express-app-boilerplate/commit/ba470f5))
* getting store id from web.js ([72f18c6](https://github.com/ecomclub/express-app-boilerplate/commit/72f18c6))
* handling E-Com Plus webhooks ([63ba19f](https://github.com/ecomclub/express-app-boilerplate/commit/63ba19f))
* main js file including bin web and local ([6b8a71a](https://github.com/ecomclub/express-app-boilerplate/commit/6b8a71a))
* pre-validate body for ecom modules endpoints ([f06bdb0](https://github.com/ecomclub/express-app-boilerplate/commit/f06bdb0))
* setup app package dependencies and main.js ([b2826ed](https://github.com/ecomclub/express-app-boilerplate/commit/b2826ed))
* setup base app.json ([015599a](https://github.com/ecomclub/express-app-boilerplate/commit/015599a))
* setup daemon processes, configure store setup ([db3ca8c](https://github.com/ecomclub/express-app-boilerplate/commit/db3ca8c))
* setup procedures object ([c5e8627](https://github.com/ecomclub/express-app-boilerplate/commit/c5e8627))
* setup web app with express ([d128430](https://github.com/ecomclub/express-app-boilerplate/commit/d128430))
