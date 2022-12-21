import { convert } from 'html-to-text';

/**
 * Returns the text content of the html string.n
 * @param {String} responseText
 */
export const getTextContent = (html) => convert(html, { wordwrap: null });
