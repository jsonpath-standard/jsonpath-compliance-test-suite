const fs = require('fs');
const path = require('path');
/**
 * The file extension of test files.
 * @type {string}
 */
const fileExtension = '.json';
/**
 * The number of spaces to use for indentation in the output.
 * @type {number}
 */
const jsonIndent = 2;
/**
 * The separator to use when combining test names.
 * @type {string}
 */
const testNameSeparator = ', ';

build();

/**
 * Build a combined test suite from a directory of test files.
 * The output is written to stdout.
 */
function build() {
    if (process.argv.length < 3) {
        console.error('Usage: node build.js <test-folder-path>');
        process.exit(1);
    }

    const testsFolder = process.argv[2];
    const tests = readTestsFromDir(testsFolder);
    const cts = {'tests': tests};
    console.log(JSON.stringify(cts, null, jsonIndent));
    console.error(`Wrote ${tests.length} tests to stdout.`);
}


/**
 * Read all test files from a directory and its subdirectories.
 * The directory name is prepended to the test name.
 * @param dir {string} - The directory to read.
 * @param relativePath {string[]} - The path to the directory.
 * @returns {*[]} - An array of test objects.
 */
function readTestsFromDir(dir, relativePath = []) {
    const files = fs.readdirSync(dir);
    files.sort(filesBeforeDirs);
    return files.reduce(addTestsFromFile, []);

    /**
     * Add tests from a file to the list of all tests.
     * @param allTests - The list of all tests.
     * @param file - The file to read.
     * @returns {*} - The updated list of all tests.
     */
    function addTestsFromFile(allTests, file) {
        const fullPath = path.join(dir, file);

        if (isDir(file)) {
            console.error(`Processing dir ${fullPath}`);
            const tests = readTestsFromDir(fullPath, [...relativePath, file]);
            return allTests.concat(tests);
        }

        if (path.extname(file) === fileExtension) {
            console.error(`Processing file ${fullPath}`);
            const basename = path.basename(file, fileExtension);
            const testNamePrefix = [...relativePath, basename]
                .join(testNameSeparator)
                .replace('_', ' ');
            const tests = readTestsFromFile(fullPath).map(prependToTestName(testNamePrefix));
            return allTests.concat(tests);
        }

        return allTests;
    }

    /**
     * Sort entries so that directories are listed after files.
     * @param first - The first file.
     * @param second - The second file.
     * @returns {number}
     */
    function filesBeforeDirs(first, second) {
        const firstIsDir = isDir(first);
        const secondIsDir = isDir(second);
        if (firstIsDir && !secondIsDir) return 1;
        if (!firstIsDir && secondIsDir) return -1;
        return first.localeCompare(second, 'en', {sensitivity: 'base'});
    }

    /**
     * Check if a file is a directory.
     * @param file {string} - The file name.
     * @returns {boolean} - True if the file is a directory.
     */
    function isDir(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
    }
}

/**
 * Read the tests from a file.
 * @param file - The file to read.
 * @returns {*[]}
 */
function readTestsFromFile(file) {
    const fileData = fs.readFileSync(file, 'utf8');
    return JSON.parse(fileData).tests;
}

/**
 * Prepend the prefix to the test name.
 * @param prefix {string} - The file name.
 * @returns {function(*): *&{name: string}} - A function that prepends the file name to the test name.
 */
function prependToTestName(prefix) {
    return (test) => {
        return {
            ...test,
            name: prefix + testNameSeparator + test.name,
        };
    };
}

