import { RichTextField } from "@prismicio/types";

import enRichTextJSON from "./enRichText.json";
import linkRichTextJSON from "./linkRichText.json";

export const richTextFixture = {
	en: enRichTextJSON as RichTextField,
	link: linkRichTextJSON as RichTextField,
};
