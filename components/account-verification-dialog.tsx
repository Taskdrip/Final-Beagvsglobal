'use client';

import React from "react"

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgeCheck, Copy, CheckCircle, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface AccountVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  username: string;
  userEmail: string;
}

export function AccountVerificationDialog({ 
  open, 
  onOpenChange, 
  userId, 
  username, 
  userEmail 
}: AccountVerificationDialogProps) {
  const [transactionHash, setTransactionHash] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const ADMIN_WALLET = 'GDR7XQKP9XWJF8ZMHVQP4KXNR2YMTS3L';
  const VERIFICATION_FEE = 50; // Can be in USD or crypto
  const CURRENCY = 'USD'; // Admin can change this

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(ADMIN_WALLET);
    toast.success('Wallet/Payment address copied!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File too large (max 5MB)');
        return;
      }
      setPaymentProof(file);
    }
  };

  const handleSubmit = async () => {
    if (!transactionHash.trim()) {
      toast.error('Please enter transaction reference/hash');
      return;
    }
    if (!paymentProof) {
      toast.error('Please upload payment proof');
      return;
    }
    if (!paymentConfirmed) {
      toast.error('Please confirm payment');
      return;
    }

    setSubmitting(true);

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(paymentProof);
      reader.onloadend = () => {
        const proofUrl = reader.result as string;

        // Create payment request for admin review
        const paymentRequest = {
          id: `payment_verification_${Date.now()}`,
          userId,
          username,
          userEmail,
          type: 'verification',
          amount: VERIFICATION_FEE,
          currency: CURRENCY,
          transactionHash,
          paymentProof: proofUrl,
          description: `Account Verification for @${username}`,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };

        // Save to payment requests
        const existingPayments = JSON.parse(localStorage.getItem('payment_requests') || '[]');
        existingPayments.push(paymentRequest);
        localStorage.setItem('payment_requests', JSON.stringify(existingPayments));
        
        // Force backup
        localStorage.setItem('beagvs_backup_payment_requests', JSON.stringify(existingPayments));

        console.log('[v0] Payment request submitted:', paymentRequest);
        
        toast.success('Payment submitted for admin review! You will be notified once approved.');
        
        // Reset form
        setTransactionHash('');
        setPaymentProof(null);
        setPaymentConfirmed(false);
        onOpenChange(false);
      };
    } catch (error) {
      console.error('[v0] Error submitting payment:', error);
      toast.error('Failed to submit payment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BadgeCheck className="h-6 w-6 text-blue-500" />
            Account Verification
          </DialogTitle>
          <DialogDescription>
            Verify your account and unlock premium features
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Verification Fee Card */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                Verification Fee
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {CURRENCY} {VERIFICATION_FEE}
              </div>
              <p className="text-sm text-muted-foreground">
                One-time payment to verify your Beagvs account and access all premium features
              </p>
            </CardContent>
          </Card>

          {/* Payment Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">1</div>
                  <div>
                    <p className="font-semibold text-sm">Send Payment</p>
                    <p className="text-sm text-muted-foreground">Send {CURRENCY} {VERIFICATION_FEE} to the admin wallet/payment address below</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">2</div>
                  <div>
                    <p className="font-semibold text-sm">Copy Transaction Reference</p>
                    <p className="text-sm text-muted-foreground">Note the transaction hash or reference number</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">3</div>
                  <div>
                    <p className="font-semibold text-sm">Upload Proof</p>
                    <p className="text-sm text-muted-foreground">Take a screenshot of the payment confirmation</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">4</div>
                  <div>
                    <p className="font-semibold text-sm">Submit for Review</p>
                    <p className="text-sm text-muted-foreground">Our admin team will review and approve within 24 hours</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <div className="space-y-4 p-4 bg-muted rounded-lg border">
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Admin Wallet/Payment Address</Label>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-background p-3 rounded flex-1 break-all border">
                  {ADMIN_WALLET}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyWallet}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Transaction Hash */}
            <div className="space-y-2">
              <Label htmlFor="tx-hash">Transaction Reference/Hash</Label>
              <Input
                id="tx-hash"
                placeholder="e.g., 0x7f4c...9a2b or TXN123456789"
                value={transactionHash}
                onChange={(e) => setTransactionHash(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Paste the transaction ID or reference from your payment
              </p>
            </div>

            {/* Payment Proof */}
            <div className="space-y-2">
              <Label htmlFor="payment-proof">Payment Proof Screenshot</Label>
              <Input
                id="payment-proof"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                required
              />
              {paymentProof && (
                <div className="relative rounded-lg overflow-hidden border max-w-sm">
                  <img 
                    src={URL.createObjectURL(paymentProof)} 
                    alt="Preview" 
                    className="w-full h-auto"
                  />
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Upload a screenshot showing the payment confirmation (max 5MB)
              </p>
            </div>

            {/* Confirmation Checkbox */}
            <div className="flex items-start space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Checkbox
                id="confirm-payment"
                checked={paymentConfirmed}
                onCheckedChange={(checked) => setPaymentConfirmed(checked as boolean)}
              />
              <Label htmlFor="confirm-payment" className="text-sm font-medium cursor-pointer">
                I confirm that I have sent {CURRENCY} {VERIFICATION_FEE} to the admin wallet address and provided accurate payment proof
              </Label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={submitting || !transactionHash.trim() || !paymentProof || !paymentConfirmed}
              className="flex-1"
            >
              {submitting ? 'Submitting...' : 'Submit for Admin Review'}
            </Button>
          </div>

          {/* Info Message */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-900">
              💡 Your payment will be reviewed by our admin team. Once approved, your account will be verified immediately.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

          amount: VERIFICATION_FEE_PI,
          status: 'pending',
          submittedAt: new Date().toISOString(),
          type: 'verification'
        };

        // Save to localStorage
        const existingRequests = JSON.parse(localStorage.getItem('verification_requests') || '[]');
        existingRequests.push(verificationRequest);
        localStorage.setItem('verification_requests', JSON.stringify(existingRequests));

        // Backup
        localStorage.setItem('beagvs_backup_verification_requests', JSON.stringify(existingRequests));

        // Also add to task_submissions for admin review
        const taskSubmissions = JSON.parse(localStorage.getItem('task_submissions') || '[]');
        taskSubmissions.push({
          ...verificationRequest,
          taskTitle: 'Account Verification Request',
        });
        localStorage.setItem('task_submissions', JSON.stringify(taskSubmissions));

        toast.success('Verification request submitted! Admin will review shortly.');
        
        // Reset form
        setTransactionHash('');
        setPaymentProof(null);
        setPaymentConfirmed(false);
        setSubmitting(false);
        onOpenChange(false);
      };
    } catch (error) {
      console.error('[v0] Error submitting verification:', error);
      toast.error('Failed to submit verification request');
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BadgeCheck className="h-5 w-5 text-primary" />
            Account Verification
          </DialogTitle>
          <DialogDescription>
            Get your account verified with a blue checkmark badge
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Verification Fee */}
          <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
            <h4 className="font-semibold mb-2">Verification Fee</h4>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{VERIFICATION_FEE_PI} π</span>
              <span className="text-muted-foreground">or ${VERIFICATION_FEE_USD} USD equivalent</span>
            </div>
          </div>

          {/* Admin Wallet */}
          <div className="space-y-2">
            <Label>Admin Pi Wallet Address</Label>
            <div className="flex gap-2">
              <Input 
                value={ADMIN_WALLET} 
                readOnly 
                className="font-mono text-xs"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCopyWallet}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Transaction Hash */}
          <div className="space-y-2">
            <Label htmlFor="tx-hash">Transaction Hash *</Label>
            <Input
              id="tx-hash"
              placeholder="Enter your Pi payment transaction hash"
              value={transactionHash}
              onChange={(e) => setTransactionHash(e.target.value)}
              disabled={submitting}
            />
          </div>

          {/* Payment Proof */}
          <div className="space-y-2">
            <Label htmlFor="payment-proof">Payment Proof Screenshot *</Label>
            <Input
              id="payment-proof"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={submitting}
            />
            {paymentProof && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                {paymentProof.name}
              </p>
            )}
          </div>

          {/* Confirmation Checkbox */}
          <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
            <Checkbox
              id="confirm-payment"
              checked={paymentConfirmed}
              onCheckedChange={(checked) => setPaymentConfirmed(checked as boolean)}
              disabled={submitting}
            />
            <label 
              htmlFor="confirm-payment" 
              className="text-sm cursor-pointer"
            >
              I confirm that I have sent {VERIFICATION_FEE_PI} π to the admin wallet address and the transaction hash is correct.
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={submitting || !transactionHash || !paymentProof || !paymentConfirmed}
            >
              {submitting ? 'Submitting...' : 'Submit for Review'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
