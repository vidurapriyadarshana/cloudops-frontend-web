'use client';

import React, { use, useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { FileUpload } from '@/components/ui/FileUpload';
import { api } from '@/lib/api';
import { Ticket, Comment } from '@/lib/types';

export default function TicketDetailPage({ params }: { params: Promise<{ ticketId: string }> }) {
  const { ticketId } = use(params);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  // New Comment Form
  const [newComment, setNewComment] = useState({
    senderType: 'AGENT',
    senderName: 'Support Engineer',
    message: '',
  });
  const [commentFiles, setCommentFiles] = useState<File[]>([]);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [t, c] = await Promise.all([
          api.getTicketById(ticketId),
          api.getCommentsByTicket(ticketId).catch(() => []),
        ]);
        setTicket(t);
        setComments(c);
      } catch (err) {
        console.error('Failed to load ticket details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [ticketId]);

  const handleStatusChange = async (newStatus: string) => {
    if (!ticket) return;
    try {
      const updated = await api.updateTicket(ticket.id, {
        status: newStatus as any,
        performedBy: 'Support Ops Agent',
      });
      setTicket(updated);
    } catch (err) {
      alert('Failed to update ticket status');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket || !newComment.message.trim()) return;
    setSubmittingComment(true);

    try {
      const added = await api.addComment(ticket.id, newComment, commentFiles);
      setComments((prev) => [...prev, added]);
      setNewComment({ ...newComment, message: '' });
      setCommentFiles([]);
      // Reload ticket to refresh timeline
      const refreshed = await api.getTicketById(ticket.id);
      setTicket(refreshed);
    } catch (err) {
      alert('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-xs text-gray-500">Loading ticket thread...</div>;
  if (!ticket) return <div className="p-8 text-center text-xs text-rose-400">Ticket not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Header
        title={`Ticket: ${ticket.ticketNumber}`}
        description={ticket.subject}
        actionButton={
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400 font-semibold mr-1">Status:</span>
            <select
              value={ticket.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-gray-900 border border-gray-700 text-xs text-white rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-blue-500"
            >
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="PENDING_CLIENT">PENDING_CLIENT</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
        }
      />

      {/* Ticket Info Card */}
      <div className="glass-panel p-8 rounded-2xl border border-gray-800 space-y-6 text-xs">
        <div className="flex flex-wrap gap-4 justify-between items-center border-b border-gray-800 pb-4">
          <div className="flex items-center space-x-3">
            <PriorityBadge priority={ticket.priority} />
            <StatusBadge status={ticket.status} />
          </div>
          <div className="text-gray-400">
            <span>SLA Target: </span>
            <span className="text-amber-400 font-bold">⏱ {ticket.slaTargetHours} Hours SLA</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white mb-2">Description</h3>
          <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">
            {ticket.description}
          </div>
        </div>

        {/* Attachments */}
        {ticket.attachments && ticket.attachments.length > 0 && (
          <div className="pt-2">
            <h4 className="text-xs font-bold text-white mb-2">GCS Ticket Attachments ({ticket.attachments.length})</h4>
            <div className="flex flex-wrap gap-3">
              {ticket.attachments.map((att, i) => (
                <a
                  key={i}
                  href={att.gcsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 rounded-xl bg-gray-900 border border-gray-800 hover:border-blue-500/50 text-blue-400 font-mono text-[11px] inline-flex items-center space-x-1.5"
                >
                  <span>📎</span>
                  <span>{att.fileName}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Two Column Layout: Comments Thread & Timeline Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Comments Thread */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>💬 Comments Thread ({comments.length})</span>
            </h3>

            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-xs text-gray-500">No comments posted yet.</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 space-y-2 text-xs">
                    <div className="flex justify-between items-center text-gray-400">
                      <span className="font-semibold text-blue-400">
                        {c.senderName} ({c.senderType})
                      </span>
                      <span className="text-[10px]">{new Date(c.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-200 whitespace-pre-wrap">{c.message}</p>
                    {c.attachments && c.attachments.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-2">
                        {c.attachments.map((a, idx) => (
                          <a
                            key={idx}
                            href={a.gcsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-blue-400 underline font-mono"
                          >
                            📎 {a.fileName}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="pt-4 border-t border-gray-800 space-y-3 text-xs">
              <textarea
                rows={3}
                required
                placeholder="Write a response or update..."
                value={newComment.message}
                onChange={(e) => setNewComment({ ...newComment, message: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
              />
              <FileUpload
                label="Attach Screenshot / Files"
                multiple
                onFilesSelected={(f) => setCommentFiles(f)}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingComment}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                  {submittingComment ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Timeline Audit Log */}
        <div>
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>📜 Audit Timeline</span>
            </h3>

            {ticket.timeline && ticket.timeline.length > 0 ? (
              <div className="space-y-3 relative pl-4 border-l border-gray-800">
                {ticket.timeline.map((entry, idx) => (
                  <div key={idx} className="relative space-y-0.5">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-gray-900" />
                    <span className="font-bold text-gray-200 block">{entry.action}</span>
                    <span className="text-gray-400 text-[10px] block">By {entry.performedBy}</span>
                    {entry.details && <p className="text-gray-400 text-[11px]">{entry.details}</p>}
                    <span className="text-[10px] text-gray-500 block">{new Date(entry.timestamp).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No audit log entries recorded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
