export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms & Conditions</h1>
      
      <div className="space-y-8 text-muted-foreground">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
          <p className="leading-relaxed">
            By accessing and using Beagvs, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">2. User Accounts</h2>
          <p className="leading-relaxed mb-4">
            To use Beagvs, you must create an account using Pi Network authentication. You are responsible for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Maintaining the security of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Providing accurate and complete information</li>
            <li>Notifying us immediately of any unauthorized access</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">3. Buying and Selling</h2>
          <p className="leading-relaxed mb-4">
            <strong className="text-foreground">Sellers agree to:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Provide accurate descriptions and images of items</li>
            <li>Honor all sales and ship items promptly</li>
            <li>Respond to buyer inquiries in a timely manner</li>
            <li>Comply with all applicable laws and regulations</li>
          </ul>
          <p className="leading-relaxed mb-4">
            <strong className="text-foreground">Buyers agree to:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Pay for items in full using Pi Network</li>
            <li>Confirm delivery upon receipt of items</li>
            <li>Communicate issues through proper channels</li>
            <li>Not abuse the dispute resolution system</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">4. Escrow and Payments</h2>
          <p className="leading-relaxed mb-4">
            All transactions are processed through our secure escrow system:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Buyer payments are held in escrow until delivery confirmation</li>
            <li>Sellers receive payment after successful delivery</li>
            <li>Platform fees are deducted from escrow before release</li>
            <li>Disputed payments are held until resolution</li>
            <li>Refunds are processed according to our refund policy</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">5. Shipping and Delivery</h2>
          <p className="leading-relaxed">
            Sellers must ship items using agreed-upon delivery methods and provide tracking information. Buyers must confirm delivery within 7 days of receipt. Failure to confirm may result in automatic escrow release.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">6. Disputes and Resolution</h2>
          <p className="leading-relaxed mb-4">
            If issues arise with a transaction:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Contact the other party first to resolve the issue</li>
            <li>Open a dispute through the platform if unresolved</li>
            <li>Provide evidence and documentation</li>
            <li>Admin team will review and make a final decision</li>
            <li>Admin decisions are binding and final</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">7. Prohibited Activities</h2>
          <p className="leading-relaxed mb-4">
            Users may not:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>List illegal, counterfeit, or stolen items</li>
            <li>Engage in fraudulent activities or scams</li>
            <li>Manipulate prices or engage in price fixing</li>
            <li>Create multiple accounts to circumvent restrictions</li>
            <li>Harass, threaten, or abuse other users</li>
            <li>Attempt to bypass escrow or payment systems</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">8. Fees and Featured Listings</h2>
          <p className="leading-relaxed">
            Basic listings are free. Featured listings require payment in Pi Network and provide enhanced visibility. Platform fees apply to all completed transactions. Fee amounts are displayed before listing or purchasing.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">9. Intellectual Property</h2>
          <p className="leading-relaxed">
            Beagvs and its original content, features, and functionality are owned by Beagvs and are protected by international copyright, trademark, and other intellectual property laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">10. Limitation of Liability</h2>
          <p className="leading-relaxed">
            Beagvs provides a platform for transactions but is not a party to agreements between buyers and sellers. We are not liable for item quality, delivery issues, or user conduct. Our liability is limited to the maximum extent permitted by law.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">11. Account Termination</h2>
          <p className="leading-relaxed">
            We reserve the right to suspend or terminate accounts that violate these terms, engage in prohibited activities, or pose a risk to the platform or other users.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">12. Changes to Terms</h2>
          <p className="leading-relaxed">
            We may modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the modified terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">13. Contact Information</h2>
          <p className="leading-relaxed">
            For questions about these terms, contact us at legal@beagvs.com.
          </p>
        </section>

        <div className="pt-8 border-t">
          <p className="text-sm">Last Updated: January 2024</p>
        </div>
      </div>
    </div>
  );
}
