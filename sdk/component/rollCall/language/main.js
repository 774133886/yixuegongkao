/**
 * @file 话术入口
 * @author dujianhao
 */

const getLanguage = require('../../../function/getLanguage').getLanguage;
module.exports = function () {
    return getLanguage({
        english: require('./english'),
        chineseLive: require('./chineseLive'),
        chineseClassroom: require('./chineseClassroom')
    });
};

