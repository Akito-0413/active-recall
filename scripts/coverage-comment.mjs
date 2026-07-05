import { readFileSync, writeFileSync } from "node:fs";

const summary = JSON.parse(
  readFileSync("coverage/coverage-summary.json", "utf8"),
);
const total = summary.total;

const body = `<!-- coverage-report -->
## Coverage Report

| Metric | Coverage | Covered / Total |
| --- | ---: | ---: |
| Statements | ${total.statements.pct}% | ${total.statements.covered} / ${total.statements.total} |
| Branches | ${total.branches.pct}% | ${total.branches.covered} / ${total.branches.total} |
| Functions | ${total.functions.pct}% | ${total.functions.covered} / ${total.functions.total} |
| Lines | ${total.lines.pct}% | ${total.lines.covered} / ${total.lines.total} |

- Source: \`npm run test:coverage\`
- Artifact: \`coverage-report\`
`;

writeFileSync("coverage/pr-comment.md", body);
process.stdout.write(body);
