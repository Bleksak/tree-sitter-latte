// swift-tools-version:5.3

import Foundation
import PackageDescription

var sources = ["src/parser.c"]
if FileManager.default.fileExists(atPath: "src/scanner.c") {
    sources.append("src/scanner.c")
}

let package = Package(
    name: "TreeSitterLatte",
    products: [
        .library(name: "TreeSitterLatte", targets: ["TreeSitterLatte"]),
    ],
    dependencies: [
        .package(url: "https://github.com/tree-sitter/swift-tree-sitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterLatte",
            dependencies: [],
            path: ".",
            sources: sources,
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterLatteTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterLatte",
            ],
            path: "bindings/swift/TreeSitterLatteTests"
        )
    ],
    cLanguageStandard: .c11
)
