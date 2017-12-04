/**
 * @file fis3-generate-html
 * @author leon <ludafa@outlook.com>
 */

/* eslint-disable fecs-no-require */

const fs = require('fs');

/**
 * 生成 html
 *
 * 这里要先触发对 php 的编译，再对编译出来的东西进行替换
 * 如果是先替换再触发编译，会使得替换的内容直接被编译成 release 路径
 * 如果同时使用了 hash 那么在 package 的过程中则因为了 release + hash 路径就没办法找到对应的合并包了
 *
 * @param  {string} content 内容
 * @param  {File}   file    文件对象
 * @param  {Object} options 插件参数
 * @return {string}
 */
module.exports = (content, file, options) => {

    let {
        template,
        filename,
        output,
        replace = `<script src="${file.subpath}"></script>`
    } = options;

    if (typeof output === 'function') {
        output = output(filename);
    }

    let derivedFile = fis.file.wrap(output);

    derivedFile.isHtmlLike = true;

    let templateContent = fs.readFileSync(template, 'utf8');

    derivedFile.setContent(templateContent);

    // 对生成的 html 进行编译，触发其他配置的处理器
    fis.compile(derivedFile);

    let derivedFileContent = derivedFile.getContent().replace(
        /<!--inject-->/g,
        function () {
            return typeof replace === 'function' ? replace(file) : replace;
        }
    );

    derivedFile.setContent(derivedFileContent);

    file.derived.push(derivedFile);

    return content;
};
