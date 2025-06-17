; inherits html
[
"{"
"}"
"|"
] @tag

[
"{else}"
"{/if}"
"{/block}"
"{first}"
"{last}"
"{sep}"
"{/first}"
"{/last}"
"{/sep}"
(l)
(r)
] @keyword

(include_basic
  "{include" @keyword
  "}" @keyword)

(include_from
  "{include" @keyword
  "from" @keyword
  "}" @keyword)

(sandbox
  "{sandbox" @keyword
  ; (parameter) @string.path
  "}" @keyword)

(embed
  "{embed" @keyword
  (from) @keyword
  "}" @keyword)

(extends
  "{extends" @keyword
  "}" @keyword)

(layout
  "{layout" @keyword
  "}" @keyword)

(block
  "{block" @keyword
  ; (parameter) @string
  "}" @keyword)

(fqcn
  (namespace) @namespace
  "\\" @namespace
  (class) @type)


(templateType
  "{templateType" @keyword
  "}" @keyword
  )

(varType
  "{varType" @keyword
  (var) @variable)

(varPrint
  "{varPrint" @keyword
  "}" @keyword)

(templatePrint) @keyword

(varPrint
  "{varPrint" @keyword
  "all" @keyword
  "}" @keyword)

(var
  "{var" @keyword
  "}" @keyword)

(default_assignment
  "{default" @keyword
  "}" @keyword)

(if
  "{if" @keyword
  "}" @keyword)

(ifset
  "{ifset" @keyword
  "}" @keyword
  "{/ifset}" @keyword
)

(elseifset
  "{elseifset" @keyword
  "}" @keyword
)

(ifchanged
  "{ifchanged" @keyword
  "}" @keyword
  "{/ifchanged}" @keyword
)

(else_if
  "{elseif" @keyword
  "}" @keyword)

(switch
  "{switch" @keyword
  "}" @keyword
  "{/switch}" @keyword)

(case_branch
  "{case" @keyword
  "}" @keyword)

(default_branch) @keyword

(foreach
  "{foreach" @keyword
  (as) @keyword
  "}" @keyword
  "{/foreach}" @keyword)

(iterateWhile
  "{iterateWhile}" @keyword.control.repeat.while
  "{/iterateWhile" @keyword.control.repeat.while
  "}" @keyword.control.repeat.while)

(for
  "{for" @keyword.control.repeat.for
  (assignment) @string
  ";" @punctuation.delimiter
  (condition) @string
  ";" @punctuation.delimiter
  (increment) @string
  "}" @keyword.control.for.for
  "{/for}" @keyword.control.repeat.for)

(continueIf
  "{continueIf" @keyword
  "}" @keyword)

(skipIf
  "{skipIf" @keyword
  "}" @keyword)

(breakIf
  "{breakIf" @keyword
  "}" @keyword)

(exitIf
  "{exitIf" @keyword
  "}" @keyword)

(inline
  "{" @keyword
  (modifier) @keyword
  "}" @keyword)

(parameters_tag
  "{parameters" @keyword
  (name) @variable
  "}" @keyword)

(capture
  "{capture" @keyword
  (variable) @variable
  "}" @keyword
  "{/capture}" @keyword)

(translation_print
  "{_" @keyword
  "}" @keyword)

(translate
  "{translate" @keyword
  "}" @keyword
  "{/translate}" @keyword)

(contentType
  "{contentType" @keyword
  "}" @keyword)

(debugbreak
  "{debugbreak" @keyword
  "}" @keyword)

(do
  "{do" @keyword
  "}" @keyword)

(dump
  "{dump" @keyword
  "}" @keyword)

(php
  "{php}" @keyword
  "{/php}" @keyword)

(spaceless
  "{spaceless}" @keyword
  "{/spaceless}" @keyword)

(syntax
  "{syntax off}" @keyword
  "{/syntax}" @keyword)

(trace) @keyword

(link
  "{link" @keyword
  "}" @keyword)

(plink
  "{plink" @keyword
  "}" @keyword)

(control
  "{control" @keyword
  "}" @keyword)

(snippet
  "{snippet" @keyword
  (snippet_name) @string
  "}" @keyword)
  "{/snippet}" @keyword

(snippet_area
  "{snippetArea" @keyword
  (snippet_area_name) @string
  "}" @keyword)
  "{/snippetArea}" @keyword

(cache
  "{cache" @keyword
  "}" @keyword
  "{/cache}" @keyword)

(form
  "{form" @keyword
  "}" @keyword
  "{/form}" @keyword)

(short_label
  "{label" @keyword
  "/}" @keyword)
(long_label
  "{label" @keyword
  "}" @keyword
  "{/label}" @keyword)

(input
  "{input" @keyword
  "}" @keyword)

(input_error
  "{inputError" @keyword
  "}" @keyword)

(form_container
  "{formContainer" @keyword
  "}" @keyword
  "{/formContainer}" @keyword)

(asset
  "{asset" @keyword
  (value) @string.path
  "}" @keyword)

(preload
  "{preload" @keyword
  (value) @string.path
  "}" @keyword)

; (parameter) @parameter
(parameter_value) @variable.parameter

(comment) @comment

(atomicType) @type.builtin
(type) @type

(type "|" @punctuation.delimiter)
(type "?" @special)
(php_only) @string

(expression "new" @keyword)
(expression "(" @constructor)
(expression ")" @constructor)
(expression) @string

((attribute
  (attribute_name) @attr_name
  (#match? @attr_name "^(n:if|n:else|n:ifset|n:ifchanged|n:foreach|n:inner-foreach|n:first|n:last|n:sep|n:for|n:while|n:capture|n:syntax|n:class|n:attr|n:tag|n:ifcontent|n:translate|n:href|n:name|n:asset)$")
  ) @keyword)
