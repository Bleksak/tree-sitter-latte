/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'latte',

  extras: $ => [
    $.comment,
    /\s+/,
  ],

  rules: {
    template: $ => repeat($._latte),

    _latte: $ => choice(
      $.templateType,
      $.block,
      $.define,
      $.layout,
      $.extends,
      $.embed,
      $.inline,
      $.include,
      $.foreach,
      $.if,
      $.first,
      $.last,
      $.sep,
      $.iterateWhile,
      $.varType,
      $.varPrint,
      $.templatePrint,
      $.var,
      $.l,
      $.r,
      $.ifset,
      $.ifchanged,
      $.switch,
      $.for,
      $.continueIf,
      $.skipIf,
      $.breakIf,
      $.exitIf,
      $.sandbox,
      $.parameters_tag,
      $.capture,
      $.text,
      $.translate,
      $.translation_print,
      $.default_assignment,
      $.contentType,
      $.debugbreak,
      $.do,
      $.dump,
      $.php,
      $.spaceless,
      $.syntax,
      $.trace,
      $.link,
      $.plink,
      $.control,
      $.snippet,
      $.snippet_area,
      $.cache,
      $.form,
      $.label,
      $.input,
      $.input_error,
      $.form_container,
      $.asset,
      $.preload,
    ),

    l: _ => "{l}",
    r: _ => "{r}",

    ifset: $ => seq(
      '{ifset',
      field('condition', $.php_only),
      '}',
      field('body', alias(repeat($._latte), $.body)),
      repeat(field('alternative', $.elseifset)),
      optional(field('alternative', $.else)),
      "{/ifset}",
    ),

    elseifset: $ => seq(
      '{elseifset',
      field('condition', $.php_only),
      '}',
      field('body', alias(repeat($._latte), $.body)),
    ),

    ifchanged: $ => seq(
      '{ifchanged',
      field('condition', $.php_only),
      '}',
      field('body', alias(repeat($._latte), $.body)),
      optional(field('alternative', $.else)),
      "{/ifchanged}",
    ),

    switch: $ => seq(
      "{switch",
      field('condition', $.php_only),
      "}",
      alias(repeat($.switch_branch), $.body),
      "{/switch}",
    ),

    case_branch: $ => seq(
      '{case',
      field('value', $.php_only),
      field('values', repeat(seq(',', $.php_only))),
      '}',
      alias(repeat($._latte), $.body),
    ),

    default_branch: $ => seq(
      '{default}',
      alias(repeat($._latte), $.body),
    ),

    switch_branch: $ => choice(
      $.case_branch,
      $.default_branch,
    ),

    default_assignment: $ => seq(
      '{default',
      $._var_assignment,
      '}',
    ),

    templateType: $ => seq(
      '{templateType',
      $.fqcn,
      '}',
    ),

    varType: $ => seq(
      '{varType',
      $.type,
      alias($.php_only, $.var),
      '}'
    ),

    varPrint: _ => seq(
      "{varPrint",
      optional("all"),
      "}",
    ),

    templatePrint: _ => "{templatePrint}",

    _var_assignment: $ => seq(
      optional(
        $.type,
      ),
      alias(/\$[^=]+/, $.name),
      '=',
      $.php_only,
    ),

    var: $ => seq(
      '{var',
      $._var_assignment,
      repeat(seq(',', $._var_assignment)),
      '}'
    ),

    comment: _ => token(
      choice(
        seq('<!--', /[^\-]*\-+([^>\-][^\-]*\-+)*/, '>'),
        seq('{*', /[^\*]*\*+([^}\*][^\*]*\*+)*/, '}'),
      )
    ),

    inline: $ => seq(
      '{',
      $.php_only,
      repeat(seq(
        '|',
        $.modifier,
      )),
      '}'
    ),

    include: $ => choice(
      $.include_basic,
      $.include_from,
    ),

    include_basic: $ => seq(
      '{include',
      $.parameter,
      repeat(seq(',', $.parameter)),
      '}',
    ),

    include_from: $ => seq(
      '{include',
      $.parameter,
      "from",
      $.parameter,
      '}',
    ),

    layout: $ => seq(
      '{layout',
      $.parameter,
      '}',
    ),

    extends: $ => seq(
      '{extends',
      $.parameter,
      '}',
    ),

    embed: $ => seq(
      '{embed',
      alias(
        optional(
          choice(
            'file',
            'block',
          )
        ),
        $.from,
      ),
      $.parameter,
      repeat(seq(',', $.parameter)),
      '}',
    ),

    sandbox: $ => seq(
      '{sandbox',
      repeat($.parameter),
      '}',
    ),

    block: $ => seq(
      '{block',
      repeat($.parameter),
      '}',
      field('body', alias(repeat($._latte), $.body)),
      '{/block}',
    ),

    define: $ => seq(
      '{define',
      repeat($.parameter),
      '}',
      field('body', alias(repeat($._latte), $.body)),
      '{/define}',
    ),

    foreach: $ => seq(
      '{foreach',
      field('iterable', $.php_only),
      alias('as', $.as),
      field('key', $.php_only),
      optional(seq(
        '=>',
        field('value', $.php_only),
      )),
      '}',
      field('body', alias(repeat($._latte), $.body)),
      field('alternative', optional($.else)),
      '{/foreach}',
    ),

    iterateWhile: $ => seq(
      "{iterateWhile}",
      field('body', alias(repeat($._latte), $.body)),
      "{/iterateWhile",
      field('condition', alias(/[^}]+/, $.text)),
      "}",
    ),

    for: $ => seq(
      '{for',
      field('assignment', alias(/[^;]+/, $.assignment)),
      ';',
      field('condition', alias(/[^;]+/, $.condition)),
      ';',
      field('increment', alias(/[^}]+/, $.increment)),
      "}",
      field('body', alias(repeat($._latte), $.body)),
      '{/for}',
    ),

    first: $ => seq(
      '{first}',
      field('body', alias(repeat($._latte), $.body)),
      '{/first}'
    ),

    last: $ => seq(
      '{last}',
      field('body', alias(repeat($._latte), $.body)),
      '{/last}'
    ),

    sep: $ => seq(
      '{sep}',
      field('body', alias(repeat($._latte), $.body)),
      '{/sep}'
    ),

    continueIf: $ => seq(
      "{continueIf",
      field('condition', $.php_only),
      "}",
    ),

    skipIf: $ => seq(
      "{skipIf",
      field('condition', $.php_only),
      "}",
    ),

    breakIf: $ => seq(
      "{breakIf",
      field('condition', $.php_only),
      "}",
    ),

    exitIf: $ => seq(
      "{exitIf",
      field('condition', $.php_only),
      "}",
    ),

    if: $ => seq(
      '{if',
      field('condition', $.php_only),
      '}',
      field('body', alias(repeat($._latte), $.body)),
      repeat(field('alternative', $.else_if)),
      optional(field('alternative', $.else)),
      '{/if}',
    ),

    else_if: $ => seq(
      '{elseif',
      field('condition', $.php_only),
      '}',
      field('body', alias(repeat($._latte), $.body)),
    ),

    else: $ => seq(
      '{else}',
      field('body', alias(repeat($._latte), $.body)),
    ),

    _optional_var_assignment: $ => seq(
      optional(
        $.type,
      ),
      alias(/\$[^=]+/, $.name),
      alias(
        optional(
          seq(
            '=',
            $.php_only,
          ),
        ),
        $.assignment,
      )
    ),

    parameters_tag: $ => seq(
      '{parameters',
      optional($._optional_var_assignment),
      repeat(seq(',', $._optional_var_assignment)),
      '}',
    ),

    capture: $ => seq(
      '{capture',
      alias($.php_only, $.variable),
      '}',
      field('body', alias(repeat($._latte), $.body)),
      '{/capture}',
    ),

    translation_print: $ => seq(
      '{_',
      $.parameter,
      repeat(seq(',', $.parameter)),
      '}',
    ),

    translate: $ => seq(
      '{translate',
      optional($.parameter),
      repeat(seq(',', $.parameter)),
      '}',
      field('body', alias(repeat($._latte), $.body)),
      '{/translate}',
    ),

    contentType: $ => seq(
      '{contentType',
      $.parameter_value,
      '}',
    ),

    debugbreak: $ => seq(
      '{debugbreak',
      optional($.php_only),
      '}',
    ),

    do: $ => seq(
      '{do',
      $.php_only,
      '}',
    ),

    dump: $ => seq(
      '{dump',
      optional($.php_only),
      '}',
    ),

    php: $ => seq(
      "{php}",
      field('body', alias(repeat($.php_only), $.body)),
      "{/php}",
    ),

    spaceless: $ => seq(
      "{spaceless}",
      field('body', alias(repeat($._latte), $.body)),
      "{/spaceless}",
    ),

    syntax: $ => seq(
      "{syntax off}",
      field('body', alias(repeat($._latte), $.body)),
      "{/syntax}",
    ),

    trace: $ => "{trace}",

    link: $ => seq(
      '{link',
      $.php_only,
      repeat(seq(',', $.parameter)),
      '}',
    ),

    plink: $ => seq(
      '{plink',
      $.php_only,
      repeat(seq(',', $.parameter)),
      '}',
    ),

    control: $ => seq(
      '{control',
      $.php_only,
      optional($.parameter_value),
      repeat(seq(',', $.parameter)),
      '}',
    ),

    snippet: $ => seq(
      '{snippet',
      alias($.php_identifier, $.snippet_name),
      '}',
      field('body', alias(repeat($._latte), $.body)),
      '{/snippet}',
    ),

    snippet_area: $ => seq(
      '{snippetArea',
      alias($.php_identifier, $.snippet_area_name),
      '}',
      field('body', alias(repeat($._latte), $.body)),
      '{/snippetArea}',
    ),

    cache: $ => seq(
      '{cache',
      optional($.parameter_value),
      repeat(seq(',', $.parameter)),
      '}',
      field('body', alias(repeat($._latte), $.body)),
      '{/cache}',
    ),

    form: $ => seq(
      '{form',
      $.parameter_value,
      '}',
      field('body', alias(repeat($._latte), $.body)),
      '{/form}',
    ),

    short_label: $ => seq(
      '{label',
      $.parameter_value,
      repeat(seq(',', $.parameter)),
      '/}',
    ),

    long_label: $ => seq(
      '{label',
      $.parameter_value,
      repeat(seq(',', $.parameter)),
      '}',
      field('body', alias(repeat($._latte), $.body)),
      '{/label}',
    ),

    label: $ => seq(
      choice(
        $.long_label,
        $.short_label,
      ),
    ),

    input: $ => seq(
      '{input',
      $.parameter_value,
      repeat(seq(',', $.parameter)),
      '}',
    ),

    input_error: $ => seq(
      '{inputError',
      $.parameter_value,
      '}',
    ),

    form_container: $ => seq(
      '{formContainer',
      $.parameter_value,
      '}',
      field('body', alias(repeat($._latte), $.body)),
      '{/formContainer}',
    ),

    asset: $ => seq(
      '{asset',
      alias(
        choice(
          $.double_quoted_string,
          $.single_quoted_string,
        ),
        $.value,
      ),
      '}',
    ),

    preload: $ => seq(
      '{preload',
      alias(
        choice(
          $.double_quoted_string,
          $.single_quoted_string,
        ),
        $.value,
      ),
      '}',
    ),

    modifier: $ => seq(
      /[^|:}]+/,
      repeat(seq(
        ':',
        alias(/[^|:}]+/, $.parameter_value),
      )),
    ),

    parameter_value: $ => choice(
      $.boolean_parameter,
      $.integer_parameter,
      $.decimal_parameter,
      $.unquoted_string,
      $.single_quoted_string,
      $.double_quoted_string,
      $.php_only,
    ),

    unquoted_string: _ => /[A-Za-z_][A-Za-z0-9_\-\/\.]*/,
    single_quoted_string: _ => /\'([^'\\]|\\.)*\'/,
    double_quoted_string: _ => /\"([^"\\]|\\.)*\"/,
    boolean_parameter: _ => choice('true', 'false'),
    integer_parameter: _ => /[+-]?\d+/,
    decimal_parameter: _ => /[+-]?\d+\.\d+/,

    key_value_parameter: $ => seq(
      alias($.unquoted_string, $.parameter_name),
      choice(
        ':',
        '=>',
      ),
      $.parameter_value,
    ),

    parameter: $ => choice(
      $.key_value_parameter,
      $.parameter_value,
    ),

    php_only: ($) => prec.right(repeat1($._text)),
    text: ($) => prec.right(repeat1($._text)),

    // hidden to reduce AST noise in php_only
    _text: _ =>
      choice(
        token(prec(-1, /@[a-zA-Z\d]*[^\(-]/)), // custom directive conflict resolution
        token(prec(-2, /[{}!@()?,-]/)), // orphan tags
        token(
          prec(
            -1,
            /[^\s(){!}@-]([^(){!}@,?]*[^{!}()@?,-])?/, // general text
          ),
        ),
      ),

    fqcn: $ => seq(
      optional(
        field('namespace',
          alias(
            seq(
              $.php_identifier,
              repeat(seq('\\', $.php_identifier)),
            ),
            $.namespace,
          )
        ),
      ),
      optional('\\'),
      field('class', alias($.php_identifier, $.class)),
    ),

    atomicType: $ => choice(
      'null',
      'bool',
      'int',
      'string',
      'array',
      'object',
      'resource',
      'callable',
      'mixed',
      'iterable',
      $.fqcn,
    ),

    type: $ => seq(
      optional('?'),
      $.atomicType,
      repeat(seq('|', $.atomicType)),
    ),

    php_identifier: _ => /[A-Za-z][A-Za-z0-9_]*/,
    class_name: _ => /[A-Za-z][A-Za-z0-9_]*/,
  },
});

