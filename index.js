/**
 * @file fis3-generate-html
 * @author leon <ludafa@outlook.com>
 */

/* eslint-disable fecs-no-require */

const fs = require('fs');

module.exports = (content, file, options) => {

    let {
        template,
        filename,
        output
    } = options;

    if (typeof output === 'function') {
        output = output(filename);
    }

    let derivedFile = fis.file.wrap(output);

    derivedFile.isHtmlLike = true;

    let templateContent = fs.readFileSync(template, 'utf8');
    let derivedFileContent = templateContent.replace(
        /<!--inject-->/g,
        `<script src="${file.url}"></script>`
    );

    derivedFileContent = fis.compile.partial(derivedFileContent, file, {
        ext: 'html',
        isHtmlLike: true
    });

    derivedFile.setContent(derivedFileContent);

    file.derived.push(derivedFile);

    return content;
};
