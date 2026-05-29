'use client';

import * as React from 'react';
import { FileText, Eye, CheckCircle2, XCircle, Clock, Download, Search } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@mcduffcare/ui/components/ui/card';
import { Badge } from '@mcduffcare/ui/components/ui/badge';
import { Button } from '@mcduffcare/ui/components/ui/button';
import { Input } from '@mcduffcare/ui/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@mcduffcare/ui/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@mcduffcare/ui/components/ui/dialog';
import { Separator } from '@mcduffcare/ui/components/ui/separator';
import { debounce } from '@mcduffcare/ui/lib/utils';
import Image from 'next/image';

// ── Local types (until Laravel adds prescription endpoint) ─────────────────────
type PrescriptionStatus = 'pending' | 'approved' | 'rejected' | 'expired';

interface Prescription {
  id: number;
  patient_name: string;
  patient_phone: string;
  doctor_name: string | null;
  file_url: string;
  file_type: 'image' | 'pdf';
  status: PrescriptionStatus;
  notes: string | null;
  uploaded_at: string;
  reviewed_at: string | null;
  reviewer_name: string | null;
  order_id: number | null;
}

// ── Mock data (replace with real API call when backend is ready) ───────────────
const MOCK_PRESCRIPTIONS: Prescription[] = [
  { id: 1, patient_name: 'Jane Doe', patient_phone: '0712345678', doctor_name: 'Dr. Kamau', file_url: '/prescriptions/rx-001.jpg', file_type: 'image', status: 'pending', notes: null, uploaded_at: new Date(Date.now() - 3600000).toISOString(), reviewed_at: null, reviewer_name: null, order_id: null },
  { id: 2, patient_name: 'John Mwangi', patient_phone: '0723456789', doctor_name: 'Dr. Otieno', file_url: '/prescriptions/rx-002.pdf', file_type: 'pdf', status: 'approved', notes: 'Valid. Dispensed Metformin 500mg x30.', uploaded_at: new Date(Date.now() - 86400000).toISOString(), reviewed_at: new Date(Date.now() - 72000000).toISOString(), reviewer_name: 'Pharm. Wanjiku', order_id: 1042 },
  { id: 3, patient_name: 'Mary Njeri', patient_phone: '0734567890', doctor_name: null, file_url: '/prescriptions/rx-003.jpg', file_type: 'image', status: 'rejected', notes: 'Prescription expired. Please get a fresh one.', uploaded_at: new Date(Date.now() - 172800000).toISOString(), reviewed_at: new Date(Date.now() - 150000000).toISOString(), reviewer_name: 'Pharm. Wanjiku', order_id: null },
  { id: 4, patient_name: 'Peter Ochieng', patient_phone: '0745678901', doctor_name: 'Dr. Gatheru', file_url: '/prescriptions/rx-004.pdf', file_type: 'pdf', status: 'pending', notes: null, uploaded_at: new Date(Date.now() - 7200000).toISOString(), reviewed_at: null, reviewer_name: null, order_id: null },
];

const STATUS_CONFIG: Record<PrescriptionStatus, { label: string; variant: 'warning' | 'success' | 'destructive' | 'secondary'; icon: React.ElementType }> = {
  pending:  { label: 'Pending Review', variant: 'warning',     icon: Clock         },
  approved: { label: 'Approved',       variant: 'success',     icon: CheckCircle2  },
  rejected: { label: 'Rejected',       variant: 'destructive', icon: XCircle       },
  expired:  { label: 'Expired',        variant: 'secondary',   icon: FileText      },
};

