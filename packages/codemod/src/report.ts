/**
 * Migration report — a single record-keeper each transform pushes into.
 * At the end of a run we print a summary (how many files touched, how
 * many TODO comments emitted, and the list of unconvertible patterns).
 */

export interface ReportEntry {
  file: string;
  line?: number;
  kind: "rewritten" | "todo" | "skipped" | "info";
  transform: string;
  message: string;
}

export class Report {
  entries: ReportEntry[] = [];

  add(entry: ReportEntry) {
    this.entries.push(entry);
  }

  filesTouched(): number {
    return new Set(this.entries.map((e) => e.file)).size;
  }

  countByKind(): Record<ReportEntry["kind"], number> {
    const tally: Record<ReportEntry["kind"], number> = {
      rewritten: 0,
      todo: 0,
      skipped: 0,
      info: 0,
    };
    for (const e of this.entries) tally[e.kind] += 1;
    return tally;
  }

  format(): string {
    const tally = this.countByKind();
    const lines: string[] = [];
    lines.push(`Superstyling migration report`);
    lines.push(`============================`);
    lines.push(`Files touched: ${this.filesTouched()}`);
    lines.push(`Rewrites: ${tally.rewritten}  TODOs: ${tally.todo}  Skipped: ${tally.skipped}`);
    if (tally.todo > 0) {
      lines.push("");
      lines.push("Open TODOs:");
      for (const e of this.entries.filter((x) => x.kind === "todo")) {
        const loc = e.line ? `:${e.line}` : "";
        lines.push(`  ${e.file}${loc} — [${e.transform}] ${e.message}`);
      }
    }
    return lines.join("\n");
  }
}
