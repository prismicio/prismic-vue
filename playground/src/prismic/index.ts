import { createPrismic, PrismicPluginInterface } from "../../../src";

/*******************************************
 *                   /!\                   *
 *                                         *
 * This is only here to fix a bug when     *
 * symlinking @prismicio/vue inside itself *
 *                                         *
 * Don't do that in your own projects      *
 *******************************************/
// declare module "@vue/runtime-core" {
//   interface ComponentCustomProperties {
//     $prismic: PrismicPluginInterface;
//   }
// }
/*******************************************
 *           End of example fix            *
 *******************************************/

const prismic = createPrismic({
  endpoint: "https://200629-sms-hoy.cdn.prismic.io/api/v2"
});

export default prismic;
