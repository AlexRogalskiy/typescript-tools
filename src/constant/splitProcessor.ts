/**
 * Perform transformations on input string, skipping sections that match
 * the regular expression.
 *
 * @param text input string
 * @param splitter a regular expression to split the string
 * @param transform function that takes non-skipped sections as input
 *                  and performs transformation
 * @return transformed string, stitched back together
 */
export function splitProcessor(
    text: string,
    transform: (i: string) => string,
    splitter: RegExp,
): string {
    const hunks = text.split(splitter);
    for (let i = 0; i < hunks.length; i += 2) {
        hunks[i] = transform(hunks[i]);
    }
    return hunks.join("");
}
