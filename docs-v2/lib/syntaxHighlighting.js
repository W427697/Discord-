/* eslint-disable func-names, no-useless-escape, no-param-reassign */

const prism = require('prismjs');
const prettier = require('prettier');

// JS syntax (es2017)
(Prism => {
  const insideString = {
    variable: [
      // Arithmetic Environment
      {
        pattern: /\$?\(\([\s\S]+?\)\)/,
        inside: {
          // If there is a $ sign at the beginning highlight $(( and )) as variable
          variable: [
            {
              pattern: /(^\$\(\([\s\S]+)\)\)/,
              lookbehind: true,
            },
            /^\$\(\(/,
          ],
          number: /\b-?(?:0x[\dA-Fa-f]+|\d*\.?\d+(?:[Ee]-?\d+)?)\b/,
          // Operators according to https://www.gnu.org/software/bash/manual/bashref.html#Shell-Arithmetic
          operator: /--?|-=|\+\+?|\+=|!=?|~|\*\*?|\*=|\/=?|%=?|<<=?|>>=?|<=?|>=?|==?|&&?|&=|\^=?|\|\|?|\|=|\?|:/,
          // If there is no $ sign at the beginning highlight (( and )) as punctuation
          punctuation: /\(\(?|\)\)?|,|;/,
        },
      },
      // Command Substitution
      {
        pattern: /\$\([^)]+\)|`[^`]+`/,
        inside: {
          variable: /^\$\(|^`|\)$|`$/,
        },
      },
      /\$(?:[a-z0-9_#\?\*!@]+|\{[^}]+\})/i,
    ],
  };

  Prism.languages.sh = {
    shebang: {
      pattern: /^#!\s*\/bin\/bash|^#!\s*\/bin\/sh/,
      alias: 'important',
    },
    comment: {
      pattern: /(^|[^"{\\])#.*/,
      lookbehind: true,
    },
    string: [
      // Support for Here-Documents https://en.wikipedia.org/wiki/Here_document
      {
        pattern: /((?:^|[^<])<<\s*)(?:"|')?(\w+?)(?:"|')?\s*\r?\n(?:[\s\S])*?\r?\n\2/g,
        lookbehind: true,
        greedy: true,
        inside: insideString,
      },
      {
        pattern: /(["'])(?:\\\\|\\?[^\\])*?\1/g,
        greedy: true,
        inside: insideString,
      },
    ],
    variable: insideString.variable,
    // Originally based on http://ss64.com/bash/
    function: {
      pattern: /(^|\s|;|\||&)(?:alias|apropos|apt-get|aptitude|aspell|awk|basename|bash|bc|bg|builtin|bzip2|cal|cat|cd|cfdisk|chgrp|chmod|chown|chroot|chkconfig|cksum|clear|cmp|comm|command|cp|cron|crontab|csplit|cut|date|dc|dd|ddrescue|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|du|egrep|eject|enable|env|ethtool|eval|exec|expand|expect|export|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|getopts|git|grep|groupadd|groupdel|groupmod|groups|gzip|hash|head|help|hg|history|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|jobs|join|kill|killall|less|link|ln|locate|logname|logout|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|make|man|mkdir|mkfifo|mkisofs|mknod|more|most|mount|mtools|mtr|mv|mmv|nano|netstat|nice|nl|nohup|notify-send|npm|nslookup|open|op|passwd|paste|pathchk|ping|pkill|popd|pr|printcap|printenv|printf|ps|pushd|pv|pwd|quota|quotacheck|quotactl|ram|rar|rcp|read|readarray|readonly|reboot|rename|renice|remsync|rev|rm|rmdir|rsync|screen|scp|sdiff|sed|seq|service|sftp|shift|shopt|shutdown|sleep|slocate|sort|source|split|ssh|stat|strace|su|sudo|sum|suspend|sync|tail|tar|tee|test|time|timeout|times|touch|top|traceroute|trap|tr|tsort|tty|type|ulimit|umask|umount|unalias|uname|unexpand|uniq|units|unrar|unshar|uptime|useradd|userdel|usermod|users|uuencode|uudecode|v|vdir|vi|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yes|zip)(?=$|\s|;|\||&)/,
      lookbehind: true,
    },
    keyword: {
      pattern: /(^|\s|;|\||&)(?:let|:|\.|if|then|else|elif|fi|for|break|continue|while|in|case|function|select|do|done|until|echo|exit|return|set|declare)(?=$|\s|;|\||&)/,
      lookbehind: true,
    },
    boolean: {
      pattern: /(^|\s|;|\||&)(?:true|false)(?=$|\s|;|\||&)/,
      lookbehind: true,
    },
    operator: /&&?|\|\|?|==?|!=?|<<<?|>>|<=?|>=?|=~/,
    punctuation: /\$?\(\(?|\)\)?|\.\.|[{}[\];]/,
  };

  const inside = insideString.variable[1].inside;
  inside.function = Prism.languages.sh.function;
  inside.keyword = Prism.languages.sh.keyword;
  inside.boolean = Prism.languages.sh.boolean;
  inside.operator = Prism.languages.sh.operator;
  inside.punctuation = Prism.languages.sh.punctuation;
})(prism);

// shell syntax (bash)
(Prism => {
  Prism.languages.javascript = Prism.languages.extend('clike', {
    keyword: /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
    number: /\b-?(0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
    // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
    function: /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i,
    operator: /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/,
  });

  Prism.languages.insertBefore('javascript', 'keyword', {
    regex: {
      pattern: /(^|[^/])\/(?!\/)(\[[^\]\r\n]+]|\\.|[^/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
      lookbehind: true,
      greedy: true,
    },
  });

  Prism.languages.insertBefore('javascript', 'string', {
    'template-string': {
      pattern: /`(?:\\\\|\\?[^\\])*?`/,
      greedy: true,
      inside: {
        interpolation: {
          pattern: /\$\{[^}]+\}/,
          inside: {
            'interpolation-punctuation': {
              pattern: /^\$\{|\}$/,
              alias: 'punctuation',
            },
            rest: Prism.languages.javascript,
          },
        },
        string: /[\s\S]+/,
      },
    },
  });

  if (Prism.languages.markup) {
    Prism.languages.insertBefore('markup', 'tag', {
      script: {
        pattern: /(<script[\s\S]*?>)[\s\S]*?(?=<\/script>)/i,
        lookbehind: true,
        inside: Prism.languages.javascript,
        alias: 'language-javascript',
      },
    });
  }

  // Prism.languages.js = Prism.languages.javascript;
  const javascript = Prism.util.clone(Prism.languages.javascript);

  Prism.languages.js = Prism.languages.extend('markup', javascript);
  Prism.languages.js.tag.pattern = /<\/?[\w\.:-]+\s*(?:\s+(?:[\w\.:-]+(?:=(?:("|')(\\?[\s\S])*?\1|[^\s'">=]+|(\{[\s\S]*?\})))?|\{\.{3}\w+\}))*\s*\/?>/i;

  Prism.languages.js.tag.inside['attr-value'].pattern = /=(?!\{)(?:('|")[\s\S]*?(\1)|[^\s>]+)/i;

  Prism.languages.insertBefore(
    'inside',
    'attr-name',
    {
      spread: {
        pattern: /\{\.{3}\w+\}/,
        inside: {
          punctuation: /\{|\}|\./,
          'attr-value': /\w+/,
        },
      },
    },
    Prism.languages.js.tag
  );

  let jsxExpression = Prism.util.clone(Prism.languages.js);

  delete jsxExpression.punctuation;

  jsxExpression = Prism.languages.insertBefore(
    'jsx',
    'operator',
    {
      punctuation: /=(?={)|[{}[\];(),.:]/,
    },
    { jsx: jsxExpression }
  );

  Prism.languages.insertBefore(
    'inside',
    'attr-value',
    {
      script: {
        // Allow for one level of nesting
        pattern: /=(\{(?:\{[^}]*\}|[^}])+\})/i,
        inside: jsxExpression,
        alias: 'language-javascript',
      },
    },
    Prism.languages.js.tag
  );
})(prism);

module.exports = (value, language) => {
  // TODO: could do css too:
  // https://github.com/prettier/prettier#parser
  const code =
    language === 'js'
      ? prettier.format(value, {
          printWidth: 100,
          tabWidth: 2,
          bracketSpacing: true,
          trailingComma: 'es5',
          singleQuote: true,
        })
      : value;

  return (prism.languages[language]
    ? prism.highlight(code, prism.languages[language])
    : code).replace(/\n/g, '<br />');
};
