import * as Lint from 'tslint';
import * as ts from 'typescript';
import { getPreviousToken } from "tsutils";


export class Rule extends Lint.Rules.AbstractRule {
    static FAILURE_STRING = 'Test members should be separated by a newline';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walk(sourceFile, this.ruleName, undefined));
    }
}

class Walk extends Lint.AbstractWalker {
    walk(sourceFile: ts.SourceFile) {
        const cb = (node: ts.Node): void => {
            if (node.kind === ts.SyntaxKind.CallExpression) {
                this.visitFunctionCall(node as ts.CallExpression)
            }
            return ts.forEachChild(node, cb);
        }
        return ts.forEachChild(sourceFile, cb);
    }

    private visitFunctionCall(call: ts.CallExpression) {
        const fnName = call.expression.getText()
        if (!['describe', 'test', 'it', 'beforeEach', 'afterEach', 'beforeAll', 'afterAll'].includes(fnName)) {
            return
        }

        const prev = getPreviousToken(call);
        if (!prev || prev.kind === ts.SyntaxKind.OpenBraceToken) {
            return
        }

        const callStart = call.getStart()
        const colonEnd = prev.getEnd()
        const sourceText = this.sourceFile.getFullText()
        const hasNewLine = sourceText.substring(colonEnd + 1, callStart).includes('\n')
        if (!hasNewLine) {
            const fixer = Lint.Replacement.replaceFromTo(
                colonEnd + 1,
                colonEnd + 1,
                '\n'
            );
            this.addFailure(callStart, callStart, Rule.FAILURE_STRING, fixer)
        }

    }

}

