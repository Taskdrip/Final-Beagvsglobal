'use client';

import React from "react"

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  walletType: 'main' | 'escrow';
  title: string;
  description?: string;
  onSuccess: () => void;
}

export function CheckoutDialog({
  open,
  onOpenChange,
  amount,
  walletType,
  title,
  description,
  onSuccess
}: CheckoutDialogProps) {
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);

  // Admin wallet addresses (these would come from admin settings in production)
  const walletAddresses = {
    main: 'GBEAGVS-MAIN-WALLET-ADDRESS-1234567890',
    escrow: 'GBEAGVS-ESCROW-WALLET-ADDRESS-0987654321'
  };

  useEffect(() => {
    if (open && !paymentSubmitted) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            toast.error('Payment time expired');
            onOpenChange(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [open, paymentSubmitted, onOpenChange]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setPaymentProof(file);
      toast.success('Payment proof uploaded');
    }
  };

  const handleSubmit = () => {
    if (!paymentProof) {
      toast.error('Please upload payment proof');
      return;
    }

    setPaymentSubmitted(true);
    setTimeout(() => {
      toast.success('Payment submitted successfully! Awaiting confirmation.');
      onSuccess();
      onOpenChange(false);
      // Reset state
      setPaymentProof(null);
      setPaymentSubmitted(false);
      setTimeRemaining(30 * 60);
    }, 1500);
  };

  const handleClose = () => {
    if (!paymentSubmitted) {
      setPaymentProof(null);
      setTimeRemaining(30 * 60);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="space-y-6">
          {/* Timer */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="font-medium">Time Remaining</span>
                </div>
                <Badge variant="default" className="text-lg px-4 py-1">
                  {formatTime(timeRemaining)}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Complete payment within 30 minutes to avoid expiration
              </p>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">Payment Amount</Label>
              <div className="mt-2 p-4 bg-muted rounded-lg">
                <p className="text-3xl font-bold">{amount} Pi</p>
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold mb-2 flex items-center gap-2">
                {walletType === 'escrow' ? 'Escrow Wallet Address' : 'Main Wallet Address'}
                <Badge variant={walletType === 'escrow' ? 'default' : 'secondary'}>
                  {walletType === 'escrow' ? 'Protected' : 'Direct'}
                </Badge>
              </Label>
              <div className="mt-2 p-3 bg-muted rounded-lg font-mono text-sm break-all">
                {walletAddresses[walletType]}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 bg-transparent"
                onClick={() => {
                  navigator.clipboard.writeText(walletAddresses[walletType]);
                  toast.success('Wallet address copied');
                }}
              >
                Copy Address
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-3">Payment Instructions</h4>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li>1. Send exactly <strong className="text-foreground">{amount} Pi</strong> to the wallet address above</li>
                <li>2. Take a screenshot of the successful transaction</li>
                <li>3. Upload the screenshot as payment proof below</li>
                <li>4. Click Submit to complete your order</li>
              </ol>
              {walletType === 'escrow' && (
                <p className="mt-3 text-xs bg-primary/10 p-3 rounded-lg">
                  <strong>Escrow Protection:</strong> Your payment will be held securely until delivery is confirmed. This protects both buyer and seller.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Upload Payment Proof */}
          <div>
            <Label htmlFor="payment-proof" className="text-base font-semibold">
              Upload Payment Proof *
            </Label>
            <div className="mt-2">
              <label
                htmlFor="payment-proof"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {paymentProof ? (
                    <>
                      <CheckCircle className="h-10 w-10 text-green-500 mb-2" />
                      <p className="text-sm font-medium">{paymentProof.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(paymentProof.size / 1024).toFixed(2)} KB
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG or PDF (max 5MB)
                      </p>
                    </>
                  )}
                </div>
                <Input
                  id="payment-proof"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={paymentSubmitted}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!paymentProof || paymentSubmitted}>
            {paymentSubmitted ? 'Submitting...' : 'Submit Payment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
