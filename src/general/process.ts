/// <reference path="../src/compiler/sys.ts" />

interface DiagnosticDetails {
    category: string;
    code: number;
    isEarly?: boolean;
}

interface InputDiagnosticMessageTable {
    [msg: string]: DiagnosticDetails;
}

function main(): void {
    var sys = ts.sys;
    if (sys.args.length < 1) {
        sys.write("Usage:" + sys.newLine)
        sys.write("\tnode processDiagnosticMessages.js <diagnostic-json-input-file>" + sys.newLine);
        return;
    }

    function writeFile(fileName: string, contents: string) {
        // TODO: Fix path joining
        var inputDirectory = inputFilePath.substr(0,inputFilePath.lastIndexOf("/"));
        var fileOutputPath = inputDirectory + "/" + fileName;
        sys.writeFile(fileOutputPath, contents);
    }

    var inputFilePath = sys.args[0].replace(/\\/g, "/");
    var inputStr = sys.readFile(inputFilePath);

    var diagnosticMessages: InputDiagnosticMessageTable = JSON.parse(inputStr);

    var names = Utilities.getObjectKeys(diagnosticMessages);
    var nameMap = buildUniqueNameMap(names);

    var infoFileOutput = buildInfoFileOutput(diagnosticMessages, nameMap);
    checkForUniqueCodes(names, diagnosticMessages);
    writeFile("diagnosticInformationMap.generated.ts", infoFileOutput);

    var messageOutput = buildDiagnosticMessageOutput(diagnosticMessages, nameMap);
    writeFile("diagnosticMessages.generated.json", messageOutput);
}

function checkForUniqueCodes(messages: string[], diagnosticTable: InputDiagnosticMessageTable) {
    const originalMessageForCode: string[] = [];
    let numConflicts = 0;

    for (const currentMessage of messages) {
        const code = diagnosticTable[currentMessage].code;

        if (code in originalMessageForCode) {
            const originalMessage = originalMessageForCode[code];
            ts.sys.write("\x1b[91m"); // High intensity red.
            ts.sys.write("Error");
            ts.sys.write("\x1b[0m");  // Reset formatting.
            ts.sys.write(`: Diagnostic code '${code}' conflicts between "${originalMessage}" and "${currentMessage}".`);
            ts.sys.write(ts.sys.newLine + ts.sys.newLine);

            numConflicts++;
        }
        else {
            originalMessageForCode[code] = currentMessage;
        }
    }

    if (numConflicts > 0) {
        throw new Error(`Found ${numConflicts} conflict(s) in diagnostic codes.`);
    }
}

function buildUniqueNameMap(names: string[]): ts.Map<string> {
    var nameMap: ts.Map<string> = {};

    var uniqueNames = NameGenerator.ensureUniqueness(names, /* isCaseSensitive */ false, /* isFixed */ undefined);

    for (var i = 0; i < names.length; i++) {
        nameMap[names[i]] = uniqueNames[i];
    }

    return nameMap;
}

