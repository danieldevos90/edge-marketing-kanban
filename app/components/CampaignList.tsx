export type CampaignEmail = {
  id: string;
  subject?: string;
  to: string[] | string;
  from: string;
  status?: string;
  created_at?: string;
};

function formatTo(to: string[] | string): string {
  return Array.isArray(to) ? to.join(', ') : to;
}

export function CampaignList({ emails }: { emails: CampaignEmail[] }) {
  if (!emails.length) {
    return <div className="text-[#a3a3a3]">No emails found.</div>;
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-[#1f2937]">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-black/40 text-[#a3a3a3]">
          <tr>
            <th className="px-4 py-2">Subject</th>
            <th className="px-4 py-2">To</th>
            <th className="px-4 py-2">From</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Created</th>
          </tr>
        </thead>
        <tbody>
          {emails.map((e) => (
            <tr key={e.id} className="border-t border-[#1f2937] hover:bg-black/30">
              <td className="px-4 py-2 text-[#e6e6e6]">{e.subject || '(no subject)'}</td>
              <td className="px-4 py-2 text-[#e6e6e6]">{formatTo(e.to)}</td>
              <td className="px-4 py-2 text-[#e6e6e6]">{e.from}</td>
              <td className="px-4 py-2 text-[#a3a3a3]">{e.status || '-'}</td>
              <td className="px-4 py-2 text-[#a3a3a3]">{e.created_at ? new Date(e.created_at).toLocaleString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
