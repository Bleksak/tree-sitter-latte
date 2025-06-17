/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'latte',

  extras: $ => [
    $.comment,
    /\s+/,
  ],

  externals: $ => [
    $._start_tag_name,
    $._script_start_tag_name,
    $._style_start_tag_name,
    $._end_tag_name,
    $.erroneous_end_tag_name,
    '/>',
    $._implicit_end_tag,
    $.raw_text,
    $.comment,
  ],

  rules: {
    document: $ => repeat($._node),

    doctype: $ => seq(
      '<!',
      alias($._doctype, 'doctype'),
      /[^>]+/,
      '>',
    ),

    _doctype: _ => /[Dd][Oo][Cc][Tt][Yy][Pp][Ee]/,

    _node: $ => choice(
      $.doctype,
      $.entity,
      $.text,
      $.element,
      $.script_element,
      $.style_element,
      $.erroneous_end_tag,
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
      // $.text,
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

    element: $ => choice(
      seq(
        $.start_tag,
        repeat($._node),
        choice($.end_tag, $._implicit_end_tag),
      ),
      $.self_closing_tag,
    ),

    script_element: $ => seq(
      alias($.script_start_tag, $.start_tag),
      optional($.raw_text),
      $.end_tag,
    ),

    style_element: $ => seq(
      alias($.style_start_tag, $.start_tag),
      optional($.raw_text),
      $.end_tag,
    ),

    start_tag: $ => seq(
      '<',
      alias($._start_tag_name, $.tag_name),
      repeat($.attribute),
      '>',
    ),

    script_start_tag: $ => seq(
      '<',
      alias($._script_start_tag_name, $.tag_name),
      repeat($.attribute),
      '>',
    ),

    style_start_tag: $ => seq(
      '<',
      alias($._style_start_tag_name, $.tag_name),
      repeat($.attribute),
      '>',
    ),

    self_closing_tag: $ => seq(
      '<',
      alias($._start_tag_name, $.tag_name),
      repeat($.attribute),
      '/>',
    ),

    end_tag: $ => seq(
      '</',
      alias($._end_tag_name, $.tag_name),
      '>',
    ),

    erroneous_end_tag: $ => seq(
      '</',
      $.erroneous_end_tag_name,
      '>',
    ),

    attribute: $ => seq(
      $.attribute_name,
      optional(seq(
        '=',
        choice(
          $.attribute_value,
          $.quoted_attribute_value,
        ),
      )),
    ),

    attribute_name: _ => /[^<>"'/=\s]+/,

    attribute_value: _ => /[^<>"'=\s]+/,

    // An entity can be named, numeric (decimal), or numeric (hexacecimal). The
    // longest entity name is 29 characters long, and the HTML spec says that
    // no more will ever be added.
    entity: _ => /&(#([xX][0-9a-fA-F]{1,6}|[0-9]{1,5})|[A-Za-z]{1,30});?/,

    quoted_attribute_value: $ => choice(
      seq('\'', optional(alias(/[^']+/, $.attribute_value)), '\''),
      seq('"', optional(alias(/[^"]+/, $.attribute_value)), '"'),
    ),

    text: _ => /[^{}<>&\s]([^{}<>&]*[^{}<>&\s])?/,


    // EVERYTHING BELOW IS LATTE

    l: _ => "{l}",
    r: _ => "{r}",

    ifset: $ => seq(
      '{ifset',
      field('condition', $.expression),
      '}',
      field('body', alias(repeat($._node), $.body)),
      repeat(field('alternative', $.elseifset)),
      optional(field('alternative', $.else)),
      "{/ifset}",
    ),

    elseifset: $ => seq(
      '{elseifset',
      field('condition', $.expression),
      '}',
      field('body', alias(repeat($._node), $.body)),
    ),

    ifchanged: $ => seq(
      '{ifchanged',
      field('condition', $.expression),
      '}',
      field('body', alias(repeat($._node), $.body)),
      optional(field('alternative', $.else)),
      "{/ifchanged}",
    ),

    switch: $ => seq(
      "{switch",
      field('condition', $.expression),
      "}",
      alias(repeat($.switch_branch), $.body),
      "{/switch}",
    ),

    case_branch: $ => seq(
      '{case',
      field('value', $.expression),
      field('values', repeat(seq(',', $.expression))),
      '}',
      alias(repeat($._node), $.body),
    ),

    default_branch: $ => seq(
      '{default}',
      alias(repeat($._node), $.body),
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
      alias($._php_variable, $.var),
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
      field('name', alias($._php_variable, $.expression)),
      '=',
      $.expression,
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
      $.expression,
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
      field('body', alias(repeat($._node), $.body)),
      '{/block}',
    ),

    define: $ => seq(
      '{define',
      repeat($.parameter),
      '}',
      field('body', alias(repeat($._node), $.body)),
      '{/define}',
    ),

    foreach: $ => seq(
      '{foreach',
      field('iterable', alias($.expression, $.expression)),
      alias('as', $.as),
      optional(seq(
        field('key', $.expression),
        '=>'
      )),
      field('value', $.expression),
      '}',
      field('body', alias(repeat($._node), $.body)),
      field('alternative', optional($.else)),
      '{/foreach}',
    ),

    iterateWhile: $ => seq(
      "{iterateWhile}",
      field('body', alias(repeat($._node), $.body)),
      "{/iterateWhile",
      field('condition', $.expression),
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
      field('body', alias(repeat($._node), $.body)),
      '{/for}',
    ),

    first: $ => seq(
      '{first}',
      field('body', alias(repeat($._node), $.body)),
      '{/first}'
    ),

    last: $ => seq(
      '{last}',
      field('body', alias(repeat($._node), $.body)),
      '{/last}'
    ),

    sep: $ => seq(
      '{sep}',
      field('body', alias(repeat($._node), $.body)),
      '{/sep}'
    ),

    continueIf: $ => seq(
      "{continueIf",
      field('condition', $.expression),
      "}",
    ),

    skipIf: $ => seq(
      "{skipIf",
      field('condition', $.expression),
      "}",
    ),

    breakIf: $ => seq(
      "{breakIf",
      field('condition', $.expression),
      "}",
    ),

    exitIf: $ => seq(
      "{exitIf",
      field('condition', $.expression),
      "}",
    ),

    if: $ => seq(
      '{if',
      field('condition', $.expression),
      '}',
      field('body', alias(repeat($._node), $.body)),
      repeat(field('alternative', $.else_if)),
      optional(field('alternative', $.else)),
      '{/if}',
    ),

    else_if: $ => seq(
      '{elseif',
      field('condition', $.expression),
      '}',
      field('body', alias(repeat($._node), $.body)),
    ),

    else: $ => seq(
      '{else}',
      field('body', alias(repeat($._node), $.body)),
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
            $.expression,
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
      alias($._php_variable, $.variable),
      '}',
      field('body', alias(repeat($._node), $.body)),
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
      field('body', alias(repeat($._node), $.body)),
      '{/translate}',
    ),

    contentType: $ => seq(
      '{contentType',
      $.parameter_value,
      '}',
    ),

    debugbreak: $ => seq(
      '{debugbreak',
      optional($._php_variable),
      '}',
    ),

    do: $ => seq(
      '{do',
      $.expression,
      '}',
    ),

    dump: $ => seq(
      '{dump',
      optional($.expression),
      '}',
    ),

    php: $ => seq(
      "{php}",
      field('body', alias(repeat($.php_only), $.body)),
      "{/php}",
    ),

    spaceless: $ => seq(
      "{spaceless}",
      field('body', alias(repeat($._node), $.body)),
      "{/spaceless}",
    ),

    syntax: $ => seq(
      "{syntax off}",
      field('body', alias(repeat($._node), $.body)),
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
      alias($._php_identifier, $.snippet_name),
      '}',
      field('body', alias(repeat($._node), $.body)),
      '{/snippet}',
    ),

    snippet_area: $ => seq(
      '{snippetArea',
      alias($._php_identifier, $.snippet_area_name),
      '}',
      field('body', alias(repeat($._node), $.body)),
      '{/snippetArea}',
    ),

    cache: $ => seq(
      '{cache',
      optional($.parameter_value),
      repeat(seq(',', $.parameter)),
      '}',
      field('body', alias(repeat($._node), $.body)),
      '{/cache}',
    ),

    form: $ => seq(
      '{form',
      $.parameter_value,
      '}',
      field('body', alias(repeat($._node), $.body)),
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
      field('body', alias(repeat($._node), $.body)),
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
      field('body', alias(repeat($._node), $.body)),
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
    // text: ($) => prec.right(repeat1($._text)),

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
              $._php_identifier,
              repeat(seq('\\', $._php_identifier)),
            ),
            $.namespace,
          )
        ),
      ),
      optional('\\'),
      field('class', alias($._php_identifier, $.class)),
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

    class_name: _ => /[A-Za-z][A-Za-z0-9_]*/,

    expression: $ => choice(
      $._php_variable,
      $._php_member_access,
      $._php_static_access,
      $._php_subscript_expression,
      $._php_function_call,
      $._php_new_expression,
      $._php_array_literal,
      $._php_binary_expression,
      $._php_ternary_expression,
      $._php_parenthesized_expression,
      $._php_identifier,
      $._php_string,
      $._php_number
    ),

    _php_static_access: $ => seq(
      field('class', choice('self', 'static', 'parent', $._php_identifier)),
      '::',
      field('member', choice($._php_identifier, $._php_function_call))
    ),

    _php_variable: $ => /\$[a-zA-Z_\x80-\xff][a-zA-Z0-9_\x80-\xff]*/,

    _php_identifier: $ => /[a-zA-Z_\\][a-zA-Z0-9_\\]*/,

    _php_function_call: $ => seq(
      field('function', $._php_identifier),
      '(',
      optional(sepBy(',', $.expression)),
      ')'
    ),

    _php_member_access: $ => prec.left(seq(
      field('object', $.expression),
      '->',
      field('member', $.expression),
    )),

    _php_subscript_expression: $ => seq(
      field('object', $.expression),
      '[',
      field('index', $.expression),
      ']'
    ),

    _php_new_expression: $ => seq(
      'new',
      $._php_identifier,
      '(',
      optional(sepBy(',', $.expression)),
      ')'
    ),

    _php_array_literal: $ => seq(
      '[',
      optional(sepBy(',', $.expression)),
      ']'
    ),

    _php_binary_expression: $ => prec.left(1, seq(
      field('left', $.expression),
      field('operator', choice('+', '-', '*', '/', '%', '.', '??', '&&', '||', '==', '!=', '<', '>', '<=', '>=', '===', '!==')),
      field('right', $.expression)
    )),

    _php_ternary_expression: $ => prec.right(1, seq(
      field('condition', $.expression),
      '?',
      field('consequence', $.expression),
      ':',
      field('alternative', $.expression)
    )),

    _php_parenthesized_expression: $ => seq(
      '(',
      $.expression,
      ')'
    ),

    _php_string: $ => choice(
      seq("'", repeat(/[^']/), "'"),
      seq('"', repeat(/[^"]/), '"')
    ),

    _php_number: $ => /\d+(\.\d+)?/,
  },
});

function sepBy(sep, rule) {
  return optional(seq(rule, repeat(seq(sep, rule))));
}