function buildInfoFileOutput(messageTable: InputDiagnosticMessageTable, nameMap: ts.Map<string>): string {
    var result =
        '// <auto-generated />\r\n' +
        '/// <reference path="types.ts" />\r\n' +
        '/* @internal */\r\n' +
        'namespace ts {\r\n' +
        '    export var Diagnostics = {\r\n';
    var names = Utilities.getObjectKeys(messageTable);
    for (var i = 0; i < names.length; i++) {
        var name = names[i];
        var diagnosticDetails = messageTable[name];
        var propName = convertPropertyName(nameMap[name]);

        result +=
            '        ' + propName +
            ': { code: ' + diagnosticDetails.code +
            ', category: DiagnosticCategory.' + diagnosticDetails.category +
            ', key: "' + createKey(propName, diagnosticDetails.code) + '"' +
            ', message: "' + name.replace(/[\"]/g, '\\"') + '"' +
            ' },\r\n';
    }

    result += '    };\r\n}';

    return result;
}

function buildDiagnosticMessageOutput(messageTable: InputDiagnosticMessageTable, nameMap: ts.Map<string>): string {
    var result =
        '{';
    var names = Utilities.getObjectKeys(messageTable);
    for (var i = 0; i < names.length; i++) {
        var name = names[i];
        var diagnosticDetails = messageTable[name];
        var propName = convertPropertyName(nameMap[name]);

        result += '\r\n  "' + createKey(propName, diagnosticDetails.code) + '"' + ' : "' + name.replace(/[\"]/g, '\\"') + '"';
        if (i !== names.length - 1) {
            result += ',';
        }
    }

    result += '\r\n}';

    return result;
}

function createKey(name: string, code: number) : string {
    return name.slice(0, 100) + '_' + code;
}

function convertPropertyName(origName: string): string {
    var result = origName.split("").map(char => {
        if (char === '*') { return "_Asterisk"; }
        if (char === '/') { return "_Slash"; }
        if (char === ':') { return "_Colon"; }
        return /\w/.test(char) ? char : "_";
    }).join("");


    // get rid of all multi-underscores
    result = result.replace(/_+/g, "_");

    // remove any leading underscore, unless it is followed by a number.
    result = result.replace(/^_([^\d])/, "$1")

    // get rid of all trailing underscores.
    result = result.replace(/_$/, "");

    return result;
}

module NameGenerator {
    export function ensureUniqueness(names: string[], isCaseSensitive: boolean, isFixed?: boolean[]): string[]{
        if (!isFixed) {
            isFixed = names.map(() => false)
        }

        var names = names.slice();
        ensureUniquenessInPlace(names, isCaseSensitive, isFixed);
        return names;
    }

    function ensureUniquenessInPlace(names: string[], isCaseSensitive: boolean, isFixed: boolean[]): void {
        for (var i = 0; i < names.length; i++) {
            var name = names[i];
            var collisionIndices = Utilities.collectMatchingIndices(name, names, isCaseSensitive);

            // We will always have one "collision" because getCollisionIndices returns the index of name itself as well;
            // so if we only have one collision, then there are no issues.
            if (collisionIndices.length < 2) {
                continue;
            }

            handleCollisions(name, names, isFixed, collisionIndices, isCaseSensitive);
        }
    }

    function handleCollisions(name: string, proposedNames: string[], isFixed: boolean[], collisionIndices: number[], isCaseSensitive: boolean): void {
        var suffix = 1;

        for (var i = 0; i < collisionIndices.length; i++) {
            var collisionIndex = collisionIndices[i];

            if (isFixed[collisionIndex]) {
                // can't do anything about this name.
                continue;
            }

            while (true) {
                var newName = name + suffix;
                suffix++;

                // Check if we've synthesized a unique name, and if so
                // replace the conflicting name with the new one.
                if (!proposedNames.some(name => Utilities.stringEquals(name, newName, isCaseSensitive))) {
                    proposedNames[collisionIndex] = newName;
                    break;
                }
            }
        }
    }
}

module Utilities {
    /// Return a list of all indices where a string occurs.
    export function collectMatchingIndices(name: string, proposedNames: string[], isCaseSensitive: boolean): number[] {
        var matchingIndices: number[] = [];

        for (var i = 0; i < proposedNames.length; i++) {
            if (stringEquals(name, proposedNames[i], isCaseSensitive)) {
                matchingIndices.push(i);
            }
        }

        return matchingIndices;
    }

    export function stringEquals(s1: string, s2: string, caseSensitive: boolean): boolean {
        if (caseSensitive) {
            s1 = s1.toLowerCase();
            s2 = s2.toLowerCase();
        }

        return s1 == s2;
    }

    // Like Object.keys
    export function getObjectKeys(obj: any): string[] {
        var result: string[] = [];

        for (var name in obj) {
            if (obj.hasOwnProperty(name)) {
                result.push(name);
            }
        }

        return result;
    }
}

main();
