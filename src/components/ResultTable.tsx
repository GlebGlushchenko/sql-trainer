import type { Cell, ResultSet } from '../db/engine';

function formatCell(cell: Cell) {
  if (cell === null) return <span className="null">NULL</span>;
  if (cell instanceof Uint8Array) return <span className="null">[BLOB]</span>;
  if (typeof cell === 'number' && !Number.isInteger(cell)) return String(Math.round(cell * 10000) / 10000);
  return String(cell);
}

export function ResultTable({ result, limit = 500 }: { result: ResultSet | null; limit?: number }) {
  if (!result) return <div className="muted pad">Пустой результат</div>;
  const rows = result.rows.slice(0, limit);
  return (
    <div className="result-wrap">
      <table className="result">
        <thead>
          <tr>
            <th className="rownum">#</th>
            {result.columns.map((c, i) => (
              <th key={i}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td className="rownum">{i + 1}</td>
              {row.map((cell, j) => (
                <td key={j} className={typeof cell === 'number' ? 'num' : undefined}>
                  {formatCell(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {result.rows.length > limit && <div className="muted pad">Показаны первые {limit} из {result.rows.length} строк</div>}
    </div>
  );
}