export default function AdminPrescriptionsPage(): React.JSX.Element {
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<PrescriptionStatus | 'all'>('all');
  const [selected, setSelected] = React.useState<Prescription | null>(null);
  const [reviewNotes, setReviewNotes] = React.useState('');

  // In production replace MOCK_PRESCRIPTIONS with a useQuery call to /admin/prescriptions
  const [prescriptions, setPrescriptions] = React.useState<Prescription[]>(MOCK_PRESCRIPTIONS);

  const debouncedSetSearch = React.useMemo(
    () => debounce((q: string) => setDebouncedSearch(q), 300),
    [],
  );

  const filtered = prescriptions.filter((rx) => {
    const matchesStatus = statusFilter === 'all' || rx.status === statusFilter;
    const matchesSearch =
      debouncedSearch === '' ||
      rx.patient_name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      rx.patient_phone.includes(debouncedSearch);
    return matchesStatus && matchesSearch;
  });

  const stats = {
    pending:  prescriptions.filter((r) => r.status === 'pending').length,
    approved: prescriptions.filter((r) => r.status === 'approved').length,
    rejected: prescriptions.filter((r) => r.status === 'rejected').length,
    total:    prescriptions.length,
  };

  const handleApprove = () => {
    if (selected === null) return;
    setPrescriptions((prev) =>
      prev.map((rx) =>
        rx.id === selected.id
          ? { ...rx, status: 'approved', notes: reviewNotes, reviewed_at: new Date().toISOString(), reviewer_name: 'Admin' }
          : rx,
      ),
    );
    setSelected(null);
    setReviewNotes('');
  };

  const handleReject = () => {
    if (selected === null) return;
    setPrescriptions((prev) =>
      prev.map((rx) =>
        rx.id === selected.id
          ? { ...rx, status: 'rejected', notes: reviewNotes, reviewed_at: new Date().toISOString(), reviewer_name: 'Admin' }
          : rx,
      ),
    );
    setSelected(null);
    setReviewNotes('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Prescriptions</h1>
          <p className="text-sm text-muted-foreground">Review and verify customer prescriptions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Uploaded',  value: stats.total,    color: 'text-brand-royal bg-brand-light-blue' },
          { label: 'Pending Review',  value: stats.pending,  color: 'text-amber-700 bg-amber-50' },
          { label: 'Approved',        value: stats.approved, color: 'text-emerald-700 bg-emerald-50' },
          { label: 'Rejected',        value: stats.rejected, color: 'text-red-700 bg-red-50' },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="flex flex-col p-5">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className={`mt-1 font-heading text-3xl font-bold ${color.split(' ')[0]}`}>{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center pb-4">
          <div>
            <CardTitle className="text-base">Prescription Queue</CardTitle>
            <CardDescription className="text-xs">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</CardDescription>
          </div>
          <div className="ml-auto flex flex-wrap gap-2">
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
              <SelectTrigger className="h-9 w-44 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="search"
              placeholder="Search patient name…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); debouncedSetSearch(e.target.value); }}
              leftElement={<Search className="h-4 w-4" />}
              className="h-9 w-56"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <FileText className="h-10 w-10 text-muted-foreground/30" />
              <p className="mt-2 text-sm text-muted-foreground">No prescriptions found</p>
            </div>
          ) : (
            <ul className="divide-y">
              {filtered.map((rx) => {
                const cfg = STATUS_CONFIG[rx.status];
                return (
                  <li key={rx.id} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors">
                    {/* Icon */}
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${rx.status === 'pending' ? 'bg-amber-50 text-amber-600' : rx.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      <FileText className="h-5 w-5" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-heading font-semibold text-sm">{rx.patient_name}</p>
                        <Badge variant={cfg.variant} className="text-xs">{cfg.label}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {rx.patient_phone}
                        {rx.doctor_name !== null && ` · Dr. ${rx.doctor_name}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Uploaded: {new Date(rx.uploaded_at).toLocaleString('en-KE')}
                        {rx.reviewed_at !== null && (
                          <> · Reviewed: {new Date(rx.reviewed_at).toLocaleString('en-KE')}</>
                        )}
                      </p>
                      {rx.notes !== null && (
                        <p className="mt-0.5 text-xs italic text-muted-foreground truncate max-w-xs">
                          Note: {rx.notes}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setSelected(rx); setReviewNotes(rx.notes ?? ''); }}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Review
                      </Button>
                      <Button variant="ghost" size="icon-sm" asChild>
                        <a href={rx.file_url} download target="_blank" rel="noopener noreferrer" aria-label="Download prescription">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Review dialog */}
      <Dialog open={selected !== null} onOpenChange={(o) => { if (!o) { setSelected(null); setReviewNotes(''); } }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Prescription #{selected?.id}</DialogTitle>
          </DialogHeader>

          {selected !== null && (
            <div className="space-y-4">
              {/* Patient info */}
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/40 p-4 text-sm">
                <div><p className="text-xs text-muted-foreground">Patient</p><p className="font-semibold">{selected.patient_name}</p></div>
                <div><p className="text-xs text-muted-foreground">Phone</p><p className="font-semibold">{selected.patient_phone}</p></div>
                {selected.doctor_name !== null && (
                  <div><p className="text-xs text-muted-foreground">Prescribing Doctor</p><p className="font-semibold">{selected.doctor_name}</p></div>
                )}
                <div><p className="text-xs text-muted-foreground">File Type</p><p className="font-semibold uppercase">{selected.file_type}</p></div>
              </div>

              {/* File preview */}
              <div className="rounded-xl border bg-muted/30 p-4">
                {selected.file_type === 'image' ? (
                  <Image src={selected.file_url} alt="Prescription" className="max-h-64 w-full object-contain rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 gap-3">
                    <FileText className="h-12 w-12 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">PDF Prescription</p>
                    <Button asChild variant="outline" size="sm">
                      <a href={selected.file_url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4" />
                        Open PDF
                      </a>
                    </Button>
                  </div>
                )}
              </div>

              {/* Pharmacist notes */}
              <div className="space-y-1.5">
                <label className="text-sm font-heading font-medium" htmlFor="rx-notes">
                  Pharmacist Notes
                </label>
                <textarea
                  id="rx-notes"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add verification notes, medication details dispensed, or reason for rejection…"
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                />
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex justify-between gap-3">
                <Button variant="outline" onClick={() => { setSelected(null); setReviewNotes(''); }}>
                  Close
                </Button>
                {selected.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={handleReject}
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                    <Button onClick={handleApprove} className="bg-emerald-600 hover:bg-emerald-700">
                      <CheckCircle2 className="h-4 w-4" />
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
