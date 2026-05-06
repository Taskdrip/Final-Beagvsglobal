'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Eye, CheckCircle, XCircle, DollarSign, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface Payment {
  id: string;
  userId: string;
  username: string;
  userEmail: string;
  type: 'verification' | 'listing' | 'task';
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected';
  paymentProof: string;
  transactionHash: string;
  description: string;
  createdAt: string;
}

export function PaymentManagement() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = () => {
    if (typeof window !== 'undefined') {
      try {
        const allPayments = JSON.parse(localStorage.getItem('payment_requests') || '[]');
        setPayments(allPayments);
        console.log('[v0] Loaded payments:', allPayments);
      } catch (error) {
        console.error('[v0] Error loading payments:', error);
        setPayments([]);
      }
    }
  };

  const handleApprove = (paymentId: string) => {
    if (typeof window !== 'undefined') {
      const allPayments = JSON.parse(localStorage.getItem('payment_requests') || '[]');
      const payment = allPayments.find((p: Payment) => p.id === paymentId);

      if (!payment) return;

      // Update payment status
      const updated = allPayments.map((p: Payment) =>
        p.id === paymentId ? { ...p, status: 'approved', approvedAt: new Date().toISOString() } : p
      );
      localStorage.setItem('payment_requests', JSON.stringify(updated));

      // Process based on payment type
      if (payment.type === 'verification') {
        const users = JSON.parse(localStorage.getItem('beagvs_users') || '[]');
        const updatedUsers = users.map((u: any) =>
          u.id === payment.userId ? { ...u, verified: true, verificationApprovedAt: new Date().toISOString() } : u
        );
        localStorage.setItem('beagvs_users', JSON.stringify(updatedUsers));
        localStorage.setItem('beagvs_backup_beagvs_users', JSON.stringify(updatedUsers));
      }

      setPayments(updated);
      setSelectedPayment(null);
      setShowPreview(false);
      toast.success(`Payment approved for ${payment.username}`);
    }
  };

  const handleReject = (paymentId: string) => {
    if (typeof window !== 'undefined') {
      const allPayments = JSON.parse(localStorage.getItem('payment_requests') || '[]');
      const updated = allPayments.map((p: Payment) =>
        p.id === paymentId ? { ...p, status: 'rejected', rejectedAt: new Date().toISOString() } : p
      );
      localStorage.setItem('payment_requests', JSON.stringify(updated));
      setPayments(updated);
      setSelectedPayment(null);
      setShowPreview(false);
      toast.success('Payment rejected');
    }
  };

  const filteredPayments = filterStatus === 'all' 
    ? payments 
    : payments.filter(p => p.status === filterStatus);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'verification':
        return 'Account Verification';
      case 'listing':
        return 'Listing';
      case 'task':
        return 'Task Submission';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Payment Management</h2>
        <p className="text-muted-foreground">Manage and approve user payments</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
          <Button
            key={status}
            variant={filterStatus === status ? 'default' : 'outline'}
            onClick={() => setFilterStatus(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Requests</CardTitle>
          <CardDescription>{filteredPayments.length} {filterStatus} payment(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">User</th>
                  <th className="text-left py-3 px-4 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map(payment => (
                  <tr key={payment.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{payment.username}</p>
                        <p className="text-xs text-muted-foreground">{payment.userEmail}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">{getTypeLabel(payment.type)}</td>
                    <td className="py-3 px-4 font-semibold">{payment.currency} {payment.amount}</td>
                    <td className="py-3 px-4">{getStatusBadge(payment.status)}</td>
                    <td className="py-3 px-4 text-xs">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowPreview(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredPayments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No {filterStatus === 'all' ? '' : filterStatus} payments
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              {/* User Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="font-semibold">{selectedPayment.username}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold">{selectedPayment.userEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-semibold">{getTypeLabel(selectedPayment.type)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-semibold">{selectedPayment.currency} {selectedPayment.amount}</p>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="space-y-3 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Transaction Hash</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-background p-2 rounded flex-1 break-all">
                      {selectedPayment.transactionHash}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedPayment.transactionHash);
                        toast.success('Copied!');
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Description</p>
                  <p className="text-sm">{selectedPayment.description}</p>
                </div>
              </div>

              {/* Payment Proof */}
              {selectedPayment.paymentProof && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-semibold">Payment Proof</p>
                  <div className="border rounded-lg overflow-hidden max-w-sm cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(selectedPayment.paymentProof, '_blank')}
                  >
                    <img
                      src={selectedPayment.paymentProof || "/placeholder.svg"}
                      alt="Payment proof"
                      className="w-full h-auto"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Click to view full size</p>
                </div>
              )}

              {/* Action Buttons */}
              {selectedPayment.status === 'pending' && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    onClick={() => handleReject(selectedPayment.id)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleApprove(selectedPayment.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </div>
              )}
              {selectedPayment.status !== 'pending' && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-center text-muted-foreground">
                    This payment has been {selectedPayment.status}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
