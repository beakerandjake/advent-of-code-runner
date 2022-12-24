import { parseDocument } from 'htmlparser2';
import { findOne, textContent } from 'domutils';
import { render } from 'dom-serializer';

/**
 * Returns the outerText of the first element with matching tag name in the html.
 * @param {String} html - The html text to parse.
 * @param {String} name - The tag name to search for.
 * @returns {String} The outer html of the element, or null if no matching element found.
 */
export const getElementByTagName = (html, name) => {
  const found = findOne(
    (element) => element.type === 'tag' && element.name === name,
    parseDocument(html).children,
  );
  return found ? render(found, { encodeEntities: false }) : null;
};

/**
 * Returns the text content of the html string.
 * @param {String} html - The html to parse
 * @returns {String} The textContent of the parsed Node
 */
export const getTextContent = (html) => textContent(parseDocument(html));
